import React from "react";
import type { IconType } from "react-icons";
import {
  RiArrowUpSLine,
  RiArrowDownSLine,
  RiCloseCircleLine,
  RiCalendarLine,
  RiArrowGoBackLine,
  RiSpeedLine,
} from "react-icons/ri";
import type { LostLeadsStatsResponse } from "../types";

// ─── EnhancedStatCard ─────────────────────────────────────────

interface EnhancedStatCardProps {
  label: string;
  value: string | number;
  icon: IconType;
  twIconBg: string;
  twIconText: string;
  twBarBg: string;
  subtitle?: string;
  trend?: number;
  trendLabel?: string;
  isLoading?: boolean;
}

export const EnhancedStatCard: React.FC<EnhancedStatCardProps> = ({
  label,
  value,
  icon: Icon,
  twIconBg,
  twIconText,
  twBarBg,
  subtitle,
  trend,
  trendLabel,
  isLoading,
}) => (
  <div className="group bg-white rounded-2xl border border-slate-100 p-3 relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50 cursor-default w-full min-w-0">
    <div className="flex justify-between items-start gap-2">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 whitespace-nowrap truncate">
          {label}
        </p>

        {isLoading ? (
          <div className="h-8 w-16 bg-slate-100 animate-pulse rounded-lg" />
        ) : (
          <p className="text-2xl font-extrabold text-slate-900 leading-none tracking-tight">
            {value}
          </p>
        )}

        {(subtitle || trend !== undefined) && (
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            {trend !== undefined && (
              <span
                className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                  trend >= 0
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-red-700 bg-red-50"
                }`}
              >
                {trend >= 0 ? (
                  <RiArrowUpSLine size={12} />
                ) : (
                  <RiArrowDownSLine size={12} />
                )}
                {Math.abs(trend)}%
              </span>
            )}
            {(trendLabel || subtitle) && (
              <span className="text-[10px] text-slate-400 truncate">
                {trendLabel || subtitle}
              </span>
            )}
          </div>
        )}
      </div>
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${twIconBg}`}
      >
        <Icon size={17} className={twIconText} />
      </div>
    </div>
    <div
      className={`absolute bottom-0 left-0 right-0 h-[3px] ${twBarBg} opacity-60`}
    />
  </div>
);

// ─── MiniDonut ────────────────────────────────────────────────

interface DonutSegment {
  value: number;
  color: string;
}

const DONUT_COLORS = ["#EF4444", "#F59E0B", "#3B82F6", "#8B5CF6"];

const MiniDonut: React.FC<{ data: DonutSegment[]; size?: number }> = ({
  data,
  size = 52,
}) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;
  const radius = 18;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      {data.map((d, i) => {
        const pct = total > 0 ? d.value / total : 0;
        const offset = cumulative * circumference;
        // eslint-disable-next-line react-hooks/immutability
        cumulative += pct;
        return (
          <circle
            key={i}
            cx={24}
            cy={24}
            r={radius}
            fill="none"
            stroke={d.color}
            strokeWidth={6}
            strokeDasharray={`${pct * circumference} ${circumference}`}
            strokeDashoffset={-offset}
            transform="rotate(-90 24 24)"
            className="transition-all duration-500"
          />
        );
      })}
      <text
        x={24}
        y={24}
        textAnchor="middle"
        dominantBaseline="central"
        className="text-[11px] font-extrabold fill-slate-800"
      >
        {total}
      </text>
    </svg>
  );
};

// ─── TopReasonsCard ───────────────────────────────────────────

interface TopReasonsCardProps {
  topReasons: LostLeadsStatsResponse["topLostReasons"];
  isLoading?: boolean;
}

const TopReasonsCard: React.FC<TopReasonsCardProps> = ({
  topReasons,
  isLoading,
}) => (
  <div className="group bg-white rounded-2xl border border-slate-100 p-4 relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50 cursor-default w-full min-w-0">
    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
      Top Lost Reasons
    </p>

    {isLoading ? (
      <div className="flex items-center gap-3">
        <div className="w-[52px] h-[52px] rounded-full bg-slate-100 animate-pulse shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-3 bg-slate-100 animate-pulse rounded" />
          ))}
        </div>
      </div>
    ) : (
      <div className="flex items-center gap-3">
        <MiniDonut
          data={topReasons.map((r, i) => ({
            value: r.count,
            color: DONUT_COLORS[i % DONUT_COLORS.length],
          }))}
          size={52}
        />
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          {topReasons.slice(0, 3).map((r, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-sm shrink-0"
                style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}
              />
              <span className="text-[11px] text-slate-700 font-semibold truncate">
                {r.reason ?? "—"}
              </span>
              <span className="text-[10px] text-slate-400 font-bold ml-auto shrink-0">
                {r.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-500 via-amber-500 to-blue-500 opacity-50" />
  </div>
);

// ─── StatsBar ─────────────────────────────────────────────────

interface StatsBarProps {
  stats?: LostLeadsStatsResponse;
  isLoading?: boolean;
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats, isLoading }) => {
  // trend: negative is good here (fewer lost leads), so flip the color logic
  const monthTrend =
    stats && stats.lostLastMonth > 0
      ? Math.round(
          ((stats.lostThisMonth - stats.lostLastMonth) / stats.lostLastMonth) *
            100,
        )
      : 0;

  return (
    <div className="w-full min-w-0 overflow-hidden">
      <div
        className="overflow-x-auto pb-1"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#CBD5E1 transparent",
        }}
      >
        <div className="grid grid-cols-5 gap-3 min-w-[960px]">
          <EnhancedStatCard
            label="Total Lost"
            value={stats?.totalLost ?? 0}
            icon={RiCloseCircleLine}
            twIconBg="bg-red-50"
            twIconText="text-red-500"
            twBarBg="bg-red-500"
            subtitle={`${(stats?.totalLost ?? 0) + (stats?.reactivated ?? 0)} total ever lost`} // ✅ shows full picture
            isLoading={isLoading}
          />
          <EnhancedStatCard
            label="Lost This Month"
            value={stats?.lostThisMonth ?? 0}
            icon={RiCalendarLine}
            twIconBg="bg-amber-50"
            twIconText="text-amber-500"
            twBarBg="bg-amber-500"
            trend={monthTrend}
            trendLabel="vs last month"
            isLoading={isLoading}
          />
          <EnhancedStatCard
            label="Reactivated"
            value={stats?.reactivated ?? 0}
            icon={RiArrowGoBackLine}
            twIconBg="bg-emerald-50"
            twIconText="text-emerald-500"
            twBarBg="bg-emerald-500"
            subtitle={`${stats?.recoveryRate ?? 0}% recovery rate`}
            isLoading={isLoading}
          />
          <EnhancedStatCard
            label="Recovery Rate"
            value={`${stats?.recoveryRate ?? 0}%`}
            icon={RiSpeedLine}
            twIconBg="bg-cyan-50"
            twIconText="text-cyan-500"
            twBarBg="bg-cyan-500"
            subtitle={`${stats?.reactivated ?? 0} of ${stats?.totalLost ?? 0} leads`}
            isLoading={isLoading}
          />
          <TopReasonsCard
            topReasons={stats?.topLostReasons ?? []}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
