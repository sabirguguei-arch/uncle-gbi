"use client";

import { usePathname } from "next/navigation";
import { BackButton } from "@/components/navigation/BackButton";

export function InnerPageBack() {
  const pathname = usePathname();
  const shouldRender = pathname !== "/";

  if (!shouldRender) return null;

  return (
    <div className="bg-[#153c2e] px-5 py-4 sm:px-10">
      <div className="mx-auto max-w-[1240px]">
        <BackButton />
      </div>
    </div>
  );
}
