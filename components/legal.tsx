import Link from "next/link";
import type { ReactNode } from "react";
export function LegalLayout({ title, children }: { title: string; children: ReactNode }) {
  return <><section className="page-hero compact"><div className="container"><span className="eyebrow">CLEAR INFORMATION. NO SMALL-PRINT SURPRISES.</span><h1>{title}</h1><p>Last updated: 20 October 2026</p></div></section><section className="hh-section"><div className="container legal-grid"><nav aria-label="Legal documents"><Link href="/legal/privacy-policy">Privacy policy</Link><Link href="/legal/terms">Terms of service</Link><Link href="/legal/cookie-policy">Cookie policy</Link><Link href="/contact">Contact Hannah Home</Link></nav><article className="legal-content">{children}</article></div></section></>;
}
