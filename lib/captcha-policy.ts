export type CaptchaDecision = { valid: true; requiresV2: boolean } | { valid: false; reason: string };
export function assessCaptcha(result: unknown, action: string, hostname: string, version: "v3" | "v2", now = Date.now()): CaptchaDecision {
  if (!result || typeof result !== "object") return { valid: false, reason: "Malformed verification response." };
  const value = result as Record<string, unknown>;
  if (value.success !== true || value.hostname !== hostname || typeof value.challenge_ts !== "string") return { valid: false, reason: "Human verification failed. Please try again." };
  const age = now - Date.parse(value.challenge_ts);
  if (!Number.isFinite(age) || age > 120000 || age < -10000) return { valid: false, reason: "Verification expired. Please try again." };
  if (version === "v3") {
    if (value.action !== action || typeof value.score !== "number" || !Number.isFinite(value.score) || value.score < 0 || value.score > 1) return { valid: false, reason: "Verification did not match this form." };
    return { valid: true, requiresV2: value.score < .5 };
  }
  return { valid: true, requiresV2: false };
}
