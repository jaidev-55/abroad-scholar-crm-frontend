import { RiMetaLine, RiGoogleLine } from "react-icons/ri";
import type { PlatformBreakdown } from "../types";
import { formatCurrency, formatNumber } from "../utils/spendRoiHelpers";

interface Props {
  platforms: PlatformBreakdown[];
  loading?: boolean;
}

const PlatformIcon = ({ platform }: { platform: string }) => {
  if (platform.toLowerCase().includes("meta")) {
    return (
      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
        <RiMetaLine size={20} className="text-blue-600" />
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
      <RiGoogleLine size={20} className="text-red-500" />
    </div>
  );
};

const MiniStat = ({ label, value }: { label: string; value: string }) => (
  <div className="text-center">
    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
      {label}
    </p>
    <p className="text-sm font-bold text-slate-800 mt-0.5">{value}</p>
  </div>
);

const PlatformBreakdownCards: React.FC<Props> = ({ platforms, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
        <div className="h-5 w-40 bg-slate-200 rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 bg-slate-50 rounded-xl" />
          <div className="h-32 bg-slate-50 rounded-xl" />
        </div>
      </div>
    );
  }

  const totalSpend = platforms.reduce((s, p) => s + p.spend, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-800">Platform Breakdown</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Performance by ad platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platforms.map((p) => {
          const pct =
            totalSpend > 0 ? ((p.spend / totalSpend) * 100).toFixed(0) : "0";

          return (
            <div
              key={p.platform}
              className="border border-slate-100 rounded-xl p-4 hover:border-slate-200 transition-colors"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <PlatformIcon platform={p.platform} />
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {p.platform}
                    </p>
                    <p className="text-xs text-slate-400">
                      {pct}% of total spend
                    </p>
                  </div>
                </div>
                <p className="text-lg font-extrabold text-slate-900">
                  {formatCurrency(p.spend)}
                </p>
              </div>

              {/* Spend bar */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full mb-4 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    p.platform.toLowerCase().includes("meta")
                      ? "bg-blue-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Mini stats */}
              <div className="grid grid-cols-4 gap-2">
                <MiniStat label="Leads" value={formatNumber(p.leads)} />
                <MiniStat label="CPL" value={formatCurrency(p.cpl)} />
                <MiniStat label="Conv." value={String(p.conversions)} />
                <MiniStat label="Conv. %" value={`${p.conversionRate}%`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlatformBreakdownCards;
