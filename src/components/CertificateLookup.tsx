"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2 } from "@/components/icons";

interface CertificateData {
  code: string;
  name: string;
  program: string;
  issued: string;
  duration: string;
  method: string;
  facilitator: string;
  image: string | null;
}

const ERRORS: Record<string, string> = {
  not_found:
    "Không tìm thấy chứng chỉ với mã này. Vui lòng kiểm tra lại mã in trên chứng chỉ.",
  invalid_code: "Mã chứng chỉ không hợp lệ.",
  too_many_requests:
    "Bạn đã tra cứu quá nhiều lần. Vui lòng thử lại sau ít phút.",
  unavailable: "Hệ thống tra cứu đang tạm gián đoạn. Vui lòng thử lại sau.",
};

// Code input and result card for /xac-thuc-chung-chi.
export default function CertificateLookup() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cert, setCert] = useState<CertificateData | null>(null);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoom(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [zoom]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    setCert(null);
    try {
      const res = await fetch(
        `/api/certificate?code=${encodeURIComponent(code.trim())}`,
      );
      const json = await res.json();
      if (json.ok) setCert(json.certificate);
      else setError(ERRORS[json.error] || ERRORS.unavailable);
    } catch {
      setError(ERRORS.unavailable);
    } finally {
      setLoading(false);
    }
  }

  const rows: [string, string][] = cert
    ? ([
        ["Mã chứng chỉ", cert.code],
        ["Học viên", cert.name],
        ["Chương trình", cert.program],
        ["Ngày tốt nghiệp", cert.issued],
        ["Thời lượng", cert.duration],
        ["Hình thức", cert.method],
        ["Giảng viên", cert.facilitator],
      ].filter(([, v]) => v) as [string, string][])
    : [];

  return (
    <div>
      <form
        onSubmit={submit}
        className="rounded-3xl bg-white p-6 sm:p-8 shadow-[0_24px_50px_-30px_rgba(0,47,91,0.45)] ring-1 ring-[#002F5B]/[0.06]"
      >
        <label
          htmlFor="cert-code"
          className="block text-sm font-semibold text-[#002F5B]"
        >
          Mã chứng chỉ
        </label>
        <div className="mt-3 flex flex-col sm:flex-row gap-3">
          <input
            id="cert-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Ví dụ: WISELSSGB-K2501-001-F"
            autoComplete="off"
            maxLength={40}
            className="flex-1 rounded-full border border-slate-300 px-5 py-3 text-[15px] uppercase tracking-wide text-[#002F5B] outline-none focus:border-[#F76011] focus:ring-2 focus:ring-[#F76011]/20"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[#F76011] hover:bg-[#C9500E] disabled:opacity-60 px-7 py-3 text-sm font-semibold text-white transition-colors"
          >
            {loading ? "Đang tra cứu..." : "Xác thực"}
          </button>
        </div>
        {error && <p className="mt-4 text-sm text-[#C9500E]">{error}</p>}
      </form>

      {cert && (
        <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-[0_24px_50px_-30px_rgba(0,47,91,0.45)] ring-1 ring-[#002F5B]/[0.06]">
          <div className="flex items-center gap-3 bg-[#EAF7EF] px-6 sm:px-8 py-4">
            <CheckCircle2 weight="fill" className="w-6 h-6 text-[#1E9E5A]" />
            <p className="font-semibold text-[#14713F]">
              Chứng nhận hợp lệ do WISE Academy cấp
            </p>
          </div>
          {/* details on the left, the certificate image on the right */}
          <div
            className={`grid grid-cols-1 ${cert.image ? "sm:grid-cols-[minmax(0,1fr)_200px] lg:grid-cols-[minmax(0,1fr)_250px]" : ""} gap-6 lg:gap-8 px-6 sm:px-8 py-6 items-start`}
          >
            <dl className="divide-y divide-slate-100">
              {rows.map(([k, v]) => (
                <div
                  key={k}
                  className="grid grid-cols-1 sm:grid-cols-[160px_1fr] sm:items-baseline gap-1 py-3"
                >
                  <dt className="text-xs font-bold uppercase tracking-[0.12em] text-[#486581]">
                    {k}
                  </dt>
                  <dd className="text-[15px] leading-snug font-semibold text-[#002F5B]">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
            {cert.image && (
              <button
                type="button"
                onClick={() => setZoom(true)}
                className="group mx-auto block w-full max-w-[250px] cursor-zoom-in"
                aria-label="Xem ảnh chứng chỉ kích thước đầy đủ"
              >
                <img
                  src={cert.image}
                  alt={`Chứng chỉ của ${cert.name}`}
                  className="w-full rounded-xl ring-1 ring-slate-200 shadow-[0_18px_40px_-24px_rgba(0,47,91,0.5)] transition-transform group-hover:scale-[1.02]"
                />
                <span className="mt-2 block text-center text-xs text-[#486581]">
                  Bấm vào ảnh để xem đầy đủ
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* full-size certificate, closed by a click anywhere or Escape */}
      {zoom && cert?.image && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Chứng chỉ của ${cert.name}`}
          onClick={() => setZoom(false)}
          className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-[#001B35]/85 p-4 sm:p-8"
        >
          <img
            src={cert.image}
            alt={`Chứng chỉ của ${cert.name}`}
            className="max-h-full max-w-full rounded-xl shadow-2xl"
          />
          <button
            type="button"
            onClick={() => setZoom(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-2xl leading-none text-white hover:bg-white/25"
            aria-label="Đóng"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
