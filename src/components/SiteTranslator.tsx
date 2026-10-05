"use client";

import { useEffect } from "react";
import { readLang } from "@/components/LanguageSwitcher";

// Shows the site in English or Chinese with translations written by Claude (see src/lib/translate.ts).
// Content stays authored in Vietnamese. Whole paragraphs are translated at once (with their inline formatting),
// so sentences read naturally; text marked translate="no" / .notranslate (names, the language menu) is left alone.
// Content rendered later (accordions, filters, lookups) is translated as it appears.

// <option> labels are translated too: every option carries a value attribute, so what a form submits stays the same
const SKIP = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "SVG", "CODE", "PRE", "TEXTAREA", "INPUT", "IFRAME", "CANVAS", "VIDEO"]);
const INLINE = new Set(["STRONG", "EM", "B", "I", "U", "S", "BR", "SPAN", "A", "SMALL", "SUP", "SUB", "MARK", "ABBR", "CITE", "Q", "TIME", "WBR"]);
const ATTRS = ["placeholder", "title", "alt", "aria-label"];
const LETTERS = /[A-Za-zÀ-ỹĐđ]/;
const VIETNAMESE = /[À-ỹĐđ]|\b(và|của|cho|các|những|với|trong|được|là|không|người|này)\b/i;

const norm = (s: string) => s.replace(/<!-- -->/g, "").replace(/[\u00a0\s]+/g, " ").trim();
const excluded = (el: Element | null) => !el || !!el.closest('[translate="no"], .notranslate, [contenteditable="true"]');

// a paragraph-like element holding only text and inline formatting (no buttons, inputs, lists or blocks)
function isLeafBlock(el: Element): boolean {
  for (const c of Array.from(el.children)) {
    // inline styles here are usually measured positions that change with the screen, so keep those parts separate
    if (!INLINE.has(c.tagName) || c.hasAttribute("style") || c.matches('[translate="no"], .notranslate') || !isLeafBlock(c)) return false;
  }
  return true;
}

type Unit =
  | { kind: "text"; node: Text; src: string }
  | { kind: "html"; el: Element; src: string }
  | { kind: "attr"; el: Element; name: string; src: string };

const done = new WeakMap<Node, string>(); // node → the translated value we put there
const doneAttr = new WeakMap<Element, Record<string, string>>();

function collect(root: Node, units: Unit[]) {
  if (root.nodeType === Node.TEXT_NODE) {
    const t = root as Text;
    if (!excluded(t.parentElement) && !SKIP.has(t.parentElement!.tagName)) pushText(t, units);
    return;
  }
  if (root.nodeType !== Node.ELEMENT_NODE) return;
  const el = root as Element;
  if (SKIP.has(el.tagName) || excluded(el)) return;
  for (const a of ATTRS) {
    const v = el.getAttribute(a);
    if (v && LETTERS.test(v) && doneAttr.get(el)?.[a] !== v) units.push({ kind: "attr", el, name: a, src: v });
  }
  // a heading or paragraph made of several inline pieces is translated as one, so the sentence stays whole
  // (a lone link or span is not: its text is translated in place, so links keep working as links)
  const ownText = Array.from(el.childNodes).some((n) => n.nodeType === Node.TEXT_NODE && LETTERS.test(n.nodeValue || ""));
  if ((el.children.length > 1 || (el.children.length === 1 && ownText)) && !INLINE.has(el.tagName) && isLeafBlock(el)) {
    const html = el.innerHTML;
    if (done.get(el) !== html && LETTERS.test(el.textContent || "")) units.push({ kind: "html", el, src: html });
    return;
  }
  for (const c of Array.from(el.childNodes)) collect(c, units);
}

function pushText(t: Text, units: Unit[]) {
  const v = t.nodeValue || "";
  if (!LETTERS.test(v) || done.get(t) === v) return;
  units.push({ kind: "text", node: t, src: v });
}

