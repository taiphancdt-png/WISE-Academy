import TrainingClient from "@/components/TrainingClient";
import coursesData from "@/data/courses.json";
import type { Course } from "@/types";
import { SITE_URL, jsonLd, metaDescription } from "@/lib/seo";

export const metadata = {
  title: "Đào tạo Lean Six Sigma, 5S, TPM thực chiến cho doanh nghiệp — WISE Academy",
  description:
    "Các chương trình đào tạo Lean Six Sigma Yellow Belt, Green Belt, 5S, TPM/OEE, Lean 4.0 và workshop mô phỏng cho lãnh đạo, quản lý và kỹ sư doanh nghiệp.",
  alternates: { canonical: "/dao-tao" },
};

export default function TrainingPage() {
  const courses = coursesData as Course[];
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: courses.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Course",
              name: c.title,
              description: metaDescription(c.summary, 250),
              url: `${SITE_URL}/dao-tao#${c.id}`,
              provider: { "@id": `${SITE_URL}/#organization` },
              inLanguage: "vi",
            },
          })),
        })}
      />
      <TrainingClient courses={courses} />
    </>
  );
}
