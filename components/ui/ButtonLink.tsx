import Link from "next/link";
import { Arrow } from "./Icon";

export function ButtonLink({ href, children, dark = false, secondary = false }: { href: string; children: React.ReactNode; dark?: boolean; secondary?: boolean }) {
  const style = secondary ? "border border-current bg-transparent text-current hover:bg-white/10" : dark ? "bg-[#113e31] text-white hover:bg-[#1d6a4b]" : "bg-[#d5a53e] text-[#17342a] hover:bg-[#e4b952]";
  return <Link href={href} className={`gbi-button inline-flex min-h-12 items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-colors duration-200 ${style}`}>{children}<Arrow /></Link>;
}
