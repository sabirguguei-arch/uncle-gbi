import Link from "next/link";
import Image from "next/image";
import { createMetadata } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Timeline } from "@/components/sections/Timeline";

export const metadata = createMetadata("About GBI", "Learn about Green Belt Initiative, a South Sudanese humanitarian, development and environmental organization operating since 2016.");

export default function AboutPage() {
  return <main>
    <section className="about-terrain relative overflow-hidden px-5 py-20 text-white sm:px-10 lg:py-28">
      <Image src="/images/projects/gbi-profile/aweil-east-wash-assessment-2019.jpeg" alt="" aria-hidden="true" width={1040} height={780} sizes="(max-width: 640px) 440px, (max-width: 1024px) 620px, 760px" className="pointer-events-none absolute -right-24 top-1/2 z-0 h-[440px] w-[440px] -translate-y-1/2 object-cover opacity-25 mix-blend-multiply sm:-right-28 sm:h-[620px] sm:w-[620px] lg:-right-20 lg:h-[760px] lg:w-[760px]" />
      <div className="relative z-10 mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
        <div>
          <p className="flex items-center gap-3 text-[.7rem] font-extrabold tracking-[.16em] text-[#f5e6bd]"><span className="h-px w-10 bg-[#d5a53e]" />ABOUT GBI</p>
          <h1 className="font-display mt-6 max-w-4xl text-5xl leading-[.96] tracking-[-.045em] sm:text-6xl lg:text-7xl">A national organization for <em className="font-normal text-[#f5e6bd]">sustainable</em> local solutions.</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/80">Green Belt Initiative (GBI) is a national non-governmental humanitarian and development organization operating in South Sudan since 2016 promoting sustainable utilization of environment including water resources, agriculture, fisheries and related sectors for socio-economic benefit of all generations – for better human health, terrestrial ecosystems and biodiversity.</p>
        </div>
        <div className="border border-white/20 bg-white/5 p-6 backdrop-blur-sm sm:p-7">
          <p className="text-[.68rem] font-extrabold uppercase tracking-[.15em] text-[#f5e6bd]">At a glance</p>
          <dl className="mt-6 divide-y divide-white/15">
            <div className="py-4 first:pt-0"><dt className="text-xs font-bold uppercase tracking-[.12em] text-white/50">Established operations</dt><dd className="mt-1 font-display text-3xl">Since 2016</dd></div>
            <div className="py-4"><dt className="text-xs font-bold uppercase tracking-[.12em] text-white/50">Organization</dt><dd className="mt-1 text-base leading-6 text-white/85">National non-governmental humanitarian and development organization</dd></div>
            <div className="pb-0 pt-4"><dt className="text-xs font-bold uppercase tracking-[.12em] text-white/50">Country of operation</dt><dd className="mt-1 font-display text-2xl">South Sudan</dd></div>
          </dl>
        </div>
      </div>
    </section>

    <section className="bg-[#f1efe7] px-5 py-16 sm:px-10 lg:py-20"><div className="mx-auto grid max-w-[1240px] gap-8 lg:grid-cols-[.72fr_1.28fr]"><div><p className="gbi-eyebrow">ABOUT GBI</p><h2 className="font-display mt-5 text-4xl leading-[1.08] tracking-[-.035em] text-[#17342a] sm:text-5xl">A South Sudanese organization focused on environment and humanitarian action.</h2></div><div className="max-w-2xl text-lg leading-8 text-[#536b61]"><p>GBI works across environmental protection, water resources, agriculture, fisheries and related sectors, connecting humanitarian and development work with local priorities.</p></div></div></section>

    <section className="bg-[#e8e2d2] px-5 py-20 sm:px-10 lg:py-28"><div className="mx-auto grid max-w-[1240px] gap-14 lg:grid-cols-[.72fr_1.28fr]"><SectionHeading eyebrow="OUR HISTORY" title="A history that begins in 2016." intro="GBI was established in Juba and registered as a national NGO later that year."/><Timeline entries={[{ label: "14 May 2016", title: "GBI was established in Juba", description: "Green Belt Initiative was established by seven founding members in Juba, South Sudan, in response to environmental, water, climate and socio-economic challenges facing the country." }, { label: "19 September 2016", title: "National NGO registration", description: "GBI was legally registered by the Relief and Rehabilitation Commission to work in environment, climate change, water resources, agribusiness, wildlife conservation and fisheries." }, { label: "Ongoing purpose", title: "Sustainable local solutions", description: "GBI seeks sustainable solutions and improved quality of human life by creating a working environment that promotes productivity." }]}/></div></section>

    <section className="bg-white px-5 py-20 sm:px-10 lg:py-28"><div className="mx-auto grid max-w-[1240px] gap-6 md:grid-cols-3"><div className="gbi-surface p-7"><p className="gbi-eyebrow">VISION</p><p className="mt-4 text-lg leading-8 text-[#536b61]">To promote sustainable utilization of environment including water resources, agriculture, fisheries and related sectors for socio-economic benefit of all generations for better human health, terrestrial ecosystems and biodiversity.</p></div><div className="gbi-surface p-7"><p className="gbi-eyebrow">MISSION</p><p className="mt-4 text-lg leading-8 text-[#536b61]">To be a leading national campaigner for viable development agenda and environmental protection, climate change so as to brace economic growth and development.</p></div><div className="gbi-surface p-7"><p className="gbi-eyebrow">GOAL</p><p className="mt-4 text-lg leading-8 text-[#536b61]">To find sustainable solutions and improved quality of human life by creating working environment that promotes productivity.</p></div></div></section>

    <section className="bg-[#113e31] px-5 py-20 text-white sm:px-10 lg:py-28"><div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[.72fr_1.28fr] lg:items-start"><div><p className="gbi-eyebrow text-[#f5e6bd]">AREAS OF OPERATION</p><h2 className="font-display mt-5 text-4xl leading-[1.06] sm:text-5xl">Working with communities across South Sudan.</h2></div><div><p className="max-w-2xl text-lg leading-8 text-white/75">GBI has worked in Aweil East, Aweil North, Twic East, Duk and Bor South. These locations reflect past GBI activities and are not a statement of current coverage.</p><Link href="/projects" className="gbi-link mt-8 text-[#f5e6bd]">View project activities</Link></div></div></section>

    <section className="bg-[#f1efe7] px-5 py-20 sm:px-10 lg:py-28"><div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[.72fr_1.28fr]"><SectionHeading eyebrow="ORGANIZATION" title="Green Belt Initiative at a glance."/><dl className="grid gap-px overflow-hidden border border-[#d1d5c7] bg-[#d1d5c7] sm:grid-cols-2">{[["Organization type", "National non-governmental humanitarian and development organization"], ["Country of operation", "South Sudan"], ["Operating since", "2016"], ["Registration", "Relief and Rehabilitation Commission, 19 September 2016"]].map(([term, detail]) => <div key={term} className="bg-white p-6"><dt className="text-[.67rem] font-extrabold uppercase tracking-[.14em] text-[#1e6685]">{term}</dt><dd className="mt-3 font-display text-2xl leading-tight text-[#17342a]">{detail}</dd></div>)}</dl></div></section>

    <section className="px-5 pb-5 sm:px-10"><div className="grain mx-auto max-w-[1400px] bg-[#d5a53e] px-7 py-14 sm:px-12 lg:flex lg:items-center lg:justify-between lg:px-20 lg:py-16"><div><p className="gbi-eyebrow text-[#17342a]">WORK WITH GBI</p><h2 className="font-display mt-5 max-w-2xl text-4xl leading-tight text-[#17342a] sm:text-5xl">Partner for sustainable local solutions.</h2></div><div className="mt-8 lg:mt-0"><ButtonLink href="/contact" dark>Contact Green Belt Initiative</ButtonLink></div></div></section>
  </main>;
}
