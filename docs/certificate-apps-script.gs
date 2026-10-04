// WISE Academy certificate lookup, deployed as a Google Apps Script web app from the "Certification WISE" sheet.
// It lets the website verify certificates without a Google Cloud service account.
//
// Setup (once): in the sheet, Extensions > Apps Script, paste this file, set SECRET below to any long random text,
// then Deploy > New deployment > Web app, Execute as: Me, Who has access: Anyone. Copy the web app URL.
// On the website (.env or the hosting env): CERT_APPS_SCRIPT_URL=<web app URL>, CERT_APPS_SCRIPT_KEY=<same SECRET>.
//
// It only answers one exact certificate code at a time (or one image of the certificate folder), never the whole list.

const SECRET = "CHANGE-ME";
const SHEET_NAME = "Certificates";
const FOLDER_ID = "1oLhP0VKBGHYdQASJr4HP5oG75cRMlbQ2";

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (SECRET === "CHANGE-ME" || p.key !== SECRET) return json({ ok: false, error: "forbidden" });
  if (p.image) return image(p.image);
  return lookup(p.code || "");
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
  const values = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME).getDataRange().getDisplayValues();
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
