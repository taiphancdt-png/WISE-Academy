"use client";

import React, { useEffect, useState } from "react";

export type Lang = "vi" | "en" | "zh";

// Google Translate language code for each site language.
const GT_CODE: Record<Lang, string> = { vi: "vi", en: "en", zh: "zh-CN" };

const OPTIONS: { lang: Lang; flag: string; label: string }[] = [
  { lang: "vi", flag: "🇻🇳", label: "Tiếng Việt" },
  { lang: "en", flag: "🇬🇧", label: "English" },
  { lang: "zh", flag: "🇨🇳", label: "中文" },
];

// Google Translate reads the `googtrans` cookie ("/<source>/<target>") on load.
// Content is authored in Vietnamese; other languages are machine-translated on the fly.
function readLang(): Lang {
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
  const target = match ? decodeURIComponent(match[1]).split("/").pop() : "";
  if (target === GT_CODE.en) return "en";
  if (target === GT_CODE.zh) return "zh";
  return "vi";
}

function writeLang(lang: Lang) {
  const host = window.location.hostname;
  const domains = ["", host, `.${host.replace(/^www\./, "")}`];
  for (const d of domains) {
    const domainAttr = d ? `; domain=${d}` : "";
    if (lang === "vi") {
      document.cookie = `googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT${domainAttr}`;
    } else {
      document.cookie = `googtrans=/vi/${GT_CODE[lang]}; path=/${domainAttr}`;
    }
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
