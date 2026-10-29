"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function BackButton() {
  const pathname = usePathname();
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    let previousTrackedPath: string | undefined;
    try {
      const trackedPaths = JSON.parse(sessionStorage.getItem("gbi-route-history") || "[]") as string[];
      previousTrackedPath = trackedPaths.at(-1);
      if (previousTrackedPath !== pathname) {
        sessionStorage.setItem("gbi-route-history", JSON.stringify([...trackedPaths.slice(-20), pathname]));
      }
    } catch {
      previousTrackedPath = undefined;
    }

    let sameOriginReferrer = false;
    try {
      const previousUrl = document.referrer ? new URL(document.referrer) : undefined;
      sameOriginReferrer = Boolean(previousUrl && previousUrl.origin === window.location.origin && previousUrl.pathname !== pathname);
    } catch {
      sameOriginReferrer = false;
    }

    setCanGoBack(window.history.length > 1 && (sameOriginReferrer || Boolean(previousTrackedPath && previousTrackedPath !== pathname)));
  }, [pathname]);

  function handleClick() {
    if (canGoBack) {
      router.back();
      return;
    }

    router.push("/");
  }

  return <button type="button" onClick={handleClick} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/25 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-[#d5a53e] hover:text-[#f5e6bd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5e6bd]"><svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg><span>Back</span></button>;
}
