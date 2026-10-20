import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/navigation";
import { SiteTools } from "@/components/site-tools";
import { siteUrl } from "@/lib/config";
import "../styles/app.css";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Hannah Home | Trusted hands. Happy home.", template: "%s | Hannah Home" },
  description: "Book house cleaning, plumbing, electrical, painting and home repairs in Nairobi. Vetted professionals, clear upfront prices and payment after the job.",
  robots: { index: !!process.env.NEXT_PUBLIC_SITE_URL, follow: !!process.env.NEXT_PUBLIC_SITE_URL },
  openGraph: { title: "Hannah Home", description: "Trusted hands. Happy home. Home services for Nairobi.", type: "website", locale: "en_KE", images: ["/images/home-interior.jpg"] },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-KE" data-scroll-behavior="smooth"><head>
    <link rel="preload" href="/fonts/poppins-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/>
    <link rel="stylesheet" href="/fonts/local.css"/>
    <link rel="stylesheet" href="/css/bootstrap.min.css"/>
    <link rel="stylesheet" href="/css/font-awesome.min.css"/>
    <link rel="stylesheet" href="/css/icomoon.css"/>
    <link rel="stylesheet" href="/css/template-local.css"/>
    <link rel="stylesheet" href="/css/responsive.css"/>
    <link rel="icon" href="/icon.svg" type="image/svg+xml"/>
  </head><body><a href="#main-content" className="skip-link">Skip to content</a><SiteHeader/><main id="main-content">{children}</main><SiteFooter/><SiteTools/><noscript><style>{".reveal{opacity:1!important;transform:none!important}.preloader{display:none!important}"}</style><p className="noscript-notice">JavaScript is needed for online booking. Call +254112272061 for help.</p></noscript></body></html>;
}
