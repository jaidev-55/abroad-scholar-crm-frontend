import React from "react";
import { motion } from "framer-motion";
import {
  RiBellFill,
  RiCheckDoubleLine,
  RiCloseLine,
  RiRefreshLine,
  RiArrowRightUpLine,
  RiVolumeUpLine,
  RiVolumeMuteLine,
  RiDeleteBin6Line,
} from "react-icons/ri";
import { TYPE_CFG } from "./constants";
import { unlockAudio } from "./audio";
import NotificationList from "./NotificationList";
import type { Notif } from "./types";

// ─── Props ────────────────────────────────────────────────────────────────────

interface NotificationDropdownProps {
  allNotifs: Notif[];
  isLoading: boolean;
  filter: "all" | "unread";
  soundOn: boolean;
  unreadCount: number;
  onClose: () => void;
  onRefetch: () => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onFilterChange: (f: "all" | "unread") => void;
  onSoundToggle: () => void;
  onClickItem: (n: Notif) => void;
  onViewAll: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  allNotifs,
  isLoading,
  filter,
  soundOn,
  unreadCount,
  onClose,
  onRefetch,
  onMarkAllRead,
  onClearAll,
  onFilterChange,
  onSoundToggle,
  onClickItem,
  onViewAll,
}) => {
  const filtered =
    filter === "unread" ? allNotifs.filter((n) => !n.read) : allNotifs;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.97 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute right-0 top-full mt-2.5 w-[370px] bg-white rounded-2xl border border-slate-100 z-50 overflow-hidden"
      style={{
        boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      {/* Gradient accent */}
      <div
        className="h-[3px] w-full"
        style={{
          background: "linear-gradient(90deg,#3b82f6,#8b5cf6,#ec4899)",
        }}
      />

      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          {/* Title */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#3b82f6,#7c3aed)" }}
            >
              <RiBellFill size={14} className="text-white" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-900 leading-none">
                Notifications
              </p>
              <p className="text-[10px] mt-0.5">
                {unreadCount > 0 ? (
                  <span className="text-blue-500 font-bold">
                    {unreadCount} unread
                  </span>
                ) : (
                  <span className="text-slate-400">All caught up ✓</span>
                )}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            {/* Sound toggle */}
            <button
              onClick={() => {
                unlockAudio();
                onSoundToggle();
              }}
              title={soundOn ? "Mute" : "Unmute"}
              className={`w-7 h-7 flex items-center justify-center rounded-lg border-none cursor-pointer transition-colors ${
                soundOn
                  ? "bg-blue-50 text-blue-500 hover:bg-blue-100"
                  : "bg-slate-100 text-slate-400 hover:bg-slate-200"
              }`}
            >
              {soundOn ? (
                <RiVolumeUpLine size={13} />
              ) : (
                <RiVolumeMuteLine size={13} />
              )}
            </button>

            {/* Refresh */}
            <button
              onClick={onRefetch}
              title="Refresh"
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 border-none bg-transparent cursor-pointer"
            >
              <RiRefreshLine size={13} />
            </button>

            {/* Clear all — hides for 24hrs */}
            {allNotifs.length > 0 && (
              <button
                onClick={onClearAll}
                title="Clear all (reappears in 24h)"
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-400 border-none bg-transparent cursor-pointer transition-colors"
              >
                <RiDeleteBin6Line size={13} />
              </button>
            )}

            {/* Mark all read */}
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[10px] font-bold hover:bg-blue-700 border-none cursor-pointer whitespace-nowrap"
              >
                <RiCheckDoubleLine size={10} /> Mark all read
              </button>
            )}

            {/* Close */}
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 border-none bg-transparent cursor-pointer"
            >
              <RiCloseLine size={14} />
            </button>
          </div>
        </div>

        {/* Filter tabs + type chips */}
        <div className="flex items-center gap-1.5">
          {(["all", "unread"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => onFilterChange(tab)}
              className="px-3 py-1 rounded-full text-[11px] font-bold border cursor-pointer transition-all"
              style={{
                background: filter === tab ? "#2563eb" : "#f1f5f9",
                color: filter === tab ? "#fff" : "#64748b",
                borderColor: filter === tab ? "#2563eb" : "#e2e8f0",
              }}
            >
              {tab === "all"
                ? `All (${allNotifs.length})`
                : `Unread${unreadCount > 0 ? ` (${unreadCount})` : ""}`}
            </button>
          ))}

          <div className="ml-auto flex gap-1">
            {(["overdue", "hot", "followup", "new_lead"] as const).map(
              (type) => {
                const cnt = allNotifs.filter(
                  (n) => n.type === type && !n.read,
                ).length;
                if (!cnt) return null;
                const c = TYPE_CFG[type];
                return (
                  <span
                    key={type}
                    className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-black border ${c.bg} ${c.color} ${c.border}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                    {cnt}
                  </span>
                );
              },
            )}
          </div>
        </div>
      </div>

      {/* Notification list */}
      <div className="overflow-y-auto max-h-[400px]">
        <NotificationList
          notifications={filtered}
          isLoading={isLoading}
          onClickItem={onClickItem}
        />
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 px-4 py-2.5 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              soundOn ? "bg-emerald-400" : "bg-slate-300"
            }`}
          />
          <span className="text-[10px] text-slate-400">
            {soundOn ? "Sound on" : "Sound off"} · Live
          </span>
        </div>
        <button
          onClick={onViewAll}
          className="text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-transparent border-none cursor-pointer flex items-center gap-0.5 transition-colors"
        >
          View all <RiArrowRightUpLine size={10} />
        </button>
      </div>
    </motion.div>
  );
};

export default NotificationDropdown;
