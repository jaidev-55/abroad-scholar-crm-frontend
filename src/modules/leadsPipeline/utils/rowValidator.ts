import type { ImportedRow } from "./types";

export const VALID_SOURCES = [
  "INSTAGRAM",
  "WEBSITE",
  "WALK_IN",
  "GOOGLE_ADS",
  "META_ADS",
  "REFERRAL",
] as const;
export const VALID_PRIORITIES = ["HOT", "WARM", "COLD"] as const;

const SOURCE_ALIAS_MAP: Record<string, string> = {
  FACEBOOK: "META_ADS",
  FB: "META_ADS",
  "FACEBOOK ADS": "META_ADS",
  "META ADS": "META_ADS",
  GOOGLE: "GOOGLE_ADS",
  "GOOGLE ADS": "GOOGLE_ADS",
  "WALK IN": "WALK_IN",
  WALKIN: "WALK_IN",
  OTHER: "REFERRAL",
  WHATSAPP: "REFERRAL",
  DIRECT: "REFERRAL",
};

export const validateRow = (
  raw: Record<string, string>,
  colMap: Record<string, string>,
  rowIndex: number,
): ImportedRow => {
  const mapped: ImportedRow["mapped"] = {};
  const errors: string[] = [];

  for (const [csvCol, fieldKey] of Object.entries(colMap)) {
    const val = raw[csvCol]?.trim();
    if (val) (mapped as Record<string, string>)[fieldKey] = val;
  }

  if (!mapped.fullName) errors.push("Full Name is required");

  if (mapped.phone) {
    mapped.phone = mapped.phone
      .replace(/^[a-zA-Z]+:\s*/i, "")
      .replace(/[^\d+]/g, "")
      .trim();
    if (!mapped.phone) errors.push("Phone is required");
  } else {
    errors.push("Phone is required");
  }

  if (mapped.source) {
    const upper = mapped.source.toUpperCase().trim();
    const norm = upper.replace(/\s+/g, "_") as (typeof VALID_SOURCES)[number];
    mapped.source = VALID_SOURCES.includes(norm)
      ? norm
      : (SOURCE_ALIAS_MAP[upper] ??
        VALID_SOURCES.find((s) => upper.includes(s)) ??
        "REFERRAL");
  } else {
    mapped.source = "REFERRAL";
  }

  if (mapped.priority) {
    const upper = mapped.priority
      .toUpperCase()
      .trim() as (typeof VALID_PRIORITIES)[number];
    mapped.priority = VALID_PRIORITIES.includes(upper) ? upper : "COLD";
  } else {
    mapped.priority = "COLD";
  }

  const countryVal = mapped.country?.trim();
  if (!countryVal || countryVal.length < 2 || /^\d+$/.test(countryVal)) {
    delete mapped.country;
  }

  if (mapped.followUpDate) {
    const rawDate = mapped.followUpDate.trim();
    const isISO = /^\d{4}-\d{2}-\d{2}$/.test(rawDate);
    const ddmmyyyy = rawDate.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
    if (isISO) {
      // keep as is
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

  return { rowIndex, raw, mapped, errors, valid: errors.length === 0 };
};
