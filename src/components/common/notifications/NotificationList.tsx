import React from "react";
import { motion } from "framer-motion";
import { RiArrowRightUpLine, RiSparklingLine } from "react-icons/ri";
import { TYPE_CFG, timeAgo } from "./constants";
import type { Notif } from "./types";

// ─── Notification List ────────────────────────────────────────────────────────

interface NotificationListProps {
  notifications: Notif[];
  isLoading: boolean;
  onClickItem: (n: Notif) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  isLoading,
  onClickItem,
}) => {
  if (isLoading) {
    return (
      <div className="py-12 flex flex-col items-center gap-2">
        <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-xs text-slate-400">Loading…</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="py-14 flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center">
          <RiSparklingLine size={22} className="text-slate-300" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-slate-500">All clear!</p>
          <p className="text-xs text-slate-400 mt-0.5">
            No unread notifications
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {notifications.map((n, i) => {
        const c = TYPE_CFG[n.type];
        const Icon = c.icon;
        return (
          <motion.button
            key={n.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.025 }}
            onClick={() => onClickItem(n)}
            className={`w-full flex items-start gap-3 px-4 py-3.5 transition-colors cursor-pointer border-none text-left group border-b border-slate-50 last:border-0 ${
              !n.read
                ? "bg-blue-50/25 hover:bg-blue-50/50"
                : "bg-white hover:bg-slate-50/80"
            }`}
          >
            <div
              className={`relative w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${c.bg} border ${c.border}`}
            >
              <Icon size={15} className={c.color} />
              {!n.read && (
                <span
                  className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border-2 border-white ${c.dot}`}
                />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-1">
                <p
                  className={`text-[12.5px] leading-snug ${n.read ? "text-slate-500 font-medium" : "text-slate-900 font-bold"}`}
                >
                  {n.title}
                </p>
                <RiArrowRightUpLine
                  size={11}
                  className="text-slate-200 group-hover:text-blue-500 transition-colors shrink-0 mt-1"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                {n.subtitle}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide ${c.pill}`}
                >
                  <span className={`w-1 h-1 rounded-full ${c.dot}`} />
                  {c.label}
                </span>
                <span className="text-[10px] text-slate-300">·</span>
                <span className="text-[10px] text-slate-400">
                  {timeAgo(n.time)}
                </span>
              </div>
            </div>
          </motion.button>
        );
      })}
    </>
  );
};

export default NotificationList;
