import type { Metadata } from "next";
import { ProfessionalDirectory } from "@/components/directories";
export const metadata: Metadata = { title: "Our professionals" };
export default function ProfessionalsPage() {
  return <><section className="page-hero"><div className="container"><span className="eyebrow">PEOPLE YOU CAN FEEL AT HOME WITH</span><h1>Skilled hands.<br/><span>Thoughtful people.</span></h1><p>Explore the professional directory. Every live assignment will be<br/>confirmed by our team before a professional visits your home.</p></div></section><section className="hh-section directory-section"><div className="container"><ProfessionalDirectory/></div></section></>;
}
