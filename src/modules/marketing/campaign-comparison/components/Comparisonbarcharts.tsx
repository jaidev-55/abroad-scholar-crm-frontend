import { useEffect, useRef, useMemo, useState } from "react";
import * as echarts from "echarts";
import type { CampaignData } from "../types";

import { CAMPAIGN_COLORS } from "../utils/Constants";
import { formatCurrency } from "../utils/campaignComparisonHelpers";


interface Props {
  campaigns: CampaignData[];
  loading?: boolean;
}

type ChartMetric =
  | "cpl"
  | "leads"
  | "conversionRate"
  | "spend"
  | "costPerConversion";

const CHART_METRICS: Record<
  ChartMetric,
  { label: string; unit: string; formatter: (v: number) => string }
> = {
  cpl: { label: "Cost / Lead", unit: "₹", formatter: formatCurrency },
  leads: { label: "Leads", unit: "", formatter: (v) => String(v) },
  conversionRate: {
    label: "Conv. Rate",
    unit: "%",
    formatter: (v) => `${v.toFixed(1)}%`,
  },
  spend: { label: "Total Spend", unit: "₹", formatter: formatCurrency },
  costPerConversion: {
    label: "Cost / Conv.",
    unit: "₹",
    formatter: formatCurrency,
  },
};

const ComparisonBarCharts: React.FC<Props> = ({ campaigns, loading }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [activeMetric, setActiveMetric] = useState<ChartMetric>("cpl");

  const config = CHART_METRICS[activeMetric];

  const option = useMemo(
    (): echarts.EChartsOption => ({
      grid: { top: 20, right: 20, bottom: 40, left: 60, containLabel: false },
      xAxis: {
        type: "category",
        data: campaigns.map((c) =>
          c.campaignName.length > 18
            ? c.campaignName.slice(0, 18) + "…"
            : c.campaignName,
        ),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { fontSize: 10, color: "#94a3b8", interval: 0, rotate: 0 },
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: "#f1f5f9", type: "dashed" } },
        axisLabel: {
          fontSize: 10,
          color: "#94a3b8",
          formatter: (v: number) => {
            if (activeMetric === "conversionRate") return `${v}%`;
            if (activeMetric === "leads") return String(v);
            return v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`;
          },
        },
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
        formatter: (params: any) => {
          const item = Array.isArray(params) ? params[0] : params;
          return `<div style="font-weight:600;margin-bottom:4px">${item.name}</div>
                  <div>${config.label}: <strong>${config.formatter(item.value)}</strong></div>`;
        },
      },
      series: [
        {
          type: "bar",
          data: campaigns.map((c, i) => ({
            value: (c as any)[activeMetric],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: CAMPAIGN_COLORS[i] },
                { offset: 1, color: `${CAMPAIGN_COLORS[i]}80` },
              ]),
              borderRadius: [6, 6, 0, 0],
            },
          })),
          barWidth: "45%",
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(0,0,0,0.1)",
            },
          },
        },
      ],
      animation: true,
      animationDuration: 500,
      animationEasing: "cubicOut",
    }),
    [campaigns, activeMetric, config],
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
        <div className="h-5 w-32 bg-slate-200 rounded mb-4" />
        <div className="h-[260px] bg-slate-50 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Visual Comparison
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Bar chart across selected campaigns
          </p>
        </div>

        <div className="flex gap-0.5 bg-slate-100 rounded-lg p-0.5 flex-wrap">
          {(Object.keys(CHART_METRICS) as ChartMetric[]).map((key) => (
            <button
              key={key}
              onClick={() => setActiveMetric(key)}
              className={`px-2.5 py-1.5 text-[11px] font-medium rounded-md transition-all cursor-pointer ${
                activeMetric === key
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {CHART_METRICS[key].label}
            </button>
          ))}
        </div>
      </div>

      <div ref={chartRef} style={{ height: 260, width: "100%" }} />
    </div>
  );
};

export default ComparisonBarCharts;
