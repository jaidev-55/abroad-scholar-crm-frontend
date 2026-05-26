import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { RiLinksLine } from "react-icons/ri";
import type { AttributionFilters } from "../types";
import { getLeadAttribution } from "../api/Leadattributionapi";
import AttributedLeadsTable from "../components/Attributedleadstable";
import AttributionFilterBar from "../components/Attributionfilterbar";
import AttributionMetricsCards from "../components/Attributionmetricscards";
import CampaignAttributionCards from "../components/Campaignattributioncards";
import {
  SourceDonutChart,
  PipelineFunnel,
} from "../components/Sourceandfunnel";

const LeadAttributionPage = () => {
  const [filters, setFilters] = useState<AttributionFilters>({
    period: "30days",
    dateRange: null,
    source: "all",
    campaign: "all",
    pipelineStatus: "all",
    counselor: "all",
    quality: "all",
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["lead-attribution", filters.period],
    queryFn: getLeadAttribution,
    staleTime: 2 * 60 * 1000,
  });

  const handleFilterChange = useCallback(
    (partial: Partial<AttributionFilters>) => {
      setFilters((prev) => ({ ...prev, ...partial }));
    },
    [],
  );

  return (
    <div className="space-y-4 pb-4">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
            <RiLinksLine size={18} className="text-indigo-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Lead Attribution
            </h1>
            <p className="text-xs text-slate-400">
              Track which campaigns and sources bring leads into your pipeline
            </p>
          </div>
        </div>

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

      {/* Filters */}
      <AttributionFilterBar
        filters={filters}
        onChange={handleFilterChange}
        onRefresh={() => refetch()}
        loading={isLoading}
      />

      {/* Metric cards */}
      <AttributionMetricsCards
        metrics={data?.metrics ?? ({} as any)}
        loading={isLoading}
      />

      {/* Row 1: Source donut + Funnel (side by side, equal width) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SourceDonutChart
          data={data?.sourceBreakdown ?? []}
          loading={isLoading}
        />
        <PipelineFunnel data={data?.funnel ?? []} loading={isLoading} />
      </div>

      {/* Row 2: Campaign → Pipeline (full width, own row) */}
      <CampaignAttributionCards
        data={data?.campaignAttribution ?? []}
        loading={isLoading}
      />

      {/* Leads table */}
      <AttributedLeadsTable leads={data?.leads ?? []} loading={isLoading} />
    </div>
  );
};

export default LeadAttributionPage;
