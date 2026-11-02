"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { SeedlingArtwork } from "./SeedlingArtwork";

const SaplingPlayer = dynamic(() => import("./SaplingPlayer"), { ssr: false, loading: () => <SeedlingArtwork /> });

export function GrowthIllustration() {
  const root = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(false);
  useEffect(() => {
    const element = root.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting && !preference.matches) setPlay(true); }, { threshold: 0.25 });
    const update = () => {
      if (preference.matches) setPlay(false);
      else { observer.unobserve(element); observer.observe(element); }
    };
    observer.observe(element);
    preference.addEventListener("change", update);
    return () => { observer.disconnect(); preference.removeEventListener("change", update); };
  }, []);
  return <div ref={root} data-growth-illustration aria-hidden="true" className="gbi-growth-illustration pointer-events-none mt-6 aspect-[12/7] w-full max-w-[320px]">{play ? <SaplingPlayer /> : <SeedlingArtwork />}</div>;
}
