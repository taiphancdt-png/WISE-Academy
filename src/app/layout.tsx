import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { OG_IMAGE, SITE_NAME, SITE_URL, jsonLd } from "@/lib/seo";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "WISE Academy — Tư vấn & Đào tạo Lean Six Sigma cho doanh nghiệp",
    template: "%s",
  },
  description:
    "WISE Academy — đối tác ủy quyền của LSSI Global tại Việt Nam: tư vấn tối ưu vận hành, đào tạo Lean Six Sigma, 5S, TPM cho doanh nghiệp sản xuất, logistics và dịch vụ.",
  keywords: [
    "Lean Six Sigma",
    "đào tạo Lean Six Sigma",
    "Green Belt",
    "Yellow Belt",
    "tư vấn Lean",
    "tối ưu vận hành doanh nghiệp",
    "tối ưu vận hành nhà máy",
    "5S",
    "Kaizen",
    "TPM OEE",
    "DMAIC",
    "LSSI Vietnam",
    "WISE Academy",
  ],
  authors: [{ name: "WISE Academy" }],
  openGraph: {
    siteName: SITE_NAME,
    title: "WISE Academy — Tư vấn & Đào tạo Lean Six Sigma cho doanh nghiệp",
    description: "Tối ưu vận hành, tăng năng suất bền vững. Đối tác ủy quyền của LSSI Global tại Việt Nam & châu Á.",
    images: [OG_IMAGE],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE.url],
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`scroll-smooth ${jakarta.variable}`}>
      <head>
        {/* Google Translate rewrites text nodes; keep React's DOM ops from throwing when nodes were swapped. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){if(typeof Node!=="function")return;var r=Node.prototype.removeChild;Node.prototype.removeChild=function(c){if(c.parentNode!==this)return c;return r.apply(this,arguments)};var i=Node.prototype.insertBefore;Node.prototype.insertBefore=function(n,ref){if(ref&&ref.parentNode!==this)return n;return i.apply(this,arguments)}})();`,
          }}
        />
      </head>
      <body id="top" className="min-h-screen flex flex-col font-sans bg-white text-[#102A43] antialiased">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <ScrollReveal />

        {/* Automatic Vietnamese → English / Chinese translation (toggled by LanguageSwitcher via the googtrans cookie) */}
        <div id="google_translate_element" className="hidden" />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`window.googleTranslateElementInit=function(){new google.translate.TranslateElement({pageLanguage:'vi',includedLanguages:'vi,en,zh-CN',autoDisplay:false},'google_translate_element')};`}
        </Script>
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />

        {/* Structured Data (JSON-LD) for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "@id": `${SITE_URL}/#organization`,
            name: "Công ty TNHH Tư vấn & Đào tạo WISE Academy",
            alternateName: ["WISE Academy", "Wisedemy"],
            url: SITE_URL,
            logo: `${SITE_URL}/images/brand/logo.png`,
            image: `${SITE_URL}${OG_IMAGE.url}`,
            description: "Tư vấn tối ưu vận hành và đào tạo Lean Six Sigma cho doanh nghiệp sản xuất, logistics và dịch vụ; đối tác ủy quyền của LSSI Global tại Việt Nam & châu Á.",
            telephone: "+84989002121",
            email: "contact@wisedemy.com.vn",
            taxID: "0317485522",
            areaServed: ["VN", "Asia"],
            address: [
              {
                "@type": "PostalAddress",
                streetAddress: "14 Đường Số 2, Khu Xáng Thổi, P. Chánh Hưng, Quận 8",
                addressLocality: "TP. Hồ Chí Minh",
                addressCountry: "VN",
              },
              {
                "@type": "PostalAddress",
                streetAddress: "Số 86 Song Hành, KĐT Lakeview City, P. An Phú",
                addressLocality: "TP. Thủ Đức, TP. Hồ Chí Minh",
                addressCountry: "VN",
              },
            ],
            sameAs: ["https://www.facebook.com/1003927162429125"],
          })}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            url: SITE_URL,
            name: SITE_NAME,
            inLanguage: "vi",
            publisher: { "@id": `${SITE_URL}/#organization` },
          })}
        />
      </body>
    </html>
  );
}
