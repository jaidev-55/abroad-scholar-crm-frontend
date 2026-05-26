import {
  RiRefreshLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiFileCopyLine,
  RiPercentLine,
  RiTimeLine,
  RiFlashlightLine,
  RiCalendarTodoLine,
} from "react-icons/ri";
import type { SyncStats } from "../types/Index";
import { formatMs, timeAgo } from "../utils/Syncloghelpers";


interface Props {
  stats: SyncStats;
  loading?: boolean;
}

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-4 animate-pulse">
    <div className="flex justify-between">
      <div>
        <div className="h-3 w-20 bg-slate-200 rounded mb-3" />
        <div className="h-7 w-14 bg-slate-200 rounded" />
      </div>
      <div className="w-9 h-9 rounded-xl bg-slate-100" />
    </div>
  </div>
);

const SyncStatsCards: React.FC<Props> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Total Syncs",
      value: String(stats.totalSyncs),
      icon: RiRefreshLine,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      bar: "bg-blue-500",
    },
    {
      label: "Success",
      value: String(stats.successCount),
      icon: RiCheckboxCircleLine,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      bar: "bg-emerald-500",
    },
    {
      label: "Failed",
      value: String(stats.failedCount),
      icon: RiCloseCircleLine,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
      bar: "bg-red-500",
    },
    {
      label: "Duplicates",
      value: String(stats.duplicateCount),
      icon: RiFileCopyLine,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
      bar: "bg-amber-500",
    },
    {
      label: "Success Rate",
      value: `${stats.successRate}%`,
      icon: RiPercentLine,
      iconBg: "bg-teal-50",
      iconColor: "text-teal-500",
      bar: "bg-teal-500",
    },
    {
      label: "Avg Response",
      value: formatMs(stats.avgResponseTime),
      icon: RiTimeLine,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-500",
      bar: "bg-purple-500",
    },
    {
      label: "Last Sync",
      value: timeAgo(stats.lastSyncAt),
      icon: RiFlashlightLine,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-500",
      bar: "bg-indigo-500",
      small: true,
    },
    {
      label: "Today",
      value: String(stats.syncsTodayCount),
      icon: RiCalendarTodoLine,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-500",
      bar: "bg-rose-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className="group bg-white rounded-2xl border border-slate-100 p-3.5 relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50 cursor-default"
          >
            <div className="flex justify-between items-start">
              <div className="min-w-0">
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1 whitespace-nowrap">
                  {c.label}
                </p>
                <p
                  className={`font-extrabold text-slate-900 leading-none ${c.small ? "text-sm" : "text-xl"}`}
                >
                  {c.value}
                </p>
              </div>
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${c.iconBg}`}
              >
                <Icon size={14} className={c.iconColor} />
              </div>
            </div>
            <div
              className={`absolute bottom-0 left-0 right-0 h-[2px] ${c.bar} opacity-60`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SyncStatsCards;
