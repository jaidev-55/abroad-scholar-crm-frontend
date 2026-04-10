import React, { useState } from "react";
import { Modal } from "antd";
import { useForm } from "react-hook-form";
import {
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiArrowRightSLine,
  RiArrowLeftSLine,
  RiAlertLine,
  RiTableLine,
  RiAddCircleLine,
  RiLoaderLine,
  RiLink,
  RiShieldCheckLine,
  RiCloseLine,
  RiCheckLine,
  RiExternalLinkLine,
  RiInformationLine,
} from "react-icons/ri";
import { SiGooglesheets } from "react-icons/si";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLead, type CreateLeadPayload } from "../api/leads";
import CustomInput from "../../../components/common/CustomInput";

// ─── Form types ───────────────────────────────────────────────────────────────
interface SheetUrlForm {
  sheetUrl: string;
}

interface ImportedRow {
  rowIndex: number;
  raw: Record<string, string>;
  mapped: {
    fullName?: string;
    phone?: string;
    email?: string;
    country?: string;
    source?: string;
    priority?: string;
    counselorName?: string;
    followUpDate?: string;
    ieltsScore?: string;
    notes?: string;
  };
  errors: string[];
  valid: boolean;
}

// ─── Column config ────────────────────────────────────────────────────────────
const EXPECTED_COLUMNS = [
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

const VALID_SOURCES = [
  "INSTAGRAM",
  "WEBSITE",
  "WALK_IN",
  "GOOGLE_ADS",
  "META_ADS",
  "REFERRAL",
] as const;
const VALID_PRIORITIES = ["HOT", "WARM", "COLD"] as const;
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

// ─── Sheet URL helpers ────────────────────────────────────────────────────────
const extractSheetId = (url: string): string | null =>
  url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)?.[1] ?? null;

/**
 * Extract gid from URL — this is the ONLY reliable way to target a specific
 * tab on a *shared* (non-published) Google Sheet.
 * `sheet=NAME` only works for "File → Publish to web" sheets.
 */
const extractGid = (url: string): string | null =>
  url.match(/[?&]gid=(\d+)/)?.[1] ?? url.match(/#gid=(\d+)/)?.[1] ?? null;

const buildExportUrl = (sheetId: string, gid: string | null): string => {
  const base = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
  return gid ? `${base}&gid=${gid}` : base;
};

const fetchGoogleSheetCSV = async (
  sheetId: string,
  gid: string | null,
): Promise<string> => {
  const res = await fetch(buildExportUrl(sheetId, gid));
  if (!res.ok) {
    if (res.status === 403)
      throw new Error(
        "Access denied — share the sheet publicly with View access.",
      );
    throw new Error(`Could not fetch sheet (HTTP ${res.status}).`);
  }
  const text = await res.text();
  if (text.trim().startsWith("<!") || text.trim().startsWith("<html"))
    throw new Error(
      "Sheet returned an error page. Make sure it is shared publicly.",
    );
  return text;
};

// ─── CSV + row validation ─────────────────────────────────────────────────────
const parseCSV = (text: string): { headers: string[]; rows: string[][] } => {
  const lines = text.split("\n").filter((l) => l.trim());
  return {
    headers: lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, "")),
    rows: lines
      .slice(1)
      .map((l) => l.split(",").map((v) => v.trim().replace(/^"|"$/g, ""))),
  };
};

const autoMapColumn = (header: string): string | null => {
  const n = header.toLowerCase().trim();
  for (const col of EXPECTED_COLUMNS)
    if (col.aliases.some((a) => n.includes(a))) return col.key;
  return null;
};

