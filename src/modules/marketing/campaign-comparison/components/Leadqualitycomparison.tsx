import { useEffect, useRef, useMemo } from "react";
import * as echarts from "echarts";
import type { CampaignData } from "../types";


interface Props {
  campaigns: CampaignData[];
  loading?: boolean;
}

const LeadQualityComparison: React.FC<Props> = ({ campaigns, loading }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const option = useMemo(
    (): echarts.EChartsOption => ({
      grid: { top: 30, right: 20, bottom: 40, left: 60, containLabel: false },
      legend: {
        top: 0,
        right: 0,
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 16,
        textStyle: { fontSize: 11, color: "#64748b" },
      },
      xAxis: {
        type: "category",
        data: campaigns.map((c) =>
          c.campaignName.length > 16
            ? c.campaignName.slice(0, 16) + "…"
            : c.campaignName,
        ),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { fontSize: 10, color: "#94a3b8" },
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
        textStyle: { fontSize: 12, color: "#334155" },
        extraCssText:
          "border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);",
      },
      series: [
        {
          name: "Hot",
          type: "bar",
          stack: "quality",
          data: campaigns.map((c) => c.hotLeads),
          itemStyle: { color: "#e11d48", borderRadius: [0, 0, 0, 0] },
          barWidth: "40%",
        },
        {
          name: "Warm",
          type: "bar",
          stack: "quality",
          data: campaigns.map((c) => c.warmLeads),
          itemStyle: { color: "#f59e0b" },
        },
        {
          name: "Cold",
          type: "bar",
          stack: "quality",
          data: campaigns.map((c) => c.coldLeads),
          itemStyle: { color: "#0ea5e9", borderRadius: [4, 4, 0, 0] },
        },
      ],
      animation: true,
      animationDuration: 500,
    }),
    [campaigns],
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
        <h3 className="text-sm font-bold text-slate-800">
          Lead Quality Breakdown
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Hot / Warm / Cold distribution per campaign
        </p>
      </div>
      <div ref={chartRef} style={{ height: 260, width: "100%" }} />
    </div>
  );
};

export default LeadQualityComparison;
