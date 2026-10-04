"use client";

import React, { useEffect, useState } from "react";

export type Lang = "vi" | "en" | "zh";

const OPTIONS: { lang: Lang; flag: string; label: string }[] = [
  { lang: "vi", flag: "🇻🇳", label: "Tiếng Việt" },
  { lang: "en", flag: "🇬🇧", label: "English" },
  { lang: "zh", flag: "🇨🇳", label: "中文" },
];

// The chosen language is kept in the `wise_lang` cookie; SiteTranslator shows the page in it (translations by Claude).
// Content is authored in Vietnamese.
export function readLang(): Lang {
  const m = document.cookie.match(/(?:^|;\s*)wise_lang=(en|zh)/);
  return m ? (m[1] as Lang) : "vi";
}

function writeLang(lang: Lang) {
  const year = 60 * 60 * 24 * 365;
  document.cookie = lang === "vi" ? "wise_lang=; path=/; max-age=0" : `wise_lang=${lang}; path=/; max-age=${year}`;
  // clear the cookie the former Google Translate switcher used, or Google's widget could come back
  const host = window.location.hostname;
  for (const d of ["", host, `.${host.replace(/^www\./, "")}`]) {
    document.cookie = `googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT${d ? `; domain=${d}` : ""}`;
  }
}

// Current site language, for UI labels that ship a hand-written version instead of machine translation.
export function useLang(): Lang {
  const [lang, setLang] = useState<Lang>("vi");
  useEffect(() => {
    setLang(readLang());
  }, []);
  return lang;
}

export default function LanguageSwitcher({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  const lang = useLang();

  const choose = (next: Lang) => {
    if (next === lang) return;
    writeLang(next);
    window.location.reload();
  };

  const inactive = dark ? "text-white/70 hover:text-white" : "text-[#486581] hover:text-[#002F5B]";
  const active = dark ? "text-white font-semibold" : "text-[#002F5B] font-semibold";

  return (
    <div className={`notranslate flex items-center gap-4 ${className}`} translate="no">
      {OPTIONS.map((o) => (
        <button
          key={o.lang}
          type="button"
          onClick={() => choose(o.lang)}
          className={`flex items-center gap-1.5 transition-colors ${lang === o.lang ? active : inactive}`}
        >
          <span aria-hidden>{o.flag}</span> {o.label}
        </button>
      ))}
    </div>
  );
}
