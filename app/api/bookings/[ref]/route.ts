import { getUser } from "@/lib/auth";
import { getBooking } from "@/lib/storage";
import { HttpError, apiError } from "@/lib/security";
export async function GET(_: Request, { params }: { params: Promise<{ ref: string }> }) {
  try {
    const user = await getUser(); if (!user) throw new HttpError(401, "Please sign in to view your booking.");
    const { ref } = await params; if (!/^HH-[A-F0-9]{12}$/.test(ref)) throw new HttpError(404, "Booking not found.");
    const booking = await getBooking(ref); if (!booking || booking.ownerEmail !== user.email) throw new HttpError(404, "Booking not found.");
    return Response.json({ booking });
  } catch (error) { return apiError(error); }
}
