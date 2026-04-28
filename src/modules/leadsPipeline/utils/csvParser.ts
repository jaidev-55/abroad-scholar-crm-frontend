export const EXPECTED_COLUMNS = [
  {
    key: "fullName",
    label: "Full Name",
    required: true,
    aliases: [
      "name",
      "full name",
      "fullname",
      "full_name",
      "student name",
      "student",
      "lead name",
      "contact name",
    ],
  },
  {
    key: "phone",
    label: "Phone / Contact No",
    required: true,
    aliases: [
      "phone",
      "mobile",
      "contact",
      "contact no",
      "contact number",
      "phone number",
      "mobile number",
      "contactno",
      "contact_no",
      "mob",
      "cell",
      "number",
    ],
  },
  {
    key: "email",
    label: "Email",
    required: false,
    aliases: ["email", "email address", "e-mail", "mail"],
  },
  {
    key: "country",
    label: "Country / Destination",
    required: false,
    aliases: [
      "country",
      "destination",
      "target country",
      "study destination",
      "visa country",
    ],
  },
  {
    key: "source",
    label: "Source",
    required: false,
    aliases: [
      "source",
      "lead source",
      "channel",
      "leadsource",
      "lead_source",
      "medium",
    ],
  },
  {
    key: "priority",
    label: "Priority",
    required: false,
    aliases: ["priority", "lead priority", "hot/warm/cold", "urgency"],
  },
  {
    key: "followUpDate",
    label: "Follow-up Date",
    required: false,
    aliases: [
      "follow-up date",
      "followup date",
      "follow up date",
      "next followup",
      "due date",
    ],
  },
  {
    key: "notes",
    label: "Notes / Call Status",
    required: false,
    aliases: [
      "notes",
      "note",
      "comments",
      "remarks",
      "call status",
      "callstatus",
      "status",
      "details",
    ],
  },
  {
    key: "ieltsScore",
    label: "IELTS Score",
    required: false,
    aliases: ["ielts", "ielts score", "score", "band", "band score"],
  },
];

// ─── Auto-map a CSV column header to a field key ──────────────────────────────
export const autoMapColumn = (header: string): string | null => {
  const normalized = header.toLowerCase().trim();
  for (const col of EXPECTED_COLUMNS) {
    if (
      col.aliases.some(
        (alias) =>
          normalized === alias ||
          normalized.includes(alias) ||
          alias.includes(normalized),
      )
    ) {
      return col.key;
    }
  }
  return null;
};

// ─── Parse raw CSV text → headers + rows ─────────────────────────────────────
export const parseCSV = (
  text: string,
): { headers: string[]; rows: string[][] } => {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) return { headers: [], rows: [] };

  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseLine(lines[0]).map((h) =>
    h.replace(/^"|"$/g, "").trim(),
  );
  const rows = lines
    .slice(1)
    .map((line) => parseLine(line).map((v) => v.replace(/^"|"$/g, "").trim()));

  return { headers, rows };
};

// ─── Keywords that mark a row as red/spam/lost ────────────────────────────────
// Only skip rows that clearly contain these in ANY column value
const SKIP_KEYWORDS = [
  "spam",
  "paid fees and got refund",
  "joined in another consultancy",
  "joined in leapscholar",
  "joined in a consultancy",
  "do not call",
  "wrong number",
  "fake",
  "not planning for ielts",
  "north indian lead",
  "not interested",
  "already joined",
];

// ─── Main skip detector — ONLY empty rows + red-marked leads ─────────────────
export const shouldSkipRow = (raw: Record<string, string>): string | null => {
  // 1. Skip if name column is completely empty
  const nameEntry = Object.entries(raw).find(([k]) =>
    k.toLowerCase().includes("name"),
  );
  const nameVal = nameEntry?.[1]?.trim() ?? "";
  if (!nameVal) return "Empty name";

  // 2. Skip if any cell contains red-row spam/lost keywords
  const allValues = Object.values(raw).join(" ").toLowerCase();
  for (const kw of SKIP_KEYWORDS) {
    if (allValues.includes(kw)) return `Marked as: "${kw}"`;
  }

  return null;
};
