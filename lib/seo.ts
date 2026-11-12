import type { Metadata } from "next";
import { site } from "@/content/site";
import { programs } from "@/content/programs";
import { absoluteUrl } from "@/lib/site-url";

type MetadataOptions = {
  path?: string;
  imagePath?: string;
  type?: "website" | "article";
};

export function createMetadata(title: string, description?: string, options: MetadataOptions = {}): Metadata {
  const pageTitleBase = title === "Our work" ? "Programmes" : title;
  const pageTitle = pageTitleBase.includes(site.name) ? pageTitleBase : `${pageTitleBase} | ${site.name}`;
  const pageDescription = description ?? site.description;
  const imagePath = options.imagePath ?? "/logo/gbi-logo.jpg";
  const image = { url: absoluteUrl(imagePath), alt: `${site.name} logo` };
  const matchingProgram = programs.find(program => program.title === title);
  const inferredPath = title === "Our work" ? "/programs" : matchingProgram ? `/programs/${matchingProgram.slug}` : "/";
  return {
    title: pageTitleBase,
    description: pageDescription,
    alternates: { canonical: absoluteUrl(options.path ?? inferredPath) },
    openGraph: { title: pageTitle, description: pageDescription, siteName: site.name, type: options.type ?? "website", locale: "en", url: absoluteUrl(options.path ?? inferredPath), images: [image] },
    twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription, images: [image.url] },
  };
}
