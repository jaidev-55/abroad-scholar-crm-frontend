import { RiMetaLine, RiGoogleLine } from "react-icons/ri";
import type { CampaignAttribution } from "../types";
import { PIPELINE_CONFIG } from "../types/Constants";


interface Props {
  data: CampaignAttribution[];
  loading?: boolean;
}

const CampaignAttributionCards: React.FC<Props> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
        <div className="h-5 w-40 bg-slate-200 rounded mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-slate-50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Campaign → Pipeline
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            How each campaign's leads flow through the pipeline
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((c) => {
          const total = c.totalLeads || 1;
          const segments = [
            {
              label: "New",
              count: c.newLeads,
              pct: (c.newLeads / total) * 100,
              ...PIPELINE_CONFIG.New,
            },
            {
              label: "In Progress",
              count: c.inProgressLeads,
              pct: (c.inProgressLeads / total) * 100,
              ...PIPELINE_CONFIG["In Progress"],
            },
            {
              label: "Converted",
              count: c.convertedLeads,
              pct: (c.convertedLeads / total) * 100,
              ...PIPELINE_CONFIG.Converted,
            },
            {
              label: "Lost",
              count: c.lostLeads,
              pct: (c.lostLeads / total) * 100,
              ...PIPELINE_CONFIG.Lost,
            },
          ];

          return (
            <div
              key={c.campaignName}
              className="border border-slate-100 rounded-xl p-4 hover:border-slate-200 transition-colors"
            >
              {/* Campaign header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      c.platform === "meta" ? "bg-blue-50" : "bg-red-50"
                    }`}
                  >
                    {c.platform === "meta" ? (
                      <RiMetaLine size={16} className="text-blue-600" />
                    ) : (
                      <RiGoogleLine size={16} className="text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {c.campaignName}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {c.totalLeads} leads · {c.conversionRate}% conv. · avg{" "}
                      {c.avgDaysToConversion}d
                    </p>
                  </div>
                </div>
                <span className="text-lg font-extrabold text-slate-900">
                  {c.totalLeads}
                </span>
              </div>

              {/* Stacked bar */}
              <div className="flex gap-0.5 h-3 rounded-full overflow-hidden mb-2">
                {segments.map((seg) => (
                  <div
                    key={seg.label}
                    className="rounded-full transition-all duration-500"
                    style={{
                      width: `${seg.pct}%`,
                      backgroundColor: seg.color,
                      minWidth: seg.count > 0 ? 4 : 0,
                    }}
                  />
                ))}
              </div>

              {/* Labels */}
              <div className="flex items-center gap-4 flex-wrap">
                {segments.map((seg) => (
                  <div key={seg.label} className="flex items-center gap-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: seg.color }}
                    />
                    <span className="text-[10px] text-slate-500">
                      {seg.label}{" "}
                      <span className="font-bold text-slate-700">
                        {seg.count}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CampaignAttributionCards;
