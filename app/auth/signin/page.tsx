import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { isDemo, hasOAuth } from "@/lib/runtime";
export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default async function SigninPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string; error?: string }> }) {
  const query = await searchParams; const safePath = query.callbackUrl === "/booking" ? "/booking" : "/my-bookings";
  return <section className="auth-section"><div className="auth-container"><AuthForm mode="signin" demo={isDemo()} configured={hasOAuth()} callbackUrl={safePath} authError={!!query.error}/></div></section>;
}
