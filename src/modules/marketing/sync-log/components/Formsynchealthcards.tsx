import { Progress, Tag } from "antd";
import {
  RiMetaLine,
  RiGoogleLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiTimeLine,
} from "react-icons/ri";
import type { FormSyncHealth } from "../types/Index";
import { formatMs, timeAgo } from "../utils/Syncloghelpers";


interface Props {
  forms: FormSyncHealth[];
  loading?: boolean;
}

const FormSyncHealthCards: React.FC<Props> = ({ forms, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
        <div className="h-5 w-40 bg-slate-200 rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 bg-slate-50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-800">Webhook Health</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Sync status per connected form
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {forms.map((f) => {
          const isHealthy = f.successRate >= 95 && f.failedLast24h === 0;
          const isWarning = f.successRate >= 85 && f.successRate < 95;

          return (
            <div
              key={f.formId}
              className={`border rounded-xl p-4 transition-colors ${
                !f.isActive
                  ? "border-slate-100 bg-slate-50/50 opacity-70"
                  : isHealthy
                    ? "border-emerald-100 bg-emerald-50/20"
                    : isWarning
                      ? "border-amber-100 bg-amber-50/20"
                      : "border-red-100 bg-red-50/20"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      f.platform === "meta" ? "bg-blue-50" : "bg-red-50"
                    }`}
                  >
                    {f.platform === "meta" ? (
                      <RiMetaLine size={15} className="text-blue-600" />
                    ) : (
                      <RiGoogleLine size={15} className="text-red-500" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-slate-800 truncate">
                      {f.formName}
                    </p>
                    <p className="text-[9px] text-slate-400 font-mono">
                      ID: {f.formId.slice(0, 10)}…
                    </p>
                  </div>
                </div>
                <Tag
                  className={`border-0 rounded-full text-[9px] font-semibold px-2 py-0 ${
                    f.isActive
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {f.isActive ? "Active" : "Inactive"}
                </Tag>
              </div>

              {/* Success rate bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-500">
                    Success Rate
                  </span>
                  <span
                    className={`text-[11px] font-bold ${
                      f.successRate >= 95
                        ? "text-emerald-600"
                        : f.successRate >= 85
                          ? "text-amber-600"
                          : "text-red-600"
                    }`}
                  >
                    {f.successRate}%
                  </span>
                </div>
                <Progress
                  percent={f.successRate}
                  showInfo={false}
                  strokeColor={
                    f.successRate >= 95
                      ? "#10b981"
                      : f.successRate >= 85
                        ? "#f59e0b"
                        : "#ef4444"
                  }
                  trailColor="#f1f5f9"
                  size="small"
                  strokeLinecap="round"
                />
              </div>

              {/* Mini stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="flex items-center justify-center gap-0.5 mb-0.5">
                    <RiCheckboxCircleLine
                      size={10}
                      className="text-slate-400"
                    />
                    <span className="text-[9px] text-slate-400">Syncs</span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-800">
                    {f.totalSyncs}
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-0.5 mb-0.5">
                    <RiTimeLine size={10} className="text-slate-400" />
                    <span className="text-[9px] text-slate-400">Avg</span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-800">
                    {formatMs(f.avgResponseTime)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-0.5 mb-0.5">
                    <RiCloseCircleLine size={10} className="text-slate-400" />
                    <span className="text-[9px] text-slate-400">Fail 24h</span>
                  </div>
                  <p
                    className={`text-[11px] font-bold ${f.failedLast24h > 0 ? "text-red-600" : "text-emerald-600"}`}
                  >
                    {f.failedLast24h}
                  </p>
                </div>
              </div>

              {/* Last sync */}
              <p className="text-[9px] text-slate-400 mt-2 text-center">
                Last sync: {timeAgo(f.lastSyncAt)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FormSyncHealthCards;
