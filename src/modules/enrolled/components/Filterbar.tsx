import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { RiSearchLine, RiRefreshLine } from "react-icons/ri";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import type { EnrolledFilters } from "../Types";

interface SelectOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  filters: EnrolledFilters;
  onFilterChange: (key: keyof EnrolledFilters, value: string) => void;
  countries: string[];
  counselorOptions: SelectOption[];
  visaStatuses: string[];
  stages: string[];
  feeStatuses: string[];
  totalCount: number;
  filteredCount: number;
}

const formatLabel = (s: string) =>
  s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  countries,
  counselorOptions,
  visaStatuses,
  stages,
  feeStatuses,
  totalCount,
  filteredCount,
}) => {
  // ── Destructure errors so every CustomSelect gets a valid object ──
  const {
    control,
    setValue,
    formState: { errors },
  } = useForm<EnrolledFilters>({ defaultValues: filters });

  // Keep RHF in sync when filters are cleared externally
  useEffect(() => {
    (Object.keys(filters) as (keyof EnrolledFilters)[]).forEach((key) =>
      setValue(key, filters[key]),
    );
  }, [filters, setValue]);

  const hasFilters = Object.values(filters).some((v) => v !== "");

  const handleClear = () => {
    const empty: EnrolledFilters = {
      search: "",
      country: "",
      counselorId: "",
      visaStatus: "",
      stage: "",
      feeStatus: "",
    };
    (Object.keys(empty) as (keyof EnrolledFilters)[]).forEach((key) => {
      setValue(key, "");
      onFilterChange(key, "");
    });
  };

  // Build options from API data
  const countryOptions = countries.map((c) => ({ value: c, label: c }));
  const visaOptions = visaStatuses.map((v) => ({
    value: v,
    label: formatLabel(v),
  }));
  const stageOptions = stages.map((s) => ({ value: s, label: formatLabel(s) }));
  const feeOptions = feeStatuses.map((f) => ({
    value: f,
    label: formatLabel(f),
  }));

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4">
      <div className="flex flex-wrap gap-2 items-center">
        {/* Search */}
        <div style={{ width: 220 }}>
          <CustomInput<EnrolledFilters>
            name="search"
            placeholder="Search by name or ID..."
            icon={<RiSearchLine size={14} className="text-slate-400" />}
            control={control}
            size="middle"
            onChange={(e) => onFilterChange("search", e.target.value)}
          />
        </div>

        {/* Country */}
        <div style={{ width: 130 }}>
          <CustomSelect<EnrolledFilters>
            name="country"
            placeholder="Country"
            options={countryOptions}
            control={control}
            errors={errors}
            size="middle"
            onChange={(v) => onFilterChange("country", v ?? "")}
          />
        </div>

        {/* Counselor */}
        <div style={{ width: 150 }}>
          <CustomSelect<EnrolledFilters>
            name="counselorId"
            placeholder="Counselor"
            options={counselorOptions}
            control={control}
            errors={errors}
            size="middle"
            onChange={(v) => onFilterChange("counselorId", v ?? "")}
          />
        </div>

        {/* Visa Status */}
        <div style={{ width: 145 }}>
          <CustomSelect<EnrolledFilters>
            name="visaStatus"
            placeholder="Visa Status"
            options={visaOptions}
            control={control}
            errors={errors}
            size="middle"
            onChange={(v) => onFilterChange("visaStatus", v ?? "")}
          />
        </div>

        {/* Stage */}
        <div style={{ width: 160 }}>
          <CustomSelect<EnrolledFilters>
            name="stage"
            placeholder="Stage"
            options={stageOptions}
            control={control}
            errors={errors}
            size="middle"
            onChange={(v) => onFilterChange("stage", v ?? "")}
          />
        </div>

        {/* Fee Status */}
        <div style={{ width: 130 }}>
          <CustomSelect<EnrolledFilters>
            name="feeStatus"
            placeholder="Fee Status"
            options={feeOptions}
            control={control}
            errors={errors}
            size="middle"
            onChange={(v) => onFilterChange("feeStatus", v ?? "")}
          />
        </div>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
          >
            <RiRefreshLine size={11} /> Clear
          </button>
        )}

        {/* Count */}
        <span className="ml-auto text-xs font-medium text-slate-400">
          {filteredCount} of {totalCount} students
        </span>
      </div>
    </div>
  );
};

export default FilterBar;
