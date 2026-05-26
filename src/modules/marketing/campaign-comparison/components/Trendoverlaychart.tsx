import { useEffect, useRef, useMemo } from "react";
import * as echarts from "echarts";
import type { CampaignData, CampaignTrendPoint } from "../types";
import { CAMPAIGN_COLORS } from "../utils/Constants";

interface Props {
  campaigns: CampaignData[];
  trend: CampaignTrendPoint[];
  loading?: boolean;
}

const TrendOverlayChart: React.FC<Props> = ({ campaigns, trend, loading }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const dates = useMemo(
    () =>
      trend.map((t) =>
        new Date(t.date).toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
        }),
      ),
    [trend],
  );

  const option = useMemo(
    (): echarts.EChartsOption => ({
      grid: { top: 40, right: 20, bottom: 30, left: 45, containLabel: false },
      legend: {
        top: 0,
        right: 0,
        itemWidth: 12,
        itemHeight: 3,
        itemGap: 14,
        textStyle: { fontSize: 11, color: "#64748b" },
        data: campaigns.map((c) => c.campaignName),
      },
      xAxis: {
        type: "category",
        data: dates,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { fontSize: 10, color: "#94a3b8", interval: "auto" },
        boundaryGap: false,
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: "#f1f5f9", type: "dashed" } },
        axisLabel: { fontSize: 10, color: "#94a3b8" },
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "#fff",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        padding: [10, 14],
        textStyle: { fontSize: 11, color: "#334155" },
        extraCssText:
          "border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);",
      },
      series: campaigns.map((c, i) => ({
        name: c.campaignName,
        type: "line" as const,
        data: trend.map((t) => (t[c.id] as number) || 0),
        smooth: true,
        symbol: "circle",
        symbolSize: 4,
        showSymbol: false,
        lineStyle: { color: CAMPAIGN_COLORS[i], width: 2 },
        itemStyle: {
          color: CAMPAIGN_COLORS[i],
          borderColor: "#fff",
          borderWidth: 2,
        },
        emphasis: {
          itemStyle: { shadowBlur: 6, shadowColor: `${CAMPAIGN_COLORS[i]}40` },
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: `${CAMPAIGN_COLORS[i]}12` },
            { offset: 1, color: `${CAMPAIGN_COLORS[i]}02` },
          ]),
        },
      })),
      animation: true,
      animationDuration: 600,
    }),
    [campaigns, trend, dates],
  );

  useEffect(() => {
    if (!chartRef.current) return;
    chartInstance.current = echarts.init(chartRef.current);
    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!chartInstance.current) return;
    chartInstance.current.setOption(option, true);
  }, [option]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
        <div className="h-5 w-40 bg-slate-200 rounded mb-4" />
        <div className="h-[260px] bg-slate-50 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-800">Daily Leads Trend</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Leads per day across selected campaigns
        </p>
      </div>
      <div ref={chartRef} style={{ height: 260, width: "100%" }} />
    </div>
  );
};

export default TrendOverlayChart;
