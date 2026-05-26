import { useRef, useEffect } from "react";
import * as echarts from "echarts";
import type { SubmissionTrendPoint } from "../types";

interface Props {
  data: SubmissionTrendPoint[];
  loading?: boolean;
}

const SubmissionTrendChart: React.FC<Props> = ({ data, loading }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (loading || !chartRef.current || !data.length) return;

    const chart = echarts.init(chartRef.current);
    instanceRef.current = chart;

    const labels = data.map((d) => {
      const dt = new Date(d.date);
      return `${dt.toLocaleString("default", { month: "short" })} ${dt.getDate()}`;
    });

    chart.setOption({
      tooltip: {
        trigger: "axis",
        backgroundColor: "#fff",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        textStyle: { color: "#334155", fontSize: 12 },
        padding: [10, 14],
        extraCssText:
          "box-shadow: 0 4px 14px rgba(0,0,0,.08); border-radius: 10px;",
      },
      legend: {
        bottom: 0,
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 20,
        textStyle: { color: "#94a3b8", fontSize: 11 },
        icon: "roundRect",
      },
      grid: { top: 20, right: 16, bottom: 50, left: 48 },
      xAxis: {
        type: "category",
        data: labels,
        boundaryGap: false,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: "#94a3b8", fontSize: 11 },
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: "#94a3b8", fontSize: 11 },
        splitLine: { lineStyle: { color: "#f1f5f9", type: "dashed" } },
      },
      series: [
        {
          name: "Submissions",
          type: "line",
          data: data.map((d) => d.submissions),
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2.5, color: "#3b82f6" },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(59,130,246,0.18)" },
              { offset: 1, color: "rgba(59,130,246,0.01)" },
            ]),
          },
          itemStyle: { color: "#3b82f6" },
        },
        {
          name: "Synced",
          type: "line",
          data: data.map((d) => d.synced),
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2, color: "#10b981" },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(16,185,129,0.12)" },
              { offset: 1, color: "rgba(16,185,129,0.01)" },
            ]),
          },
          itemStyle: { color: "#10b981" },
        },
        {
          name: "Converted",
          type: "line",
          data: data.map((d) => d.converted),
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2, color: "#8b5cf6", type: "dashed" },
          itemStyle: { color: "#8b5cf6" },
        },
      ],
    });

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
      instanceRef.current = null;
    };
  }, [data, loading]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className="mb-1">
        <h3 className="text-sm font-bold text-slate-800">Submission Trend</h3>
        <p className="text-[11px] text-slate-400">
          Submissions, synced & converted over time
        </p>
      </div>
      {loading ? (
        <div className="w-full h-[300px] animate-pulse bg-slate-50 rounded-xl" />
      ) : (
        <div ref={chartRef} className="w-full h-[300px]" />
      )}
    </div>
  );
};

export default SubmissionTrendChart;
