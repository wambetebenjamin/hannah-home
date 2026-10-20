"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { Modal } from "./ui";
type Recaptcha = { ready: (fn: () => void) => void; execute: (key: string, options: { action: string }) => Promise<string>; render: (element: HTMLElement, options: Record<string, unknown>) => number; reset: (id: number) => void };
declare global { interface Window { grecaptcha?: Recaptcha } }
let scriptPromise: Promise<Recaptcha> | null = null;
function loadCaptcha(): Promise<Recaptcha> {
  if (window.grecaptcha?.execute) return Promise.resolve(window.grecaptcha);
  if (scriptPromise) return scriptPromise;
  const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!key) return Promise.reject(new Error("Verification is not configured. Please use WhatsApp to contact us."));
  scriptPromise = new Promise<Recaptcha>((resolve, reject) => {
    const script = document.createElement("script"); const timer = setTimeout(() => { script.remove(); scriptPromise = null; reject(new Error("Verification took too long. Check your connection and retry.")); }, 12000);
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(key)}`; script.async = true; script.defer = true;
    script.onload = () => { clearTimeout(timer); if (!window.grecaptcha) { scriptPromise = null; reject(new Error("Verification could not load.")); } else window.grecaptcha.ready(() => resolve(window.grecaptcha!)); };
    script.onerror = () => { clearTimeout(timer); scriptPromise = null; script.remove(); reject(new Error("Verification could not load. Please check your connection.")); };
    document.head.appendChild(script);
  }); return scriptPromise;
}
async function verify(body: Record<string, string>) {
  const response = await fetch("/api/recaptcha/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await response.json(); if (!response.ok) throw new Error(data.error || "Verification failed."); return data as { proof?: string; requiresV2?: boolean; challenge?: string };
}
export function useCaptcha(demo: boolean) {
  const [challenge, setChallenge] = useState<{ action: string; ticket: string } | null>(null);
  const pending = useRef<{ resolve: (value: string) => void; reject: (reason: Error) => void } | null>(null);
  useEffect(() => () => { pending.current?.reject(new Error("Verification cancelled.")); pending.current = null; }, []);
  const getProof = useCallback(async (action: string) => {
    const token = demo ? "local-preview-no-google-request" : await (await loadCaptcha()).execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!, { action });
    const result = await verify({ token, action, version: "v3" });
    if (result.proof) return result.proof;
    if (!result.requiresV2 || !result.challenge) throw new Error("Verification failed. Please try again.");
    return new Promise<string>((resolve, reject) => { pending.current = { resolve, reject }; setChallenge({ action, ticket: result.challenge! }); });
  }, [demo]);
  function cancel() { pending.current?.reject(new Error("Verification cancelled. You can try again.")); pending.current = null; setChallenge(null); }
  async function solved(token: string) {
    if (!challenge) return;
    try { const result = await verify({ token, action: challenge.action, version: "v2", challenge: challenge.ticket }); if (!result.proof) throw new Error("Please complete verification again."); pending.current?.resolve(result.proof); }
    catch (error) { pending.current?.reject(error instanceof Error ? error : new Error("Verification failed.")); }
    finally { pending.current = null; setChallenge(null); }
  }
  return { getProof, challengeUI: challenge ? <Modal title="A quick security check" onClose={cancel}><p>Please complete the checkbox challenge to continue.</p><V2Challenge onToken={solved}/></Modal> : null };
}
function V2Challenge({ onToken }: { onToken: (token: string) => void }) {
  const element = useRef<HTMLDivElement>(null); const rendered = useRef(false); const callback = useRef(onToken); callback.current = onToken;
  const [error, setError] = useState("");
  useEffect(() => {
    if (rendered.current || !element.current) return;
    let active = true;
    loadCaptcha().then(api => {
      if (!active || !element.current || rendered.current) return;
      rendered.current = true;
      api.render(element.current, { sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY, callback: (token: string) => callback.current(token), "expired-callback": () => setError("The challenge expired. Please tick the checkbox again."), "error-callback": () => setError("Could not load the challenge. Close this dialog and retry.") });
    }).catch(e => setError(e.message));
    return () => { active = false; };
  }, []);
  return <><div ref={element}/>{error && <p className="field-error" role="alert">{error}</p>}</>;
}
export function CaptchaNotice({ demo }: { demo: boolean }) {
  return <p className="captcha-notice">{demo ? "Local preview: human verification is simulated. No booking or message is sent to a real professional." : <>Protected by Google reCAPTCHA. Google&apos;s <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> apply. Verification loads only when you submit.</>}</p>;
}
