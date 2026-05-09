import {
  RiArrowDownSLine,
  RiBookOpenLine,
  RiBuilding2Line,
  RiDownloadLine,
  RiFilter3Line,
  RiRefreshLine,
  RiSearchLine,
  RiUserSmileLine,
  RiBarChartBoxLine,
  RiFileList3Line,
  RiPhoneLine,
} from "react-icons/ri";
import { useState } from "react";
import { useForm } from "react-hook-form";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import CustomDatePicker from "../../../components/common/CustomDatePicker";
import type { DateRangeValue } from "../../../types/lead";
import {
  COUNTRIES,
  PRIORITIES,
  SOURCES,
} from "../../leadsPipeline/utils/constants";

const STATUSES = [
  { value: "NEW", label: "New" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "CONVERTED", label: "Converted" },
  { value: "LOST", label: "Lost" },
];

const CATEGORIES = [
  {
    value: "ACADEMIC",
    label: (
      <span className="flex items-center gap-1.5">
        <RiBookOpenLine size={13} className="text-violet-500" />
        Academic
      </span>
    ),
  },
  {
    value: "ADMISSION",
    label: (
      <span className="flex items-center gap-1.5">
        <RiBuilding2Line size={13} className="text-blue-500" />
        Admission
      </span>
    ),
  },
];

const PIPELINE_STATUSES = [
  {
    value: "",
    label: "All",
  },

  {
    value: "COUNSELLING_COMPLETED",
    label: (
      <span className="flex items-center gap-1.5">
        <RiUserSmileLine size={13} className="text-emerald-500" />
        Counselling Completed
      </span>
    ),
  },
  {
    value: "FOLLOW_UP",
    label: (
      <span className="flex items-center gap-1.5">
        <RiRefreshLine size={13} className="text-blue-500" />
        Follow-Up
      </span>
    ),
  },
  {
    value: "ACTIVE_PIPELINE",
    label: (
      <span className="flex items-center gap-1.5">
        <RiBarChartBoxLine size={13} className="text-violet-500" />
        Active Pipeline
      </span>
    ),
  },
  {
    value: "DOCS_PENDING",
    label: (
      <span className="flex items-center gap-1.5">
        <RiFileList3Line size={13} className="text-amber-500" />
        Docs Pending
      </span>
    ),
  },
  {
    value: "NO_RESPONSE_1ST_CALL",
    label: (
      <span className="flex items-center gap-1.5">
        <RiPhoneLine size={13} className="text-slate-400" />
        No Response – 1st Call
      </span>
    ),
  },
];

interface CounselorUser {
  id: string;
  name: string;
}

interface FilterBarProps {
  filteredCount: number;
  totalCount: number;
  dateFilterMode?: "followup" | "created";
  clearFilters: () => void;
  isAdmin?: boolean;
  counselorUsers: CounselorUser[];
  hasFilters: boolean;
  onExport: () => void;
  onSearchChange: (v: string) => void;
  onSourceChange: (v: string) => void;
  onCounselorChange: (v: string) => void;
  onCountryChange: (v: string) => void;
  onPriorityChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onDateRangeChange: (v: DateRangeValue) => void;
  onPipelineStatusChange: (v: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filteredCount,
  dateFilterMode = "followup",
  totalCount,
  clearFilters,
  hasFilters,
  isAdmin = false,
  onExport,
  counselorUsers,
  onSearchChange,
  onSourceChange,
  onCounselorChange,
  onCountryChange,
  onPriorityChange,
  onStatusChange,
  onCategoryChange,
  onDateRangeChange,
  onPipelineStatusChange,
}) => {
  const [showFilters, setShowFilters] = useState(true);

  const {
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      search: "",
      source: "",
      counselor: "",
      country: "",
      priority: "",
      status: "",
      category: "",
      pipelineStatus: "All",
      dateRange: null as DateRangeValue,
    },
  });

  const handleClear = () => {
    reset();
    clearFilters();
  };

  return (
    <div className="bg-white w-full rounded-2xl border border-slate-100 p-4">
      {/* Header row */}
      <div
        className={`flex w-full justify-between items-center ${showFilters ? "mb-3.5" : ""}`}
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
              className={`transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`}
            />
          </button>
          {hasFilters && (
            <button
              type="button"
              onClick={handleClear}
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

      {showFilters && (
        <>
          {/* Row 1 */}
          <div className="flex w-full gap-2 items-center flex-wrap mb-2">
            <div className="flex-[1.5] min-w-0">
              <CustomInput
                name="search"
                label="Search"
                placeholder="Search by name or phone…"
                control={control}
                icon={<RiSearchLine size={14} className="text-slate-400" />}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onSearchChange(e.target.value)
                }
              />
            </div>

            {isAdmin && (
              <div className="flex-1 min-w-0">
                <CustomSelect
                  name="source"
                  label="Source"
                  placeholder="All Sources"
                  control={control}
                  errors={errors}
                  options={SOURCES.map((s) => ({ value: s, label: s }))}
                  onChange={(v: string) => onSourceChange(v ?? "")}
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <CustomSelect
                name="category"
                label="Category"
                placeholder="All Categories"
                control={control}
                errors={errors}
                options={CATEGORIES}
                onChange={(v: string) => onCategoryChange(v ?? "")}
              />
            </div>

            <div className="flex-1 min-w-0">
              <CustomSelect
                name="status"
                label="Status"
                placeholder="All Status"
                control={control}
                errors={errors}
                options={STATUSES}
                onChange={(v: string) => onStatusChange(v ?? "")}
              />
            </div>

            <div className="flex-1 min-w-0">
              <CustomSelect
                name="counselor"
                label="Counselor"
                placeholder="All Counselors"
                control={control}
                errors={errors}
                options={counselorUsers.map((u) => ({
                  value: u.id,
                  label: u.name,
                }))}
                onChange={(v: string) => onCounselorChange(v ?? "")}
              />
            </div>

            <div className="flex-1 min-w-0">
              <CustomSelect
                name="country"
                label="Country"
                placeholder="All Countries"
                control={control}
                errors={errors}
                options={COUNTRIES.map((c) => ({ value: c, label: c }))}
                onChange={(v: string) => onCountryChange(v ?? "")}
              />
            </div>

            <div className="flex-1 min-w-0">
              <CustomSelect
                name="priority"
                label="Priority"
                placeholder="All Priorities"
                control={control}
                errors={errors}
                options={PRIORITIES.map((p) => ({ value: p, label: p }))}
                onChange={(v: string) => onPriorityChange(v ?? "")}
              />
            </div>

            <div className="flex-[1.8] min-w-0">
              <CustomDatePicker
                mode="range"
                name="dateRange"
                label={
                  dateFilterMode === "created"
                    ? "Created Date"
                    : "Follow-up Date"
                }
                placeholder={
                  dateFilterMode === "created"
                    ? ["Created from", "Created to"]
                    : ["Follow-up from", "Follow-up to"]
                }
                control={control}
                errors={errors}
                onChange={(v) => onDateRangeChange(v ?? null)}
              />
            </div>
          </div>

          <div className="flex w-full gap-2 items-center">
            <div className="flex-1 min-w-0" style={{ maxWidth: 220 }}>
              <CustomSelect
                name="pipelineStatus"
                label="Pipeline Status"
                placeholder="All Pipeline Statuses"
                control={control}
                errors={errors}
                options={PIPELINE_STATUSES}
                onChange={(v: string) => onPipelineStatusChange(v ?? "")}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FilterBar;
