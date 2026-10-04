import { createSign } from "node:crypto";

// Certificates are kept by WISE Academy in a Google Sheet (one row per certificate) and the certificate
// images in Google Drive. The website reads them with a Google service account, so staff manage the data
// with their own Google accounts: type rows, or import an Excel file into the sheet (File > Import).
//
// Environment (set in the hosting provider, never commit real values):
//   GOOGLE_SERVICE_ACCOUNT_EMAIL  service account e-mail (share the sheet and the image folder with it, Viewer)
//   GOOGLE_PRIVATE_KEY            its private key, with "\n" for line breaks
//   CERT_SHEET_ID                 id of the Google Sheet (the long part of its URL)
//   CERT_SHEET_RANGE              optional, default "Certificates!A:H"
//
// Sheet columns (row 1 = headers): Mã chứng chỉ | Họ và tên | Chương trình | Cấp độ | Ngày cấp |
// Đơn vị cấp | Trạng thái | Ảnh chứng chỉ (Google Drive link)

export interface Certificate {
  code: string;
  name: string;
  program: string;
  level: string;
  issued: string;
  issuer: string;
  status: string;
  imageId: string | null;
}

const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly https://www.googleapis.com/auth/drive.readonly";

export const normalizeCode = (s: string) => s.trim().toUpperCase().replace(/\s+/g, "");

// Drive links come in several shapes: /file/d/<id>/view, open?id=<id>, uc?id=<id>, or the bare id.
export function driveId(link: string): string | null {
  const s = link.trim();
  if (!s) return null;
  const m = s.match(/\/d\/([\w-]{20,})/) || s.match(/[?&]id=([\w-]{20,})/);
  if (m) return m[1];
  return /^[\w-]{20,}$/.test(s) ? s : null;
}

export function isConfigured() {
  return Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && process.env.CERT_SHEET_ID);
}

let token: { value: string; exp: number } | null = null;

async function accessToken(): Promise<string> {
  if (token && token.exp > Date.now() + 60_000) return token.value;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
  const key = process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n");
  const now = Math.floor(Date.now() / 1000);
  const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({
    iss: email,
    scope: SCOPES,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(key).toString("base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${signature}` }),
  });
  if (!res.ok) throw new Error(`google_token_${res.status}`);
  const json = (await res.json()) as { access_token: string; expires_in: number };
  token = { value: json.access_token, exp: Date.now() + json.expires_in * 1000 };
  return token.value;
}

// The sheet is cached briefly so a burst of lookups does not hit the Google API each time.
let cache: { rows: Certificate[]; at: number } | null = null;
const CACHE_MS = 60_000;

async function loadRows(): Promise<Certificate[]> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.rows;
  const range = encodeURIComponent(process.env.CERT_SHEET_RANGE || "Certificates!A:H");
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${process.env.CERT_SHEET_ID}/values/${range}`, {
    headers: { authorization: `Bearer ${await accessToken()}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`google_sheet_${res.status}`);
  const { values = [] } = (await res.json()) as { values?: string[][] };
  const rows = values
    .slice(1)
    .filter((r) => r[0]?.trim())
    .map((r) => ({
      code: normalizeCode(r[0] || ""),
      name: (r[1] || "").trim(),
      program: (r[2] || "").trim(),
      level: (r[3] || "").trim(),
      issued: (r[4] || "").trim(),
      issuer: (r[5] || "").trim(),
      status: (r[6] || "").trim(),
      imageId: driveId(r[7] || ""),
    }));
  cache = { rows, at: Date.now() };
  return rows;
}

// Demo record so the page can be tried before Google is connected (only when the env is not set).
const DEMO: Certificate = {
  code: "WISE-DEMO-0001",
  name: "Nguyễn Văn A",
  program: "Lean Six Sigma Yellow Belt",
  level: "Yellow Belt",
  issued: "01/10/2026",
  issuer: "WISE Academy & Lean Six Sigma Institute (LSSI)",
  status: "Còn hiệu lực",
  imageId: "demo",
};

export async function findCertificate(code: string): Promise<Certificate | null> {
  const c = normalizeCode(code);
  if (!isConfigured()) return c === DEMO.code ? DEMO : null;
  return (await loadRows()).find((r) => r.code === c) || null;
}

// Streams a certificate image from Drive; only ids that belong to a certificate row are served.
export async function fetchImage(id: string): Promise<Response | null> {
  if (!isConfigured()) return null;
  const rows = await loadRows();
  if (!rows.some((r) => r.imageId === id)) return null;
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${id}?alt=media&supportsAllDrives=true`, {
    headers: { authorization: `Bearer ${await accessToken()}` },
  });
  return res.ok ? res : null;
}
