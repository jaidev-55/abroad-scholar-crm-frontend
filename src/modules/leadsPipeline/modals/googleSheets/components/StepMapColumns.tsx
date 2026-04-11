import React from "react";
import {
  RiCheckboxCircleLine,
  RiAlertLine,
  RiTableLine,
  RiArrowRightSLine,
} from "react-icons/ri";
import { EXPECTED_COLUMNS } from "../../../utils/csvParser";

interface Props {
  csvHeaders: string[];
  csvRows: string[][];
  colMap: Record<string, string>;
  detectedGid: string | null;
  onColMapChange: (map: Record<string, string>) => void;
}

const StepMapColumns: React.FC<Props> = ({
  csvHeaders,
  csvRows,
  colMap,
  detectedGid,
  onColMapChange,
}) => {
  const requiredMapped = EXPECTED_COLUMNS.filter((c) => c.required).every((c) =>
    Object.values(colMap).includes(c.key),
  );

  return (
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
                onColMapChange(
                  v
                    ? { ...colMap, [header]: v }
                    : Object.fromEntries(
                        Object.entries(colMap).filter(([k]) => k !== header),
                      ),
                );
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
};

export default StepMapColumns;
