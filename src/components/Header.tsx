"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Mail, Menu, X, ChevronRight } from "@/components/icons";
import LanguageSwitcher, { useLang } from "@/components/LanguageSwitcher";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const lang = useLang();

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
    { label: "Về WISE Academy", en: "About WISE Academy", zh: "关于 WISE Academy", href: "/ve-chung-toi" },
    { label: "Dịch vụ tư vấn", en: "Consulting", zh: "咨询服务", href: "/dich-vu-tu-van" },
    { label: "Đào tạo", en: "Training", zh: "培训课程", href: "/dao-tao" },
    { label: "Dự án thực tế", en: "Case Studies", zh: "项目案例", href: "/du-an" },
    { label: "Chuyên gia", en: "Experts", zh: "专家团队", href: "/chuyen-gia" },
    { label: "Góc tri thức", en: "Insights", zh: "知识中心", href: "/tri-thuc" },
    { label: "Toolkit", en: "Toolkit", zh: "工具包", href: "/toolkit" },
    { label: "Liên hệ", en: "Contact", zh: "联系我们", href: "/lien-he" },
  ];
  const ctaLabel = { vi: "Đặt lịch tư vấn", en: "Book a Consultation", zh: "预约咨询" }[lang];

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Top Contact Bar */}
      <div className="bg-[#001E38] text-white text-xs sm:text-[13px] py-2.5 px-4 sm:px-8 xl:px-12 hidden md:block">
        <div className="w-full max-w-[1400px] mx-auto flex justify-between items-center">
          <a href="tel:+84989002121" className="flex items-center gap-2 font-semibold group">
            <Phone className="w-3.5 h-3.5 text-[#F76011]" />
            <span>Hotline tư vấn:</span>
            <span className="text-[#FF7A30] group-hover:underline">0989 002 121</span>
          </a>
          <div className="flex items-center gap-8">
            <a href="mailto:contact@wisedemy.com.vn" className="flex items-center gap-2 font-semibold group">
              <Mail className="w-3.5 h-3.5 text-[#F76011]" />
              <span>Email:</span>
              <span className="text-[#FF7A30] group-hover:underline">contact@wisedemy.com.vn</span>
            </a>
            <LanguageSwitcher dark />
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header
        className={`sticky top-0 z-50 w-full bg-white border-b border-slate-200 transition-shadow duration-300 ${
          isScrolled ? "shadow-md shadow-[#001E38]/5" : ""
        }`}
      >
        <div
          className={`w-full max-w-[1400px] mx-auto px-4 sm:px-8 xl:px-12 flex items-center justify-between gap-6 transition-all duration-300 ${
            isScrolled ? "py-2.5" : "py-4"
          }`}
        >
          <Link href="/" className="shrink-0">
            <img
              src="/images/brand/logo.webp"
              width={800}
              height={282}
              alt="WISE Academy Logo"
              className={`w-auto object-contain transition-all duration-300 ${isScrolled ? "h-10" : "h-12"}`}
            />
          </Link>

          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            <nav className="flex items-center whitespace-nowrap">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-2 xl:px-4 py-2 text-[13px] xl:text-sm font-medium transition-colors ${
                    isActive(item.href) ? "text-[#F76011]" : "text-[#486581] hover:text-[#002F5B]"
                  }`}
                >
                  <span className="notranslate" translate="no">
                    {lang === "vi" ? item.label : item[lang]}
                  </span>
                </Link>
              ))}
            </nav>
            <Link
              href="/lien-he"
              className="ml-2 inline-flex items-center bg-[#002F5B] hover:bg-[#F76011] text-white text-[13px] xl:text-sm font-semibold px-4 xl:px-5 py-2.5 rounded-full transition-colors whitespace-nowrap"
            >
              <span className="notranslate" translate="no">{ctaLabel}</span>
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#002F5B] hover:text-[#F76011] transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6">
            <div className="divide-y divide-slate-100">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-2 py-3.5 text-base font-medium ${
                    isActive(item.href) ? "text-[#F76011]" : "text-[#102A43]"
                  }`}
                >
                  <span className="notranslate" translate="no">
                    {lang === "vi" ? item.label : item[lang]}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              ))}
            </div>
            <LanguageSwitcher className="px-2 pt-4 text-sm" />
            <Link
              href="/lien-he"
              className="mt-4 block text-center bg-[#F76011] text-white font-semibold py-3 rounded-full"
            >
              <span className="notranslate" translate="no">{ctaLabel}</span>
            </Link>
            <div className="flex flex-col gap-2 text-sm text-[#486581] pt-4 px-2">
              <a href="tel:+84989002121" className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F76011]" /> 0989 002 121
              </a>
              <a href="mailto:contact@wisedemy.com.vn" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F76011]" /> contact@wisedemy.com.vn
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
