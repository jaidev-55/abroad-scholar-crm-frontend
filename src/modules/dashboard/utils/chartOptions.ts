import type * as echarts from "echarts";

export const leadsTrendOption: echarts.EChartsCoreOption = {
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
    data: ["Apr 5", "Apr 6", "Apr 7", "Apr 8", "Apr 9", "Apr 10", "Apr 11"],
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
      data: [12, 18, 15, 22, 28, 35, 42],
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
      data: [5, 8, 7, 11, 14, 18, 22],
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

export const sourceBreakdownOption: echarts.EChartsCoreOption = {
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
        formatter: "{total|135}\n{sub|Total}",
        rich: {
          total: { fontSize: 22, fontWeight: "bold", color: "#0f172a" },
          sub: { fontSize: 11, color: "#94a3b8", padding: [4, 0, 0, 0] },
        },
      },
      data: [
        { value: 52, name: "Instagram", itemStyle: { color: "#ec4899" } },
        { value: 38, name: "Facebook", itemStyle: { color: "#3b82f6" } },
        { value: 28, name: "Website", itemStyle: { color: "#10b981" } },
        { value: 17, name: "Referral", itemStyle: { color: "#f59e0b" } },
      ],
    },
  ],
};

export const funnelOption: echarts.EChartsCoreOption = {
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
    data: ["Lost", "Converted", "Follow-ups", "In Progress", "New"],
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: "#475569", fontWeight: 500 },
  },
  series: [
    {
      type: "bar",
      data: [
        { value: 14, itemStyle: { color: "#94a3b8" } },
        { value: 51, itemStyle: { color: "#10b981" } },
        { value: 23, itemStyle: { color: "#f59e0b" } },
        { value: 28, itemStyle: { color: "#8b5cf6" } },
        { value: 47, itemStyle: { color: "#3b82f6" } },
      ],
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
