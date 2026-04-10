import React, { useState } from "react";
import { Modal, Checkbox, Radio, message } from "antd";
import {
  RiDownloadLine,
  RiCloseLine,
  RiFilterLine,
  RiCheckboxCircleLine,
} from "react-icons/ri";
import { SiGooglesheets } from "react-icons/si";

type ExportFormat = "csv" | "gsheet_csv";
type ExportScope = "filtered" | "all";

interface ExportField {
  key: keyof ExportableLead | "notesText";
  label: string;
  defaultOn: boolean;
}

interface ExportableLead {
  name: string;
  phone: string;
  email: string;
  country: string;
  source: string;
  status: string;
  priority: string;
  counselor: string;
  followUp?: string | null;
  ieltsScore?: string | null;
  createdAt: string;
  notes: { text: string }[];
}

// Update props:
interface ExportModalProps {
  leads: ExportableLead[];
  allLeads: ExportableLead[];
  onClose: () => void;
}

const EXPORT_FIELDS: ExportField[] = [
  { key: "name", label: "Full Name", defaultOn: true },
  { key: "phone", label: "Phone", defaultOn: true },
  { key: "email", label: "Email", defaultOn: true },
  { key: "country", label: "Country", defaultOn: true },
  { key: "source", label: "Source", defaultOn: true },
  { key: "status", label: "Status", defaultOn: true },
  { key: "priority", label: "Priority", defaultOn: true },
  { key: "counselor", label: "Counselor", defaultOn: true },
  { key: "followUp", label: "Follow-up Date", defaultOn: true },
  { key: "ieltsScore", label: "IELTS Score", defaultOn: false },
  { key: "notesText", label: "Notes (latest)", defaultOn: false },
  { key: "createdAt", label: "Created Date", defaultOn: false },
];

