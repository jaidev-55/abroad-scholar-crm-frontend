import {
  RiMoneyDollarCircleLine,
  RiUser3Line,
  RiPriceTag3Line,
  RiCheckboxCircleLine,
  RiExchangeDollarLine,
  RiPercentLine,
} from "react-icons/ri";
import type { SpendMetrics } from "../types";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
} from "../utils/spendRoiHelpers";

interface Props {
  metrics: SpendMetrics;
  loading?: boolean;
}

const MetricCard = ({
  label,
  value,
  change,
  icon: Icon,
  iconBg,
  iconColor,
  barColor,
}: {
  label: string;
  value: string;
  change?: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconBg: string;
  iconColor: string;
  barColor: string;
}) => (
  <div className="group bg-white rounded-2xl border border-slate-100 p-4 relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50 cursor-default w-full">
    <div className="flex justify-between items-start">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 whitespace-nowrap">
          {label}
        </p>
        <p className="text-2xl font-extrabold text-slate-900 leading-none tracking-tight">
          {value}
        </p>
        {change !== undefined && (
          <p
            className={`text-xs font-semibold mt-1.5 ${
              change >= 0 ? "text-emerald-500" : "text-red-500"
            }`}
          >
            {formatPercent(change)}{" "}
            <span className="text-slate-400 font-normal">vs last period</span>
          </p>
        )}
      </div>

      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
      >
        <Icon size={17} className={iconColor} />
      </div>
    </div>

    <div
      className={`absolute bottom-0 left-0 right-0 h-[3px] ${barColor} opacity-60`}
    />
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-4 relative overflow-hidden w-full animate-pulse">
    <div className="flex justify-between items-start">
      <div>
        <div className="h-3 w-20 bg-slate-200 rounded mb-3" />
        <div className="h-7 w-16 bg-slate-200 rounded" />
        <div className="h-3 w-24 bg-slate-100 rounded mt-2" />
      </div>
      <div className="w-9 h-9 rounded-xl bg-slate-100" />
    </div>
  </div>
);

const SpendMetricsCards: React.FC<Props> = ({ metrics, loading }) => {
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
      label: "Total Spend",
      value: formatCurrency(metrics.totalSpend),
      change: metrics.spendChange,
      icon: RiMoneyDollarCircleLine,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      barColor: "bg-blue-500",
    },
    {
      label: "Total Leads",
      value: formatNumber(metrics.totalLeads),
      change: metrics.leadsChange,
      icon: RiUser3Line,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-500",
      barColor: "bg-purple-500",
    },
    {
      label: "Cost / Lead",
      value: formatCurrency(metrics.costPerLead),
      change: metrics.cplChange,
      icon: RiPriceTag3Line,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
      barColor: "bg-amber-500",
    },
    {
      label: "Conversions",
      value: formatNumber(metrics.conversions),
      change: metrics.conversionsChange,
      icon: RiCheckboxCircleLine,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      barColor: "bg-emerald-500",
    },
    {
      label: "Cost / Conversion",
      value: formatCurrency(metrics.costPerConversion),
      icon: RiExchangeDollarLine,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-500",
      barColor: "bg-rose-500",
    },
    {
      label: "ROI",
      value: `${metrics.roi}x`,
      icon: RiPercentLine,
      iconBg: "bg-teal-50",
      iconColor: "text-teal-500",
      barColor: "bg-teal-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card) => (
        <MetricCard key={card.label} {...card} />
      ))}
    </div>
  );
};

export default SpendMetricsCards;
