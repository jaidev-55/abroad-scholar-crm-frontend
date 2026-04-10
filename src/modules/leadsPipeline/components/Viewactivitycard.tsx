import React, { useState } from "react";
import {
  RiArrowRightLine,
  RiTimeLine,
  RiCalendarLine,
  RiStickyNoteLine,
  RiMailLine,
} from "react-icons/ri";
import UserAvatar from "../../../components/common/UserAvatar";
import { timeAgo, fullDate } from "../utils/dateUtils";
import type { ActivityEvent } from "../types/Viewlead";

import {
  formatDateTime,
  formatDuration,
  formatOutcome,
} from "../utils/Viewleadhelpers";
import { ACTIVITY_CONFIG } from "../utils/Activityconfig";

interface Props {
  event: ActivityEvent;
  isLast: boolean;
}

// Expandable activity timeline card with meta chips per event type
const ViewActivityCard: React.FC<Props> = ({ event, isLast }) => {
  const [expanded, setExpanded] = useState(false);
  const cfg = ACTIVITY_CONFIG[event.type];

  return (
    <div className="flex gap-3 group">
      {/* Dot + connector line */}
      <div
        className="flex flex-col items-center shrink-0"
        style={{ width: 28 }}
      >
        <div
          className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:scale-110"
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
            className="flex-1 w-px mt-1.5"
            style={{ background: "#e8edf2", minHeight: 16 }}
          />
        )}
      </div>

      {/* Card */}
      <div className="flex-1 min-w-0 pb-4">
        <div
          className="bg-white rounded-xl border border-slate-100 p-3 cursor-pointer hover:border-slate-200 hover:shadow-sm transition-all duration-150"
          onClick={() => setExpanded(!expanded)}
        >
          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md shrink-0"
                style={{ background: cfg.bg, color: cfg.color }}
              >
                {cfg.label}
              </span>
              <span className="text-[13px] font-semibold text-slate-800 truncate">
                {event.title}
              </span>
            </div>
            <span
              className="text-[10px] text-slate-400 font-medium shrink-0 whitespace-nowrap"
              title={fullDate(event.timestamp)}
            >
              {timeAgo(event.timestamp)}
            </span>
          </div>

          {/* Meta chips */}
          {event.meta && Object.keys(event.meta).length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {event.type === "stage_change" &&
                event.meta.from &&
                event.meta.to && (
                  <div className="flex items-center gap-1 text-[11px] font-semibold">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
                      {event.meta.from}
                    </span>
                    <RiArrowRightLine size={10} className="text-slate-400" />
                    <span className="px-2 py-0.5 rounded-md bg-violet-50 text-violet-600 border border-violet-100">
                      {event.meta.to}
                    </span>
                  </div>
                )}

              {event.type === "edit" && event.meta.field && (
                <div className="flex items-center gap-1 text-[11px] font-semibold">
                  <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">
                    {event.meta.field}
                  </span>
                  {event.meta.oldValue && (
                    <>
                      <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-400 line-through">
                        {event.meta.oldValue}
                      </span>
                      <RiArrowRightLine size={10} className="text-slate-400" />
                    </>
                  )}
                  {event.meta.newValue && (
                    <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600">
                      {event.meta.newValue}
                    </span>
                  )}
                </div>
              )}

              {event.type === "call" && (
                <div className="flex flex-col gap-2 mt-2 w-full">
                  <div className="flex flex-wrap gap-1.5">
                    {event.meta.duration && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-600">
                        <RiTimeLine size={11} />{" "}
                        {formatDuration(event.meta.duration)}
                      </span>
                    )}
                    {event.meta.outcome && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-600">
                        {formatOutcome(event.meta.outcome)}
                      </span>
                    )}
                  </div>
                  {event.meta.notes && (
                    <div className="flex items-start gap-1.5 text-[12px] text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-100">
                      <RiStickyNoteLine
                        size={12}
                        className="mt-[2px] text-slate-400"
                      />
                      <span>{event.meta.notes}</span>
                    </div>
                  )}
                  {event.meta.followUpDate && (
                    <div className="flex items-center gap-1 text-[11px] text-pink-600">
                      <RiCalendarLine size={11} />
                      <span>
                        Follow-up: {formatDateTime(event.meta.followUpDate)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {event.type === "email" && event.meta.subject && (
                <span className="flex items-center gap-1 text-[11px] text-slate-500 italic truncate max-w-full">
                  <RiMailLine size={10} /> &ldquo;{event.meta.subject}&rdquo;
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
              className={`mt-2 overflow-hidden transition-all duration-200 ${expanded ? "max-h-40" : "max-h-0"}`}
            >
              <p className="text-[12px] text-slate-500 leading-relaxed border-t border-slate-50 pt-2">
                {event.description}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-50">
            <div className="flex items-center gap-1.5">
              <UserAvatar name={event.author} size="sm" />
              <span className="text-[11px] text-slate-400 font-medium">
                {event.author}
              </span>
            </div>
            {event.description && (
              <span className="text-[10px] text-slate-400 hover:text-slate-600 transition-colors">
                {expanded ? "Less ↑" : "More ↓"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewActivityCard;
