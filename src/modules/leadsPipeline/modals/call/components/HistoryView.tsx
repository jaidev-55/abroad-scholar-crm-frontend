import React from "react";
import { RiLoader4Line, RiHistoryLine } from "react-icons/ri";
import LogEntry from "./LogEntry";
import type { CallLogEntry } from "../../../utils/calls/types";
import type { CallOutcomeApi } from "../../../api/leads";
import { formatDuration } from "../../../utils/calls/helpers";
import { API_TO_OUTCOME, OUTCOME_CONFIG } from "../../../utils/calls/constants";

interface Props {
  logs: CallLogEntry[];
  logsLoading: boolean;
  totalCalls: number;
  avgDuration: number;
  conversions: number;
  outcomeCounts: Partial<Record<CallOutcomeApi, number>>;
}

const HistoryView: React.FC<Props> = ({
  logs,
  logsLoading,
  totalCalls,
  avgDuration,
  conversions,
  outcomeCounts,
}) => (
  <div
    className="flex flex-col overflow-hidden flex-1 min-h-0"
    style={{ animation: "fadeSlide 0.15s ease" }}
  >
    {/* Stats */}
    <div className="px-5 pt-4 pb-3 shrink-0">
      <div className="grid grid-cols-3 gap-2">
        {[
          {
            label: "Total Calls",
            value: logsLoading ? "…" : totalCalls,
            cls: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Avg Duration",
            value: logsLoading ? "…" : formatDuration(avgDuration),
            cls: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Conversions",
            value: logsLoading ? "…" : conversions,
            cls: "text-amber-600",
            bg: "bg-amber-50",
          },
        ].map(({ label, value, cls, bg }) => (
          <div
            key={label}
            className={`${bg} rounded-2xl p-3 text-center border border-slate-100`}
          >
            <p className={`text-lg font-extrabold leading-none ${cls}`}>
              {value}
            </p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* Outcome breakdown */}
    <div className="px-5 pb-3 shrink-0">
      <div className="flex gap-1.5 flex-wrap">
        {(Object.entries(outcomeCounts) as [CallOutcomeApi, number][]).map(
          ([apiKey, count]) => {
            const localKey = API_TO_OUTCOME[apiKey];
            if (!localKey || !count) return null;
            const cfg = OUTCOME_CONFIG[localKey];
            return (
              <span
                key={apiKey}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border ${cfg.bg} ${cfg.color} ${cfg.border}`}
              >
                <cfg.Icon size={10} /> {cfg.label} · {count}
              </span>
            );
          },
        )}
      </div>
    </div>

    {/* Log list */}
    <div
      className="flex-1 overflow-y-auto px-5 pb-5 flex flex-col gap-2.5"
      style={{ scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent" }}
    >
      {logsLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <RiLoader4Line
            size={24}
            className="animate-spin text-slate-300 mb-3"
          />
          <p className="text-[12px] text-slate-400">Loading call history…</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
            <RiHistoryLine size={22} className="text-slate-300" />
          </div>
          <p className="text-[13px] font-semibold text-slate-400">
            No call history yet
          </p>
          <p className="text-[11px] text-slate-300 mt-1">
            Logs will appear after calls
          </p>
        </div>
      ) : (
        logs.map((log) => <LogEntry key={log.id} log={log} />)
      )}
    </div>
  </div>
);

export default HistoryView;
