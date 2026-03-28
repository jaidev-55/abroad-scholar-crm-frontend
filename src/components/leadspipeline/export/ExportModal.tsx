import { useState } from "react";
import { exportToCSV, exportToPDF } from "./export.utils";
import {
  RiCheckLine,
  RiCloseLine,
  RiDownloadLine,
  RiFileExcelLine,
  RiFilePdfLine,
  RiLeafLine,
} from "react-icons/ri";
import type { Lead } from "../../../types/lead.types";

type ExportFormat = "csv" | "pdf";
type ExportScope = "filtered" | "all";

const ExportModal: React.FC<{
  leads: Lead[];
  allLeads: Lead[];
  onClose: () => void;
}> = ({ leads, allLeads, onClose }) => {
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [scope, setScope] = useState<ExportScope>("filtered");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const count = scope === "filtered" ? leads.length : allLeads.length;
  const exportLeads = scope === "filtered" ? leads : allLeads;

  const handleExport = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    try {
      if (format === "csv") exportToCSV(exportLeads, `leads_${scope}`);
      else exportToPDF(exportLeads, `leads_${scope}`);
      setDone(true);
      setTimeout(() => {
        setDone(false);
        onClose();
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(10,16,40,0.48)",
        backdropFilter: "blur(10px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-3xl w-full overflow-hidden shadow-2xl"
        style={{
          maxWidth: 440,
          animation: "exportSlide 0.22s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Header */}
        <div className="flex bg-blue-50 items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-4 rounded-xl bg-blue-500 flex items-center justify-center">
              <RiDownloadLine size={19} className="text-white" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-slate-900">
                Export Leads
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Download your pipeline data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white border-none bg-transparent cursor-pointer outline-none transition-colors"
          >
            <RiCloseLine size={16} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Format Cards */}
          <div>
            <p className="text-xs font-bold text-slate-600 mb-2.5 uppercase tracking-wide">
              Export Format
            </p>
            <div className="grid grid-cols-2 gap-3">
              {(["csv", "pdf"] as ExportFormat[]).map((f) => {
                const isCSV = f === "csv";
                const active = format === f;
                return (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className="relative flex flex-col items-start gap-2.5 p-4 rounded-2xl border-2 cursor-pointer transition-all text-left"
                    style={{
                      borderColor: active
                        ? isCSV
                          ? "#059669"
                          : "#ef4444"
                        : "#e2e8f0",
                      background: active
                        ? isCSV
                          ? "#ecfdf5"
                          : "#fef2f2"
                        : "#fafafa",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: active
                          ? isCSV
                            ? "#d1fae5"
                            : "#fee2e2"
                          : "#f1f5f9",
                      }}
                    >
                      {isCSV ? (
                        <RiFileExcelLine
                          size={20}
                          color={active ? "#059669" : "#94a3b8"}
                        />
                      ) : (
                        <RiFilePdfLine
                          size={20}
                          color={active ? "#ef4444" : "#94a3b8"}
                        />
                      )}
                    </div>
                    <div>
                      <p
                        className="text-sm font-bold"
                        style={{
                          color: active
                            ? isCSV
                              ? "#059669"
                              : "#ef4444"
                            : "#475569",
                        }}
                      >
                        {isCSV ? "CSV File" : "PDF Report"}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                        {isCSV
                          ? "Spreadsheet-ready data"
                          : "Formatted print report"}
                      </p>
                    </div>
                    {active && (
                      <div
                        className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: isCSV ? "#059669" : "#ef4444" }}
                      >
                        <RiCheckLine size={10} color="white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scope */}
          <div>
            <p className="text-xs font-bold text-slate-600 mb-2.5 uppercase tracking-wide">
              Data Scope
            </p>
            <div className="flex flex-col gap-2">
              {(["filtered", "all"] as ExportScope[]).map((s) => {
                const active = scope === s;
                const cnt = s === "filtered" ? leads.length : allLeads.length;
                return (
                  <button
                    key={s}
                    onClick={() => setScope(s)}
                    className="flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all text-left"
                    style={{
                      borderColor: active ? "#2563eb" : "#e2e8f0",
                      background: active ? "#eff6ff" : "#fafafa",
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                      style={{
                        borderColor: active ? "#2563eb" : "#cbd5e1",
                        background: active ? "#2563eb" : "transparent",
                      }}
                    >
                      {active && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className="text-sm font-semibold"
                        style={{ color: active ? "#1d4ed8" : "#475569" }}
                      >
                        {s === "filtered"
                          ? "Current View (with filters)"
                          : "All Leads"}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {s === "filtered"
                          ? "Exports only filtered results"
                          : "Exports the complete pipeline"}
                      </p>
                    </div>
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-lg"
                      style={{
                        background: active ? "#dbeafe" : "#f1f5f9",
                        color: active ? "#1d4ed8" : "#64748b",
                      }}
                    >
                      {cnt} leads
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-2 px-3.5 py-3 bg-slate-50 rounded-xl border border-slate-100">
            <RiLeafLine size={13} color="#64748b" />
            <p className="text-xs text-slate-500">
              Exporting{" "}
              <strong className="text-slate-700">{count} leads</strong> as{" "}
              <strong className="text-slate-700">{format.toUpperCase()}</strong>
              {format === "pdf" && " · Opens browser print dialog"}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-2xl text-sm font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 border-none cursor-pointer transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={loading || done}
            className="flex-[2] flex items-center justify-center gap-2 py-2.5 rounded-2xl text-white text-sm font-bold border-none cursor-pointer transition-all active:scale-95 disabled:opacity-80"
            style={{
              background: done
                ? "linear-gradient(135deg,#059669,#047857)"
                : "linear-gradient(135deg,#2563eb,#1d4ed8)",
              boxShadow: "0 6px 18px rgba(37,99,235,0.3)",
            }}
          >
            {done ? (
              <>
                <RiCheckLine size={16} /> Exported!
              </>
            ) : loading ? (
              <>
                <span
                  style={{
                    display: "inline-block",
                    animation: "spin 1s linear infinite",
                  }}
                >
                  <RiDownloadLine size={16} />
                </span>{" "}
                Preparing…
              </>
            ) : (
              <>
                <RiDownloadLine size={16} /> Export {format.toUpperCase()}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ExportModal;
