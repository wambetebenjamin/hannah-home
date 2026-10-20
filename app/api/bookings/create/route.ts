import { NextRequest, NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validation";
import { getUser } from "@/lib/auth";
import { createBooking } from "@/lib/storage";
import { assertOrigin, limit, readBody, apiError, consumeTicket, signTicket, HttpError } from "@/lib/security";
import { bookingReady } from "@/lib/runtime";
export async function POST(req: NextRequest) {
  try {
    assertOrigin(req); await limit(req, "booking", 8);
    const { captchaProof, idempotencyKey, ...input } = bookingSchema.parse(await readBody(req));
    if (!bookingReady()) throw new HttpError(503, "Online booking is not configured. Please contact us on WhatsApp.");
    await consumeTicket(captchaProof, "captcha:booking");
    const user = await getUser();
    const booking = await createBooking(input, idempotencyKey, user?.email || null);
    const response = NextResponse.json({ reference: booking.reference, demo: booking.demo, status: booking.status }, { status: 201 });
    response.cookies.set("hh_booking_receipt", signTicket({ purpose: "receipt", ref: booking.reference }, 3600), { httpOnly: true, secure: req.nextUrl.protocol === "https:", sameSite: "lax", path: "/booking-confirmation", maxAge: 3600 });
    return response;
  } catch (error) { return apiError(error); }
}
