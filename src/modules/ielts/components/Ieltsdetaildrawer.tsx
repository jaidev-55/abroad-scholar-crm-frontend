import React, { useRef, useEffect, useCallback, useState } from "react";
import { Drawer } from "antd";
import * as echarts from "echarts";
import {
  RiCalendarLine,
  RiUser3Line,
  RiGraduationCapLine,
  RiGlobalLine,
  RiFileTextLine,
  RiCloseLine,
} from "react-icons/ri";
import type { IeltsRecord } from "../Types";
import { MODULE_LABELS } from "../Types/Constants";
import { daysUntilExam, meetsTarget, formatDate } from "../utils/Helpers";
import IeltsStatusTag from "./Ieltsstatustag";
import ScoreBadge from "./Scorebadge";
import ScoreProgress from "./Scoreprogress";

interface DetailDrawerProps {
  open: boolean;
  record: IeltsRecord | null;
  onClose: () => void;
}

const IeltsDetailDrawer: React.FC<DetailDrawerProps> = ({
  open,
  record,
  onClose,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [drawerReady, setDrawerReady] = useState(false);

  const buildChart = useCallback(() => {
    if (!chartRef.current || !record) return;

    // Dispose old instance
    if (chartInstance.current) {
      chartInstance.current.dispose();
      chartInstance.current = null;
    }

    const chart = echarts.init(chartRef.current, undefined, {
      renderer: "canvas",
    });
    chartInstance.current = chart;

    const modules = ["listening", "reading", "writing", "speaking"] as const;
    const moduleLabels = ["Listening", "Reading", "Writing", "Speaking"];
    const currentScores = modules.map((m) => record.currentScore?.[m] ?? 0);
    const targetScores = modules.map((m) => record.targetScore[m]);

    chart.setOption({
      tooltip: {
        trigger: "axis",
        backgroundColor: "#fff",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        textStyle: { color: "#334155", fontSize: 12 },
      },
      legend: {
        data: ["Current", "Target"],
        bottom: 0,
        itemWidth: 12,
        itemHeight: 8,
        textStyle: { fontSize: 11, color: "#94a3b8" },
        itemGap: 20,
      },
      grid: {
        left: 10,
        right: 10,
        top: 15,
        bottom: 40,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: moduleLabels,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { fontSize: 11, color: "#64748b", fontWeight: 600 },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 9,
        interval: 1.5,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: {
          lineStyle: { color: "#f1f5f9", type: "dashed" },
        },
        axisLabel: {
          fontSize: 10,
          color: "#94a3b8",
          formatter: (v: number) => v.toFixed(1),
        },
      },
      series: [
        {
          name: "Current",
          type: "bar",
          data: currentScores,
          barWidth: 20,
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#3b82f6" },
              { offset: 1, color: "#6366f1" },
            ]),
          },
          label: {
            show: true,
            position: "top",
            fontSize: 11,
            fontWeight: 700,
            color: "#3b82f6",
            formatter: (p: { value: number }) =>
              p.value > 0 ? p.value.toFixed(1) : "",
          },
        },
        {
          name: "Target",
          type: "bar",
          data: targetScores,
          barWidth: 20,
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
            color: "rgba(239,68,68,0.15)",
            borderColor: "#ef4444",
            borderWidth: 1,
            borderType: "dashed",
          },
          label: {
            show: true,
            position: "top",
            fontSize: 10,
            color: "#ef4444",
            formatter: (p: { value: number }) => p.value.toFixed(1),
          },
        },
      ],
      animation: true,
      animationDuration: 600,
      animationEasing: "cubicOut",
    });

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [record]);

  // Build chart once drawer animation finishes AND we have a record
  useEffect(() => {
    if (drawerReady && record) {
      buildChart();
    }
  }, [drawerReady, record, buildChart]);

  // Reset drawerReady when closed
  useEffect(() => {
    if (!open) {
      setDrawerReady(false);
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    }
  }, [open]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      chartInstance.current?.dispose();
    };
  }, []);

  if (!record) return null;

  const days = daysUntilExam(record.examDate);
  const targetMet = meetsTarget(record.currentScore, record.targetScore);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={460}
      closable={false}
      styles={{ body: { padding: 0 } }}
      afterOpenChange={(visible) => {
        if (visible) {
          setDrawerReady(true);
        }
      }}
    >
      <div className="flex flex-col h-full">
        {/* ── Header ── */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 px-6 py-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <RiCloseLine size={18} />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-lg font-bold backdrop-blur-sm uppercase">
              {record.studentName
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight">
                {record.studentName}
              </h2>
              <p className="text-blue-100 text-[13px] mt-0.5">
                {record.country} · {record.examType}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <IeltsStatusTag status={record.status} />
            {days !== null && days >= 0 && (
              <span
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                  days <= 7
                    ? "bg-red-500/20 text-red-100"
                    : days <= 14
                      ? "bg-amber-500/20 text-amber-100"
                      : "bg-white/20 text-white"
                }`}
              >
                {days === 0 ? "Exam Today!" : `${days} days to exam`}
              </span>
            )}
            {targetMet && (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-100">
                🎯 Target Met
              </span>
            )}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <InfoItem
              icon={<RiCalendarLine size={14} />}
              label="Exam Date"
              value={formatDate(record.examDate)}
            />
            <InfoItem
              icon={<RiUser3Line size={14} />}
              label="Counselor"
              value={record.counselor}
            />
            <InfoItem
              icon={<RiGraduationCapLine size={14} />}
              label="University"
              value={record.university || "—"}
            />
            <InfoItem
              icon={<RiGlobalLine size={14} />}
              label="Required Score"
              value={record.requiredScore?.toString() || "—"}
            />
            <InfoItem
              icon={<RiFileTextLine size={14} />}
              label="Registration ID"
              value={record.registrationId || "—"}
            />
            <InfoItem
              icon={<RiGraduationCapLine size={14} />}
              label="Attempts"
              value={record.attempts.toString()}
            />
          </div>

          <div className="h-px bg-slate-100" />

          {/* ── ECharts Bar Chart ── */}
          <div>
            <h3 className="text-[13px] font-bold text-slate-700 mb-2">
              Score Overview
            </h3>
            <div className="bg-slate-50/50 rounded-xl border border-slate-100 p-3">
              <div ref={chartRef} style={{ height: 220, width: "100%" }} />
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Module Progress Bars */}
          <div>
            <h3 className="text-[13px] font-bold text-slate-700 mb-3">
              Module Breakdown
            </h3>
            <div className="space-y-4">
              {MODULE_LABELS.map((mod) => (
                <ScoreProgress
                  key={mod.key}
                  label={mod.label}
                  icon={mod.icon}
                  current={
                    record.currentScore?.[
                      mod.key as keyof typeof record.currentScore
                    ] ?? null
                  }
                  target={
                    record.targetScore[
                      mod.key as keyof typeof record.targetScore
                    ]
                  }
                />
              ))}
            </div>

            {/* Overall */}
            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-[13px] font-bold text-slate-600">
                Overall Band
              </span>
              <div className="flex items-center gap-3">
                <ScoreBadge
                  score={record.currentScore?.overall ?? null}
                  size="lg"
                  showBand
                />
                <span className="text-[11px] text-slate-400">
                  Target: {record.targetScore.overall.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {record.notes && (
            <>
              <div className="h-px bg-slate-100" />
              <div>
                <h3 className="text-[13px] font-bold text-slate-700 mb-2">
                  Notes
                </h3>
                <p className="text-[13px] text-slate-500 leading-relaxed bg-slate-50 rounded-xl p-3 border border-slate-100">
                  {record.notes}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </Drawer>
  );
};

const InfoItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50">
    <div className="text-slate-400 mt-0.5 shrink-0">{icon}</div>
    <div className="min-w-0">
      <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
        {label}
      </p>
      <p className="text-[13px] font-semibold text-slate-700 truncate">
        {value}
      </p>
    </div>
  </div>
);

export default IeltsDetailDrawer;
