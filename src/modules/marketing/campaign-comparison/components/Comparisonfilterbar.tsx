import { DatePicker } from "antd";
import { useForm } from "react-hook-form";
import {
  RiCalendarLine,
  RiRefreshLine,
  RiBarChartBoxLine,
} from "react-icons/ri";
import type { ComparisonFilters, CampaignData } from "../types";
import { PERIOD_OPTIONS } from "../utils/Constants";
import CustomMultiSelect from "../../../../components/common/Custommultiselect";

const { RangePicker } = DatePicker;

interface Props {
  filters: ComparisonFilters;
  campaigns: CampaignData[];
  onChange: (filters: Partial<ComparisonFilters>) => void;
  onRefresh: () => void;
  loading?: boolean;
}

interface FilterForm {
  selectedCampaigns: string[];
}

const ComparisonFilterBar: React.FC<Props> = ({
  filters,
  campaigns,
  onChange,
  onRefresh,
  loading,
}) => {
  const {
    control,
    formState: { errors },
  } = useForm<FilterForm>({
    defaultValues: {
      selectedCampaigns: filters.selectedCampaigns,
    },
  });

  const campaignOptions = campaigns.map((c) => ({
    value: c.id,
    label: `${c.platform === "meta" ? "Meta" : "Google"} · ${c.campaignName}`,
  }));

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
      {/* Row 1: Campaign multi-select */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Select campaigns to compare (2–5)
          </span>
          <span className="text-[10px] text-slate-400">
            {filters.selectedCampaigns.length} selected
          </span>
        </div>
        <CustomMultiSelect
          name="selectedCampaigns"
          placeholder="Search and select campaigns..."
          control={control}
          errors={errors}
          size="middle"
          maxCount={5}
          options={campaignOptions}
          icon={<RiBarChartBoxLine size={14} />}
          onChange={(selected) => {
            if (selected.length >= 2) {
              onChange({ selectedCampaigns: selected });
            }
          }}
        />
        <p className="text-[10px] text-slate-400 mt-1.5">
          Minimum 2 campaigns required · Maximum 5
        </p>
      </div>

      {/* Row 2: Period + Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-2 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
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
          {filters.period === "custom" && (
            <RangePicker
              value={filters.dateRange}
              onChange={(dates) => onChange({ dateRange: dates })}
              format="MMM D, YYYY"
              size="middle"
              allowClear
              suffixIcon={
                <RiCalendarLine size={14} className="text-slate-400" />
              }
              style={{ borderRadius: 10, fontSize: 12, height: 34 }}
            />
          )}
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200 disabled:opacity-50"
        >
          <RiRefreshLine size={13} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>
    </div>
  );
};

export default ComparisonFilterBar;
