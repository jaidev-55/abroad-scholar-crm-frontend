import { useState, useMemo, useEffect, useRef } from "react";
import * as echarts from "echarts";
import type { SpendTrendPoint } from "../types";
import { formatCurrency } from "../utils/spendRoiHelpers";

interface Props {
  data: SpendTrendPoint[];
  loading?: boolean;
}

type MetricKey = "spend" | "leads" | "cpl";

const METRIC_CONFIG: Record<
  MetricKey,
  { label: string; color: string; formatter: (v: number) => string }
> = {
  spend: { label: "Spend", color: "#3b82f6", formatter: formatCurrency },
  leads: { label: "Leads", color: "#8b5cf6", formatter: (v) => String(v) },
  cpl: { label: "Cost / Lead", color: "#f59e0b", formatter: formatCurrency },
};

const SpendTrendChart: React.FC<Props> = ({ data, loading }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [activeMetric, setActiveMetric] = useState<MetricKey>("spend");

  const config = METRIC_CONFIG[activeMetric];

  const dates = useMemo(
    () =>
      data.map((d) =>
        new Date(d.date).toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
        }),
      ),
    [data],
  );

  const values = useMemo(
    () => data.map((d) => d[activeMetric]),
    [data, activeMetric],
  );

  const chartOption = useMemo(
    (): echarts.EChartsOption => ({
      grid: {
        top: 20,
        right: 16,
        bottom: 30,
        left: 55,
        containLabel: false,
      },
      xAxis: {
        type: "category",
        data: dates,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          fontSize: 11,
          color: "#94a3b8",
          interval: "auto",
        },
        boundaryGap: false,
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: {
          lineStyle: { color: "#f1f5f9", type: "dashed" },
        },
        axisLabel: {
          fontSize: 11,
          color: "#94a3b8",
          formatter: (v: number) =>
            activeMetric === "leads" ? String(v) : `₹${(v / 1000).toFixed(0)}k`,
        },
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "#fff",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        padding: [10, 14],
        textStyle: { fontSize: 12, color: "#334155" },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          const item = Array.isArray(params) ? params[0] : params;
          return `
            <div style="font-weight:600;margin-bottom:4px">${item.name}</div>
            <div style="display:flex;align-items:center;gap:6px">
              <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${config.color}"></span>
              <span>${config.label}:</span>
              <strong>${config.formatter(item.value)}</strong>
            </div>
          `;
        },
        extraCssText:
          "border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);",
      },
      series: [
        {
          type: "line",
          data: values,
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          showSymbol: false,
          lineStyle: {
            color: config.color,
            width: 2.5,
          },
          itemStyle: {
            color: config.color,
            borderColor: "#fff",
            borderWidth: 2,
          },
          emphasis: {
            itemStyle: {
              color: config.color,
              borderColor: "#fff",
              borderWidth: 2,
              shadowBlur: 8,
              shadowColor: `${config.color}40`,
            },
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `${config.color}20` },
              { offset: 1, color: `${config.color}02` },
            ]),
          },
        },
      ],
      animation: true,
      animationDuration: 600,
      animationEasing: "cubicOut",
    }),
    [dates, values, activeMetric, config],
  );

  // Initialize chart once on mount
  useEffect(() => {
    if (!chartRef.current) return;

    // Dispose any existing instance first
    if (chartInstance.current) {
      chartInstance.current.dispose();
    }

    chartInstance.current = echarts.init(chartRef.current);

    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, []);

  // Update chart whenever option changes OR data arrives
  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    // If chart instance doesn't exist yet (race condition), create it
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    chartInstance.current.setOption(chartOption, true);
  }, [chartOption, data]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
        <div className="h-5 w-32 bg-slate-200 rounded mb-4" />
        <div className="h-[280px] bg-slate-50 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Spend & Lead Trend
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Daily performance over selected period
          </p>
        </div>

        {/* Metric toggle */}
        <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
          {(Object.keys(METRIC_CONFIG) as MetricKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setActiveMetric(key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                activeMetric === key
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {METRIC_CONFIG[key].label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart container */}
      <div ref={chartRef} style={{ height: 280, width: "100%" }} />
    </div>
  );
};

export default SpendTrendChart;
