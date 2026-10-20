import type { NextRequest } from "next/server";
import { getUser } from "@/lib/auth";
import { reviewSchema } from "@/lib/validation";
import { saveReview } from "@/lib/storage";
import { HttpError, assertOrigin, limit, readBody, apiError, consumeTicket } from "@/lib/security";
export async function POST(req: NextRequest) {
  try {
    assertOrigin(req); const user = await getUser(); if (!user) throw new HttpError(401, "Please sign in to leave a review.");
    await limit(req, "review", 8); const body = reviewSchema.parse(await readBody(req)); await consumeTicket(body.captchaProof, "captcha:review");
    return Response.json({ review: await saveReview(body.bookingId, user.email, body.rating, body.comment) });
  } catch (error) { return apiError(error); }
}
