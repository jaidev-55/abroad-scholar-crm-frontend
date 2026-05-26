import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  RiSearchLine,
  RiRefreshLine,
  RiFilter3Line,
  RiArrowDownSLine,
  RiDownloadLine,
  RiFlashlightLine,
  RiFireLine,
  RiSnowflakeLine,
} from "react-icons/ri";
import { COUNTRIES, LOST_REASONS } from "../constants/constant";
import CustomSelect from "../../../components/common/CustomSelect";
import CustomInput from "../../../components/common/CustomInput";

interface FilterForm {
  search: string;
  lostReason: string;
  counselor: string;
  country: string;
  priority: string;
}

interface CounselorUser {
  id: string;
  name: string;
}

interface LostLeadsFiltersProps {
  search: string;
  setSearch: (v: string) => void;
  reasonFilter: string;
  setReasonFilter: (v: string) => void;
  counselorFilter: string;
  setCounselorFilter: (v: string) => void;
  countryFilter: string;
  setCountryFilter: (v: string) => void;
  priorityFilter: string;
  setPriorityFilter: (v: string) => void;
  hasFilters: boolean;
  clearFilters: () => void;
  total: number;
  filtered: number;
  counselors: CounselorUser[];
  onExport: () => void;
}

const LostLeadsFilters: React.FC<LostLeadsFiltersProps> = ({
  search,
  setSearch,
  reasonFilter,
  setReasonFilter,
  counselorFilter,
  setCounselorFilter,
  countryFilter,
  setCountryFilter,
  priorityFilter,
  setPriorityFilter,
  hasFilters,
  clearFilters,
  total,
  filtered,
  counselors,
  onExport,
}) => {
  const [showFilters, setShowFilters] = useState(true);

  const {
    control,
    formState: { errors },
    reset,
  } = useForm<FilterForm>({
    defaultValues: {
      search,
      lostReason: reasonFilter,
      counselor: counselorFilter,
      country: countryFilter,
      priority: priorityFilter,
    },
  });

  const handleClear = () => {
    reset({
      search: "",
      lostReason: "",
      counselor: "",
      country: "",
      priority: "",
    });
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
              <RiRefreshLine size={11} /> Clear All
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">
            {filtered} of {total} lost leads
          </span>
          <button
            type="button"
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all text-xs font-semibold"
          >
            <RiDownloadLine size={13} /> Export
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="flex w-full gap-2 items-center flex-wrap">
          <div className="flex-[1.5] min-w-0">
            <CustomInput
              name="search"
              label="Search"
              control={control}
              errors={errors}
              placeholder="Search by name, phone or email..."
              icon={<RiSearchLine size={14} className="text-slate-400" />}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex-1 min-w-0">
            <CustomSelect
              name="lostReason"
              label="Lost Reason"
              control={control}
              errors={errors}
              placeholder="All Reasons"
              onChange={(v) => setReasonFilter(v ?? "")}
              options={LOST_REASONS.map((r) => ({
                value: r.value,
                label: (
                  <span className="flex items-center gap-1.5 text-xs font-semibold">
                    {r.icon}
                    {r.label}
                  </span>
                ),
              }))}
            />
          </div>

          <div className="flex-1 min-w-0">
            <CustomSelect
              name="counselor"
              label="Counselor"
              control={control}
              errors={errors}
              placeholder="All Counselors"
              onChange={(v) => setCounselorFilter(v ?? "")}
              options={counselors.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
            />
          </div>

          <div className="flex-1 min-w-0">
            <CustomSelect
              name="country"
              label="Country"
              control={control}
              errors={errors}
              placeholder="All Counselors"
              onChange={(v) => setCountryFilter(v ?? "")}
              options={COUNTRIES.map((c) => ({ value: c, label: c }))}
            />
          </div>

          <div className="flex-1 min-w-0">
            <CustomSelect
              name="priority"
              label="Priority"
              control={control}
              errors={errors}
              placeholder="All Priorities"
              onChange={(v) => setPriorityFilter(v ?? "")}
              options={[
                {
                  value: "HOT",
                  label: (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600">
                      <RiFireLine size={12} /> Hot
                    </span>
                  ),
                },
                {
                  value: "WARM",
                  label: (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600">
                      <RiFlashlightLine size={12} /> Warm
                    </span>
                  ),
                },
                {
                  value: "COLD",
                  label: (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                      <RiSnowflakeLine size={12} /> Cold
                    </span>
                  ),
                },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default LostLeadsFilters;
