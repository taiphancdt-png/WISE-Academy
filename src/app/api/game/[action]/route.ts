// API of the "Săn Lãng Phí" game (public/game): one room per 6-digit PIN, state kept in Netlify Blobs.
// Locally (npm run dev) the rooms live in memory and disappear when the server restarts.
import { handle } from "@/lib/san-lang-phi.mjs";

type Store = {
  get(key: string, opts?: { type?: "json" }): Promise<unknown>;
  set(key: string, value: string): Promise<unknown>;
  setJSON(key: string, value: unknown): Promise<unknown>;
  list(opts?: { prefix?: string }): Promise<{ blobs: { key: string }[] }>;
  delete(key: string): Promise<unknown>;
};

const ON_NETLIFY = Boolean(process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT);

const mem = new Map<string, string>();
const memoryStore: Store = {
  async get(key, opts) {
    if (!mem.has(key)) return null;
    const v = mem.get(key)!;
    return opts?.type === "json" ? JSON.parse(v) : v;
  },
  async set(key, v) { mem.set(key, String(v)); },
  async setJSON(key, v) { mem.set(key, JSON.stringify(v)); },
  async list({ prefix = "" } = {}) { return { blobs: [...mem.keys()].filter((k) => k.startsWith(prefix)).map((key) => ({ key })) }; },
  async delete(key) { mem.delete(key); },
};

async function store(): Promise<Store> {
  if (!ON_NETLIFY) return memoryStore;
  const { getStore } = await import("@netlify/blobs");
  return getStore({ name: "san-lang-phi", consistency: "strong" }) as unknown as Store;
}

export const dynamic = "force-dynamic";

async function run(req: Request) {
  return handle(req, await store());
}

export { run as GET, run as POST };
