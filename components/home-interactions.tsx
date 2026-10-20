"use client";
import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
export function HeroActions() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => { gsap.from(".hero-cta", { y: 18, opacity: 0, duration: .8, delay: .25, ease: "power2.out" }); }, ref);
    return () => ctx.revert();
  }, []);
  return <div className="hero-actions" ref={ref}><Link className="button hero-cta" href="/booking">Book a Service <ArrowUpRight size={19}/></Link><a className="how-link" href="#how-it-works"><span><Play size={14} fill="currentColor"/></span>How it works</a></div>;
}