// ─── CSV builder ──────────────────────────────────────────────────────────────
const buildCSV = (leads: ExportableLead[], fields: string[]): string => {
  const activeFields = EXPORT_FIELDS.filter((f) => fields.includes(f.key));
  const headers = activeFields.map((f) => f.label);

  const rows = leads.map((lead) =>
    activeFields.map((f) => {
      let val: string;
      if (f.key === "notesText") {
        val = lead.notes?.[lead.notes.length - 1]?.text ?? "";
      } else {
        val = String((lead as unknown as Record<string, unknown>)[f.key] ?? "");
      }
      // Escape commas and quotes
      if (val.includes(",") || val.includes('"') || val.includes("\n")) {
        val = `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    }),
  );

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
};

// ─── Download helper ──────────────────────────────────────────────────────────
const downloadCSV = (content: string, filename: string) => {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// ─── Google Sheets open helper ────────────────────────────────────────────────
// Downloads CSV then opens Google Sheets import URL
const exportToGoogleSheets = (csvContent: string, filename: string) => {
  // 1. Download the CSV
  downloadCSV(csvContent, filename);

  // 2. Open Google Sheets new sheet — user can then import via File > Import
  setTimeout(() => {
    window.open("https://sheets.new", "_blank");
    message.info(
      "CSV downloaded! In Google Sheets: File → Import → Upload the CSV",
      6,
    );
  }, 500);
};

const ExportModal: React.FC<ExportModalProps> = ({
  leads,
  allLeads,
  onClose,
}) => {
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [scope, setScope] = useState<ExportScope>("filtered");
  const [selectedFields, setSelectedFields] = useState<string[]>(
    EXPORT_FIELDS.filter((f) => f.defaultOn).map((f) => f.key),
  );
  const [exporting, setExporting] = useState(false);

  const targetLeads = scope === "filtered" ? leads : allLeads;
  const filename = `leads_export_${new Date().toISOString().split("T")[0]}`;

  const toggleField = (key: string) => {
    setSelectedFields((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const handleExport = () => {
    if (selectedFields.length === 0) {
      message.warning("Select at least one field to export");
      return;
    }
    setExporting(true);
    try {
      const csv = buildCSV(targetLeads, selectedFields);
      if (format === "gsheet_csv") {
        exportToGoogleSheets(csv, `${filename}.csv`);
      } else {
        downloadCSV(csv, `${filename}.csv`);
        message.success(`Exported ${targetLeads.length} leads!`);
      }
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      message.error("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Modal
      open
      onCancel={onClose}
      title={
        <div className="flex items-center gap-3 pr-8">
          <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
            <RiDownloadLine size={18} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Export Leads</p>
            <p className="text-xs text-slate-500">
              {targetLeads.length} lead{targetLeads.length !== 1 ? "s" : ""}{" "}
              ready to export
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">
            {selectedFields.length} field
            {selectedFields.length !== 1 ? "s" : ""} · {targetLeads.length} row
            {targetLeads.length !== 1 ? "s" : ""}
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={exporting || selectedFields.length === 0}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-40 transition-colors cursor-pointer"
            >
              {format === "gsheet_csv" ? (
                <SiGooglesheets size={14} />
              ) : (
                <RiDownloadLine size={14} />
              )}
              {exporting ? "Exporting…" : "Export"}
            </button>
          </div>
        </div>
      }
      width={520}
      closeIcon={<RiCloseLine size={18} />}
    >
      <div className="space-y-5 py-1">
        {/* Export scope */}
        <div>
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2.5">
            <RiFilterLine size={12} className="inline mr-1" />
            Which leads to export
          </p>
          <Radio.Group
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="flex flex-col gap-2"
          >
            <Radio value="filtered" className="text-sm">
              <span className="font-medium">Filtered leads</span>
              <span className="text-slate-400 text-xs ml-1">
                ({leads.length} rows — current view)
              </span>
            </Radio>
            <Radio value="all" className="text-sm">
              <span className="font-medium">All leads</span>
              <span className="text-slate-400 text-xs ml-1">
                ({allLeads.length} rows)
              </span>
            </Radio>
          </Radio.Group>
        </div>

        {/* Format */}
        <div>
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2.5">
            Export format
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => setFormat("csv")}
              className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                format === "csv"
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 hover:border-blue-200"
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <RiFilterLine size={16} className="text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800">CSV File</p>
                <p className="text-[10px] text-slate-500">Download directly</p>
              </div>
              {format === "csv" && (
                <RiCheckboxCircleLine
                  size={16}
                  className="text-blue-500 ml-auto"
                />
              )}
            </button>

            <button
              onClick={() => setFormat("gsheet_csv")}
              className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                format === "gsheet_csv"
                  ? "border-green-500 bg-green-50"
                  : "border-slate-200 hover:border-green-200"
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                <SiGooglesheets size={16} className="text-green-600" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800">
                  Google Sheets
                </p>
                <p className="text-[10px] text-slate-500">CSV + open Sheets</p>
              </div>
              {format === "gsheet_csv" && (
                <RiCheckboxCircleLine
                  size={16}
                  className="text-green-500 ml-auto"
                />
              )}
            </button>
          </div>

          {format === "gsheet_csv" && (
            <div className="mt-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700">
              📋 We'll download the CSV and open Google Sheets. Then use{" "}
              <strong>File → Import</strong> to load your data.
            </div>
          )}
        </div>

        {/* Field picker */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Fields to include
            </p>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setSelectedFields(EXPORT_FIELDS.map((f) => f.key))
                }
                className="text-[10px] text-blue-600 hover:underline cursor-pointer"
              >
                All
              </button>
              <span className="text-slate-300">·</span>
              <button
                onClick={() => setSelectedFields([])}
                className="text-[10px] text-slate-400 hover:underline cursor-pointer"
              >
                None
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {EXPORT_FIELDS.map((field) => (
              <label
                key={field.key}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <Checkbox
                  checked={selectedFields.includes(field.key)}
                  onChange={() => toggleField(field.key)}
                  className="shrink-0"
                />
                <span className="text-xs text-slate-700 font-medium">
                  {field.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ExportModal;
