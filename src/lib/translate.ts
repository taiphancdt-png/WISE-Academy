import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { PROPER_NAMES } from "@/data/proper-names";
import seedEn from "@/i18n/en.json";
import seedZh from "@/i18n/zh.json";

// Site translation (Vietnamese → English / Simplified Chinese) written by Claude, not machine-translated word by word.
// Every text is translated once and stored:
//   - src/i18n/<lang>.json   bundled with the site; filled automatically while running locally (`npm run dev`), so new
//                            translations can be reviewed, edited by hand and committed
//   - Netlify Blobs "i18n"   on the live site, for text added after the last deploy
//
// Environment: ANTHROPIC_API_KEY (required to translate new text), CLAUDE_TRANSLATE_MODEL (optional),
// TRANSLATE_DAILY_LIMIT (optional, new texts per day, default 3000).

export type Lang = "en" | "zh";
type Entry = { s: string; t: string };
type Dict = Record<string, Entry>;

const SEED: Record<Lang, Dict> = { en: seedEn as Dict, zh: seedZh as Dict };
const memory: Record<Lang, Map<string, string>> = { en: new Map(), zh: new Map() };

// React's text separators (<!-- -->) differ between server and client renders, so they are left out of the key
export const normalize = (s: string) => s.replace(/<!-- -->/g, "").replace(/[\u00a0\s]+/g, " ").trim();
export const keyOf = (text: string) => createHash("sha1").update(normalize(text)).digest("hex").slice(0, 16);

const MODEL = () => process.env.CLAUDE_TRANSLATE_MODEL || "claude-sonnet-5-5";
const DEV = process.env.NODE_ENV === "development";
const ON_NETLIFY = Boolean(process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT);

async function blobStore() {
  if (!ON_NETLIFY) return null;
  try {
    const { getStore } = await import("@netlify/blobs");
    return getStore("i18n");
  } catch {
    return null;
  }
}

export async function lookup(lang: Lang, keys: string[]): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  const missing: string[] = [];
  for (const k of keys) {
    const hit = memory[lang].get(k) ?? SEED[lang][k]?.t;
    if (hit !== undefined) out[k] = hit;
    else missing.push(k);
  }
  const store = missing.length ? await blobStore() : null;
  if (store) {
    await Promise.all(
      missing.map(async (k) => {
        const v = await store.get(`${lang}/${k}`).catch(() => null);
        if (typeof v === "string") {
          out[k] = v;
          memory[lang].set(k, v);
        }
      }),
    );
  }
  return out;
}

// Locally the new translations are appended to src/i18n/<lang>.json; on Netlify they go to Blobs.
// Writes are chained one after another; a failed write must not block the ones after it.
let writing: Promise<void> = Promise.resolve();
async function save(lang: Lang, entries: { key: string; source: string; text: string }[]) {
  entries.forEach((e) => memory[lang].set(e.key, e.text));
  if (DEV) {
    writing = writing.catch(() => undefined).then(async () => {
      const file = path.join(process.cwd(), "src", "i18n", `${lang}.json`);
      const dict: Dict = JSON.parse(await fs.readFile(file, "utf8").catch(() => "{}"));
      entries.forEach((e) => (dict[e.key] = { s: normalize(e.source), t: e.text }));
      // keys kept sorted, so entries added on two machines land in different places of the file (fewer merge clashes)
      const sorted = Object.fromEntries(Object.keys(dict).sort().map((k) => [k, dict[k]]));
      await fs.writeFile(file, JSON.stringify(sorted, null, 1) + "\n");
    });
    return writing;
  }
  const store = await blobStore();
  if (store) await Promise.all(entries.map((e) => store.set(`${lang}/${e.key}`, e.text).catch(() => undefined)));
}

// daily budget so the public endpoint cannot run up the Claude bill
let budget = { day: "", used: 0 };
function takeBudget(n: number) {
  const day = new Date().toISOString().slice(0, 10);
  if (budget.day !== day) budget = { day, used: 0 };
  const limit = Number(process.env.TRANSLATE_DAILY_LIMIT || 3000);
  if (budget.used + n > limit) return false;
  budget.used += n;
  return true;
}

const LANG_NAME: Record<Lang, string> = { en: "English", zh: "Simplified Chinese (zh-CN, mainland usage)" };

