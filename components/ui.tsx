"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { X, Brush, SprayCan, Wrench, PlugZap, PaintRoller, Hammer, Bug, WashingMachine } from "lucide-react";
export function ServiceIcon({ name, size = 28 }: { name: string; size?: number }) {
  const icons = { brush: Brush, spray: SprayCan, wrench: Wrench, plug: PlugZap, paint: PaintRoller, hammer: Hammer, bug: Bug, washer: WashingMachine };
  const Icon = icons[name as keyof typeof icons] || Wrench;
  return <Icon size={size} strokeWidth={1.5} aria-hidden="true" />;
}
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return <motion.div className={`reveal ${className}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: .5, delay: reduce ? 0 : delay }}>{children}</motion.div>;
}
export function Lift({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} whileHover={reduce ? undefined : { y: -6 }} transition={{ duration: .2 }}>{children}</motion.div>;
}
export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const headingId = title.replace(/\W/g, "-").toLowerCase();
  useEffect(() => { const dialog = ref.current; dialog?.showModal(); return () => dialog?.close(); }, []);
  return <dialog ref={ref} className="hh-modal" aria-labelledby={headingId} data-lenis-prevent onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if (e.target === ref.current) onClose(); }}>
    <div className="modal-inner"><div className="modal-heading"><h2 id={headingId}>{title}</h2><button className="icon-button" type="button" aria-label="Close dialog" onClick={onClose}><X size={20} /></button></div>{children}</div>
  </dialog>;
}
export function Notice({ children, error = false }: { children: ReactNode; error?: boolean }) {
  return <div className={`notice ${error ? "notice-error" : ""}`} role={error ? "alert" : "status"}>{children}</div>;
}
