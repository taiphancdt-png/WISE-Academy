import React from "react";

// Width/height per logo chosen so every mark covers a similar visual area (wide wordmarks vs. round badges).
const clients = [
  { name: "LSSI - Lean Six Sigma Institute", logo: "lssi", w: 104, h: 42 },
  { name: "GEODIS", logo: "geodis", w: 69, h: 62 },
  { name: "HuaLi Industrial Group", logo: "huali", w: 179, h: 44 },
  { name: "KREVES", logo: "kreves", w: 131, h: 34 },
  { name: "APACHE Footwear Group", logo: "apache", w: 179, h: 55 },
  { name: "AQUA Smart Home", logo: "aqua", w: 100, h: 44 },
  { name: "Pou Chen (PCD)", logo: "pcd", w: 56, h: 55 },
  { name: "Tỷ Bách", logo: "ty-bach", w: 62, h: 47 },
  { name: "AG Samho", logo: "samho", w: 56, h: 47 },
  { name: "OCEANVET - Thuốc Thú Y Đại Dương", logo: "oceanvet", w: 164, h: 44 },
  { name: "Victory Group", logo: "victory", w: 92, h: 64 },
];

// Infinite single-row marquee of client / partner logos (list is duplicated for a seamless loop).
export default function PartnerLogos({ className = "" }: { className?: string }) {
  return (
    <section className={`bg-white py-12 px-4 sm:px-6 border-b border-slate-100 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-sm font-medium text-[#486581] mb-8">
          Được tin tưởng bởi các doanh nghiệp & tổ chức hàng đầu
        </p>
        <div className="logo-marquee overflow-hidden">
          <ul className="animate-ticker items-center">
            {[...clients, ...clients].map((c, i) => (
              <li
                key={`${c.logo}-${i}`}
                className="shrink-0 w-[200px] sm:w-[240px] flex items-center justify-center h-16"
                aria-hidden={i >= clients.length || undefined}
              >
                <img
                  src={`/images/clients/${c.logo}.png`}
                  alt={i >= clients.length ? "" : c.name}
                  title={c.name}
                  width={c.w}
                  height={c.h}
                  style={{ width: c.w, height: c.h }}
                  className="object-contain"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
