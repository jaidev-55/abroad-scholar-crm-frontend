import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { RiBarChartBoxLine } from "react-icons/ri";
import { getCampaignComparison } from "../api/Campaigncomparisonapi";
import ComparisonBarCharts from "../components/Comparisonbarcharts";
import ComparisonFilterBar from "../components/Comparisonfilterbar";
import ComparisonTable from "../components/Comparisontable";
import LeadQualityComparison from "../components/Leadqualitycomparison";
import TrendOverlayChart from "../components/Trendoverlaychart";
import type { ComparisonFilters } from "../types";

const CampaignComparisonPage = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["campaign-comparison"],
    queryFn: getCampaignComparison,
    staleTime: 2 * 60 * 1000,
  });

  // Default: first 3 campaigns selected
  const [filters, setFilters] = useState<ComparisonFilters>({
    period: "30days",
    dateRange: null,
    selectedCampaigns: ["1", "2", "3"],
  });

  const handleFilterChange = useCallback(
    (partial: Partial<ComparisonFilters>) => {
      setFilters((prev) => ({ ...prev, ...partial }));
    },
    [],
  );

  // Filter campaigns based on selection
  const allCampaigns = data?.campaigns ?? [];
  const selectedCampaigns = useMemo(
    () =>
      allCampaigns.filter((c: { id: string }) =>
        filters.selectedCampaigns.includes(c.id),
      ),
    [allCampaigns, filters.selectedCampaigns],
  );

  return (
    <div className="space-y-4 pb-4">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <RiBarChartBoxLine size={18} className="text-amber-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Campaign Comparison
            </h1>
            <p className="text-xs text-slate-400">
              Compare performance side-by-side across campaigns
            </p>
          </div>
        </div>

        {selectedCampaigns.length >= 2 && (
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Comparing {selectedCampaigns.length} campaigns
          </span>
        )}
      </div>

      {/* Campaign selector + filters */}
      <ComparisonFilterBar
        filters={filters}
        campaigns={allCampaigns}
        onChange={handleFilterChange}
        onRefresh={() => refetch()}
        loading={isLoading}
      />

      {selectedCampaigns.length < 2 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <RiBarChartBoxLine
            size={40}
            className="text-slate-300 mx-auto mb-3"
          />
          <p className="text-sm font-semibold text-slate-600">
            Select at least 2 campaigns to compare
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Click on campaigns above to add them to the comparison
          </p>
        </div>
      ) : (
        <>
          {/* Side-by-side table */}
          <ComparisonTable campaigns={selectedCampaigns} loading={isLoading} />

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ComparisonBarCharts
              campaigns={selectedCampaigns}
              loading={isLoading}
            />
            <LeadQualityComparison
              campaigns={selectedCampaigns}
              loading={isLoading}
            />
          </div>

          {/* Trend overlay */}
          <TrendOverlayChart
            campaigns={selectedCampaigns}
            trend={data?.trend ?? []}
            loading={isLoading}
          />
        </>
      )}
    </div>
  );
};

export default CampaignComparisonPage;
