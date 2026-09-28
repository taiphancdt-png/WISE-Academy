import React from "react";
import Link from "next/link";
import { 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  ArrowUpRight, 
  Mail, 
  Phone,
  ShieldCheck,
  Building
} from "lucide-react";
import SectionBadge from "@/components/SectionBadge";
import PageHero from "@/components/PageHero";
import expertsData from "@/data/experts.json";
import type { Expert } from "@/types";

export const metadata = {
  title: "Đội Ngũ Chuyên Gia Thực Chiến — WISE Academy",
  description: "Đội ngũ chuyên gia Lean Six Sigma, chẩn đoán vận hành doanh nghiệp, tự động hóa và quản lý chất lượng với nhiều năm kinh nghiệm tại các tập đoàn đa quốc gia.",
};

export default function ExpertsPage() {
  const experts: Expert[] = expertsData as Expert[];

  return (
    <div className="bg-[#F8F9FA]">
      {/* Header */}
      <PageHero
        eyebrow="ĐỘI NGŨ CHUYÊN GIA THỰC CHIẾN"
        image="/images/projects/huali-group-khoa-dao-tao-tu-duy-va-ky-thuat-cai-tien-nang-suat-chuyen/photo_11.webp"
        title={<>Chuyên Gia Đồng Hành: <span className="text-[#FF7A30]">Người Thật.</span> Kinh Nghiệm Nhà Xưởng Thật.</>}
        description="Các chuyên gia của WISE không giảng lý thuyết sách vở. Họ là những người từng trực tiếp làm Giám đốc Nhà máy, Quản lý Sản xuất nhiều năm tại các tập đoàn lớn như Nike, Pou Chen, AG Samho, Dean Shoes."
      />

      {/* Trust factors */}
      <section className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="w-full max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-black text-[#002F5B]">100%</div>
            <p className="text-xs text-[#486581] font-semibold mt-1">Từng trực tiếp điều hành xưởng sản xuất</p>
          </div>
          <div>
            <div className="text-2xl font-black text-[#F76011]">30+</div>
            <p className="text-xs text-[#486581] font-semibold mt-1">Năm kinh nghiệm cao nhất của chuyên gia</p>
          </div>
          <div>
            <div className="text-2xl font-black text-[#002F5B]">Thực Chiến</div>
            <p className="text-xs text-[#486581] font-semibold mt-1">Cầm tay chỉ việc trực tiếp trên máy móc</p>
          </div>
          <div>
            <div className="text-2xl font-black text-[#F76011]">Cam Kết</div>
            <p className="text-xs text-[#486581] font-semibold mt-1">Kèm cặp tại xưởng đến khi ra kết quả</p>
          </div>
        </div>
      </section>

      {/* Experts Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 xl:px-12 w-full max-w-[1600px] mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experts.map((exp) => (
            <div
              key={exp.id}
              className="growth-card bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between group"
            >
              <div>
                {/* Photo Header */}
                <div className="pt-8 flex flex-col items-center gap-3">
                  <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white shadow-md bg-slate-100">
                    {exp.image ? (
                      <img
                        src={exp.image}
                        alt={exp.name}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#002F5B] text-white text-3xl font-extrabold">
                        {exp.name.split(" ").pop()?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className="bg-[#001E38] text-[#FF7A30] text-[10px] font-bold px-2.5 py-1 rounded-full">
                    CHUYÊN GIA WISE
                  </span>
                </div>

                {/* Profile Details */}
                <div className="px-6 sm:px-8 pt-5 pb-6 space-y-3 text-center">
                  <span className="text-xs uppercase font-extrabold text-[#F76011] tracking-wider block">
                    {exp.role}
                  </span>
                  <h3 className="text-xl font-extrabold text-[#002F5B] group-hover:text-[#F76011] transition-colors">
                    {exp.name}
                  </h3>
                  <div className="text-xs font-semibold text-[#002F5B] bg-[#F8F9FA] p-2.5 rounded-xl border border-slate-200">
                    {exp.title}
                  </div>
                  <p className="text-xs text-[#486581] leading-relaxed pt-1">
                    {exp.bio}
                  </p>
                </div>
              </div>

              {/* Tags & Action */}
              <div className="p-6 sm:p-8 pt-0 space-y-4">
                <div className="flex flex-wrap justify-center gap-1.5 pt-3 border-t border-slate-200">
                  {exp.tags.map((t, idx) => (
                    <span 
                      key={idx} 
                      className="text-[10px] bg-[#FFF5EC] text-[#F76011] border border-[#F76011]/20 px-2 py-0.5 rounded font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/lien-he?expert=${encodeURIComponent(exp.name)}`}
                  className="growth-arrow block text-center w-full py-2.5 rounded-full bg-[#002F5B] hover:bg-[#F76011] text-white text-xs font-bold transition-all shadow-sm"
                >
                  <span>Đặt lịch trao đổi cùng chuyên gia</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <section className="bg-[#001E38] text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Đúng Chuyên Gia — Đúng Bài Toán Hiện Trường
          </h2>
          <p className="text-sm text-white/70 max-w-xl mx-auto">
            Hãy liên hệ với chúng tôi để sắp xếp lịch làm việc trực tiếp với chuyên gia phù hợp nhất cho ngành sản xuất của bạn.
          </p>
          <div className="pt-2">
            <Link
              href="/lien-he"
              className="inline-flex items-center gap-2 bg-[#F76011] hover:bg-[#FF6712] text-white font-bold text-sm px-8 py-3 rounded-full transition-all"
            >
              <span>Kết nối với chuyên gia</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
