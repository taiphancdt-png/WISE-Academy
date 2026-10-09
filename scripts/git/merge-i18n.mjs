#!/usr/bin/env node
// Git merge driver for src/i18n/<lang>.json (registered by scripts/setup-git.sh, used via .gitattributes).
// Two machines adding translations at the same time used to collide at the end of the file, and resolving the
// conflict by hand could drop one side's entries. This merges the dictionaries key by key instead:
//   - a key added or changed on only one side is kept;
//   - a key deleted on one side and untouched on the other is deleted;
//   - a key changed differently on both sides keeps the local version and is reported, so nothing is lost silently.
// Usage (from git): merge-i18n.mjs %O %A %B   base, ours (result is written here), theirs
import { readFileSync, writeFileSync } from "node:fs";

const [basePath, oursPath, theirsPath] = process.argv.slice(2);
const read = (p) => {
  try {
    const text = readFileSync(p, "utf8").trim();
    return text ? JSON.parse(text) : {};
  } catch {
    return null;
  }
};
const base = read(basePath) ?? {};
const ours = read(oursPath);
const theirs = read(theirsPath);
// not valid JSON on one side: let git report a normal conflict
if (!ours || !theirs) process.exit(1);

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const out = {};
const clashes = [];
for (const key of new Set([...Object.keys(base), ...Object.keys(ours), ...Object.keys(theirs)])) {
  const b = base[key], o = ours[key], t = theirs[key];
  if (same(o, t)) {
    if (o !== undefined) out[key] = o;
  } else if (same(o, b)) {
    if (t !== undefined) out[key] = t; // only theirs changed (or deleted)
  } else if (same(t, b)) {
    if (o !== undefined) out[key] = o; // only ours changed (or deleted)
  } else {
    // both sides changed this entry differently: keep ours, fall back to theirs if ours deleted it
    out[key] = o !== undefined ? o : t;
    clashes.push(key);
  }
}

// sorted keys spread new entries through the file, so plain text merges rarely meet either
const sorted = Object.fromEntries(Object.keys(out).sort().map((k) => [k, out[k]]));
writeFileSync(oursPath, JSON.stringify(sorted, null, 1) + "\n");
if (clashes.length) {
  console.error(`merge-i18n: ${clashes.length} entr${clashes.length === 1 ? "y" : "ies"} changed on both sides, kept the local text: ${clashes.slice(0, 10).join(", ")}${clashes.length > 10 ? " ..." : ""}`);
}
process.exit(0);
