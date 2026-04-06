import React, { useState, useMemo } from "react";
import { Drawer, Input, Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import {
  RiPhoneLine,
  RiMailLine,
  RiGlobalLine,
  RiCalendarLine,
  RiUserSmileLine,
  RiStickyNoteLine,
  RiFlashlightLine,
  RiFireLine,
  RiSnowflakeLine,
  RiCloseLine,
  RiMapPinLine,
  RiAwardLine,
  RiHistoryLine,
  RiFileTextLine,
  RiArrowRightLine,
  RiAddLine,
  RiPencilLine,
  RiPhoneFill,
  RiMailFill,
  RiAlertLine,
  RiTimeLine,
  RiSearchLine,
  RiFilter3Line,
  RiSendPlaneLine,
} from "react-icons/ri";
import type { Lead } from "../../../types/lead";

import {
  getLeadActivity,
  getLeadById,
  type ApiActivity,
  type ApiLead,
} from "../../../api/leads";

type ActivityType =
  | "created"
  | "stage_change"
  | "note_added"
  | "call"
  | "email"
  | "edit"
  | "followup_set"
  | "overdue";

interface CallMeta {
  duration?: number;
  outcome?: string;
  notes?: string;
  rating?: number;
  followUpDate?: string;
}

interface EditMeta {
  field?: string;
  oldValue?: string;
  newValue?: string;
}

interface StageChangeMeta {
  from?: string;
  to?: string;
}

interface FollowUpMeta {
  date?: string;
}

interface EmailMeta {
  subject?: string;
}

type ActivityMeta = CallMeta &
  EditMeta &
  StageChangeMeta &
  FollowUpMeta &
  EmailMeta;

interface ActivityEvent {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  author: string;
  timestamp: string;
  meta?: ActivityMeta;
}

interface Props {
  lead: Lead | null;
  onClose: () => void;
  initialTab?: "notes" | "details" | "activity";
}

const ACTIVITY_CONFIG: Record<
  ActivityType,
  {
    icon: React.ReactNode;
    color: string;
    bg: string;
    border: string;
    label: string;
  }
> = {
  created: {
    icon: <RiAddLine size={12} />,
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
    label: "Created",
  },
  stage_change: {
    icon: <RiArrowRightLine size={12} />,
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    label: "Stage Change",
  },
  note_added: {
    icon: <RiStickyNoteLine size={12} />,
    color: "#0891b2",
    bg: "#ecfeff",
    border: "#a5f3fc",
    label: "Note",
  },
  call: {
    icon: <RiPhoneFill size={12} />,
    color: "#059669",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    label: "Call",
  },
  email: {
    icon: <RiMailFill size={12} />,
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    label: "Email",
  },
  edit: {
    icon: <RiPencilLine size={12} />,
    color: "#475569",
    bg: "#f8fafc",
    border: "#e2e8f0",
    label: "Updated",
  },
  followup_set: {
    icon: <RiCalendarLine size={12} />,
    color: "#db2777",
    bg: "#fdf2f8",
    border: "#fbcfe8",
    label: "Follow-up",
  },
  overdue: {
    icon: <RiAlertLine size={12} />,
    color: "#ef4444",
    bg: "#fff5f5",
    border: "#fed7d7",
    label: "Overdue",
  },
};
function mapApiType(type: string): ActivityType {
  const map: Record<string, ActivityType> = {
    EDIT: "edit",
    NOTE: "note_added",
    NOTE_ADDED: "note_added",
    STAGE_CHANGE: "stage_change",
    CALL: "call",
    EMAIL: "email",
    FOLLOWUP: "followup_set",
    FOLLOWUP_SET: "followup_set",
    CREATED: "created",
    OVERDUE: "overdue",
  };
  return map[type] ?? "edit";
}

function mapApiActivity(a: ApiActivity): ActivityEvent {
  const raw = a.meta ?? {};
  const meta: ActivityMeta = {
    duration: raw.duration ? Number(raw.duration) : undefined,
    rating: raw.rating ? Number(raw.rating) : undefined,
    outcome: raw.outcome,
    notes: raw.notes,
    followUpDate: raw.followUpDate,
    field: raw.field,
    oldValue: raw.oldValue,
    newValue: raw.newValue,
    from: raw.from,
    to: raw.to,
    date: raw.date,
    subject: raw.subject,
  };
  return {
    id: a.id,
    type: mapApiType(a.type),
    title: a.message || "Activity",
    author: a.user?.name || "System",
    timestamp: a.createdAt,
    meta,
  };
}

const FILTER_TYPES: {
  key: ActivityType | "all";
  label: string;
  icon: React.ReactNode;
}[] = [
  { key: "all", label: "All", icon: null },
  {
    key: "stage_change",
    label: "Stages",
    icon: <RiArrowRightLine size={10} />,
  },
  { key: "note_added", label: "Notes", icon: <RiStickyNoteLine size={10} /> },
  { key: "call", label: "Calls", icon: <RiPhoneFill size={10} /> },
  { key: "email", label: "Emails", icon: <RiMailFill size={10} /> },
  { key: "edit", label: "Edits", icon: <RiPencilLine size={10} /> },
];

const TABS = [
  { key: "notes", label: "Notes", icon: <RiStickyNoteLine size={13} /> },
  { key: "details", label: "Details", icon: <RiFileTextLine size={13} /> },
  { key: "activity", label: "Activity", icon: <RiHistoryLine size={13} /> },
];

const STAGE_MAP: Record<
  string,
  { label: string; color: string; bg: string; border: string }
> = {
  new: { label: "New", color: "#3B82F6", bg: "#EFF6FF", border: "#BFDBFE" },
  progress: {
    label: "In Progress",
    color: "#8B5CF6",
    bg: "#F5F3FF",
    border: "#DDD6FE",
  },
  converted: {
    label: "Converted",
    color: "#10B981",
    bg: "#ECFDF5",
    border: "#A7F3D0",
  },
  lost: { label: "Lost", color: "#EF4444", bg: "#FEF2F2", border: "#FECACA" },
};

const UserAvatar: React.FC<{ name: string; size?: number }> = ({
  name,
  size = 40,
}) => {
  const safe = name || "?";
  const initials = safe
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const hue = safe.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  return (
    <div
      className="flex items-center justify-center font-bold shrink-0 select-none"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.35,
        background: `hsl(${hue},60%,92%)`,
        color: `hsl(${hue},50%,35%)`,
        fontSize: size * 0.35,
      }}
    >
      {initials}
    </div>
  );
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function fullDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(seconds: number) {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function groupByDate(
  events: ActivityEvent[],
): { dateLabel: string; events: ActivityEvent[] }[] {
  const groups: Record<string, ActivityEvent[]> = {};
  for (const e of events) {
    const key = new Date(e.timestamp).toDateString();
    if (!groups[key]) groups[key] = [];
    groups[key].push(e);
  }
  return Object.entries(groups).map(([key, evts]) => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const label =
      key === today
        ? "Today"
        : key === yesterday
          ? "Yesterday"
          : new Date(key).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
    return { dateLabel: label, events: evts };
  });
}

