import React from "react";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { CtaBand } from "@/components/ui";
import expertsData from "@/data/experts.json";
import type { Expert } from "@/types";

export const metadata = {
  title: "Đội Ngũ Chuyên Gia Thực Chiến — WISE Academy",
  description: "Đội ngũ chuyên gia Lean Six Sigma, chẩn đoán vận hành doanh nghiệp, tự động hóa và quản lý chất lượng với nhiều năm kinh nghiệm tại các tập đoàn đa quốc gia.",
  alternates: { canonical: "/chuyen-gia" },
};

export default function ExpertsPage() {
  const experts: Expert[] = expertsData as Expert[];
  const groups = [
    {
      id: "vietnam",
      eyebrow: "Nhóm 01",
      title: "Chuyên gia Việt Nam",
      description: "Những người từng trực tiếp điều hành, cải tiến vận hành tại doanh nghiệp trong và ngoài nước — hiểu rõ thực tế hiện trường và văn hóa doanh nghiệp Việt Nam.",
      list: experts.filter((e) => e.group !== "international"),
    },
    {
      id: "international",
      eyebrow: "Nhóm 02",
      title: "Chuyên gia nước ngoài",
      description: "Các chuyên gia quốc tế với hàng chục năm kinh nghiệm tại tập đoàn đa quốc gia, mang chuẩn mực Lean Six Sigma toàn cầu đến doanh nghiệp tại Việt Nam và châu Á.",
      list: experts.filter((e) => e.group === "international"),
    },
  ];

  const trust = [
    { value: "100%", label: "Từng trực tiếp điều hành vận hành tại doanh nghiệp lớn" },
    { value: "30+", label: "Năm kinh nghiệm cao nhất của chuyên gia" },
    { value: "Thực chiến", label: "Cầm tay chỉ việc trực tiếp trên máy móc" },
    { value: "Cam kết", label: "Kèm cặp tại hiện trường đến khi ra kết quả" },
  ];

  return (
    <div className="bg-[#F8F9FA]">
      <PageHero
        eyebrow="Đội ngũ chuyên gia thực chiến"
        image="/images/projects/huali-group-khoa-dao-tao-tu-duy-va-ky-thuat-cai-tien-nang-suat-chuyen/photo_11.webp"
        title={<>Chuyên gia đồng hành: <span className="text-[#FF7A30]">người thật,</span> kinh nghiệm vận hành thật</>}
        description="Các chuyên gia của WISE không giảng lý thuyết sách vở. Họ từng trực tiếp làm Giám đốc Nhà máy, Quản lý Sản xuất nhiều năm tại các tập đoàn lớn như Nike, Pou Chen, AG Samho, Dean Shoes."
      />

      {/* Trust factors */}
      <section className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6">
        <dl className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {trust.map((t) => (
            <div key={t.label}>
              <dd className="text-2xl sm:text-3xl font-bold text-[#002F5B]">{t.value}</dd>
              <dt className="mt-1 text-xs sm:text-sm text-[#486581]">{t.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Experts, grouped: Vietnamese experts, then foreign experts */}
      {groups.map((g, gi) => (
        <section key={g.id} className={`py-16 lg:py-20 px-4 sm:px-6 ${gi % 2 ? "bg-white" : ""}`}>
          <div className="max-w-6xl mx-auto">
            <div className="mb-10 max-w-3xl">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C9500E]">
                {g.eyebrow} · {g.list.length} chuyên gia
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-[#002F5B]">{g.title}</h2>
              <p className="mt-2 text-sm sm:text-base text-[#486581] leading-relaxed">{g.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {g.list.map((exp) => (
                <article key={exp.id} className="card-soft flex flex-col px-6 sm:px-8 pt-8 pb-7 text-center">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-white shadow-md bg-slate-100">
                    {exp.image ? (
                      <img src={exp.image} alt={exp.name} className="w-full h-full object-cover object-top" loading="lazy" />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center bg-[#002F5B] text-white text-3xl font-bold">
                        {exp.name.split(" ").pop()?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <p className="mt-5 text-[11px] font-bold uppercase tracking-wider text-[#C9500E]">{exp.role}</p>
                  <h3 className="mt-2 text-xl font-semibold text-[#002F5B]">{exp.name}</h3>
                  <p className="mt-3 text-xs font-medium text-[#002F5B] bg-[#EBF3FA] px-3 py-2 rounded-lg">{exp.title}</p>
                  <p className="mt-4 text-sm text-[#486581] leading-relaxed">{exp.bio}</p>
                  <div className="mt-auto pt-5">
                    <ul className="flex flex-wrap justify-center gap-1.5 pt-5 border-t border-slate-100">
                      {exp.tags.map((t) => (
                        <li key={t} className="text-[11px] bg-[#F8F9FA] border border-slate-200 text-[#486581] px-2.5 py-0.5 rounded-full">
                          {t}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/lien-he?expert=${encodeURIComponent(exp.name)}`}
                      className="mt-5 block w-full py-2.5 rounded-full border border-[#002F5B] text-[#002F5B] hover:bg-[#002F5B] hover:text-white text-sm font-semibold transition-colors"
                    >
                      Đặt lịch trao đổi
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      <CtaBand
        title="Đúng chuyên gia, đúng bài toán hiện trường"
        description="Liên hệ với chúng tôi để sắp xếp lịch làm việc trực tiếp với chuyên gia phù hợp nhất cho lĩnh vực của bạn."
        label="Kết nối với chuyên gia"
      />
    </div>
  );
}
