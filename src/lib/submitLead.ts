// Client helper: posts a form submission to /api/lead, which emails it to WISE.
export type LeadForm = "home" | "contact" | "lssi";
export type LeadField = { label: string; value: string };

export async function submitLead(form: LeadForm, fields: LeadField[], honeypot = ""): Promise<boolean> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ form, fields, website: honeypot }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
