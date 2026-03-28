import React, { useState, useMemo } from "react";
import {
  Table,
  Input,
  Select,
  Tooltip,
  ConfigProvider,
  Tabs,
  Drawer,
  Empty,
  message,
  Modal,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  RiUserLine,
  RiSearchLine,
  RiPhoneLine,
  RiArrowRightLine,
  RiFireLine,
  RiRefreshLine,
  RiDownloadLine,
  RiMailLine,
  RiCloseLine,
  RiMoneyDollarCircleLine,
  RiAlertLine,
  RiBarChartLine,
  RiCloseCircleLine,
  RiCheckboxCircleLine,
  RiHistoryLine,
  RiWhatsappLine,
  RiVideoChatLine,
  RiGroupLine,
  RiLineChartLine,
  RiPercentLine,
  RiSpeedLine,
  RiTrophyLine,
  RiExchangeLine,
  RiGlobalLine,
  RiCalendarCheckLine,
  RiEyeLine,
  RiSendPlaneLine,
  RiNotification3Line,
  RiPieChartLine,
  RiBarChartBoxLine,
  RiFlagLine,
} from "react-icons/ri";

interface CounselorData {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo?: string;
  status: "active" | "on_leave";
  joinDate: string;
  activeLeads: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  followUpsDueToday: number;
  overdueFollowUps: number;
  conversionRate: number;
  lostLeads: number;
  totalLeadsAssigned: number;
  revenueGenerated: number;
  enrollments: number;
  enrollmentTarget: number;
  revenueTarget: number;
  avgResponseTime: string;
  performanceScore: number;
  lastActive: string;
  countries: Record<string, number>;
  sources: Record<string, number>;
  monthlyData: {
    month: string;
    leads: number;
    enrollments: number;
    revenue: number;
  }[];
  recentActivity: {
    id: string;
    action: string;
    date: string;
    detail: string;
  }[];
  totalFollowUps: number;
  completedFollowUps: number;
  avgDelayHours: number;
}

interface Alert {
  id: string;
  counselorId: string;
  counselorName: string;
  type: "overdue" | "high_lost" | "low_conversion" | "inactive";
  message: string;
  severity: "high" | "medium";
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS & MOCK DATA
// ═══════════════════════════════════════════════════════════════

const COUNSELOR_NAMES = [
  "Priya Sharma",
  "Arjun Patel",
  "Sarah Khan",
  "Rohan Mehta",
  "Anita Desai",
  "Vikram Singh",
  "Neha Gupta",
  "Amit Verma",
];

const generateCounselors = (): CounselorData[] =>
  COUNSELOR_NAMES.map((name, i) => {
    const totalAssigned = 20 + Math.floor(Math.random() * 40);
    const active = Math.floor(totalAssigned * (0.3 + Math.random() * 0.4));
    const hot = Math.floor(active * (0.2 + Math.random() * 0.3));
    const warm = Math.floor(active * (0.3 + Math.random() * 0.2));
    const cold = active - hot - warm;
    const enrollments = Math.floor(
      totalAssigned * (0.1 + Math.random() * 0.25),
    );
    const lost = Math.floor(totalAssigned * (0.05 + Math.random() * 0.2));
    const conv =
      totalAssigned > 0 ? Math.round((enrollments / totalAssigned) * 100) : 0;
    const rev = enrollments * (2000 + Math.floor(Math.random() * 3000));
    const dueToday = Math.floor(Math.random() * 8);
    const overdue = Math.floor(Math.random() * 6);
    const totalFU = 50 + Math.floor(Math.random() * 100);
    const completedFU = Math.floor(totalFU * (0.7 + Math.random() * 0.25));

    const followUpDiscipline = totalFU > 0 ? (completedFU / totalFU) * 100 : 0;
    const lostRate = totalAssigned > 0 ? (lost / totalAssigned) * 100 : 0;
    const perfScore = Math.round(
      conv * 0.4 +
        Math.min(rev / 500, 30) * 0.3 +
        followUpDiscipline * 0.2 +
        (100 - lostRate) * 0.1,
    );

    const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];
    const countryCounts: Record<string, number> = {};
    ["🇬🇧 UK", "🇨🇦 Canada", "🇺🇸 USA", "🇦🇺 Australia", "🇩🇪 Germany"].forEach(
      (c) => {
        countryCounts[c] = Math.floor(Math.random() * 10) + 1;
      },
    );
    const sourceCounts: Record<string, number> = {};
    ["Website", "Referral", "Facebook", "Walk-in", "Google Ads"].forEach(
      (s) => {
        sourceCounts[s] = Math.floor(Math.random() * 8) + 1;
      },
    );

    return {
      id: `coun-${i + 1}`,
      name,
      email: `${name.toLowerCase().replace(" ", ".")}@company.com`,
      phone: `+91 ${9000000000 + Math.floor(Math.random() * 999999999)}`,
      status: i === 5 ? "on_leave" : "active",
      joinDate: new Date(
        2024,
        Math.floor(Math.random() * 12),
        1 + Math.floor(Math.random() * 28),
      )
        .toISOString()
        .split("T")[0],
      activeLeads: active,
      hotLeads: hot,
      warmLeads: warm,
      coldLeads: cold,
      followUpsDueToday: dueToday,
      overdueFollowUps: overdue,
      conversionRate: conv,
      lostLeads: lost,
      totalLeadsAssigned: totalAssigned,
      revenueGenerated: rev,
      enrollments,
      enrollmentTarget: 8 + Math.floor(Math.random() * 5),
      revenueTarget: 30000 + Math.floor(Math.random() * 20000),
      avgResponseTime: `${1 + Math.floor(Math.random() * 23)}h`,
      performanceScore: Math.min(perfScore, 100),
      lastActive: new Date(
        Date.now() - Math.floor(Math.random() * 3) * 86400000,
      ).toISOString(),
      countries: countryCounts,
      sources: sourceCounts,
      monthlyData: months.map((m) => ({
        month: m,
        leads: 3 + Math.floor(Math.random() * 10),
        enrollments: Math.floor(Math.random() * 5),
        revenue: Math.floor(Math.random() * 15000),
      })),
      recentActivity: Array.from({ length: 8 }, (_, j) => ({
        id: `act-${i}-${j}`,
        action: [
          "Added follow-up note",
          "Changed lead stage",
          "Marked lead as lost",
          "Created enrollment",
          "Updated contact info",
          "Sent WhatsApp",
          "Logged call",
          "Scheduled meeting",
        ][j % 8],
        date: new Date(Date.now() - j * 4 * 3600000).toISOString(),
        detail: [
          "for Ravi Kumar",
          "Contacted → Applied",
          "Reason: Financial Issue",
          "Sneha Reddy enrolled",
          "Updated phone for Amit",
          "Sent intake details",
          "Discussed visa process",
          "With Neha Agarwal",
        ][j % 8],
      })),
      totalFollowUps: totalFU,
      completedFollowUps: completedFU,
      avgDelayHours: Math.floor(Math.random() * 20) + 2,
    };
  });

