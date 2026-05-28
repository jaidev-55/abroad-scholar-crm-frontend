import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { RiSearchLine, RiFilter3Line, RiArrowUpSLine } from "react-icons/ri";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import { STATUS_OPTIONS, EXAM_TYPE_OPTIONS } from "../Types/Constants";

interface IeltsFilters {
  search: string;
  status: string;
  counselor: string;
  country: string;
  examType: string;
}

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

  const {
    control,
    formState: { errors },
  } = useForm<IeltsFilters>({
    defaultValues: filters,
  });

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
            className={`text-slate-400 transition-transform duration-200 ${open ? "" : "rotate-180"}`}
          />
        </div>
      </button>

      {open && (
        <div className="px-5 pb-4 pt-1 border-t border-slate-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <CustomInput
              name="search"
              label="Search"
              placeholder="Student name..."
              control={control}
              icon={<RiSearchLine size={14} className="text-slate-300" />}
              onChange={(e) => onFilterChange("search", e.target.value)}
            />

            <CustomSelect
              name="status"
              label="Status"
              placeholder="All Statuses"
              control={control}
              errors={errors}
              options={STATUS_OPTIONS}
              onChange={(v) => onFilterChange("status", v ?? "")}
            />

            <CustomSelect
              name="counselor"
              label="Counselor"
              placeholder="All Counselors"
              control={control}
              errors={errors}
              options={[
                { value: "", label: "All Counselors" },
                ...counselorOptions,
              ]}
              onChange={(v) => onFilterChange("counselor", v ?? "")}
            />

            <CustomSelect
              name="examType"
              label="Exam Type"
              placeholder="All Types"
              options={[
                { value: "", label: "All Types" },
                ...EXAM_TYPE_OPTIONS,
              ]}
              control={control}
              errors={errors}
              onChange={(v) => onFilterChange("examType", v ?? "")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default IeltsFilterBar;
