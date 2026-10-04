"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar } from "@/components/icons";

// Floating "Quay lại" / "Đặt lịch tư vấn" bar on an expert profile. It slides in once the hero (which has its
// own buttons) has scrolled away, so it never covers the first screen.
export default function ExpertActionBar({ bookHref }: { bookHref: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 pointer-events-none transition-all duration-300 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div
        className={`${show ? "pointer-events-auto" : ""} flex items-center gap-2 rounded-full bg-white/95 backdrop-blur p-1.5 shadow-[0_18px_40px_-12px_rgba(0,30,56,0.45)] ring-1 ring-[#002F5B]/10`}
      >
        <Link
          href="/chuyen-gia"
          className="inline-flex items-center gap-2 rounded-full px-4 sm:px-5 py-2.5 text-sm font-semibold text-[#002F5B] hover:bg-[#EBF3FA] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </Link>
        <Link
          href={bookHref}
          className="inline-flex items-center gap-2 rounded-full bg-[#F76011] hover:bg-[#C9500E] px-4 sm:px-6 py-2.5 text-sm font-semibold text-white transition-colors"
        >
          <Calendar className="w-4 h-4" /> Đặt lịch tư vấn
        </Link>
      </div>
    </div>
  );
}
