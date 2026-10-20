import type { NextRequest } from "next/server";
import { availability } from "@/lib/storage";
import { serviceIdSchema, dateSchema } from "@/lib/validation";
import { apiError, limit } from "@/lib/security";
import { isDemo } from "@/lib/runtime";
export async function GET(req: NextRequest) {
  try {
    const serviceId = serviceIdSchema.parse(req.nextUrl.searchParams.get("serviceId"));
    const date = dateSchema.parse(req.nextUrl.searchParams.get("date"));
    await limit(req, "availability", 60);
    return Response.json({ slots: await availability(serviceId, date), timezone: "Africa/Nairobi", demo: isDemo() });
  } catch (error) { return apiError(error); }
}
