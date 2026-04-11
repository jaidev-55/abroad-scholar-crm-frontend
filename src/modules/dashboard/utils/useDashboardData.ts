import { useMemo } from "react";
import type { DashboardFilterState } from "../pages/Dashboard";
import { RECENT_LEADS, COUNSELORS } from "./constants";
import type * as echarts from "echarts";

export function useDashboardData(filters: DashboardFilterState) {
  // 1. Filtered leads (counselor + source)
  const filteredLeads = useMemo(() => {
    return RECENT_LEADS.filter((l) => {
      const matchCounselor =
        filters.counselor === "all" ||
        l.counselor.toLowerCase() === filters.counselor.toLowerCase();
      const matchSource =
        filters.source === "all" ||
        l.source.toLowerCase() === filters.source.toLowerCase();
      return matchCounselor && matchSource;
    });
  }, [filters.counselor, filters.source]);

  // 2. Stats derived from filtered leads
  const stats = useMemo(
    () => ({
      total: filteredLeads.length,
      hot: filteredLeads.filter((l) => l.priority === "Hot").length,
      followups: filteredLeads.filter((l) => l.status === "In Progress").length,
      converted: filteredLeads.filter((l) => l.status === "Converted").length,
      lost: filteredLeads.filter((l) => l.status === "Lost").length,
    }),
    [filteredLeads],
  );

  // 3. Source breakdown donut
  const sourceBreakdownOption = useMemo((): echarts.EChartsCoreOption => {
    const SOURCE_COLORS: Record<string, string> = {
      Instagram: "#ec4899",
      Facebook: "#3b82f6",
      Website: "#10b981",
      Referral: "#f59e0b",
    };
    const map: Record<string, number> = {};
    filteredLeads.forEach((l) => {
      map[l.source] = (map[l.source] ?? 0) + 1;
    });
    const data = Object.entries(map).map(([name, value]) => ({
      name,
      value,
      itemStyle: { color: SOURCE_COLORS[name] ?? "#94a3b8" },
    }));
    const total = filteredLeads.length;

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
          data: data.length
            ? data
            : [{ name: "No data", value: 1, itemStyle: { color: "#e2e8f0" } }],
        },
      ],
    };
  }, [filteredLeads]);

  // 4. Funnel chart derived from filtered leads
  const funnelOption = useMemo((): echarts.EChartsCoreOption => {
    const stages = [
      { label: "Lost", key: "Lost", color: "#94a3b8" },
      { label: "Converted", key: "Converted", color: "#10b981" },
      { label: "In Progress", key: "In Progress", color: "#8b5cf6" },
      { label: "New", key: "New", color: "#3b82f6" },
    ] as const;

    return {
      tooltip: {
        trigger: "item",
        backgroundColor: "#0f172a",
        borderColor: "#0f172a",
        textStyle: { color: "#fff" },
      },
      grid: { left: 8, right: 30, top: 10, bottom: 10, containerLabel: true },
      xAxis: {
        type: "value",
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },
      yAxis: {
        type: "category",
        data: stages.map((s) => s.label),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: "#475569", fontWeight: 500 },
      },
      series: [
        {
          type: "bar",
          data: stages.map((s) => ({
            value: filteredLeads.filter((l) => l.status === s.key).length,
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
  }, [filteredLeads]);

  // 5. Leads trend — varies by range for realistic dummy feel
  const leadsTrendOption = useMemo((): echarts.EChartsCoreOption => {
    const configs: Record<
      string,
      { labels: string[]; newLeads: number[]; converted: number[] }
    > = {
      today: {
        labels: ["9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm"],
        newLeads: [2, 3, 1, 4, 2, 5, 3],
        converted: [1, 1, 0, 2, 1, 2, 1],
      },
      "7d": {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        newLeads: [10, 14, 12, 18, 20, 24, 28],
        converted: [4, 6, 5, 8, 9, 11, 13],
      },
      "30d": {
        labels: [
          "Apr 5",
          "Apr 6",
          "Apr 7",
          "Apr 8",
          "Apr 9",
          "Apr 10",
          "Apr 11",
        ],
        newLeads: [12, 18, 15, 22, 28, 35, 42],
        converted: [5, 8, 7, 11, 14, 18, 22],
      },
      "90d": {
        labels: ["Jan", "Feb", "Mar", "Apr"],
        newLeads: [95, 110, 125, 135],
        converted: [38, 44, 49, 51],
      },
      custom: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        newLeads: [10, 14, 12, 18, 20, 24, 28],
        converted: [4, 6, 5, 8, 9, 11, 13],
      },
    };

    // Scale down trend data proportionally based on filtered leads vs total
    const ratio =
      RECENT_LEADS.length > 0 ? filteredLeads.length / RECENT_LEADS.length : 1;
    const cfg = configs[filters.range] ?? configs["30d"];

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
      grid: { left: 8, right: 16, top: 20, bottom: 40, containerLabel: true },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: cfg.labels,
        axisLine: { lineStyle: { color: "#e2e8f0" } },
        axisLabel: { color: "#94a3b8" },
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: "#94a3b8" },
        splitLine: { lineStyle: { color: "#f1f5f9" } },
      },
      series: [
        {
          name: "New Leads",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 7,
          data: cfg.newLeads.map((v) => Math.round(v * ratio)),
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
          data: cfg.converted.map((v) => Math.round(v * ratio)),
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
  }, [filteredLeads, filters.range]);

  // 6. Counselor leaderboard filtered
  const counselors = useMemo(() => {
    if (filters.counselor === "all") return COUNSELORS;
    return COUNSELORS.filter(
      (c) => c.name.toLowerCase() === filters.counselor.toLowerCase(),
    );
  }, [filters.counselor]);

  return {
    filteredLeads,
    stats,
    sourceBreakdownOption,
    funnelOption,
    leadsTrendOption,
    counselors,
  };
}
