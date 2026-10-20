import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { getBookings } from "@/lib/storage";
import { MyBookings } from "@/components/my-bookings";
export const metadata: Metadata = { title: "My bookings", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default async function MyBookingsPage() {
  const user = await getUser(); if (!user) redirect("/auth/signin?callbackUrl=/my-bookings");
  return <section className="hh-section account-section"><div className="container"><MyBookings user={user} bookings={await getBookings(user.email)}/></div></section>;
}
