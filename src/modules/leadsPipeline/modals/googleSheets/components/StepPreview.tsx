import React from "react";
import {
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiAlertLine,
  RiInformationLine,
} from "react-icons/ri";
import type { ImportedRow } from "../../../utils/types";

interface Props {
  previewRows: ImportedRow[];
  showSkipped: boolean;
  onToggleSkipped: (v: boolean) => void;
}

const StepPreview: React.FC<Props> = ({
  previewRows,
  showSkipped,
  onToggleSkipped,
}) => {
  const validRows = previewRows.filter((r) => r.valid);
  const invalidRows = previewRows.filter((r) => !r.valid);
  const activeRows = showSkipped ? invalidRows : validRows;

  const skipReasonMap = invalidRows.reduce<Record<string, number>>(
    (acc, row) => {
      row.errors.forEach((e) => {
        acc[e] = (acc[e] ?? 0) + 1;
      });
      return acc;
    },
    {},
  );

  return (
    <div className="space-y-3">
      {/* Tab switcher */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
        <button
          onClick={() => onToggleSkipped(false)}
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
          {validRows.length} Ready to Import
        </button>
        {invalidRows.length > 0 && (
          <button
            onClick={() => onToggleSkipped(true)}
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
            {invalidRows.length} Skipped — Why?
          </button>
        )}
      </div>

      {/* Skip reason breakdown */}
      {showSkipped && invalidRows.length > 0 && (
        <div className="rounded-xl border border-red-200 overflow-hidden">
          <div className="bg-red-50 px-3.5 py-2.5 border-b border-red-200">
            <p className="text-[11px] font-bold text-red-800 uppercase tracking-wider flex items-center gap-1.5">
              <RiAlertLine size={12} /> Reasons these {invalidRows.length} rows
              were skipped
            </p>
          </div>
          <div className="divide-y divide-red-100">
            {Object.entries(skipReasonMap).map(([reason, count]) => {
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
                  <div className="pl-5 space-y-1">
                    {exampleRows.map((row) => (
                      <div
                        key={row.rowIndex}
                        className="flex items-center gap-2 text-[11px] text-slate-500"
                      >
                        <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0">
                          row {row.rowIndex}
                        </span>
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
          <div className="bg-amber-50 border-t border-amber-200 px-3.5 py-2.5">
            <p className="text-[11px] text-amber-700 font-medium flex items-start gap-1.5">
              <RiInformationLine
                size={13}
                className="text-amber-500 shrink-0 mt-0.5"
              />
              <span>
                To fix: go <strong>Back → Map Columns</strong> and ensure
                required fields are correctly mapped.
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Row list */}
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
                  {row.mapped.fullName ?? (
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

export default StepPreview;
