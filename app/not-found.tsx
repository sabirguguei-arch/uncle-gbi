import Link from "next/link";

export default function NotFound() {
  return <main className="bg-[#f7f5ee] px-5 py-24 sm:px-10 lg:py-36">
    <div className="mx-auto max-w-3xl">
      <p className="gbi-eyebrow">PAGE NOT FOUND</p>
      <h1 className="font-display mt-5 text-5xl leading-tight text-[#17342a] sm:text-6xl">This page is not available.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-[#536b61]">The link may be outdated or the page may have moved.</p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Link href="/" className="rounded-full bg-[#153c2e] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#1d6a4b]">Return home</Link>
        <Link href="/contact" className="rounded-full border border-[#153c2e] px-6 py-3.5 text-sm font-bold text-[#153c2e] hover:bg-[#e8e2d2]">Contact GBI</Link>
      </div>
    </div>
  </main>;
}
