import { useState } from "react";
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
import TodaysTasks from "../components/TodaysTasks";
import RecentLeadsTable from "../components/RecentLeadsTable";
import { useDashboardData } from "../utils/useDashboardData";

export interface DashboardFilterState {
  range: DateRange;
  counselor: string;
  source: string;
}

const Dashboard = () => {
  const [filters, setFilters] = useState<DashboardFilterState>({
    range: "30d",
    counselor: "all",
    source: "all",
  });

  const {
    filteredLeads,
    stats,
    sourceBreakdownOption,
    funnelOption,
    leadsTrendOption,
    counselors,
  } = useDashboardData(filters);

  return (
    <div className="min-h-screen bg-slate-50/60 p-3">
      <DashboardHeader
        onRefresh={() => window.location.reload()}
        onExport={() => {}}
      />
      <DashboardFilters
        range={filters.range}
        onRangeChange={(r) => setFilters((p) => ({ ...p, range: r }))}
        onCounselorChange={(v) => setFilters((p) => ({ ...p, counselor: v }))}
        onSourceChange={(v) => setFilters((p) => ({ ...p, source: v }))}
      />

      <StatsGrid stats={stats} />

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <LeadsTrendChart option={leadsTrendOption} range={filters.range} />
        <SourceBreakdownChart option={sourceBreakdownOption} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <PipelineFunnelChart option={funnelOption} />
        <CounselorLeaderboard counselors={counselors} />
        <TodaysTasks />
      </div>

      <RecentLeadsTable leads={filteredLeads} />
    </div>
  );
};

export default Dashboard;
