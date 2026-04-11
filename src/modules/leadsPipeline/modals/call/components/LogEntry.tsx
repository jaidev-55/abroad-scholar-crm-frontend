import React, { useState } from "react";
import {
  RiTimeLine,
  RiCalendarLine,
  RiStarFill,
  RiStarLine,
} from "react-icons/ri";
import { OUTCOME_CONFIG } from "../../../utils/calls/constants";
import type { CallLogEntry, CallRating } from "../../../utils/calls/types";
import { formatDuration, timeAgo } from "../../../utils/calls/helpers";

interface Props {
  log: CallLogEntry;
}

const LogEntry: React.FC<Props> = ({ log }) => {
  const [expanded, setExpanded] = useState(false);
  const cfg = OUTCOME_CONFIG[log.outcome];

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden cursor-pointer hover:border-slate-200 hover:shadow-sm transition-all duration-150"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${cfg.bg} ${cfg.color} ${cfg.border}`}
        >
          <cfg.Icon size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${cfg.badgeCls}`}
            >
              {cfg.label}
            </span>
            {log.duration > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                <RiTimeLine size={10} /> {formatDuration(log.duration)}
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
            <RiCalendarLine size={10} /> {timeAgo(log.date)} · {log.author}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {log.rating && (
            <div className="flex items-center gap-0.5">
              {([1, 2, 3, 4, 5] as CallRating[]).map((s) => (
                <span key={s}>
                  {s <= log.rating! ? (
                    <RiStarFill size={10} className="text-amber-400" />
                  ) : (
                    <RiStarLine size={10} className="text-slate-200" />
                  )}
                </span>
              ))}
            </div>
          )}
          <span className="text-[9px] text-slate-300">
            {expanded ? "▲" : "▼"}
          </span>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-200 ${expanded ? "max-h-40" : "max-h-0"}`}
      >
        <div className="px-4 pb-3 border-t border-slate-50 pt-2.5 space-y-2">
          {log.notes ? (
            <p className="text-[12px] text-slate-600 leading-relaxed">
              {log.notes}
            </p>
          ) : (
            <p className="text-[12px] text-slate-300 italic">
              No notes recorded.
            </p>
          )}
          {log.followUpDate && (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100 w-fit">
              <RiCalendarLine size={10} />
              Follow-up:{" "}
              {new Date(log.followUpDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogEntry;
