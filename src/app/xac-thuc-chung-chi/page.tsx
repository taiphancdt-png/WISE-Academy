import PageHero from "@/components/PageHero";
import CertificateLookup from "@/components/CertificateLookup";

export const metadata = {
  title: "Xác thực chứng chỉ | WISE Academy",
  description: "Nhập mã chứng chỉ để kiểm tra chứng chỉ do WISE Academy cấp cho học viên.",
  alternates: { canonical: "/xac-thuc-chung-chi" },
};

export default function CertificateVerificationPage() {
  return (
    <div className="bg-[#F8F9FA]">
      <PageHero
        eyebrow="Certificate verification"
        image="/images/projects/aqua-growth-mindset-kaizen/photo_1.webp"
        title={<>Xác thực <span className="text-[#FF7A30]">chứng chỉ</span></>}
        description="Nhập mã số in trên chứng chỉ để kiểm tra thông tin chứng chỉ do WISE Academy cấp cho học viên."
      />
      <section className="px-4 sm:px-8 xl:px-12 py-14 lg:py-20">
        <div className="max-w-5xl mx-auto">
          <CertificateLookup />
        </div>
      </section>
    </div>
  );
}
