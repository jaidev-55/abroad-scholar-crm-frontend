import { useState, useMemo, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Spin, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import type { Dayjs } from "dayjs";
import type { DateRange } from "../utils/constants";
import DashboardHeader from "../components/DashboardHeader";
import DashboardFilters from "../components/DashboardFilters";
import StatsGrid from "../components/StatsGrid";
import {
  LeadsTrendChart,
  PipelineFunnelChart,
  SourceBreakdownChart,
} from "../components/Charts";
import CounselorLeaderboard from "../components/CounselorLeaderboard";
import RecentLeadsTable from "../components/RecentLeadsTable";
import {
  getDashboardStats,
  getLeadsTrend,
  getLeadSources,
  getPipeline,
  getTopCounselors,
  getRecentLeads,
  type DatePreset,
} from "../api/dashboard";
import type { LeadSource } from "../types/dashboard";
import { exportDashboardPDF } from "../types/Exporttopdf";

export interface DashboardFilterState {
  range: DateRange;
  counselor: string;
  source: string;
  customStart: Dayjs | null;
  customEnd: Dayjs | null;
}

const rangeToPreset = (range: DateRange): DatePreset => {
  const map: Record<string, DatePreset> = {
    today: "today",
    "7d": "7days",
    "30d": "30days",
    "90d": "90days",
    custom: "custom",
  };
  return map[range] ?? "30days";
};

const Spinner = ({ size = 28 }: { size?: number }) => (
  <Spin indicator={<LoadingOutlined style={{ fontSize: size }} spin />} />
);

const SectionSkeleton = ({ height = 280 }: { height?: number }) => (
  <div
    style={{ height }}
    className="flex items-center justify-center rounded-xl border border-slate-100 bg-white"
  >
    <Spinner size={32} />
  </div>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────

const Dashboard = () => {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [filters, setFilters] = useState<DashboardFilterState>({
    range: "30d",
    counselor: "all",
    source: "all",
    customStart: null,
    customEnd: null,
  });

  const isCustomReady =
    filters.range !== "custom" ||
    (filters.customStart !== null && filters.customEnd !== null);

  const queryParams = useMemo(
    () => ({
      preset: rangeToPreset(filters.range),
      counselorId: filters.counselor !== "all" ? filters.counselor : undefined,
      source:
        filters.source !== "all" ? (filters.source as LeadSource) : undefined,
      from: filters.customStart?.format("YYYY-MM-DD"),
      to: filters.customEnd?.format("YYYY-MM-DD"),
    }),
    [filters],
  );

  const baseKey = [
    queryParams.preset,
    queryParams.counselorId,
    queryParams.source,
    queryParams.from,
    queryParams.to,
  ];

  const statsQuery = useQuery({
    queryKey: ["dashboard", "stats", ...baseKey],
    queryFn: () => getDashboardStats(queryParams),
    enabled: isCustomReady,
    staleTime: 60_000,
  });

  const trendQuery = useQuery({
    queryKey: ["dashboard", "trend", ...baseKey],
    queryFn: () => getLeadsTrend({ ...queryParams, groupBy: "day" }),
    enabled: isCustomReady,
    staleTime: 0,
  });

  const sourcesQuery = useQuery({
    queryKey: ["dashboard", "sources", ...baseKey],
    queryFn: () => getLeadSources(queryParams),
    enabled: isCustomReady,
    staleTime: 60_000,
  });

  const pipelineQuery = useQuery({
    queryKey: ["dashboard", "pipeline", ...baseKey],
    queryFn: () => getPipeline(queryParams),
    enabled: isCustomReady,
    staleTime: 60_000,
  });

  const counselorsQuery = useQuery({
    queryKey: ["dashboard", "counselors", ...baseKey],
    queryFn: () => getTopCounselors({ ...queryParams, limit: 5 }),
    enabled: isCustomReady,
    staleTime: 60_000,
  });

  const recentLeadsQuery = useQuery({
    queryKey: ["dashboard", "recent-leads", ...baseKey],
    queryFn: () => getRecentLeads({ ...queryParams, limit: 100, offset: 0 }),
    enabled: isCustomReady,
    staleTime: 60_000,
  });

  // ─── Refresh ────────────────────────────────────────────────────────────
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      await queryClient.refetchQueries({
        queryKey: ["dashboard"],
        type: "active",
      });
      message.success("Dashboard refreshed");
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient]);

  // ─── Export PDF (visual snapshot of the whole dashboard) ────────────────
  const handleExportPDF = useCallback(async () => {
    setIsExporting(true);
    try {
      await exportDashboardPDF({
        target: "#dashboard-root",
        filename: `dashboard_${new Date().toISOString().slice(0, 10)}`,
        orientation: "portrait",
        title: "Dashboard Report",
        brand: "Abroad Scholar CRM",
      });
      message.success("Dashboard exported as PDF");
    } catch (err) {
      console.error(err);
      message.error("PDF export failed");
    } finally {
      setIsExporting(false);
    }
  }, []);

  return (
    <div id="dashboard-root" className="min-h-screen bg-slate-50/60 p-3">
      <DashboardHeader
        onRefresh={handleRefresh}
        onExport={handleExportPDF}
        isRefreshing={isRefreshing}
        isExporting={isExporting}
      />

      <DashboardFilters
        range={filters.range}
        onRangeChange={(r) =>
          setFilters((p) => ({
            ...p,
            range: r,
            customStart: null,
            customEnd: null,
          }))
        }
        onCounselorChange={(v) => setFilters((p) => ({ ...p, counselor: v }))}
        onSourceChange={(v) => setFilters((p) => ({ ...p, source: v }))}
        onCustomDateChange={(start, end) =>
          setFilters((p) => ({ ...p, customStart: start, customEnd: end }))
        }
      />

      {statsQuery.isLoading ? (
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex h-24 items-center justify-center rounded-xl border border-slate-100 bg-white"
            >
              <Spinner size={20} />
            </div>
          ))}
        </div>
      ) : (
        <StatsGrid stats={statsQuery.data?.stats ?? null} />
      )}

      <div className="mb-6 grid grid-cols-1 gap-4">
        {trendQuery.isLoading ? (
          <SectionSkeleton height={320} />
        ) : (
          <LeadsTrendChart option={trendQuery.data} range={filters.range} />
        )}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {sourcesQuery.isLoading ? (
          <SectionSkeleton />
        ) : (
          <SourceBreakdownChart option={sourcesQuery.data} />
        )}
        {pipelineQuery.isLoading ? (
          <SectionSkeleton />
        ) : (
          <PipelineFunnelChart option={pipelineQuery.data} />
        )}
        {counselorsQuery.isLoading ? (
          <SectionSkeleton />
        ) : (
          <CounselorLeaderboard
            counselors={counselorsQuery.data?.counselors ?? []}
          />
        )}
      </div>

      {recentLeadsQuery.isLoading ? (
        <SectionSkeleton height={360} />
      ) : (
        <RecentLeadsTable leads={recentLeadsQuery.data?.data ?? []} />
      )}
    </div>
  );
};

export default Dashboard;
