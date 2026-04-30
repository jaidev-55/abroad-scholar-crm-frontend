import React from "react";
import { RiAddLine, RiRefreshLine, RiUploadCloud2Line } from "react-icons/ri";

interface PipelineHeaderProps {
  onAddLead: () => void;
  onImport?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const PipelineHeader: React.FC<PipelineHeaderProps> = ({
  onAddLead,
  onImport,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Lead Pipeline</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Student CRM Dashboard — track, manage &amp; convert leads
        </p>
      </div>

      <div className="flex items-center gap-2">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <RiRefreshLine
              size={16}
              className={isRefreshing ? "animate-spin" : ""}
            />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        )}
        {/* Import button */}
        {onImport && (
          <button
            onClick={onImport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:border-green-400 hover:text-green-600 hover:bg-green-50 transition-all cursor-pointer"
          >
            <RiUploadCloud2Line size={16} />
            Import
          </button>
        )}

        {/* Add Lead button */}
        <button
          onClick={onAddLead}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer shadow-sm shadow-blue-200"
        >
          <RiAddLine size={16} />
          Add Lead
        </button>
      </div>
    </div>
  );
};

export default PipelineHeader;
