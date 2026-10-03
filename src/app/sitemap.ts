import type { MetadataRoute } from "next";
import articlesData from "@/data/articles.json";
import toolsData from "@/data/tools.json";
import type { Article, LeanTool } from "@/types";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = articlesData as Article[];
  const latest = articles.reduce((max, a) => (a.date > max ? a.date : max), "2025-01-01");

  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/dao-tao`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/dao-tao-lean-six-sigma`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/dich-vu-tu-van`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/tri-thuc`, lastModified: latest, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/du-an`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/chuyen-gia`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/ve-chung-toi`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/toolkit`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/lien-he`, changeFrequency: "yearly", priority: 0.6 },
  ];

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/tri-thuc/${a.slug || a.id}`,
    lastModified: a.date,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const toolPages: MetadataRoute.Sitemap = (toolsData as LeanTool[]).map((t) => ({
    url: `${SITE_URL}/toolkit/${t.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...pages, ...articlePages, ...toolPages];
}
