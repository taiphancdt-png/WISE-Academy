import React from "react";
import Link from "next/link";
import { 
  Building2, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  ArrowUpRight,
  Factory,
  BarChart3,
  Award
} from "lucide-react";
import SectionBadge from "@/components/SectionBadge";
import PageHero from "@/components/PageHero";
import projectsData from "@/data/projects.json";
import type { Project } from "@/types";

export const metadata = {
  title: "Dự Án & Câu Chuyện Chuyển Đổi Thực Tế — WISE Academy",
  description: "Tổng hợp các case study dự án tư vấn Lean Six Sigma, chuẩn hóa 5S, Work Engineering và cải tiến năng suất tại các tập đoàn sản xuất lớn.",
};

export default function ProjectsPage() {
  const projects: Project[] = projectsData as Project[];

  return (
    <div className="bg-[#F8F9FA]">
      {/* Header */}
      <PageHero
        eyebrow="CASE STUDIES & KẾT QUẢ THỰC TẾ"
        image="/images/projects/project-lean-six-sigma-yellow-belt-pouchen-group/photo_1.webp"
        title={<>Dự Án Đã Triển Khai: <span className="text-[#FF7A30]">Kết Quả Đo Lường Được</span> Tại Nhà Máy.</>}
        description="Mỗi dự án là một sự đồng hành sát sao giữa chuyên gia WISE và ban giám đốc nhà máy, giúp tăng sản lượng xuất xưởng, giảm phế phẩm và tiết kiệm hàng tỷ đồng chi phí lãng phí."
      />

      {/* Featured Big 3 Case Studies */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 xl:px-12 w-full max-w-[1600px] mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <SectionBadge number="BENCHMARK" title="DỰ ÁN ĐIỂM HÌNH" />
          <h2 className="text-3xl font-extrabold text-[#002F5B]">
            Các Dự Án Trọng Điểm Cấp Doanh Nghiệp
          </h2>
          <p className="text-sm text-[#486581]">
            Được triển khai trên quy mô hàng nghìn công nhân viên và các phân xưởng sản xuất lớn.
          </p>
        </div>

        <div className="space-y-12">
          {projects.slice(0, 3).map((proj, idx) => (
            <div 
              key={proj.id}
              className="growth-card bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
            >
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs uppercase font-extrabold tracking-widest text-[#F76011] bg-[#FFF5EC] px-3 py-1 rounded-full border border-[#F76011]/20">
                      {proj.industry}
                    </span>
                    <span className="text-xs font-mono text-[#486581]">DỰ ÁN 0{idx + 1}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#002F5B]">
                    {proj.client}
                  </h3>
                  <h4 className="text-base font-semibold text-[#102A43] mt-1">
                    {proj.title}
                  </h4>
                </div>

                <blockquote className="border-l-4 border-[#F76011] pl-4 italic text-sm sm:text-base text-[#486581] leading-relaxed">
                  “{proj.highlight}”
                </blockquote>

                <p className="text-sm text-[#486581] leading-relaxed">
                  {proj.description}
                </p>

                {/* Factory Photos Gallery */}
                {proj.gallery && proj.gallery.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] uppercase font-bold text-[#002F5B] tracking-wider block">
                      Hình Ảnh Khảo Sát & Đào Tạo Tại Hiện Trường:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {proj.gallery.slice(0, 3).map((imgUrl, i) => (
                        <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm group/img">
                          <img
                            src={imgUrl}
                            alt={`Hình ảnh thực tế dự án ${proj.client}`}
                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                  {proj.results.map((res, i) => (
                    <div key={i} className="bg-[#FFF5EC] border border-[#F76011]/20 p-4 rounded-xl">
                      <div className="text-2xl font-black text-[#F76011]">{res.metric}</div>
                      <div className="text-xs text-[#102A43] font-semibold mt-1">{res.label}</div>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {proj.tags.map((t, i) => (
                    <span key={i} className="text-xs bg-[#F8F9FA] border border-slate-200 px-3 py-1 rounded-full text-[#486581]">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 bg-gradient-to-br from-[#002F5B] to-[#001E38] p-8 rounded-2xl text-white space-y-6">
                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                  <span className="text-xs uppercase font-bold text-[#FF7A30]">Quy Trình Triển Khai</span>
                  <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded text-white/80">4 BƯỚC THỰC TẾ</span>
                </div>
                <ul className="space-y-4 text-xs sm:text-sm text-white/90">
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#F76011] flex items-center justify-center text-xs font-bold shrink-0">1</span>
                    <span>Khảo sát tại xưởng và đo lường thời gian thao tác từng công đoạn.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#F76011] flex items-center justify-center text-xs font-bold shrink-0">2</span>
                    <span>Hướng dẫn phương pháp cải tiến và thực hành mô phỏng trực quan.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#F76011] flex items-center justify-center text-xs font-bold shrink-0">3</span>
                    <span>Kèm cặp đội ngũ nhà máy tự tay thực hiện đề tài cải tiến cụ thể.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#F76011] flex items-center justify-center text-xs font-bold shrink-0">4</span>
                    <span>Đo lường hiệu quả bằng tiền tiết kiệm và bàn giao quy trình chuẩn.</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <Link
                    href="/lien-he"
                    className="growth-arrow block text-center bg-[#F76011] hover:bg-[#FF6712] text-white font-bold text-xs py-3 rounded-xl transition-all"
                  >
                    <span>Yêu cầu tư vấn triển khai tương tự</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* All Other Projects Grid */}
        <div className="pt-12 border-t border-slate-200 space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-[#002F5B]">Các Dự Án & Hội Thảo Chuyên Đề Khác</h3>
            <p className="text-xs text-[#486581]">Các chương trình tư vấn, đào tạo tại nhà máy đã hoàn thành</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(3).map((p) => (
              <div
                key={p.id}
                className="growth-card bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {p.cover && (
                    <div className="aspect-[16/9] bg-slate-100 overflow-hidden border-b border-slate-100">
                      <img
                        src={p.cover}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-[#F76011] bg-[#FFF5EC] px-2.5 py-0.5 rounded">
                        {p.industry}
                      </span>
                      <span className="text-[#486581] font-mono text-[11px]">{p.client}</span>
                    </div>
                    <h4 className="text-sm font-bold text-[#002F5B] group-hover:text-[#F76011] transition-colors leading-snug">
                      {p.title}
                    </h4>
                    <p className="text-xs text-[#486581] line-clamp-3 leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#00BE62]">
                      {p.results[0]?.metric || "Thành công"}
                    </span>
                    <Link
                      href="/lien-he"
                      className="growth-arrow inline-flex items-center gap-1 text-xs font-bold text-[#002F5B] group-hover:text-[#F76011] transition-colors"
                    >
                      <span>Chi tiết</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
