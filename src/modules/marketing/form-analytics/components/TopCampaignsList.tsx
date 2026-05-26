import { RiTrophyLine } from "react-icons/ri";
import { FaMeta } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import type { TopCampaign } from "../types";

interface Props {
  data: TopCampaign[];
  loading?: boolean;
}

const rankColors = ["bg-amber-400", "bg-slate-400", "bg-amber-700"];

const TopCampaignsList: React.FC<Props> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-5 h-[380px] animate-pulse">
        <div className="h-3 bg-slate-100 rounded w-36 mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 bg-slate-100 rounded-full" />
              <div className="flex-1 h-3 bg-slate-50 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const maxSub = Math.max(...data.map((d) => d.submissions));

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <RiTrophyLine size={16} className="text-amber-500" />
        <h3 className="text-sm font-bold text-slate-800">Top Campaigns</h3>
      </div>

      <div className="space-y-3">
        {data.map((c, i) => {
          const barW = (c.submissions / maxSub) * 100;
          return (
            <div key={c.campaignName} className="group">
              <div className="flex items-center gap-3 mb-1.5">
                {/* Rank badge */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${
                    rankColors[i] ?? "bg-slate-200 !text-slate-500"
                  }`}
                >
                  {i + 1}
                </div>

                {/* Platform icon + name */}
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  {c.platform === "meta" ? (
                    <FaMeta size={13} className="text-[#1877F2] shrink-0" />
                  ) : (
                    <FcGoogle size={13} className="shrink-0" />
                  )}
                  <span className="text-xs font-semibold text-slate-700 truncate">
                    {c.campaignName}
                  </span>
                </div>

                {/* Metrics */}
                <span className="text-xs font-bold text-slate-800 shrink-0">
                  {c.submissions.toLocaleString()}
                </span>
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${
                    c.conversionRate >= 35
                      ? "bg-emerald-50 text-emerald-600"
                      : c.conversionRate >= 25
                        ? "bg-blue-50 text-blue-600"
                        : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {c.conversionRate}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="ml-9 h-1.5 bg-slate-50 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${barW}%`,
                    background:
                      c.platform === "meta"
                        ? "linear-gradient(90deg, #93c5fd, #1877F2)"
                        : "linear-gradient(90deg, #6ee7b7, #34A853)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopCampaignsList;
