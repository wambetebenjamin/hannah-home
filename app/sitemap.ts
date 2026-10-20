import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/config";
import { services } from "@/lib/catalog";
export default function sitemap(): MetadataRoute.Sitemap { return ["", "/services", "/professionals", "/contact", "/legal/privacy-policy", "/legal/terms", "/legal/cookie-policy", ...services.map(s => `/services/${s.slug}`)].map(path => ({ url: `${siteUrl}${path}`, lastModified: new Date("2026-10-20T00:00:00+03:00"), changeFrequency: "monthly", priority: path === "" ? 1 : .7 })); }
