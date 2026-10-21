import type { NextConfig } from "next";
import legacyRedirects from "./src/data/legacy-redirects.json";

// Baseline security headers for every route.
const baseHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

// Content-Security-Policy: scripts, styles, fonts and requests only from this site.
// 'unsafe-inline' scripts are needed by Next.js (inline hydration data, no nonce); nothing external may load.
const SITE_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: blob:",
  "connect-src 'self'",
  "frame-src 'self'",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

// The Toolkit apps and games in public/tools and public/game: their bundles compile JSX in the browser
// (Babel, so 'unsafe-eval'), unpack assets into blob: URLs and load React / html2canvas / jsPDF from CDNs.
// Netlify serves these static files itself, so public/_headers repeats this policy there (keep the two in sync).
const TOOLS_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://cdn.jsdelivr.net https://unpkg.com",
  "style-src 'self' 'unsafe-inline' blob: https://fonts.googleapis.com",
  "font-src 'self' data: blob: https://fonts.gstatic.com",
  "img-src 'self' data: blob:",
  "connect-src 'self' data: blob: https://cdn.jsdelivr.net https://unpkg.com",
  "worker-src 'self' blob:",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path((?!tools/|game/|game$).*)", headers: [...baseHeaders, { key: "Content-Security-Policy", value: SITE_CSP }] },
      { source: "/tools/:path*", headers: [...baseHeaders, { key: "Content-Security-Policy", value: TOOLS_CSP }] },
      { source: "/game", headers: [...baseHeaders, { key: "Content-Security-Policy", value: TOOLS_CSP }] },
      { source: "/game/:path*", headers: [...baseHeaders, { key: "Content-Security-Policy", value: TOOLS_CSP }] },
    ];
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
