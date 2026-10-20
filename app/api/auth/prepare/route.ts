import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { emailSchema, nameSchema } from "@/lib/validation";
import { hasOAuth } from "@/lib/runtime";
import { assertOrigin, limit, readBody, apiError, consumeTicket, signTicket, HttpError } from "@/lib/security";
const schema = z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("signin"), email: emailSchema, captchaProof: z.string().max(2048) }),
  z.object({ mode: z.literal("signup"), name: nameSchema, email: emailSchema, consent: z.literal(true), captchaProof: z.string().max(2048) }),
]);
export async function POST(req: NextRequest) {
  try {
    assertOrigin(req); await limit(req, "auth", 8); const body = schema.parse(await readBody(req));
    if (!hasOAuth()) throw new HttpError(503, "Google sign-in is not configured yet. You can still book as a guest.");
    await consumeTicket(body.captchaProof, `captcha:auth_${body.mode}`);
    const response = NextResponse.json({ success: true });
    response.cookies.set("hh_oauth_permit", signTicket({ purpose: "oauth", email: body.email }, 300), { httpOnly: true, secure: req.nextUrl.protocol === "https:", sameSite: "lax", path: "/", maxAge: 300 });
    return response;
  } catch (error) { return apiError(error); }
}
