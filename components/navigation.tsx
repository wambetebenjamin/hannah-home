"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, Menu, ArrowUpRight, MapPin, Phone, ArrowRight } from "lucide-react";
import { Modal } from "./ui";
import { whatsappUrl } from "@/lib/config";
export function Brand() {
  return <Link className="brand" href="/" aria-label="Hannah Home, home"><span className="brand-mark"><Home size={29} strokeWidth={1.6} /></span><span>hannah<span className="brand-light">home</span><small>TRUSTED HANDS. HAPPY HOME.</small></span></Link>;
}
export function SiteHeader() {
  const pathname = usePathname(); const [menu, setMenu] = useState(false);
  useEffect(() => setMenu(false), [pathname]);
  const links = [["/", "Home"], ["/services", "Our services"], ["/professionals", "Our professionals"], ["/#how-it-works", "How it works"]];
  return <header className={`site-header ${pathname === "/" ? "home-nav" : ""}`}><div className="container nav-inner"><Brand />
    <nav className="desktop-nav" aria-label="Main navigation">{links.map(([url, label]) => <Link key={url} href={url} className={pathname === url ? "nav-active" : ""} aria-current={pathname === url ? "page" : undefined}>{label}</Link>)}</nav>
    <div className="nav-actions"><Link href="/my-bookings" className="my-bookings-link">My bookings</Link><Link href="/booking" className="button button-small">Book a service <ArrowUpRight size={17}/></Link><button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMenu(true)}><Menu /></button></div>
  </div>{menu && <Modal title="Explore Hannah Home" onClose={() => setMenu(false)}><nav className="mobile-links" aria-label="Mobile navigation">{[...links, ["/my-bookings", "My bookings"], ["/contact", "Contact us"], ["/auth/signin", "Sign in"]].map(([url, label]) => <Link href={url} key={url} onClick={() => setMenu(false)}>{label}<ArrowRight size={18}/></Link>)}</nav></Modal>}</header>;
}
export function SiteFooter() {
  return <><section className="newsletter_section booking-strip"><div className="container strip-inner"><div><span className="eyebrow">A LITTLE HELP GOES A LONG WAY</span><h2>A happier home starts here.</h2><p>Leave the to-do list to us. Make time for what matters.</p></div><Link href="/booking" className="button button-light">Book a Service <ArrowUpRight size={18}/></Link></div></section>
  <footer className="footer_section hh-footer"><div className="container"><div className="footer-grid"><div><Brand/><p>Good people. Great service.<br/>A little more peace of mind at home.</p><span className="location-line"><MapPin size={16}/> Made for homes in Nairobi.</span></div><div><h3>Make yourself at home</h3><Link href="/services">Our services</Link><Link href="/professionals">Our professionals</Link><Link href="/booking">Book a service</Link><Link href="/my-bookings">My bookings</Link></div><div><h3>Here to help</h3><a href={whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp us <ArrowUpRight size={14}/></a><a href="tel:+254112272061"><Phone size={14}/> +254 112 272 061</a><Link href="/contact">Send a message</Link><p className="small">Monday to Saturday<br/>8:00 am to 6:00 pm, EAT</p></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Hannah Home. All rights reserved.</span><nav aria-label="Legal"><Link href="/legal/privacy-policy">Privacy</Link><Link href="/legal/terms">Terms</Link><Link href="/legal/cookie-policy">Cookies</Link><button onClick={() => window.dispatchEvent(new Event("hh:consent-open"))}>Cookie preferences</button></nav></div><p className="template-credit">Built on the Capiclean template by <a href="https://html.design" target="_blank" rel="noopener noreferrer">Free HTML Templates</a>, distributed by ThemeWagon.</p></div></footer></>;
}
