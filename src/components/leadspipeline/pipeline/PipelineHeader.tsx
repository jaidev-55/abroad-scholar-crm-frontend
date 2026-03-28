import React from "react";
import { RiAddLine } from "react-icons/ri";

interface Props {
  onAddLead: () => void;
}

const PipelineHeader: React.FC<Props> = ({ onAddLead }) => {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Lead Pipeline
        </h2>
        <p className="text-sm text-slate-400 mt-0.5">
          Student CRM Dashboard — track, manage & convert leads
        </p>
      </div>

      <button
        onClick={onAddLead}
        className="flex items-center gap-1.5 bg-blue-600 text-white border-none rounded-xl px-4 py-2 text-[13px] font-bold cursor-pointer shadow-sm shadow-blue-200 hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
      >
        <RiAddLine size={16} /> Add Lead
      </button>
    </div>
  );
};

export default PipelineHeader;
