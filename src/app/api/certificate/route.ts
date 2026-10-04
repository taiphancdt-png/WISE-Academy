import { NextResponse } from "next/server";
import { findCertificate, normalizeCode } from "@/lib/certificates";

// Looks up one certificate by its code. Rate-limited per IP so codes cannot be guessed in bulk.
export const runtime = "nodejs";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 20;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return NextResponse.json({ ok: false, error: "too_many_requests" }, { status: 429 });

  const code = normalizeCode(new URL(request.url).searchParams.get("code") || "");
  if (!code || code.length > 40 || !/^[A-Z0-9._/-]+$/.test(code)) {
    return NextResponse.json({ ok: false, error: "invalid_code" }, { status: 400 });
  }
  try {
    const cert = await findCertificate(code);
    if (!cert) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    const { imageId, ...data } = cert;
    return NextResponse.json(
      {
        ok: true,
        certificate: {
          ...data,
          image: imageId === "demo" ? "/images/demo-certificate.webp" : imageId ? `/api/certificate/image?id=${imageId}` : null,
        },
      },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (err) {
    console.error("certificate lookup failed", err);
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }
}
