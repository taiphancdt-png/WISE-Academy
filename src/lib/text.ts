// Text helpers shared by server pages and client search.

// Lowercase and strip Vietnamese diacritics so "5s quan ly" matches "5S & Quản lý".
export function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

// Markdown to plain text (headings, list markers, images, quotes removed) for search and meta descriptions.
export function plainText(markdown: string) {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/^\s*(#{1,6}|>|-|\*|\d+\.)\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Many imported excerpts start by repeating the title (sometimes twice); drop those copies.
// Words are compared without punctuation so "[WISE ACADEMY X LDT]" still matches "WISE ACADEMY X LDT".
export function cleanExcerpt(title: string, excerpt: string) {
  const bare = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
  const titleWords = title.split(/\s+/).map(bare).filter(Boolean);
  let words = excerpt.trim().split(/\s+/);
  const startsWithTitle = () => {
    const head = words.map(bare).filter(Boolean).slice(0, titleWords.length);
    return titleWords.length > 0 && head.length === titleWords.length && head.every((w, i) => w === titleWords[i]);
  };
  while (startsWithTitle()) {
    let matched = 0;
    let i = 0;
    while (matched < titleWords.length && i < words.length) {
      if (bare(words[i])) matched++;
      i++;
    }
    words = words.slice(i);
  }
  return words.join(" ") || excerpt;
}

