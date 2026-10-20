import { services } from "@/lib/catalog";
import type { NextRequest } from "next/server";
export function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");
  const result = !category || category === "All services" ? services : services.filter(s => s.category.toLowerCase() === category.toLowerCase() || s.id === category.toLowerCase());
  return Response.json({ services: result, currency: "KES", pricing: "Starting prices, approve any additional work before it begins." });
}
