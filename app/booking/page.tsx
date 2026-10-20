import type { Metadata } from "next";
import { BookingForm } from "@/components/booking-form";
import { bookingReady, isDemo } from "@/lib/runtime";
import { getUser } from "@/lib/auth";
export const metadata: Metadata = { title: "Book a service", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default async function BookingPage({ searchParams }: { searchParams: Promise<{ service?: string; package?: string }> }) {
  const query = await searchParams;
  return <><section className="page-hero compact"><div className="container"><span className="eyebrow">A HAPPIER HOME STARTS HERE</span><h1>One less thing <span>on your list.</span></h1><p>A few details, a little help, and more time for you.</p></div></section><section className="hh-section booking-section"><div className="container"><BookingForm initialService={query.service || "house-cleaning"} initialPackage={query.package || "1-bedroom"} demo={isDemo()} ready={bookingReady()} user={await getUser()}/></div></section></>;
}