const validateRow = (
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

  // Sanitize phone:
  // 1. Strip known prefixes like "p:", "ph:", "mob:", "tel:" (seen in CRM exports)
  // 2. Keep only digits and leading + (international format)
  // 3. Remove spaces, dashes, parentheses, dots
  if (mapped.phone) {
    // Remove any alphabetic prefix followed by colon e.g. "p:", "ph:", "mob:"
    mapped.phone = mapped.phone.replace(/^[a-zA-Z]+:\s*/i, "");
    // Remove all non-digit chars except leading +
    mapped.phone = mapped.phone.replace(/[^\d+]/g, "").trim();
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

  // Country — optional. Clean if invalid/empty, otherwise keep as-is.
  const countryVal = mapped.country?.trim();
  if (!countryVal || countryVal.length < 2 || /^\d+$/.test(countryVal)) {
    delete mapped.country;
  } else {
    mapped.country = countryVal;
  }

  // followUpDate — convert any common date format to ISO 8601 YYYY-MM-DD
  // API requires ISO format. Sheets often have DD/MM/YYYY, DD-MM-YYYY, "21 Apr 2026" etc.
  if (mapped.followUpDate) {
    const rawDate = mapped.followUpDate.trim();

    // Already ISO YYYY-MM-DD — keep as is
    const isISO = /^\d{4}-\d{2}-\d{2}$/.test(rawDate);

    // DD/MM/YYYY or DD-MM-YYYY (common in Indian sheets)
    const ddmmyyyy = rawDate.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);

    if (isISO) {
      // already correct, keep mapped.followUpDate as is
    } else if (ddmmyyyy) {
      const [, dd, mm, yyyy] = ddmmyyyy;
      mapped.followUpDate = `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
    } else {
      // Try JS Date parsing for "21 Apr 2026", "Apr 21 2026", "21 April 2026" etc.
      const parsed = new Date(rawDate);
      if (!isNaN(parsed.getTime())) {
        mapped.followUpDate = parsed.toISOString().split("T")[0];
      } else {
        // Unparseable — remove to avoid API rejection
        delete mapped.followUpDate;
      }
    }
  }

  return { rowIndex, raw, mapped, errors, valid: errors.length === 0 };
};

// ─── Stepper ──────────────────────────────────────────────────────────────────
const StepDot: React.FC<{ step: number; current: number; label: string }> = ({
  step,
  current,
  label,
}) => {
  const done = step < current,
    active = step === current;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
          done
            ? "bg-emerald-500 text-white"
            : active
              ? "bg-green-600 text-white ring-4 ring-green-100"
              : "bg-slate-100 text-slate-400"
        }`}
      >
        {done ? <RiCheckLine size={14} /> : step + 1}
      </div>
      <span
        className={`text-[10px] font-semibold uppercase tracking-wider ${
          active
            ? "text-green-700"
            : done
              ? "text-emerald-600"
              : "text-slate-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
};

const StepConnector: React.FC<{ done: boolean }> = ({ done }) => (
  <div className="flex-1 h-[2px] mt-[-12px] mx-1">
    <div
      className={`h-full rounded-full transition-all duration-500 ${done ? "bg-emerald-400" : "bg-slate-200"}`}
    />
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
interface GoogleSheetsImportModalProps {
  open: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
}

const GoogleSheetsImportModal: React.FC<GoogleSheetsImportModalProps> = ({
  open,
  onClose,
  onImportSuccess,
}) => {
  const queryClient = useQueryClient();

  // react-hook-form — controls the URL input field (CustomInput requires control)
  const {
    control,
    handleSubmit,
    watch,
    reset: resetForm,
    setError: setFieldError,
    formState: { errors: formErrors },
  } = useForm<SheetUrlForm>({ defaultValues: { sheetUrl: "" } });

  const watchedUrl = watch("sheetUrl") ?? "";

  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [loading, setLoading] = useState(false);
  const [detectedGid, setDetectedGid] = useState<string | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [colMap, setColMap] = useState<Record<string, string>>({});
  const [previewRows, setPreviewRows] = useState<ImportedRow[]>([]);
  const [importResult, setImportResult] = useState<{
    success: number;
    failed: number;
  } | null>(null);
  const [showSkipped, setShowSkipped] = useState(false);

  const reset = () => {
    setStep(0);
    resetForm();
    setLoading(false);
    setDetectedGid(null);
    setCsvHeaders([]);
    setCsvRows([]);
    setColMap({});
    setPreviewRows([]);
    setImportResult(null);
    setShowSkipped(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const processCsvText = (text: string) => {
    const { headers, rows } = parseCSV(text);
    setCsvHeaders(headers);
    setCsvRows(rows);
    const auto: Record<string, string> = {};
    headers.forEach((h) => {
      const m = autoMapColumn(h);
      if (m) auto[h] = m;
    });
    setColMap(auto);
    setStep(1);
  };

  // Called by react-hook-form after its own validation passes
  const onFetchSheet = async (data: SheetUrlForm) => {
    const id = extractSheetId(data.sheetUrl);
    if (!id) {
      setFieldError("sheetUrl", {
        message: "Invalid URL — paste the full Google Sheets link.",
      });
      return;
    }
    const gid = extractGid(data.sheetUrl);
    setDetectedGid(gid);
    setLoading(true);
    try {
      const csv = await fetchGoogleSheetCSV(id, gid);
      processCsvText(csv);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to fetch sheet";
      setFieldError("sheetUrl", { message: msg });
    } finally {
      setLoading(false);
    }
  };

  const buildPreview = () => {
    const rows = csvRows.map((row, i) => {
      const raw: Record<string, string> = {};
      csvHeaders.forEach((h, idx) => {
        raw[h] = row[idx] ?? "";
      });
      return validateRow(raw, colMap, i + 2);
    });
    setPreviewRows(rows);
    setStep(2);
  };

  // ── createLead API mutation ───────────────────────────────────────────────
  const { mutate: importLeads, isPending: importing } = useMutation({
    mutationFn: async (rows: ImportedRow[]) => {
      const valid = rows.filter((r) => r.valid);
      const results = await Promise.allSettled(
        valid.map((r) => {
          // country is now optional — only send if valid
          const countryRaw = r.mapped.country?.trim();
          const country =
            countryRaw && countryRaw.length >= 2 && !/^\d+$/.test(countryRaw)
              ? countryRaw
              : undefined;
          const email = r.mapped.email?.trim() || undefined;
          const followUpDate = r.mapped.followUpDate?.trim() || undefined;
          const notes = r.mapped.notes?.trim() || undefined;
          const ieltsRaw = r.mapped.ieltsScore?.trim();
          const ieltsScore =
            ieltsRaw && !isNaN(Number(ieltsRaw)) ? Number(ieltsRaw) : undefined;

          const payload = {
            fullName: r.mapped.fullName!,
            phone: r.mapped.phone!,
            status: "NEW",
            source: r.mapped.source ?? "REFERRAL",
            priority: r.mapped.priority ?? "COLD",
            assignmentType: "AUTO",
          } as CreateLeadPayload;

          // Assign optional fields only when they have a real value
          if (country) payload.country = country;
          if (email) payload.email = email;
          if (followUpDate) payload.followUpDate = followUpDate;
          if (ieltsScore !== undefined) payload.ieltsScore = ieltsScore;
          if (notes) payload.notes = [notes];

          return createLead(payload);
        }),
      );
      return {
        success: results.filter((r) => r.status === "fulfilled").length,
        failed: results.filter((r) => r.status === "rejected").length,
      };
    },
    onSuccess: (result) => {
      setImportResult(result);
      setStep(3);
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      onImportSuccess();
    },
  });

  const validCount = previewRows.filter((r) => r.valid).length;
  const invalidCount = previewRows.filter((r) => !r.valid).length;
  const requiredMapped = EXPECTED_COLUMNS.filter((c) => c.required).every((c) =>
    Object.values(colMap).includes(c.key),
  );

  // Live gid detection from watched URL (before fetch)
  const urlGid = watchedUrl ? extractGid(watchedUrl) : null;

  // ── Step renders ──────────────────────────────────────────────────────────

  const renderStep0 = () => (
    <div className="space-y-5">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 to-emerald-500 p-5">
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute bottom-0 left-16 w-16 h-16 rounded-full bg-white/5" />
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <SiGooglesheets size={24} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">
              Import from Google Sheets
            </p>
            <p className="text-white/70 text-xs mt-0.5">
              Click the tab you want → copy the URL → paste below
            </p>
          </div>
        </div>
      </div>

      {/* URL input — CustomInput wired to react-hook-form */}
      <form id="sheet-url-form" onSubmit={handleSubmit(onFetchSheet)}>
        <CustomInput
          name="sheetUrl"
          control={control}
          label="Google Sheet URL"
          placeholder="https://docs.google.com/spreadsheets/d/..."
          type="text"
          icon={<RiLink size={14} className="text-slate-400" />}
          rules={{
            required: "Sheet URL is required",
            validate: (val) =>
              !!extractSheetId(val) ||
              "Invalid URL — paste the full Google Sheets link from your browser.",
          }}
        />
      </form>

      {/* Live tab detection badge */}
      {watchedUrl.trim() && !formErrors.sheetUrl && (
        <div
          className={`flex items-start gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium ${
            urlGid
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-amber-50 border-amber-200 text-amber-700"
          }`}
        >
          {urlGid ? (
            <>
              <RiCheckboxCircleLine size={13} className="shrink-0 mt-0.5" />
              <span>
                Tab detected:{" "}
                <span className="font-bold bg-green-100 px-1.5 py-0.5 rounded">
                  gid={urlGid}
                </span>
                <span className="ml-1.5 text-green-600">
                  — only this tab will be imported ✓
                </span>
              </span>
            </>
          ) : (
            <>
              <RiInformationLine size={13} className="shrink-0 mt-0.5" />
              <span>
                No tab ID in URL — the <strong>first sheet</strong> will be
                imported. Click a specific tab in Google Sheets first, then copy
                the URL.
              </span>
            </>
          )}
        </div>
      )}

      {/* Step guide */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
        <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <RiInformationLine size={13} className="text-blue-500" />
          How to import a specific tab (e.g. "NEW Leads")
        </p>
        <ol className="space-y-1.5 pl-1">
          {[
            "Open your Google Sheet in the browser",
            'Click the tab you want (e.g. "NEW Leads")',
            "Copy the full URL from the browser address bar",
            "Paste above — the tab ID (gid) is auto-detected",
          ].map((s, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-[11px] text-slate-600"
            >
              <span className="w-4 h-4 rounded-full bg-green-100 text-green-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>
      </div>

      {/* Public access reminder */}
      <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
        <RiShieldCheckLine
          size={16}
          className="text-amber-600 mt-0.5 shrink-0"
        />
        <div>
          <p className="text-xs font-bold text-amber-800">
            Sheet must be publicly accessible
          </p>
          <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
            In Google Sheets:{" "}
            <span className="font-semibold">
              Share → Change → Anyone with the link → Viewer
            </span>
          </p>
          <a
            href="https://support.google.com/docs/answer/9331169"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-amber-700 underline mt-1"
          >
            <RiExternalLinkLine size={11} /> Learn how to share
          </a>
        </div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-slate-800">Map Columns</p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {csvHeaders.length} columns · {csvRows.length} rows
            {detectedGid && (
              <span className="ml-1.5 text-green-600 font-semibold">
                (tab gid={detectedGid})
              </span>
            )}
          </p>
        </div>
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
            requiredMapped
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-amber-50 text-amber-700 border border-amber-200"
          }`}
        >
          {requiredMapped ? (
            <>
              <RiCheckboxCircleLine size={13} /> Ready
            </>
          ) : (
            <>
              <RiAlertLine size={13} /> Map required fields
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {EXPECTED_COLUMNS.filter((c) => c.required).map((col) => {
          const isMapped = Object.values(colMap).includes(col.key);
          return (
            <span
              key={col.key}
              className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg font-semibold border ${
                isMapped
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-600 border-red-200"
              }`}
            >
              {isMapped ? (
                <RiCheckboxCircleLine size={11} />
              ) : (
                <RiAlertLine size={11} />
              )}
              {col.label}
            </span>
          );
        })}
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {csvHeaders.map((header, idx) => (
          <div
            key={header}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
              colMap[header]
                ? "bg-green-50/50 border-green-100"
                : "bg-slate-50 border-slate-100"
            }`}
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-700 truncate flex items-center gap-1.5">
                <RiTableLine size={11} className="text-slate-400 shrink-0" />
                {header}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 pl-4 truncate">
                Sample:{" "}
                <span className="text-slate-600">
                  {csvRows[0]?.[idx] ?? "—"}
                </span>
              </p>
            </div>
            <RiArrowRightSLine
              size={16}
              className={colMap[header] ? "text-green-400" : "text-slate-300"}
            />
            <select
              value={colMap[header] ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                setColMap((prev) => {
                  const n = { ...prev };
                  if (v) n[header] = v;
                  else delete n[header];
                  return n;
                });
              }}
              className={`text-xs border rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 min-w-[145px] transition-all ${
                colMap[header]
                  ? "border-green-200 bg-green-50 text-green-800 font-semibold"
                  : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              <option value="">— Skip column —</option>
              {EXPECTED_COLUMNS.map((col) => (
                <option key={col.key} value={col.key}>
                  {col.label}
                  {col.required ? " *" : ""}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => {
    const validRows = previewRows.filter((r) => r.valid);
    const invalidRows = previewRows.filter((r) => !r.valid);

    // Aggregate skip reasons with count
    const skipReasonMap = invalidRows.reduce<Record<string, number>>(
      (acc, row) => {
        row.errors.forEach((e) => {
          acc[e] = (acc[e] ?? 0) + 1;
        });
        return acc;
      },
      {},
    );

    const activeRows = showSkipped ? invalidRows : validRows;

    return (
      <div className="space-y-3">
        {/* ── Tab switcher ── */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setShowSkipped(false)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              !showSkipped
                ? "bg-white text-green-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <RiCheckboxCircleLine
              size={13}
              className={!showSkipped ? "text-green-600" : "text-slate-400"}
            />
            {validCount} Ready to Import
          </button>
          {invalidCount > 0 && (
            <button
              onClick={() => setShowSkipped(true)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                showSkipped
                  ? "bg-white text-red-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <RiErrorWarningLine
                size={13}
                className={showSkipped ? "text-red-500" : "text-slate-400"}
              />
              {invalidCount} Skipped — Why?
            </button>
          )}
        </div>

        {/* ── Skip reason breakdown — only on skipped tab ── */}
        {showSkipped && invalidCount > 0 && (
          <div className="rounded-xl border border-red-200 overflow-hidden">
            {/* Header */}
            <div className="bg-red-50 px-3.5 py-2.5 border-b border-red-200">
              <p className="text-[11px] font-bold text-red-800 uppercase tracking-wider flex items-center gap-1.5">
                <RiAlertLine size={12} />
                Reasons these {invalidCount} rows were skipped
              </p>
            </div>
            {/* Reason rows */}
            <div className="divide-y divide-red-100">
              {Object.entries(skipReasonMap).map(([reason, count]) => {
                // Find example rows that have this error
                const exampleRows = invalidRows
                  .filter((r) => r.errors.includes(reason))
                  .slice(0, 2);
                return (
                  <div key={reason} className="px-3.5 py-3 bg-white">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12px] font-bold text-red-700 flex items-center gap-1.5">
                        <RiErrorWarningLine
                          size={13}
                          className="text-red-500 shrink-0"
                        />
                        {reason}
                      </span>
                      <span className="text-[11px] font-black text-red-600 bg-red-100 border border-red-200 px-2.5 py-0.5 rounded-full">
                        {count} row{count > 1 ? "s" : ""}
                      </span>
                    </div>
                    {/* Show 2 example affected rows */}
                    <div className="pl-5 space-y-1">
                      {exampleRows.map((row) => (
                        <div
                          key={row.rowIndex}
                          className="flex items-center gap-2 text-[11px] text-slate-500"
                        >
                          <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0">
                            row {row.rowIndex}
                          </span>
                          {/* Show the raw value of the problematic field */}
                          <span className="truncate text-slate-600">
                            {reason.toLowerCase().includes("name")
                              ? Object.values(row.raw)[0]
                                ? `"${Object.values(row.raw)[0]}"`
                                : "— empty cell"
                              : reason.toLowerCase().includes("phone")
                                ? row.raw[
                                    Object.keys(row.raw).find(
                                      (k) =>
                                        k.toLowerCase().includes("phone") ||
                                        k.toLowerCase().includes("mobile"),
                                    ) ?? ""
                                  ] || "— empty cell"
                                : `${Object.values(row.raw).filter(Boolean).slice(0, 2).join(", ") || "— empty row"}`}
                          </span>
                        </div>
                      ))}
                      {count > 2 && (
                        <p className="text-[10px] text-red-400 pl-0.5">
                          + {count - 2} more row{count - 2 > 1 ? "s" : ""} with
                          this issue
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Footer hint */}
            <div className="bg-amber-50 border-t border-amber-200 px-3.5 py-2.5">
              <p className="text-[11px] text-amber-700 font-medium flex items-start gap-1.5">
                <RiInformationLine
                  size={13}
                  className="text-amber-500 shrink-0 mt-0.5"
                />
                <span>
                  To fix: go <strong>Back → Map Columns</strong> and ensure
                  required fields are correctly mapped. Rows with missing
                  required data in your sheet must be fixed in Google Sheets
                  first.
                </span>
              </p>
            </div>
          </div>
        )}

        {/* ── Row list ── */}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {activeRows.slice(0, 10).map((row) => (
            <div
              key={row.rowIndex}
              className={`p-3 rounded-xl border ${
                row.valid
                  ? "border-green-100 bg-gradient-to-r from-green-50/60 to-emerald-50/30"
                  : "border-red-100 bg-red-50/40"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  {row.valid ? (
                    <RiCheckboxCircleLine
                      size={13}
                      className="text-green-500 shrink-0"
                    />
                  ) : (
                    <RiErrorWarningLine
                      size={13}
                      className="text-red-500 shrink-0"
                    />
                  )}
                  <span className="text-[12px] font-bold text-slate-800 truncate">
                    {row.mapped.fullName ? (
                      row.mapped.fullName
                    ) : (
                      <em className="text-red-400 font-normal text-[11px]">
                        No name — row {row.rowIndex}
                      </em>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-[10px] text-slate-400 font-mono">
                    row {row.rowIndex}
                  </span>
                  {row.mapped.phone && (
                    <span className="text-[11px] text-slate-500 font-mono">
                      {row.mapped.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Tags row */}
              <div className="flex flex-wrap gap-1 pl-5">
                {row.mapped.country && (
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                    {row.mapped.country}
                  </span>
                )}
                {row.mapped.source && (
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium border border-blue-100">
                    {row.mapped.source}
                  </span>
                )}
                {row.mapped.priority && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${
                      row.mapped.priority === "HOT"
                        ? "bg-red-50 text-red-600 border-red-100"
                        : row.mapped.priority === "WARM"
                          ? "bg-amber-50 text-amber-600 border-amber-100"
                          : "bg-blue-50 text-blue-600 border-blue-100"
                    }`}
                  >
                    {row.mapped.priority}
                  </span>
                )}
                {/* Error badges inline */}
                {row.errors.map((err, i) => (
                  <span
                    key={i}
                    className="text-[10px] text-red-600 bg-red-100 border border-red-200 px-1.5 py-0.5 rounded font-semibold flex items-center gap-0.5"
                  >
                    <RiErrorWarningLine size={9} />
                    {err}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {activeRows.length > 10 && (
            <div className="text-center py-2">
              <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
                + {activeRows.length - 10} more{" "}
                {showSkipped ? "skipped" : "valid"} rows
              </span>
            </div>
          )}

          {activeRows.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-sm">
              {showSkipped ? "No skipped rows 🎉" : "No valid rows found"}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="flex flex-col items-center justify-center py-6 space-y-5">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <RiCheckboxCircleLine size={44} className="text-green-500" />
        </div>
        <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-xl font-black text-slate-800">Import Complete!</p>
        <p className="text-sm text-slate-500">
          <span className="font-bold text-green-600 text-base">
            {importResult?.success}
          </span>{" "}
          lead{importResult?.success !== 1 ? "s" : ""} imported successfully
        </p>
        {(importResult?.failed ?? 0) > 0 && (
          <p className="text-xs text-red-500">
            {importResult!.failed} row{importResult!.failed > 1 ? "s" : ""}{" "}
            skipped
          </p>
        )}
      </div>
      <div className="flex gap-3">
        <div className="flex flex-col items-center px-5 py-3 bg-green-50 border border-green-200 rounded-2xl">
          <span className="text-2xl font-black text-green-700">
            {importResult?.success ?? 0}
          </span>
          <span className="text-[11px] text-green-600 font-semibold">
            Imported
          </span>
        </div>
        {(importResult?.failed ?? 0) > 0 && (
          <div className="flex flex-col items-center px-5 py-3 bg-red-50 border border-red-200 rounded-2xl">
            <span className="text-2xl font-black text-red-600">
              {importResult!.failed}
            </span>
            <span className="text-[11px] text-red-500 font-semibold">
              Skipped
            </span>
          </div>
        )}
      </div>
      <button
        onClick={handleClose}
        className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer shadow-lg shadow-green-200"
      >
        <RiCheckLine size={16} /> Done
      </button>
    </div>
  );

  // ── Footer ────────────────────────────────────────────────────────────────
  const renderFooter = () => {
    if (step === 3) return null;
    return (
      <div className="flex items-center justify-between pt-2">
        {step > 0 ? (
          <button
            onClick={() => {
              setStep((s) => (s - 1) as 0 | 1 | 2 | 3);
              setShowSkipped(false);
            }}
            disabled={loading || importing}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer font-medium disabled:opacity-50"
          >
            <RiArrowLeftSLine size={16} /> Back
          </button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={handleClose}
            disabled={loading || importing}
            className="px-4 py-2.5 text-sm text-slate-500 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>

          {/* Step 0 — submit triggers RHF validation → onFetchSheet */}
          {step === 0 && (
            <button
              type="submit"
              form="sheet-url-form"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
            >
              {loading ? (
                <>
                  <RiLoaderLine size={15} className="animate-spin" />
                  Fetching…
                </>
              ) : (
                <>
                  <SiGooglesheets size={14} />
                  Fetch Sheet
                  <RiArrowRightSLine size={15} />
                </>
              )}
            </button>
          )}

          {step === 1 && (
            <button
              onClick={buildPreview}
              disabled={!requiredMapped}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
            >
              Preview Data <RiArrowRightSLine size={15} />
            </button>
          )}

          {step === 2 && (
            <button
              onClick={() => importLeads(previewRows)}
              disabled={validCount === 0 || importing}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
            >
              {importing ? (
                <>
                  <RiLoaderLine size={15} className="animate-spin" />
                  Importing {validCount}…
                </>
              ) : (
                <>
                  <RiAddCircleLine size={15} />
                  Import {validCount} Lead{validCount !== 1 ? "s" : ""}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  const STEP_LABELS = ["Connect", "Map Columns", "Preview"];

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={renderFooter()}
      closable={!loading && !importing}
      maskClosable={!loading && !importing}
      closeIcon={<RiCloseLine size={18} className="text-slate-500" />}
      title={
        <div className="flex items-center gap-3 pr-8">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <SiGooglesheets size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-[15px] font-black text-slate-800 leading-tight">
              Import Leads
            </p>
            <p className="text-[11px] text-slate-500 font-normal">
              From Google Sheets
            </p>
          </div>
        </div>
      }
      width={560}
    >
      {step < 3 && (
        <div className="flex items-center mb-6 mt-1 px-2">
          {STEP_LABELS.map((label, i) => (
            <React.Fragment key={label}>
              <StepDot step={i} current={step} label={label} />
              {i < STEP_LABELS.length - 1 && <StepConnector done={step > i} />}
            </React.Fragment>
          ))}
        </div>
      )}
      {step === 0 && renderStep0()}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </Modal>
  );
};

export default GoogleSheetsImportModal;
