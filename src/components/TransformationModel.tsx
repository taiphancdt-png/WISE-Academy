import React from "react";
import { ArrowRight } from "@/components/icons";

// Adapted from the Lean Six Sigma Institute (LSSI) "Lean Six Sigma Company Transformation Model" in WISE
// colours: strategic tools (navy) and tactical tools (slate) frame the transformation process (orange),
// which carries an organisation from traditional operations to a Lean Six Sigma culture.
const STRATEGIC_LEFT = ["Canvas chiến lược", "Hoshin Kanri", "Cấu trúc chuỗi giá trị (VSM)", "Phát triển nhân tài"];
const STRATEGIC_RIGHT = ["Gemba Walk", "Kata cải tiến", "Leader Standard Work", "Scrum"];
const TACTICAL_LEFT = ["5S", "Quản lý trực quan", "Công việc tiêu chuẩn", "6 Sigma"];
const TACTICAL_RIGHT = ["TPM", "Dòng chảy liên tục", "Chuyển đổi nhanh (SMED)", "Kanban"];
const PROCESS_STEPS = ["Chuẩn bị", "Thí điểm", "Triển khai toàn chuỗi giá trị", "Doanh nghiệp Lean Six Sigma"];

function ToolList({ items, align = "left" }: { items: string[]; align?: "left" | "right" }) {
  return (
    <ul className={`space-y-1.5 text-xs sm:text-sm text-white/90 ${align === "right" ? "sm:text-right" : ""}`}>
      {items.map((t) => (
        <li key={t} className={`flex gap-2 ${align === "right" ? "sm:flex-row-reverse" : ""}`}>
          <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#FF7A30] shrink-0" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function ToolBand({
  eyebrow,
  center,
  left,
  right,
  tone,
}: {
  eyebrow: string;
  center: string;
  left: string[];
  right: string[];
  tone: "navy" | "slate";
}) {
  const bg = tone === "navy" ? "bg-[#002F5B]" : "bg-[#486581]";
  return (
    <div className="rounded-2xl overflow-hidden shadow-sm">
      <div className={`${tone === "navy" ? "bg-[#001E38]" : "bg-[#334E68]"} px-5 sm:px-8 py-2.5`}>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF7A30]">{eyebrow}</p>
      </div>
      <div className={`${bg} grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-5 sm:gap-6 px-5 sm:px-8 py-6`}>
        <ToolList items={left} />
        <p className="order-first sm:order-none text-center font-semibold text-sm sm:text-base text-white bg-white/10 border border-white/20 rounded-xl px-4 py-3 sm:min-w-[220px]">
          {center}
        </p>
        <ToolList items={right} align="right" />
      </div>
    </div>
  );
}

export default function TransformationModel() {
  return (
    <figure className="max-w-5xl mx-auto mb-14" aria-label="Mô hình chuyển hóa năng lực vận hành xuất sắc">
      <div className="text-center mb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C9500E]">
          Lean Six Sigma Company Transformation Model
        </p>
        <h3 className="mt-2 text-xl sm:text-2xl font-bold text-[#002F5B] leading-snug">
          Mô hình chuyển hóa năng lực vận hành xuất sắc cho Doanh nghiệp
        </h3>
      </div>

      {/* Strategic layer */}
      <ToolBand
        eyebrow="Công cụ chiến lược"
        center="Hệ thống Quản lý Lean Six Sigma"
        left={STRATEGIC_LEFT}
        right={STRATEGIC_RIGHT}
        tone="navy"
      />

      {/* Transformation process */}
      <div className="my-3 rounded-2xl border border-[#002F5B]/10 bg-[#F8F9FA] px-5 sm:px-8 py-6">
        <p className="text-center text-xs sm:text-sm font-bold uppercase tracking-[0.1em] text-[#002F5B] mb-4">
          Quy trình chuyển đổi
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-0">
          <p className="shrink-0 text-xs sm:text-sm font-semibold text-[#486581] text-center sm:text-right sm:pr-4 sm:w-28">
            Doanh nghiệp truyền thống
          </p>
          <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-1">
            {PROCESS_STEPS.map((step, i) => (
              <React.Fragment key={step}>
                {i > 0 && (
                  <ArrowRight
                    weight="bold"
                    className="hidden sm:block w-4 h-4 text-[#C9500E] shrink-0 self-center"
                  />
                )}
                <div className="flex-1 min-w-0 rounded-lg bg-[#F76011] text-white text-center text-xs sm:text-sm font-semibold px-3 py-3 sm:py-4">
                  {step}
                </div>
              </React.Fragment>
            ))}
          </div>
          <p className="shrink-0 text-xs sm:text-sm font-semibold text-[#486581] text-center sm:text-left sm:pl-4 sm:w-28">
            Văn hóa Lean Six Sigma
          </p>
        </div>
        <p className="mt-4 text-center text-[11px] sm:text-xs font-bold uppercase tracking-[0.1em] text-[#C9500E]">
          Quản trị thay đổi (Change Management)
        </p>
      </div>

      {/* Tactical layer */}
      <ToolBand
        eyebrow="Công cụ chiến thuật"
        center="Hệ thống Sản xuất / Dịch vụ Lean Six Sigma"
        left={TACTICAL_LEFT}
        right={TACTICAL_RIGHT}
        tone="slate"
      />

      <figcaption className="mt-3 text-center text-xs text-[#829AB1]">
        Mô hình do WISE Academy biên soạn, tham khảo khung chuyển đổi “Lean Six Sigma Company Transformation
        Model” của Lean Six Sigma Institute (LSSI)
      </figcaption>
    </figure>
  );
}
