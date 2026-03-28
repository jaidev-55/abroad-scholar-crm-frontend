import { useState, useMemo, useEffect, useRef } from "react";
import * as echarts from "echarts";
import {
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
  HiOutlineUserGroup,
  HiOutlineCheckCircle,
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineDotsVertical,
  HiOutlineCalendar,
  
} from "react-icons/hi";

const generateLeadsData = () => {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const base = 20 + Math.sin(i * 0.4) * 12 + Math.cos(i * 0.2) * 8;
    data.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      leads: Math.max(8, Math.floor(base + Math.random() * 10)),
    });
  }
  return data;
};

const statusData = [
  { name: "New", value: 142, color: "#6366F1" },
  { name: "Contacted", value: 98, color: "#06B6D4" },
  { name: "IELTS Planning", value: 67, color: "#F59E0B" },
  { name: "Applied", value: 45, color: "#8B5CF6" },
  { name: "Converted", value: 38, color: "#10B981" },
  { name: "Lost", value: 22, color: "#EF4444" },
];

const funnelData = [
  { stage: "New Leads", value: 412, color: "#6366F1" },
  { stage: "Contacted", value: 298, color: "#06B6D4" },
  { stage: "IELTS Planning", value: 187, color: "#F59E0B" },
  { stage: "Applied", value: 124, color: "#8B5CF6" },
  { stage: "Converted", value: 76, color: "#10B981" },
];

const counselorData = [
  { name: "Sarah Khan", assigned: 85, converted: 32, overdue: 4 },
  { name: "Raj Patel", assigned: 72, converted: 28, overdue: 7 },
  { name: "Anita Menon", assigned: 68, converted: 25, overdue: 3 },
  { name: "David Lee", assigned: 60, converted: 18, overdue: 9 },
  { name: "Priya Singh", assigned: 55, converted: 22, overdue: 2 },
];

const sourceData = [
  { source: "Website", leads: 156, color: "#6366F1" },
  { source: "Facebook", leads: 98, color: "#3B82F6" },
  { source: "Instagram", leads: 74, color: "#EC4899" },
  { source: "Referral", leads: 62, color: "#10B981" },
  { source: "Walk-in", leads: 38, color: "#F59E0B" },
];

const monthlyData = [
  { month: "Jul", admissions: 12, revenue: 48000 },
  { month: "Aug", admissions: 18, revenue: 72000 },
  { month: "Sep", admissions: 15, revenue: 60000 },
  { month: "Oct", admissions: 22, revenue: 88000 },
  { month: "Nov", admissions: 28, revenue: 112000 },
  { month: "Dec", admissions: 24, revenue: 96000 },
  { month: "Jan", admissions: 31, revenue: 124000 },
  { month: "Feb", admissions: 35, revenue: 140000 },
];

/* ═══════════════════════════════════════════
   ECHART HOOK
   ═══════════════════════════════════════════ */
