import { useState, useCallback } from "react";
import { RiBarChartBoxLine, RiDownloadLine } from "react-icons/ri";
import type { FormAnalyticsFilters } from "../types";
import { useFormAnalyticsData } from "../utils/useFormAnalyticsData";
import FormMetricsCards from "../components/FormMetricsCards";
import FormAnalyticsFilterBar from "../components/FormAnalyticsFilterBar";
import SubmissionTrendChart from "../components/SubmissionTrendChart";
import PlatformSplitChart from "../components/PlatformSplitChart";
import SubmissionHeatmap from "../components/SubmissionHeatmap";
import TopCampaignsList from "../components/TopCampaignsList";
import FormPerformanceTable from "../components/FormPerformanceTable";
import RecentSubmissionsTable from "../components/RecentSubmissionsTable";

const defaultFilters: FormAnalyticsFilters = {
  dateRange: null,
  platform: "all",
  formId: "all",
  granularity: "daily",
};

const FormAnalyticsPage = () => {
  const [filters, setFilters] = useState<FormAnalyticsFilters>(defaultFilters);

  const handleFilterChange = useCallback(
    (partial: Partial<FormAnalyticsFilters>) =>
      setFilters((prev) => ({ ...prev, ...partial })),
    [],
  );

  const {
    isLoading,
    metrics,
    formPerformance,
    submissionTrend,
    platformSplit,
    heatmap,
    topCampaigns,
    recentSubmissions,
    forms,
  } = useFormAnalyticsData(filters);

  return (
    <div className="space-y-5">
      {/* ── Header ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <RiBarChartBoxLine size={20} className="text-blue-500" />
            <h1 className="text-lg font-bold text-slate-900">Form Analytics</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 ml-7">
            Track ad form performance, submission quality &amp; conversion
            funnel
          </p>
        </div>

        <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all">
          <RiDownloadLine size={14} />
          Export Report
        </button>
      </div>

      {/* ── Filters ────────────────────────────── */}
      <FormAnalyticsFilterBar
        filters={filters}
        forms={forms}
        onChange={handleFilterChange}
      />

      {/* ── Metric cards ───────────────────────── */}
      <FormMetricsCards metrics={metrics} loading={isLoading} />

      {/* ── Row 1: Trend + Platform split ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <SubmissionTrendChart data={submissionTrend} loading={isLoading} />
        </div>
        <div className="lg:col-span-2">
          <PlatformSplitChart data={platformSplit} loading={isLoading} />
        </div>
      </div>

      {/* ── Row 2: Drop-off + Top campaigns ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <SubmissionHeatmap data={heatmap} loading={isLoading} />
        </div>
        <div className="lg:col-span-2">
          <TopCampaignsList data={topCampaigns} loading={isLoading} />
        </div>
      </div>

      {/* ── Heatmap ────────────────────────────── */}

      {/* ── Form Performance Table ─────────────── */}
      <FormPerformanceTable data={formPerformance} loading={isLoading} />

      {/* ── Recent Submissions ─────────────────── */}
      <RecentSubmissionsTable data={recentSubmissions} loading={isLoading} />
    </div>
  );
};

export default FormAnalyticsPage;
