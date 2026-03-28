import {
  RiArrowDownSLine,
  RiDownloadLine,
  RiFilter3Line,
  RiRefreshLine,
  RiSearchLine,
} from "react-icons/ri";
import { useState } from "react";
import { COUNSELORS, COUNTRIES, PRIORITIES, SOURCES } from "../constants";
import CustomDatePicker from "../../common/CustomDatePicker";
import CustomInput from "../../common/CustomInput";
import CustomSelect from "../../common/CustomSelect";
import { useForm } from "react-hook-form";

interface FilterBarProps {
  filteredCount: number;
  totalCount: number;
  clearFilters: () => void;
  hasFilters: boolean;
  onExport: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filteredCount,
  totalCount,
  clearFilters,
  hasFilters,
  onExport,
}) => {
  const [showFilters, setShowFilters] = useState(true);
  const {
    control,
    formState: { errors },
  } = useForm({});

  return (
    <div className="bg-white w-full rounded-2xl border border-slate-100 p-4">
      {/* Header */}
      <div
        className={`flex w-full justify-between items-center ${
          showFilters ? "mb-3.5" : ""
        }`}
      >
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-700 hover:text-slate-900 transition-colors"
          >
            <RiFilter3Line size={15} className="text-blue-600" />
            Filters
            <RiArrowDownSLine
              size={14}
              className={`transition-transform duration-200 ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              <RiRefreshLine size={11} />
              Clear All
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">
            {filteredCount} of {totalCount} leads
          </span>

          <button
            type="button"
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all text-xs font-semibold"
          >
            <RiDownloadLine size={13} />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}

      {showFilters && (
        <div className="flex w-full gap-2 items-end">
          {" "}
          {/* ← items-center → items-end */}
          <div className="flex-1 min-w-0">
            <CustomInput
              name="search"
              label="Search"
              placeholder="Search by name or phone…"
              control={control}
              icon={<RiSearchLine size={14} className="text-slate-400" />}
            />
          </div>
          <div className="flex-1 min-w-0">
            <CustomSelect
              name="source"
              label="Source"
              placeholder="Source"
              control={control}
              errors={errors}
              options={SOURCES.map((s) => ({ value: s, label: s }))}
            />
          </div>
          <div className="flex-1 min-w-0">
            <CustomSelect
              name="counselor"
              label="Counselor"
              placeholder="Counselor"
              control={control}
              errors={errors}
              options={COUNSELORS.map((c) => ({ value: c, label: c }))}
            />
          </div>
          <div className="flex-1 min-w-0">
            <CustomSelect
              name="country"
              label="Country"
              placeholder="Country"
              control={control}
              errors={errors}
              options={COUNTRIES.map((c) => ({ value: c, label: c }))}
            />
          </div>
          <div className="flex-1 min-w-0">
            <CustomSelect
              name="priority"
              label="Priority"
              placeholder="Priority"
              control={control}
              errors={errors}
              options={PRIORITIES.map((p) => ({ value: p, label: p }))}
            />
          </div>
          <div className="flex-[1.5] min-w-0">
            <CustomDatePicker
              name="dateRange"
              label="Date Range"
              control={control}
              errors={errors}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
