// Generates a bilingual (Vietnamese part, then English part) A4 PDF brochure for each LSSI program into public/brochures/.
// Run: node scripts/build-brochures.mjs   (requires Google Chrome installed)
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import { LSSI_PROGRAMS } from "../src/data/lssi-programs.ts";
import { BROCHURES, EXAM_NOTE } from "./brochure-content.mjs";

const ROOT = resolve(import.meta.dirname, "..");
const PUB = join(ROOT, "public");
const OUT = join(PUB, "brochures");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const asset = (p) => pathToFileURL(join(PUB, p)).href;

const T = {
  vi: {
    lang: "Tiếng Việt",
    eyebrow: "Chương trình chứng nhận Lean Six Sigma quốc tế",
    duration: "Thời lượng",
    includes: "Bao gồm",
    learn: "Bạn sẽ học được gì",
    audience: "Dành cho ai",
    content: "Nội dung chương trình",
    formats: "3 hình thức học",
    included: "Quyền lợi của học viên",
    partner: "WISE Academy · <strong>Đối tác ủy quyền của LSSI Global</strong> tại Việt Nam & châu Á",
    cssc: "Chứng nhận do <b>Lean Six Sigma Institute (LSSI)</b> và <b>The Council for Six Sigma Certification (CSSC)</b> đồng cấp, được công nhận toàn cầu. Giảng viên WISE Academy đồng hành và kèm cặp dự án thực tế tại doanh nghiệp.",
    ctaBig: "Liên hệ WISE Academy để có <em>chính sách chi phí ưu đãi nhất</em> cho thị trường Việt Nam và châu Á",
    ctaSub: "Ưu đãi cho cá nhân, nhóm và đào tạo in-house theo doanh nghiệp.",
    special: "<b>Đặc biệt:</b> Bạn đã có chứng nhận một cấp độ và muốn học lên cấp cao hơn? Liên hệ WISE Academy để được tư vấn lộ trình nâng cấp phù hợp.",
    contactTitle: "Liên hệ tư vấn & đăng ký",
    company: "CÔNG TY TNHH TƯ VẤN & ĐÀO TẠO WISE ACADEMY",
    formatsList: [
      ["Self-paced", "Tự học trực tuyến, chủ động thời gian."],
      ["Face to face", "Học trực tiếp tại lớp hoặc in-house tại doanh nghiệp."],
      ["Virtual live", "Lớp trực tuyến theo lịch cùng giảng viên."],
    ],
    formatsNote: "Mọi hình thức đều có cùng nội dung và cùng chứng nhận quốc tế khi hoàn thành.",
    includedList: [
      "Tài liệu khóa học đầy đủ",
      "Case study và ví dụ thực tế",
      "Bài tập thực hành và dự án",
      "Kèm cặp dự án để đạt chứng nhận",
      "2 lượt thi chứng nhận cho mỗi cấp độ",
      "Chứng nhận quốc tế LSSI & CSSC, giá trị trọn đời",
      "Truy cập không giới hạn nền tảng học trực tuyến",
    ],
  },
  en: {
    lang: "English",
    eyebrow: "International Lean Six Sigma certification program",
    duration: "Duration",
    includes: "Includes",
    learn: "What you will learn",
    audience: "Who is it for",
    content: "Course content",
    formats: "3 learning formats",
    included: "What’s included",
    partner: "WISE Academy · <strong>Authorized Partner of LSSI Global</strong> in Vietnam & Asia",
    cssc: "Certification jointly awarded by <b>Lean Six Sigma Institute (LSSI)</b> and <b>The Council for Six Sigma Certification (CSSC)</b>, recognised worldwide. WISE Academy trainers support and coach real projects in your organisation.",
    ctaBig: "Contact WISE Academy for <em>the most favourable pricing</em> in Vietnam and Asia",
    ctaSub: "Special rates for individuals, groups and in-house corporate training.",
    special: "<b>Already certified?</b> If you hold a certification at one level and want to move up, contact WISE Academy for an upgrade path that fits you.",
    contactTitle: "Contact & enrolment",
    company: "WISE ACADEMY CONSULTING & TRAINING CO., LTD",
    formatsList: [
      ["Self-paced", "Online modules — learn at your own pace."],
      ["Face to face", "Classroom or in-house training at your company."],
      ["Virtual live", "Scheduled live online classes with a trainer."],
    ],
    formatsNote: "All formats share identical content and lead to the same international certification.",
    includedList: [
      "Comprehensive course materials",
      "Real-world case studies and examples",
      "Hands-on exercises and projects",
      "Project coaching to achieve certification",
      "Two exam attempts per level",
      "International LSSI & CSSC certification, valid for life",
      "Unlimited access to the online training platform",
    ],
  },
};