const useEChart = (option, style = {}) => {
  const ref = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    if (!chartRef.current) {
      chartRef.current = echarts.init(ref.current);
    }
    chartRef.current.setOption(option, true);
    const ro = new ResizeObserver(() => chartRef.current?.resize());
    ro.observe(ref.current);
    return () => {
      ro.disconnect();
    };
  }, [option]);

  useEffect(() => {
    return () => {
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, []);

  return <div ref={ref} style={{ width: "100%", height: 320, ...style }} />;
};

/* ═══════════════════════════════════════════
   KPI CARDS
   ═══════════════════════════════════════════ */
const kpiConfig = (totalLeads, converted) => [
  {
    icon: HiOutlineUserGroup,
    label: "Total Leads",
    value: totalLeads.toLocaleString(),
    change: "+12.5%",
    up: true,
    accent: "#6366F1",
    bgClass: "from-indigo-50 to-indigo-100/40",
  },
  {
    icon: HiOutlineCheckCircle,
    label: "Converted",
    value: converted.toString(),
    change: "+8.2%",
    up: true,
    accent: "#10B981",
    bgClass: "from-emerald-50 to-emerald-100/40",
  },
  {
    icon: HiOutlineChartBar,
    label: "Conversion Rate",
    value: `${((converted / totalLeads) * 100).toFixed(1)}%`,
    change: "+2.1%",
    up: true,
    accent: "#8B5CF6",
    bgClass: "from-violet-50 to-violet-100/40",
  },
  {
    icon: HiOutlineClock,
    label: "Avg. Response",
    value: "2.4h",
    change: "-0.3h",
    up: false,
    accent: "#F59E0B",
    bgClass: "from-amber-50 to-amber-100/40",
  },
];

const KPICard = ({ icon: Icon, label, value, change, up, accent, bgClass }) => (
  <div className="group relative bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition-all duration-300 hover:shadow-lg hover:shadow-gray-100/80 overflow-hidden">
    <div
      className={`absolute top-0 right-0 w-28 h-28 rounded-full bg-gradient-to-br ${bgClass} -translate-y-8 translate-x-8 opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
    />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${accent}12` }}
        >
          <Icon className="w-5 h-5" style={{ color: accent }} />
        </div>
        <span
          className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
            up ? "text-emerald-700 bg-emerald-50" : "text-amber-700 bg-amber-50"
          }`}
        >
          {up ? (
            <HiOutlineTrendingUp className="w-3.5 h-3.5" />
          ) : (
            <HiOutlineTrendingDown className="w-3.5 h-3.5" />
          )}
          {change}
        </span>
      </div>
      <p className="text-sm font-medium text-gray-400 tracking-wide">{label}</p>
      <p className="text-3xl font-extrabold text-gray-800 mt-1 tracking-tight">
        {value}
      </p>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   CHART CARD WRAPPER
   ═══════════════════════════════════════════ */
interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  className = "",
  actions,
}) => (
  <div
    className={`bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-gray-50 transition-all duration-300 ${className}`}
  >
    <div className="flex items-start justify-between mb-5">
      <div>
        <h3 className="text-base font-bold text-gray-800">{title}</h3>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-0.5 font-medium">{subtitle}</p>
        )}
      </div>
      {actions || (
        <button className="p-1.5 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-colors">
          <HiOutlineDotsVertical className="w-4 h-4" />
        </button>
      )}
    </div>
    {children}
  </div>
);

/* ═══════════════════════════════════════════
   1. LEADS TREND (ECharts Area)
   ═══════════════════════════════════════════ */
const LeadsTrendChart = () => {
  const data = useMemo(generateLeadsData, []);
  const option = useMemo(
    () => ({
      tooltip: {
        trigger: "axis",
        backgroundColor: "#fff",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        borderRadius: 12,
        padding: [10, 14],
        textStyle: { color: "#374151", fontSize: 13, fontFamily: "inherit" },
        formatter: (params) => {
          const p = params[0];
          return `<div style="font-size:12px;color:#9ca3af;margin-bottom:2px">${p.name}</div><div style="font-size:16px;font-weight:700;color:#1f2937">${p.value} <span style="font-size:12px;font-weight:400;color:#9ca3af">leads</span></div>`;
        },
        axisPointer: {
          lineStyle: { color: "#6366F1", width: 1, type: "dashed" },
        },
        extraCssText: "box-shadow: 0 8px 24px rgba(0,0,0,0.08);",
      },
      grid: { left: 44, right: 16, top: 20, bottom: 32 },
      xAxis: {
        type: "category",
        data: data.map((d) => d.date),
        boundaryGap: false,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: "#94a3b8",
          fontSize: 11,
          interval: 4,
          fontFamily: "inherit",
        },
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: "#f1f5f9", type: "dashed" } },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: "#94a3b8", fontSize: 11, fontFamily: "inherit" },
      },
      series: [
        {
          type: "line",
          data: data.map((d) => d.leads),
          smooth: 0.4,
          symbol: "circle",
          symbolSize: 6,
          showSymbol: false,
          lineStyle: {
            width: 3,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: "#6366F1" },
              { offset: 0.5, color: "#818CF8" },
              { offset: 1, color: "#06B6D4" },
            ]),
          },
          itemStyle: { color: "#6366F1", borderWidth: 2, borderColor: "#fff" },
          emphasis: {
            itemStyle: { shadowBlur: 12, shadowColor: "rgba(99,102,241,0.3)" },
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(99,102,241,0.15)" },
              { offset: 1, color: "rgba(99,102,241,0)" },
            ]),
          },
        },
      ],
    }),
    [data],
  );

  return useEChart(option, { height: 300 });
};

/* ═══════════════════════════════════════════
   2. DONUT CHART (ECharts)
   ═══════════════════════════════════════════ */
const DonutChart = () => {
  const total = statusData.reduce((s, d) => s + d.value, 0);
  const option = useMemo(
    () => ({
      tooltip: {
        trigger: "item",
        backgroundColor: "#fff",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        borderRadius: 12,
        padding: [10, 14],
        extraCssText: "box-shadow: 0 8px 24px rgba(0,0,0,0.08);",
        formatter: (p) =>
          `<div style="display:flex;align-items:center;gap:8px"><span style="width:8px;height:8px;border-radius:50%;background:${p.color};display:inline-block"></span><span style="font-weight:600;color:#374151">${p.name}</span></div><div style="margin-top:4px;font-size:12px;color:#6b7280">${p.value} leads · ${((p.value / total) * 100).toFixed(1)}%</div>`,
      },
      legend: {
        orient: "vertical",
        right: 10,
        top: "center",
        icon: "roundRect",
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 14,
        textStyle: { color: "#6b7280", fontSize: 13, fontFamily: "inherit" },
        formatter: (name) => {
          const item = statusData.find((d) => d.name === name);
          return `${name}  {val|${item.value}}`;
        },
        rich: {
          val: {
            fontWeight: 700,
            color: "#1f2937",
            fontSize: 13,
            padding: [0, 0, 0, 8],
            fontFamily: "inherit",
          },
        },
      },
      series: [
        {
          type: "pie",
          radius: ["54%", "78%"],
          center: ["32%", "50%"],
          avoidLabelOverlap: false,
          padAngle: 3,
          itemStyle: { borderRadius: 6 },
          label: {
            show: true,
            position: "center",
            formatter: () => `{total|${total}}\n{sub|Total Leads}`,
            rich: {
              total: {
                fontSize: 28,
                fontWeight: 800,
                color: "#1f2937",
                lineHeight: 36,
                fontFamily: "inherit",
              },
              sub: {
                fontSize: 12,
                color: "#94a3b8",
                lineHeight: 20,
                fontFamily: "inherit",
              },
            },
          },
          emphasis: {
            scale: true,
            scaleSize: 8,
            itemStyle: { shadowBlur: 16, shadowColor: "rgba(0,0,0,0.12)" },
          },
          data: statusData.map((d) => ({
            value: d.value,
            name: d.name,
            itemStyle: { color: d.color },
          })),
        },
      ],
    }),
    [total],
  );

  return useEChart(option, { height: 320 });
};

/* ═══════════════════════════════════════════
   3. FUNNEL CHART (ECharts)
   ═══════════════════════════════════════════ */
const FunnelChartComponent = () => {
  const option = useMemo(
    () => ({
      tooltip: {
        trigger: "item",
        backgroundColor: "#fff",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        borderRadius: 12,
        padding: [10, 14],
        extraCssText: "box-shadow: 0 8px 24px rgba(0,0,0,0.08);",
        formatter: (p) =>
          `<div style="font-weight:600;color:#374151">${p.name}</div><div style="font-size:12px;color:#6b7280;margin-top:4px">${p.value} leads · ${((p.value / funnelData[0].value) * 100).toFixed(1)}% of total</div>`,
      },
      series: [
        {
          type: "funnel",
          left: "10%",
          top: 10,
          bottom: 10,
          width: "80%",
          min: 0,
          max: funnelData[0].value,
          minSize: "20%",
          maxSize: "100%",
          sort: "descending",
          gap: 6,
          label: {
            show: true,
            position: "inside",
            formatter: (p) => `${p.name}\n{sub|${p.value}}`,
            rich: {
              sub: {
                fontSize: 11,
                color: "rgba(255,255,255,0.75)",
                fontFamily: "inherit",
              },
            },
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "inherit",
          },
          labelLine: { show: false },
          itemStyle: {
            borderWidth: 0,
            borderRadius: 6,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 16,
              shadowColor: "rgba(0,0,0,0.12)",
            },
          },
          data: funnelData.map((d) => ({
            value: d.value,
            name: d.stage,
            itemStyle: { color: d.color },
          })),
        },
      ],
    }),
    [],
  );

  return useEChart(option, { height: 320 });
};

/* ═══════════════════════════════════════════
   4. COUNSELOR PERFORMANCE (Table)
   ═══════════════════════════════════════════ */
const CounselorChart = () => {
  const maxAssigned = Math.max(...counselorData.map((d) => d.assigned));
  const avatarGradients = [
    "from-indigo-400 to-indigo-600",
    "from-cyan-400 to-cyan-600",
    "from-violet-400 to-violet-600",
    "from-amber-400 to-amber-600",
    "from-emerald-400 to-emerald-600",
  ];

  return (
    <div className="flex flex-col gap-1.5">
      <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        <span className="col-span-4">Counselor</span>
        <span className="col-span-2 text-center hidden sm:block">Assigned</span>
        <span className="col-span-3 text-center hidden sm:block">Progress</span>
        <span className="col-span-1 text-center">Rate</span>
        <span className="col-span-2 text-right">Status</span>
      </div>
      {counselorData.map((d, i) => {
        const convRate = ((d.converted / d.assigned) * 100).toFixed(0);
        const initials = d.name
          .split(" ")
          .map((n) => n[0])
          .join("");
        return (
          <div
            key={i}
            className="grid grid-cols-12 gap-2 items-center px-3 py-3 rounded-xl hover:bg-gray-50/80 transition-all duration-200 cursor-default group"
          >
            <div className="col-span-4 flex items-center gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarGradients[i]} flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-sm`}
              >
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-700 truncate">
                  {d.name}
                </p>
                <p className="text-[11px] text-gray-400">
                  {d.converted} converted
                </p>
              </div>
            </div>
            <div className="col-span-2 text-center hidden sm:block">
              <span className="text-sm font-semibold text-gray-600">
                {d.assigned}
              </span>
            </div>
            <div className="col-span-3 hidden sm:block px-1">
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden relative">
                <div
                  className="h-full rounded-full bg-gray-200/80 absolute top-0 left-0 transition-all duration-700"
                  style={{ width: `${(d.assigned / maxAssigned) * 100}%` }}
                />
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 absolute top-0 left-0 transition-all duration-700"
                  style={{ width: `${(d.converted / maxAssigned) * 100}%` }}
                />
              </div>
            </div>
            <div className="col-span-1 text-center">
              <span
                className={`text-sm font-bold ${
                  Number(convRate) >= 35
                    ? "text-emerald-600"
                    : Number(convRate) >= 25
                      ? "text-amber-500"
                      : "text-red-500"
                }`}
              >
                {convRate}%
              </span>
            </div>
            <div className="col-span-2 flex justify-end">
              {d.overdue > 5 ? (
                <span className="text-[11px] font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">
                  {d.overdue} overdue
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  On track
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ═══════════════════════════════════════════
   5. LEAD SOURCE BAR CHART (ECharts)
   ═══════════════════════════════════════════ */
const LeadSourceChart = () => {
  const total = sourceData.reduce((s, d) => s + d.leads, 0);
  const option = useMemo(
    () => ({
      tooltip: {
        trigger: "axis",
        backgroundColor: "#fff",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        borderRadius: 12,
        padding: [10, 14],
        extraCssText: "box-shadow: 0 8px 24px rgba(0,0,0,0.08);",
        axisPointer: {
          type: "shadow",
          shadowStyle: { color: "rgba(0,0,0,0.02)" },
        },
        formatter: (params) => {
          const p = params[0];
          return `<div style="font-weight:600;color:${p.color}">${p.name}</div><div style="font-size:12px;color:#6b7280;margin-top:4px">${p.value} leads · ${((p.value / total) * 100).toFixed(1)}%</div>`;
        },
      },
      grid: { left: 80, right: 24, top: 8, bottom: 4 },
      xAxis: {
        type: "value",
        show: false,
      },
      yAxis: {
        type: "category",
        data: sourceData.map((d) => d.source).reverse(),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: "#6b7280",
          fontSize: 13,
          fontWeight: 500,
          fontFamily: "inherit",
        },
      },
      series: [
        {
          type: "bar",
          data: [...sourceData].reverse().map((d) => ({
            value: d.leads,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: d.color },
                { offset: 1, color: `${d.color}99` },
              ]),
              borderRadius: [0, 6, 6, 0],
            },
          })),
          barWidth: 28,
          label: {
            show: true,
            position: "insideRight",
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
            fontFamily: "inherit",
            offset: [0, 0],
          },
          emphasis: {
            itemStyle: { shadowBlur: 8, shadowColor: "rgba(0,0,0,0.1)" },
          },
        },
      ],
    }),
    [total],
  );

  return useEChart(option, { height: 280 });
};