const CACHE_KEY = (lang: string) => `wise-i18n-${lang}`;
function loadCache(lang: string): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY(lang)) || "{}");
  } catch {
    return {};
  }
}
function saveCache(lang: string, cache: Record<string, string>) {
  try {
    localStorage.setItem(CACHE_KEY(lang), JSON.stringify(cache));
  } catch {
    /* storage full or blocked: translations are simply fetched again */
  }
}

function apply(u: Unit, out: string) {
  if (u.kind === "text") {
    if (!u.node.isConnected || u.node.nodeValue !== u.src) return;
    const lead = u.src.match(/^\s*/)![0];
    const trail = u.src.match(/\s*$/)![0];
    const v = lead + out + trail;
    done.set(u.node, v);
    u.node.nodeValue = v;
  } else if (u.kind === "html") {
    if (!u.el.isConnected || u.el.innerHTML !== u.src) return;
    u.el.innerHTML = out;
    done.set(u.el, u.el.innerHTML);
  } else {
    if (u.el.getAttribute(u.name) !== u.src) return;
    u.el.setAttribute(u.name, out);
    doneAttr.set(u.el, { ...doneAttr.get(u.el), [u.name]: out });
  }
}

export default function SiteTranslator() {
  useEffect(() => {
    const lang = readLang();
    if (lang === "vi") {
      document.documentElement.classList.remove("i18n-loading");
      return;
    }
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    const cache = loadCache(lang);
    // translated strings we already put on the page (names keep their Vietnamese letters, so these must not be resent)
    const outputs = new Set(Object.values(cache));
    let pending: Unit[] = [];
    let timer = 0;
    let titleSrc = "";
    let titleOut = "";

    const run = async () => {
      timer = 0;
      const units = pending;
      pending = [];
      // the page title is translated like any other text
      if (document.title && document.title !== titleSrc && document.title !== titleOut && !outputs.has(document.title) && VIETNAMESE.test(document.title))
        titleSrc = document.title;
      const need = new Set<string>();
      for (const u of units) {
        const key = norm(u.src);
        if (cache[key] !== undefined) apply(u, cache[key]);
        else if (VIETNAMESE.test(key) && !outputs.has(key)) need.add(key);
      }
      if (titleSrc && cache[norm(titleSrc)] === undefined) need.add(norm(titleSrc));
      const list = [...need];
      for (let i = 0; i < list.length; i += 60) {
        const batch = list.slice(i, i + 60);
        try {
          const res = await fetch("/api/translate", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ lang, texts: batch }),
          });
          if (!res.ok) continue;
          const { translations } = (await res.json()) as { translations: Record<string, string> };
          Object.assign(cache, translations);
          Object.values(translations).forEach((t) => outputs.add(t));
          saveCache(lang, cache);
          for (const u of units) {
            const t = translations[norm(u.src)];
            if (t !== undefined) apply(u, t);
          }
        } catch {
          /* offline or server busy: the Vietnamese text stays */
        }
      }
      if (titleSrc && cache[norm(titleSrc)]) document.title = titleOut = cache[norm(titleSrc)];
      document.documentElement.classList.remove("i18n-loading");
    };

    const queue = (root: Node) => {
      collect(root, pending);
      if (!timer) timer = window.setTimeout(run, 60);
    };

    queue(document.body);
    const mo = new MutationObserver((records) => {
      for (const r of records) {
        if (r.type === "characterData") {
          const t = r.target as Text;
          if (done.get(t) !== t.nodeValue) queue(t);
        } else if (r.type === "attributes") {
          queue(r.target);
        } else {
          r.addedNodes.forEach((n) => {
            const host = n.parentElement;
            // our own innerHTML swaps re-add nodes; skip those
            if (host && done.get(host) === host.innerHTML) return;
            queue(n);
          });
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    return () => {
      mo.disconnect();
      clearTimeout(timer);
    };
  }, []);
  return null;
}
