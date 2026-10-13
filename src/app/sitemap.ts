import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";
const routes = ["", "/about", "/cybersecurity", "/ai-automation", "/networking", "/it-support", "/certifications", "/contact", "/resume"];
export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({ url: `${SITE.url}${r}`, lastModified: new Date() }));
}
