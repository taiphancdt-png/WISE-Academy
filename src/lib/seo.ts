import type { Metadata } from "next";

export const SITE_URL = "https://wisedemy.com.vn";
export const SITE_NAME = "WISE Academy";
export const OG_IMAGE = { url: "/images/brand/og-image.jpg", width: 1200, height: 630, alt: "WISE Academy: đồng hành tối ưu vận hành, năng suất, chất lượng" };

// Serialize JSON-LD safely for a <script> tag (escape "<" so content can never close the tag).
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}

// Plain-text meta description, cut on a word boundary around the length Google displays.
export function metaDescription(text: string, max = 155) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

// Search results show about 60 characters of a title: add the brand only when it still fits.
export function seoTitle(title: string) {
  const branded = `${title} | ${SITE_NAME}`;
  return branded.length <= 60 ? branded : title;
}

// Title, description, canonical URL and the matching Open Graph / Twitter card for one page,
// so a shared link shows this page (not the home page) on Facebook, Zalo and LinkedIn.
export function pageMeta({
  title,
  description,
  path,
  image,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: { url: string; width?: number; height?: number; alt?: string };
  type?: "website" | "article" | "profile";
}): Metadata {
  const desc = metaDescription(description);
  const images = [image || OG_IMAGE];
  return {
    title,
    description: desc,
    alternates: { canonical: path },
    openGraph: { type, url: path, siteName: SITE_NAME, locale: "vi_VN", title, description: desc, images },
    twitter: { card: "summary_large_image", title, description: desc, images: images.map((i) => i.url) },
  };
}
