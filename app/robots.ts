import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/config";
export default function robots(): MetadataRoute.Robots {
  return { rules: process.env.NEXT_PUBLIC_SITE_URL ? [{ userAgent: "*", allow: "/", disallow: ["/api/", "/booking-confirmation", "/my-bookings", "/auth/"] }] : [{ userAgent: "*", disallow: "/" }], sitemap: `${siteUrl}/sitemap.xml` };
}
