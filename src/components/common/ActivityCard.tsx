import { useState } from "react";
import { RiArrowRightLine, RiTimeLine, RiCalendarLine } from "react-icons/ri";
import type { ActivityEvent } from "../../modules/leadsPipeline/types/Activity";
import { ACTIVITY_CONFIG } from "../../modules/leadsPipeline/utils/Activityconfig";
import { fullDate, timeAgo } from "../../modules/leadsPipeline/utils/dateUtils";
import UserAvatar from "./UserAvatar";

interface ActivityCardProps {
  event: ActivityEvent;
  isLast: boolean;
}

// Expandable timeline card — click to reveal description
const ActivityCard: React.FC<ActivityCardProps> = ({ event, isLast }) => {
  const [open, setOpen] = useState(false);
  const cfg = ACTIVITY_CONFIG[event.type];

  return (
    <div className="flex gap-3">
      {/* Dot + connector line */}
      <div className="flex flex-col items-center" style={{ width: 28 }}>
        <div
          className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-150 hover:scale-110"
          style={{
            background: cfg.bg,
            color: cfg.color,
            border: `1.5px solid ${cfg.border}`,
          }}
        >
          {cfg.icon}
        </div>
        {!isLast && (
          <div
            className="w-px flex-1 mt-1"
            style={{
              background: "linear-gradient(to bottom, #e2e8f0, transparent)",
              minHeight: 12,
            }}
          />
        )}
      </div>

      {/* Card body */}
      <div className="flex-1 min-w-0 pb-3">
        <div
          className="rounded-xl border transition-all duration-150 cursor-pointer overflow-hidden"
          style={{
            borderColor: open ? cfg.border : "#f1f5f9",
            background: open ? cfg.bg : "#fff",
          }}
          onClick={() => setOpen(!open)}
        >
          {/* Top row */}
          <div className="flex items-start justify-between gap-2 px-3 pt-3 pb-2">
            <div className="flex items-start gap-2 min-w-0 flex-1">
              <span
                className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md shrink-0 mt-0.5"
                style={{ background: `${cfg.color}18`, color: cfg.color }}
              >
                {cfg.label}
              </span>
              <span className="text-[12px] font-semibold text-slate-800 leading-tight">
                {event.title}
              </span>
            </div>
            <span
              className="text-[10px] text-slate-400 shrink-0 mt-0.5"
              title={fullDate(event.timestamp)}
            >
              {timeAgo(event.timestamp)}
            </span>
          </div>

          {/* Meta chips */}
          {event.meta && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {event.type === "stage_change" &&
                event.meta.from &&
                event.meta.to && (
                  <div className="flex items-center gap-1 text-[11px] font-semibold">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
                      {event.meta.from}
                    </span>
                    <RiArrowRightLine size={9} className="text-slate-400" />
                    <span
                      className="px-2 py-0.5 rounded-md"
                      style={{ background: cfg.bg, color: cfg.color }}
                    >
                      {event.meta.to}
                    </span>
                  </div>
                )}
              {event.type === "edit" && event.meta.field && (
                <div className="flex items-center gap-1 text-[11px] font-semibold flex-wrap">
                  <span className="px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-400">
                    {event.meta.field}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-400 line-through">
                    {event.meta.from}
                  </span>
                  <RiArrowRightLine size={9} className="text-slate-400" />
                  <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600">
                    {event.meta.to}
                  </span>
                </div>
              )}
              {event.type === "call" && (
                <div className="flex gap-1.5">
                  {event.meta.duration && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-600">
                      <RiTimeLine size={10} /> {event.meta.duration}
                    </span>
                  )}
                  {event.meta.outcome && (
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-600">
                      {event.meta.outcome}
                    </span>
                  )}
                </div>
              )}
              {event.type === "email" && event.meta.subject && (
                <span className="text-[11px] text-slate-500 italic truncate max-w-[240px]">
                  "{event.meta.subject}"
                </span>
              )}
              {event.type === "followup_set" && event.meta.date && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-pink-50 text-pink-600">
                  <RiCalendarLine size={10} /> {event.meta.date}
                </span>
              )}
            </div>
          )}

          {/* Expandable description */}
          {event.description && (
            <div
              className="overflow-hidden transition-all duration-200"
              style={{ maxHeight: open ? 160 : 0 }}
            >
              <p className="text-[12px] text-slate-500 leading-relaxed mx-3 mb-3 pt-2 border-t border-slate-100">
                {event.description}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
            <div className="flex items-center gap-1.5">
              <UserAvatar name={event.author} size="sm" />
              <span className="text-[10px] text-slate-400">{event.author}</span>
            </div>
            {event.description && (
              <span className="text-[10px]" style={{ color: cfg.color }}>
                {open ? "collapse ↑" : "expand ↓"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
