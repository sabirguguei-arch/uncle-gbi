import type { MetadataRoute } from "next";
import { programs } from "@/content/programs";
import { publicProjects } from "@/content/projects";
import { absoluteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/about", "/programs", "/projects", "/news", "/contact", "/get-involved"];
  const programmeRoutes = programs.map(program => `/programs/${program.slug}`);
  const projectRoutes = publicProjects.map(project => `/projects/${project.slug}`);
  const routes = [...staticRoutes, ...programmeRoutes, ...projectRoutes];
  return routes.map(url => ({ url: absoluteUrl(url), changeFrequency: "monthly", priority: url === "/" ? 1 : 0.7 }));
}
