import HomeClient from "@/components/HomeClient";
import { LSSI_PROGRAMS } from "@/data/lssi-programs";
import coursesData from "@/data/courses.json";
import projectsData from "@/data/projects.json";
import expertsData from "@/data/experts.json";
import articlesData from "@/data/articles.json";
import type { Course, Project, Expert, Article } from "@/types";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "WISE Academy | Đồng hành tối ưu vận hành, năng suất, chất lượng",
  description:
    "WISE Academy đồng hành cùng doanh nghiệp tối ưu vận hành, tăng năng suất và chất lượng bền vững qua tư vấn hiện trường và đào tạo Lean Six Sigma, 5S, TPM.",
  path: "/",
});

// Server component: picks the few records the homepage shows, so the full data files never reach the browser.
export default function HomePage() {
  const courses = coursesData as Course[];
  const articles = articlesData as Article[];

  const featuredProjects = (projectsData as Project[])
    .filter((p) => !p.client.includes("(bỏ)"))
    .slice(0, 3)
    .map(({ id, client, title, highlight, results, cover, gallery }) => ({
      id,
      client,
      title,
      highlight,
      results,
      cover,
      gallery: gallery?.slice(0, 1),
    }));

  const experts = (expertsData as Expert[]).slice(0, 4).map(({ id, name, image, role, bio }) => ({ id, name, image, role, bio }));

  const featuredArticles = [...articles]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)
    .map(({ id, slug, title, thumbnail, category, excerpt, date, readTime }) => ({
      id,
      slug,
      title,
      thumbnail,
      category,
      excerpt,
      date,
      readTime,
    }));

  return (
    <HomeClient
      courseCount={courses.filter((c) => c.category !== "Lean Six Sigma chuẩn quốc tế").length + LSSI_PROGRAMS.length}
      featuredProjects={featuredProjects}
      experts={experts}
      featuredArticles={featuredArticles}
      articleCount={articles.length}
    />
  );
}
