import React from "react";
import SectionBadge from "@/components/SectionBadge";

interface PageHeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  image: string;
  children?: React.ReactNode;
}

// Full-bleed photo banner with navy overlay and centered copy, used at the top of inner pages.
export default function PageHero({ eyebrow, title, description, image, children }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden text-white">
      <img src={image} alt="" className="hero-zoom absolute inset-0 -z-20 w-full h-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-[#001E38]/80" />
      <div className="hero-enter max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-24 text-center">
        {eyebrow && <SectionBadge title={eyebrow} light />}
        <h1 className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight">{title}</h1>
        {description && (
          <p className="mt-5 text-base sm:text-lg text-white/85 leading-relaxed max-w-2xl mx-auto">{description}</p>
        )}
        {children && <div className="mt-8 flex flex-wrap justify-center gap-4">{children}</div>}
      </div>
    </section>
  );
}
