import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Sends website form submissions (homepage, contact, LSSI interest) straight to WISE's inboxes via SMTP.
// Configure in the hosting environment (never commit real values): SMTP_HOST, SMTP_PORT, SMTP_USER,
// SMTP_PASS, optional SMTP_FROM and LEAD_RECIPIENTS (comma-separated).

export const runtime = "nodejs";

const DEFAULT_RECIPIENTS = "thuynt@wisedemy.com.vn,taipt@wisedemy.com.vn";

const FORM_TITLES: Record<string, string> = {
  home: "Đặt lịch tư vấn (trang chủ)",
  contact: "Đặt lịch khảo sát & tư vấn (trang Liên hệ)",
  lssi: "Đăng ký quan tâm chương trình LSSI",
};

const MAX_FIELDS = 20;
const MAX_LABEL = 80;
const MAX_VALUE = 2000;

// Simple per-IP rate limit (per server instance): 5 submissions per 10 minutes.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

// Header-safe single line (no CR/LF injection into Subject).
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "too_many_requests" }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const { form, fields, website } = (payload || {}) as { form?: string; fields?: unknown; website?: string };

  // Honeypot: real visitors never fill the hidden "website" field. Pretend success for bots.
  if (website) return NextResponse.json({ ok: true });

  if (!form || !(form in FORM_TITLES) || !Array.isArray(fields) || fields.length === 0 || fields.length > MAX_FIELDS) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const rows = (fields as unknown[])
    .filter((f): f is { label: string; value: string } => {
      const r = f as { label?: unknown; value?: unknown };
      return typeof r?.label === "string" && typeof r?.value === "string";
    })
    .map((f) => ({ label: oneLine(f.label).slice(0, MAX_LABEL), value: f.value.trim().slice(0, MAX_VALUE) }));

  const get = (label: string) => rows.find((r) => r.label === label)?.value || "";
  const name = get("Họ và tên");
  const phone = get("Số điện thoại");
  const email = get("Email");
  if (!name || (!phone && !email) || (email && !EMAIL_RE.test(email))) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, LEAD_RECIPIENTS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error("[lead] SMTP is not configured; submission not sent");
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const port = Number(SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const title = FORM_TITLES[form];
  const text = [`${title}`, "", ...rows.map((r) => `${r.label}: ${r.value}`), "", `Gửi từ website wisedemy.com.vn`].join("\n");
  const html = `
    <div style="font-family:Arial,sans-serif;font-size:14px;color:#102A43">
      <h2 style="color:#002F5B;margin:0 0 12px">${escapeHtml(title)}</h2>
      <table cellpadding="6" style="border-collapse:collapse">
        ${rows
          .map(
            (r) =>
              `<tr><td style="color:#486581;vertical-align:top;white-space:nowrap"><b>${escapeHtml(r.label)}</b></td><td style="white-space:pre-wrap">${escapeHtml(r.value)}</td></tr>`
          )
          .join("")}
      </table>
      <p style="color:#829AB1;font-size:12px;margin-top:16px">Gửi từ form trên website wisedemy.com.vn</p>
    </div>`;

  try {
    await transporter.sendMail({
      from: SMTP_FROM || `WISE Academy Website <${SMTP_USER}>`,
      to: (LEAD_RECIPIENTS || DEFAULT_RECIPIENTS).split(",").map((s) => s.trim()).filter(Boolean),
      replyTo: email && EMAIL_RE.test(email) ? email : undefined,
      subject: oneLine(`[Website] ${title} – ${name}`).slice(0, 200),
      text,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[lead] send failed", err);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
}
