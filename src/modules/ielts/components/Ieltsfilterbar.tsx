import React, { useState } from "react";
import { Input, Select } from "antd";
import { RiSearchLine, RiFilter3Line, RiArrowUpSLine } from "react-icons/ri";
import type { IeltsFilters } from "../Types";
import { STATUS_OPTIONS, COUNTRY_OPTIONS } from "../Types/Constants";


interface FilterBarProps {
  filters: IeltsFilters;
  onFilterChange: (key: keyof IeltsFilters, value: string) => void;
  counselorOptions: { value: string; label: string }[];
  totalCount: number;
  filteredCount: number;
}

const IeltsFilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  counselorOptions,
  totalCount,
  filteredCount,
}) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      {/* Toggle header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <RiFilter3Line size={15} className="text-slate-400" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Filters
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-400">
            {filteredCount} of {totalCount} students
          </span>
          <RiArrowUpSLine
            size={16}
            className={`text-slate-400 transition-transform duration-200 ${
              open ? "" : "rotate-180"
            }`}
          />
        </div>
      </button>

      {/* Filter fields */}
      {open && (
        <div className="px-5 pb-4 pt-1 border-t border-slate-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Search
              </label>
              <Input
                prefix={<RiSearchLine size={14} className="text-slate-300" />}
                placeholder="Student name..."
                size="middle"
                value={filters.search}
                onChange={(e) => onFilterChange("search", e.target.value)}
                allowClear
                className="rounded-lg"
              />
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Status
              </label>
              <Select
                className="w-full"
                size="middle"
                value={filters.status}
                onChange={(v) => onFilterChange("status", v)}
                options={STATUS_OPTIONS}
                placeholder="All Statuses"
              />
            </div>

            {/* Counselor */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Counselor
              </label>
              <Select
                className="w-full"
                size="middle"
                value={filters.counselor}
                onChange={(v) => onFilterChange("counselor", v)}
                options={[
                  { value: "", label: "All Counselors" },
                  ...counselorOptions,
                ]}
                placeholder="All Counselors"
              />
            </div>

            {/* Country */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Country
              </label>
              <Select
                className="w-full"
                size="middle"
                value={filters.country}
                onChange={(v) => onFilterChange("country", v)}
                options={COUNTRY_OPTIONS}
                placeholder="All Countries"
              />
            </div>

            {/* Exam Type */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Exam Type
              </label>
              <Select
                className="w-full"
                size="middle"
                value={filters.examType}
                onChange={(v) => onFilterChange("examType", v)}
                options={[
                  { value: "", label: "All Types" },
                  { value: "Academic", label: "Academic" },
                  { value: "General Training", label: "General Training" },
                ]}
                placeholder="All Types"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IeltsFilterBar;
