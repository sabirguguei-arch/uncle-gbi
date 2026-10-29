import Link from "next/link";
import { programs } from "@/content/programs";
import { publicProjects as projects } from "@/content/projects";
import { ProgramCard } from "@/components/cards/ProgramCard";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { WhereWeWork } from "@/components/sections/WhereWeWork";
import { DonationSection } from "@/components/sections/DonationSection";
import { WaysToSupport } from "@/components/sections/WaysToSupport";

export default function Home() { return <main>
  <section className="hero-image flex min-h-[660px] items-end px-5 pb-16 pt-24 text-white sm:px-10 lg:min-h-[720px] lg:pb-20"><div className="relative mx-auto w-full max-w-[1240px]"><p className="gbi-reveal mb-6 flex items-center gap-3 text-[.7rem] font-extrabold tracking-[.16em] text-[#f5e6bd]"><span className="h-px w-10 bg-[#d5a53e]"/>GREEN BELT INITIATIVE · SOUTH SUDAN</p><h1 className="gbi-reveal gbi-reveal-delay-1 font-display max-w-5xl text-5xl leading-[.96] tracking-[-.045em] sm:text-6xl lg:text-[78px]">Sustainable Local Solutions <em className="font-normal text-[#f5e6bd]">for a Resilient</em> South Sudan.</h1><p className="gbi-reveal gbi-reveal-delay-2 mt-7 max-w-2xl text-lg leading-7 text-white/85">GBI works with communities to address humanitarian, development and environmental challenges through practical, locally rooted action.</p><div className="gbi-reveal gbi-reveal-delay-3 mt-9 flex flex-wrap gap-3"><ButtonLink href="/programs">Explore Our Work</ButtonLink><ButtonLink href="/contact" secondary>Partner With Us</ButtonLink></div></div></section>

  <section className="px-5 py-20 sm:px-10 lg:py-28"><div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[.72fr_1.28fr]"><p className="gbi-eyebrow">ABOUT GBI</p><div><h2 className="font-display text-4xl leading-[1.08] tracking-[-.035em] text-[#17342a] sm:text-5xl">Local knowledge. Shared purpose. Sustainable solutions.</h2><p className="mt-6 max-w-2xl text-lg leading-8 text-[#536b61]">Green Belt Initiative is a South Sudanese humanitarian, development and environmental organization. Since 2016, our work has connected community priorities with practical action for a more resilient future.</p><Link href="/about" className="gbi-link mt-8 text-[#17342a]">Learn about GBI</Link></div></div></section>

  <section className="bg-[#e8e2d2] px-5 py-20 sm:px-10 lg:py-28"><div className="mx-auto max-w-[1240px]"><div className="flex flex-wrap items-end justify-between gap-6"><SectionHeading eyebrow="OUR WORK" title="Work that responds to people and place." intro="GBI connects humanitarian action, environmental stewardship and community resilience."/><Link href="/programs" className="gbi-link mb-1 text-[#17342a]">All programmes</Link></div><div className="mt-11 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{programs.map(program => <ProgramCard key={program.slug} program={program}/>)}</div></div></section>

  <WhereWeWork />

  <DonationSection />

  <WaysToSupport />

  <section className="px-5 py-20 sm:px-10 lg:py-28"><div className="mx-auto max-w-[1240px]"><div className="flex flex-wrap items-end justify-between gap-6"><SectionHeading eyebrow="FEATURED PROJECTS" title="Selected project activities." intro="Explore GBI activities in South Sudan."/><Link href="/projects" className="gbi-link mb-1 text-[#17342a]">View all projects</Link></div><div className="mt-11 grid gap-5 md:grid-cols-3">{projects.slice(0, 3).map(project => <ProjectCard key={project.slug} project={project}/>)}</div></div></section>

  <section className="px-5 pb-5 sm:px-10"><div className="grain mx-auto max-w-[1400px] bg-[#d5a53e] px-7 py-14 sm:px-12 lg:flex lg:items-center lg:justify-between lg:px-20 lg:py-16"><div><p className="gbi-eyebrow text-[#17342a]">COLLABORATE</p><h2 className="font-display mt-5 max-w-2xl text-4xl leading-tight text-[#17342a] sm:text-5xl">Work With Green Belt Initiative.</h2><p className="mt-4 max-w-xl leading-7 text-[#17342a]/75">Connect with GBI to explore locally led, sustainable collaboration in South Sudan.</p></div><div className="mt-8 lg:mt-0"><ButtonLink href="/contact" dark>Start a conversation</ButtonLink></div></div></section>
</main>; }