const DURATION_EN = {
  "corporate-management-masters": "Master’s program · degree by UCAM",
  "master-black-belt-bundle": "160 h instructor-led · 80 h self-paced",
  "black-belt-bundle": "120 h instructor-led · 60 h self-paced",
  "green-belt-bundle": "80 h instructor-led · 40 h self-paced",
  "yellow-belt-bundle": "40 h instructor-led · 20 h self-paced",
  "lean-management": "8 hours",
};
const INCLUDES_EN = { "Thạc sĩ Quản trị doanh nghiệp": "Master’s in Corporate Management" };

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
// [en, vi] pair or plain string → text in the requested language.
const tr = (v, l) => (Array.isArray(v) ? (l === "en" ? v[0] : v[1]) : v);

const levelCard = (lv, l) => `<div class="level"><h3>${esc(tr(lv.name, l))}</h3>${lv.groups
  .map((g) => `${g.h ? `<h4>${esc(tr(g.h, l))}</h4>` : ""}<ul>${g.items.map((i) => `<li>${esc(tr(i, l))}</li>`).join("")}</ul>`)
  .join("")}</div>`;

function part(p, b, l) {
  const t = T[l];
  const title = p.title;
  const duration = l === "en" ? DURATION_EN[p.id] : (b.duration?.vi ?? p.duration);
  const includes = p.includes.map((i) => (l === "en" ? INCLUDES_EN[i] ?? i : i));
  return `
<section class="cover">
  <div class="top">
    <img src="${asset("images/brand/logo.png")}" alt="WISE Academy">
    <span class="lang">${t.lang}</span>
    <img src="${asset("images/brand/lssi-logo.png")}" alt="LSSI">
  </div>
  <div class="hero" style="border-top-color:${p.color}"><img src="${asset(p.image.replace(/^\//, ""))}" alt=""></div>
  <div class="eyebrow">${b.eyebrow?.[l] ?? t.eyebrow}</div>
  <h1>${esc(title)}</h1>
  <p class="subtitle">${esc(b.subtitle[l])}</p>
  <p class="intro">${esc(b.intro[l])}</p>
  <div class="facts">
    <div class="fact"><b>${t.duration}</b>${esc(duration)}</div>
    <div class="fact wide"><b>${t.includes}</b><div class="chips">${includes.map((i) => `<span class="chip">${esc(i)}</span>`).join("")}</div></div>
  </div>
  <div class="band"><span>${t.partner}</span><span>wisedemy.com.vn</span></div>
</section>
<section class="body">
  <div class="cols">
    <div><h2>${esc(b.learnTitle?.[l] ?? t.learn)}</h2><ul class="check">${b.learn[l].map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
    <div><h2>${t.audience}</h2><ul class="check">${b.audience[l].map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      ${b.exam === null ? "" : `<p class="exam">${esc(EXAM_NOTE[l])}</p>`}</div>
  </div>
  <h2>${esc(b.contentTitle?.[l] ?? t.content)}</h2>
  <div class="levels">${b.levels.map((lv) => levelCard(lv, l)).join("")}</div>
  <div class="keep">
    <h2>${t.formats}</h2>
    <div class="formats">${t.formatsList.map(([n, d]) => `<div class="format"><b>${n}</b><span>${d}</span></div>`).join("")}</div>
    <p class="note">${t.formatsNote}</p>
  </div>
  <div class="keep">
    <h2>${t.included}</h2>
    <ul class="check two">${t.includedList.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
    <div class="partner"><img src="${asset("images/lssi/cssc.webp")}" alt="CSSC"><p>${t.cssc}</p></div>
  </div>
  <div class="keep">
    <div class="cta"><div class="big">${t.ctaBig}</div><p>${t.ctaSub}</p><p class="special">${t.special}</p></div>
    <div class="contact">
      <img src="${asset("images/brand/logo.png")}" alt="WISE Academy">
      <div>
        <div class="ct">${t.contactTitle}</div>
        <div class="co">${t.company}</div>
        <div><b>Hotline / Zalo:</b> 0989 002 121 &nbsp;·&nbsp; <b>Email:</b> contact@wisedemy.com.vn &nbsp;·&nbsp; <b>Web:</b> wisedemy.com.vn</div>
      </div>
    </div>
  </div>
</section>`;
}

