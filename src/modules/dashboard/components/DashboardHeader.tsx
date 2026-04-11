import React from "react";
import { HiOutlineRefresh, HiOutlineDownload } from "react-icons/hi";

interface Props {
  onRefresh: () => void;
  onExport: () => void;
}

const DashboardHeader: React.FC<Props> = ({ onRefresh, onExport }) => (
  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold text-slate-900">Dashboard Overview</h2>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
          LIVE
        </span>
      </div>
      <p className="text-sm text-slate-500">
        Track performance, conversions and counselor activity
      </p>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={onRefresh}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        <HiOutlineRefresh className="h-4 w-4" /> Refresh
      </button>
      <button
        onClick={onExport}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        <HiOutlineDownload className="h-4 w-4" /> Export
      </button>
    </div>
  </div>
);

export default DashboardHeader;
