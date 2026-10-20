import { HttpError, signTicket, readTicket, consumeTicket } from "./security";
import { isDemo } from "./runtime";
import { assessCaptcha } from "./captcha-policy";
export const captchaActions = ["booking", "contact", "auth_signin", "auth_signup", "review"] as const;
export async function verifyCaptcha(token: string, action: string, version: "v3" | "v2", challenge?: string) {
  if (isDemo()) return { proof: signTicket({ purpose: `captcha:${action}`, demo: true }), demo: true };
  const secret = version === "v2" ? process.env.RECAPTCHA_V2_SECRET_KEY : process.env.RECAPTCHA_SECRET_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!secret || !siteUrl || !process.env.NEXTAUTH_SECRET) throw new HttpError(503, "Human verification is not configured. Please contact us on WhatsApp.");
  if (version === "v2" && !readTicket(challenge, `captcha_challenge:${action}`)) throw new HttpError(403, "Challenge expired. Please try again.");
  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }), signal: AbortSignal.timeout(8000), cache: "no-store",
  });
  if (!response.ok) throw new HttpError(503, "Verification is temporarily unavailable. Please try again.");
  const result: unknown = await response.json();
  const decision = assessCaptcha(result, action, new URL(siteUrl).hostname, version);
  if (!decision.valid) throw new HttpError(403, decision.reason);
  if (version === "v3") {
    if (decision.requiresV2) {
      if (!process.env.RECAPTCHA_V2_SECRET_KEY || !process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY) throw new HttpError(503, "The additional verification challenge is not configured. Please contact us.");
      return { requiresV2: true, challenge: signTicket({ purpose: `captcha_challenge:${action}` }, 120) };
    }
  } else await consumeTicket(challenge!, `captcha_challenge:${action}`);
  return { proof: signTicket({ purpose: `captcha:${action}` }), demo: false };
}
