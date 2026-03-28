import React, { useState, useRef } from "react";
import { Drawer } from "antd";
import {
  RiStickyNoteLine,
  RiFileTextLine,
  RiHistoryLine,
  RiCloseLine,
  RiPhoneLine,
  RiMailLine,
  RiMapPinLine,
  RiUserSmileLine,
  RiCalendarLine,
  RiGlobalLine,
  RiAwardLine,
  RiSendPlaneLine,
  RiTimeLine,
  RiArrowRightLine,
  RiPhoneFill,
  RiMailFill,
  RiAlertLine,
  RiPencilLine,
  RiSparklingLine,
  RiAddLine,
  RiDeleteBinLine,
} from "react-icons/ri";
import type { Lead } from "../../../types/lead.types";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
export interface Note {
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
  onAddNote: (leadId: string, text: string) => void;
  onDeleteNote?: (leadId: string, noteId: string) => void;
}

type TabKey = "notes" | "details" | "activity";

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
  applied: {
    label: "Applied",
    color: "#F59E0B",
    bg: "#FFFBEB",
    border: "#FDE68A",
  },
  converted: {
    label: "Converted",
    color: "#10B981",
    bg: "#ECFDF5",
    border: "#A7F3D0",
  },
};

const PRIORITY_CONFIG = {
  Hot: { icon: "🔥", color: "#ef4444", bg: "#fff5f5", border: "#fed7d7" },
  Warm: { icon: "⚡", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
  Cold: { icon: "❄️", color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" },
};

type ActivityConfig = {
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
  label: string;
};

const ACTIVITY_CONFIG: Record<ActivityType, ActivityConfig> = {
  created: {
    icon: <RiSparklingLine size={11} />,
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
    label: "Created",
  },
  stage_change: {
    icon: <RiArrowRightLine size={11} />,
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    label: "Stage Changed",
  },
  note_added: {
    icon: <RiStickyNoteLine size={11} />,
    color: "#0891b2",
    bg: "#ecfeff",
    border: "#a5f3fc",
    label: "Note",
  },
  call: {
    icon: <RiPhoneFill size={11} />,
    color: "#059669",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    label: "Call",
  },
  email: {
    icon: <RiMailFill size={11} />,
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    label: "Email",
  },
  edit: {
    icon: <RiPencilLine size={11} />,
    color: "#475569",
    bg: "#f8fafc",
    border: "#e2e8f0",
    label: "Edit",
  },
  followup_set: {
    icon: <RiCalendarLine size={11} />,
    color: "#db2777",
    bg: "#fdf2f8",
    border: "#fbcfe8",
    label: "Follow-up",
  },
  overdue: {
    icon: <RiAlertLine size={11} />,
    color: "#ef4444",
    bg: "#fff5f5",
    border: "#fed7d7",
    label: "Overdue",
  },
};

// ─────────────────────────────────────────────
// MOCK ACTIVITY GENERATOR
// ─────────────────────────────────────────────
function buildActivity(lead: Lead): ActivityEvent[] {
  const base = new Date(lead.createdAt).getTime();
const isOverdue = lead.followUp ? new Date(lead.followUp) < new Date() : false;

  const events: ActivityEvent[] = [
    {
      id: "ev-1",
      type: "created",
      author: lead.counselor,
      title: "Lead created",
      description: `${lead.name} was added to the pipeline via ${lead.source}.`,
      timestamp: new Date(base).toISOString(),
    },
    {
      id: "ev-2",
      type: "stage_change",
      author: lead.counselor,
      title: "Stage updated",
      timestamp: new Date(base + 1 * 3600000).toISOString(),
      meta: { from: "New", to: "In Progress" },
    },
    {
      id: "ev-3",
      type: "call",
      author: lead.counselor,
      title: "Discovery call",
      description:
        "Initial call to understand student goals, preferred countries, and budget.",
      timestamp: new Date(base + 2.5 * 3600000).toISOString(),
      meta: { duration: "4m 32s", outcome: "Interested" },
    },
    {
      id: "ev-4",
      type: "email",
      author: lead.counselor,
      title: "Welcome email sent",
      description: "Sent programme overview and intake calendar.",
      timestamp: new Date(base + 5 * 3600000).toISOString(),
      meta: { subject: "Your Study Abroad Journey Starts Here 🎓" },
    },
    {
      id: "ev-5",
      type: "followup_set",
      author: lead.counselor,
      title: "Follow-up scheduled",
      timestamp: new Date(base + 6 * 3600000).toISOString(),
      meta: {
        date: new Date(lead.followUp).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      },
    },
    {
      id: "ev-6",
      type: "edit",
      author: "Admin",
      title: "Lead details updated",
      timestamp: new Date(base + 8 * 3600000).toISOString(),
      meta: { field: "Country", from: "🇺🇸 USA", to: lead.country },
    },
    ...lead.notes.map((n, i) => ({
      id: `ev-note-${i}`,
      type: "note_added" as ActivityType,
      title: "Note added",
      description: n.text,
      author: n.author,
      timestamp: n.createdAt,
    })),
    {
      id: "ev-7",
      type: "call",
      author: lead.counselor,
      title: "Follow-up call",
      description: "Discussed IELTS prep plan and shared document checklist.",
      timestamp: new Date(base + 24 * 3600000).toISOString(),
      meta: { duration: "11m 04s", outcome: "Docs requested" },
    },
    ...(isOverdue
      ? [
          {
            id: "ev-8",
            type: "overdue" as ActivityType,
            author: "System",
            title: "Follow-up overdue",
            description:
              "Scheduled follow-up date has passed without a check-in.",
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
  size = 32,
}) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");
  const hue = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
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

// ─────────────────────────────────────────────
// NOTE CARD
// ─────────────────────────────────────────────
const NoteCard: React.FC<{
  note: Note;
  onDelete?: (id: string) => void;
}> = ({ note, onDelete }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className="bg-white rounded-xl border border-slate-100 p-4 transition-all duration-150 hover:border-slate-200 hover:shadow-sm group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start gap-2.5">
        <UserAvatar name={note.author} size={30} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-bold text-slate-700">{note.author}</p>
              <p
                className="text-[10px] text-slate-400 mt-0.5"
                title={fullDate(note.createdAt)}
              >
                {timeAgo(note.createdAt)}
              </p>
            </div>
            {/* Delete button */}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(note.id)}
                className="border-none bg-transparent cursor-pointer p-1 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 outline-none transition-all"
                style={{
                  opacity: showActions ? 1 : 0,
                  transition: "opacity 0.15s",
                }}
              >
                <RiDeleteBinLine size={13} />
              </button>
            )}
          </div>
          <p className="text-[13px] text-slate-600 leading-relaxed mt-2">
            {note.text}
          </p>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// ACTIVITY CARD
// ─────────────────────────────────────────────
const ActivityCard: React.FC<{ event: ActivityEvent; isLast: boolean }> = ({
  event,
  isLast,
}) => {
  const [open, setOpen] = useState(false);
  const cfg = ACTIVITY_CONFIG[event.type];

  return (
    <div className="flex gap-3">
      {/* Dot + line */}
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

      {/* Card */}
      <div className="flex-1 min-w-0 pb-3">
        <div
          className="rounded-xl border transition-all duration-150 cursor-pointer overflow-hidden"
          style={{
            borderColor: open ? cfg.border : "#f1f5f9",
            background: open ? cfg.bg : "#fff",
          }}
          onClick={() => setOpen(!open)}
        >
          {/* Top */}
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

          {/* Meta */}
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
              <UserAvatar name={event.author} size={16} />
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

// ─────────────────────────────────────────────
// DETAILS ROW
// ─────────────────────────────────────────────
const DetailRow: React.FC<{
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

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const LeadNotesDrawer: React.FC<Props> = ({
  lead,
  onClose,
  onAddNote,
  onDeleteNote,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>("notes");
  const [newNote, setNewNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reset tab on new lead
  React.useEffect(() => {
    if (lead) {
      setActiveTab("notes");
      setNewNote("");
    }
  }, [lead?.id]);

  if (!lead) return null;

  const stage = STAGE_MAP[lead.stage] ?? {
    label: lead.stage,
    color: "#64748b",
    bg: "#f8fafc",
    border: "#e2e8f0",
  };
  const priority = PRIORITY_CONFIG[lead.priority];
  const isOverdue = new Date(lead.followUp) < new Date();
  const activity = buildActivity(lead);

  const handleSubmit = () => {
    const text = newNote.trim();
    if (!text || submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      onAddNote(lead.id, text);
      setNewNote("");
      setSubmitting(false);
      textareaRef.current?.focus();
    }, 250);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const TABS: {
    key: TabKey;
    label: string;
    icon: React.ReactNode;
    count?: number;
  }[] = [
    {
      key: "notes",
      label: "Notes",
      icon: <RiStickyNoteLine size={12} />,
      count: lead.notes.length,
    },
    { key: "details", label: "Details", icon: <RiFileTextLine size={12} /> },
    {
      key: "activity",
      label: "Activity",
      icon: <RiHistoryLine size={12} />,
      count: activity.length,
    },
  ];

  return (
    <Drawer
      open={!!lead}
      onClose={onClose}
      width={480}
      title={null}
      styles={{
        body: {
          padding: 0,
          background: "#f8fafc",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
        header: { display: "none" },
      }}
    >
      <style>{`
        .notes-scroll::-webkit-scrollbar { width: 4px; }
        .notes-scroll::-webkit-scrollbar-track { background: transparent; }
        .notes-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
      `}</style>

      {/* ══ HEADER ══ */}
      <div className="bg-white px-5 pt-5 pb-4 border-b border-slate-100 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <UserAvatar name={lead.name} size={42} />
            <div>
              <h2 className="text-[15px] font-bold text-slate-900 leading-tight">
                {lead.name}
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
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
              borderColor: stage.border,
            }}
          >
            {stage.label}
          </span>
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border"
            style={{
              background: priority.bg,
              color: priority.color,
              borderColor: priority.border,
            }}
          >
            {priority.icon} {lead.priority}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 text-slate-500 border border-slate-200">
            <RiMapPinLine size={11} /> {lead.source}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 text-slate-500 border border-slate-200">
            <RiUserSmileLine size={11} /> {lead.counselor}
          </span>
        </div>
      </div>

      {/* ══ TABS ══ */}
      <div className="bg-white border-b border-slate-100 px-2 flex shrink-0">
        {TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 text-[12px] font-semibold cursor-pointer border-none bg-transparent outline-none border-b-2 transition-all"
              style={{
                color: active ? "#2563eb" : "#94a3b8",
                borderBottomColor: active ? "#2563eb" : "transparent",
              }}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className="min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center"
                  style={{
                    background: active ? "#2563eb" : "#f1f5f9",
                    color: active ? "#fff" : "#64748b",
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ══ CONTENT ══ */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        {/* ─── NOTES TAB ─── */}
        {activeTab === "notes" && (
          <>
            <div className="flex-1 overflow-y-auto notes-scroll p-4 flex flex-col gap-3">
              {lead.notes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 select-none">
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
                <>
                  {/* Note count header */}
                  <div className="flex items-center justify-between px-1 mb-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {lead.notes.length} note
                      {lead.notes.length !== 1 ? "s" : ""}
                    </p>
                    <span className="text-[10px] text-slate-300">
                      newest first
                    </span>
                  </div>
                  {/* Notes — newest first */}
                  {[...lead.notes]
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime(),
                    )
                    .map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onDelete={
                          onDeleteNote
                            ? (noteId) => onDeleteNote(lead.id, noteId)
                            : undefined
                        }
                      />
                    ))}
                </>
              )}
            </div>

            {/* Add note form */}
            <div className="bg-white border-t border-slate-100 p-4 shrink-0">
              <div className="flex items-center gap-2 mb-2">
                <RiAddLine size={12} className="text-slate-400" />
                <p className="text-xs font-bold text-slate-600">Add a note</p>
              </div>
              <div
                className="rounded-xl overflow-hidden transition-all duration-150"
                style={{ border: "1.5px solid #e8edf2" }}
                onFocusCapture={(e) =>
                  (e.currentTarget.style.borderColor = "#2563eb")
                }
                onBlurCapture={(e) =>
                  (e.currentTarget.style.borderColor = "#e8edf2")
                }
              >
                <textarea
                  ref={textareaRef}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Write a note about this student — key details, concerns, next steps…"
                  rows={3}
                  className="w-full outline-none resize-none text-[12.5px] text-slate-700 placeholder:text-slate-300 leading-relaxed bg-white"
                  style={{
                    padding: "10px 12px",
                    fontFamily: "inherit",
                    border: "none",
                  }}
                />
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400">
                    {newNote.length > 0
                      ? `${newNote.length} chars`
                      : "⌘ Enter to submit"}
                  </span>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!newNote.trim() || submitting}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-bold border-none cursor-pointer outline-none transition-all"
                    style={{
                      background: newNote.trim() ? "#2563eb" : "#e2e8f0",
                      color: newNote.trim() ? "#fff" : "#94a3b8",
                      cursor: newNote.trim() ? "pointer" : "not-allowed",
                    }}
                  >
                    {submitting ? (
                      <span
                        className="w-3 h-3 rounded-full border-2 border-white/30 inline-block"
                        style={{
                          borderTopColor: "#fff",
                          animation: "spin 0.7s linear infinite",
                        }}
                      />
                    ) : (
                      <RiSendPlaneLine size={12} />
                    )}
                    {submitting ? "Saving…" : "Add Note"}
                  </button>
                </div>
              </div>
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
          </>
        )}

        {/* ─── DETAILS TAB ─── */}
        {activeTab === "details" && (
          <div className="flex-1 overflow-y-auto notes-scroll">
            {/* Quick stats */}
            <div className="mx-4 mt-4 bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="grid grid-cols-3 divide-x divide-slate-100">
                {[
                  {
                    label: "Notes",
                    value: lead.notes.length,
                    color: "#2563eb",
                  },
                  {
                    label: "Follow-up",
                    value: isOverdue ? "Overdue" : "On Time",
                    color: isOverdue ? "#ef4444" : "#10b981",
                  },
                  {
                    label: "Activities",
                    value: activity.length,
                    color: "#7c3aed",
                  },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex flex-col items-center py-4">
                    <p
                      className="text-xl font-extrabold leading-none"
                      style={{ color }}
                    >
                      {value}
                    </p>
                    <p className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-wide">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Info rows */}
            <div className="mx-4 mt-3 mb-4 bg-white rounded-2xl border border-slate-100 px-4 py-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-3 pb-1">
                Contact Details
              </p>
              <DetailRow
                icon={<RiPhoneLine size={14} />}
                label="Phone"
                value={lead.phone}
              />
              <DetailRow
                icon={<RiMailLine size={14} />}
                label="Email"
                value={lead.email || "Not provided"}
              />
              <DetailRow
                icon={<RiGlobalLine size={14} />}
                label="Destination"
                value={lead.country}
              />
              <DetailRow
                icon={<RiUserSmileLine size={14} />}
                label="Counselor"
                value={lead.counselor}
              />
              <DetailRow
                icon={<RiMapPinLine size={14} />}
                label="Source"
                value={lead.source}
              />
              <DetailRow
                icon={<RiCalendarLine size={14} />}
                label="Follow-up"
                value={new Date(lead.followUp).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                highlight={isOverdue}
              />
              <DetailRow
                icon={<RiCalendarLine size={14} />}
                label="Joined"
                value={new Date(lead.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              />
              {lead.ieltsScore && (
                <DetailRow
                  icon={<RiAwardLine size={14} />}
                  label="IELTS Score"
                  value={`Band ${lead.ieltsScore}`}
                />
              )}
            </div>
          </div>
        )}

        {/* ─── ACTIVITY TAB ─── */}
        {activeTab === "activity" && (
          <div className="flex-1 overflow-y-auto notes-scroll px-4 pt-4 pb-4">
            {/* Stats strip */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                {
                  type: "call" as ActivityType,
                  label: "Calls",
                  color: "#059669",
                  bg: "#f0fdf4",
                },
                {
                  type: "email" as ActivityType,
                  label: "Emails",
                  color: "#d97706",
                  bg: "#fffbeb",
                },
                {
                  type: "note_added" as ActivityType,
                  label: "Notes",
                  color: "#0891b2",
                  bg: "#ecfeff",
                },
                {
                  type: "stage_change" as ActivityType,
                  label: "Stages",
                  color: "#7c3aed",
                  bg: "#f5f3ff",
                },
              ].map(({ type, label, color, bg }) => {
                const count = activity.filter((e) => e.type === type).length;
                const cfg = ACTIVITY_CONFIG[type];
                return (
                  <div
                    key={type}
                    className="bg-white rounded-xl border border-slate-100 p-3 text-center"
                  >
                    <div
                      className="w-7 h-7 rounded-xl flex items-center justify-center mx-auto mb-1.5"
                      style={{ background: bg, color }}
                    >
                      {cfg.icon}
                    </div>
                    <p className="text-base font-extrabold text-slate-800 leading-none">
                      {count}
                    </p>
                    <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide mt-0.5">
                      {label}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Timeline */}
            <div className="flex flex-col">
              {activity.map((event, i) => (
                <ActivityCard
                  key={event.id}
                  event={event}
                  isLast={i === activity.length - 1}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default LeadNotesDrawer;
