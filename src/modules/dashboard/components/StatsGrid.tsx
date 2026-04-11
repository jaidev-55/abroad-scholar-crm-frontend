import React from "react";
import {
  HiOutlineUsers,
  HiOutlineFire,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
} from "react-icons/hi";

interface StatsData {
  total: number;
  hot: number;
  followups: number;
  converted: number;
  lost: number;
}
interface Props {
  stats: StatsData;
}

const StatsGrid: React.FC<Props> = ({ stats }) => {
  const cards = [
    {
      id: "total",
      label: "TOTAL LEADS",
      value: stats.total,
      delta: 12,
      icon: <HiOutlineUsers className="h-5 w-5" />,
      accent: "from-blue-500 to-blue-400",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      id: "hot",
      label: "HOT LEADS",
      value: stats.hot,
      delta: 8,
      icon: <HiOutlineFire className="h-5 w-5" />,
      accent: "from-rose-500 to-pink-400",
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
    },
    {
      id: "followups",
      label: "FOLLOW-UPS DUE",
      value: stats.followups,
      delta: -5,
      icon: <HiOutlineClock className="h-5 w-5" />,
      accent: "from-amber-500 to-orange-400",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      id: "converted",
      label: "CONVERTED",
      value: stats.converted,
      delta: 18,
      icon: <HiOutlineCheckCircle className="h-5 w-5" />,
      accent: "from-emerald-500 to-green-400",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      id: "lost",
      label: "LOST LEADS",
      value: stats.lost,
      delta: -3,
      icon: <HiOutlineXCircle className="h-5 w-5" />,
      accent: "from-slate-400 to-slate-300",
      iconBg: "bg-slate-100",
      iconColor: "text-slate-500",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((s) => {
        const positive = s.delta >= 0;
        return (
          <div
            key={s.id}
            className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div
              className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${s.accent}`}
            />
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-[11px] font-semibold tracking-wider text-slate-500">
                  {s.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {s.value}
                </p>
                <div className="mt-1 flex items-center gap-1 text-xs">
                  {positive ? (
                    <HiOutlineTrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <HiOutlineTrendingDown className="h-3.5 w-3.5 text-rose-500" />
                  )}
                  <span
                    className={
                      positive
                        ? "font-semibold text-emerald-600"
                        : "font-semibold text-rose-600"
                    }
                  >
                    {positive ? "+" : ""}
                    {s.delta}%
                  </span>
                  <span className="text-slate-400">vs last</span>
                </div>
              </div>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.iconBg} ${s.iconColor}`}
              >
                {s.icon}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsGrid;
