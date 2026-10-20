import type { Metadata } from "next";
import { ServiceDirectory } from "@/components/directories";
export const metadata: Metadata = { title: "Our services" };
export default function ServicesPage() {
  return <><section className="page-hero"><div className="container"><span className="eyebrow">ONE HOME. EVERY HELPING HAND.</span><h1>Good care for <span>every corner.</span></h1><p>Everyday cleaning, long-overdue repairs and fresh starts.<br/>Find the right service, with a clear price from the start.</p></div></section><section className="hh-section directory-section"><div className="container"><ServiceDirectory/></div></section></>;
}