const COUNSELORS_DATA = generateCounselors();

const generateAlerts = (counselors: CounselorData[]): Alert[] => {
  const alerts: Alert[] = [];
  counselors.forEach((c) => {
    if (c.overdueFollowUps >= 5)
      alerts.push({
        id: `alert-${c.id}-1`,
        counselorId: c.id,
        counselorName: c.name,
        type: "overdue",
        message: `${c.overdueFollowUps} overdue follow-ups`,
        severity: "high",
      });
    if (c.totalLeadsAssigned > 0 && c.lostLeads / c.totalLeadsAssigned > 0.25)
      alerts.push({
        id: `alert-${c.id}-2`,
        counselorId: c.id,
        counselorName: c.name,
        type: "high_lost",
        message: `${Math.round((c.lostLeads / c.totalLeadsAssigned) * 100)}% lost rate this month`,
        severity: "high",
      });
    if (c.conversionRate < 15)
      alerts.push({
        id: `alert-${c.id}-3`,
        counselorId: c.id,
        counselorName: c.name,
        type: "low_conversion",
        message: `${c.conversionRate}% conversion rate`,
        severity: "medium",
      });
    const hoursSinceActive =
      (Date.now() - new Date(c.lastActive).getTime()) / 3600000;
    if (hoursSinceActive > 48)
      alerts.push({
        id: `alert-${c.id}-4`,
        counselorId: c.id,
        counselorName: c.name,
        type: "inactive",
        message: `No activity in ${Math.floor(hoursSinceActive / 24)} days`,
        severity: "medium",
      });
  });
  return alerts;
};

// ═══════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════

const UserAvatar: React.FC<{
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
}> = ({ name, size = "md" }) => {
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("");
  const colorMap = [
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-violet-100 text-violet-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-cyan-100 text-cyan-700",
    "bg-pink-100 text-pink-700",
    "bg-teal-100 text-teal-700",
    "bg-indigo-100 text-indigo-700",
    "bg-orange-100 text-orange-700",
  ];
  const sizeMap = {
    sm: "w-7 h-7 text-[10px] rounded-lg",
    md: "w-8 h-8 text-xs rounded-xl",
    lg: "w-10 h-10 text-sm rounded-xl",
    xl: "w-12 h-12 text-base rounded-2xl",
  };
  const idx =
    (name || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0) %
    colorMap.length;
  return (
    <div
      className={`flex items-center justify-center font-bold shrink-0 select-none ${sizeMap[size]} ${initials ? colorMap[idx] : "bg-slate-100 text-slate-400"}`}
    >
      {initials || <RiUserLine className="w-1/2 h-1/2" />}
    </div>
  );
};

