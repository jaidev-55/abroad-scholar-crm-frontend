import React from "react";
import type { IeltsStatus } from "../Types";
import { IELTS_STATUS_CONFIG } from "../Types/Constants";

const IeltsStatusTag: React.FC<{ status: IeltsStatus }> = ({ status }) => {
  const c = IELTS_STATUS_CONFIG[status];
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
