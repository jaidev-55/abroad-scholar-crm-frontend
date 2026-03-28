import React, { useState, useMemo } from "react";
import { Drawer, Input } from "antd";
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
import type { Lead } from "../../../types/lead.types";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface Note {
  id: string;
  text: string;
  createdAt: string;
  author: string;
}

type ActivityType =
  | "created"
  | "stage_change"
  | "note_added"
  | "call"
  | "email"
  | "edit"
  | "followup_set"
  | "overdue";

interface ActivityEvent {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  author: string;
  timestamp: string;
  meta?: Record<string, string>;
}

interface Props {
  lead: Lead | null;
  onClose: () => void;
  onOpenNotes: (lead: Lead) => void;
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
    label: "Lead Created",
  },
  stage_change: {
    icon: <RiArrowRightLine size={12} />,
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    label: "Stage Changed",
  },
  note_added: {
    icon: <RiStickyNoteLine size={12} />,
    color: "#0891b2",
    bg: "#ecfeff",
    border: "#a5f3fc",
    label: "Note Added",
  },
  call: {
    icon: <RiPhoneFill size={12} />,
    color: "#059669",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    label: "Call Made",
  },
  email: {
    icon: <RiMailFill size={12} />,
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    label: "Email Sent",
  },
  edit: {
    icon: <RiPencilLine size={12} />,
    color: "#475569",
    bg: "#f8fafc",
    border: "#e2e8f0",
    label: "Lead Edited",
  },
  followup_set: {
    icon: <RiCalendarLine size={12} />,
    color: "#db2777",
    bg: "#fdf2f8",
    border: "#fbcfe8",
    label: "Follow-up Set",
  },
  overdue: {
    icon: <RiAlertLine size={12} />,
    color: "#ef4444",
    bg: "#fff5f5",
    border: "#fed7d7",
    label: "Overdue Alert",
  },
};

const FILTER_TYPES: { key: ActivityType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "stage_change", label: "Stages" },
  { key: "note_added", label: "Notes" },
  { key: "call", label: "Calls" },
  { key: "email", label: "Emails" },
  { key: "edit", label: "Edits" },
];

