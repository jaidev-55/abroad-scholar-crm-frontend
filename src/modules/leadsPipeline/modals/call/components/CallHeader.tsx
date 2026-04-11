import React from "react";
import {
  RiPhoneFill,
  RiHistoryLine,
  RiArrowLeftLine,
  RiCloseLine,
} from "react-icons/ri";
import type { CallStatus } from "../../../utils/calls/types";

interface Props {
  leadName: string;
  status: CallStatus;
  view: "call" | "history";
  totalCalls: number;
  logsLoading: boolean;
  onToggleView: () => void;
  onClose: () => void;
}

const STATUS_LABEL: Record<CallStatus, string> = {
  idle: "Call Student",
  calling: "Calling…",
  connected: "Live Call",
  logging: "Log This Call",
  done: "Call Logged ✓",
};

const CallHeader: React.FC<Props> = ({
  leadName,
  status,
  view,
  totalCalls,
  logsLoading,
  onToggleView,
  onClose,
}) => (
  <div className="flex items-center justify-between px-5 pt-4 pb-3 shrink-0 border-b border-slate-100">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
        <RiPhoneFill size={14} className="text-emerald-600" />
      </div>
      <div>
        <p className="text-[13px] font-bold text-slate-800 leading-tight">
          {STATUS_LABEL[status]}
        </p>
        <p className="text-[10px] text-slate-400 leading-tight">{leadName}</p>
      </div>
    </div>

    <div className="flex items-center gap-1.5">
      {(status === "idle" || status === "done") && (
        <button
          onClick={onToggleView}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 cursor-pointer outline-none transition-all"
        >
          {view === "history" ? (
            <>
              <RiArrowLeftLine size={11} /> Back
            </>
          ) : (
            <>
              <RiHistoryLine size={11} /> History
              <span className="bg-slate-200 text-slate-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-0.5">
                {logsLoading ? "…" : totalCalls}
              </span>
            </>
          )}
        </button>
      )}
      <button
        onClick={onClose}
        className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 border-none bg-transparent cursor-pointer outline-none transition-all"
      >
        <RiCloseLine size={16} />
      </button>
    </div>
  </div>
);

export default CallHeader;
