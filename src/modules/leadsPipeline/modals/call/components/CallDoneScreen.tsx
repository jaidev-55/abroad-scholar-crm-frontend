import React from "react";
import { RiCheckboxCircleLine, RiCalendarLine } from "react-icons/ri";
import type { Dayjs } from "dayjs";
import type { CallOutcome, Lead } from "../../../utils/calls/types";
import { OUTCOME_CONFIG } from "../../../utils/calls/constants";
import { formatDuration } from "../../../utils/calls/helpers";

interface Props {
  lead: Lead;
  outcome: CallOutcome | null;
  finalDuration: number;
  followUpDateValue: Dayjs | null;
}

const CallDoneScreen: React.FC<Props> = ({
  lead,
  outcome,
  finalDuration,
  followUpDateValue,
}) => (
  <div
    className="flex flex-col items-center justify-center px-6 pb-10 pt-6"
    style={{ animation: "fadeSlide 0.22s ease" }}
  >
    <div className="w-20 h-20 rounded-full bg-emerald-50 ring-8 ring-emerald-100 flex items-center justify-center mb-4">
      <RiCheckboxCircleLine size={42} className="text-emerald-500" />
    </div>
    <h3 className="text-[16px] font-bold text-slate-900">Call Logged!</h3>
    <p className="text-[12px] text-slate-400 mt-1.5 text-center leading-relaxed">
      Saved to {lead.name}'s activity history
    </p>

    {outcome &&
      (() => {
        const cfg = OUTCOME_CONFIG[outcome];
        return (
          <div
            className={`mt-5 flex items-center gap-2 px-4 py-2.5 rounded-2xl border ${cfg.bg} ${cfg.border} ${cfg.color}`}
          >
            <cfg.Icon size={14} />
            <span className="text-[12px] font-bold">{cfg.label}</span>
            {finalDuration > 0 && (
              <span className="text-[11px] opacity-60">
                · {formatDuration(finalDuration)}
              </span>
            )}
          </div>
        );
      })()}

    {followUpDateValue && (
      <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
        <RiCalendarLine size={11} />
        Follow-up: {(followUpDateValue as Dayjs).format("MMM D, YYYY")}
        {outcome === "callback" &&
          ` at ${(followUpDateValue as Dayjs).format("h:mm A")}`}
      </div>
    )}
  </div>
);

export default CallDoneScreen;
