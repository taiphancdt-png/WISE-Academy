import React from "react";
import Link from "next/link";

// Shared layout primitives so every page follows the same spacing, type scale and button styles.
// Section headers intentionally render no eyebrow label: only page heroes carry one.

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-6xl mx-auto ${className}`}>{children}</div>;
}

export function Section({
  children,
  tone = "white",
  className = "",
  id,
}: {
  children: React.ReactNode;
  tone?: "white" | "muted" | "navy";
  className?: string;
  id?: string;
}) {
  const bg = { white: "bg-white", muted: "bg-[#F8F9FA]", navy: "bg-[#001E38] text-white" }[tone];
  return (
    <section id={id} className={`${bg} py-16 lg:py-24 px-4 sm:px-6 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeader({
  title,
  description,
  align = "center",
  action,
  light = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left";
  action?: React.ReactNode;
  light?: boolean;
}) {
  const titleColor = light ? "text-white" : "text-[#002F5B]";
  const descColor = light ? "text-white/75" : "text-[#486581]";
  if (action) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <h2 className={`text-3xl sm:text-[34px] font-semibold leading-tight ${titleColor}`}>{title}</h2>
          {description && <p className={`mt-3 text-sm sm:text-base leading-relaxed ${descColor}`}>{description}</p>}
        </div>
        <div className="shrink-0">{action}</div>
      </div>
    );
  }
  return (
    <div className={`mb-12 ${align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}`}>
      <h2 className={`text-3xl sm:text-[34px] font-semibold leading-tight ${titleColor}`}>{title}</h2>
      {description && <p className={`mt-3 text-sm sm:text-base leading-relaxed ${descColor}`}>{description}</p>}
    </div>
  );
}

type ButtonVariant = "primary" | "navy" | "outline" | "white";

const buttonStyles: Record<ButtonVariant, string> = {
  primary: "bg-[#F76011] hover:bg-[#C9500E] text-white",
  navy: "bg-[#002F5B] hover:bg-[#F76011] text-white",
  outline: "border border-[#C9500E] text-[#C9500E] hover:bg-[#F76011] hover:border-[#F76011] hover:text-white",
  white: "bg-white text-[#002F5B] hover:bg-[#F76011] hover:text-white",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 font-semibold text-sm px-7 py-3 rounded-full transition-colors ${buttonStyles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

// Closing call-to-action band used at the bottom of inner pages.
export function CtaBand({
  title,
  description,
  href = "/lien-he",
  label = "Đặt lịch tư vấn",
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  href?: string;
  label?: string;
}) {
  return (
    <section className="bg-[#002F5B] text-white py-16 px-4 sm:px-6">
      <Container className="text-center max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-semibold leading-tight">{title}</h2>
        {description && <p className="mt-4 text-sm sm:text-base text-white/80 leading-relaxed">{description}</p>}
        <div className="mt-8">
          <ButtonLink href={href}>{label}</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
