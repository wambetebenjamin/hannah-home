import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { isDemo, hasOAuth } from "@/lib/runtime";
export const metadata: Metadata = { title: "Create an account", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default function SignupPage() { return <section className="auth-section"><div className="auth-container"><AuthForm mode="signup" demo={isDemo()} configured={hasOAuth()} callbackUrl="/my-bookings" authError={false}/></div></section>; }
