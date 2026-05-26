import { useRef, useEffect } from "react";
import * as echarts from "echarts";
import type { HourlyHeatmapCell } from "../types";

interface Props {
  data: HourlyHeatmapCell[];
  loading?: boolean;
}

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const hourLabels = Array.from({ length: 24 }, (_, i) =>
  i === 0 ? "12a" : i < 12 ? `${i}a` : i === 12 ? "12p" : `${i - 12}p`,
);

const SubmissionHeatmap: React.FC<Props> = ({ data, loading }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (loading || !chartRef.current || !data.length) return;

    const chart = echarts.init(chartRef.current);
    instanceRef.current = chart;

    const maxVal = Math.max(...data.map((d) => d.value));

    chart.setOption({
      tooltip: {
        trigger: "item",
        backgroundColor: "#fff",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        textStyle: { color: "#334155", fontSize: 12 },
        padding: [10, 14],
        extraCssText:
          "box-shadow: 0 4px 14px rgba(0,0,0,.08); border-radius: 10px;",
        formatter: (p: any) => {
          const [hour, day] = p.data;
          return `<b>${dayLabels[day]}</b> at <b>${hourLabels[hour]}</b><br/>Submissions: <b>${p.data[2]}</b>`;
        },
      },
      grid: { top: 8, right: 12, bottom: 40, left: 44 },
      xAxis: {
        type: "category",
        data: hourLabels,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: "#94a3b8", fontSize: 10, interval: 2 },
        splitArea: { show: false },
      },
      yAxis: {
        type: "category",
        data: dayLabels,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: "#94a3b8", fontSize: 11 },
        splitArea: { show: false },
      },
      visualMap: {
        min: 0,
        max: maxVal,
        show: false,
        inRange: {
          color: [
            "#f0f9ff",
            "#bae6fd",
            "#7dd3fc",
            "#38bdf8",
            "#0ea5e9",
            "#0284c7",
            "#0369a1",
          ],
        },
      },
      series: [
        {
          type: "heatmap",
          data: data.map((d) => [d.hour, d.day, d.value]),
          label: { show: false },
          itemStyle: {
            borderRadius: 3,
            borderColor: "#fff",
            borderWidth: 2,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 8,
              shadowColor: "rgba(0,0,0,0.15)",
            },
          },
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
        <h3 className="text-sm font-bold text-slate-800">Submission Heatmap</h3>
        <p className="text-[11px] text-slate-400">
          When leads submit forms (day × hour)
        </p>
      </div>
      {loading ? (
        <div className="w-full h-[240px] animate-pulse bg-slate-50 rounded-xl" />
      ) : (
        <div ref={chartRef} className="w-full h-[240px]" />
      )}
    </div>
  );
};

export default SubmissionHeatmap;
