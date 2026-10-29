"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { BrandMark } from "@/components/ui/BrandMark";
import { MainNavigation } from "@/components/navigation/MainNavigation";
import { DonateLink } from "@/components/ui/DonateLink";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !menuButtonRef.current?.contains(target)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
    menuButtonRef.current?.focus();
  }

  return <header className="sticky top-0 z-30 border-b border-white/10 bg-[#113e31]/95 text-white backdrop-blur"><div className="mx-auto flex max-w-[1400px] items-center justify-between gap-2 px-3 py-4 sm:px-5 lg:px-10"><Link href="/" className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3" aria-label="Green Belt Initiative home"><BrandMark/><span className="min-w-0 leading-none"><span className="block truncate text-xs font-bold tracking-[.08em] sm:text-lg">GREEN BELT INITIATIVE</span><span className="mt-1 hidden text-[9px] tracking-[.15em] text-white/75 sm:block">{site.tagline.toUpperCase()}</span></span></Link><nav aria-label="Primary navigation" className="hidden items-center gap-3 text-xs font-semibold xl:flex"><MainNavigation/></nav><div className="flex shrink-0 items-center gap-2"><DonateLink className="min-h-10 min-w-[92px] px-3 py-2 text-sm sm:min-h-14 sm:min-w-[168px] sm:px-8 sm:py-4 sm:text-base" /><button ref={menuButtonRef} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/30 sm:h-11 sm:w-11" onClick={() => setOpen(current => !current)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-navigation"><span className="space-y-1.5"><span className="block h-0.5 w-5 bg-white"/><span className="block h-0.5 w-5 bg-white"/><span className="block h-0.5 w-5 bg-white"/></span></button></div></div>{open && <nav ref={menuRef} id="mobile-navigation" aria-label="Mobile navigation" className="absolute right-0 top-full w-[min(78vw,420px)] border-t border-white/15 bg-[#113e31] px-5 pb-5 shadow-2xl"><p className="border-b border-white/15 pb-3 text-xs font-bold uppercase tracking-[.15em] text-[#f5e6bd]">Explore GBI</p><MainNavigation mobile onNavigate={closeMenu}/><div className="mt-3 border-t border-white/15 pt-3"><MainNavigation items={site.secondaryNavigation} mobile onNavigate={closeMenu}/></div></nav>}</header>;
}
