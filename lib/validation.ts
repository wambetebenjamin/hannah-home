import { z } from "zod";
import { services, packageIds, slots } from "./catalog.ts";
export const emailSchema = z.string().trim().toLowerCase().email("Enter a valid email address.").max(254).regex(/^[\x21-\x7E]+$/, "Use an email address with standard characters.");
export const nameSchema = z.string().trim().min(2, "Please enter your full name.").max(100).regex(/^[^\r\n<>]+$/, "Enter your name without special markup.");
export const phoneSchema = z.string().trim().regex(/^(?:\+254|254|0)[17]\d{8}$/, "Use a Kenyan number, for example 0712345678.");
export function nairobiDate(now = new Date()) { return new Date(now.getTime() + 3 * 3600000).toISOString().slice(0, 10); }
export function validDate(value: string, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00+03:00`);
  if (Number.isNaN(date.getTime()) || nairobiDate(date) !== value) return false;
  return value >= nairobiDate(now) && value <= nairobiDate(new Date(now.getTime() + 90 * 86400000));
}
export function slotIsFuture(date: string, time: string, now = new Date()) { return new Date(`${date}T${time}:00+03:00`).getTime() >= now.getTime() + 2 * 3600000; }
export const serviceIdSchema = z.string().refine(id => services.some(s => s.id === id), "Choose a service.");
export const dateSchema = z.string().refine(value => validDate(value), "Choose a real date within the next 90 days.");
export const bookingDetailsSchema = z.object({
  serviceId: serviceIdSchema, packageId: z.enum(packageIds), date: dateSchema, time: z.enum(slots),
  area: z.enum(["Westlands", "Kilimani", "Kileleshwa", "Lavington", "Karen", "Parklands", "South B", "South C", "Langata", "Runda", "Kasarani", "Other Nairobi area"]),
  address: z.string().trim().min(8, "Enter your building, street and house number.").max(250),
  instructions: z.string().trim().max(500).default(""), name: nameSchema, phone: phoneSchema, email: emailSchema,
  payment: z.enum(["mpesa", "cash"]),
  consent: z.literal(true, { errorMap: () => ({ message: "Please agree to the booking terms and privacy notice." }) }),
});
export const bookingSchema = bookingDetailsSchema.extend({ captchaProof: z.string().min(1).max(2048), idempotencyKey: z.string().uuid() })
  .refine(v => slotIsFuture(v.date, v.time), { path: ["time"], message: "Please choose a time at least 2 hours from now." });
export type BookingInput = z.infer<typeof bookingDetailsSchema>;
export const contactSchema = z.object({ name: nameSchema, email: emailSchema, phone: phoneSchema, message: z.string().trim().min(10, "Please tell us a little more.").max(2000), consent: z.literal(true), captchaProof: z.string().min(1).max(2048) });
export const authFormSchema = z.object({ name: nameSchema, email: emailSchema, consent: z.literal(true) });
export const signInSchema = z.object({ email: emailSchema });
export const reviewSchema = z.object({ bookingId: z.string().regex(/^HH-[A-F0-9]{12}$/), rating: z.number().int().min(1).max(5), comment: z.string().trim().min(5, "Please add a short comment.").max(1000), captchaProof: z.string().min(1).max(2048) });
