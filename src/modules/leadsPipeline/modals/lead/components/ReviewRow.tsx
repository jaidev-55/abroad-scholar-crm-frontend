import React from "react";

interface Props {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const ReviewRow: React.FC<Props> = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
    <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 text-slate-400">
      {icon}
    </div>
    <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide shrink-0">
        {label}
      </span>
      <span className="text-[13px] font-semibold text-slate-700 truncate text-right">
        {value || <span className="text-slate-300 font-normal">—</span>}
      </span>
    </div>
  </div>
);

export default ReviewRow;
