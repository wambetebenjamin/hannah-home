import { NextRequest, NextResponse } from "next/server";
import { isDemo } from "@/lib/runtime";
import { seedDemo } from "@/lib/storage";
import { assertOrigin, apiError, HttpError, signTicket, limit } from "@/lib/security";
export async function POST(req: NextRequest) {
  try {
    if (!isDemo()) throw new HttpError(404, "Not found."); assertOrigin(req); await limit(req, "demo-signin", 8);
    const email = "preview@hannahhome.example"; seedDemo(email);
    const response = NextResponse.json({ success: true, demo: true });
    response.cookies.set("hh_demo_session", signTicket({ purpose: "demo_session", email, name: "Preview Guest" }, 3600), { httpOnly: true, secure: req.nextUrl.protocol === "https:", sameSite: "lax", path: "/", maxAge: 3600 });
    return response;
  } catch (error) { return apiError(error); }
}
export async function DELETE(req: NextRequest) {
  try { if (!isDemo()) throw new HttpError(404, "Not found."); assertOrigin(req); const response = NextResponse.json({ success: true }); response.cookies.delete("hh_demo_session"); return response; }
  catch (error) { return apiError(error); }
}