function systemPrompt(lang: Lang) {
  const terms =
    lang === "zh"
      ? "Use standard mainland Chinese Lean terms: Lean = 精益, Lean Six Sigma = 精益六西格玛, Kaizen = 改善, Gemba = 现场, Value Stream Mapping = 价值流图 (VSM), Yellow/Green/Black Belt = 黄带/绿带/黑带, Standard Work = 标准作业, 5S = 5S, OEE = OEE, TPM = 全员生产维护 (TPM), SMED = 快速换模 (SMED), Kanban = 看板, Poka-Yoke = 防错 (Poka-Yoke), Hoshin Kanri = 方针管理 (Hoshin Kanri)."
      : "Use the standard English Lean / Six Sigma vocabulary used by practitioners: Kaizen, Gemba, Gemba walk, 5S, Value Stream Mapping (VSM), Standard Work, Yellow/Green/Black Belt, Master Black Belt, Hoshin Kanri, Poka-Yoke, OEE, TPM, SMED, Kanban, Just-in-Time, Jidoka, Heijunka, line balancing, takt time, DMAIC, root cause analysis, continuous improvement.";
  return [
    `You translate the website of WISE Academy, a Vietnamese consulting and training firm for manufacturers and businesses (Lean, Lean Six Sigma, productivity, operational excellence, leadership development). Translate Vietnamese website text into ${LANG_NAME[lang]}.`,
    "Write the way a professional business consultancy writes: natural, fluent, complete sentences with the full meaning of the original; never word-by-word. Keep headings short and punchy, keep the tone of calls to action.",
    terms,
    "Never translate or transliterate proper names of companies, organisations, brands or people, and never render Vietnamese names in Chinese characters. Write Vietnamese names of people, companies and places without Vietnamese diacritics, in both English and Chinese (for example: Phan Tấn Tài → Phan Tan Tai, Nguyễn Thị Thủy → Nguyen Thi Thuy, Tỷ Bách → Ty Bach, Đồng Nai → Dong Nai); keep foreign names as they are (WISE Academy, Pou Chen, Nestlé). Descriptive words around a name are translated (\"Công ty TNHH Sunjin Vina\" → \"Sunjin Vina Co., Ltd.\"); universities and public bodies take their official English / Chinese names.",
    `Proper names (keep them, written without Vietnamese diacritics): ${PROPER_NAMES.join("; ")}.`,
    "Keep numbers, dates, units, percentages, codes, URLs, e-mails and phone numbers unchanged (Vietnamese decimal commas may become points in English).",
    "Some items contain HTML: keep every tag and attribute exactly as it is and translate only the text between tags.",
    "If an item is already in the target language, or is only a name, code or number, return it unchanged.",
    "Input: a JSON array of strings. Output: only a JSON array of the translated strings, same length and order, no commentary.",
  ].join("\n\n");
}

async function claude(lang: Lang, texts: string[]): Promise<string[]> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL(),
      max_tokens: 16000,
      system: [{ type: "text", text: systemPrompt(lang), cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: JSON.stringify(texts) }],
    }),
  });
  if (!res.ok) throw new Error(`claude_${res.status}`);
  const json = (await res.json()) as { content: { type: string; text?: string }[] };
  const raw = json.content.map((c) => c.text || "").join("").trim();
  const arr = JSON.parse(raw.slice(raw.indexOf("["), raw.lastIndexOf("]") + 1)) as unknown;
  if (!Array.isArray(arr) || arr.length !== texts.length) throw new Error("claude_bad_shape");
  return arr.map((v, i) => (typeof v === "string" && v.trim() ? v : texts[i]));
}

// Vietnamese names are written without diacritics in English and Chinese (Phan Tấn Tài → Phan Tan Tai);
// a few foreign names keep their accents.
const KEEP_ACCENTS = new Set(["Nestlé", "Bühler", "TÜV", "Rölkens", "x̄", "ȳ"]);
export function plainNames(text: string) {
  return text
    .split(/(<[^>]+>)/)
    .map((part) =>
      part.startsWith("<")
        ? part
        : part.replace(/[^\s<>,.;:()（）、，。“”"'/]+/g, (w) =>
            KEEP_ACCENTS.has(w)
              ? w
              : w.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").normalize("NFC"),
          ),
    )
    .join("");
}

// same tags in the same order, so a translation cannot break the page markup
const tagsOf = (s: string) => (s.match(/<\/?[a-z][^>]*>/gi) || []).map((t) => t.replace(/\s+/g, " ")).join("");

// Without an API key (local runs), texts still waiting for a translation are listed in .i18n-pending/pending-<lang>.json.
async function notePending(lang: Lang, items: { key: string; text: string }[]) {
  if (!DEV || !items.length) return;
  writing = writing.catch(() => undefined).then(async () => {
    // kept outside src/ so writing it does not trigger a dev rebuild
    const file = path.join(process.cwd(), ".i18n-pending", `pending-${lang}.json`);
    await fs.mkdir(path.dirname(file), { recursive: true });
    const dict: Record<string, string> = JSON.parse(await fs.readFile(file, "utf8").catch(() => "{}"));
    items.forEach((i) => (dict[i.key] = normalize(i.text)));
    await fs.writeFile(file, JSON.stringify(dict, null, 1) + "\n");
  });
  await writing;
}

export async function translateMissing(lang: Lang, items: { key: string; text: string }[]) {
  if (!items.length) return {};
  if (!process.env.ANTHROPIC_API_KEY) {
    await notePending(lang, items);
    return {};
  }
  if (!takeBudget(items.length)) return {};
  const out: Record<string, string> = {};
  const saved: { key: string; source: string; text: string }[] = [];
  // batches of ~6000 characters keep each Claude call quick
  const batches: { key: string; text: string }[][] = [];
  let cur: { key: string; text: string }[] = [];
  let size = 0;
  for (const it of items) {
    if (cur.length && (size + it.text.length > 6000 || cur.length >= 40)) {
      batches.push(cur);
      cur = [];
      size = 0;
    }
    cur.push(it);
    size += it.text.length;
  }
  if (cur.length) batches.push(cur);
  await Promise.all(
    batches.map(async (b) => {
      try {
        const res = await claude(lang, b.map((x) => x.text));
        res.forEach((raw, i) => {
          const src = b[i].text;
          const t = plainNames(raw);
          if (tagsOf(t) !== tagsOf(src)) return;
          out[b[i].key] = t;
          saved.push({ key: b[i].key, source: src, text: t });
        });
      } catch (err) {
        console.error("translate batch failed", err);
      }
    }),
  );
  if (saved.length) await save(lang, saved);
  return out;
}
