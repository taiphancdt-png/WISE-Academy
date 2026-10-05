// WISE Academy certificate lookup, deployed as a Google Apps Script web app from the "Certification WISE" sheet.
// It lets the website verify certificates without a Google Cloud service account.
//
// Setup (once): in the sheet, Extensions > Apps Script, paste this file, set SECRET below to any long random text,
// then Deploy > New deployment > Web app, Execute as: Me, Who has access: Anyone. Copy the web app URL.
// On the website (.env or the hosting env): CERT_APPS_SCRIPT_URL=<web app URL>, CERT_APPS_SCRIPT_KEY=<same SECRET>.
//
// It only answers one exact certificate code at a time (or one image of the certificate folder), never the whole list.
//
// It also delivers the website's contact forms (POST from /api/lead): each lead is e-mailed to LEAD_TO and added to
// the "Leads" tab of the same sheet. After pasting a new version: run testLead once (to allow sending e-mail), then
// Deploy > Manage deployments > edit (pencil) > Version: New version > Deploy, so the web app URL stays the same.

const SECRET = "CHANGE-ME";
const SHEET_ID = "17Tv50vZdq8aIvJFsM_ySKhefXIgj63UnaMqwT3n3vuY"; // the "Certification WISE" sheet
const SHEET_NAME = "Certificates";
const FOLDER_ID = "1oLhP0VKBGHYdQASJr4HP5oG75cRMlbQ2";
const LEAD_TO = "taipt@wisedemy.com.vn,thuynt@wisedemy.com.vn"; // who receives the website's form submissions
const LEADS_SHEET = "Leads";

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (SECRET === "CHANGE-ME" || p.key !== SECRET) return json({ ok: false, error: "forbidden" });
  if (p.image) return image(p.image);
  return lookup(p.code || "");
}

// Website form submissions: { key, action: "lead", form, subject, text, html, replyTo, rows: [{label, value}] }
function doPost(e) {
  let p = {};
  try {
    p = JSON.parse((e && e.postData && e.postData.contents) || "{}");
  } catch (err) {
    return json({ ok: false, error: "invalid_json" });
  }
  if (SECRET === "CHANGE-ME" || p.key !== SECRET) return json({ ok: false, error: "forbidden" });
  if (p.action !== "lead") return json({ ok: false, error: "unknown_action" });
  return sendLead(p);
}

function sendLead(p) {
  const cut = (v, n) => String(v || "").slice(0, n);
  const rows = Array.isArray(p.rows) ? p.rows.slice(0, 20) : [];
  const options = { htmlBody: cut(p.html, 20000), name: "WISE Academy Website" };
  if (p.replyTo) options.replyTo = cut(p.replyTo, 200);
  MailApp.sendEmail(LEAD_TO, cut(p.subject, 200).replace(/[\r\n]+/g, " "), cut(p.text, 20000), options);
  // keep a copy in the sheet so no lead is lost even if a mail is filtered
  const book = SpreadsheetApp.openById(SHEET_ID);
  const sheet = book.getSheetByName(LEADS_SHEET) || book.insertSheet(LEADS_SHEET);
  if (sheet.getLastRow() === 0) sheet.appendRow(["Thời gian", "Form", "Nội dung"]);
  sheet.appendRow([new Date(), cut(p.form, 200), rows.map((r) => cut(r.label, 80) + ": " + cut(r.value, 2000)).join("\n")]);
  return json({ ok: true });
}

// Run this one from the editor once after adding the form code: it asks permission to send e-mail and sends a test.
function testLead() {
  Logger.log(sendLead({ form: "Thử nghiệm", subject: "[Website] Thử gửi form", text: "Thử gửi từ Apps Script", html: "<p>Thử gửi từ Apps Script</p>", rows: [{ label: "Họ và tên", value: "Test" }] }).getContent());
}

// Run this one from the editor (select testLookup, then Run) to authorize the script and check a code.
function testLookup() {
  Logger.log(lookup("WISELSSGB-K2501-001-F").getContent());
}

const norm = (s) => String(s).trim().toUpperCase().replace(/\s+/g, "");
const json = (o) => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);

function lookup(raw) {
  const code = norm(raw);
  if (!code) return json({ ok: false, error: "invalid_code" });
  const book = SpreadsheetApp.openById(SHEET_ID);
  const sheet = book.getSheetByName(SHEET_NAME) || book.getSheets()[0];
  const values = sheet.getDataRange().getDisplayValues();
  const headers = values[0];
  const codeCol = headers.findIndex((h) => /certificate.?number|m[aã]\s*ch[uứ]ng\s*ch[iỉ]/i.test(h));
  const imageCol = headers.findIndex((h) => /certificate.?image|[aả]nh/i.test(h));
  const row = values.slice(1).find((r) => norm(r[codeCol >= 0 ? codeCol : 0]) === code);
  if (!row) return json({ ok: false, error: "not_found" });
  return json({ ok: true, headers, row, imageId: imageCol >= 0 ? findImage(row[imageCol], code) : findImage("", code) });
}

// Image file id: by file name in the folder, else a Drive link in the cell, else the file named after the code.
function findImage(ref, code) {
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const names = ref ? [ref] : [code + ".jpg", code + ".jpeg", code + ".png", code + ".webp"];
  for (const n of names) {
    const it = folder.getFilesByName(n.trim());
    if (it.hasNext()) return it.next().getId();
  }
  const m = String(ref).match(/\/d\/([\w-]{20,})/) || String(ref).match(/[?&]id=([\w-]{20,})/);
  return m ? m[1] : null;
}

function image(id) {
  try {
    const file = DriveApp.getFileById(id);
    let inFolder = false;
    const parents = file.getParents();
    while (parents.hasNext()) if (parents.next().getId() === FOLDER_ID) inFolder = true;
    if (!inFolder) return json({ ok: false, error: "not_found" });
    const blob = file.getBlob();
    return json({ ok: true, mime: blob.getContentType(), data: Utilities.base64Encode(blob.getBytes()) });
  } catch (err) {
    return json({ ok: false, error: "not_found" });
  }
}
