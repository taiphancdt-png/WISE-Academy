import KnowledgeClient, { type KnowledgeItem } from "@/components/KnowledgeClient";
import articlesData from "@/data/articles.json";
import type { Article } from "@/types";
import { cleanExcerpt, normalize, plainText } from "@/lib/text";

export const metadata = {
  title: "Góc tri thức Lean Six Sigma — WISE Academy",
  description:
    "Hơn 100 bài viết thực tế về Lean Six Sigma, DMAIC, 5S, TPM, công cụ chất lượng, giải quyết vấn đề và case study cải tiến năng suất nhà máy.",
  alternates: { canonical: "/tri-thuc" },
};

// Server component: sends a slim, pre-normalized list to the client instead of every article's full data.
export default function KnowledgePage() {
  const articles: KnowledgeItem[] = (articlesData as Article[]).map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    category: a.category,
    topics: a.topics,
    date: a.date,
    readTime: a.readTime,
    thumbnail: a.thumbnail,
    excerpt: cleanExcerpt(a.title, a.excerpt),
    searchTitle: normalize(a.title),
    searchBody: normalize(`${a.excerpt} ${plainText(a.content)}`),
  }));

  return <KnowledgeClient articles={articles} />;
}