/* ═══════════════════════════════════════════
   6. MONTHLY ADMISSIONS & REVENUE (ECharts)
   ═══════════════════════════════════════════ */
const MonthlyChart = () => {
  const option = useMemo(
    () => ({
      tooltip: {
        trigger: "axis",
        backgroundColor: "#fff",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        borderRadius: 12,
        padding: [10, 14],
        extraCssText: "box-shadow: 0 8px 24px rgba(0,0,0,0.08);",
        formatter: (params) => {
          let html = `<div style="font-size:12px;color:#9ca3af;margin-bottom:6px">${params[0].name} 2025</div>`;
          params.forEach((p) => {
            const dot = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color};margin-right:8px"></span>`;
            const val =
              p.seriesName === "Revenue"
                ? `$${p.value.toLocaleString()}`
                : p.value;
            html += `<div style="display:flex;align-items:center;gap:4px;margin-bottom:2px">${dot}<span style="font-weight:600;color:#374151">${val}</span> <span style="color:#9ca3af;font-size:11px">${p.seriesName.toLowerCase()}</span></div>`;
          });
          return html;
        },
      },
      legend: {
        right: 0,
        top: 0,
        icon: "roundRect",
        itemWidth: 12,
        itemHeight: 4,
        textStyle: { color: "#94a3b8", fontSize: 12, fontFamily: "inherit" },
      },
      grid: { left: 48, right: 56, top: 36, bottom: 28 },
      xAxis: {
        type: "category",
        data: monthlyData.map((d) => d.month),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: "#94a3b8", fontSize: 12, fontFamily: "inherit" },
      },
      yAxis: [
        {
          type: "value",
          name: "",
          splitLine: { lineStyle: { color: "#f1f5f9", type: "dashed" } },
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: "#94a3b8", fontSize: 11, fontFamily: "inherit" },
        },
        {
          type: "value",
          name: "",
          splitLine: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            color: "#10B981",
            fontSize: 11,
            fontFamily: "inherit",
            formatter: (v) => `$${v / 1000}k`,
          },
        },
      ],
      series: [
        {
          name: "Admissions",
          type: "bar",
          yAxisIndex: 0,
          barWidth: 28,
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#818CF8" },
              { offset: 1, color: "#6366F1" },
            ]),
          },
          emphasis: {
            itemStyle: { shadowBlur: 12, shadowColor: "rgba(99,102,241,0.25)" },
          },
          data: monthlyData.map((d) => d.admissions),
        },
        {
          name: "Revenue",
          type: "line",
          yAxisIndex: 1,
          smooth: 0.3,
          symbol: "circle",
          symbolSize: 8,
          showSymbol: true,
          lineStyle: { width: 3, color: "#10B981" },
          itemStyle: {
            color: "#10B981",
            borderWidth: 2,
            borderColor: "#fff",
          },
          emphasis: {
            itemStyle: { shadowBlur: 12, shadowColor: "rgba(16,185,129,0.3)" },
          },
          data: monthlyData.map((d) => d.revenue),
        },
      ],
    }),
    [],
  );

  return useEChart(option, { height: 320 });
};

