import type { NextConfig } from "next";
import legacyRedirects from "./src/data/legacy-redirects.json";

// Baseline security headers for every route. A strict Content-Security-Policy is not set because
// the site relies on the Google Translate widget, which injects inline scripts and styles.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Old WordPress URLs -> new pages (301); Netlify already sends www to the apex domain
  async redirects() {
    return legacyRedirects.map((r) => ({ ...r, statusCode: 301 as const }));
  },
  // "Săn Lãng Phí" game: static pages in public/game, short links for players (QR) and the host
  async rewrites() {
    return [
      { source: "/game", destination: "/game/index.html" },
      { source: "/game/host", destination: "/game/host.html" },
    ];
  },
};

export default nextConfig;
