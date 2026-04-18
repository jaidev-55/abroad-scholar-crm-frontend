import React, { useMemo } from "react";
import { HiOutlineChevronDown, HiOutlineLightningBolt } from "react-icons/hi";
import type { DateRange } from "../utils/constants";
import { useEChart } from "../utils/Useechart";
import type {
  LeadsTrendResponse,
  LeadSourcesResponse,
  PipelineResponse,
} from "../api/dashboard";

interface LeadsTrendProps {
  option: LeadsTrendResponse | undefined;
  range: DateRange;
}

export const LeadsTrendChart: React.FC<LeadsTrendProps> = ({
  option,
  range,
}) => {
  const echartsOption = useMemo(() => {
    const data = option?.data ?? [];
    const labels = data.map((d) => d.date);
    const newLeads = data.map((d) => d.newLeads);
    const converted = data.map((d) => d.converted);

    return {
      tooltip: {
        trigger: "axis",
        backgroundColor: "#0f172a",
        borderColor: "#0f172a",
        textStyle: { color: "#fff" },
      },
      legend: {
        data: ["New Leads", "Converted"],
        bottom: 0,
        icon: "roundRect",
        textStyle: { color: "#475569" },
      },
      grid: { left: 8, right: 16, top: 20, bottom: 40, containLabel: true },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: labels,
        axisLine: { lineStyle: { color: "#e2e8f0" } },
        axisLabel: { color: "#94a3b8" },
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: "#94a3b8" },
        splitLine: { lineStyle: { color: "#f1f5f9" } },
        minInterval: 1,
      },
      series: [
        {
          name: "New Leads",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 7,
          data: newLeads,
          lineStyle: { color: "#3b82f6", width: 3 },
          itemStyle: { color: "#3b82f6", borderColor: "#fff", borderWidth: 2 },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(59,130,246,0.3)" },
                { offset: 1, color: "rgba(59,130,246,0)" },
              ],
            },
          },
        },
        {
          name: "Converted",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 7,
          data: converted,
          lineStyle: { color: "#10b981", width: 3 },
          itemStyle: { color: "#10b981", borderColor: "#fff", borderWidth: 2 },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(16,185,129,0.25)" },
                { offset: 1, color: "rgba(16,185,129,0)" },
              ],
            },
          },
        },
      ],
    };
  }, [option]);

  const ref = useEChart(echartsOption);

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
  option: LeadSourcesResponse | undefined;
}> = ({ option }) => {
  const echartsOption = useMemo(() => {
    const sources = option?.sources ?? [];
    const total = option?.total ?? 0;

    const data = sources.length
      ? sources.map((s) => ({
          name:
            s.source.charAt(0) +
            s.source.slice(1).toLowerCase().replace(/_/g, " "),
          value: s.count,
          itemStyle: { color: s.color },
        }))
      : [{ name: "No data", value: 1, itemStyle: { color: "#e2e8f0" } }];

    return {
      tooltip: {
        trigger: "item",
        backgroundColor: "#0f172a",
        borderColor: "#0f172a",
        textStyle: { color: "#fff" },
        formatter: "{b}: {c} ({d}%)",
      },
      legend: {
        bottom: 0,
        icon: "circle",
        textStyle: { color: "#475569", fontSize: 11 },
      },
      series: [
        {
          name: "Source",
          type: "pie",
          radius: ["58%", "80%"],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 8, borderColor: "#fff", borderWidth: 3 },
          label: {
            show: true,
            position: "center",
            formatter: `{total|${total}}\n{sub|Total}`,
            rich: {
              total: { fontSize: 22, fontWeight: "bold", color: "#0f172a" },
              sub: { fontSize: 11, color: "#94a3b8", padding: [4, 0, 0, 0] },
            },
          },
          data,
        },
      ],
    };
  }, [option]);

  const ref = useEChart(echartsOption);

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

// ─── Pipeline Funnel (horizontal bars) ───────────────────────────────────────

export const PipelineFunnelChart: React.FC<{
  option: PipelineResponse | undefined;
}> = ({ option }) => {
  const echartsOption = useMemo(() => {
    // Exact same stage order as dummy data
    const stageOrder = ["Lost", "Converted", "In Progress", "New"];
    const colorMap: Record<string, string> = {
      New: "#3b82f6",
      "In Progress": "#8b5cf6",
      Converted: "#10b981",
      Lost: "#94a3b8",
    };

    const stages = option?.stages ?? [];

    // Map API stages by label, preserving dummy order
    const mapped = stageOrder.map((label) => {
      const found = stages.find((s) => s.label === label);
      return {
        label,
        count: found?.count ?? 0,
        color: colorMap[label] ?? "#94a3b8",
      };
    });

    return {
      tooltip: {
        trigger: "item",
        backgroundColor: "#0f172a",
        borderColor: "#0f172a",
        textStyle: { color: "#fff" },
      },
      grid: { left: 8, right: 30, top: 10, bottom: 10, containLabel: true },
      xAxis: {
        type: "value",
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },
      yAxis: {
        type: "category",
        data: mapped.map((s) => s.label),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: "#475569", fontWeight: 500 },
      },
      series: [
        {
          type: "bar",
          data: mapped.map((s) => ({
            value: s.count,
            itemStyle: { color: s.color },
          })),
          barWidth: 20,
          itemStyle: { borderRadius: [0, 8, 8, 0] },
          label: {
            show: true,
            position: "right",
            color: "#475569",
            fontWeight: 700,
          },
        },
      ],
    };
  }, [option]);

  const ref = useEChart(echartsOption);

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