const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: React.ReactNode;
  bg: string;
  tc: string;
  barBg: string;
  subtitle?: string;
}> = ({ label, value, icon, bg, tc, barBg, subtitle }) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-4 relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50 cursor-default min-w-0">
    <div className="flex justify-between items-start gap-2">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 truncate">
          {label}
        </p>
        <p className="text-2xl font-extrabold text-slate-900 leading-none tracking-tight">
          {value}
        </p>
        {subtitle && (
          <p className="text-[10px] text-slate-400 mt-1 truncate">{subtitle}</p>
        )}
      </div>
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${bg}`}
      >
        <span className={tc}>{icon}</span>
      </div>
    </div>
    <div
      className={`absolute bottom-0 left-0 right-0 h-[3px] ${barBg} opacity-60`}
    />
  </div>
);

const ScoreBadge: React.FC<{ score: number }> = ({ score }) => {
  const cfg =
    score >= 70
      ? {
          cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
          label: "Excellent",
          icon: <RiTrophyLine size={11} />,
        }
      : score >= 45
        ? {
            cls: "bg-amber-50 text-amber-700 border-amber-200",
            label: "Average",
            icon: <RiSpeedLine size={11} />,
          }
        : {
            cls: "bg-red-50 text-red-700 border-red-200",
            label: "Needs Improvement",
            icon: <RiAlertLine size={11} />,
          };
  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${score >= 70 ? "bg-emerald-500" : score >= 45 ? "bg-amber-500" : "bg-red-500"}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${cfg.cls}`}
      >
        {cfg.icon} {score}
      </span>
    </div>
  );
};

