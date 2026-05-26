import {
  RiShieldCheckLine,
  RiToggleLine,
  RiAlarmWarningLine,
  RiErrorWarningLine,
  RiAlertLine,
  RiInformationLine,
} from "react-icons/ri";
import type { AlertStats } from "../types/Index";


interface Props {
  stats: AlertStats;
  loading?: boolean;
}

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-4 animate-pulse">
    <div className="flex justify-between">
      <div>
        <div className="h-3 w-20 bg-slate-200 rounded mb-3" />
        <div className="h-7 w-10 bg-slate-200 rounded" />
      </div>
      <div className="w-9 h-9 rounded-xl bg-slate-100" />
    </div>
  </div>
);

const AlertStatsCards: React.FC<Props> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Total Rules",
      value: stats.totalRules,
      icon: RiShieldCheckLine,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      bar: "bg-blue-500",
    },
    {
      label: "Active Rules",
      value: stats.activeRules,
      icon: RiToggleLine,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      bar: "bg-emerald-500",
    },
    {
      label: "Triggered Today",
      value: stats.triggeredToday,
      icon: RiAlarmWarningLine,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
      bar: "bg-amber-500",
    },
    {
      label: "Critical",
      value: stats.criticalAlerts,
      icon: RiErrorWarningLine,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
      bar: "bg-red-500",
    },
    {
      label: "Warnings",
      value: stats.warningAlerts,
      icon: RiAlertLine,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
      bar: "bg-orange-500",
    },
    {
      label: "Info",
      value: stats.infoAlerts,
      icon: RiInformationLine,
      iconBg: "bg-sky-50",
      iconColor: "text-sky-500",
      bar: "bg-sky-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className="group bg-white rounded-2xl border border-slate-100 p-4 relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50 cursor-default"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 whitespace-nowrap">
                  {c.label}
                </p>
                <p className="text-2xl font-extrabold text-slate-900 leading-none">
                  {c.value}
                </p>
              </div>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${c.iconBg}`}
              >
                <Icon size={17} className={c.iconColor} />
              </div>
            </div>
            <div
              className={`absolute bottom-0 left-0 right-0 h-[3px] ${c.bar} opacity-60`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default AlertStatsCards;
