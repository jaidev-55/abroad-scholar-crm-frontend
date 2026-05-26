import { useEffect, useRef, useMemo } from "react";
import * as echarts from "echarts";
import type { SyncVolumePoint } from "../types/Index";


interface Props {
  data: SyncVolumePoint[];
  loading?: boolean;
}

const SyncVolumeChart: React.FC<Props> = ({ data, loading }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const option = useMemo(
    (): echarts.EChartsOption => ({
      grid: { top: 30, right: 16, bottom: 30, left: 40, containLabel: false },
      legend: {
        top: 0,
        right: 0,
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 14,
        textStyle: { fontSize: 11, color: "#64748b" },
      },
      xAxis: {
        type: "category",
        data: data.map((d) => d.hour),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { fontSize: 10, color: "#94a3b8", interval: 2 },
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
        padding: [8, 12],
        textStyle: { fontSize: 11, color: "#334155" },
        extraCssText:
          "border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);",
      },
      series: [
        {
          name: "Success",
          type: "bar",
          stack: "sync",
          data: data.map((d) => d.success),
          itemStyle: { color: "#10b981", borderRadius: [0, 0, 0, 0] },
          barWidth: "60%",
        },
        {
          name: "Failed",
          type: "bar",
          stack: "sync",
          data: data.map((d) => d.failed),
          itemStyle: { color: "#ef4444", borderRadius: [3, 3, 0, 0] },
        },
      ],
      animation: true,
      animationDuration: 500,
    }),
    [data],
  );

  useEffect(() => {
    if (!chartRef.current) return;
    const timer = setTimeout(() => {
      if (!chartRef.current) return;
      chartInstance.current = echarts.init(chartRef.current);
      chartInstance.current.setOption(option, true);
      const handleResize = () => chartInstance.current?.resize();
      window.addEventListener("resize", handleResize);
      (chartRef.current as any).__cleanup = () => {
        window.removeEventListener("resize", handleResize);
        chartInstance.current?.dispose();
        chartInstance.current = null;
      };
    }, 100);
    return () => {
      clearTimeout(timer);
      if ((chartRef.current as any)?.__cleanup) {
        (chartRef.current as any).__cleanup();
      }
    };
  }, []);

  useEffect(() => {
    if (!chartInstance.current || data.length === 0) return;
    chartInstance.current.setOption(option, true);
  }, [option]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
        <div className="h-5 w-32 bg-slate-200 rounded mb-4" />
        <div className="h-[200px] bg-slate-50 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-800">Sync Volume (24h)</h3>
        <p className="text-xs text-slate-400 mt-0.5">Hourly webhook activity</p>
      </div>
      <div ref={chartRef} style={{ height: 200, width: "100%" }} />
    </div>
  );
};

export default SyncVolumeChart;
