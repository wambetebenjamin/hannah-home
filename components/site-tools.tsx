"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX, MessageCircle, ShieldCheck, Cookie } from "lucide-react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Lenis from "lenis";
import Link from "next/link";
import { Modal } from "./ui";
import { consentKey, voiceScript, whatsappUrl } from "@/lib/config";

type Consent = { necessary: true; functional: boolean; analytics: boolean; marketing: boolean; savedAt: number; version: 1 };
const defaults: Consent = { necessary: true, functional: false, analytics: false, marketing: false, savedAt: 0, version: 1 };
function storedConsent(): Consent | null {
  try { const data = JSON.parse(localStorage.getItem(consentKey) || "null"); return data && data.version === 1 && data.necessary === true && [data.functional, data.analytics, data.marketing].every(v => typeof v === "boolean") && data.savedAt > Date.now() - 180 * 86400000 ? data : null; } catch { return null; }
}
export function SiteTools() {
  const [consent, setConsent] = useState<Consent | null>(null); const [loaded, setLoaded] = useState(false);
  const [manage, setManage] = useState(false); const [prefs, setPrefs] = useState(defaults);
  const [storageWarning, setStorageWarning] = useState(false);
  useEffect(() => {
    const current = storedConsent(); setConsent(current); setPrefs(current || defaults); setLoaded(true);
    const open = () => { setPrefs(storedConsent() || defaults); setManage(true); };
    const sync = () => { const next = storedConsent(); setConsent(next); setPrefs(next || defaults); };
    window.addEventListener("hh:consent-open", open); window.addEventListener("storage", sync);
    return () => { window.removeEventListener("hh:consent-open", open); window.removeEventListener("storage", sync); };
  }, []);
  function save(value: Consent) {
    const next = { ...value, savedAt: Date.now() };
    try { localStorage.setItem(consentKey, JSON.stringify(next)); } catch { setStorageWarning(true); }
    setConsent(next); setManage(false); window.dispatchEvent(new Event("hh:consent-change"));
  }
  return <><SmoothScroll/><Preloader/><VoiceTour/><a className="floating-tool whatsapp-tool" href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp"><MessageCircle size={26}/><span className="tool-tooltip">Chat with us on WhatsApp</span></a>
    {loaded && !consent && <section className="consent-banner" aria-label="Cookie consent"><div className="consent-copy"><Cookie size={25}/><div><strong>Your home, your privacy.</strong><p>We use necessary cookies to keep things working. Optional cookies are your choice. <Link href="/legal/cookie-policy">Learn more</Link></p></div></div><div className="consent-actions"><button className="button button-outline button-small" onClick={() => setManage(true)}>Manage Preferences</button><button className="button button-small" onClick={() => save({ ...defaults, functional: true, analytics: true, marketing: true })}>Accept All</button></div></section>}
    {manage && <Modal title="Your privacy preferences" onClose={() => setManage(false)}><p>Choose what you are comfortable with. Optional categories stay off until you consent. You can change your mind at any time.</p>{([
      ["necessary", "Necessary", "Secure sessions, booking receipts and your consent choice. Always on."],
      ["functional", "Functional", "Allows optional preferences to be remembered. No extra functional storage is currently enabled."],
      ["analytics", "Analytics", "Vercel Analytics and Speed Insights help us understand performance. No booking details are sent."],
      ["marketing", "Marketing", "Permission for marketing tools. No advertising or marketing trackers are currently installed."],
    ] as const).map(([key, label, description]) => <label className="consent-option" key={key}><span><strong>{label}{key === "necessary" && " (always on)"}</strong><small>{description}</small></span><input type="checkbox" role="switch" checked={prefs[key]} disabled={key === "necessary"} onChange={e => setPrefs({ ...prefs, [key]: e.target.checked })}/></label>)}<div className="modal-buttons"><button className="button button-outline" onClick={() => save(defaults)}>Necessary only</button><button className="button" onClick={() => save(prefs)}>Save preferences</button></div><p className="small"><ShieldCheck size={14}/> Your choice is saved for up to 180 days. Read our <Link href="/legal/privacy-policy">privacy policy</Link>.</p></Modal>}
    {storageWarning && <div className="storage-warning" role="status">Your choice applies to this visit only because browser storage is unavailable.<button aria-label="Dismiss storage notice" onClick={() => setStorageWarning(false)}>Close</button></div>}
    {consent?.analytics && <><Analytics beforeSend={event => storedConsent()?.analytics ? { ...event, url: event.url.split("?")[0] } : null}/><SpeedInsights beforeSend={event => storedConsent()?.analytics ? { ...event, url: event.url.split("?")[0] } : null}/></>}
  </>;
}
function SmoothScroll() {
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)"); let lenis: Lenis | undefined;
    const setup = () => { lenis?.destroy(); if (!media.matches) lenis = new Lenis({ autoRaf: true, duration: .8, anchors: true, prevent: node => !!node.closest("[data-lenis-prevent]") }); };
    setup(); media.addEventListener("change", setup); return () => { lenis?.destroy(); media.removeEventListener("change", setup); };
  }, []); return null;
}
function Preloader() {
  const [visible, setVisible] = useState(true); const [percent, setPercent] = useState(0); const [skip, setSkip] = useState(false);
  useEffect(() => {
    const start = performance.now();
    const interval = setInterval(() => setPercent(Math.min(100, Math.round((performance.now() - start) / 16))), 50);
    const canSkip = setTimeout(() => setSkip(true), 1000); const finish = setTimeout(() => setVisible(false), 1800);
    return () => { clearInterval(interval); clearTimeout(canSkip); clearTimeout(finish); };
  }, []);
  if (!visible) return null;
  return <div className="preloader" role="status" aria-label="Loading Hannah Home"><svg className="loader-house" width="70" height="70" viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M8 29L32 8L56 29M14 25V55H50V25M26 55V36H38V55" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg><span className="loader-percent">{percent}%</span>{skip && <button onClick={() => setVisible(false)}>Skip loading</button>}</div>;
}
function VoiceTour() {
  const [status, setStatus] = useState<"ready" | "speaking" | "muted" | "ended" | "unsupported">("ready");
  const started = useRef(false); const muted = useRef(false); const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  const start = useCallback(() => {
    if (!("speechSynthesis" in window)) { setStatus("unsupported"); return; }
    window.speechSynthesis.cancel(); muted.current = false; const speech = new SpeechSynthesisUtterance(voiceScript);
    speech.rate = .92; speech.pitch = 1.05; speech.lang = "en-KE";
    const voice = speechSynthesis.getVoices().find(v => v.lang === "en-KE"); if (voice) speech.voice = voice;
    speech.onstart = () => { if (utterance.current === speech) setStatus("speaking"); }; speech.onend = () => { if (utterance.current === speech && !muted.current) setStatus("ended"); };
    speech.onerror = event => { if (utterance.current === speech && !muted.current && event.error !== "canceled" && event.error !== "interrupted") setStatus("ready"); };
    utterance.current = speech; speechSynthesis.speak(speech);
  }, []);
  useEffect(() => {
    const interact = (event: Event) => {
      if (started.current || (event.target instanceof Element && event.target.closest(".voice-tool"))) return;
      started.current = true; start();
    };
    const names = ["click", "wheel", "touchmove"] as const;
    names.forEach(name => window.addEventListener(name, interact, { passive: true }));
    const keyboardScroll = (event: KeyboardEvent) => { if (["ArrowDown", "PageDown", "End", " "].includes(event.key) && !(event.target instanceof Element && event.target.closest("input, textarea, select, button"))) interact(event); };
    window.addEventListener("keydown", keyboardScroll);
    return () => { window.removeEventListener("keydown", keyboardScroll); names.forEach(name => window.removeEventListener(name, interact)); if ("speechSynthesis" in window) speechSynthesis.cancel(); };
  }, [start]);
  function click() { started.current = true; if (status === "speaking") { muted.current = true; setStatus("muted"); speechSynthesis.cancel(); } else start(); }
  const label = status === "ended" ? "Replay tour" : status === "muted" ? "Replay tour" : status === "unsupported" ? "Voice tour is not supported in this browser" : "Site voice tour, click to mute";
  return <button className={`floating-tool voice-tool ${status === "speaking" ? "speaking" : ""}`} aria-label={label} onClick={click} disabled={status === "unsupported"}>{status === "muted" ? <VolumeX size={23}/> : <Volume2 size={23}/>}<span className="tool-tooltip">{status === "ended" || status === "muted" ? "Replay tour" : status === "unsupported" ? "Voice unavailable in this browser" : "Hear what this site is about"}</span></button>;
}
