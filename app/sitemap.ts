import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/about", "/programs", "/projects", "/contact", "/get-involved"];
  return routes.map(url => ({ url: absoluteUrl(url), changeFrequency: "monthly", priority: url === "/" ? 1 : 0.7 }));
}
