import Link from "next/link";
import { site } from "@/content/site";
import { BrandMark } from "@/components/ui/BrandMark";
import { ContactIcon } from "@/components/ui/ContactIcon";

export function SiteFooter() {
  return (
    <footer className="bg-[#113e31] px-5 py-12 text-white sm:px-10 lg:py-16">
      <div className="mx-auto max-w-[1240px]">
        <div className="grid gap-12 border-b border-white/15 pb-12 md:grid-cols-[1.15fr_.8fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <BrandMark size="sm" />
              <span className="text-sm font-bold tracking-[.1em]">GREEN BELT INITIATIVE</span>
            </div>
            <p className="mt-5 max-w-xs font-display text-2xl leading-tight text-[#f5e6bd]">{site.tagline}</p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-white/65">Locally rooted work for a more resilient South Sudan.</p>
          </div>

          <div>
            <p className="text-[.68rem] font-extrabold uppercase tracking-[.14em] text-[#f5e6bd]">Quick links</p>
            <nav aria-label="Footer navigation" className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-white/75">
              {site.navigation.map(item => <Link className="transition-colors hover:text-[#f5e6bd]" key={item.href} href={item.href}>{item.label}</Link>)}
              <Link className="transition-colors hover:text-[#f5e6bd]" href="/#donation">Donate</Link>
              <Link className="transition-colors hover:text-[#f5e6bd]" href="/get-involved">Get Involved</Link>
            </nav>
          </div>

          <div>
            <p className="text-[.68rem] font-extrabold uppercase tracking-[.14em] text-[#f5e6bd]">Contact</p>
            <address className="mt-5 not-italic text-sm leading-6 text-white/75">
              {site.address.map(line => <span key={line} className="block">{line}</span>)}
              <a aria-label={`Call ${site.phone}`} className="mt-3 flex min-h-11 items-center gap-2 font-semibold text-[#f5e6bd] transition-colors hover:text-white" href={`tel:${site.phone.replaceAll(" ", "")}`}>
                <ContactIcon name="phone" /><span>{site.phone}</span>
              </a>
              <a aria-label={`Email ${site.email}`} className="flex min-h-11 min-w-0 items-center gap-2 font-semibold text-[#f5e6bd] transition-colors hover:text-white" href={`mailto:${site.email}`}>
                <ContactIcon name="email" /><span className="break-all">{site.email}</span>
              </a>
            </address>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-3 pt-7 text-xs text-white/50 sm:flex-row">
          <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
