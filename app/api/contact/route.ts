import type { NextRequest } from "next/server";
import nodemailer from "nodemailer";
import { contactSchema } from "@/lib/validation";
import { isDemo, hasSMTP } from "@/lib/runtime";
import { HttpError, assertOrigin, limit, readBody, apiError, consumeTicket } from "@/lib/security";
export async function POST(req: NextRequest) {
  try {
    assertOrigin(req); await limit(req, "contact", 5); const body = contactSchema.parse(await readBody(req));
    await consumeTicket(body.captchaProof, "captcha:contact");
    if (isDemo()) return Response.json({ success: true, demo: true, message: "Preview only. Your message was validated but no email was sent." });
    if (!hasSMTP()) throw new HttpError(503, "Email is not configured. Please use WhatsApp instead.");
    const port = Number(process.env.SMTP_PORT);
    if (!Number.isInteger(port) || port < 1 || port > 65535) throw new HttpError(503, "Email is not configured correctly.");
    const transport = nodemailer.createTransport({ host: process.env.SMTP_HOST, port, secure: port === 465, requireTLS: port !== 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }, connectionTimeout: 10000, socketTimeout: 15000,
      disableFileAccess: true, disableUrlAccess: true });
    try { await transport.sendMail({ from: process.env.SMTP_FROM, to: process.env.SMTP_FROM, replyTo: body.email,
      subject: "Hannah Home website enquiry", text: `Name: ${body.name}\nPhone: ${body.phone}\nEmail: ${body.email}\n\n${body.message}`,
      disableFileAccess: true, disableUrlAccess: true }); } finally { transport.close(); }
    return Response.json({ success: true, message: "Your message has been sent. We will get back to you shortly." });
  } catch (error) { return apiError(error); }
}
