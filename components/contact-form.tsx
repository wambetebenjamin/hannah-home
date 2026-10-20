"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
import { contactSchema } from "@/lib/validation";
import { CaptchaNotice, useCaptcha } from "./captcha";
import { Notice } from "./ui";
type Fields = z.infer<typeof contactSchema>;
export function ContactForm({ demo }: { demo: boolean }) {
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [success, setSuccess] = useState("");
  const { getProof, challengeUI } = useCaptcha(demo);
  const { register, handleSubmit, setError: fieldError, reset, formState: { errors } } = useForm<Fields>();
  async function submit(values: Fields) {
    if (busy) return; setError(""); setSuccess("");
    const result = contactSchema.omit({ captchaProof: true }).safeParse(values);
    if (!result.success) { result.error.issues.forEach(i => fieldError(i.path[0] as keyof Fields, { message: i.message })); return; }
    setBusy(true);
    try { const captchaProof = await getProof("contact"); const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...result.data, captchaProof }) }); const data = await r.json(); if (!r.ok) throw new Error(data.error); setSuccess(data.message); reset(); }
    catch (e) { setError(e instanceof Error ? e.message : "Your message could not be sent. Please try WhatsApp."); }
    finally { setBusy(false); }
  }
  return <><form className="contact-form" onSubmit={handleSubmit(submit)} noValidate><h2>Tell us what is on your list.</h2>{([ ["name", "Your name", "text", "name"], ["email", "Email address", "email", "email"], ["phone", "Phone number", "tel", "tel"] ] as const).map(([key, label, type, auto]) => <label key={key} className="field">{label}<input type={type} autoComplete={auto} {...register(key)} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `contact-${key}-error` : undefined} maxLength={key === "email" ? 254 : 100}/>{errors[key] && <span className="field-error" id={`contact-${key}-error`}>{errors[key]?.message}</span>}</label>)}<label className="field">How can we help?<textarea rows={5} {...register("message")} maxLength={2000} aria-invalid={!!errors.message} aria-describedby={errors.message ? "contact-message-error" : undefined} placeholder="Tell us about your home, a service or a booking. Please do not include security codes or payment PINs."/>{errors.message && <span className="field-error" id="contact-message-error">{errors.message.message}</span>}</label><label className="check-field"><input type="checkbox" {...register("consent")} aria-invalid={!!errors.consent}/><span>I have read the <Link href="/legal/privacy-policy">privacy notice</Link> and agree to be contacted about this enquiry.</span></label>{errors.consent && <p className="field-error">Please agree to be contacted about this enquiry.</p>}{error && <Notice error>{error}</Notice>}{success && <Notice>{success}</Notice>}<button className="button" disabled={busy}>{busy ? <><LoaderCircle className="spin" size={18}/> Sending...</> : <>Send message <ArrowUpRight size={18}/></>}</button><CaptchaNotice demo={demo}/></form>{challengeUI}</>;
}
