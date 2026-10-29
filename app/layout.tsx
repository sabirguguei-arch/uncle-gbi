import type { Metadata } from "next";
import { InnerPageBack } from "@/components/navigation/InnerPageBack";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "Green Belt Initiative | South Sudan",
  description: "A national organization advancing resilient communities and a sustainable South Sudan.",
  applicationName: "Green Belt Initiative",
  openGraph: { title: "Green Belt Initiative | South Sudan", description: "A national organization advancing resilient communities and a sustainable South Sudan.", siteName: "Green Belt Initiative", type: "website", locale: "en" },
  twitter: { card: "summary_large_image", title: "Green Belt Initiative | South Sudan", description: "A national organization advancing resilient communities and a sustainable South Sudan." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-[#f5e6bd] focus:px-4 focus:py-3 focus:font-bold focus:text-[#17342a]">Skip to main content</a><div className="bg-[#153c2e] px-5 py-2.5 text-center text-xs font-medium tracking-[.08em] text-[#dce9b7]">Working with communities for a greener, more resilient South Sudan.</div><SiteHeader /><InnerPageBack /><div id="main-content" tabIndex={-1}>{children}</div><SiteFooter /></body></html>;
}
