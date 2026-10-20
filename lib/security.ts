import { createHmac, randomBytes, timingSafeEqual, createHash } from "node:crypto";
import { kv } from "@vercel/kv";
import type { NextRequest } from "next/server";
import { hasKV, isDemo } from "./runtime";
export class HttpError extends Error { constructor(public status: number, message: string, public code?: string) { super(message); } }
const state = globalThis as typeof globalThis & { hhSecret?: string; hhLimits?: Map<string, { count: number; reset: number }>; hhNonces?: Map<string, number> };
function secret() {
  if (process.env.NEXTAUTH_SECRET && (isDemo() || process.env.NEXTAUTH_SECRET.length >= 32)) return process.env.NEXTAUTH_SECRET;
  if (!isDemo()) throw new HttpError(503, "Secure services are not configured yet.");
  return state.hhSecret ||= randomBytes(32).toString("hex");
}
export const hash = (v: string) => createHash("sha256").update(v).digest("hex");
export function signTicket(data: Record<string, unknown>, seconds = 300) {
  const payload = Buffer.from(JSON.stringify({ ...data, exp: Date.now() + seconds * 1000, nonce: randomBytes(16).toString("hex") })).toString("base64url");
  return `${payload}.${createHmac("sha256", secret()).update(payload).digest("base64url")}`;
}
export function readTicket<T extends Record<string, unknown>>(token: string | undefined, purpose: string): (T & { exp: number; nonce: string }) | null {
  if (!token || token.length > 4096) return null;
  try {
    const [payload, signature, extra] = token.split("."); if (!payload || !signature || extra) return null;
    const actual = Buffer.from(signature, "base64url"); const expected = createHmac("sha256", secret()).update(payload).digest();
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
    const result = JSON.parse(Buffer.from(payload, "base64url").toString());
    return result.purpose === purpose && result.exp > Date.now() ? result : null;
  } catch { return null; }
}
export async function consumeTicket(token: string, purpose: string) {
  const data = readTicket(token, purpose);
  if (!data) throw new HttpError(403, "Verification expired. Please try again.", "CAPTCHA_EXPIRED");
  if (isDemo()) {
    const nonces = state.hhNonces ||= new Map();
    for (const [key, exp] of nonces) if (exp < Date.now()) nonces.delete(key);
    if (nonces.has(data.nonce)) throw new HttpError(403, "Verification already used. Please try again.");
    nonces.set(data.nonce, data.exp);
  } else {
    if (!hasKV()) throw new HttpError(503, "Verification storage is not configured.");
    if (!await kv.set(`hh:nonce:${data.nonce}`, "1", { nx: true, ex: 300 })) throw new HttpError(403, "Verification already used. Please try again.");
  }
  return data;
}
export function assertOrigin(req: NextRequest) {
  const origin = req.headers.get("origin"); const expected = process.env.NEXT_PUBLIC_SITE_URL; let valid = false;
  try {
    const actual = new URL(origin || "");
    valid = expected ? actual.origin === new URL(expected).origin : false;
    if (isDemo() && actual.host === req.headers.get("host")) valid = true;
  } catch { /* fail closed */ }
  if (!valid) throw new HttpError(403, "This request must come from the Hannah Home website.");
}
export async function limit(req: NextRequest, action: string, maximum = 12) {
  const ip = process.env.VERCEL ? req.headers.get("x-vercel-forwarded-for")?.split(",")[0] : "local";
  const key = `hh:rate:${action}:${hash(ip || "unknown")}:${Math.floor(Date.now() / 60000)}`;
  if (isDemo()) {
    const limits = state.hhLimits ||= new Map(); for (const [k, v] of limits) if (v.reset < Date.now()) limits.delete(k);
    const record = limits.get(key) || { count: 0, reset: Date.now() + 60000 }; record.count++; limits.set(key, record);
    if (record.count > maximum) throw new HttpError(429, "Too many requests. Please wait a minute.");
  } else {
    if (!hasKV()) throw new HttpError(503, "Online services are not configured yet. Please contact us on WhatsApp.");
    const count = await kv.eval<[], number>("local c = redis.call('INCR',KEYS[1]); if c == 1 then redis.call('EXPIRE',KEYS[1],60) end; return c", [key], []);
    if (count > maximum) throw new HttpError(429, "Too many requests. Please wait a minute.");
  }
}
export async function readBody(req: NextRequest) {
  if (!req.headers.get("content-type")?.includes("application/json")) throw new HttpError(415, "Send JSON data.");
  if (Number(req.headers.get("content-length") || 0) > 16000) throw new HttpError(413, "Request is too large.");
  if (!req.body) throw new HttpError(400, "A request body is required.");
  const reader = req.body.getReader(); let size = 0; const chunks: Uint8Array[] = [];
  for (;;) { const { done, value } = await reader.read(); if (done) break; size += value.length; if (size > 16000) { await reader.cancel(); throw new HttpError(413, "Request is too large."); } chunks.push(value); }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { throw new HttpError(400, "Invalid JSON request."); }
}
export function apiError(error: unknown) {
  if (error instanceof HttpError) return Response.json({ error: error.message, code: error.code }, { status: error.status, headers: error.status === 429 ? { "Retry-After": "60" } : {} });
  if (error && typeof error === "object" && "issues" in error) return Response.json({ error: "Please check your details.", issues: (error as { issues: unknown }).issues }, { status: 400 });
  console.error("Hannah Home service error:", error instanceof Error ? error.name : "UnknownError");
  return Response.json({ error: "Something went wrong. Please try again or contact us on WhatsApp." }, { status: 503 });
}
