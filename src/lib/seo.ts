export const SITE_URL = "https://wisedemy.com.vn";
export const SITE_NAME = "WISE Academy";
export const OG_IMAGE = { url: "/images/brand/og-image.jpg", width: 1200, height: 630, alt: "WISE Academy — Tư vấn & đào tạo Lean Six Sigma" };

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
