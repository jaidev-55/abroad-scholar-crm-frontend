import React from "react";
import { HiOutlineChevronDown, HiOutlineLightningBolt } from "react-icons/hi";
import type * as echarts from "echarts";
import type { DateRange } from "../utils/constants";
import { useEChart } from "../utils/Useechart";

interface LeadsTrendProps {
  option: echarts.EChartsCoreOption;
  range: DateRange;
}
export const LeadsTrendChart: React.FC<LeadsTrendProps> = ({
  option,
  range,
}) => {
  const ref = useEChart(option);
  const rangeLabel: Record<DateRange, string> = {
    today: "Today",
    "7d": "Weekly",
    "30d": "Monthly",
    "90d": "Quarterly",
    custom: "Custom",
  };
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Leads Trend</h3>
          <p className="text-xs text-slate-500">
            New leads vs converted over time
          </p>
        </div>
        <button className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50">
          {rangeLabel[range]} <HiOutlineChevronDown className="h-3 w-3" />
        </button>
      </div>
      <div ref={ref} style={{ height: 280, width: "100%" }} />
    </div>
  );
};

// ─── Source Breakdown ─────────────────────────────────────────────────────────
export const SourceBreakdownChart: React.FC<{
  option: echarts.EChartsCoreOption;
}> = ({ option }) => {
  const ref = useEChart(option);
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-2">
        <h3 className="text-sm font-bold text-slate-900">Lead Sources</h3>
        <p className="text-xs text-slate-500">Where leads come from</p>
      </div>
      <div ref={ref} style={{ height: 280, width: "100%" }} />
    </div>
  );
};

// ─── Pipeline Funnel ──────────────────────────────────────────────────────────
export const PipelineFunnelChart: React.FC<{
  option: echarts.EChartsCoreOption;
}> = ({ option }) => {
  const ref = useEChart(option);
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Pipeline Funnel</h3>
          <p className="text-xs text-slate-500">Conversion stages breakdown</p>
        </div>
        <HiOutlineLightningBolt className="h-4 w-4 text-amber-500" />
      </div>
      <div ref={ref} style={{ height: 260, width: "100%" }} />
    </div>
  );
};
