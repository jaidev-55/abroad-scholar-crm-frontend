// components/googleSheets/components/StepPreview.tsx
// Shows valid leads in tab 1, and rows with validation ERRORS (not skipped) in tab 2

import React, { useState } from "react";
import {
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiInformationLine,
} from "react-icons/ri";
import type { ImportedRow } from "../../../utils/types";

interface StepPreviewProps {
  // Pass ALL rows (skipped ones already filtered out by the modal)
  previewRows: ImportedRow[];
  // Legacy props kept for compatibility — no longer used internally
  showSkipped: boolean;
  onToggleSkipped: (v: boolean) => void;
}

const StepPreview: React.FC<StepPreviewProps> = ({ previewRows }) => {
  const [activeTab, setActiveTab] = useState<"valid" | "errors">("valid");

  const validRows = previewRows.filter((r) => r.valid && !r.skipReason);
  const errorRows = previewRows.filter((r) => !r.valid && !r.skipReason);

  return (
    <div className="space-y-3">
      {/* ── Tab switcher ───────────────────────────────────────────────── */}
      <div className="flex rounded-xl overflow-hidden border border-slate-200 text-sm font-semibold">
        <button
          onClick={() => setActiveTab("valid")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 transition-colors cursor-pointer ${
            activeTab === "valid"
              ? "bg-green-600 text-white"
              : "bg-white text-slate-500 hover:bg-slate-50"
          }`}
        >
          <RiCheckboxCircleLine size={15} />
          {validRows.length} Ready to Import
        </button>
        <button
          onClick={() => setActiveTab("errors")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 transition-colors cursor-pointer ${
            activeTab === "errors"
              ? "bg-red-500 text-white"
              : "bg-white text-slate-500 hover:bg-slate-50"
          }`}
        >
          <RiErrorWarningLine size={15} />
          {errorRows.length} Skipped — Why?
        </button>
      </div>

      {/* ── Valid rows ─────────────────────────────────────────────────── */}
      {activeTab === "valid" && (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {validRows.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              No valid rows found
            </div>
          ) : (
            validRows.map((row) => (
              <div
                key={row.rowIndex}
                className="flex items-center justify-between px-3.5 py-3 bg-green-50/60 border border-green-100 rounded-xl"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <RiCheckboxCircleLine
                    size={15}
                    className="text-green-500 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {row.mapped.fullName}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      {row.mapped.source && (
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase">
                          {row.mapped.source}
                        </span>
                      )}
                      {row.mapped.priority && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            row.mapped.priority === "HOT"
                              ? "bg-red-50 text-red-500"
                              : row.mapped.priority === "WARM"
                                ? "bg-amber-50 text-amber-500"
                                : "bg-blue-50 text-blue-500"
                          }`}
                        >
                          {row.mapped.priority}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-xs font-mono text-slate-600">
                    {row.mapped.phone}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    row {row.rowIndex}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Error rows ─────────────────────────────────────────────────── */}
      {activeTab === "errors" && (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {errorRows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2 text-slate-400">
              <RiCheckboxCircleLine size={28} className="text-green-400" />
              <p className="text-sm font-medium">No validation errors!</p>
              <p className="text-xs">All non-skipped rows passed validation.</p>
            </div>
          ) : (
            <>
              <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">
                <RiInformationLine size={14} className="shrink-0 mt-0.5" />
                <span>
                  These rows have missing or invalid required fields and will
                  not be imported. Fix them in the sheet and re-import.
                </span>
              </div>
              {errorRows.map((row) => (
                <div
                  key={row.rowIndex}
                  className="px-3.5 py-3 bg-red-50/60 border border-red-100 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <RiErrorWarningLine
                        size={14}
                        className="text-red-500 shrink-0"
                      />
                      <p className="text-sm font-semibold text-slate-700">
                        {row.mapped.fullName ?? (
                          <span className="italic text-slate-400">No name</span>
                        )}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      row {row.rowIndex}
                    </span>
                  </div>
                  {/* Show each validation error */}
                  <ul className="space-y-1 pl-5">
                    {row.errors.map((err, i) => (
                      <li
                        key={i}
                        className="text-xs text-red-600 flex items-center gap-1.5"
                      >
                        <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                        {err}
                      </li>
                    ))}
                  </ul>
                  {/* Raw values for debugging */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {Object.entries(row.raw)
                      .filter(([, v]) => v)
                      .slice(0, 4)
                      .map(([k, v]) => (
                        <span
                          key={k}
                          className="text-[10px] bg-white border border-red-100 text-slate-500 px-1.5 py-0.5 rounded"
                        >
                          {k}: {v.slice(0, 20)}
                        </span>
                      ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StepPreview;