const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}> = ({ icon, label, value, highlight }) => (
  <div className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0">
    <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 text-slate-400">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
        {label}
      </p>
      <p
        className={`text-[13px] font-semibold truncate mt-0.5 ${highlight ? "text-rose-500" : "text-slate-800"}`}
      >
        {value}
      </p>
    </div>
  </div>
);

// ─── ACTIVITY CARD ───────────────────────────────────
const ActivityCard: React.FC<{ event: ActivityEvent; isLast: boolean }> = ({
  event,
  isLast,
}) => {
  const [expanded, setExpanded] = useState(false);
  const cfg = ACTIVITY_CONFIG[event.type];

  function formatOutcome(outcome: string) {
    return outcome
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function formatDateTime(date: string) {
    const d = new Date(date);

    return d.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <div className="flex gap-3 group">
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

      <div className="flex-1 min-w-0 pb-4">
        <div
          className="bg-white rounded-xl border border-slate-100 p-3 cursor-pointer hover:border-slate-200 hover:shadow-sm transition-all duration-150"
          onClick={() => setExpanded(!expanded)}
        >
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
                <div className="flex flex-col gap-2 mt-2">
                  {/* Top row: duration + outcome */}
                  <div className="flex flex-wrap gap-1.5">
                    {event.meta.duration && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-600">
                        <RiTimeLine size={11} />
                        {formatDuration(event.meta.duration)}
                      </span>
                    )}

                    {event.meta.outcome && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-600">
                        {formatOutcome(event.meta.outcome)}
                      </span>
                    )}
                  </div>

                  {/* Notes */}
                  {event.meta.notes && (
                    <div className="flex items-start gap-1.5 text-[12px] text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-100">
                      <RiStickyNoteLine
                        size={12}
                        className="mt-[2px] text-slate-400"
                      />
                      <span>{event.meta.notes}</span>
                    </div>
                  )}

                  {/* Follow-up */}
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
              <UserAvatar name={event.author} size={18} />
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

// ─── Transform ApiLead → local Lead ──────────────────
function apiLeadToLocal(a: ApiLead): Lead {
  const statusToStage: Record<string, string> = {
    NEW: "new",
    IN_PROGRESS: "progress",
    CONVERTED: "converted",
    LOST: "lost",
  };
  return {
    id: a.id,
    name: a.fullName,
    phone: a.phone,
    email: a.email ?? "",
    country: a.country,
    source: a.source,
    status: a.status,
    stage: statusToStage[a.status] ?? "new",
    priority: (a.priority.charAt(0) +
      a.priority.slice(1).toLowerCase()) as Lead["priority"],
    counselor: a.counselor?.name ?? "",
    followUp: a.followUpDate?.split("T")[0] ?? "",
    ieltsScore: a.ieltsScore != null ? String(a.ieltsScore) : undefined,
    notes: (a.notes ?? []).map((n) => ({
      id: n.id,
      text: n.content,
      createdAt: n.createdAt,
      author: a.counselor?.name ?? "Admin",
    })),
    createdAt: a.createdAt.split("T")[0],
  };
}

const ViewLeadDrawer: React.FC<Props> = ({
  lead,
  onClose,
  initialTab = "notes",
}) => {
  const [activeTab, setActiveTab] = useState<"notes" | "details" | "activity">(
    initialTab,
  );
  const [activityFilter, setActivityFilter] = useState<ActivityType | "all">(
    "all",
  );
  const [activitySearch, setActivitySearch] = useState("");
  const [newNote, setNewNote] = useState("");

  // Fetch fresh lead data
  const { data: freshLead, isLoading: leadLoading } = useQuery({
    queryKey: ["lead", lead?.id],
    queryFn: () => getLeadById(lead!.id),
    enabled: !!lead?.id,
    select: apiLeadToLocal,
    placeholderData: lead ? undefined : undefined,
  });

  const displayLead = freshLead ?? lead;

  const { data: rawActivity = [], isLoading: activityLoading } = useQuery({
    queryKey: ["lead-activity", lead?.id],
    queryFn: () => getLeadActivity(lead!.id),
    enabled: !!lead?.id,
  });

  const allActivity = useMemo(
    () => rawActivity.map(mapApiActivity),
    [rawActivity],
  );

  const filteredActivity = useMemo(() => {
    let list =
      activityFilter === "all"
        ? allActivity
        : allActivity.filter((e) => e.type === activityFilter);
    if (activitySearch.trim()) {
      const q = activitySearch.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.author.toLowerCase().includes(q) ||
          Object.values(e.meta || {}).some((v) => v.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [allActivity, activityFilter, activitySearch]);

  const grouped = useMemo(
    () => groupByDate(filteredActivity),
    [filteredActivity],
  );

  if (!displayLead) return null;

  const stage = STAGE_MAP[displayLead.stage] || {
    label: displayLead.stage,
    color: "#64748b",
    bg: "#f8fafc",
    border: "#e2e8f0",
  };
  const isOverdue = displayLead.followUp
    ? new Date(displayLead.followUp) < new Date()
    : false;
  const priorityConfig = (
    {
      Hot: {
        icon: <RiFireLine size={12} />,
        color: "#ef4444",
        bg: "#fff5f5",
        border: "#fed7d7",
      },
      Warm: {
        icon: <RiFlashlightLine size={12} />,
        color: "#f59e0b",
        bg: "#fffbeb",
        border: "#fde68a",
      },
      Cold: {
        icon: <RiSnowflakeLine size={12} />,
        color: "#3b82f6",
        bg: "#eff6ff",
        border: "#bfdbfe",
      },
    } as Record<
      string,
      { icon: React.ReactNode; color: string; bg: string; border: string }
    >
  )[displayLead.priority] ?? {
    icon: null,
    color: "#64748b",
    bg: "#f8fafc",
    border: "#e2e8f0",
  };

  return (
    <Drawer
      open={!!lead}
      onClose={onClose}
      width={600}
      title={null}
      styles={{
        body: {
          padding: 0,
          background: "#f8fafc",
          display: "flex",
          flexDirection: "column",
        },
        header: { display: "none" },
      }}
    >
      {/* ── HEADER ── */}
      <div className="bg-white px-5 pt-5 pb-4 border-b border-slate-100 shrink-0">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {leadLoading && !freshLead ? (
              <div className="flex items-center gap-3 animate-pulse">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 shrink-0" />
                <div>
                  <div className="h-4 w-32 bg-slate-100 rounded mb-2" />
                  <div className="h-3 w-24 bg-slate-100 rounded" />
                </div>
              </div>
            ) : (
              <>
                <UserAvatar name={displayLead.name} size={44} />
                <div>
                  <h2 className="text-[16px] font-bold text-slate-900 leading-tight">
                    {displayLead.name}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <RiPhoneLine size={11} /> {displayLead.phone}
                  </p>
                </div>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 border-none bg-transparent cursor-pointer outline-none transition-colors"
          >
            <RiCloseLine size={17} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border"
            style={{
              background: stage.bg,
              color: stage.color,
              borderColor: stage.border,
            }}
          >
            {stage.label}
          </span>
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border"
            style={{
              background: priorityConfig.bg,
              color: priorityConfig.color,
              borderColor: priorityConfig.border,
            }}
          >
            {priorityConfig.icon} {displayLead.priority}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 text-slate-500 border border-slate-200">
            <RiMapPinLine size={11} /> {displayLead.source}
          </span>
          {displayLead.counselor && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 text-slate-500 border border-slate-200">
              <RiUserSmileLine size={11} /> {displayLead.counselor}
            </span>
          )}
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="bg-white border-b border-slate-100 px-4 flex shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() =>
              setActiveTab(tab.key as "notes" | "details" | "activity")
            }
            className="px-4 py-3 bg-transparent border-none text-[13px] font-semibold cursor-pointer flex items-center gap-1.5 transition-colors border-b-2 whitespace-nowrap"
            style={{
              color: activeTab === tab.key ? "#2563eb" : "#94a3b8",
              borderBottomColor:
                activeTab === tab.key ? "#2563eb" : "transparent",
            }}
          >
            {tab.icon} {tab.label}
            {tab.key === "notes" && displayLead.notes.length > 0 && (
              <span
                className="min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-bold flex items-center justify-center"
                style={{
                  background: activeTab === "notes" ? "#2563eb" : "#f1f5f9",
                  color: activeTab === "notes" ? "#fff" : "#64748b",
                }}
              >
                {displayLead.notes.length}
              </span>
            )}
            {tab.key === "activity" &&
              !activityLoading &&
              allActivity.length > 0 && (
                <span
                  className="min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-bold flex items-center justify-center"
                  style={{
                    background:
                      activeTab === "activity" ? "#2563eb" : "#f1f5f9",
                    color: activeTab === "activity" ? "#fff" : "#64748b",
                  }}
                >
                  {allActivity.length}
                </span>
              )}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT ── */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        {/* NOTES TAB */}
        {activeTab === "notes" && (
          <>
            <div className="flex-1 overflow-y-auto activity-scroll p-4 flex flex-col gap-3">
              {displayLead.notes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                    <RiStickyNoteLine size={24} className="text-slate-300" />
                  </div>
                  <p className="text-sm font-semibold text-slate-500">
                    No notes yet
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Add the first note below
                  </p>
                </div>
              ) : (
                displayLead.notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:border-slate-200 hover:shadow-md transition-all duration-150"
                  >
                    <div className="flex items-center gap-2 mb-2.5">
                      <UserAvatar name={note.author || "Admin"} size={28} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700">
                          {note.author || "Admin"}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {fullDate(note.createdAt)}
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-300">
                        {timeAgo(note.createdAt)}
                      </span>
                    </div>
                    <p className="text-[13px] text-slate-600 leading-relaxed">
                      {note.text}
                    </p>
                  </div>
                ))
              )}
            </div>
            <div className="bg-white border-t border-slate-100 p-4 shrink-0">
              <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <RiAddLine size={12} className="text-slate-400" /> Add a note
              </p>
              <Input.TextArea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
                placeholder="Write a note about this student…"
                style={{
                  resize: "none",
                  borderRadius: 10,
                  borderColor: "#e8edf2",
                  fontSize: 13,
                }}
              />
              <div className="flex justify-between items-center mt-2.5">
                <span className="text-[11px] text-slate-400">
                  ⌘ + Enter to submit
                </span>
                <button
                  disabled={!newNote.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border-none transition-all cursor-pointer outline-none"
                  style={{
                    background: newNote.trim() ? "#2563eb" : "#e2e8f0",
                    color: newNote.trim() ? "#fff" : "#94a3b8",
                    cursor: newNote.trim() ? "pointer" : "not-allowed",
                  }}
                >
                  <RiSendPlaneLine size={14} /> Add Note
                </button>
              </div>
            </div>
          </>
        )}

        {/* DETAILS TAB */}
        {activeTab === "details" && (
          <div className="flex-1 overflow-y-auto activity-scroll">
            <div className="mx-4 mt-4 bg-white shadow-sm rounded-2xl border border-slate-100 px-4 py-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-3 pb-1">
                Contact Details
              </p>
              <InfoRow
                icon={<RiPhoneLine size={14} />}
                label="Phone"
                value={displayLead.phone}
              />
              <InfoRow
                icon={<RiMailLine size={14} />}
                label="Email"
                value={displayLead.email || "Not provided"}
              />
              <InfoRow
                icon={<RiGlobalLine size={14} />}
                label="Destination"
                value={displayLead.country}
              />
              <InfoRow
                icon={<RiUserSmileLine size={14} />}
                label="Counselor"
                value={displayLead.counselor || "Unassigned"}
              />
              <InfoRow
                icon={<RiCalendarLine size={14} />}
                label="Follow-up"
                value={
                  displayLead.followUp
                    ? new Date(displayLead.followUp).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" },
                      )
                    : "Not set"
                }
                highlight={isOverdue}
              />
              {displayLead.ieltsScore && (
                <InfoRow
                  icon={<RiAwardLine size={14} />}
                  label="IELTS Score"
                  value={`Band ${displayLead.ieltsScore}`}
                />
              )}
            </div>
            <div className="mx-4 mt-3 mb-4 grid grid-cols-2 gap-2.5">
              <div className="bg-white shadow-sm rounded-2xl border border-slate-100 p-4 text-center">
                <p className="text-2xl font-extrabold text-slate-900">
                  {displayLead.notes.length}
                </p>
                <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                  Notes
                </p>
              </div>
              <div className="bg-white shadow-sm rounded-2xl border border-slate-100 p-4 text-center">
                <p
                  className="text-2xl font-extrabold"
                  style={{ color: isOverdue ? "#ef4444" : "#10b981" }}
                >
                  {isOverdue ? "Overdue" : "On Track"}
                </p>
                <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                  Follow-up
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVITY TAB — fully unchanged */}
        {activeTab === "activity" && (
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <div className="bg-white border-b border-slate-100 px-4 py-3 flex flex-col gap-2.5 shrink-0">
              <Input
                prefix={<RiSearchLine size={13} className="text-slate-400" />}
                placeholder="Search activity…"
                value={activitySearch}
                onChange={(e) => setActivitySearch(e.target.value)}
                allowClear
                style={{
                  borderRadius: 10,
                  borderColor: "#e8edf2",
                  fontSize: 12,
                }}
                size="middle"
              />
              <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                <div className="flex items-center gap-1 shrink-0 text-[10px] font-bold text-slate-400 mr-1">
                  <RiFilter3Line size={11} /> Filter:
                </div>
                {FILTER_TYPES.map((f) => {
                  const active = activityFilter === f.key;
                  return (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setActivityFilter(f.key)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap cursor-pointer border transition-all outline-none shrink-0"
                      style={{
                        background: active ? "#2563eb" : "#f8fafc",
                        color: active ? "#fff" : "#64748b",
                        borderColor: active ? "#2563eb" : "#e2e8f0",
                      }}
                    >
                      {f.icon} {f.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-4 shrink-0 overflow-x-auto">
              {[
                {
                  type: "call" as ActivityType,
                  icon: <RiPhoneFill size={10} />,
                  color: "#059669",
                },
                {
                  type: "email" as ActivityType,
                  icon: <RiMailFill size={10} />,
                  color: "#d97706",
                },
                {
                  type: "note_added" as ActivityType,
                  icon: <RiStickyNoteLine size={10} />,
                  color: "#0891b2",
                },
                {
                  type: "stage_change" as ActivityType,
                  icon: <RiArrowRightLine size={10} />,
                  color: "#7c3aed",
                },
              ].map(({ type, icon, color }) => {
                const count = allActivity.filter((e) => e.type === type).length;
                const cfg = ACTIVITY_CONFIG[type];
                return (
                  <div
                    key={type}
                    className="flex items-center gap-1.5 shrink-0"
                  >
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center"
                      style={{ background: cfg.bg, color }}
                    >
                      {icon}
                    </div>
                    <span className="text-xs font-bold text-slate-700">
                      {count}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {cfg.label}s
                    </span>
                  </div>
                );
              })}
              <div className="ml-auto shrink-0">
                <span className="text-[10px] text-slate-400 font-medium">
                  {filteredActivity.length} event
                  {filteredActivity.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto activity-scroll px-4 pt-4 pb-2">
              {activityLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Spin size="large" />
                </div>
              ) : grouped.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                    <RiHistoryLine size={20} className="text-slate-300" />
                  </div>
                  <p className="text-sm font-semibold text-slate-500">
                    No activity yet
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Activity will appear here as actions are taken
                  </p>
                </div>
              ) : (
                grouped.map(({ dateLabel, events }) => (
                  <div key={dateLabel} className="mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-px flex-1 bg-slate-100" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-1 bg-slate-100 rounded-full whitespace-nowrap">
                        {dateLabel}
                      </span>
                      <div className="h-px flex-1 bg-slate-100" />
                    </div>
                    {events.map((event, i) => (
                      <ActivityCard
                        key={event.id}
                        event={event}
                        isLast={i === events.length - 1}
                      />
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default ViewLeadDrawer;