// ─────────────────────────────────────────────
// GENERATE MOCK ACTIVITY for a lead
// ─────────────────────────────────────────────
function generateActivity(lead: Lead): ActivityEvent[] {
  const base = new Date(lead.createdAt).getTime();
  const authors = [lead.counselor, "Admin", "System"];

  const events: ActivityEvent[] = [
    {
      id: "a1",
      type: "created",
      title: "Lead created",
      description: `${lead.name} was added to the pipeline via ${lead.source}.`,
      author: lead.counselor,
      timestamp: new Date(base).toISOString(),
    },
    {
      id: "a2",
      type: "stage_change",
      title: "Stage updated",
      description: undefined,
      author: lead.counselor,
      timestamp: new Date(base + 1 * 3600000).toISOString(),
      meta: { from: "New", to: "In Progress" },
    },
    {
      id: "a3",
      type: "call",
      title: "Call placed",
      description:
        "Initial discovery call to understand student goals and timeline.",
      author: lead.counselor,
      timestamp: new Date(base + 2 * 3600000).toISOString(),
      meta: { duration: "4m 32s", outcome: "Interested" },
    },
    {
      id: "a4",
      type: "email",
      title: "Welcome email sent",
      description:
        "Sent programme overview and intake calendar for selected universities.",
      author: lead.counselor,
      timestamp: new Date(base + 5 * 3600000).toISOString(),
      meta: { subject: "Your Study Abroad Journey Starts Here" },
    },
    {
      id: "a5",
      type: "followup_set",
      title: "Follow-up scheduled",
      description: undefined,
      author: lead.counselor,
      timestamp: new Date(base + 6 * 3600000).toISOString(),
      meta: {
        date: new Date(lead.followUp).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      },
    },
    ...lead.notes.map((note, i) => ({
      id: `note-act-${i}`,
      type: "note_added" as ActivityType,
      title: "Note added",
      description: note.text,
      author: note.author,
      timestamp: note.createdAt,
    })),
    {
      id: "a6",
      type: "edit",
      title: "Lead details updated",
      description: undefined,
      author: authors[1],
      timestamp: new Date(base + 12 * 3600000).toISOString(),
      meta: { field: "Country", from: "🇺🇸 USA", to: lead.country },
    },
    {
      id: "a7",
      type: "call",
      title: "Follow-up call",
      description: "Discussed IELTS preparation plan and document checklist.",
      author: lead.counselor,
      timestamp: new Date(base + 24 * 3600000).toISOString(),
      meta: { duration: "11m 04s", outcome: "Documents requested" },
    },
    {
      id: "a8",
      type: "email",
      title: "Document checklist sent",
      description:
        "Shared the full document requirements PDF and deadline tracker.",
      author: lead.counselor,
      timestamp: new Date(base + 26 * 3600000).toISOString(),
      meta: { subject: "Documents Required for Your Application" },
    },
    ...(new Date(lead.followUp) < new Date()
      ? [
          {
            id: "a9",
            type: "overdue" as ActivityType,
            title: "Follow-up overdue",
            description:
              "Scheduled follow-up date has passed without check-in.",
            author: "System",
            timestamp: new Date(lead.followUp).toISOString(),
          },
        ]
      : []),
  ];

  return events.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const UserAvatar: React.FC<{ name: string; size?: number }> = ({
  name,
  size = 40,
}) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");
  const hue = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
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

// Group events by date
function groupByDate(
  events: ActivityEvent[],
): { dateLabel: string; events: ActivityEvent[] }[] {
  const groups: Record<string, ActivityEvent[]> = {};
  for (const e of events) {
    const key = new Date(e.timestamp).toDateString();
    if (!groups[key]) groups[key] = [];
    groups[key].push(e);
  }
  return Object.entries(groups).map(([key, events]) => {
    const d = new Date(key);
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const label =
      key === today
        ? "Today"
        : key === yesterday
          ? "Yesterday"
          : d.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
    return { dateLabel: label, events };
  });
}

// ─────────────────────────────────────────────
// ACTIVITY EVENT CARD
// ─────────────────────────────────────────────
const ActivityCard: React.FC<{ event: ActivityEvent; isLast: boolean }> = ({
  event,
  isLast,
}) => {
  const [expanded, setExpanded] = useState(false);
  const cfg = ACTIVITY_CONFIG[event.type];

  return (
    <div className="flex gap-3 group">
      {/* Timeline dot + line */}
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

      {/* Content */}
      <div className="flex-1 min-w-0 pb-4">
        <div
          className="bg-white rounded-xl border border-slate-100 p-3 cursor-pointer hover:border-slate-200 hover:shadow-sm transition-all duration-150"
          onClick={() => setExpanded(!expanded)}
        >
          {/* Top row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
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
          {event.meta && (
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
                    {event.meta.field}:
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-400 line-through">
                    {event.meta.from}
                  </span>
                  <RiArrowRightLine size={10} className="text-slate-400" />
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
                <span className="flex items-center gap-1 text-[11px] text-slate-500 italic truncate max-w-full">
                  <RiMailLine size={10} /> "{event.meta.subject}"
                </span>
              )}
              {event.type === "followup_set" && event.meta.date && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-pink-50 text-pink-600">
                  <RiCalendarLine size={10} /> {event.meta.date}
                </span>
              )}
            </div>
          )}

          {/* Description (expandable) */}
          {event.description && (
            <div
              className={`mt-2 overflow-hidden transition-all duration-200 ${expanded ? "max-h-40" : "max-h-0"}`}
            >
              <p className="text-[12px] text-slate-500 leading-relaxed border-t border-slate-50 pt-2">
                {event.description}
              </p>
            </div>
          )}

          {/* Footer row */}
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

// ─────────────────────────────────────────────
// TABS
// ─────────────────────────────────────────────
const TABS = [
  { key: "notes", label: "Notes", icon: <RiStickyNoteLine size={13} /> },
  { key: "details", label: "Details", icon: <RiFileTextLine size={13} /> },
  { key: "activity", label: "Activity", icon: <RiHistoryLine size={13} /> },
];

// ─────────────────────────────────────────────
// INFO ROW (Details tab)
// ─────────────────────────────────────────────
const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}> = ({ icon, label, value, highlight }) => (
  <div className="flex  items-center gap-3 py-3 border-b border-slate-50 last:border-0">
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

// ─────────────────────────────────────────────
// STAGE MAP
// ─────────────────────────────────────────────
const STAGE_MAP: Record<string, { label: string; color: string; bg: string }> =
  {
    new: { label: "New", color: "#3B82F6", bg: "#EFF6FF" },
    progress: { label: "In Progress", color: "#8B5CF6", bg: "#F5F3FF" },
    applied: { label: "Applied", color: "#F59E0B", bg: "#FFFBEB" },
    converted: { label: "Converted", color: "#10B981", bg: "#ECFDF5" },
  };

// ─────────────────────────────────────────────
// MAIN DRAWER
// ─────────────────────────────────────────────
const ViewLeadDrawer: React.FC<Props> = ({ lead, onClose, onOpenNotes }) => {
  const [activeTab, setActiveTab] = useState<"notes" | "details" | "activity">(
    "notes",
  );
  const [activityFilter, setActivityFilter] = useState<ActivityType | "all">(
    "all",
  );
  const [activitySearch, setActivitySearch] = useState("");
  const [newNote, setNewNote] = useState("");

  // hooks must stay here
  const allActivity = useMemo(
    () => (lead ? generateActivity(lead) : []),
    [lead],
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

  if (!lead) return null;

  const stage = STAGE_MAP[lead.stage] || {
    label: lead.stage,
    color: "#64748b",
    bg: "#f8fafc",
  };

  const isOverdue = new Date(lead.followUp) < new Date();

  const priorityConfig = {
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
  }[lead.priority];

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
      <style>{`
        .activity-scroll::-webkit-scrollbar { width: 4px; }
        .activity-scroll::-webkit-scrollbar-track { background: transparent; }
        .activity-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
      `}</style>

      {/* ── HEADER ── */}
      <div className="bg-white px-5 pt-5 pb-4 border-b border-slate-100 shrink-0">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <UserAvatar name={lead.name} size={44} />
            <div>
              <h2 className="text-[16px] font-bold text-slate-900 leading-tight">
                {lead.name}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                <RiPhoneLine size={11} /> {lead.phone}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 border-none bg-transparent cursor-pointer outline-none transition-colors"
          >
            <RiCloseLine size={17} />
          </button>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border"
            style={{
              background: stage.bg,
              color: stage.color,
              borderColor: `${stage.color}40`,
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
            {priorityConfig.icon} {lead.priority}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 text-slate-500 border border-slate-200">
            <RiMapPinLine size={11} /> {lead.source}
          </span>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="bg-white border-b border-slate-100 px-4 flex shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className="px-4 py-3 bg-transparent border-none text-[13px] font-semibold cursor-pointer flex items-center gap-1.5 transition-colors border-b-2 whitespace-nowrap"
            style={{
              color: activeTab === tab.key ? "#2563eb" : "#94a3b8",
              borderBottomColor:
                activeTab === tab.key ? "#2563eb" : "transparent",
            }}
          >
            {tab.icon} {tab.label}
            {tab.key === "notes" && lead.notes.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 text-[9px] font-bold flex items-center justify-center ml-0.5">
                {lead.notes.length}
              </span>
            )}
            {tab.key === "activity" && (
              <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold flex items-center justify-center ml-0.5">
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
              {lead.notes.length === 0 ? (
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
                lead.notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-white  rounded-xl p-4 border border-slate-100 shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-2.5">
                      <UserAvatar name={note.author} size={28} />
                      <div>
                        <p className="text-xs font-semibold text-slate-700">
                          {note.author}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {fullDate(note.createdAt)}
                        </p>
                      </div>
                    </div>
                    <p className="text-[13px] text-slate-600 leading-relaxed">
                      {note.text}
                    </p>
                  </div>
                ))
              )}
            </div>
            <div className="bg-white border-t border-slate-100 p-4 shrink-0">
              <p className="text-xs font-semibold text-slate-700 mb-2">
                Add a note
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.metaKey) {
                    /* handle submit */
                  }
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
            <div className="mx-4 mt-4 bg-white shadow rounded-2xl border border-slate-100 px-4 py-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-3 pb-1">
                Contact Details
              </p>
              <InfoRow
                icon={<RiPhoneLine size={14} />}
                label="Phone"
                value={lead.phone}
              />
              <InfoRow
                icon={<RiMailLine size={14} />}
                label="Email"
                value={lead.email || "Not provided"}
              />
              <InfoRow
                icon={<RiGlobalLine size={14} />}
                label="Destination"
                value={lead.country}
              />
              <InfoRow
                icon={<RiUserSmileLine size={14} />}
                label="Counselor"
                value={lead.counselor}
              />
              <InfoRow
                icon={<RiCalendarLine size={14} />}
                label="Follow-up"
                value={new Date(lead.followUp).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                highlight={isOverdue}
              />
              {lead.ieltsScore && (
                <InfoRow
                  icon={<RiAwardLine size={14} />}
                  label="IELTS Score"
                  value={`Band ${lead.ieltsScore}`}
                />
              )}
            </div>

            <div className="mx-4  mt-3 mb-4 grid grid-cols-2 gap-2.5">
              <div className="bg-white shadow  rounded-2xl border border-slate-100 p-4 text-center">
                <p className="text-2xl font-extrabold text-slate-900">
                  {lead.notes.length}
                </p>
                <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                  Notes
                </p>
              </div>
              <div className="bg-white shadow rounded-2xl border border-slate-100 p-4 text-center">
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

        {/* ACTIVITY TAB */}
        {activeTab === "activity" && (
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            {/* Search + filter bar */}
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
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap cursor-pointer border transition-all outline-none shrink-0"
                      style={{
                        background: active ? "#2563eb" : "#f8fafc",
                        color: active ? "#fff" : "#64748b",
                        borderColor: active ? "#2563eb" : "#e2e8f0",
                      }}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stats row */}
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
                      {cfg.label.split(" ")[0]}s
                    </span>
                  </div>
                );
              })}
              <div className="ml-auto shrink-0">
                <span className="text-[10px] text-slate-400 font-medium">
                  {filteredActivity.length} events
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="flex-1 overflow-y-auto activity-scroll px-4 pt-4 pb-2">
              {grouped.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                    <RiHistoryLine size={20} className="text-slate-300" />
                  </div>
                  <p className="text-sm font-semibold text-slate-500">
                    No matching activity
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Try a different filter or search term
                  </p>
                </div>
              ) : (
                grouped.map(({ dateLabel, events }) => (
                  <div key={dateLabel} className="mb-4">
                    {/* Date separator */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-px flex-1 bg-slate-100" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-1 bg-slate-100 rounded-full whitespace-nowrap">
                        {dateLabel}
                      </span>
                      <div className="h-px flex-1 bg-slate-100" />
                    </div>
                    {/* Events */}
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

      {/* ── CTA (only on notes/details) ── */}
      {activeTab !== "activity" && (
        <div className="px-5 shadow py-4 bg-white border-t border-slate-100 shrink-0">
          <button
            onClick={() => {
              onClose();
              onOpenNotes(lead);
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-bold border-none cursor-pointer transition-all duration-150"
            style={{
              background: "#2563eb",
              boxShadow: "0 2px 10px rgba(37,99,235,0.22)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1d4ed8")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#2563eb")}
          >
            <RiStickyNoteLine size={15} /> View Full Notes & Activity
          </button>
        </div>
      )}
    </Drawer>
  );
};

export default ViewLeadDrawer;
