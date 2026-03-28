import React, { useState, useMemo } from "react";
import {
  Table,
  Select,
  Tooltip,
  ConfigProvider,
  Drawer,
  Empty,
  message,
  Tabs,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useForm } from "react-hook-form";
import CustomInput from "../../components/common/CustomInput";
import CustomModal from "../../components/common/CustomModal";
import {
  RiFireLine,
  RiRefreshLine,
  RiDownloadLine,
  RiCloseLine,
  RiCheckLine,
  RiMoneyDollarCircleLine,
  RiBarChartLine,
  RiCloseCircleLine,
  RiCheckboxCircleLine,
  RiGroupLine,
  RiPercentLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiEyeLine,
  RiInstagramLine,
  RiFacebookLine,
  RiGoogleLine,
  RiComputerLine,
  RiUserHeartLine,
  RiFootprintLine,
  RiTeamLine,
  RiPhoneLine,
  RiPencilLine,
  RiFolder3Line,
  RiPauseLine,
  RiArrowRightSLine,
} from "react-icons/ri";

interface Campaign {
  id: string;
  name: string;
  source: string;
  status: "active" | "paused" | "completed";
  startDate: string;

  spend: number;
  clicks: number;
  impressions: number;
  ctr: number;
  cpc: number;
  // CRM performance
  leads: number;
  hot: number;
  applied: number;
  enrolled: number;
  lost: number;
  revenue: number;
}

