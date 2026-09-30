"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, Building2, Send, CheckCircle2, ChevronDown } from "lucide-react";
import PageHero from "@/components/PageHero";
import PartnerLogos from "@/components/PartnerLogos";
import { Section, SectionHeader } from "@/components/ui";

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:border-[#F76011] focus:ring-2 focus:ring-[#F76011]/15";

function Field({ id, label, required, children }: { id: string; label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-[#102A43] mb-1.5">
        {label}
        {required && <span className="text-[#C9500E]"> *</span>}
      </label>
      {children}
    </div>
  );
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    industry: "May mặc & Giày dép",
    plantSize: "100 - 500 lao động",
    service: "Khảo sát thực tế & Tìm điểm nghẽn tại xưởng",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const faqs = [
    {
      q: "Khảo sát thực tế tại nhà xưởng ban đầu có mất phí không?",
      a: "WISE hỗ trợ buổi khảo sát sơ bộ ban đầu tại xưởng hoàn toàn miễn phí cho các doanh nghiệp sản xuất đủ điều kiện, nhằm đánh giá tiềm năng cải tiến và đề xuất lộ trình phù hợp."
    },
    {
      q: "Dự án tư vấn Lean thường kéo dài bao lâu?",
      a: "Tùy thuộc vào quy mô và mục tiêu: Gói chẩn đoán nhanh kéo dài 2-4 tuần; Gói thí điểm chuyền mẫu 3-6 tháng; và Gói chuyển đổi toàn diện nhân rộng từ 6-12 tháng."
    },
    {
      q: "WISE có cam kết kết quả đo lường được không?",
      a: "Có. Mọi hợp đồng tư vấn của WISE đều cam kết các chỉ số hiệu suất KPI cụ thể (nâng OEE, giảm WIP, giảm Lead Time, giảm thời gian chuyển đổi mã hàng SMED)."
    },
    {
      q: "Khóa đào tạo Lean Six Sigma cấp chứng chỉ gì?",
      a: "Học viên hoàn thành khóa học và bảo vệ thành công đề tài dự án thực tế sẽ được cấp Chứng nhận Lean Six Sigma chuẩn quốc tế có giá trị công nhận trong ngành công nghiệp."
    }
  ];

  const set = (key: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [key]: e.target.value });

  const contacts = [
    { icon: MapPin, label: "Trụ sở chính", body: <>14 Đường Số 2, Khu Xáng Thổi, P. Chánh Hưng, Quận 8, TP. Hồ Chí Minh</> },
    { icon: Building2, label: "Văn phòng đại diện", body: <>Số 86 Song Hành, KĐT Lakeview City, P. An Phú, TP. Thủ Đức, TP. Hồ Chí Minh</> },
    {
      icon: Phone,
      label: "Hotline tư vấn",
      body: (
        <>
          <a href="tel:+84989002121" className="font-semibold text-[#002F5B] hover:text-[#C9500E]">0989 002 121</a> (Ms. Thủy)
        </>
      ),
    },
    {
      icon: Mail,
      label: "Email",
      body: (
        <>
          <a href="mailto:contact@wisedemy.com.vn" className="block hover:text-[#C9500E]">contact@wisedemy.com.vn</a>
          <a href="mailto:thuynt@wisedemy.com.vn" className="block hover:text-[#C9500E]">thuynt@wisedemy.com.vn</a>
        </>
      ),
    },
  ];

  return (
    <div>
      <PageHero
        eyebrow="Liên hệ & đặt lịch tư vấn"
        image="/images/projects/pouchen-group-khoa-dao-tao-lean-six-sigma-yellow-belt/photo_1.webp"
        title={<>Kết nối cùng đội ngũ <span className="text-[#FF7A30]">chuyên gia WISE Academy</span></>}
        description="Chúng tôi luôn sẵn sàng lắng nghe bài toán vận hành của bạn và cùng đồng hành tại hiện trường để tạo ra những thay đổi đo lường được."
      />

      <Section tone="muted">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact info */}
          <div className="lg:col-span-5">
            <SectionHeader
              align="left"
              eyebrow="Thông tin liên hệ"
              title="WISE Academy Consulting & Training"
              description="Đơn vị đồng hành tin cậy của các doanh nghiệp sản xuất và chuỗi cung ứng hàng đầu tại Việt Nam."
            />
            <ul className="-mt-4 divide-y divide-slate-200">
              {contacts.map(({ icon: Icon, label, body }) => (
                <li key={label} className="flex items-start gap-4 py-5">
                  <span className="w-10 h-10 rounded-full bg-[#FFF5EC] text-[#F76011] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div className="text-sm text-[#486581] leading-relaxed">
                    <span className="block font-semibold text-[#102A43]">{label}</span>
                    {body}
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-[#486581]">Mã số thuế: 0317485522 · Sở Kế hoạch & Đầu tư TP.HCM cấp</p>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 card-soft !transform-none p-7 sm:p-10">
            {submitted ? (
              <div className="text-center py-14" role="status">
                <div className="w-16 h-16 rounded-full bg-[#00BE62]/15 text-[#00BE62] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h2 className="mt-5 text-2xl font-semibold text-[#002F5B]">Gửi thông tin thành công!</h2>
                <p className="mt-3 text-sm text-[#486581] max-w-md mx-auto">
                  Cảm ơn Quý doanh nghiệp. Chuyên gia tư vấn của WISE sẽ liên hệ lại qua điện thoại trong vòng 24 giờ làm việc.
                </p>
                <button onClick={() => setSubmitted(false)} className="mt-5 text-sm font-semibold text-[#C9500E] hover:underline">
                  Gửi thêm yêu cầu khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="text-2xl font-semibold text-[#002F5B]">Đặt lịch khảo sát & tư vấn hiện trường</h2>
                  <p className="mt-1 text-sm text-[#486581]">
                    Chia sẻ bài toán của nhà máy để chuyên gia chuẩn bị phân tích trước khi gặp gỡ.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field id="c-name" label="Họ và tên người liên hệ" required>
                    <input id="c-name" type="text" required autoComplete="name" value={formData.name} onChange={set("name")} placeholder="Nguyễn Văn A" className={inputClass} />
                  </Field>
                  <Field id="c-phone" label="Số điện thoại" required>
                    <input id="c-phone" type="tel" required autoComplete="tel" value={formData.phone} onChange={set("phone")} placeholder="0989 xxx xxx" className={inputClass} />
                  </Field>
                  <Field id="c-email" label="Email doanh nghiệp" required>
                    <input id="c-email" type="email" required autoComplete="email" value={formData.email} onChange={set("email")} placeholder="ten@congty.com" className={inputClass} />
                  </Field>
                  <Field id="c-company" label="Tên doanh nghiệp / nhà máy" required>
                    <input id="c-company" type="text" required autoComplete="organization" value={formData.company} onChange={set("company")} placeholder="Công ty TNHH Sản Xuất ABC" className={inputClass} />
                  </Field>
                  <Field id="c-industry" label="Ngành nghề sản xuất">
                    <select id="c-industry" value={formData.industry} onChange={set("industry")} className={inputClass}>
                      <option value="May mặc & Giày dép">Da giày & May mặc</option>
                      <option value="Cơ khí & Chế tạo">Cơ khí & Chế tạo máy</option>
                      <option value="Điện tử & Bán dẫn">Điện tử & Bán dẫn</option>
                      <option value="Thực phẩm & Đồ uống (F&B)">Thực phẩm & Đồ uống (F&B)</option>
                      <option value="Logistics & Chuỗi cung ứng">Logistics & Kho bãi</option>
                      <option value="Khác">Ngành nghề khác</option>
                    </select>
                  </Field>
                  <Field id="c-size" label="Quy mô nhân lực">
                    <select id="c-size" value={formData.plantSize} onChange={set("plantSize")} className={inputClass}>
                      <option value="Dưới 100 lao động">Dưới 100 lao động</option>
                      <option value="100 - 500 lao động">100 - 500 lao động</option>
                      <option value="500 - 2,000 lao động">500 - 2,000 lao động</option>
                      <option value="Trên 2,000 lao động">Trên 2,000 lao động</option>
                    </select>
                  </Field>
                </div>
                <Field id="c-service" label="Dịch vụ quan tâm" required>
                  <select id="c-service" value={formData.service} onChange={set("service")} className={inputClass}>
                    <option value="Khảo sát thực tế & Tìm điểm nghẽn tại xưởng">Khảo sát thực tế & Tìm điểm nghẽn tại xưởng</option>
                    <option value="Tối ưu năng suất dây chuyền sản xuất">Tối ưu năng suất dây chuyền sản xuất</option>
                    <option value="Đào tạo kỹ năng quản lý cho quản đốc & tổ trưởng">Đào tạo kỹ năng quản lý cho quản đốc & tổ trưởng</option>
                    <option value="Sắp xếp nhà xưởng 5S gọn gàng, ngăn nắp">Sắp xếp nhà xưởng 5S gọn gàng, ngăn nắp</option>
                    <option value="Giảm thời gian đổi mã hàng & cân bằng chuyền">Giảm thời gian đổi mã hàng & cân bằng chuyền</option>
                    <option value="Buổi trải nghiệm game mô phỏng sản xuất">Buổi trải nghiệm game mô phỏng sản xuất</option>
                  </select>
                </Field>
                <Field id="c-message" label="Mô tả thách thức đang gặp phải">
                  <textarea
                    id="c-message"
                    rows={4}
                    value={formData.message}
                    onChange={set("message")}
                    placeholder="Ví dụ: Tồn kho dở dang cao, tỷ lệ phế phẩm tăng, thời gian đổi mã hàng lâu..."
                    className={inputClass}
                  />
                </Field>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#F76011] hover:bg-[#C9500E] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Gửi yêu cầu tư vấn
                </button>
              </form>
            )}
          </div>
        </div>
      </Section>

      <PartnerLogos className="border-t" />

      {/* FAQ */}
      <Section>
        <SectionHeader eyebrow="Câu hỏi thường gặp" title="Những điều doanh nghiệp thường hỏi" />
        <div className="max-w-3xl mx-auto divide-y divide-slate-200 border-y border-slate-200">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-base font-semibold text-[#002F5B]">
                {f.q}
                <ChevronDown className="w-5 h-5 text-[#F76011] shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm text-[#486581] leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </div>
  );
}
