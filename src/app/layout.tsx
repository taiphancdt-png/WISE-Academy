import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wisedemy.com.vn"),
  title: "WISE Academy — Viện Đào Tạo & Tư Vấn Quản Trị Tinh Gọn (Lean Six Sigma & Ops Excellence)",
  description: "WISE Academy đồng hành cùng các tập đoàn sản xuất hàng đầu (Pou Chen, GEODIS, Huali) chuyển đổi hệ thống vận hành tinh gọn, áp dụng phương pháp luận RGPDCA, đào tạo Lean Six Sigma Belts và tối ưu hóa năng suất nhà máy.",
  keywords: [
    "Lean Six Sigma",
    "Tư vấn Lean",
    "Đào tạo Lean",
    "Quản trị sản xuất",
    "5S hiện trường",
    "Kaizen",
    "TPM OEE",
    "Chuyển đổi số nhà máy",
    "Lean Belt Yellow Green Black",
    "WISE Academy",
    "Wisedemy"
  ],
  authors: [{ name: "WISE Academy Consulting & Training Co., Ltd" }],
  openGraph: {
    title: "WISE Academy — Practical Lean Training & Consultancy",
    description: "Biến vận hành thành lợi thế cạnh tranh bền vững với phương pháp luận RGPDCA chuẩn quốc tế.",
    url: "https://wisedemy.com.vn",
    siteName: "WISE Academy",
    images: [
      {
        url: "/images/brand/logo.png",
        width: 800,
        height: 600,
        alt: "WISE Academy Logo",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`scroll-smooth ${jakarta.variable}`}>
      <head></head>
      <body className="min-h-screen flex flex-col font-sans bg-[#F8F9FA] text-[#102A43] antialiased">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />

        {/* Structured Data (JSON-LD) for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "WISE Academy Consulting & Training",
              "alternateName": "Wisedemy",
              "url": "https://wisedemy.com.vn",
              "logo": "https://wisedemy.com.vn/images/brand/logo.png",
              "telephone": "+84989002121",
              "email": "contact@wisedemy.com.vn",
              "taxID": "0317485522",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Số 86 Song Hành, KĐT Lakeview City, P. An Phú",
                "addressLocality": "TP. Thủ Đức, TP. Hồ Chí Minh",
                "addressCountry": "VN"
              },
              "sameAs": [
                "https://wisedemy.com.vn"
              ]
            }),
          }}
        />
      </body>
    </html>
  );
}