interface LeadSource {
  id: string;
  name: string;
  platform: "meta" | "google" | "organic";
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  leads: number;
  hot: number;
  applied: number;
  enrolled: number;
  lost: number;
  revenue: number;
  cost: number;
  campaigns: Campaign[];
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

const formatINR = (val: number): string => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val.toLocaleString("en-IN")}`;
};

// ═══════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════

const COUNTRIES_FILTER = [
  "All",
  "🇬🇧 UK",
  "🇨🇦 Canada",
  "🇺🇸 USA",
  "🇦🇺 Australia",
  "🇩🇪 Germany",
];

const buildCampaign = (
  id: string,
  name: string,
  source: string,
  status: Campaign["status"],
): Campaign => {
  const spend = 5000 + Math.floor(Math.random() * 30000);
  const impressions = 5000 + Math.floor(Math.random() * 50000);
  const clicks = Math.floor(impressions * (0.01 + Math.random() * 0.06));
  const leads = Math.floor(clicks * (0.05 + Math.random() * 0.15));
  const hot = Math.floor(leads * (0.15 + Math.random() * 0.25));
  const applied = Math.floor(leads * (0.2 + Math.random() * 0.2));
  const enrolled = Math.floor(leads * (0.05 + Math.random() * 0.18));
  const lost = Math.floor(leads * (0.08 + Math.random() * 0.12));
  const revPer = 150000 + Math.floor(Math.random() * 200000);
  return {
    id,
    name,
    source,
    status,
    startDate: new Date(
      2025,
      10 + Math.floor(Math.random() * 4),
      1 + Math.floor(Math.random() * 27),
    )
      .toISOString()
      .split("T")[0],
    spend,
    clicks,
    impressions,
    ctr: clicks > 0 ? parseFloat(((clicks / impressions) * 100).toFixed(2)) : 0,
    cpc: clicks > 0 ? Math.round(spend / clicks) : 0,
    leads,
    hot,
    applied,
    enrolled,
    lost,
    revenue: enrolled * revPer,
  };
};

const generateSources = (): LeadSource[] => {
  const defs: {
    name: string;
    platform: LeadSource["platform"];
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    borderColor: string;
    campaigns: string[];
  }[] = [
    {
      name: "Instagram Ads",
      platform: "meta",
      icon: <RiInstagramLine size={16} />,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      campaigns: ["Jan Campaign", "IELTS Push", "Canada 2026", "UK Masters"],
    },
    {
      name: "Facebook Ads",
      platform: "meta",
      icon: <RiFacebookLine size={16} />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      campaigns: ["Lookalike Audience", "Retargeting Feb", "Webinar Leads"],
    },
    {
      name: "Google Ads",
      platform: "google",
      icon: <RiGoogleLine size={16} />,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      campaigns: [
        "Brand Search",
        "IELTS Keywords",
        "UK University",
        "Canada PR",
      ],
    },
    {
      name: "Website",
      platform: "organic",
      icon: <RiComputerLine size={16} />,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      campaigns: ["Organic Blog", "Landing Page A", "SEO Traffic"],
    },
    {
      name: "Referral",
      platform: "organic",
      icon: <RiUserHeartLine size={16} />,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      campaigns: ["Student Referral", "Partner Agency", "Alumni Network"],
    },
    {
      name: "Walk-in",
      platform: "organic",
      icon: <RiFootprintLine size={16} />,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      campaigns: ["Office Visit", "Edu Fair Delhi", "Edu Fair Mumbai"],
    },
    {
      name: "Education Fair",
      platform: "organic",
      icon: <RiTeamLine size={16} />,
      color: "text-violet-600",
      bgColor: "bg-violet-50",
      borderColor: "border-violet-200",
      campaigns: ["Delhi Expo Jan", "Mumbai Expo Feb"],
    },
    {
      name: "WhatsApp",
      platform: "organic",
      icon: <RiPhoneLine size={16} />,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      campaigns: ["Broadcast Jan", "Status Ads", "Group Outreach"],
    },
  ];

  return defs.map((def, i) => {
    const camps = def.campaigns.map((cName, j) =>
      buildCampaign(
        `camp-${i}-${j}`,
        cName,
        def.name,
        (["active", "paused", "completed"] as const)[j % 3],
      ),
    );
    return {
      id: `src-${i + 1}`,
      name: def.name,
      platform: def.platform,
      icon: def.icon,
      color: def.color,
      bgColor: def.bgColor,
      borderColor: def.borderColor,
      leads: camps.reduce((s, c) => s + c.leads, 0),
      hot: camps.reduce((s, c) => s + c.hot, 0),
      applied: camps.reduce((s, c) => s + c.applied, 0),
      enrolled: camps.reduce((s, c) => s + c.enrolled, 0),
      lost: camps.reduce((s, c) => s + c.lost, 0),
      revenue: camps.reduce((s, c) => s + c.revenue, 0),
      cost: camps.reduce((s, c) => s + c.spend, 0),
      campaigns: camps,
    };
  });
};

const LEAD_SOURCES = generateSources();

// ═══════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════

const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: React.ReactNode;
  bg: string;
  tc: string;
  barBg: string;
}> = ({ label, value, icon, bg, tc, barBg }) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-4 relative overflow-hidden min-w-0">
    <div className="flex justify-between items-start gap-2">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 truncate">
          {label}
        </p>
        <p className="text-2xl font-extrabold text-slate-900 leading-none tracking-tight">
          {value}
        </p>
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

const ROIBadge: React.FC<{ roi: number }> = ({ roi }) => {
  const cls =
    roi >= 500
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : roi >= 200
        ? "bg-blue-50 text-blue-700 border-blue-200"
        : roi >= 0
          ? "bg-amber-50 text-amber-700 border-amber-200"
          : "bg-red-50 text-red-700 border-red-200";
  return (
    <span
      className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[11px] font-bold border ${cls}`}
    >
      {roi >= 0 ? <RiArrowUpLine size={10} /> : <RiArrowDownLine size={10} />}{" "}
      {roi.toFixed(0)}%
    </span>
  );
};

