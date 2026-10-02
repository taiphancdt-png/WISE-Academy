"use client";

import React, { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { LSSI_PROGRAMS } from "@/data/lssi-programs";

const CONTACT_EMAIL = "contact@wisedemy.com.vn";

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

/**
 * Interest form for LSSI programs. The site has no form backend yet, so submitting opens the visitor's
 * email app with the details pre-filled to WISE (nothing is sent to a server).
 */
export default function LssiInterestForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    location: "",
    program: LSSI_PROGRAMS[0].title,
    format: "Virtual live",
    learners: "1 học viên",
    current: "Chưa có chứng nhận",
    message: "",
  });
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = [
      `Họ và tên: ${form.name}`,
      `Số điện thoại: ${form.phone}`,
      `Email: ${form.email}`,
      `Công ty: ${form.company}`,
      `Thành phố / Quốc gia: ${form.location}`,
      `Chương trình quan tâm: ${form.program}`,
      `Hình thức học: ${form.format}`,
      `Số lượng học viên: ${form.learners}`,
      `Chứng nhận hiện có: ${form.current}`,
      `Ghi chú: ${form.message}`,
    ].join("\n");
    const subject = `Đăng ký quan tâm chương trình LSSI – ${form.program}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="card-soft !transform-none text-center py-12 px-6" role="status">
        <div className="w-14 h-14 rounded-full bg-[#00BE62]/15 text-[#00BE62] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-[#002F5B]">Cảm ơn bạn đã quan tâm!</h3>
        <p className="mt-2 text-sm text-[#486581] max-w-md mx-auto">
          Ứng dụng email đã được mở với thông tin của bạn — hãy bấm gửi để hoàn tất. Nếu email không mở, vui lòng gửi tới{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-[#C9500E]">{CONTACT_EMAIL}</a> hoặc gọi hotline{" "}
          <a href="tel:+84989002121" className="font-semibold text-[#C9500E]">0989 002 121</a>.
        </p>
        <button onClick={() => setSent(false)} className="mt-5 text-sm font-semibold text-[#C9500E] hover:underline">
          Sửa lại thông tin
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card-soft !transform-none p-6 sm:p-10 space-y-5">
      <div>
        <h3 className="text-xl sm:text-2xl font-semibold text-[#002F5B]">Đăng ký nhận thông tin & chi phí ưu đãi</h3>
        <p className="mt-1 text-sm text-[#486581]">
          Để lại thông tin, WISE Academy sẽ gửi lịch khai giảng và chính sách chi phí ưu đãi dành cho Việt Nam và châu Á.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field id="l-name" label="Họ và tên" required>
          <input id="l-name" required autoComplete="name" value={form.name} onChange={set("name")} className={inputClass} placeholder="Nguyễn Văn A" />
        </Field>
        <Field id="l-phone" label="Số điện thoại / Zalo" required>
          <input id="l-phone" type="tel" required autoComplete="tel" value={form.phone} onChange={set("phone")} className={inputClass} placeholder="09xx xxx xxx" />
        </Field>
        <Field id="l-email" label="Email" required>
          <input id="l-email" type="email" required autoComplete="email" value={form.email} onChange={set("email")} className={inputClass} placeholder="ten@congty.com" />
        </Field>
        <Field id="l-company" label="Công ty / Tổ chức">
          <input id="l-company" autoComplete="organization" value={form.company} onChange={set("company")} className={inputClass} placeholder="Công ty ABC" />
        </Field>
        <Field id="l-program" label="Chương trình quan tâm" required>
          <select id="l-program" value={form.program} onChange={set("program")} className={inputClass}>
            {LSSI_PROGRAMS.map((p) => (
              <option key={p.id} value={p.title}>
                {p.title}
              </option>
            ))}
          </select>
        </Field>
        <Field id="l-format" label="Hình thức học">
          <select id="l-format" value={form.format} onChange={set("format")} className={inputClass}>
            <option>Self-paced</option>
            <option>Face to face</option>
            <option>Virtual live</option>
            <option>Chưa xác định</option>
          </select>
        </Field>
        <Field id="l-learners" label="Số lượng học viên">
          <select id="l-learners" value={form.learners} onChange={set("learners")} className={inputClass}>
            <option>1 học viên</option>
            <option>2–5 học viên</option>
            <option>6–20 học viên</option>
            <option>Trên 20 học viên (in-house)</option>
          </select>
        </Field>
        <Field id="l-current" label="Chứng nhận Lean Six Sigma hiện có (để tư vấn nâng cấp)">
          <select id="l-current" value={form.current} onChange={set("current")} className={inputClass}>
            <option>Chưa có chứng nhận</option>
            <option>Lean Management</option>
            <option>White Belt</option>
            <option>Yellow Belt</option>
            <option>Green Belt</option>
            <option>Black Belt</option>
          </select>
        </Field>
        <Field id="l-location" label="Thành phố / Quốc gia">
          <input id="l-location" value={form.location} onChange={set("location")} className={inputClass} placeholder="TP. Hồ Chí Minh, Việt Nam" />
        </Field>
      </div>
      <Field id="l-message" label="Ghi chú">
        <textarea id="l-message" rows={3} value={form.message} onChange={set("message")} className={inputClass} placeholder="Thời gian mong muốn, mục tiêu học tập..." />
      </Field>
      <button
        type="submit"
        className="w-full py-3.5 rounded-full bg-[#F76011] hover:bg-[#C9500E] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
      >
        <Send className="w-4 h-4" /> Gửi đăng ký quan tâm
      </button>
    </form>
  );
}
