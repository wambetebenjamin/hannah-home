import type { NextRequest } from "next/server";
import { z } from "zod";
import { verifyCaptcha, captchaActions } from "@/lib/captcha";
import { assertOrigin, limit, readBody, apiError } from "@/lib/security";
const schema = z.object({ token: z.string().min(1).max(4096), action: z.enum(captchaActions), version: z.enum(["v3", "v2"]).default("v3"), challenge: z.string().max(2048).optional() });
export async function POST(req: NextRequest) {
  try { assertOrigin(req); await limit(req, "captcha", 20); const body = schema.parse(await readBody(req)); return Response.json(await verifyCaptcha(body.token, body.action, body.version, body.challenge)); }
  catch (error) { return apiError(error); }
}
