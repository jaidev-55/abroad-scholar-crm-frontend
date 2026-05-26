import { useRef, useEffect } from "react";
import * as echarts from "echarts";
import type { PlatformSplit } from "../types";

interface Props {
  data: PlatformSplit[];
  loading?: boolean;
}

const COLORS: Record<string, string> = {
  meta: "#1877F2",
  google: "#34A853",
};

const PlatformSplitChart: React.FC<Props> = ({ data, loading }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (loading || !chartRef.current || !data.length) return;

    const chart = echarts.init(chartRef.current);
    instanceRef.current = chart;

    const total = data.reduce((s, d) => s + d.submissions, 0);

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
        formatter: (p: any) =>
          `<b>${p.name}</b><br/>Submissions: <b>${p.value.toLocaleString()}</b><br/>Share: <b>${p.percent}%</b>`,
      },
      legend: {
        bottom: 8,
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 24,
        textStyle: { color: "#94a3b8", fontSize: 11 },
        icon: "circle",
      },
      series: [
        {
          type: "pie",
          radius: ["52%", "78%"],
          center: ["50%", "44%"],
          avoidLabelOverlap: false,
          padAngle: 3,
          itemStyle: { borderRadius: 6 },
          label: {
            show: true,
            position: "center",
            formatter: () => `{total|${total.toLocaleString()}}\n{sub|Total}`,
            rich: {
              total: {
                fontSize: 22,
                fontWeight: 800,
                color: "#1e293b",
                lineHeight: 28,
              },
              sub: { fontSize: 11, color: "#94a3b8", lineHeight: 18 },
            },
          },
          emphasis: {
            label: { show: true, fontSize: 22, fontWeight: 800 },
            scaleSize: 6,
          },
          data: data.map((d) => ({
            name: d.platform === "meta" ? "Meta" : "Google",
            value: d.submissions,
            itemStyle: { color: COLORS[d.platform] },
          })),
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
        <h3 className="text-sm font-bold text-slate-800">Platform Split</h3>
        <p className="text-[11px] text-slate-400">Submissions by ad platform</p>
      </div>
      {loading ? (
        <div className="w-full h-[300px] flex items-center justify-center">
          <div className="w-48 h-48 bg-slate-50 rounded-full animate-pulse" />
        </div>
      ) : (
        <div ref={chartRef} className="w-full h-[300px]" />
      )}
    </div>
  );
};

export default PlatformSplitChart;
