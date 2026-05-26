import { useForm } from "react-hook-form";
import {
  RiRefreshLine,
  RiDownload2Line,
  RiFilter3Line,

} from "react-icons/ri";
import type { AttributionFilters } from "../types";
import CustomSelect from "../../../../components/common/CustomSelect";

import type { Dayjs } from "dayjs";
import CustomDatePicker from "../../../../components/common/CustomDatePicker";

const PERIOD_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "7days", label: "7 Days" },
  { value: "30days", label: "30 Days" },
  { value: "90days", label: "90 Days" },
  { value: "custom", label: "Custom" },
] as const;

const SOURCE_OPTIONS = [
  { value: "all", label: "All Sources" },
  { value: "META_ADS", label: "Meta Ads" },
  { value: "GOOGLE_ADS", label: "Google Ads" },
  { value: "WEBSITE", label: "Website" },
  { value: "REFERRAL", label: "Referral" },
  { value: "MANUAL", label: "Manual" },
];

const QUALITY_OPTIONS = [
  { value: "all", label: "All Quality" },
  { value: "Hot", label: "Hot" },
  { value: "Warm", label: "Warm" },
  { value: "Cold", label: "Cold" },
];

interface Props {
  filters: AttributionFilters;
  onChange: (filters: Partial<AttributionFilters>) => void;
  onRefresh: () => void;
  loading?: boolean;
}

interface FilterForm {
  source: string;
  quality: string;
  dateRange: [Dayjs | null, Dayjs | null] | null;
}

const AttributionFilterBar: React.FC<Props> = ({
  filters,
  onChange,
  onRefresh,
  loading,
}) => {
  const {
    control,
    formState: { errors },
  } = useForm<FilterForm>({
    defaultValues: {
      source: "all",
      quality: "all",
      dateRange: null,
    },
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Left: Period pills + Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Period toggle */}
          <div className="flex gap-0.5 bg-slate-100 rounded-lg p-0.5">
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onChange({ period: opt.value })}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  filters.period === opt.value
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Custom date range */}
          {filters.period === "custom" && (
            <div className="w-56">
              <CustomDatePicker
                mode="range"
                name="dateRange"
                control={control}
                errors={errors}
                onChange={(dates) => onChange({ dateRange: dates })}
              />
            </div>
          )}

          {/* Source filter */}
          <div className="w-32">
            <CustomSelect
              name="source"
              control={control}
              errors={errors}
              size="middle"
              options={SOURCE_OPTIONS}
              icon={<RiFilter3Line size={12} />}
              onChange={(v) => onChange({ source: v })}
            />
          </div>

          {/* Quality filter */}
          <div className="w-28">
            <CustomSelect
              name="quality"
              control={control}
              errors={errors}
              size="middle"
              options={QUALITY_OPTIONS}
              onChange={(v) => onChange({ quality: v })}
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200 disabled:opacity-50"
          >
            <RiRefreshLine
              size={13}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors cursor-pointer shadow-sm">
            <RiDownload2Line size={13} />
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttributionFilterBar;
