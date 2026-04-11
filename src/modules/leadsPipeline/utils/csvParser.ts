export const EXPECTED_COLUMNS = [
  {
    key: "fullName",
    label: "Full Name",
    required: true,
    aliases: ["name", "full name", "student name", "fullname", "full_name"],
  },
  {
    key: "phone",
    label: "Phone",
    required: true,
    aliases: ["phone", "mobile", "contact", "phone number", "mobile number"],
  },
  {
    key: "email",
    label: "Email",
    required: false,
    aliases: ["email", "email address", "e-mail"],
  },
  {
    key: "country",
    label: "Country",
    required: false,
    aliases: ["country", "destination", "target country"],
  },
  {
    key: "source",
    label: "Source",
    required: false,
    aliases: ["source", "lead source", "channel", "leadsource", "lead_source"],
  },
  {
    key: "priority",
    label: "Priority",
    required: false,
    aliases: ["priority", "lead priority", "hot/warm/cold"],
  },
  {
    key: "counselorName",
    label: "Counselor",
    required: false,
    aliases: ["counselor", "counsellor", "assigned to", "agent"],
  },
  {
    key: "followUpDate",
    label: "Follow-up Date",
    required: false,
    aliases: ["follow up", "follow-up", "followup date", "follow up date"],
  },
  {
    key: "ieltsScore",
    label: "IELTS Score",
    required: false,
    aliases: ["ielts", "ielts score", "score"],
  },
  {
    key: "notes",
    label: "Notes",
    required: false,
    aliases: ["notes", "note", "comments", "remarks"],
  },
] as const;

export const parseCSV = (
  text: string,
): { headers: string[]; rows: string[][] } => {
  const lines = text.split("\n").filter((l) => l.trim());
  return {
    headers: lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, "")),
    rows: lines
      .slice(1)
      .map((l) => l.split(",").map((v) => v.trim().replace(/^"|"$/g, ""))),
  };
};

export const autoMapColumn = (header: string): string | null => {
  const n = header.toLowerCase().trim();
  for (const col of EXPECTED_COLUMNS)
    if (col.aliases.some((a) => n.includes(a))) return col.key;
  return null;
};