/* ═══════════════════════════════════════════
   QUICK STATS SIDEBAR
   ═══════════════════════════════════════════ */
const QuickStats = () => {
  const items = [
    { label: "Today's Leads", value: "24", color: "#6366F1" },
    { label: "Pending Follow-ups", value: "18", color: "#F59E0B" },
    { label: "This Week", value: "142", color: "#06B6D4" },
    { label: "Hot Leads", value: "9", color: "#EF4444" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3 hover:border-gray-200 transition-all"
        >
          <div
            className="w-2 h-8 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <div>
            <p className="text-xs text-gray-400 font-medium">{item.label}</p>
            <p className="text-lg font-bold text-gray-800">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════════ */
const Dashboardpage = () => {
  const totalLeads = statusData.reduce((s, d) => s + d.value, 0);
  const converted = statusData.find((d) => d.name === "Converted").value;
  const [activePeriod, setActivePeriod] = useState("30D");

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}
    >
      <main className="max-w-screen-2xl mx-auto px-6 py-6">
        {/* Page Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
              Analytics Overview
            </h1>
            <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
              <HiOutlineCalendar className="w-4 h-4" />
              Real-time overview of your lead pipeline and team performance
            </p>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {kpiConfig(totalLeads, converted).map((k, i) => (
            <KPICard key={i} {...k} />
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ChartCard
            title="Leads Trend"
            subtitle="Daily new leads over the last 30 days"
            className="lg:col-span-2"
          >
            <LeadsTrendChart />
          </ChartCard>

          <ChartCard
            title="Lead Status Distribution"
            subtitle="Current pipeline breakdown"
          >
            <DonutChart />
          </ChartCard>

          <ChartCard
            title="Conversion Funnel"
            subtitle="Lead progression through stages"
          >
            <FunnelChartComponent />
          </ChartCard>

          <ChartCard
            title="Counselor Performance"
            subtitle="Team conversion rates and workload"
          >
            <CounselorChart />
          </ChartCard>

          <ChartCard
            title="Lead Sources"
            subtitle="Marketing channel effectiveness"
          >
            <LeadSourceChart />
          </ChartCard>

          <ChartCard
            title="Monthly Admissions & Revenue"
            subtitle="Business growth trend over 8 months"
            className="lg:col-span-2"
          >
            <MonthlyChart />
          </ChartCard>
        </div>
      </main>
    </div>
  );
};

export default Dashboardpage;
