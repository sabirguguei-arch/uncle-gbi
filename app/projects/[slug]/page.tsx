import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { publicProjects as projects } from "@/content/projects";
import { PageHero } from "@/components/hero/PageHero";

export function generateStaticParams() { return projects.map(project => ({ slug: project.slug })); }

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = projects.find(item => item.slug === params.slug);
  return project ? { title: `${project.title} | GBI`, description: project.summary, openGraph: { title: `${project.title} | GBI`, description: project.summary, type: "article" } } : { title: "Project not found | GBI" };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projects.find(item => item.slug === params.slug);
  if (!project) notFound();

  return <main>
    <PageHero eyebrow={`${project.category.toUpperCase()} · ${project.location.toUpperCase()}`} title={project.title} intro={project.summary}/>
    <article className="mx-auto max-w-5xl px-5 py-16 leading-8 text-[#466256] sm:px-10 lg:py-20">
      {project.activities && <section aria-labelledby="project-activities-heading" className="mt-12"><h2 id="project-activities-heading" className="font-display text-3xl text-[#17342a]">Key activities</h2><ul className="mt-5 list-disc space-y-2 pl-6">{project.activities.map(activity => <li key={activity}>{activity}</li>)}</ul></section>}
      {project.reportedOutcomes && <section aria-labelledby="project-outcomes-heading" className="mt-12"><h2 id="project-outcomes-heading" className="font-display text-3xl text-[#17342a]">Reported outcomes</h2><ul className="mt-5 list-disc space-y-2 pl-6">{project.reportedOutcomes.map(outcome => <li key={outcome}>{outcome}</li>)}</ul></section>}
      {project.media && <section aria-labelledby="project-media-heading" className="mt-12">
        <h2 id="project-media-heading" className="font-display text-3xl text-[#17342a]">Activity media</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {project.media.map(image => <figure key={image.src} className="overflow-hidden border border-[#d1d5c7] bg-[#e8e2d2] p-2"><Image src={image.src} alt={image.alt} width={image.width} height={image.height} className="h-auto w-full" />{image.caption && <figcaption className="px-2 py-3 text-sm leading-6 text-[#536b61]">{image.caption}</figcaption>}</figure>)}
        </div>
      </section>}
      {project.video && <section aria-labelledby="project-video-heading" className="mt-12">
        <h2 id="project-video-heading" className="font-display text-3xl text-[#17342a]">Field training video</h2>
        <figure className="mt-6 overflow-hidden border border-[#d1d5c7] bg-[#e8e2d2] p-2">
          <video className="h-auto w-full" controls playsInline preload="metadata" poster={project.video.poster} aria-label={project.video.title}>
            <source src={project.video.src} type="video/mp4" />
            Your browser does not support the video element.
          </video>
          <figcaption className="px-2 py-3 text-sm text-[#536b61]">{project.video.description}</figcaption>
        </figure>
      </section>}
      {project.verificationNote && project.slug !== "twic-east-emergency-wash" && <p className="mt-10 max-w-3xl text-sm text-[#536b61]">{project.verificationNote}</p>}
      <Link className="mt-10 inline-block border-b border-[#153c2e] pb-2 font-bold text-[#153c2e]" href="/projects">Back to projects</Link>
    </article>
  </main>;
}