const CampaignStatusDot: React.FC<{ status: Campaign["status"] }> = ({
  status,
}) => {
  const cfg = {
    active: {
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
    },
    paused: {
      cls: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
    },
    completed: {
      cls: "bg-slate-50 text-slate-600 border-slate-200",
      dot: "bg-slate-400",
    },
  };
  const c = cfg[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${c.cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />{" "}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════
// CAMPAIGN DETAIL DRAWER (Grouped: Ad / CRM / Profit + Funnel)
// ═══════════════════════════════════════════════════════════════

const CampaignDrawer: React.FC<{
  source: LeadSource | null;
  campaign: Campaign | null;
  onClose: () => void;
  onPause: (campId: string) => void;
  onExport: (camp: Campaign) => void;
}> = ({ source, campaign, onClose, onPause, onExport }) => {
  if (!campaign || !source) return null;
  const c = campaign;
  const conv = c.leads > 0 ? Math.round((c.enrolled / c.leads) * 100) : 0;
  const roi =
    c.spend > 0 ? Math.round(((c.revenue - c.spend) / c.spend) * 100) : 0;

  return (
    <Drawer
      open={!!campaign}
      onClose={onClose}
      width={480}
      title={null}
      styles={{
        body: { padding: 0, background: "#F8FAFC" },
        header: { display: "none" },
      }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 px-6 py-5 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/[0.04]" />
        <div className="flex justify-between items-start relative z-10">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${source.bgColor} ${source.color} border ${source.borderColor}`}
            >
              {source.icon}
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-white leading-tight">
                {c.name}
              </h2>
              <p className="text-xs text-white/50 mt-0.5">
                {source.name} • Started{" "}
                {new Date(c.startDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 border-none rounded-lg p-1.5 cursor-pointer flex text-white transition-colors"
          >
            <RiCloseLine size={18} />
          </button>
        </div>
        <div className="flex gap-2 mt-3 relative z-10">
          <CampaignStatusDot status={c.status} />
          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/10 text-white/80 border border-white/15">
            {conv}% conv
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/10 text-white/80 border border-white/15">
            {roi}% ROI
          </span>
        </div>
      </div>

      <div
        className="p-5 flex flex-col gap-5 overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 180px)", scrollbarWidth: "thin" }}
      >
        {/* ── Ad Performance ── */}
        <div>
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            Ad Performance
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Spend", value: formatINR(c.spend) },
              { label: "Clicks", value: c.clicks.toLocaleString() },
              { label: "CTR", value: `${c.ctr}%` },
              { label: "CPC", value: formatINR(c.cpc) },
            ].map((m) => (
              <div
                key={m.label}
                className="bg-white rounded-xl border border-slate-100 p-3 text-center"
              >
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {m.label}
                </div>
                <div className="text-[15px] font-extrabold text-slate-800 mt-1">
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CRM Performance ── */}
        <div>
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            CRM Performance
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Leads", value: c.leads, cls: "text-blue-700" },
              { label: "Enrolled", value: c.enrolled, cls: "text-emerald-700" },
              {
                label: "Revenue",
                value: formatINR(c.revenue),
                cls: "text-slate-800",
              },
            ].map((m) => (
              <div
                key={m.label}
                className="bg-white rounded-xl border border-slate-100 p-3 text-center"
              >
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {m.label}
                </div>
                <div className={`text-[15px] font-extrabold mt-1 ${m.cls}`}>
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Profit Metrics ── */}
        <div>
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            Profit Metrics
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white rounded-xl border border-slate-100 p-3 text-center">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                ROI
              </div>
              <div className="mt-1">
                <ROIBadge roi={roi} />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-3 text-center">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Cost
              </div>
              <div className="text-[15px] font-extrabold text-red-600 mt-1">
                {formatINR(c.spend)}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-3 text-center">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Profit
              </div>
              <div
                className={`text-[15px] font-extrabold mt-1 ${c.revenue - c.spend >= 0 ? "text-emerald-700" : "text-red-600"}`}
              >
                {formatINR(c.revenue - c.spend)}
              </div>
            </div>
          </div>
        </div>

        {/* ── Funnel (Simple vertical) ── */}
        <div>
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            Funnel
          </h4>
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            {[
              { label: "Leads", value: c.leads, bg: "bg-blue-500", w: 100 },
              {
                label: "Hot",
                value: c.hot,
                bg: "bg-red-500",
                w: c.leads > 0 ? (c.hot / c.leads) * 100 : 0,
              },
              {
                label: "Applied",
                value: c.applied,
                bg: "bg-amber-500",
                w: c.leads > 0 ? (c.applied / c.leads) * 100 : 0,
              },
              {
                label: "Enrolled",
                value: c.enrolled,
                bg: "bg-emerald-500",
                w: c.leads > 0 ? (c.enrolled / c.leads) * 100 : 0,
              },
            ].map((step, i, arr) => (
              <div key={step.label}>
                <div className="flex items-center gap-3 py-2">
                  <span className="text-xs font-semibold text-slate-600 w-16">
                    {step.label}
                  </span>
                  <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${step.bg}`}
                      style={{ width: `${Math.max(step.w, 4)}%` }}
                    />
                  </div>
                  <span className="text-sm font-extrabold text-slate-800 w-8 text-right">
                    {step.value}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div className="flex items-center pl-7 py-0.5">
                    <RiArrowRightSLine
                      size={12}
                      className="text-slate-300 rotate-90"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Actions (Minimal) ── */}
        <div className="flex gap-2 pt-1">
          {c.status === "active" && (
            <button
              onClick={() => onPause(c.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 cursor-pointer hover:bg-amber-100 transition-colors"
            >
              <RiPauseLine size={14} /> Pause Campaign
            </button>
          )}
          <button
            onClick={() => onExport(c)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-semibold text-slate-600 bg-white border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <RiDownloadLine size={14} /> Export Report
          </button>
        </div>
      </div>
    </Drawer>
  );
};

// ═══════════════════════════════════════════════════════════════
// SOURCE DETAIL DRAWER (overview + campaigns list)
// ═══════════════════════════════════════════════════════════════

const SourceDrawer: React.FC<{
  source: LeadSource | null;
  onClose: () => void;
  onSelectCampaign: (source: LeadSource, camp: Campaign) => void;
}> = ({ source, onClose, onSelectCampaign }) => {
  if (!source) return null;
  const s = source;
  const conv = s.leads > 0 ? Math.round((s.enrolled / s.leads) * 100) : 0;
  const roi =
    s.cost > 0 ? Math.round(((s.revenue - s.cost) / s.cost) * 100) : 0;

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
          <div className="grid grid-cols-3 gap-2.5">
            {[
              {
                label: "Leads",
                value: s.leads,
                cls: "text-blue-700",
                bg: "bg-blue-50",
              },
              {
                label: "Hot",
                value: s.hot,
                cls: "text-red-700",
                bg: "bg-red-50",
              },
              {
                label: "Applied",
                value: s.applied,
                cls: "text-amber-700",
                bg: "bg-amber-50",
              },
              {
                label: "Enrolled",
                value: s.enrolled,
                cls: "text-emerald-700",
                bg: "bg-emerald-50",
              },
              {
                label: "Lost",
                value: s.lost,
                cls: "text-rose-700",
                bg: "bg-rose-50",
              },
              {
                label: "Conv %",
                value: `${conv}%`,
                cls: "text-indigo-700",
                bg: "bg-indigo-50",
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`${item.bg} rounded-xl p-3 border border-slate-100 text-center`}
              >
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {item.label}
                </div>
                <div className={`text-lg font-extrabold ${item.cls} mt-0.5`}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
          {/* Financial Summary */}
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              Financials
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                {
                  label: "Revenue",
                  value: formatINR(s.revenue),
                  cls: "text-emerald-700",
                },
                {
                  label: "Ad Spend",
                  value: formatINR(s.cost),
                  cls: "text-red-600",
                },
                { label: "ROI", value: <ROIBadge roi={roi} />, cls: "" },
                {
                  label: "Profit",
                  value: formatINR(s.revenue - s.cost),
                  cls: s.revenue > s.cost ? "text-emerald-700" : "text-red-600",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-100"
                >
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {item.label}
                  </div>
                  <div
                    className={`text-[15px] font-extrabold mt-0.5 ${item.cls}`}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Funnel */}
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              Funnel
            </h4>
            {[
              { label: "Leads", value: s.leads, bg: "bg-blue-500", w: 100 },
              {
                label: "Hot",
                value: s.hot,
                bg: "bg-red-500",
                w: s.leads > 0 ? (s.hot / s.leads) * 100 : 0,
              },
              {
                label: "Applied",
                value: s.applied,
                bg: "bg-amber-500",
                w: s.leads > 0 ? (s.applied / s.leads) * 100 : 0,
              },
              {
                label: "Enrolled",
                value: s.enrolled,
                bg: "bg-emerald-500",
                w: s.leads > 0 ? (s.enrolled / s.leads) * 100 : 0,
              },
            ].map((step, i, arr) => (
              <div key={step.label}>
                <div className="flex items-center gap-3 py-1.5">
                  <span className="text-xs font-semibold text-slate-600 w-16">
                    {step.label}
                  </span>
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${step.bg}`}
                      style={{ width: `${Math.max(step.w, 4)}%` }}
                    />
                  </div>
                  <span className="text-sm font-extrabold text-slate-800 w-8 text-right">
                    {step.value}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div className="flex items-center pl-7 py-0">
                    <RiArrowRightSLine
                      size={11}
                      className="text-slate-300 rotate-90"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: "campaigns",
      label: (
        <span className="flex items-center gap-1.5">
          <RiFolder3Line size={13} /> Campaigns ({s.campaigns.length})
        </span>
      ),
      children: (
        <div className="p-4 flex flex-col gap-2.5">
          {s.campaigns.map((camp) => {
            const cConv =
              camp.leads > 0
                ? Math.round((camp.enrolled / camp.leads) * 100)
                : 0;
            const cRoi =
              camp.spend > 0
                ? Math.round(((camp.revenue - camp.spend) / camp.spend) * 100)
                : 0;
            return (
              <button
                key={camp.id}
                onClick={() => onSelectCampaign(s, camp)}
                className="w-full text-left bg-white rounded-xl border border-slate-100 p-4 cursor-pointer hover:border-blue-200 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {camp.name}
                    </span>
                    <CampaignStatusDot status={camp.status} />
                  </div>
                  <RiArrowRightSLine
                    size={16}
                    className="text-slate-300 group-hover:text-blue-500 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "Leads", value: camp.leads },
                    { label: "Enrolled", value: camp.enrolled },
                    { label: "Conv", value: `${cConv}%` },
                    { label: "ROI", value: `${cRoi}%` },
                  ].map((m) => (
                    <div key={m.label} className="text-center">
                      <div className="text-[9px] font-semibold text-slate-400 uppercase">
                        {m.label}
                      </div>
                      <div className="text-xs font-bold text-slate-700">
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      ),
    },
  ];

  return (
    <Drawer
      open={!!source}
      onClose={onClose}
      width={520}
      title={null}
      styles={{
        body: { padding: 0, background: "#F8FAFC" },
        header: { display: "none" },
      }}
    >
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 px-6 py-5 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/[0.04]" />
        <div className="flex justify-between items-start relative z-10">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center border ${s.bgColor} ${s.borderColor} ${s.color}`}
            >
              {s.icon}
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-white leading-tight">
                {s.name}
              </h2>
              <p className="text-xs text-white/50 mt-0.5">
                {s.leads} leads • {s.campaigns.length} campaigns
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 border-none rounded-lg p-1.5 cursor-pointer flex text-white transition-colors"
          >
            <RiCloseLine size={18} />
          </button>
        </div>
        <div className="flex gap-2 mt-3 relative z-10">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/10 text-white/80 border border-white/15">
            {formatINR(s.revenue)}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/10 text-white/80 border border-white/15">
            {conv}% conv
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/10 text-white/80 border border-white/15">
            {roi}% ROI
          </span>
        </div>
      </div>
      <Tabs
        items={tabItems}
        defaultActiveKey="overview"
        className="src-detail-tabs"
        style={{ margin: 0 }}
      />
    </Drawer>
  );
};

// ═══════════════════════════════════════════════════════════════
// EDIT COST MODAL (uses custom components)
// ═══════════════════════════════════════════════════════════════

const EditCostModal: React.FC<{
  source: LeadSource | null;
  open: boolean;
  onClose: () => void;
  onSave: (sourceId: string, cost: number) => void;
}> = ({ source, open, onClose, onSave }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { cost: "" } });
  const [loading, setLoading] = useState(false);
  if (!source) return null;

  const onSubmit = (data: any) => {
    setLoading(true);
    setTimeout(() => {
      onSave(source.id, Number(data.cost));
      setLoading(false);
      reset();
      onClose();
    }, 300);
  };

  return (
    <CustomModal open={open} onClose={onClose}>
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-4 relative overflow-hidden">
        <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/[0.06]" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <RiMoneyDollarCircleLine size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-white">
                Update Ad Spend
              </h3>
              <p className="text-[11px] text-white/60">{source.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-white/15 hover:bg-white/25 border-none rounded-lg p-1.5 cursor-pointer flex text-white transition-colors"
          >
            <RiCloseLine size={16} />
          </button>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-5 flex flex-col gap-4"
      >
        <div className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500">
          <span>
            Current:{" "}
            <strong className="text-slate-800">{formatINR(source.cost)}</strong>
          </span>
          <span className="text-slate-200">•</span>
          <span>
            Revenue:{" "}
            <strong className="text-emerald-700">
              {formatINR(source.revenue)}
            </strong>
          </span>
        </div>
        <CustomInput
          name="cost"
          label="New Ad Spend (₹)"
          placeholder="e.g. 50000"
          icon={
            <RiMoneyDollarCircleLine size={14} className="text-slate-400" />
          }
          control={control}
          rules={{
            required: "Amount is required",
            pattern: { value: /^\d+$/, message: "Enter a valid number" },
          }}
        />
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-[13px] font-semibold text-slate-500 bg-transparent border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-[13px] font-bold border-none cursor-pointer transition-all ${!loading ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-200" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                Saving...
              </>
            ) : (
              <>
                <RiCheckLine size={14} /> Update
              </>
            )}
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════

const LeadSourcePage: React.FC = () => {
  const [sources, setSources] = useState<LeadSource[]>(LEAD_SOURCES);
  const [selectedSource, setSelectedSource] = useState<LeadSource | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<{
    source: LeadSource;
    campaign: Campaign;
  } | null>(null);
  const [editCostSource, setEditCostSource] = useState<LeadSource | null>(null);
  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("All");

  const filtered = useMemo(() => {
    return sources.filter((s) => {
      if (platformFilter !== "all" && s.platform !== platformFilter)
        return false;
      return true;
    });
  }, [sources, platformFilter]);

  const totals = useMemo(() => {
    const t = { leads: 0, enrolled: 0, lost: 0, revenue: 0, cost: 0 };
    filtered.forEach((s) => {
      t.leads += s.leads;
      t.enrolled += s.enrolled;
      t.lost += s.lost;
      t.revenue += s.revenue;
      t.cost += s.cost;
    });
    return {
      ...t,
      convRate: t.leads > 0 ? Math.round((t.enrolled / t.leads) * 100) : 0,
    };
  }, [filtered]);

  const handleUpdateCost = (sourceId: string, newCost: number) => {
    setSources((prev) =>
      prev.map((s) => (s.id === sourceId ? { ...s, cost: newCost } : s)),
    );
    message.success({ content: "Ad spend updated!", duration: 2 });
  };

  const handlePauseCampaign = (campId: string) => {
    message.success({ content: "Campaign paused!", duration: 2 });
    setSelectedCampaign(null);
  };

  const handleExportCampaign = (camp: Campaign) => {
    const headers = [
      "Name",
      "Source",
      "Status",
      "Spend",
      "Clicks",
      "CTR",
      "CPC",
      "Leads",
      "Enrolled",
      "Revenue",
      "ROI",
    ];
    const roi =
      camp.spend > 0
        ? Math.round(((camp.revenue - camp.spend) / camp.spend) * 100)
        : 0;
    const row = [
      camp.name,
      camp.source,
      camp.status,
      camp.spend,
      camp.clicks,
      `${camp.ctr}%`,
      camp.cpc,
      camp.leads,
      camp.enrolled,
      camp.revenue,
      `${roi}%`,
    ];
    const csv = [headers.join(","), row.join(",")].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${camp.name.replace(/\s+/g, "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    message.success({ content: "Report exported!", duration: 2 });
  };

  const handleExportAll = () => {
    const headers = [
      "Source",
      "Leads",
      "Hot",
      "Applied",
      "Enrolled",
      "Lost",
      "Conv %",
      "Revenue",
      "Cost",
      "ROI %",
    ];
    const rows = filtered.map((s) => {
      const conv = s.leads > 0 ? Math.round((s.enrolled / s.leads) * 100) : 0;
      const roi =
        s.cost > 0 ? Math.round(((s.revenue - s.cost) / s.cost) * 100) : 0;
      return [
        s.name,
        s.leads,
        s.hot,
        s.applied,
        s.enrolled,
        s.lost,
        conv,
        s.revenue,
        s.cost,
        roi,
      ];
    });
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lead_sources.csv";
    a.click();
    URL.revokeObjectURL(url);
    message.success({ content: "CSV exported!", duration: 2 });
  };

  const hasFilters =
    platformFilter !== "all" ||
    statusFilter !== "all" ||
    countryFilter !== "All";

  // Table columns (sorting via column headers)
  const columns: ColumnsType<LeadSource> = [
    {
      title: "Source",
      dataIndex: "name",
      key: "name",
      width: 180,
      fixed: "left" as const,
      render: (name: string, record) => (
        <button
          onClick={() => setSelectedSource(record)}
          className="flex items-center gap-2.5 bg-transparent border-none cursor-pointer p-0 text-left w-full group"
        >
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center border ${record.bgColor} ${record.borderColor} ${record.color}`}
          >
            {record.icon}
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
              {name}
            </div>
            <div className="text-[10px] text-slate-400">
              {record.campaigns.length} campaigns
            </div>
          </div>
        </button>
      ),
    },
    {
      title: "Leads",
      dataIndex: "leads",
      key: "leads",
      width: 70,
      sorter: (a, b) => a.leads - b.leads,
      render: (v: number) => (
        <span className="text-[13px] font-bold text-slate-800">{v}</span>
      ),
    },
    {
      title: "Hot",
      dataIndex: "hot",
      key: "hot",
      width: 55,
      render: (v: number) => (
        <span className="inline-flex items-center gap-0.5 text-[12px] font-bold text-red-600">
          <RiFireLine size={10} /> {v}
        </span>
      ),
    },
    {
      title: "Applied",
      dataIndex: "applied",
      key: "applied",
      width: 70,
      render: (v: number) => (
        <span className="text-[13px] font-semibold text-amber-700">{v}</span>
      ),
    },
    {
      title: "Enrolled",
      dataIndex: "enrolled",
      key: "enrolled",
      width: 75,
      sorter: (a, b) => a.enrolled - b.enrolled,
      render: (v: number) => (
        <span className="text-[13px] font-bold text-emerald-700">{v}</span>
      ),
    },
    {
      title: "Lost",
      dataIndex: "lost",
      key: "lost",
      width: 55,
      render: (v: number) => (
        <span className="text-[13px] text-red-600 font-semibold">{v}</span>
      ),
    },
    {
      title: "Conv %",
      key: "conv",
      width: 80,
      sorter: (a, b) => {
        const ca = a.leads > 0 ? a.enrolled / a.leads : 0;
        const cb = b.leads > 0 ? b.enrolled / b.leads : 0;
        return ca - cb;
      },
      render: (_: unknown, r: LeadSource) => {
        const conv = r.leads > 0 ? Math.round((r.enrolled / r.leads) * 100) : 0;
        return (
          <span
            className={`text-[13px] font-bold ${conv >= 20 ? "text-emerald-600" : conv >= 10 ? "text-amber-600" : "text-red-600"}`}
          >
            {conv}%
          </span>
        );
      },
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      width: 100,
      sorter: (a, b) => a.revenue - b.revenue,
      render: (v: number) => (
        <span className="text-[13px] font-bold text-slate-800">
          {formatINR(v)}
        </span>
      ),
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
      width: 90,
      render: (v: number, record: LeadSource) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setEditCostSource(record);
          }}
          className="flex items-center gap-1 text-[12px] font-semibold text-slate-600 bg-transparent border-none cursor-pointer p-0 hover:text-blue-600 transition-colors group"
        >
          {formatINR(v)}{" "}
          <RiPencilLine
            size={10}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </button>
      ),
    },
    {
      title: "ROI",
      key: "roi",
      width: 90,
      sorter: (a, b) => {
        const ra = a.cost > 0 ? (a.revenue - a.cost) / a.cost : 0;
        const rb = b.cost > 0 ? (b.revenue - b.cost) / b.cost : 0;
        return ra - rb;
      },
      render: (_: unknown, r: LeadSource) => {
        const roi =
          r.cost > 0 ? Math.round(((r.revenue - r.cost) / r.cost) * 100) : 0;
        return <ROIBadge roi={roi} />;
      },
    },
    {
      title: "",
      key: "view",
      width: 40,
      fixed: "right" as const,
      render: (_: unknown, record: LeadSource) => (
        <Tooltip title="View Details">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedSource(record);
            }}
            className="bg-transparent border-none p-1.5 rounded-lg cursor-pointer flex text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <RiEyeLine size={15} />
          </button>
        </Tooltip>
      ),
    },
  ];

  // Summary row
  const summaryRow: LeadSource = {
    id: "total",
    name: "TOTAL",
    platform: "organic",
    icon: <RiBarChartLine size={16} />,
    color: "text-slate-700",
    bgColor: "bg-slate-100",
    borderColor: "border-slate-300",
    leads: totals.leads,
    hot: filtered.reduce((s, x) => s + x.hot, 0),
    applied: filtered.reduce((s, x) => s + x.applied, 0),
    enrolled: totals.enrolled,
    lost: totals.lost,
    revenue: totals.revenue,
    cost: totals.cost,
    campaigns: [],
  };

  return (
    <div className="flex flex-col gap-4 w-full p-5 overflow-hidden min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap min-w-0">
        <div className="min-w-0">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Lead Sources
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Source performance, ROI & campaign analytics
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportAll}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-semibold bg-white text-slate-600 border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all"
          >
            <RiDownloadLine size={15} /> Export
          </button>
        </div>
      </div>

      {/* Summary Cards — clean KPIs only */}
      <div className="w-full min-w-0 overflow-hidden">
        <div
          className="overflow-x-auto pb-1"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#CBD5E1 transparent",
          }}
        >
          <div className="grid grid-cols-5 gap-3 min-w-[750px]">
            <StatCard
              label="Total Leads"
              value={totals.leads}
              icon={<RiGroupLine size={17} />}
              bg="bg-blue-50"
              tc="text-blue-500"
              barBg="bg-blue-500"
            />
            <StatCard
              label="Total Revenue"
              value={formatINR(totals.revenue)}
              icon={<RiMoneyDollarCircleLine size={17} />}
              bg="bg-emerald-50"
              tc="text-emerald-500"
              barBg="bg-emerald-500"
            />
            <StatCard
              label="Enrollments"
              value={totals.enrolled}
              icon={<RiCheckboxCircleLine size={17} />}
              bg="bg-violet-50"
              tc="text-violet-500"
              barBg="bg-violet-500"
            />
            <StatCard
              label="Lost Leads"
              value={totals.lost}
              icon={<RiCloseCircleLine size={17} />}
              bg="bg-rose-50"
              tc="text-rose-500"
              barBg="bg-rose-500"
            />
            <StatCard
              label="Conversion"
              value={`${totals.convRate}%`}
              icon={<RiPercentLine size={17} />}
              bg="bg-cyan-50"
              tc="text-cyan-500"
              barBg="bg-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Filters — essential only */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 min-w-0 overflow-hidden">
        <div className="flex flex-wrap gap-2 items-center">
          <Select
            value={platformFilter}
            onChange={setPlatformFilter}
            style={{ width: 140 }}
            options={[
              { value: "all", label: "All Platforms" },
              { value: "meta", label: "📱 Meta (FB+IG)" },
              { value: "google", label: "🔍 Google" },
              { value: "organic", label: "🌱 Organic" },
            ]}
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 150 }}
            options={[
              { value: "all", label: "All Statuses" },
              { value: "active", label: "🟢 Active" },
              { value: "paused", label: "🟡 Paused" },
              { value: "completed", label: "⚫ Completed" },
            ]}
          />
          <Select
            value={countryFilter}
            onChange={setCountryFilter}
            style={{ width: 130 }}
            options={COUNTRIES_FILTER.map((c) => ({ value: c, label: c }))}
          />
          {hasFilters && (
            <button
              onClick={() => {
                setPlatformFilter("all");
                setStatusFilter("all");
                setCountryFilter("All");
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
            >
              <RiRefreshLine size={11} /> Clear
            </button>
          )}
          <span className="ml-auto text-xs font-medium text-slate-400 shrink-0">
            {filtered.length} sources
          </span>
        </div>
      </div>

      {/* Table — sorting via column headers */}
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
          <Table<LeadSource>
            dataSource={[...filtered, summaryRow]}
            columns={columns}
            rowKey="id"
            pagination={false}
            scroll={{ x: 1050 }}
            size="middle"
            locale={{
              emptyText: (
                <Empty
                  description="No sources found"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
            onRow={(record) => ({
              onClick: () => {
                if (record.id !== "total") setSelectedSource(record);
              },
              style: { cursor: record.id === "total" ? "default" : "pointer" },
            })}
            rowClassName={(record) =>
              record.id === "total" ? "!bg-slate-50/80 !font-bold" : ""
            }
          />
        </div>
      </ConfigProvider>

      {/* Drawers & Modals */}
      <SourceDrawer
        source={selectedSource}
        onClose={() => setSelectedSource(null)}
        onSelectCampaign={(src, camp) => {
          setSelectedSource(null);
          setSelectedCampaign({ source: src, campaign: camp });
        }}
      />
      <CampaignDrawer
        source={selectedCampaign?.source || null}
        campaign={selectedCampaign?.campaign || null}
        onClose={() => setSelectedCampaign(null)}
        onPause={handlePauseCampaign}
        onExport={handleExportCampaign}
      />
      <EditCostModal
        source={editCostSource}
        open={!!editCostSource}
        onClose={() => setEditCostSource(null)}
        onSave={handleUpdateCost}
      />

      <style>{`
        .src-detail-tabs .ant-tabs-nav { padding: 0 16px; margin: 0; background: white; border-bottom: 1px solid #F1F5F9; }
        .src-detail-tabs .ant-tabs-tab { padding: 12px 8px; font-size: 13px; font-weight: 600; }
        .src-detail-tabs .ant-tabs-content-holder { background: #F8FAFC; }
      `}</style>
    </div>
  );
};

export default LeadSourcePage;
