import type { BookingInput } from "./validation";
export type Booking = BookingInput & {
  reference: string; ownerEmail: string | null; price: number; duration: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  professional: string | null; createdAt: string; demo: boolean;
  review?: { rating: number; comment: string; createdAt: string };
};
export type User = { name: string; email: string; demo?: boolean };
