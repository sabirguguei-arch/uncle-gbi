"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Progressive enhancement: server output and browsers without JS stay visible. */
export function MotionEffects() {
  const pathname = usePathname();
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    const elements = Array.from(document.querySelectorAll<HTMLElement>(
      "[data-reveal], [data-stagger] > *, [data-motion-section] section > div > *",
    ));
    function reset() {
      observer?.disconnect();
      elements.forEach(element => {
        delete element.dataset.motion;
        element.style.removeProperty("--reveal-delay");
      });
    }
    function enhance() {
      reset();
      if (preference.matches || !("IntersectionObserver" in window)) return;
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.motion = "visible";
          observer?.unobserve(entry.target);
        });
      }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });
      elements.forEach(element => {
        const parent = element.parentElement;
        if (parent?.hasAttribute("data-stagger")) {
          const columns = getComputedStyle(parent).gridTemplateColumns.split(" ").length;
          const index = Array.from(parent.children).indexOf(element);
          element.style.setProperty("--reveal-delay", `${(index % Math.max(columns, 1)) * 85}ms`);
        }
        // Do not hide content already visible on first paint or restored scroll.
        if (element.getBoundingClientRect().top < window.innerHeight) return;
        element.dataset.motion = "pending";
        observer?.observe(element);
      });
    }
    enhance();
    preference.addEventListener("change", enhance);
    return () => { reset(); preference.removeEventListener("change", enhance); };
  }, [pathname]);
  return null;
}
