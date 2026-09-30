import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liên hệ & đặt lịch tư vấn nhà máy — WISE Academy",
  description:
    "Liên hệ WISE Academy để đặt lịch khảo sát hiện trường miễn phí, tư vấn Lean Six Sigma và đào tạo in-house cho nhà máy. Hotline 0989 002 121.",
  alternates: { canonical: "/lien-he" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
