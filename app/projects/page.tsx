import { PageHero } from "@/components/hero/PageHero";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { publicProjects as projects } from "@/content/projects";
import { createMetadata } from "@/lib/seo";
export const metadata = createMetadata("Projects", "Explore Green Belt Initiative project activities in South Sudan.");
export default function ProjectsPage() { return <main><PageHero eyebrow="PROJECTS" title="Practical change, shaped with communities." intro="Explore GBI activities in Aweil East, Twic East and Duk County." backgroundImage="/images/projects/gbi-profile/twic-east-water-treatment-2020.png"/><section className="px-5 py-20 sm:px-10 lg:py-28"><div className="mx-auto max-w-[1240px]"><SectionHeading eyebrow="PROJECT ACTIVITIES" title="Work shaped by people and place." intro="Explore selected activities across water, sanitation, agriculture, food security and livelihoods."/><div className="mt-12 grid gap-5 md:grid-cols-3">{projects.map(project => <ProjectCard key={project.slug} project={project}/>)}</div></div></section></main>; }
