"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Phone, 
  Mail, 
  Menu, 
  X, 
  ChevronRight, 
  ArrowUpRight,
  Award,
  Factory,
  GraduationCap,
  Users,
  BookOpen,
  CalendarCheck
} from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on page transition
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Trang chủ", href: "/" },
    { label: "Về WISE", href: "/ve-chung-toi" },
    { label: "Dịch vụ tư vấn", href: "/dich-vu-tu-van" },
    { label: "Đào tạo", href: "/dao-tao" },
    { label: "Dự án thực tế", href: "/du-an" },
    { label: "Chuyên gia", href: "/chuyen-gia" },
    { label: "Góc tri thức", href: "/tri-thuc" },
  ];

  return (
    <>
      {/* Top Notification / Contact Bar */}
      <div className="bg-[#001E38] text-[#829AB1] text-xs py-2 px-4 sm:px-8 xl:px-12 border-b border-white/10 hidden md:block">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00BE62] animate-pulse"></span>
              <strong className="text-white font-medium">WISE Academy</strong> — Đào tạo & Tư vấn Tối ưu Vận hành Nhà máy
            </span>
            <span className="text-white/30">|</span>
            <span className="text-white/80">Giải pháp Thực chiến · Tăng Năng suất & Tiết kiệm Chi phí</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="tel:+84989002121" className="flex items-center gap-1.5 hover:text-[#F76011] transition-colors text-white/90">
              <Phone className="w-3.5 h-3.5 text-[#F76011]" />
              <span>Hotline: <strong>0989 002 121</strong></span>
            </a>
            <a href="mailto:contact@wisedemy.com.vn" className="flex items-center gap-1.5 hover:text-[#F76011] transition-colors text-white/90">
              <Mail className="w-3.5 h-3.5 text-[#F76011]" />
              <span>contact@wisedemy.com.vn</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Header (Full Width, No Wrap) */}
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 w-full ${
          isScrolled 
            ? "bg-[#002F5B]/95 backdrop-blur-md shadow-lg shadow-[#001E38]/20 py-2.5" 
            : "bg-[#002F5B] py-3.5"
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between gap-4">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="bg-white p-2 rounded-xl shadow-md group-hover:scale-[1.03] transition-transform duration-300">
              <img 
                src="/images/brand/logo.png" 
                alt="WISE Academy Logo" 
                className="h-10 sm:h-11 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
            <div className="hidden xl:block text-left">
              <span className="block text-white font-extrabold text-sm 2xl:text-base tracking-wider leading-none">
                WISE ACADEMY
              </span>
              <span className="text-[#FF7A30] text-[10px] font-bold tracking-widest uppercase">
                Tối Ưu Vận Hành & Năng Suất
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (Full Width, Never Wraps) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 2xl:gap-3 shrink-0 flex-nowrap whitespace-nowrap">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 xl:px-3.5 py-2 rounded-lg text-xs xl:text-sm font-semibold whitespace-nowrap shrink-0 transition-all duration-200 ${
                    isActive
                      ? "text-[#F76011] bg-white/10 shadow-sm"
                      : "text-white/90 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTA: Đặt lịch tư vấn */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <Link
              href="/lien-he"
              className="inline-flex items-center gap-2 bg-[#F76011] hover:bg-[#FF6712] text-white text-xs xl:text-sm font-bold px-4 xl:px-5 py-2.5 rounded-full shadow-md shadow-[#F76011]/30 hover:shadow-lg hover:shadow-[#F76011]/50 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap shrink-0 group"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Đặt lịch tư vấn</span>
              <ArrowUpRight className="w-4 h-4 growth-arrow" />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-[#F76011] transition-colors focus:outline-none shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#001E38] border-b border-white/10 px-4 pt-4 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
            <div className="space-y-1">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg text-base font-semibold ${
                      isActive
                        ? "text-[#F76011] bg-white/10"
                        : "text-white/90 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-white/40" />
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <Link
                href="/lien-he"
                className="w-full text-center flex items-center justify-center gap-2 bg-[#F76011] text-white font-bold py-3 rounded-xl shadow-md"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Đặt lịch tư vấn trực tiếp</span>
              </Link>
              <div className="flex justify-between items-center text-xs text-white/70 px-2 pt-2">
                <a href="tel:+84989002121" className="flex items-center gap-1 hover:text-[#F76011]">
                  <Phone className="w-3.5 h-3.5 text-[#F76011]" /> 0989 002 121
                </a>
                <a href="mailto:contact@wisedemy.com.vn" className="flex items-center gap-1 hover:text-[#F76011]">
                  <Mail className="w-3.5 h-3.5 text-[#F76011]" /> contact@wisedemy.com.vn
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
