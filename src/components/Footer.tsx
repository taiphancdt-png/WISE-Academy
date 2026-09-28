import React from "react";
import Link from "next/link";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Building2, 
  CheckCircle2, 
  ArrowUp,
  Award,
  ShieldCheck
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#001E38] text-white/80 border-t border-white/10 relative overflow-hidden">
      {/* Decorative Brand Accent Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F76011]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#002F5B]/30 rounded-full blur-2xl pointer-events-none" />

      {/* Value Proposition Ribbon */}
      <div className="border-b border-white/10 bg-[#002F5B]/60 py-6 px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="w-full max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-[#F76011]/20 text-[#F76011] flex items-center justify-center font-bold text-lg">W</span>
            <div>
              <strong className="block text-white text-sm">Workable</strong>
              <span className="text-xs text-white/60">Dễ làm & Hiệu quả ngay</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-[#F76011]/20 text-[#F76011] flex items-center justify-center font-bold text-lg">I</span>
            <div>
              <strong className="block text-white text-sm">Improvement</strong>
              <span className="text-xs text-white/60">Cải tiến liên tục mỗi ngày</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-[#F76011]/20 text-[#F76011] flex items-center justify-center font-bold text-lg">S</span>
            <div>
              <strong className="block text-white text-sm">Share</strong>
              <span className="text-xs text-white/60">Chia sẻ kinh nghiệm thực tế</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-[#F76011]/20 text-[#F76011] flex items-center justify-center font-bold text-lg">E</span>
            <div>
              <strong className="block text-white text-sm">Excellence</strong>
              <span className="text-xs text-white/60">Gọn gàng & Tiết kiệm chi phí</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand & Mission column */}
        <div className="lg:col-span-2 space-y-4">
          <Link href="/" className="inline-block bg-white p-2.5 rounded-xl shadow-md">
            <img 
              src="/images/brand/logo.png" 
              alt="WISE Academy Logo" 
              className="h-11 w-auto object-contain"
            />
          </Link>
          <p className="text-white/70 text-sm leading-relaxed max-w-sm">
            <strong>CÔNG TY TNHH TƯ VẤN & ĐÀO TẠO WISE (WISE ACADEMY)</strong> — Đơn vị đồng hành cùng các nhà máy sản xuất tối ưu quy trình, loại bỏ lãng phí, đào tạo quản đốc và nâng cao năng suất chuyền.
          </p>
          <div className="pt-2 text-xs text-white/60 space-y-1">
            <p><strong>Mã số thuế:</strong> 0317485522</p>
            <p><strong>Chứng nhận:</strong> Lean Sensei Nike NOS · SSMI Lean Six Sigma · MPI Certified</p>
          </div>
        </div>

        {/* Column 2: Solutions */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider text-[#FF7A30]">
            Dịch vụ tư vấn
          </h4>
          <ul className="space-y-2 text-sm text-white/75">
            <li>
              <Link href="/dich-vu-tu-van" className="hover:text-white transition-colors">
                Chẩn đoán vận hành Gemba
              </Link>
            </li>
            <li>
              <Link href="/dich-vu-tu-van" className="hover:text-white transition-colors">
                Chuyển đổi Lean toàn diện
              </Link>
            </li>
            <li>
              <Link href="/dich-vu-tu-van" className="hover:text-white transition-colors">
                Thiết kế Lean Cell & Layout
              </Link>
            </li>
            <li>
              <Link href="/dich-vu-tu-van" className="hover:text-white transition-colors">
                Work Engineering & Năng suất
              </Link>
            </li>
            <li>
              <Link href="/dich-vu-tu-van" className="hover:text-white transition-colors">
                Lean 4.0 & Vận hành số
              </Link>
            </li>
            <li>
              <Link href="/dich-vu-tu-van" className="hover:text-white transition-colors">
                Phát triển Lean Leaders
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Training programs */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider text-[#FF7A30]">
            Chương trình đào tạo
          </h4>
          <ul className="space-y-2 text-sm text-white/75">
            <li>
              <Link href="/dao-tao" className="hover:text-white transition-colors">
                Lean Six Sigma Yellow Belt
              </Link>
            </li>
            <li>
              <Link href="/dao-tao" className="hover:text-white transition-colors">
                Lean Six Sigma Green Belt
              </Link>
            </li>
            <li>
              <Link href="/dao-tao" className="hover:text-white transition-colors">
                Lean Six Sigma Black Belt
              </Link>
            </li>
            <li>
              <Link href="/dao-tao" className="hover:text-white transition-colors">
                5S & Quản trị trực quan
              </Link>
            </li>
            <li>
              <Link href="/dao-tao" className="hover:text-white transition-colors">
                TPM & Tối ưu chỉ số OEE
              </Link>
            </li>
            <li>
              <Link href="/dao-tao" className="hover:text-white transition-colors">
                Lean Simulation Game Workshop
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact & Office */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider text-[#FF7A30]">
            Trụ sở & Liên hệ
          </h4>
          <div className="space-y-3 text-xs sm:text-sm text-white/75">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#F76011] shrink-0 mt-1" />
              <span>14 Đường Số 2, Khu Xáng Thổi, P. Chánh Hưng, Q.8, TP.HCM</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-[#F76011] shrink-0 mt-1" />
              <span>Số 86 Song Hành, KĐT Lakeview City, P. An Phú, TP. Thủ Đức, TP.HCM</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#F76011] shrink-0" />
              <a href="tel:+84932090075" className="hover:text-[#F76011] transition-colors">
                0932 090 075
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#F76011] shrink-0" />
              <a href="mailto:contact@wisedemy.com.vn" className="hover:text-[#F76011] transition-colors">
                contact@wisedemy.com.vn
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-[#F76011] shrink-0" />
              <a href="https://wisedemy.com.vn" target="_blank" rel="noopener noreferrer" className="hover:text-[#F76011] transition-colors">
                www.wisedemy.com.vn
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6 px-4 sm:px-6 lg:px-8 bg-[#001426]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>© 2026 WISE Academy. All rights reserved. Practical Lean Training & Consultancy.</p>
          <div className="flex items-center gap-6">
            <span className="font-semibold tracking-wider text-[#FF7A30]">WORKABLE · IMPROVEMENT · SHARE · EXCELLENCE</span>
            <a 
              href="#top" 
              className="inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors bg-white/10 px-3 py-1.5 rounded-full"
            >
              <span>Đầu trang</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
