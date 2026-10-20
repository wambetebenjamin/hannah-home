import type { Metadata } from "next";
import { MapPin, Phone, MessageCircle, Clock3, ArrowUpRight } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { isDemo } from "@/lib/runtime";
import { whatsappUrl } from "@/lib/config";
export const metadata: Metadata = { title: "Contact us" };
export const dynamic = "force-dynamic";
export default function ContactPage() {
  return <><section className="page-hero"><div className="container"><span className="eyebrow">A FRIENDLY HELLO IS A GOOD START</span><h1>We are <span>here to help.</span></h1><p>Not sure where to start? Have a question about a booking?<br/>There is always a real conversation waiting.</p></div></section><section className="hh-section"><div className="container contact-grid"><div><h2>Let us talk about your home.</h2><p>For booking changes, share your booking reference so we can find the right details.</p><div className="contact-item"><Phone/><div><strong>Give us a call</strong><a href="tel:+254112272061">+254 112 272 061</a></div></div><div className="contact-item"><MessageCircle/><div><strong>A WhatsApp away</strong><a href={whatsappUrl} target="_blank" rel="noopener noreferrer">Chat with Hannah Home <ArrowUpRight size={15}/></a></div></div><div className="contact-item"><Clock3/><div><strong>Here when you need us</strong><span>Monday to Saturday, 8:00 am to 6:00 pm EAT</span></div></div><div className="contact-item"><MapPin/><div><strong>At home in Nairobi</strong><span>Serving homes across Nairobi County, Kenya.</span></div></div><div className="notice">For electrical hazards, fires or urgent safety risks, contact your local emergency service first. This is not an emergency response service.</div></div><ContactForm demo={isDemo()}/></div></section></>;
}
