import Image from "next/image";
import { notFound } from "next/navigation";
import { programs } from "@/content/programs";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { createMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return programs.map(program => ({ slug: program.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const program = programs.find(item => item.slug === params.slug);
  return createMetadata(program?.title ?? "Programme", program?.summary ?? "Explore Green Belt Initiative’s stated programme areas.");
}

export default function ProgrammeDetailPage({ params }: { params: { slug: string } }) {
  const program = programs.find(item => item.slug === params.slug);
  if (!program) notFound();

  return <main><section className="bg-[#153c2e] px-5 py-20 text-white sm:px-10 lg:py-28"><div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center"><div><p className="text-xs font-bold tracking-[.18em] text-[#d6e99a]">PROGRAMME {program.number}</p><h1 className="font-display mt-5 max-w-3xl text-5xl leading-[.98] tracking-[-.045em] sm:text-6xl">{program.title}</h1><p className="mt-7 max-w-2xl text-lg leading-7 text-white/75">{program.summary}</p></div>{program.imageSrc && <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/15"><Image src={program.imageSrc} alt={program.imageAlt ?? program.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" priority /></div>}</div></section><section className="px-5 py-20 sm:px-10 lg:py-24"><div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[1.1fr_.9fr]"><div><p className="gbi-eyebrow">PROGRAMME FOCUS</p><h2 className="font-display mt-5 text-4xl leading-tight text-[#17342a] sm:text-5xl">Practical work shaped by people and place.</h2><p className="mt-6 max-w-2xl text-lg leading-8 text-[#536b61]">GBI connects local priorities with practical support for communities and the environment.</p></div><div className="gbi-surface p-7"><p className="text-[.68rem] font-extrabold tracking-[.15em] text-[#1d6a4b]">LEARN MORE</p><p className="mt-3 text-sm leading-6 text-[#536b61]">Explore other GBI programmes or contact the team.</p><div className="mt-6 flex flex-wrap gap-3"><ButtonLink href="/programs" dark>All programmes</ButtonLink><ButtonLink href="/contact" secondary>Contact GBI</ButtonLink></div></div></div></section></main>;
}
