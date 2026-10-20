"use client";
import Link from "next/link";
import { Home, ArrowRight, RotateCcw, MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/config";
export function ErrorScreen({ status = 404, reset }: { status?: 404 | 500; reset?: () => void }) {
  return <section className="error-screen"><div className="container"><span className="error-house"><Home size={40} strokeWidth={1.3}/></span><span className="eyebrow">{status === 404 ? "LOOKS LIKE A WRONG TURN" : "A LITTLE HICCUP AT HOME"}</span><span className="error-number">{status}</span><h1>{status === 404 ? "This service page does not exist." : "Something needs a little attention."}</h1><p>{status === 404 ? "Let us get you back to the right helping hand." : "We could not load this page. Please try again, or let us help you on WhatsApp."}</p><div className="center-action">{status === 500 && <button className="button" onClick={() => reset ? reset() : window.location.reload()}><RotateCcw size={17}/> Try Again</button>}<Link href="/services" className={`button ${status === 500 ? "button-outline" : ""}`}>Back to Services <ArrowRight size={17}/></Link></div>{status === 500 && <a className="text-link" href={whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={17}/> WhatsApp +254112272061</a>}</div></section>;
}
