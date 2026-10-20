export const isDemo = () => process.env.NODE_ENV !== "production" && process.env.HANNAH_DEMO_MODE === "true";
export const hasKV = () => !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
export const hasCaptcha = () => !!(process.env.RECAPTCHA_SECRET_KEY && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && process.env.RECAPTCHA_V2_SECRET_KEY && process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY);
export const hasOAuth = () => !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && (process.env.NEXTAUTH_SECRET?.length || 0) >= 32);
export const hasSMTP = () => !!(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_FROM);
export const bookingReady = () => isDemo() || !!(hasKV() && hasCaptcha() && (process.env.NEXTAUTH_SECRET?.length || 0) >= 32 && process.env.NEXT_PUBLIC_SITE_URL);
