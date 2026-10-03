"use client";

import React, { useState } from "react";
import { ChevronDown, Download } from "@/components/icons";
import { ButtonLink } from "@/components/ui";

// Collapsible detail list for a consulting service: "Xem chi tiết" opens the scope list and the consult button.
export default function ServiceDetails({
  id,
  listTitle,
  items,
  brochure,
}: {
  id: string;
  listTitle: string;
  items: string[];
  brochure: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = `service-${id}-details`;

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="inline-flex items-center gap-2 rounded-full bg-[#F76011] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#C9500E]"
        >
          {open ? "Thu gọn" : "Xem chi tiết"}
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </button>
        <a
          href={brochure}
          download={`WISE-Academy-dich-vu-${id}-brochure.pdf`}
          className="inline-flex items-center gap-2 rounded-full border-2 border-[#002F5B] px-6 py-2 text-sm font-semibold text-[#002F5B] transition-colors hover:bg-[#002F5B] hover:text-white"
        >
          <Download className="w-4 h-4" /> Tải brochure
        </a>
      </div>

      {/* expanding panel (grid-rows trick animates the height) */}
      <div
        id={panelId}
        className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <h3 className="mt-6 text-xs font-bold uppercase tracking-wider text-[#002F5B]">{listTitle}</h3>
          <ul className="mt-2">
            {items.map((d) => (
              <li key={d} className="plus-item !font-medium">
                {d}
              </li>
            ))}
          </ul>
          <div className="mt-5 mb-1">
            <ButtonLink href="/lien-he">Tư vấn dịch vụ {id}</ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
