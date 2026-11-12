import { MotionEffects } from "@/components/motion/MotionEffects";
import type { Metadata } from "next";
import { InnerPageBack } from "@/components/navigation/InnerPageBack";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { absoluteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  metadataBase: new URL("https://gbisouthsudan.org"),
  title: { default: "Green Belt Initiative | South Sudan", template: "%s | Green Belt Initiative" },
  description: "Green Belt Initiative works with communities on sustainable local solutions for humanitarian, development and environmental challenges in South Sudan.",
  applicationName: "Green Belt Initiative",
  alternates: { canonical: absoluteUrl("/") },
  icons: { icon: [{ url: "/logo/gbi-logo.jpg", type: "image/jpeg" }], apple: "/logo/gbi-logo.jpg" },
  openGraph: { title: "Green Belt Initiative | South Sudan", description: "Green Belt Initiative works with communities on sustainable local solutions for humanitarian, development and environmental challenges in South Sudan.", siteName: "Green Belt Initiative", type: "website", locale: "en", url: absoluteUrl("/"), images: [{ url: absoluteUrl("/logo/gbi-logo.jpg"), alt: "Green Belt Initiative logo" }] },
  twitter: { card: "summary_large_image", title: "Green Belt Initiative | South Sudan", description: "Green Belt Initiative works with communities on sustainable local solutions for humanitarian, development and environmental challenges in South Sudan.", images: [absoluteUrl("/logo/gbi-logo.jpg")] },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  "@id": "https://gbisouthsudan.org/#organization",
  name: "Green Belt Initiative",
  url: "https://gbisouthsudan.org",
  logo: absoluteUrl("/logo/gbi-logo.jpg"),
  description: "Green Belt Initiative works with communities on sustainable local solutions for humanitarian, development and environmental challenges in South Sudan.",
  telephone: "+211 928 537 788",
  email: "green.beltinitiative@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Plot 64, 500m off Bilpam Road",
    addressLocality: "Juba Nabari",
    addressCountry: "South Sudan",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} /><MotionEffects /><a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-[#f5e6bd] focus:px-4 focus:py-3 focus:font-bold focus:text-[#17342a]">Skip to main content</a><div className="bg-[#153c2e] px-5 py-2.5 text-center text-xs font-medium tracking-[.08em] text-[#dce9b7]">Working with communities for a greener, more resilient South Sudan.</div><SiteHeader /><InnerPageBack /><div id="main-content" tabIndex={-1}>{children}</div><SiteFooter /></body></html>;
}
