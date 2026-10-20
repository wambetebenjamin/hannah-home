import { kv } from "@vercel/kv";
import { getService, packageIds, slots } from "./catalog";
import { isDemo, hasKV } from "./runtime";
import { HttpError, hash } from "./security";
import { randomBytes } from "node:crypto";
import { slotIsFuture } from "./validation";
import type { BookingInput } from "./validation";
import type { Booking } from "./types";
const root = globalThis as typeof globalThis & { hhBookings?: Map<string, Booking>; hhIdempotency?: Map<string, string> };
const TTL = 90 * 86400;
const ownerKey = (email: string) => `hh:owner:${hash(email.trim().toLowerCase())}`;
function memory() {
  const data = root.hhBookings ||= new Map<string, Booking>();
  for (const [key, b] of data) if (Date.parse(`${b.date}T23:59:59+03:00`) < Date.now() - TTL * 1000) data.delete(key);
  return data;
}
function requireStorage() { if (!isDemo() && !hasKV()) throw new HttpError(503, "Booking storage is not configured. Please contact us on WhatsApp."); }
export async function getBooking(ref: string): Promise<Booking | null> { requireStorage(); return isDemo() ? memory().get(ref) || null : kv.get<Booking>(`hh:booking:${ref}`); }
export async function getBookings(email: string): Promise<Booking[]> {
  requireStorage();
  if (isDemo()) return [...memory().values()].filter(b => b.ownerEmail === email);
  const refs = await kv.smembers<string[]>(ownerKey(email)); if (!refs.length) return [];
  return (await kv.mget<(Booking | null)[]>(...refs.map(ref => `hh:booking:${ref}`))).filter((b): b is Booking => !!b);
}
export async function availability(serviceId: string, date: string) {
  requireStorage();
  return Promise.all(slots.map(async time => {
    const count = isDemo() ? [...memory().values()].filter(b => b.serviceId === serviceId && b.date === date && b.time === time && b.status !== "cancelled").length : Number(await kv.get(`hh:slot:${serviceId}:${date}:${time}`) || 0);
    return { time, available: count < 2 && slotIsFuture(date, time) };
  }));
}
export async function createBooking(input: BookingInput, idempotencyKey: string, ownerEmail: string | null) {
  requireStorage();
  const service = getService(input.serviceId)!; const index = packageIds.indexOf(input.packageId);
  const idKey = `hh:idempotency:${hash(idempotencyKey + ":" + (ownerEmail || input.email))}`;
  const booking: Booking = { ...input, reference: `HH-${randomBytes(6).toString("hex").toUpperCase()}`, ownerEmail, price: service.prices[index], duration: service.hours[index], status: "pending", professional: null, createdAt: new Date().toISOString(), demo: isDemo() };
  if (isDemo()) {
    const ids = root.hhIdempotency ||= new Map<string, string>();
    if (ids.has(idKey)) { const previous = memory().get(ids.get(idKey)!); if (previous) return previous; ids.delete(idKey); }
    // Synchronous check and insert are atomic in the single-process local preview.
    const count = [...memory().values()].filter(b => b.serviceId === input.serviceId && b.date === input.date && b.time === input.time && b.status !== "cancelled").length;
    if (count >= 2) throw new HttpError(409, "That time has just filled up. Please choose another slot.", "SLOT_TAKEN");
    memory().set(booking.reference, booking); ids.set(idKey, booking.reference);
    if (ids.size > 2000) ids.delete(ids.keys().next().value!);
    return booking;
  }
  const retention = Math.max(TTL, Math.ceil((Date.parse(`${input.date}T23:59:59+03:00`) - Date.now()) / 1000) + TTL);
  const result = await kv.eval<(string | number)[], string>(`
    local previous = redis.call('GET', KEYS[1]); if previous then return previous end
    local count = tonumber(redis.call('GET', KEYS[2]) or '0'); if count >= 2 then return 'FULL' end
    redis.call('INCR', KEYS[2]); redis.call('EXPIRE', KEYS[2], ARGV[3])
    redis.call('SET', KEYS[3], ARGV[1], 'EX', ARGV[3]); redis.call('SET', KEYS[1], ARGV[2], 'EX', ARGV[3])
    if ARGV[4] == '1' then redis.call('SADD', KEYS[4], ARGV[2]); local oldttl = redis.call('TTL', KEYS[4]); if oldttl < tonumber(ARGV[3]) then redis.call('EXPIRE', KEYS[4], ARGV[3]) end end
    return ARGV[2]
  `, [idKey, `hh:slot:${input.serviceId}:${input.date}:${input.time}`, `hh:booking:${booking.reference}`, ownerKey(ownerEmail || "guest")], [JSON.stringify(booking), booking.reference, retention, ownerEmail ? "1" : "0"]);
  if (result === "FULL") throw new HttpError(409, "That time has just filled up. Please choose another slot.", "SLOT_TAKEN");
  return result === booking.reference ? booking : (await getBooking(result))!;
}
export async function saveReview(ref: string, email: string, rating: number, comment: string) {
  const booking = await getBooking(ref);
  if (!booking || booking.ownerEmail !== email) throw new HttpError(404, "Booking not found.");
  if (booking.status !== "completed") throw new HttpError(409, "You can review a job after it has been completed.");
  if (booking.review) throw new HttpError(409, "You have already reviewed this job.");
  const review = { rating, comment, createdAt: new Date().toISOString() };
  if (isDemo()) { memory().set(ref, { ...booking, review }); return review; }
  const result = await kv.eval<string[], number>(`
    local raw = redis.call('GET', KEYS[1]); if not raw then return 0 end
    local b = cjson.decode(raw)
    if b.ownerEmail ~= ARGV[1] or b.status ~= 'completed' or b.review then return 0 end
    b.review = cjson.decode(ARGV[2]); redis.call('SET', KEYS[1], cjson.encode(b), 'KEEPTTL'); return 1
  `, [`hh:booking:${ref}`], [email, JSON.stringify(review)]);
  if (result !== 1) throw new HttpError(409, "This review could not be saved. It may already exist.");
  return review;
}
export function seedDemo(email: string) {
  if (!isDemo() || [...memory().values()].some(b => b.ownerEmail === email)) return;
  memory().set("HH-DE0000000001", {
    reference: "HH-DE0000000001", ownerEmail: email, serviceId: "house-cleaning", packageId: "2-bedroom", date: new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10), time: "10:00",
    area: "Kilimani", address: "Preview apartment, Example Road", instructions: "", name: "Preview Guest", phone: "0712345678", email,
    payment: "mpesa", consent: true, price: 3500, duration: 3, status: "completed", professional: "Grace Wanjiku (sample)", createdAt: new Date().toISOString(), demo: true,
  });
}
