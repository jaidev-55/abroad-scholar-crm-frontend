import { DatePicker, Select } from "antd";
import {
  RiCalendarLine,
  RiRefreshLine,
  RiDownload2Line,
  RiFilter3Line,
} from "react-icons/ri";
import type { SpendFilters, CampaignRow } from "../types";
import { PERIOD_OPTIONS, PLATFORM_OPTIONS } from "../data/constants";

const { RangePicker } = DatePicker;

interface Props {
  filters: SpendFilters;
  campaigns: CampaignRow[];
  onChange: (filters: Partial<SpendFilters>) => void;
  onRefresh: () => void;
  loading?: boolean;
}

const SpendFilterBar: React.FC<Props> = ({
  filters,
  campaigns,
  onChange,
  onRefresh,
  loading,
}) => {
  const campaignOptions = [
    { value: "all", label: "All Campaigns" },
    ...campaigns.map((c) => ({
      value: c.id,
      label: c.campaignName,
    })),
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4">
      <div className="flex flex-col gap-3">
        {/* Row 1: Campaign selector (prominent) */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center gap-1.5 text-slate-500">
            <RiFilter3Line size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Campaign
            </span>
          </div>
          <Select
            value={filters.campaign || "all"}
            onChange={(v) => onChange({ campaign: v === "all" ? "" : v })}
            options={campaignOptions}
            className="w-full sm:w-72"
            size="middle"
            style={{ borderRadius: 10, fontSize: 13 }}
            placeholder="Select a campaign"
            showSearch
            filterOption={(input, option) =>
              (option?.label as string)
                ?.toLowerCase()
                .includes(input.toLowerCase()) ?? false
            }
          />
          {filters.campaign && (
            <button
              onClick={() => onChange({ campaign: "" })}
              className="text-xs text-blue-500 hover:text-blue-700 font-medium cursor-pointer whitespace-nowrap"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* Row 2: Period + Platform + Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
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

            {/* Platform filter */}
            <div className="flex gap-0.5 bg-slate-100 rounded-lg p-0.5">
              {PLATFORM_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onChange({ platform: opt.value })}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                    filters.platform === opt.value
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
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
    </div>
  );
};

export default SpendFilterBar;
