import {
  RiUser3Line,
  RiMetaLine,
  RiGlobalLine,
  RiPercentLine,
  RiTimeLine,
  RiLinksLine,
} from "react-icons/ri";
import type { AttributionMetrics } from "../types";
import { formatNumber } from "../utils/Leadattributionhelpers";


interface Props {
  metrics: AttributionMetrics;
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

const AttributionMetricsCards: React.FC<Props> = ({ metrics, loading }) => {
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
      label: "Attributed Leads",
      value: formatNumber(metrics.totalAttributedLeads),
      icon: RiLinksLine,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      barColor: "bg-blue-500",
    },
    {
      label: "From Meta",
      value: formatNumber(metrics.metaLeads),
      icon: RiMetaLine,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-500",
      barColor: "bg-indigo-500",
    },
    {
      label: "From Website",
      value: formatNumber(metrics.organicLeads),
      icon: RiGlobalLine,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      barColor: "bg-emerald-500",
    },
    {
      label: "From Google",
      value: formatNumber(metrics.googleLeads),
      icon: RiUser3Line,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
      barColor: "bg-red-500",
    },
    {
      label: "Attribution Rate",
      value: `${metrics.attributionRate}%`,
      icon: RiPercentLine,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
      barColor: "bg-amber-500",
    },
    {
      label: "Avg Days to Conv.",
      value: `${metrics.avgTimeToConversion}`,
      icon: RiTimeLine,
      iconBg: "bg-teal-50",
      iconColor: "text-teal-500",
      barColor: "bg-teal-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="group bg-white rounded-2xl border border-slate-100 p-4 relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50 cursor-default"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 whitespace-nowrap">
                  {card.label}
                </p>
                <p className="text-2xl font-extrabold text-slate-900 leading-none tracking-tight">
                  {card.value}
                </p>
              </div>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg}`}
              >
                <Icon size={17} className={card.iconColor} />
              </div>
            </div>
            <div
              className={`absolute bottom-0 left-0 right-0 h-[3px] ${card.barColor} opacity-60`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default AttributionMetricsCards;
