// Per-IP request limits shared by every server instance.
// On Netlify the counters live in Netlify Blobs (one key per IP), so a burst spread over
// several function instances is still counted together; locally they live in memory.
// Counting is approximate (read, then write), enough to stop guessing certificate codes or spamming forms.

type Store = {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<unknown>;
};

const ON_NETLIFY = Boolean(process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT);
const mem = new Map<string, number>();

let storePromise: Promise<Store | null> | null = null;
function blobStore(): Promise<Store | null> {
  if (!ON_NETLIFY) return Promise.resolve(null);
  storePromise ??= import("@netlify/blobs")
    .then(({ getStore }) => getStore({ name: "rate-limit", consistency: "strong" }) as unknown as Store)
    .catch(() => null);
  return storePromise;
}

// The visitor's real address: Netlify's own header cannot be set by the client (X-Forwarded-For can).
export function clientIp(request: Request) {
  const h = request.headers;
  return (
    h.get("x-nf-client-connection-ip") ||
    h.get("x-real-ip") ||
    h.get("x-forwarded-for")?.split(",").pop()?.trim() ||
    "unknown"
  ).slice(0, 64);
}

/** True when this IP has used up `max` requests of `bucket` in the current window. */
export async function rateLimited(bucket: string, request: Request, max: number, windowMs: number) {
  const ip = clientIp(request).replace(/[^\w.:-]/g, "_");
  const win = Math.floor(Date.now() / windowMs);
  // one key per bucket and IP, overwritten when the window moves on (storage stays bounded)
  const key = `${bucket}/${ip}`;
  const store = await blobStore();
  if (store) {
    try {
      const prev = JSON.parse((await store.get(key)) || "null") as { w: number; n: number } | null;
      const used = prev && prev.w === win ? prev.n + 1 : 1;
      await store.set(key, JSON.stringify({ w: win, n: used }));
      return used > max;
    } catch {
      // Blobs unavailable: fall back to this instance's memory rather than blocking everyone
    }
  }
  const memKey = `${key}/${win}`;
  const used = (mem.get(memKey) || 0) + 1;
  mem.set(memKey, used);
  if (mem.size > 5000) mem.clear();
  return used > max;
}
