import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Globe, Building2, ArrowUp, ShieldCheck } from "@/components/icons";

const serviceLinks = [
  "Chẩn đoán vận hành Gemba",
  "Chuyển đổi Lean toàn diện",
  "Thiết kế Lean Cell & Layout",
  "Work Engineering & Năng suất",
  "Lean 4.0 & Vận hành số",
  "Phát triển Lean Leaders",
];

const trainingLinks = [
  "Lean Six Sigma Yellow Belt",
  "Lean Six Sigma Green Belt",
  "Lean Six Sigma Black Belt",
  "5S & Quản trị trực quan",
  "TPM & Tối ưu chỉ số OEE",
  "Lean Simulation Game Workshop",
];

const companyLinks = [
  { label: "Về WISE Academy", href: "/ve-chung-toi" },
  { label: "Dự án thực tế", href: "/du-an" },
  { label: "Chuyên gia", href: "/chuyen-gia" },
  { label: "Góc tri thức", href: "/tri-thuc" },
  { label: "Toolkit", href: "/toolkit" },
  { label: "Liên hệ", href: "/lien-he" },
];

export default function Footer() {
  return (
    <footer className="bg-[#001E38] text-white/75">
      {/* Main Footer Links */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 xl:px-12 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-3 space-y-5">
          <Link href="/" className="inline-block bg-white px-4 py-3 rounded-xl">
            <img src="/images/brand/logo.webp" width={800} height={282} alt="WISE Academy Logo" className="h-10 w-auto object-contain" />
          </Link>
          <p className="text-sm leading-relaxed max-w-sm">
            <strong className="text-white">CÔNG TY TNHH TƯ VẤN & ĐÀO TẠO WISE ACADEMY</strong> - đồng hành cùng các doanh nghiệp
            sản xuất, logistics và dịch vụ tối ưu quy trình, loại bỏ lãng phí, phát triển đội ngũ quản lý và nâng cao năng suất.
          </p>
          <div className="text-xs text-white/55 space-y-1">
            <p>Mã số thuế: 0317485522</p>
          </div>
          <Link
            href="/xac-thuc-chung-chi"
            className="inline-flex items-center gap-2 rounded-full bg-[#F76011] px-4 py-2 text-sm font-semibold text-white hover:bg-[#C9500E] transition-colors"
          >
            <ShieldCheck className="w-4 h-4" /> Xác thực chứng chỉ
          </Link>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-white font-semibold text-sm">Dịch vụ tư vấn</h4>
          <ul className="space-y-2.5 text-sm">
            {serviceLinks.map((label) => (
              <li key={label}>
                <Link href="/dich-vu-tu-van" className="hover:text-[#FF7A30] transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-white font-semibold text-sm">Đào tạo</h4>
          <ul className="space-y-2.5 text-sm">
            {trainingLinks.map((label) => (
              <li key={label}>
                <Link href="/dao-tao" className="hover:text-[#FF7A30] transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-white font-semibold text-sm">WISE Academy</h4>
          <ul className="space-y-2.5 text-sm">
            {companyLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-[#FF7A30] transition-colors whitespace-nowrap">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <h4 className="text-white font-semibold text-sm">Liên hệ</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#F76011] shrink-0 mt-0.5" />
              <span>14 Đường Số 2, Khu Xáng Thổi, P. Chánh Hưng, Q.8, TP.HCM</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-[#F76011] shrink-0 mt-0.5" />
              <span>Số 86 Song Hành, KĐT Lakeview City, P. An Phú, TP. Thủ Đức, TP.HCM</span>
            </div>
            <a href="tel:+84989002121" className="flex items-center gap-2.5 hover:text-[#FF7A30] transition-colors">
              <Phone className="w-4 h-4 text-[#F76011] shrink-0" />
              0989 002 121
            </a>
            <a href="mailto:contact@wisedemy.com.vn" className="flex items-center gap-2.5 hover:text-[#FF7A30] transition-colors">
              <Mail className="w-4 h-4 text-[#F76011] shrink-0" />
              contact@wisedemy.com.vn
            </a>
            <a href="https://wisedemy.com.vn" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-[#FF7A30] transition-colors">
              <Globe className="w-4 h-4 text-[#F76011] shrink-0" />
              www.wisedemy.com.vn
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 xl:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>© 2026 WISE Academy. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="tracking-wider">WORKABLE · IMPROVEMENT · SHARE · EXCELLENCE</span>
            <a href="#top" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white transition-colors">
              <span>Đầu trang</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
