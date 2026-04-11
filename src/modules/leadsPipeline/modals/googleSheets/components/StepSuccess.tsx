import React from "react";
import {
  RiCheckboxCircleLine,
  RiCheckLine,
  RiErrorWarningLine,
} from "react-icons/ri";
import type { ImportResult } from "../../../utils/types";

interface Props {
  result: ImportResult;
  apiErrors?: string[];
  onClose: () => void;
}

const StepSuccess: React.FC<Props> = ({ result, apiErrors = [], onClose }) => {
  const allFailed = result.success === 0 && result.failed > 0;

  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-5">
      <div className="relative">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center ${
            allFailed ? "bg-red-100" : "bg-green-100"
          }`}
        >
          {allFailed ? (
            <RiErrorWarningLine size={44} className="text-red-500" />
          ) : (
            <RiCheckboxCircleLine size={44} className="text-green-500" />
          )}
        </div>
        {!allFailed && (
          <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping" />
        )}
      </div>

      <div className="text-center space-y-1">
        <p className="text-xl font-black text-slate-800">
          {allFailed ? "Import Failed" : "Import Complete!"}
        </p>
        <p className="text-sm text-slate-500">
          <span
            className={`font-bold text-base ${allFailed ? "text-red-500" : "text-green-600"}`}
          >
            {result.success}
          </span>{" "}
          lead{result.success !== 1 ? "s" : ""} imported successfully
        </p>
        {result.failed > 0 && (
          <p className="text-xs text-red-500">
            {result.failed} row{result.failed > 1 ? "s" : ""} skipped
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <div
          className={`flex flex-col items-center px-5 py-3 rounded-2xl border ${
            allFailed
              ? "bg-slate-50 border-slate-200"
              : "bg-green-50 border-green-200"
          }`}
        >
          <span
            className={`text-2xl font-black ${allFailed ? "text-slate-400" : "text-green-700"}`}
          >
            {result.success}
          </span>
          <span
            className={`text-[11px] font-semibold ${allFailed ? "text-slate-400" : "text-green-600"}`}
          >
            Imported
          </span>
        </div>
        {result.failed > 0 && (
          <div className="flex flex-col items-center px-5 py-3 bg-red-50 border border-red-200 rounded-2xl">
            <span className="text-2xl font-black text-red-600">
              {result.failed}
            </span>
            <span className="text-[11px] text-red-500 font-semibold">
              Skipped
            </span>
          </div>
        )}
      </div>

      {/* API error details — show up to 3 */}
      {apiErrors.length > 0 && (
        <div className="w-full bg-red-50 border border-red-200 rounded-xl p-3.5 space-y-1.5 max-h-36 overflow-y-auto">
          <p className="text-[11px] font-bold text-red-700 flex items-center gap-1.5 mb-2">
            <RiErrorWarningLine size={13} /> API errors ({apiErrors.length})
          </p>
          {apiErrors.slice(0, 5).map((err, i) => (
            <p
              key={i}
              className="text-[11px] text-red-600 bg-white px-2.5 py-1.5 rounded-lg border border-red-100"
            >
              {err}
            </p>
          ))}
          {apiErrors.length > 5 && (
            <p className="text-[10px] text-red-400 text-center">
              + {apiErrors.length - 5} more errors
            </p>
          )}
        </div>
      )}

      <button
        onClick={onClose}
        className={`flex items-center gap-2 px-8 py-3 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer shadow-lg ${
          allFailed
            ? "bg-slate-600 hover:bg-slate-700 shadow-slate-200"
            : "bg-green-600 hover:bg-green-700 shadow-green-200"
        }`}
      >
        <RiCheckLine size={16} /> {allFailed ? "Close" : "Done"}
      </button>
    </div>
  );
};

export default StepSuccess;
