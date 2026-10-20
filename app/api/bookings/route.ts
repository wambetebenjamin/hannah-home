import { getUser } from "@/lib/auth";
import { getBookings } from "@/lib/storage";
import { HttpError, apiError } from "@/lib/security";
export async function GET() {
  try { const user = await getUser(); if (!user) throw new HttpError(401, "Please sign in."); return Response.json({ bookings: await getBookings(user.email) }); }
  catch (error) { return apiError(error); }
}