const html = (p) => {
  const b = BROCHURES[p.id];
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
@page { size: A4; margin: 13mm 15mm }
* { box-sizing: border-box; margin: 0; padding: 0 }
body { font-family: "Be Vietnam Pro", Arial, sans-serif; color: #102A43; font-size: 9.5pt; line-height: 1.5; -webkit-print-color-adjust: exact; print-color-adjust: exact }
.cover { height: 270mm; position: relative; break-after: page }
.cover + .body { break-before: page }
.body + .cover { break-before: page }
.top { display: flex; justify-content: space-between; align-items: center }
.top img { height: 12mm }
.lang { font-size: 8pt; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; color: #002F5B; border: .3mm solid #002F5B; border-radius: 10mm; padding: 1mm 4mm }
.hero { margin-top: 7mm; border-radius: 5mm; overflow: hidden; height: 82mm; border-top: 3mm solid #002F5B }
.hero img { width: 100%; height: 100%; object-fit: cover }
.eyebrow { margin-top: 8mm; font-size: 8pt; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: #C9500E }
h1 { margin-top: 2.5mm; font-size: 22pt; line-height: 1.2; font-weight: 700; color: #002F5B }
.subtitle { margin-top: 3mm; font-size: 12pt; font-weight: 600; color: #C9500E; line-height: 1.35 }
.intro { margin-top: 3mm; font-size: 10.5pt; color: #486581 }
.facts { display: flex; gap: 4mm; margin-top: 6mm }
.fact { flex: 1; background: #F1F4F8; border-radius: 3mm; padding: 3.5mm 4.5mm; font-size: 10pt }
.fact.wide { flex: 1.6 }
.fact b { display: block; font-size: 7.5pt; text-transform: uppercase; letter-spacing: .12em; color: #002F5B; margin-bottom: 1mm }
.chips { display: flex; flex-wrap: wrap; gap: 1.5mm; margin-top: 1mm }
.chip { font-size: 8pt; background: #fff; border: .3mm solid #D9E2EC; border-radius: 10mm; padding: .5mm 2.6mm }
.band { position: absolute; left: 0; right: 0; bottom: 0; background: #002F5B; color: #fff; padding: 5mm 7mm; border-radius: 4mm; display: flex; justify-content: space-between; align-items: center; font-size: 9pt }
.band strong { color: #FF7A30 }
h2 { font-size: 13pt; color: #002F5B; font-weight: 700; margin: 6mm 0 3mm; display: flex; align-items: center; gap: 2.5mm; break-after: avoid }
h2::before { content: ""; width: 1.8mm; height: 5.5mm; background: #F76011; border-radius: 1mm; flex: none }
.cols { display: grid; grid-template-columns: 1fr 1fr; gap: 8mm }
.cols h2 { margin-top: 0 }
ul.check { list-style: none }
ul.check li { padding: 1.3mm 0 1.3mm 6mm; position: relative; border-bottom: .2mm solid #E4E9F0 }
ul.check li::before { content: "✓"; position: absolute; left: 0; color: #F76011; font-weight: 700 }
ul.two { columns: 2; column-gap: 8mm }
ul.two li { break-inside: avoid }
.exam { margin-top: 4mm; font-size: 8.5pt; color: #486581; background: #F1F4F8; border-radius: 3mm; padding: 3mm 4mm }
.levels { columns: 2; column-gap: 5mm }
.level { break-inside: avoid; border: .3mm solid #D9E2EC; border-left: 1.2mm solid #002F5B; border-radius: 2.5mm; padding: 3mm 4mm; margin-bottom: 4mm }
.level h3 { font-size: 10pt; color: #002F5B; margin-bottom: 1mm }
.level h4 { font-size: 7.5pt; text-transform: uppercase; letter-spacing: .08em; color: #C9500E; margin-top: 1.8mm }
.level ul { list-style: none; font-size: 8.5pt; color: #334E68 }
.level li { padding-left: 3.5mm; position: relative }
.level li::before { content: "•"; position: absolute; left: 0; color: #F76011 }
.keep { break-inside: avoid }
.formats { display: flex; gap: 4mm }
.format { flex: 1; border: .3mm solid #D9E2EC; border-radius: 3mm; padding: 3.5mm; border-top: 1.2mm solid #F76011 }
.format b { display: block; color: #002F5B; font-size: 10.5pt }
.format span { font-size: 8.5pt; color: #486581 }
.note { margin-top: 2mm; font-size: 8.5pt; color: #486581; font-style: italic }
.partner { display: flex; align-items: center; gap: 5mm; background: #F1F4F8; border-radius: 3mm; padding: 3.5mm 5mm; margin-top: 5mm }
.partner img { height: 13mm }
.partner p { font-size: 8.5pt; color: #486581 }
.cta { margin-top: 6mm; background: #FFF5EC; border: .3mm solid #F7601140; border-radius: 4mm; padding: 5mm 6mm }
.cta .big { font-size: 12.5pt; font-weight: 700; color: #002F5B; line-height: 1.35 }
.cta .big em { font-style: normal; color: #C9500E }
.cta p { margin-top: 2mm; font-size: 9pt }
.cta .special b { color: #C9500E }
.contact { margin-top: 5mm; display: flex; gap: 6mm; align-items: center; background: #002F5B; color: #fff; border-radius: 4mm; padding: 5mm 6mm; font-size: 9pt }
.contact img { height: 12mm; background: #fff; border-radius: 2mm; padding: 1.5mm 2.5mm }
.contact .ct { font-size: 8pt; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; color: #FF7A30 }
.contact .co { font-weight: 700; font-size: 10pt; margin: .5mm 0 1mm }
.contact b { color: #FFB27F }
</style></head><body>${part(p, b, "vi")}${part(p, b, "en")}</body></html>`;
};

mkdirSync(OUT, { recursive: true });
const tmp = join(tmpdir(), "wise-brochures");
mkdirSync(tmp, { recursive: true });
for (const p of LSSI_PROGRAMS) {
  const src = join(tmp, `${p.id}.html`);
  writeFileSync(src, html(p));
  const pdf = join(OUT, `${p.id}.pdf`);
  execFileSync(CHROME, [
    "--headless=new", "--disable-gpu", "--allow-file-access-from-files", "--no-pdf-header-footer",
    "--virtual-time-budget=8000", `--print-to-pdf=${pdf}`, pathToFileURL(src).href,
  ], { stdio: "ignore" });
  console.log("✓", pdf.replace(ROOT + "/", ""));
}
rmSync(tmp, { recursive: true, force: true });
