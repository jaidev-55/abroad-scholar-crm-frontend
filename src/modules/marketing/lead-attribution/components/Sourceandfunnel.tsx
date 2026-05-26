import { useEffect, useRef, useMemo, useState } from "react";
import * as echarts from "echarts";
import type { SourceBreakdown, FunnelStage } from "../types";
import { SOURCE_CONFIG } from "../types/Constants";
import { formatNumber } from "../utils/Leadattributionhelpers";

// ═══════ SOURCE DONUT ═══════
interface SourceProps {
  data: SourceBreakdown[];
  loading?: boolean;
}

export const SourceDonutChart: React.FC<SourceProps> = ({ data, loading }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [isReady, setIsReady] = useState(false);

  const total = useMemo(() => data.reduce((s, d) => s + d.leads, 0), [data]);

  const option = useMemo(
    (): echarts.EChartsOption => ({
      tooltip: {
        trigger: "item",
        backgroundColor: "#fff",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        padding: [10, 14],
        textStyle: { fontSize: 12, color: "#334155" },
        extraCssText:
          "border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);",
        formatter: (params: any) =>
          `<div style="font-weight:600;margin-bottom:4px">${params.name}</div>
           <div>${params.value} leads (${params.percent}%)</div>`,
      },
      legend: { show: false },
      series: [
        {
          type: "pie",
          radius: ["55%", "78%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: "#fff",
            borderWidth: 3,
          },
          label: {
            show: true,
            position: "center",
            formatter: () =>
              `{val|${formatNumber(total)}}\n{label|Total Leads}`,
            rich: {
              val: {
                fontSize: 22,
                fontWeight: "bold" as const,
                color: "#1e293b",
                lineHeight: 30,
              },
              label: { fontSize: 11, color: "#94a3b8", lineHeight: 18 },
            },
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: "bold" as const,
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0,0,0,0.12)",
            },
          },
          data: data.map((d) => ({
            value: d.leads,
            name: SOURCE_CONFIG[d.source]?.label || d.source,
            itemStyle: { color: d.color },
          })),
        },
      ],
      animation: true,
      animationDuration: 600,
    }),
    [data, total],
  );

  // Init chart on mount
  useEffect(() => {
    if (!chartRef.current) return;

    // Small delay to ensure DOM is painted
    const timer = setTimeout(() => {
      if (!chartRef.current) return;
      chartInstance.current = echarts.init(chartRef.current);
      setIsReady(true);

      const handleResize = () => chartInstance.current?.resize();
      window.addEventListener("resize", handleResize);

      // Cleanup stored on ref for access in unmount
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

  // Update chart when option or data changes
  useEffect(() => {
    if (!isReady || !chartInstance.current || data.length === 0) return;
    chartInstance.current.setOption(option, true);
  }, [option, isReady, data]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
        <div className="h-5 w-32 bg-slate-200 rounded mb-4" />
        <div className="h-[220px] bg-slate-50 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <h3 className="text-sm font-bold text-slate-800 mb-1">Lead Sources</h3>
      <p className="text-xs text-slate-400 mb-4">Where your leads come from</p>

      <div
        ref={chartRef}
        style={{ height: 220, width: "100%", minHeight: 220 }}
      />

      {/* Legend */}
      <div className="space-y-2 mt-4">
        {data.map((d) => {
          const cfg = SOURCE_CONFIG[d.source];
          return (
            <div key={d.source} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${cfg?.dot || "bg-slate-400"}`}
                />
                <span className="text-xs text-slate-600">
                  {cfg?.label || d.source}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-800">
                  {d.leads}
                </span>
                <span className="text-[10px] text-emerald-500 font-semibold">
                  {d.conversionRate}% conv.
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ═══════ PIPELINE FUNNEL ═══════
interface FunnelProps {
  data: FunnelStage[];
  loading?: boolean;
}

export const PipelineFunnel: React.FC<FunnelProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
        <div className="h-5 w-32 bg-slate-200 rounded mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-slate-50 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <h3 className="text-sm font-bold text-slate-800 mb-1">Pipeline Funnel</h3>
      <p className="text-xs text-slate-400 mb-5">
        Lead journey from capture to conversion
      </p>

      <div className="space-y-3">
        {data.map((stage, i) => (
          <div key={stage.stage}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-700">
                {stage.stage}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-slate-900">
                  {stage.count}
                </span>
                <span className="text-[10px] text-slate-400">
                  {stage.percentage}%
                </span>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${stage.percentage}%`,
                    backgroundColor: stage.color,
                    minWidth: stage.percentage > 0 ? 8 : 0,
                  }}
                />
              </div>
              {i > 0 && stage.dropoff > 0 && (
                <span className="absolute right-0 -top-0.5 text-[9px] font-semibold text-red-400">
                  -{stage.dropoff}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
