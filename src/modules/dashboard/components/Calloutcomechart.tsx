import React, { useEffect, useRef, useCallback } from "react";
import * as echarts from "echarts";
import { HiOutlineDotsVertical } from "react-icons/hi";
import {
  RiCheckboxCircleLine,
  RiStarLine,
  RiCalendarCheckLine,
  RiCloseCircleLine,
  RiPhoneLine,
  RiVoiceprintLine,
} from "react-icons/ri";
import type { IconType } from "react-icons";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CallOutcomeData {
  INTERESTED?: number;
  CONVERTED?: number;
  SCHEDULE_CALLBACK?: number;
  NOT_INTERESTED?: number;
  NO_ANSWER?: number;
  VOICEMAIL?: number;
}

interface Props {
  data?: CallOutcomeData | null;
  totalCalls?: number;
  isLoading?: boolean;
}

interface OutcomeConfig {
  key: keyof CallOutcomeData;
  label: string;
  color: string;
  lightColor: string;
  bgClass: string;
  icon: IconType;
}

interface OutcomeValue extends OutcomeConfig {
  count: number;
}

// ─── Outcome config ───────────────────────────────────────────────────────────

const OUTCOMES: OutcomeConfig[] = [
  {
    key: "INTERESTED",
    label: "Interested",
    color: "#10b981",
    lightColor: "#d1fae5",
    bgClass: "bg-emerald-50",
    icon: RiCheckboxCircleLine,
  },
  {
    key: "CONVERTED",
    label: "Converted",
    color: "#8b5cf6",
    lightColor: "#ede9fe",
    bgClass: "bg-violet-50",
    icon: RiStarLine,
  },
  {
    key: "SCHEDULE_CALLBACK",
    label: "Callback",
    color: "#f59e0b",
    lightColor: "#fef3c7",
    bgClass: "bg-amber-50",
    icon: RiCalendarCheckLine,
  },
  {
    key: "NOT_INTERESTED",
    label: "Not Interested",
    color: "#ef4444",
    lightColor: "#fee2e2",
    bgClass: "bg-red-50",
    icon: RiCloseCircleLine,
  },
  {
    key: "NO_ANSWER",
    label: "RNR / Not Picked",
    color: "#64748b",
    lightColor: "#f1f5f9",
    bgClass: "bg-slate-50",
    icon: RiPhoneLine,
  },
  {
    key: "VOICEMAIL",
    label: "Voicemail",
    color: "#0ea5e9",
    lightColor: "#e0f2fe",
    bgClass: "bg-sky-50",
    icon: RiVoiceprintLine,
  },
];

// ─── ChartCard wrapper (matches your dashboard cards) ─────────────────────────

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

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const Skeleton: React.FC = () => (
  <div className="animate-pulse space-y-4">
    <div className="grid grid-cols-3 gap-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-[76px] rounded-xl bg-slate-100/80" />
      ))}
    </div>
    <div className="h-[220px] rounded-xl bg-slate-100/80" />
    <div className="flex gap-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-5 w-20 rounded-full bg-slate-100/80" />
      ))}
    </div>
  </div>
);

// ─── Stat Pill ────────────────────────────────────────────────────────────────

