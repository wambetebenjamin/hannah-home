import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { getUser } from "@/lib/auth";
import { getBooking } from "@/lib/storage";
import { readTicket } from "@/lib/security";
import { Confirmation } from "@/components/confirmation";
export const metadata: Metadata = { title: "Your booking", robots: { index: false, follow: false }, referrer: "no-referrer" };
export const dynamic = "force-dynamic";
export default async function ConfirmationPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams; const user = await getUser();
  const receipt = readTicket<{ ref: string }>((await cookies()).get("hh_booking_receipt")?.value, "receipt");
  let booking = null;
  if (ref && /^HH-[A-F0-9]{12}$/.test(ref) && (user || receipt?.ref === ref)) {
    const candidate = await getBooking(ref); if (candidate && (candidate.ownerEmail === user?.email || receipt?.ref === ref)) booking = candidate;
  }
  return <section className="hh-section confirmation-section"><div className="container">{booking ? <Confirmation booking={booking}/> : <div className="empty-state"><h1>Your booking details stay private.</h1><p>Complete a booking to see its confirmation here, or sign in to view your own bookings. Guest receipts are available in the same browser for one hour.</p><div className="center-action"><Link className="button" href="/my-bookings">My bookings</Link><Link className="button button-outline" href="/booking">Book a service</Link></div></div>}</div></section>;
}
