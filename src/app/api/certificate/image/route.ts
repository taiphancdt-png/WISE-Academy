import { fetchImage } from "@/lib/certificates";
import { rateLimited } from "@/lib/rate-limit";

// Serves a certificate image from Google Drive (only images listed in the certificate sheet).
export const runtime = "nodejs";

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id") || "";
  if (!/^[\w-]{20,80}$/.test(id)) return new Response("Bad request", { status: 400 });
  if (await rateLimited("cert-img", request, 60, 10 * 60 * 1000)) return new Response("Too many requests", { status: 429 });
  try {
    const res = await fetchImage(id);
    if (!res) return new Response("Not found", { status: 404 });
    return new Response(res.body, {
      headers: {
        "content-type": res.headers.get("content-type") || "image/jpeg",
        "cache-control": "private, max-age=600",
      },
    });
  } catch {
    return new Response("Unavailable", { status: 503 });
  }
}
