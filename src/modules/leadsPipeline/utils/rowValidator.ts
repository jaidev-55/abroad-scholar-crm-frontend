import type { ImportedRow } from "./types";
import type { LeadCategory } from "../api/leads";
import { shouldSkipRow } from "./csvParser";

// ─── Valid API enums — must match backend exactly ─────────────────────────────
export const VALID_SOURCES = [
  "INSTAGRAM",
  "WEBSITE",
  "WALK_IN",
  "GOOGLE_ADS",
  "META_ADS",
  "REFERRAL",
] as const;

export const VALID_PRIORITIES = ["HOT", "WARM", "COLD"] as const;

// ─── Lead categories shown in the Add Lead form ───────────────────────────────
export const LEAD_CATEGORIES = [
  {
    value: "ACADEMIC" as LeadCategory,
    label: "Academic — IELTS / PTE Coaching",
  },
  {
    value: "ADMISSION" as LeadCategory,
    label: "Admission — University Application",
  },
] as const;

// ─── Source alias map ─────────────────────────────────────────────────────────
const SOURCE_ALIAS_MAP: Record<string, string> = {
  FACEBOOK: "META_ADS",
  FB: "META_ADS",
  "FACEBOOK ADS": "META_ADS",
  "META ADS": "META_ADS",
  GOOGLE: "GOOGLE_ADS",
  "GOOGLE ADS": "GOOGLE_ADS",
  "WALK IN": "WALK_IN",
  WALKIN: "WALK_IN",
  OTHER: "GOOGLE_SHEET",
  DIRECT: "GOOGLE_SHEET",
  // GOOGLE_SHEET and WHATSAPP are now valid API values — no remapping needed
};

export const validateRow = (
  raw: Record<string, string>,
  colMap: Record<string, string>,
  rowIndex: number,
  defaultLeadCategory: LeadCategory = "ACADEMIC", // ← typed, not string
): ImportedRow => {
  const mapped: ImportedRow["mapped"] = {};
  const errors: string[] = [];

  // ── Auto-skip spam / empty / lost rows ───────────────────────────────────
  const skipReason = shouldSkipRow(raw);
  if (skipReason) {
    return { rowIndex, raw, mapped, errors: [], valid: false, skipReason };
  }

  // ── Apply column map ─────────────────────────────────────────────────────
  for (const [csvCol, fieldKey] of Object.entries(colMap)) {
    const val = raw[csvCol]?.trim();
    if (val) (mapped as Record<string, string>)[fieldKey] = val;
  }

  // ── Required: Full Name ──────────────────────────────────────────────────
  if (!mapped.fullName) errors.push("Full Name is required");

  // ── Required: Phone — strip "p:", "ph:", non-digit chars ─────────────────
  if (mapped.phone) {
    mapped.phone = mapped.phone
      .replace(/^[a-zA-Z]+:\s*/i, "")
      .replace(/[^\d+]/g, "")
      .trim();
    if (!mapped.phone) errors.push("Phone is required");
  } else {
    errors.push("Phone is required");
  }

  // ── Source — validate against API enum, fallback to GOOGLE_SHEET ─────────────
  if (mapped.source) {
    const upper = mapped.source.toUpperCase().trim();
    const norm = upper.replace(/\s+/g, "_") as (typeof VALID_SOURCES)[number];
    if (VALID_SOURCES.includes(norm)) {
      mapped.source = norm;
    } else if (SOURCE_ALIAS_MAP[upper]) {
      mapped.source = SOURCE_ALIAS_MAP[upper];
    } else {
      mapped.source =
        VALID_SOURCES.find((s) => upper.includes(s)) ?? "GOOGLE_SHEET";
    }
  } else {
    mapped.source = "GOOGLE_SHEET"; // no source column → imported from sheet
  }

  // ── Priority ─────────────────────────────────────────────────────────────
  if (mapped.priority) {
    const upper = mapped.priority
      .toUpperCase()
      .trim() as (typeof VALID_PRIORITIES)[number];
    mapped.priority = VALID_PRIORITIES.includes(upper) ? upper : "COLD";
  } else {
    mapped.priority = "COLD";
  }

  // ── Country — omit if empty, numeric, or too short ───────────────────────
  const countryVal = mapped.country?.trim();
  if (!countryVal || countryVal.length < 2 || /^\d+$/.test(countryVal)) {
    delete mapped.country;
  }

  // ── Follow-up date — normalise to YYYY-MM-DD ─────────────────────────────
  if (mapped.followUpDate) {
    const rawDate = mapped.followUpDate.trim();
    const isISO = /^\d{4}-\d{2}-\d{2}$/.test(rawDate);
    const ddmmyyyy = rawDate.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
    if (isISO) {
      // keep as-is
    } else if (ddmmyyyy) {
      const [, dd, mm, yyyy] = ddmmyyyy;
      mapped.followUpDate = `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
    } else {
      const parsed = new Date(rawDate);
      if (!isNaN(parsed.getTime())) {
        mapped.followUpDate = parsed.toISOString().split("T")[0];
      } else {
        delete mapped.followUpDate;
      }
    }
  }

  mapped.leadCategory = defaultLeadCategory;

  return { rowIndex, raw, mapped, errors, valid: errors.length === 0 };
};
