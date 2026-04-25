import React, { useEffect, useRef, useCallback } from "react";
import * as echarts from "echarts";
import type { CallbackDataParams } from "echarts/types/dist/shared";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { RiBookOpenLine, RiBuilding2Line } from "react-icons/ri";

interface CategoryData {
  academic: number;
  admission: number;
  total: number;
}

interface Props {
  data?: CategoryData | null;
  isLoading?: boolean;
}

const ChartCard: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, children, className = "" }) => (
  <div
    className={`bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300 ${className}`}
  >
    <div className="flex items-start justify-between mb-5">
      <div>
        <h3 className="text-[15px] font-bold text-gray-800 tracking-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-0.5 font-medium">{subtitle}</p>
        )}
      </div>
      <button className="p-1.5 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-colors">
        <HiOutlineDotsVertical className="w-4 h-4" />
      </button>
    </div>
    {children}
  </div>
);

const Skeleton: React.FC = () => (
  <div className="animate-pulse flex flex-col gap-4">
    <div className="flex justify-center">
      <div className="w-44 h-44 rounded-full bg-slate-100/80" />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="h-[100px] rounded-xl bg-slate-100/80" />
      <div className="h-[100px] rounded-xl bg-slate-100/80" />
    </div>
  </div>
);

const CategoryDistributionChart: React.FC<Props> = ({ data, isLoading }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);

  const academic = data?.academic ?? 0;
  const admission = data?.admission ?? 0;
  const total = data?.total ?? academic + admission;
  const uncategorised = Math.max(0, total - academic - admission);

  const academicPct = total > 0 ? Math.round((academic / total) * 100) : 0;
  const admissionPct = total > 0 ? Math.round((admission / total) * 100) : 0;
  const hasData = academic > 0 || admission > 0;

  const buildChart = useCallback(() => {
    if (!chartRef.current) return;

    if (instanceRef.current) {
      instanceRef.current.dispose();
      instanceRef.current = null;
    }

    instanceRef.current = echarts.init(chartRef.current, undefined, {
      renderer: "svg",
    });

    const hasAnyData = academic > 0 || admission > 0 || uncategorised > 0;

    const pieData = hasAnyData
      ? [
          {
            value: academic,
            name: "Academic",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#a78bfa" },
                { offset: 1, color: "#7c3aed" },
              ]),
            },
          },
          {
            value: admission,
            name: "Admission",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#38bdf8" },
                { offset: 1, color: "#0284c7" },
              ]),
            },
          },
          ...(uncategorised > 0
            ? [
                {
                  value: uncategorised,
                  name: "Uncategorised",
                  itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      { offset: 0, color: "#e2e8f0" },
                      { offset: 1, color: "#cbd5e1" },
                    ]),
                  },
                },
              ]
            : []),
        ]
      : [
          {
            value: 1,
            name: "No data",
            itemStyle: { color: "#f1f5f9" },
          },
        ];

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: "item",
        backgroundColor: "#1e293b",
        borderColor: "transparent",
        borderRadius: 10,
        padding: [8, 12],
        textStyle: { color: "#f8fafc", fontSize: 12 },
        formatter: (params: CallbackDataParams | CallbackDataParams[]) => {
          const p = Array.isArray(params) ? params[0] : params;
          return `<div style="padding:2px 0">
            <span style="font-weight:600">${p.name}</span><br/>
            <span style="opacity:0.75">${p.value} leads · ${
              typeof p.percent === "number" ? p.percent.toFixed(1) : p.percent
            }%</span>
          </div>`;
        },
      },
      series: [
        {
          type: "pie",
          radius: ["54%", "80%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: false,
          padAngle: 3,
          itemStyle: {
            borderRadius: 6,
          },
          label: { show: false },
          labelLine: { show: false },
          emphasis: {
            scale: true,
            scaleSize: 6,
            itemStyle: {
              shadowBlur: 16,
              shadowColor: "rgba(0,0,0,0.12)",
            },
          },
          data: pieData,
          animationType: "scale",
          animationEasing: "elasticOut",
          animationDelay: 100,
        },
      ],
    };

    instanceRef.current.setOption(option);
  }, [academic, admission, uncategorised]);

  // ── Effect ──────────────────────────────────────────────
  useEffect(() => {
    if (isLoading) return;

    buildChart();

    const container = chartRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => instanceRef.current?.resize());
    ro.observe(container);

    return () => {
      ro.disconnect();
      instanceRef.current?.dispose();
      instanceRef.current = null;
    };
  }, [buildChart, isLoading]);

  // ── Loading ─────────────────────────────────────────────
  if (isLoading) {
    return (
      <ChartCard
        title="Category Distribution"
        subtitle="Academic vs Admission breakdown"
      >
        <Skeleton />
      </ChartCard>
    );
  }

  return (
    <ChartCard
      title="Category Distribution"
      subtitle="Academic vs Admission breakdown"
    >
      {/* Donut chart with centre label */}
      <div className="relative">
        <div ref={chartRef} style={{ height: 200, width: "100%" }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-extrabold text-slate-800 leading-none">
            {total}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 mt-0.5 uppercase tracking-widest">
            Total
          </span>
        </div>
      </div>

      {/* Stat cards */}
      {hasData ? (
        <div className="grid grid-cols-2 gap-3 mt-4">
          {/* Academic */}
          <div className="relative overflow-hidden rounded-xl p-3.5 bg-violet-50/80 border border-violet-100 transition-transform duration-200 hover:scale-[1.02]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
                <RiBookOpenLine size={14} className="text-violet-600" />
              </div>
              <span className="text-[11px] font-bold text-violet-600 uppercase tracking-wide">
                Academic
              </span>
            </div>
            <div className="text-2xl font-extrabold text-violet-800 leading-none">
              {academic}
            </div>
            <div className="text-[11px] text-violet-400 font-semibold mt-0.5">
              {academicPct}% of total
            </div>
            <div className="mt-2.5 h-1 rounded-full bg-violet-100 overflow-hidden">
              <div
                className="h-1 rounded-full bg-violet-500 transition-all duration-700 ease-out"
                style={{ width: `${academicPct}%` }}
              />
            </div>
          </div>

          {/* Admission */}
          <div className="relative overflow-hidden rounded-xl p-3.5 bg-sky-50/80 border border-sky-100 transition-transform duration-200 hover:scale-[1.02]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center">
                <RiBuilding2Line size={14} className="text-sky-600" />
              </div>
              <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wide">
                Admission
              </span>
            </div>
            <div className="text-2xl font-extrabold text-sky-800 leading-none">
              {admission}
            </div>
            <div className="text-[11px] text-sky-400 font-semibold mt-0.5">
              {admissionPct}% of total
            </div>
            <div className="mt-2.5 h-1 rounded-full bg-sky-100 overflow-hidden">
              <div
                className="h-1 rounded-full bg-sky-500 transition-all duration-700 ease-out"
                style={{ width: `${admissionPct}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 py-8 flex flex-col items-center justify-center text-slate-400">
          <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
            <RiBookOpenLine size={18} className="text-slate-300" />
          </div>
          <p className="text-sm font-semibold text-slate-400">
            No category data yet
          </p>
          <p className="text-xs text-slate-300 mt-1">
            Assign categories to see the breakdown
          </p>
        </div>
      )}

      {/* Uncategorised note */}
      {uncategorised > 0 && (
        <p className="text-[10px] text-slate-400 mt-3 text-center font-medium">
          + {uncategorised} uncategorised lead{uncategorised > 1 ? "s" : ""}
        </p>
      )}
    </ChartCard>
  );
};

export default CategoryDistributionChart;
