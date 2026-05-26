import { useState } from "react";
import { Tag } from "antd";
import {
  RiCheckLine,
  RiErrorWarningFill,
  RiAlertFill,
  RiInformationFill,
} from "react-icons/ri";
import { SEVERITY_CONFIG } from "../types/Constants";
import type { AlertLog } from "../types/Index";
import { formatDateTime } from "../utils/Alertshelpers";

interface Props {
  logs: AlertLog[];
  loading?: boolean;
  onMarkRead: (logId: string) => void;
}

const SeverityIcon = ({ severity }: { severity: string }) => {
  switch (severity) {
    case "critical":
      return <RiErrorWarningFill size={16} className="text-red-500" />;
    case "warning":
      return <RiAlertFill size={16} className="text-amber-500" />;
    default:
      return <RiInformationFill size={16} className="text-blue-500" />;
  }
};

const AlertLogFeed: React.FC<Props> = ({ logs, loading, onMarkRead }) => {
  const [filter, setFilter] = useState<
    "all" | "unread" | "critical" | "warning"
  >("all");

  const filtered = logs.filter((l) => {
    if (filter === "unread") return !l.isRead;
    if (filter === "critical") return l.severity === "critical";
    if (filter === "warning") return l.severity === "warning";
    return true;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
        <div className="h-5 w-32 bg-slate-200 rounded mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 bg-slate-50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const unreadCount = logs.filter((l) => !l.isRead).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Alert History</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {unreadCount > 0
              ? `${unreadCount} unread alert${unreadCount > 1 ? "s" : ""}`
              : "All caught up"}
          </p>
        </div>
        <div className="flex gap-0.5 bg-slate-100 rounded-lg p-0.5">
          {(["all", "unread", "critical", "warning"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 text-[10px] font-medium rounded-md transition-all cursor-pointer capitalize ${
                filter === f
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5 max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No alerts match this filter
          </div>
        ) : (
          filtered.map((log) => {
            const sevCfg = SEVERITY_CONFIG[log.severity];

            return (
              <div
                key={log.id}
                className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                  log.isRead
                    ? "bg-white hover:bg-slate-50/50"
                    : "bg-blue-50/30 border border-blue-100"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  <SeverityIcon severity={log.severity} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-800">
                      {log.ruleName}
                    </span>
                    <Tag
                      className={`${sevCfg?.bg} ${sevCfg?.text} border-0 rounded-full text-[9px] font-semibold px-2 py-0`}
                    >
                      {sevCfg?.label}
                    </Tag>
                    {log.campaignName && (
                      <span className="text-[10px] text-slate-400">
                        · {log.campaignName}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {log.message}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400">
                    <span>{formatDateTime(log.triggeredAt)}</span>
                    <span>
                      Value:{" "}
                      <span className="font-semibold text-slate-600">
                        {log.currentValue}
                      </span>{" "}
                      / Threshold:{" "}
                      <span className="font-semibold text-slate-600">
                        {log.thresholdValue}
                      </span>
                    </span>
                  </div>
                </div>

                {!log.isRead && (
                  <button
                    onClick={() => onMarkRead(log.id)}
                    className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Mark as read"
                  >
                    <RiCheckLine size={14} className="text-blue-500" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AlertLogFeed;