const StatPill: React.FC<{
  label: string;
  value: string | number;
  sub: string;
  colorClass: string;
  labelClass: string;
  valueClass: string;
  subClass: string;
}> = ({ label, value, sub, colorClass, labelClass, valueClass, subClass }) => (
  <div
    className={`rounded-xl p-3 border text-center transition-transform duration-200 hover:scale-[1.02] ${colorClass}`}
  >
    <p
      className={`text-[10px] font-bold uppercase tracking-[0.1em] mb-0.5 ${labelClass}`}
    >
      {label}
    </p>
    <p className={`text-xl font-extrabold leading-tight ${valueClass}`}>
      {value}
    </p>
    <p className={`text-[10px] font-medium mt-0.5 ${subClass}`}>{sub}</p>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const CallOutcomeChart: React.FC<Props> = ({ data, totalCalls, isLoading }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // ── Derived values ──────────────────────────────────────
  const values: OutcomeValue[] = OUTCOMES.map((o) => ({
    ...o,
    count: data?.[o.key] ?? 0,
  }));

  const total = totalCalls ?? values.reduce((sum, v) => sum + v.count, 0);
  const positive = (data?.INTERESTED ?? 0) + (data?.CONVERTED ?? 0);
  const positiveRate = total > 0 ? Math.round((positive / total) * 100) : 0;
  const hasData = values.some((v) => v.count > 0);

  // ── Chart builder ───────────────────────────────────────
  const buildChart = useCallback(() => {
    if (!chartRef.current) return;

    // Dispose old instance cleanly
    if (chartInstance.current) {
      chartInstance.current.dispose();
      chartInstance.current = null;
    }

    chartInstance.current = echarts.init(chartRef.current, undefined, {
      renderer: "svg",
    });

    const sorted = [...values]
      .filter((v) => v.count > 0)
      .sort((a, b) => b.count - a.count); // descending — tallest bar on the left

    const option: echarts.EChartsOption = {
      grid: { top: 28, bottom: 48, left: 12, right: 12 },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
          shadowStyle: { color: "rgba(0,0,0,0.03)" },
        },
        backgroundColor: "#1e293b",
        borderColor: "transparent",
        borderRadius: 10,
        padding: [8, 12],
        textStyle: { color: "#f8fafc", fontSize: 12 },
        formatter: (
          params:
            | echarts.DefaultLabelFormatterCallbackParams
            | echarts.DefaultLabelFormatterCallbackParams[],
        ) => {
          const p = Array.isArray(params) ? params[0] : params;
          const pct =
            total > 0 ? (((p.value as number) / total) * 100).toFixed(1) : "0";
          return `<div style="padding:2px 0">
            <span style="font-weight:600">${p.name}</span><br/>
            <span style="opacity:0.75">${p.value} calls · ${pct}%</span>
          </div>`;
        },
      },
      xAxis: {
        type: "category",
        data: sorted.map((v) => v.label),
        axisLabel: {
          color: "#475569",
          fontSize: 10,
          fontWeight: 500,
          interval: 0,
          width: 72,
          overflow: "truncate",
        },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: "#f1f5f9", type: "dashed" } },
        axisLabel: { color: "#94a3b8", fontSize: 11 },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      series: [
        {
          type: "bar",
          data: sorted.map((v) => ({
            value: v.count,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: v.lightColor },
                { offset: 1, color: v.color },
              ]),
              borderRadius: [6, 6, 0, 0],
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  { offset: 0, color: v.lightColor },
                  { offset: 1, color: v.color },
                ]),
                shadowBlur: 12,
                shadowColor: `${v.color}30`,
              },
            },
          })),
          barMaxWidth: 34,
          barMinWidth: 14,
          label: {
            show: true,
            position: "top",
            color: "#64748b",
            fontSize: 11,
            fontWeight: 600,
            formatter: (p: echarts.DefaultLabelFormatterCallbackParams) => {
              const val =
                typeof p.value === "number"
                  ? p.value
                  : Array.isArray(p.value)
                    ? Number(p.value[0])
                    : 0;
              return val > 0 ? String(val) : "";
            },
          },
          animationDuration: 800,
          animationEasing: "cubicOut",
          animationDelay: (idx: number) => idx * 80,
        },
      ],
    };

    chartInstance.current.setOption(option);
  }, [values, total]);

  // ── Effect: init chart + resize observer ────────────────
  useEffect(() => {
    if (isLoading || !hasData) return;

    buildChart();

    const container = chartRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => chartInstance.current?.resize());
    ro.observe(container);

    return () => {
      ro.disconnect();
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [buildChart, isLoading, hasData]);

  // ── Loading state ───────────────────────────────────────
  if (isLoading) {
    return (
      <ChartCard title="Call Outcomes" subtitle="Outcome breakdown by type">
        <Skeleton />
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Call Outcomes" subtitle="Outcome breakdown by type">
      {/* ── KPI pills ── */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <StatPill
          label="Total"
          value={total}
          sub="calls"
          colorClass="bg-slate-50 border-slate-100"
          labelClass="text-slate-400"
          valueClass="text-slate-800"
          subClass="text-slate-400"
        />
        <StatPill
          label="Positive"
          value={`${positiveRate}%`}
          sub="interested + converted"
          colorClass="bg-emerald-50/80 border-emerald-100"
          labelClass="text-emerald-500"
          valueClass="text-emerald-700"
          subClass="text-emerald-400"
        />
        <StatPill
          label="Converted"
          value={data?.CONVERTED ?? 0}
          sub="from calls"
          colorClass="bg-violet-50/80 border-violet-100"
          labelClass="text-violet-500"
          valueClass="text-violet-700"
          subClass="text-violet-400"
        />
      </div>

      {/* ── Chart or empty state ── */}
      {hasData ? (
        <div ref={chartRef} className="w-full" style={{ height: 240 }} />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
            <RiPhoneLine size={20} className="text-slate-300" />
          </div>
          <p className="text-sm font-semibold text-slate-400">
            No call data yet
          </p>
          <p className="text-xs text-slate-300 mt-1">
            Start logging calls to see outcome breakdowns
          </p>
        </div>
      )}

      {/* ── Legend pills ── */}
      {hasData && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          {values
            .filter((v) => v.count > 0)
            .sort((a, b) => b.count - a.count)
            .map((v) => {
              const pct = total > 0 ? Math.round((v.count / total) * 100) : 0;
              const Icon = v.icon;
              return (
                <span
                  key={v.key}
                  className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full text-[10px] font-semibold border transition-all duration-200 hover:scale-105 cursor-default"
                  style={{
                    background: v.lightColor,
                    color: v.color,
                    borderColor: `${v.color}25`,
                  }}
                >
                  <Icon size={10} />
                  {v.label} · {pct}%
                </span>
              );
            })}
        </div>
      )}
    </ChartCard>
  );
};

export default CallOutcomeChart;