const StatusBadge: React.FC<{ status: "active" | "on_leave" }> = ({
  status,
}) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full ${status === "active" ? "bg-emerald-500" : "bg-amber-500"}`}
    />{" "}
    {status === "active" ? "Active" : "On Leave"}
  </span>
);

// ═══════════════════════════════════════════════════════════════
// COUNSELOR DETAIL DRAWER
// ═══════════════════════════════════════════════════════════════

const CounselorDrawer: React.FC<{
  counselor: CounselorData | null;
  onClose: () => void;
}> = ({ counselor, onClose }) => {
  if (!counselor) return null;
  const c = counselor;
  const fuCompletionRate =
    c.totalFollowUps > 0
      ? Math.round((c.completedFollowUps / c.totalFollowUps) * 100)
      : 0;
  const enrollPct =
    c.enrollmentTarget > 0
      ? Math.round((c.enrollments / c.enrollmentTarget) * 100)
      : 0;
  const revPct =
    c.revenueTarget > 0
      ? Math.round((c.revenueGenerated / c.revenueTarget) * 100)
      : 0;

  const activityIcons: Record<string, { icon: React.ReactNode; cls: string }> =
    {
      "Added follow-up note": {
        icon: <RiSendPlaneLine size={12} />,
        cls: "bg-blue-50 text-blue-600",
      },
      "Changed lead stage": {
        icon: <RiArrowRightLine size={12} />,
        cls: "bg-violet-50 text-violet-600",
      },
      "Marked lead as lost": {
        icon: <RiCloseCircleLine size={12} />,
        cls: "bg-red-50 text-red-600",
      },
      "Created enrollment": {
        icon: <RiCheckboxCircleLine size={12} />,
        cls: "bg-emerald-50 text-emerald-600",
      },
      "Updated contact info": {
        icon: <RiUserLine size={12} />,
        cls: "bg-slate-50 text-slate-600",
      },
      "Sent WhatsApp": {
        icon: <RiWhatsappLine size={12} />,
        cls: "bg-green-50 text-green-600",
      },
      "Logged call": {
        icon: <RiPhoneLine size={12} />,
        cls: "bg-cyan-50 text-cyan-600",
      },
      "Scheduled meeting": {
        icon: <RiVideoChatLine size={12} />,
        cls: "bg-amber-50 text-amber-600",
      },
    };

  const tabItems = [
    {
      key: "overview",
      label: (
        <span className="flex items-center gap-1.5">
          <RiBarChartLine size={13} /> Overview
        </span>
      ),
      children: (
        <div className="p-4 flex flex-col gap-4">
          {/* KPI Cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Total Assigned",
                value: c.totalLeadsAssigned,
                bg: "bg-blue-50",
                tc: "text-blue-700",
                icon: <RiGroupLine size={13} />,
              },
              {
                label: "Active Leads",
                value: c.activeLeads,
                bg: "bg-indigo-50",
                tc: "text-indigo-700",
                icon: <RiFireLine size={13} />,
              },
              {
                label: "Enrollments",
                value: c.enrollments,
                bg: "bg-emerald-50",
                tc: "text-emerald-700",
                icon: <RiCheckboxCircleLine size={13} />,
              },
              {
                label: "Lost Leads",
                value: c.lostLeads,
                bg: "bg-red-50",
                tc: "text-red-700",
                icon: <RiCloseCircleLine size={13} />,
              },
              {
                label: "Revenue",
                value: `$${c.revenueGenerated.toLocaleString()}`,
                bg: "bg-amber-50",
                tc: "text-amber-700",
                icon: <RiMoneyDollarCircleLine size={13} />,
              },
              {
                label: "Conversion",
                value: `${c.conversionRate}%`,
                bg: "bg-cyan-50",
                tc: "text-cyan-700",
                icon: <RiPercentLine size={13} />,
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`${item.bg} rounded-xl p-3 border border-slate-100`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`${item.tc} opacity-70`}>{item.icon}</span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {item.label}
                  </span>
                </div>
                <div className={`text-lg font-extrabold ${item.tc}`}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
          {/* Lead Distribution */}
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
              <RiPieChartLine size={13} /> Lead Distribution
            </h4>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-2 rounded-lg bg-red-50 border border-red-200">
                <div className="text-lg font-extrabold text-red-700">
                  {c.hotLeads}
                </div>
                <div className="text-[10px] font-semibold text-red-600">
                  Hot
                </div>
              </div>
              <div className="text-center p-2 rounded-lg bg-amber-50 border border-amber-200">
                <div className="text-lg font-extrabold text-amber-700">
                  {c.warmLeads}
                </div>
                <div className="text-[10px] font-semibold text-amber-600">
                  Warm
                </div>
              </div>
              <div className="text-center p-2 rounded-lg bg-blue-50 border border-blue-200">
                <div className="text-lg font-extrabold text-blue-700">
                  {c.coldLeads}
                </div>
                <div className="text-[10px] font-semibold text-blue-600">
                  Cold
                </div>
              </div>
            </div>
            <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <RiGlobalLine size={13} /> By Country
            </h4>
            <div className="flex flex-col gap-1.5">
              {Object.entries(c.countries)
                .sort((a, b) => b[1] - a[1])
                .map(([country, count]) => (
                  <div key={country} className="flex items-center gap-2">
                    <span className="text-xs text-slate-700 w-20 truncate">
                      {country}
                    </span>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(count / c.activeLeads) * 100}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 w-5 text-right">
                      {count}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "targets",
      label: (
        <span className="flex items-center gap-1.5">
          <RiFlagLine size={13} /> Targets
        </span>
      ),
      children: (
        <div className="p-4 flex flex-col gap-4">
          {[
            {
              label: "Enrollment Target",
              current: c.enrollments,
              target: c.enrollmentTarget,
              unit: "",
              color: "blue",
            },
            {
              label: "Revenue Target",
              current: c.revenueGenerated,
              target: c.revenueTarget,
              unit: "$",
              color: "emerald",
            },
            {
              label: "Follow-up Completion",
              current: c.completedFollowUps,
              target: c.totalFollowUps,
              unit: "",
              color: "violet",
            },
          ].map((item, i) => {
            const pct =
              item.target > 0
                ? Math.min(Math.round((item.current / item.target) * 100), 100)
                : 0;
            return (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-100 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">
                    {item.label}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {item.unit}
                    {item.current.toLocaleString()} / {item.unit}
                    {item.target.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${pct >= 100 ? "bg-emerald-500" : pct >= 60 ? `bg-${item.color}-500` : "bg-red-400"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span
                    className={`text-[11px] font-bold ${pct >= 100 ? "text-emerald-600" : pct >= 60 ? "text-blue-600" : "text-red-600"}`}
                  >
                    {pct}%
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {pct >= 100
                      ? "Target met!"
                      : `${item.target - item.current > 0 ? item.unit + (item.target - item.current).toLocaleString() : 0} remaining`}
                  </span>
                </div>
              </div>
            );
          })}
          {/* Follow-up Discipline */}
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
              <RiCalendarCheckLine size={13} /> Follow-up Discipline
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total Follow-ups", value: c.totalFollowUps },
                { label: "Completion Rate", value: `${fuCompletionRate}%` },
                { label: "Avg Delay", value: `${c.avgDelayHours}h` },
                { label: "Overdue Now", value: c.overdueFollowUps },
              ].map((item, i) => (
                <div
                  key={i}
                  className="px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-100"
                >
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {item.label}
                  </div>
                  <div className="text-base font-extrabold text-slate-800 mt-0.5">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "trend",
      label: (
        <span className="flex items-center gap-1.5">
          <RiLineChartLine size={13} /> Trends
        </span>
      ),
      children: (
        <div className="p-4 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <h4 className="text-xs font-bold text-slate-700 mb-3">
              Monthly Performance
            </h4>
            <div className="overflow-x-auto" style={{ scrollbarWidth: "thin" }}>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-2 px-2 text-slate-400 font-semibold">
                      Month
                    </th>
                    <th className="text-right py-2 px-2 text-slate-400 font-semibold">
                      Leads
                    </th>
                    <th className="text-right py-2 px-2 text-slate-400 font-semibold">
                      Enrolled
                    </th>
                    <th className="text-right py-2 px-2 text-slate-400 font-semibold">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {c.monthlyData.map((m) => (
                    <tr
                      key={m.month}
                      className="border-b border-slate-50 hover:bg-slate-50/50"
                    >
                      <td className="py-2 px-2 font-semibold text-slate-700">
                        {m.month}
                      </td>
                      <td className="py-2 px-2 text-right text-slate-600">
                        {m.leads}
                      </td>
                      <td className="py-2 px-2 text-right text-emerald-600 font-semibold">
                        {m.enrollments}
                      </td>
                      <td className="py-2 px-2 text-right text-slate-700 font-semibold">
                        ${m.revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Mini bar chart visualization */}
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <h4 className="text-xs font-bold text-slate-700 mb-3">
              Enrollment Trend
            </h4>
            <div className="flex items-end gap-2 h-24">
              {c.monthlyData.map((m) => {
                const maxE = Math.max(
                  ...c.monthlyData.map((d) => d.enrollments),
                  1,
                );
                const h = (m.enrollments / maxE) * 100;
                return (
                  <Tooltip
                    key={m.month}
                    title={`${m.month}: ${m.enrollments} enrollments`}
                  >
                    <div className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-blue-100 rounded-t-md relative"
                        style={{ height: `${Math.max(h, 8)}%` }}
                      >
                        <div
                          className="absolute inset-0 bg-blue-500 rounded-t-md"
                          style={{ height: `${h}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-semibold text-slate-400">
                        {m.month}
                      </span>
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "activity",
      label: (
        <span className="flex items-center gap-1.5">
          <RiHistoryLine size={13} /> Activity
        </span>
      ),
      children: (
        <div className="p-4 flex flex-col gap-2">
          {c.recentActivity.map((act) => {
            const cfg = activityIcons[act.action] || {
              icon: <RiHistoryLine size={12} />,
              cls: "bg-slate-50 text-slate-500",
            };
            return (
              <div
                key={act.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-100"
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${cfg.cls}`}
                >
                  {cfg.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium text-slate-800">
                    {act.action}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {act.detail}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(act.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ),
    },
  ];

  return (
    <Drawer
      open={!!counselor}
      onClose={onClose}
      width={600}
      title={null}
      styles={{
        body: { padding: 0, background: "#F8FAFC" },
        header: { display: "none" },
      }}
    >
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-6 py-5 relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/[0.07]" />
        <div className="flex justify-between items-start relative z-10">
          <div className="flex items-center gap-3">
            <UserAvatar name={c.name} size="xl" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[17px] font-bold text-white leading-tight">
                  {c.name}
                </h2>
                <StatusBadge status={c.status} />
              </div>
              <p className="text-xs text-white/70 flex items-center gap-1 mt-1">
                <RiMailLine size={12} /> {c.email}
              </p>
              <p className="text-xs text-white/60 flex items-center gap-1 mt-0.5">
                <RiPhoneLine size={12} /> {c.phone}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-white/15 hover:bg-white/25 border-none rounded-lg p-1.5 cursor-pointer flex text-white transition-colors"
          >
            <RiCloseLine size={18} />
          </button>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap relative z-10">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/20 text-white border border-white/30">
            Score: {c.performanceScore}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/20 text-white border border-white/30">
            {c.enrollments} enrolled
          </span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/20 text-white border border-white/30">
            ${c.revenueGenerated.toLocaleString()} revenue
          </span>
        </div>
      </div>
      <Tabs
        items={tabItems}
        defaultActiveKey="overview"
        className="counselor-detail-tabs"
        style={{ margin: 0 }}
      />
    </Drawer>
  );
};

// ═══════════════════════════════════════════════════════════════
// COMPARISON MODAL
// ═══════════════════════════════════════════════════════════════

const CompareModal: React.FC<{
  counselors: CounselorData[];
  selected: string[];
  open: boolean;
  onClose: () => void;
}> = ({ counselors, selected, open, onClose }) => {
  const compared = counselors.filter((c) => selected.includes(c.id));
  if (compared.length < 2) return null;

  const metrics = [
    {
      label: "Conversion Rate",
      key: "conversionRate",
      suffix: "%",
      best: "max",
    },
    { label: "Revenue", key: "revenueGenerated", prefix: "$", best: "max" },
    { label: "Enrollments", key: "enrollments", best: "max" },
    { label: "Lost Leads", key: "lostLeads", best: "min" },
    { label: "Performance Score", key: "performanceScore", best: "max" },
    { label: "Follow-up Completion", key: "completedFollowUps", best: "max" },
    { label: "Overdue Follow-ups", key: "overdueFollowUps", best: "min" },
    { label: "Active Leads", key: "activeLeads", best: "max" },
  ] as const;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={null}
      footer={null}
      width={700}
      styles={{ body: { padding: 0 } }}
    >
      <div className="p-5">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
            <RiBarChartBoxLine size={18} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Compare Counselors
            </h3>
            <p className="text-[12px] text-slate-400">
              Side-by-side performance analysis
            </p>
          </div>
        </div>
        {/* Headers */}
        <div
          className="grid gap-3 mb-4"
          style={{
            gridTemplateColumns: `140px repeat(${compared.length}, 1fr)`,
          }}
        >
          <div />
          {compared.map((c) => (
            <div
              key={c.id}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100"
            >
              <UserAvatar name={c.name} size="lg" />
              <span className="text-xs font-bold text-slate-800 text-center">
                {c.name}
              </span>
              <ScoreBadge score={c.performanceScore} />
            </div>
          ))}
        </div>
        {/* Metrics */}
        <div className="flex flex-col gap-1">
          {metrics.map((metric) => {
            const values = compared.map(
              (c) => (c as any)[metric.key] as number,
            );
            const bestVal =
              metric.best === "max" ? Math.max(...values) : Math.min(...values);
            return (
              <div
                key={metric.label}
                className="grid gap-3 py-2.5 border-b border-slate-100"
                style={{
                  gridTemplateColumns: `140px repeat(${compared.length}, 1fr)`,
                }}
              >
                <span className="text-xs font-semibold text-slate-500 flex items-center">
                  {metric.label}
                </span>
                {compared.map((c) => {
                  const val = (c as any)[metric.key] as number;
                  const isBest = val === bestVal;
                  return (
                    <div
                      key={c.id}
                      className={`text-center py-1 rounded-lg text-sm font-bold ${isBest ? "bg-emerald-50 text-emerald-700" : "text-slate-700"}`}
                    >
                      {metric.prefix || ""}
                      {val.toLocaleString()}
                      {metric.suffix || ""}
                      {isBest && (
                        <RiTrophyLine
                          size={11}
                          className="inline ml-1 text-emerald-500"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

// ═══════════════════════════════════════════════════════════════
// REASSIGNMENT MODAL
// ═══════════════════════════════════════════════════════════════

const ReassignModal: React.FC<{
  counselors: CounselorData[];
  open: boolean;
  onClose: () => void;
}> = ({ counselors, open, onClose }) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [leadType, setLeadType] = useState("all");

  const handleReassign = () => {
    if (!from || !to) return;
    message.success({
      content: `Leads reassigned from ${counselors.find((c) => c.id === from)?.name} to ${counselors.find((c) => c.id === to)?.name}!`,
      duration: 3,
    });
    setFrom("");
    setTo("");
    setLeadType("all");
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <RiExchangeLine size={20} className="text-blue-600" />
          </div>
          <div>
            <div className="text-base font-bold text-slate-900">
              Reassign Leads
            </div>
            <div className="text-[13px] font-normal text-slate-400">
              Transfer leads between counselors
            </div>
          </div>
        </div>
      }
      footer={null}
      width={520}
    >
      <div className="flex flex-col gap-4 mt-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            From Counselor
          </label>
          <Select
            value={from || undefined}
            onChange={setFrom}
            placeholder="Select counselor"
            style={{ width: "100%" }}
            options={counselors.map((c) => ({
              value: c.id,
              label: `${c.name} (${c.activeLeads} active)`,
            }))}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            To Counselor
          </label>
          <Select
            value={to || undefined}
            onChange={setTo}
            placeholder="Select counselor"
            style={{ width: "100%" }}
            options={counselors
              .filter((c) => c.id !== from)
              .map((c) => ({
                value: c.id,
                label: `${c.name} (${c.activeLeads} active)`,
              }))}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Lead Type
          </label>
          <Select
            value={leadType}
            onChange={setLeadType}
            style={{ width: "100%" }}
            options={[
              { value: "all", label: "All Leads" },
              { value: "hot", label: "Hot Leads Only" },
              { value: "warm", label: "Warm Leads" },
              { value: "cold", label: "Cold Leads" },
            ]}
          />
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-[13px] font-semibold text-slate-500 bg-transparent border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleReassign}
            disabled={!from || !to}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-[13px] font-bold border-none cursor-pointer transition-all ${from && to ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
          >
            <RiExchangeLine size={14} /> Reassign
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════

const CounselorsPage: React.FC = () => {
  const [counselors] = useState<CounselorData[]>(COUNSELORS_DATA);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedCounselor, setSelectedCounselor] =
    useState<CounselorData | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [showReassign, setShowReassign] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);

  const alerts = useMemo(() => generateAlerts(counselors), [counselors]);

  const filtered = useMemo(() => {
    return counselors.filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (statusFilter && c.status !== statusFilter) return false;
      return true;
    });
  }, [counselors, search, statusFilter]);

  const stats = useMemo(
    () => ({
      total: counselors.length,
      activeLeads: counselors.reduce((s, c) => s + c.activeLeads, 0),
      followUpsToday: counselors.reduce((s, c) => s + c.followUpsDueToday, 0),
      enrollmentsMonth: counselors.reduce((s, c) => s + c.enrollments, 0),
      revenue: counselors.reduce((s, c) => s + c.revenueGenerated, 0),
      avgLostRate:
        counselors.length > 0
          ? Math.round(
              counselors.reduce(
                (s, c) =>
                  s +
                  (c.totalLeadsAssigned > 0
                    ? (c.lostLeads / c.totalLeadsAssigned) * 100
                    : 0),
                0,
              ) / counselors.length,
            )
          : 0,
    }),
    [counselors],
  );

  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 4
          ? [...prev, id]
          : prev,
    );
  };

  const handleExportCSV = () => {
    const headers = [
      "Name",
      "Status",
      "Active Leads",
      "Hot",
      "Conversion %",
      "Lost",
      "Revenue",
      "Enrollments",
      "Score",
    ];
    const rows = filtered.map((c) => [
      c.name,
      c.status,
      c.activeLeads,
      c.hotLeads,
      c.conversionRate,
      c.lostLeads,
      c.revenueGenerated,
      c.enrollments,
      c.performanceScore,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "counselors.csv";
    a.click();
    URL.revokeObjectURL(url);
    message.success({ content: "CSV exported!", duration: 2 });
  };

  const columns: ColumnsType<CounselorData> = [
    {
      title: "Counselor",
      dataIndex: "name",
      key: "name",
      width: 200,
      fixed: "left" as const,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string, record) => (
        <div className="flex items-center gap-2.5">
          <input
            type="checkbox"
            checked={compareIds.includes(record.id)}
            onChange={() => toggleCompare(record.id)}
            className="w-3.5 h-3.5 rounded accent-blue-600 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setSelectedCounselor(record)}
            className="flex items-center gap-2 bg-transparent border-none cursor-pointer p-0 text-left group"
          >
            <UserAvatar name={name} size="md" />
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                {name}
              </div>
              <div className="text-[11px] text-slate-400">{record.email}</div>
            </div>
          </button>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (s: "active" | "on_leave") => <StatusBadge status={s} />,
    },
    {
      title: "Active",
      dataIndex: "activeLeads",
      key: "active",
      width: 70,
      sorter: (a, b) => a.activeLeads - b.activeLeads,
      render: (v: number) => (
        <span className="text-[13px] font-bold text-slate-800">{v}</span>
      ),
    },
    {
      title: "Hot",
      dataIndex: "hotLeads",
      key: "hot",
      width: 60,
      render: (v: number) => (
        <span className="inline-flex items-center gap-1 text-[12px] font-bold text-red-600">
          <RiFireLine size={11} /> {v}
        </span>
      ),
    },
    {
      title: "Due Today",
      dataIndex: "followUpsDueToday",
      key: "due",
      width: 90,
      render: (v: number) => (
        <span
          className={`text-[13px] font-semibold ${v > 4 ? "text-amber-600" : "text-slate-600"}`}
        >
          {v}
        </span>
      ),
    },
    {
      title: "Overdue",
      dataIndex: "overdueFollowUps",
      key: "overdue",
      width: 80,
      render: (v: number) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${v >= 5 ? "bg-red-50 text-red-700 border-red-200" : v > 0 ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}
        >
          {v >= 5 && <RiAlertLine size={10} />} {v}
        </span>
      ),
    },
    {
      title: "Conv. %",
      dataIndex: "conversionRate",
      key: "conv",
      width: 80,
      sorter: (a, b) => a.conversionRate - b.conversionRate,
      render: (v: number) => (
        <span
          className={`text-[13px] font-bold ${v >= 25 ? "text-emerald-600" : v >= 15 ? "text-amber-600" : "text-red-600"}`}
        >
          {v}%
        </span>
      ),
    },
    {
      title: "Lost",
      dataIndex: "lostLeads",
      key: "lost",
      width: 60,
      render: (v: number) => (
        <span className="text-[13px] text-red-600 font-semibold">{v}</span>
      ),
    },
    {
      title: "Revenue",
      dataIndex: "revenueGenerated",
      key: "rev",
      width: 100,
      sorter: (a, b) => a.revenueGenerated - b.revenueGenerated,
      render: (v: number) => (
        <span className="text-[13px] font-bold text-slate-800">
          ${(v / 1000).toFixed(1)}K
        </span>
      ),
    },
    {
      title: "Enrolled",
      dataIndex: "enrollments",
      key: "enrolled",
      width: 80,
      sorter: (a, b) => a.enrollments - b.enrollments,
      render: (v: number) => (
        <span className="text-[13px] font-bold text-emerald-700">{v}</span>
      ),
    },
    {
      title: "Score",
      dataIndex: "performanceScore",
      key: "score",
      width: 130,
      sorter: (a, b) => a.performanceScore - b.performanceScore,
      render: (score: number) => <ScoreBadge score={score} />,
    },
    {
      title: "",
      key: "actions",
      width: 50,
      fixed: "right" as const,
      render: (_: unknown, record: CounselorData) => (
        <Tooltip title="View Profile">
          <button
            onClick={() => setSelectedCounselor(record)}
            className="bg-transparent border-none p-1.5 rounded-lg cursor-pointer flex text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <RiEyeLine size={16} />
          </button>
        </Tooltip>
      ),
    },
  ];

  const hasFilters = !!(search || statusFilter);

  return (
    <div className="flex flex-col gap-4 w-full p-5 overflow-hidden min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap min-w-0">
        <div className="min-w-0">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Counselors
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Monitor performance, manage targets & track team accountability
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {compareIds.length >= 2 && (
            <button
              onClick={() => setShowCompare(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-200 cursor-pointer hover:bg-indigo-100 transition-all"
            >
              <RiBarChartBoxLine size={15} /> Compare ({compareIds.length})
            </button>
          )}
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-semibold border cursor-pointer transition-all ${showAlerts ? "bg-red-50 text-red-600 border-red-200" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
          >
            <RiNotification3Line size={15} /> Alerts
            {alerts.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                {alerts.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowReassign(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-semibold bg-white text-slate-600 border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all"
          >
            <RiExchangeLine size={15} /> Reassign
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-semibold bg-white text-slate-600 border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all"
          >
            <RiDownloadLine size={15} /> Export
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="w-full min-w-0 overflow-hidden">
        <div
          className="overflow-x-auto pb-1"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#CBD5E1 transparent",
          }}
        >
          <div className="grid grid-cols-6 gap-3 min-w-[900px]">
            <StatCard
              label="Total Counselors"
              value={stats.total}
              icon={<RiGroupLine size={17} />}
              bg="bg-blue-50"
              tc="text-blue-500"
              barBg="bg-blue-500"
            />
            <StatCard
              label="Active Leads"
              value={stats.activeLeads}
              icon={<RiFireLine size={17} />}
              bg="bg-amber-50"
              tc="text-amber-500"
              barBg="bg-amber-500"
            />
            <StatCard
              label="Follow-ups Today"
              value={stats.followUpsToday}
              icon={<RiPhoneLine size={17} />}
              bg="bg-violet-50"
              tc="text-violet-500"
              barBg="bg-violet-500"
            />
            <StatCard
              label="Enrollments"
              value={stats.enrollmentsMonth}
              icon={<RiCheckboxCircleLine size={17} />}
              bg="bg-emerald-50"
              tc="text-emerald-500"
              barBg="bg-emerald-500"
              subtitle="This month"
            />
            <StatCard
              label="Revenue"
              value={`$${(stats.revenue / 1000).toFixed(0)}K`}
              icon={<RiMoneyDollarCircleLine size={17} />}
              bg="bg-cyan-50"
              tc="text-cyan-500"
              barBg="bg-cyan-500"
            />
            <StatCard
              label="Avg Lost Rate"
              value={`${stats.avgLostRate}%`}
              icon={<RiPercentLine size={17} />}
              bg="bg-rose-50"
              tc="text-rose-500"
              barBg="bg-rose-500"
            />
          </div>
        </div>
      </div>

      {/* Alerts Panel */}
      {showAlerts && alerts.length > 0 && (
        <div className="bg-red-50/50 rounded-2xl border border-red-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <RiAlertLine size={15} className="text-red-600" />
            <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
              Active Alerts ({alerts.length})
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {alerts.slice(0, 6).map((a) => (
              <div
                key={a.id}
                className={`flex items-start gap-2.5 p-3 rounded-xl bg-white border ${a.severity === "high" ? "border-red-200" : "border-amber-200"}`}
              >
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${a.severity === "high" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}
                >
                  <RiAlertLine size={12} />
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] font-bold text-slate-800">
                    {a.counselorName}
                  </div>
                  <div className="text-[11px] text-slate-500">{a.message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 min-w-0 overflow-hidden">
        <div className="flex flex-wrap gap-2 items-center">
          <Input
            prefix={<RiSearchLine size={14} className="text-slate-400" />}
            placeholder="Search counselor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ width: 200 }}
            className="!rounded-xl"
          />
          <Select
            value={statusFilter || undefined}
            onChange={(v) => setStatusFilter(v || "")}
            placeholder="Status"
            allowClear
            style={{ width: 130 }}
            options={[
              { value: "active", label: "Active" },
              { value: "on_leave", label: "On Leave" },
            ]}
          />
          {hasFilters && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("");
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
            >
              <RiRefreshLine size={11} /> Clear
            </button>
          )}
          <span className="ml-auto text-xs font-medium text-slate-400 shrink-0">
            {filtered.length} of {counselors.length} counselors
          </span>
        </div>
      </div>

      {/* Table */}
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#F8FAFC",
              headerColor: "#64748B",
              headerSplitColor: "transparent",
              rowHoverBg: "#F8FAFF",
              borderColor: "#F1F5F9",
              cellPaddingBlock: 14,
              cellPaddingInline: 12,
              fontSize: 13,
            },
          },
        }}
      >
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden min-w-0">
          <Table<CounselorData>
            dataSource={filtered}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}–${range[1]} of ${total}`,
              style: { padding: "12px 16px", margin: 0 },
            }}
            scroll={{ x: 1300 }}
            size="middle"
            locale={{
              emptyText: (
                <Empty
                  description="No counselors found"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
            onRow={(record) => ({
              onClick: () => setSelectedCounselor(record),
              style: { cursor: "pointer" },
            })}
          />
        </div>
      </ConfigProvider>

      {/* Modals & Drawers */}
      <CounselorDrawer
        counselor={selectedCounselor}
        onClose={() => setSelectedCounselor(null)}
      />
      <CompareModal
        counselors={counselors}
        selected={compareIds}
        open={showCompare}
        onClose={() => setShowCompare(false)}
      />
      <ReassignModal
        counselors={counselors}
        open={showReassign}
        onClose={() => setShowReassign(false)}
      />

      <style>{`
        .counselor-detail-tabs .ant-tabs-nav { padding: 0 16px; margin: 0; background: white; border-bottom: 1px solid #F1F5F9; }
        .counselor-detail-tabs .ant-tabs-tab { padding: 12px 8px; font-size: 13px; font-weight: 600; }
        .counselor-detail-tabs .ant-tabs-content-holder { background: #F8FAFC; }
      `}</style>
    </div>
  );
};

export default CounselorsPage;
