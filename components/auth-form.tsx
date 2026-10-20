"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ArrowRight, LoaderCircle } from "lucide-react";
import { authFormSchema, signInSchema } from "@/lib/validation";
import { CaptchaNotice, useCaptcha } from "./captcha";
import { Notice } from "./ui";
type Fields = { name: string; email: string; consent: boolean };
export function AuthForm({ mode, demo, configured, callbackUrl, authError }: { mode: "signin" | "signup"; demo: boolean; configured: boolean; callbackUrl: string; authError: boolean }) {
  const signup = mode === "signup"; const router = useRouter(); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const { getProof, challengeUI } = useCaptcha(demo);
  const { register, handleSubmit, setError: fieldError, formState: { errors } } = useForm<Fields>();
  async function submit(values: Fields) {
    if (busy) return; setError("");
    const result = (signup ? authFormSchema : signInSchema).safeParse(values);
    if (!result.success) { result.error.issues.forEach(i => fieldError(i.path[0] as keyof Fields, { message: i.message })); return; }
    setBusy(true);
    try {
      const captchaProof = await getProof(`auth_${mode}`);
      const res = await fetch("/api/auth/prepare", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...result.data, mode, captchaProof }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.error);
      await signIn("google", { redirectTo: callbackUrl });
    } catch (e) { setError(e instanceof Error ? e.message : "Could not start sign-in. Please try again."); setBusy(false); }
  }
  async function preview() {
    setError(""); setBusy(true);
    try { const r = await fetch("/api/auth/demo", { method: "POST" }); const data = await r.json(); if (!r.ok) throw new Error(data.error); router.push(callbackUrl); router.refresh(); }
    catch (e) { setError(e instanceof Error ? e.message : "Preview sign-in failed."); setBusy(false); }
  }
  return <><form noValidate onSubmit={handleSubmit(submit)} className="auth-form"><span className="eyebrow">{signup ? "A LITTLE MORE AT HOME" : "GOOD TO HAVE YOU BACK"}</span><h1>{signup ? "Make yourself at home." : "Welcome home."}</h1><p>{signup ? "Create your account with Google to keep every booking in one place." : "Sign in with Google to see your bookings, rebook a favourite service and leave a review."}</p>{authError && <Notice error>Sign-in could not be completed. Please use the same email you enter below and try again.</Notice>}
    {signup && <label className="field">Full name<input {...register("name")} autoComplete="name" maxLength={100} aria-invalid={!!errors.name} aria-describedby={errors.name ? "auth-name-error" : undefined}/>{errors.name && <span className="field-error" id="auth-name-error">{errors.name.message}</span>}</label>}
    <label className="field">Your Google email address<input type="email" {...register("email")} autoComplete="email" placeholder="you@gmail.com" maxLength={254} aria-invalid={!!errors.email} aria-describedby={errors.email ? "auth-email-error" : undefined}/>{errors.email && <span className="field-error" id="auth-email-error">{errors.email.message}</span>}</label>
    {signup && <><label className="check-field"><input type="checkbox" {...register("consent")} aria-invalid={!!errors.consent}/><span>I agree to the <Link href="/legal/terms">terms</Link> and have read the <Link href="/legal/privacy-policy">privacy notice</Link>.</span></label>{errors.consent && <p className="field-error">Please agree to the terms and read the privacy notice.</p>}</>}
    {!configured && <Notice>Google sign-in is not connected yet. You can still book as a guest.{demo && " Use the clearly labelled preview account below to test My bookings."}</Notice>}
    {error && <Notice error>{error}</Notice>}<button type="submit" className="button google-button full-button" disabled={busy || !configured}>{busy ? <LoaderCircle className="spin" size={19}/> : <span className="google-mark" aria-hidden="true">G</span>}{signup ? "Sign up with Google" : "Continue with Google"}<ArrowRight size={18}/></button><CaptchaNotice demo={demo}/><p className="auth-security"><ShieldCheck size={16}/> No new password to remember. Google verifies your identity.</p><div className="auth-switch">{signup ? "Already feel at home?" : "New to Hannah Home?"} <Link href={signup ? "/auth/signin" : "/auth/signup"}>{signup ? "Sign in" : "Create an account"}</Link></div><Link className="text-link" href="/booking">Or book as a guest <ArrowRight size={15}/></Link></form>
    {demo && <div className="demo-login"><strong>Explore the local preview</strong><p>Use a test account with a sample completed booking. No Google account is connected. Do not enter private information.</p><button className="button button-outline full-button" disabled={busy} onClick={preview}>Enter preview account <ArrowRight size={17}/></button></div>}{challengeUI}</>;
}
