import { PageHero } from "@/components/hero/PageHero";
import { ProgramCard } from "@/components/cards/ProgramCard";
import { programs } from "@/content/programs";
import { createMetadata } from "@/lib/seo";
export const metadata = createMetadata("Our work", "Explore Green Belt Initiative’s stated programme areas, including food security, WASH, environment, humanitarian response and livelihoods.");
export default function ProgramsPage() { return <main><PageHero eyebrow="OUR WORK" title="Integrated solutions for resilient communities." intro="Our programmes address immediate needs while strengthening the environmental, social and economic foundations people need to thrive." backgroundImage="/images/programmes/environment/wetland-lily-pads-01.jpg"/><section className="bg-[#e7e1ce] px-5 py-20 sm:px-10 lg:py-28"><div className="mx-auto max-w-[1240px]"><div className="grid gap-5 md:grid-cols-2">{programs.map(program => <div id={program.slug} key={program.slug}><ProgramCard program={program}/></div>)}</div></div></section></main>; }
