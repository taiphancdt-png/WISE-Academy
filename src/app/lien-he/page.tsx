"use client";

import React, { useState } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  HelpCircle
} from "lucide-react";
import SectionBadge from "@/components/SectionBadge";

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

  return (
    <div className="bg-[#F8F9FA]">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#001426] via-[#002F5B] to-[#041E35] text-white py-20 px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="w-full max-w-[1600px] mx-auto space-y-4">
          <SectionBadge number="CONTACT" title="LIÊN HỆ & ĐẶT LỊCH TƯ VẤN" light={true} />
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            Kết Nối Cùng Đội Ngũ <br />
            <span className="text-[#F76011]">Chuyên Gia WISE Academy.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#C7D8E4] max-w-3xl leading-relaxed">
            Chúng tôi luôn sẵn sàng lắng nghe bài toán vận hành của bạn và cùng đồng hành tại hiện trường để tạo ra những thay đổi đo lường được.
          </p>
        </div>
      </section>

      {/* Main Grid: Info + Form */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#F76011]">
                THÔNG TIN TRỤ SỞ CHÍNH
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002F5B]">
                WISE Academy Consulting & Training
              </h2>
              <p className="text-sm text-[#486581] leading-relaxed">
                Đơn vị đồng hành tin cậy của các doanh nghiệp sản xuất và chuỗi cung ứng hàng đầu tại Việt Nam.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#FFF5EC] text-[#F76011] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-sm font-bold text-[#002F5B]">Trụ sở chính:</strong>
                  <p className="text-xs text-[#486581] mt-0.5">
                    14 Đường Số 2, Khu Xáng Thổi, P. Chánh Hưng, Quận 8, TP. Hồ Chí Minh
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#FFF5EC] text-[#F76011] flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-sm font-bold text-[#002F5B]">Văn phòng đại diện:</strong>
                  <p className="text-xs text-[#486581] mt-0.5">
                    Số 86 Song Hành, KĐT Lakeview City, P. An Phú, TP. Thủ Đức, TP. Hồ Chí Minh
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#FFF5EC] text-[#F76011] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-sm font-bold text-[#002F5B]">Hotline tư vấn:</strong>
                  <div className="text-xs text-[#486581] mt-0.5 space-y-0.5">
                    <p><a href="tel:+84932090075" className="hover:text-[#F76011] font-bold text-sm text-[#002F5B]">0932 090 075</a> (Ms. Thủy)</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#FFF5EC] text-[#F76011] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-sm font-bold text-[#002F5B]">Email chính thức:</strong>
                  <div className="text-xs text-[#486581] mt-0.5 space-y-0.5">
                    <p><a href="mailto:contact@wisedemy.com.vn" className="hover:text-[#F76011]">contact@wisedemy.com.vn</a></p>
                    <p><a href="mailto:thuynt@wisedemy.com.vn" className="hover:text-[#F76011]">thuynt@wisedemy.com.vn</a></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#002F5B] text-white p-6 rounded-2xl space-y-2">
              <span className="text-xs uppercase tracking-wider text-[#FF7A30] font-bold">Pháp Lý Doanh Nghiệp</span>
              <p className="text-xs text-white/80">
                <strong>Mã số thuế:</strong> 0317485522 · Sở Kế hoạch & Đầu tư TP.HCM cấp
              </p>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-lg">
            {submitted ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#00BE62]/20 text-[#00BE62] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-[#002F5B]">Gửi Thông Tin Thành Công!</h3>
                <p className="text-sm text-[#486581] max-w-md mx-auto">
                  Cảm ơn Quý doanh nghiệp đã gửi yêu cầu. Chuyên gia tư vấn của WISE sẽ liên hệ lại trực tiếp qua điện thoại trong vòng 24 giờ làm việc.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#F76011] hover:underline pt-4"
                >
                  <span>Gửi thêm yêu cầu khác</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <span className="text-xs uppercase font-extrabold text-[#F76011] tracking-wider block mb-1">
                    FORM ĐĂNG KÝ
                  </span>
                  <h3 className="text-2xl font-extrabold text-[#002F5B]">
                    Đặt Lịch Khảo Sát & Tư Vấn Hiện Trường
                  </h3>
                  <p className="text-xs text-[#486581] mt-1">
                    Hãy chia sẻ bài toán của nhà máy để chuyên gia chuẩn bị phân tích kỹ lưỡng trước khi gặp gỡ.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#002F5B] mb-1">
                      Họ và Tên Người Liên Hệ *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#F76011]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#002F5B] mb-1">
                      Số Điện Thoại Trực Tiếp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0989 xxx xxx"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#F76011]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#002F5B] mb-1">
                      Email Doanh Nghiệp *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ten@congty.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#F76011]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#002F5B] mb-1">
                      Tên Doanh Nghiệp / Nhà Máy *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Công ty TNHH Sản Xuất ABC"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#F76011]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#002F5B] mb-1">
                      Ngành Nghề Sản Xuất
                    </label>
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#F76011] bg-white"
                    >
                      <option value="May mặc & Giày dép">Da giày & May mặc</option>
                      <option value="Cơ khí & Chế tạo">Cơ khí & Chế tạo máy</option>
                      <option value="Điện tử & Bán dẫn">Điện tử & Bán dẫn</option>
                      <option value="Thực phẩm & Đồ uống (F&B)">Thực phẩm & Đồ uống (F&B)</option>
                      <option value="Logistics & Chuỗi cung ứng">Logistics & Kho bãi</option>
                      <option value="Khác">Ngành nghề khác</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#002F5B] mb-1">
                      Quy Mô Nhân Lực Nhà Máy
                    </label>
                    <select
                      value={formData.plantSize}
                      onChange={(e) => setFormData({ ...formData, plantSize: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#F76011] bg-white"
                    >
                      <option value="Dưới 100 lao động">Dưới 100 lao động</option>
                      <option value="100 - 500 lao động">100 - 500 lao động</option>
                      <option value="500 - 2,000 lao động">500 - 2,000 lao động</option>
                      <option value="Trên 2,000 lao động">Trên 2,000 lao động</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#002F5B] mb-1">
                    Dịch Vụ Quan Tâm Trọng Tâm *
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#F76011] bg-white"
                  >
                    <option value="Khảo sát thực tế & Tìm điểm nghẽn tại xưởng">Khảo sát thực tế & Tìm điểm nghẽn tại xưởng</option>
                    <option value="Tối ưu năng suất dây chuyền sản xuất">Tối ưu năng suất dây chuyền sản xuất</option>
                    <option value="Đào tạo kỹ năng quản lý cho quản đốc & tổ trưởng">Đào tạo kỹ năng quản lý cho quản đốc & tổ trưởng</option>
                    <option value="Sắp xếp nhà xưởng 5S gọn gàng, ngăn nắp">Sắp xếp nhà xưởng 5S gọn gàng, ngăn nắp</option>
                    <option value="Giảm thời gian đổi mã hàng & cân bằng chuyền">Giảm thời gian đổi mã hàng & cân bằng chuyền</option>
                    <option value="Buổi trải nghiệm game mô phỏng sản xuất">Buổi trải nghiệm game mô phỏng sản xuất</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#002F5B] mb-1">
                    Mô Tả Thách Thức / Vấn Đề Đang Gặp Phải
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Ví dụ: Tồn kho dở dang cao, tỷ lệ phế phẩm tăng, thời gian đổi mã hàng lâu, công nhân thiếu tự giác 5S..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#F76011]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-full bg-[#F76011] hover:bg-[#FF6712] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#F76011]/30 hover:shadow-xl transition-all group"
                >
                  <Send className="w-4 h-4 growth-arrow" />
                  <span>Gửi Thông Tin Yêu Cầu Tư Vấn</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <SectionBadge number="FAQ" title="CÂU HỎI THƯỜNG GẶP" />
            <h2 className="text-3xl font-extrabold text-[#002F5B]">
              Những Điều Doanh Nghiệp Thường Hỏi
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className="bg-[#F8F9FA] p-6 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-[#F76011] shrink-0 mt-0.5" />
                  <h3 className="text-base font-bold text-[#002F5B]">{f.q}</h3>
                </div>
                <p className="text-sm text-[#486581] pl-8 leading-relaxed">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
