import React from "react";
import type { IeltsRecord } from "../api/ielts";

type IeltsStatus = IeltsRecord["status"];

const IELTS_STATUS_CONFIG: Record<
  IeltsStatus,
  { tw: string; dot: string; label: string }
> = {
  NOT_STARTED: {
    tw: "bg-slate-100 text-slate-500",
    dot: "bg-slate-400",
    label: "Not Started",
  },
  PREPARING: {
    tw: "bg-amber-50 text-amber-600",
    dot: "bg-amber-400",
    label: "Preparing",
  },
  SCHEDULED: {
    tw: "bg-blue-50 text-blue-600",
    dot: "bg-blue-400",
    label: "Scheduled",
  },
  COMPLETED: {
    tw: "bg-emerald-50 text-emerald-600",
    dot: "bg-emerald-400",
    label: "Completed",
  },
  CANCELLED: {
    tw: "bg-red-50 text-red-500",
    dot: "bg-red-400",
    label: "Cancelled",
  },
};

const IeltsStatusTag: React.FC<{ status: IeltsStatus }> = ({ status }) => {
  const c = IELTS_STATUS_CONFIG[status] ?? IELTS_STATUS_CONFIG.NOT_STARTED;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${c.tw}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
};

export default IeltsStatusTag;
