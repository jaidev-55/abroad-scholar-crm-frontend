import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { getSpendRoiData } from "../api/spendRoiApi";
import SpendFilterBar from "../components/SpendFilterBar";
import SpendMetricsCards from "../components/SpendMetricsCards";
import SpendTrendChart from "../components/SpendTrendChart";
import PlatformBreakdownCards from "../components/PlatformBreakdownCards";
import CampaignTable from "../components/CampaignTable";
import type { SpendFilters, SpendMetrics } from "../types";

const SpendRoiPage = () => {
  const [filters, setFilters] = useState<SpendFilters>({
    dateRange: null,
    platform: "all",
    campaign: "",
    period: "30days",
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["spend-roi", filters.period, filters.platform],
    queryFn: () => getSpendRoiData(filters.period, filters.platform),
    staleTime: 2 * 60 * 1000,
  });

  const handleFilterChange = useCallback((partial: Partial<SpendFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  }, []);

  // ─── Compute filtered data based on selected campaign ───
  const selectedCampaign = filters.campaign;
  const allCampaigns = data?.campaigns ?? [];

  const filteredCampaigns = useMemo(() => {
    if (!selectedCampaign) return allCampaigns;
    return allCampaigns.filter((c) => c.id === selectedCampaign);
  }, [allCampaigns, selectedCampaign]);

  // Recalculate metrics for the selected campaign(s)
  const filteredMetrics: SpendMetrics = useMemo(() => {
    if (!selectedCampaign || !data?.metrics)
      return data?.metrics ?? ({} as SpendMetrics);

    const campaign = allCampaigns.find((c) => c.id === selectedCampaign);
    if (!campaign) return data.metrics;

    return {
      totalSpend: campaign.spend,
      totalLeads: campaign.leads,
      costPerLead: campaign.cpl,
      conversions: campaign.conversions,
      costPerConversion: campaign.costPerConversion,
      roi:
        campaign.conversions > 0
          ? parseFloat((campaign.leads / campaign.conversions).toFixed(1))
          : 0,
      // Per-campaign change data would come from API;
      // for now show 0 when filtered to single campaign
      spendChange: 0,
      leadsChange: 0,
      cplChange: 0,
      conversionsChange: 0,
    };
  }, [data, allCampaigns, selectedCampaign]);

  const filteredTrend = useMemo(() => {
    if (!selectedCampaign || !data?.trend) return data?.trend ?? [];

    const campaign = allCampaigns.find((c) => c.id === selectedCampaign);
    if (!campaign || !data.metrics.totalSpend) return data.trend;

    const ratio = campaign.spend / data.metrics.totalSpend;
    return data.trend.map((point) => ({
      ...point,
      spend: Math.round(point.spend * ratio),
      leads: Math.max(1, Math.round(point.leads * ratio)),
      conversions: Math.round(point.conversions * ratio),
      cpl:
        Math.round(point.leads * ratio) > 0
          ? Math.round((point.spend * ratio) / (point.leads * ratio))
          : 0,
    }));
  }, [data, allCampaigns, selectedCampaign]);

  // Filter platform breakdown for selected campaign
  const filteredPlatforms = useMemo(() => {
    if (!selectedCampaign || !data?.platforms) return data?.platforms ?? [];

    const campaign = allCampaigns.find((c) => c.id === selectedCampaign);
    if (!campaign) return data.platforms;

    // Show only the platform this campaign belongs to
    return [
      {
        platform: campaign.platform === "meta" ? "Meta Ads" : "Google Ads",
        spend: campaign.spend,
        leads: campaign.leads,
        conversions: campaign.conversions,
        cpl: campaign.cpl,
        cpc:
          campaign.clicks > 0
            ? Math.round(campaign.spend / campaign.clicks)
            : 0,
        conversionRate: campaign.conversionRate,
      },
    ];
  }, [data, allCampaigns, selectedCampaign]);

  // Selected campaign name for header
  const selectedCampaignName = selectedCampaign
    ? allCampaigns.find((c) => c.id === selectedCampaign)?.campaignName
    : null;

  return (
    <div className="space-y-4 pb-4">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <RiMoneyDollarCircleLine size={18} className="text-blue-500" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Spend & ROI</h1>
              <p className="text-xs text-slate-400">
                {selectedCampaignName
                  ? `Viewing: ${selectedCampaignName}`
                  : "Track ad spend, cost per lead, and return on investment"}
              </p>
            </div>
          </div>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs font-medium text-emerald-600">
            Live data
          </span>
        </div>
      </div>

      {/* Filters (with campaign selector) */}
      <SpendFilterBar
        filters={filters}
        campaigns={allCampaigns}
        onChange={handleFilterChange}
        onRefresh={() => refetch()}
        loading={isLoading}
      />

      {/* Selected campaign badge */}
      {selectedCampaignName && (
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-xs font-semibold text-blue-700">
            Showing data for: {selectedCampaignName}
          </span>
          <button
            onClick={() => handleFilterChange({ campaign: "" })}
            className="ml-auto text-xs text-blue-500 hover:text-blue-700 font-medium cursor-pointer"
          >
            View all campaigns
          </button>
        </div>
      )}

      {/* Metric cards */}
      <SpendMetricsCards metrics={filteredMetrics} loading={isLoading} />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-full">
          <SpendTrendChart data={filteredTrend} loading={isLoading} />
        </div>
        <div className="lg:col-span-full">
          <PlatformBreakdownCards
            platforms={filteredPlatforms}
            loading={isLoading}
          />
        </div>
      </div>

      {/* Campaign table */}
      <CampaignTable
        campaigns={filteredCampaigns}
        loading={isLoading}
        onSelectCampaign={(id) => handleFilterChange({ campaign: id })}
      />
    </div>
  );
};

export default SpendRoiPage;
