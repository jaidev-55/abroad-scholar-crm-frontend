import { RiMetaLine, RiGoogleLine, RiTrophyLine } from "react-icons/ri";
import type { CampaignData } from "../types";
import { formatValue } from "../utils/Campaigncomparisonhelpers";
import { CAMPAIGN_COLORS, COMPARISON_METRICS } from "../utils/Constants";


interface Props {
  campaigns: CampaignData[];
  loading?: boolean;
}

const ComparisonTable: React.FC<Props> = ({ campaigns, loading }) => {
  if (loading || campaigns.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
        <div className="h-5 w-40 bg-slate-200 rounded mb-4" />
        <div className="h-[300px] bg-slate-50 rounded-xl" />
      </div>
    );
  }

  const findWinner = (key: string, higherIsBetter: boolean): string => {
    let winnerId = campaigns[0].id;
    let winnerVal = (campaigns[0] as any)[key] as number;
    campaigns.forEach((c) => {
      const val = (c as any)[key] as number;
      if (higherIsBetter ? val > winnerVal : val < winnerVal) {
        winnerId = c.id;
        winnerVal = val;
      }
    });
    return winnerId;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-800">
          Side-by-Side Comparison
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          <RiTrophyLine size={11} className="inline text-amber-400 mr-1" />
          Best performer highlighted per metric
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Campaign headers */}
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left py-3 px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider w-36 sticky left-0 bg-white z-10">
                Metric
              </th>
              {campaigns.map((c, i) => (
                <th key={c.id} className="py-3 px-3 text-center min-w-[140px]">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: CAMPAIGN_COLORS[i] }}
                    />
                    <div className="flex items-center gap-1">
                      {c.platform === "meta" ? (
                        <RiMetaLine size={11} className="text-blue-600" />
                      ) : (
                        <RiGoogleLine size={11} className="text-red-500" />
                      )}
                      <span className="text-[11px] font-bold text-slate-700 truncate max-w-[120px]">
                        {c.campaignName}
                      </span>
                    </div>
                    <span
                      className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                        c.status === "active"
                          ? "bg-emerald-50 text-emerald-600"
                          : c.status === "paused"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {COMPARISON_METRICS.map((m) => {
              const winnerId = findWinner(m.key, m.higherIsBetter);

              return (
                <tr
                  key={m.key}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="py-2.5 px-3 text-xs font-medium text-slate-600 sticky left-0 bg-white z-10">
                    {m.metric}
                  </td>
                  {campaigns.map((c, i) => {
                    const val = (c as any)[m.key] as number;
                    const isWinner = c.id === winnerId;

                    return (
                      <td key={c.id} className="py-2.5 px-3 text-center">
                        <div
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                            isWinner
                              ? "bg-emerald-50 text-emerald-700"
                              : "text-slate-700"
                          }`}
                        >
                          {isWinner && (
                            <RiTrophyLine
                              size={10}
                              className="text-amber-400"
                            />
                          )}
                          {formatValue(val, m.unit)}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonTable;
