import { NextResponse } from "next/server";
import { keyOf, lookup, normalize, translateMissing, type Lang } from "@/lib/translate";

// Translations for the page the visitor is reading: stored ones are returned at once, new ones are written by Claude
// and stored. The client sends the page's texts; the reply maps each text to its translation.
export const runtime = "nodejs";
export const maxDuration = 60;

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 120;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return NextResponse.json({ error: "too_many_requests" }, { status: 429 });

  const body = (await request.json().catch(() => null)) as { lang?: string; texts?: unknown } | null;
  const lang = body?.lang === "en" || body?.lang === "zh" ? (body.lang as Lang) : null;
  if (!lang || !Array.isArray(body?.texts)) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  // only Vietnamese site text of sensible length is accepted
  const texts = [...new Set((body.texts as unknown[]).filter((t): t is string => typeof t === "string").map(normalize))]
    .filter((t) => t.length > 1 && t.length <= 6000)
    .slice(0, 150);
  if (texts.reduce((n, t) => n + t.length, 0) > 60000) return NextResponse.json({ error: "too_large" }, { status: 413 });

  const byKey = new Map(texts.map((t) => [keyOf(t), t]));
  const found = await lookup(lang, [...byKey.keys()]);
  const missing = [...byKey].filter(([k]) => found[k] === undefined).map(([key, text]) => ({ key, text }));
  const fresh = await translateMissing(lang, missing);
  const all = { ...found, ...fresh };
  // keyed by the (normalized) source text, which is what the page has in hand
  const translations = Object.fromEntries([...byKey].filter(([k]) => all[k] !== undefined).map(([k, t]) => [t, all[k]]));
  return NextResponse.json({ translations }, { headers: { "cache-control": "no-store" } });
}
