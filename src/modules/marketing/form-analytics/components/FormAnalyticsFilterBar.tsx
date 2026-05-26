import { Select, DatePicker } from "antd";
import { RiFilter3Line } from "react-icons/ri";
import type {
  FormAnalyticsFilters,
  TimeGranularity,
  Platform,
  AdForm,
} from "../types";
import type { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

interface Props {
  filters: FormAnalyticsFilters;
  forms: AdForm[];
  onChange: (next: Partial<FormAnalyticsFilters>) => void;
}

const platformOptions = [
  { value: "all", label: "All Platforms" },
  { value: "meta", label: "Meta" },
  { value: "google", label: "Google" },
];

const granularityOptions: { value: TimeGranularity; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const FormAnalyticsFilterBar: React.FC<Props> = ({
  filters,
  forms,
  onChange,
}) => {
  const formOptions = [
    { value: "all", label: "All Forms" },
    ...forms.map((f) => ({ value: f.id, label: f.name })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 bg-white rounded-2xl border border-slate-100 px-4 py-3">
      <div className="flex items-center gap-1.5 text-slate-400 mr-1">
        <RiFilter3Line size={15} />
        <span className="text-xs font-semibold uppercase tracking-wider">
          Filters
        </span>
      </div>

      {/* Date range */}
      <RangePicker
        value={filters.dateRange}
        onChange={(dates) =>
          onChange({
            dateRange: dates as [Dayjs, Dayjs] | null,
          })
        }
        placeholder={["Start date", "End date"]}
        format="MMM D, YYYY"
        allowClear
        size="middle"
        className="w-56"
        style={{ borderRadius: 10 }}
      />

      {/* Platform */}
      <Select
        value={filters.platform}
        onChange={(v) => onChange({ platform: v as Platform | "all" })}
        options={platformOptions}
        className="w-36"
        size="middle"
      />

      {/* Form */}
      <Select
        value={filters.formId}
        onChange={(v) => onChange({ formId: v })}
        options={formOptions}
        className="w-52"
        size="middle"
        showSearch
        optionFilterProp="label"
      />

      {/* Granularity */}
      <Select
        value={filters.granularity}
        onChange={(v) => onChange({ granularity: v as TimeGranularity })}
        options={granularityOptions}
        className="w-28"
        size="middle"
      />
    </div>
  );
};

export default FormAnalyticsFilterBar;
