import React, { useState } from "react";
import { Modal, Checkbox, Radio, message } from "antd";
import {
  RiDownloadLine,
  RiCloseLine,
  RiFilterLine,
  RiCheckboxCircleLine,
  RiFileTextLine,
} from "react-icons/ri";
import { SiGooglesheets } from "react-icons/si";
import { generateLeadsPDF } from "../pdf/pdfGenerator";
import PdfPreviewCard from "../pdf/PdfPreviewCard";

type ExportFormat = "csv" | "gsheet_csv" | "pdf";
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

// ─── CSV builder ──────────────────────────────────────────────
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
      if (val.includes(",") || val.includes('"') || val.includes("\n")) {
        val = `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    }),
  );

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
};

const downloadCSV = (content: string, filename: string) => {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const exportToGoogleSheets = (csvContent: string, filename: string) => {
  downloadCSV(csvContent, filename);
  setTimeout(() => {
    window.open("https://sheets.new", "_blank");
    message.info(
      "CSV downloaded! In Google Sheets: File → Import → Upload the CSV",
      6,
    );
  }, 500);
};

// ─── Format option metadata
const FORMAT_OPTIONS: {
  value: ExportFormat;
  label: string;
  desc: string;
  icon: React.ElementType;
  color: string;
}[] = [
  {
    value: "csv",
    label: "CSV File",
    desc: "Download directly",
    icon: RiFilterLine,
    color: "blue",
  },
  {
    value: "gsheet_csv",
    label: "Google Sheets",
    desc: "CSV + open Sheets",
    icon: SiGooglesheets,
    color: "green",
  },
  {
    value: "pdf",
    label: "PDF Report",
    desc: "Branded & print-ready",
    icon: RiFileTextLine,
    color: "rose",
  },
];

const colorClassMap: Record<
  string,
  {
    border: string;
    bg: string;
    iconBg: string;
    iconText: string;
    check: string;
    hoverBorder: string;
  }
> = {
  blue: {
    border: "border-blue-500",
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
    check: "text-blue-500",
    hoverBorder: "hover:border-blue-200",
  },
  green: {
    border: "border-green-500",
    bg: "bg-green-50",
    iconBg: "bg-green-100",
    iconText: "text-green-600",
    check: "text-green-500",
    hoverBorder: "hover:border-green-200",
  },
  rose: {
    border: "border-rose-500",
    bg: "bg-rose-50",
    iconBg: "bg-rose-100",
    iconText: "text-rose-600",
    check: "text-rose-500",
    hoverBorder: "hover:border-rose-200",
  },
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
      if (format === "pdf") {
        const activeFields = EXPORT_FIELDS.filter((f) =>
          selectedFields.includes(f.key),
        ).map((f) => ({ key: f.key, label: f.label }));
        generateLeadsPDF(targetLeads, activeFields, filename, {
          title: "Leads Export Report",
          subtitle: "Abroad Scholar CRM",
        });
        message.success(`Exported ${targetLeads.length} leads as PDF!`);
      } else {
        const csv = buildCSV(targetLeads, selectedFields);
        if (format === "gsheet_csv") {
          exportToGoogleSheets(csv, `${filename}.csv`);
        } else {
          downloadCSV(csv, `${filename}.csv`);
          message.success(`Exported ${targetLeads.length} leads!`);
        }
      }
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      message.error("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const activeFormat = FORMAT_OPTIONS.find((f) => f.value === format)!;
  const ActiveIcon = activeFormat.icon;

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
              <ActiveIcon size={14} />
              {exporting ? "Exporting…" : "Export"}
            </button>
          </div>
        </div>
      }
      width={560}
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

        {/* Format — now 3 columns */}
        <div>
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2.5">
            Export format
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            {FORMAT_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const c = colorClassMap[opt.color];
              const active = format === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setFormat(opt.value)}
                  className={`flex flex-col items-start gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    active
                      ? `${c.border} ${c.bg}`
                      : `border-slate-200 ${c.hoverBorder}`
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div
                      className={`w-8 h-8 rounded-lg ${c.iconBg} flex items-center justify-center shrink-0`}
                    >
                      <Icon size={16} className={c.iconText} />
                    </div>
                    {active && (
                      <RiCheckboxCircleLine size={16} className={c.check} />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800">
                      {opt.label}
                    </p>
                    <p className="text-[10px] text-slate-500">{opt.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {format === "gsheet_csv" && (
            <div className="mt-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700">
              📋 We'll download the CSV and open Google Sheets. Then use{" "}
              <strong>File → Import</strong> to load your data.
            </div>
          )}

          {format === "pdf" && (
            <PdfPreviewCard
              recordCount={targetLeads.length}
              fieldCount={selectedFields.length}
            />
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
