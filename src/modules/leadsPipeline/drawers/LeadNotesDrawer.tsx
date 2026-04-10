import React, { useState, useRef } from "react";
import { Drawer, Spin } from "antd";
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
  RiAddLine,
} from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";

import type { Lead } from "../types/lead";

import {
  mapApiType,
  PRIORITY_CONFIG,
  STAGE_MAP,
  type ActivityEvent,
  type ActivityType,
} from "../types/Activity";

import NoteCard from "../../../components/common/NoteCard";
import DetailRow from "../../../components/common/Detailrow";
import ActivityCard from "../../../components/common/ActivityCard";
import { ACTIVITY_CONFIG } from "../utils/Activityconfig";
import type { TabKey } from "../types/lead";
import UserAvatar from "../../../components/common/UserAvatar";
import { getLeadActivity } from "../api/leads";

interface Props {
  lead: Lead | null;
  onClose: () => void;
  onAddNote: (leadId: string, text: string) => void;
  onDeleteNote?: (leadId: string, noteId: string) => void;
}

function mapApiActivity(a: import("../api/leads").ApiActivity): ActivityEvent {
  return {
    id: a.id,
    type: mapApiType(a.type),
    title: a.message || "Activity",
    author: a.user?.name || "System",
    timestamp: a.createdAt,
    meta: a.meta ?? {},
  };
}

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

  // Fetch activity timeline from API
  const { data: rawActivity = [], isLoading: activityLoading } = useQuery({
    queryKey: ["lead-activity", lead?.id],
    queryFn: () => getLeadActivity(lead!.id),
    enabled: !!lead?.id,
  });

  if (!lead) return null;

  const activity: ActivityEvent[] = rawActivity.map(mapApiActivity);

  const stage = STAGE_MAP[lead.stage] ?? {
    label: lead.stage,
    color: "#64748b",
    bg: "#f8fafc",
    border: "#e2e8f0",
  };
  const priority = PRIORITY_CONFIG[lead.priority];
  const isOverdue = lead.followUp
    ? new Date(lead.followUp) < new Date()
    : false;

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
      {/* ── Header ── */}
      <div className="bg-white px-5 pt-5 pb-4 border-b border-slate-100 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <UserAvatar name={lead.name} size="xl" />
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

        {/* Stage / priority / source / counselor badges */}
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

      {/* ── Tabs ── */}
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

      {/* ── Tab content ── */}
      <div
        key={lead.id}
        className="flex-1 flex flex-col overflow-hidden min-h-0"
      >
        {/* ─ Notes tab ─ */}
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
                  <div className="flex items-center justify-between px-1 mb-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {lead.notes.length} note
                      {lead.notes.length !== 1 ? "s" : ""}
                    </p>
                    <span className="text-[10px] text-slate-300">
                      newest first
                    </span>
                  </div>
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
                  placeholder="Write a note — key details, concerns, next steps…"
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
            </div>
          </>
        )}

        {/* ─ Details tab ─ */}
        {activeTab === "details" && (
          <div className="flex-1 overflow-y-auto notes-scroll">
            {/* Quick stats strip */}
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
                value={
                  lead.followUp
                    ? new Date(lead.followUp).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Not set"
                }
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

        {/* ─ Activity tab ─ */}
        {activeTab === "activity" && (
          <div className="flex-1 overflow-y-auto notes-scroll px-4 pt-4 pb-4">
            {/* Activity type stats */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {(
                [
                  "call",
                  "email",
                  "note_added",
                  "stage_change",
                ] as ActivityType[]
              ).map((type) => {
                const labels: Record<string, string> = {
                  call: "Calls",
                  email: "Emails",
                  note_added: "Notes",
                  stage_change: "Stages",
                };
                const count = activity.filter((e) => e.type === type).length;
                const cfg = ACTIVITY_CONFIG[type];
                return (
                  <div
                    key={type}
                    className="bg-white rounded-xl border border-slate-100 p-3 text-center"
                  >
                    <div
                      className="w-7 h-7 rounded-xl flex items-center justify-center mx-auto mb-1.5"
                      style={{ background: cfg.bg, color: cfg.color }}
                    >
                      {cfg.icon}
                    </div>
                    <p className="text-base font-extrabold text-slate-800 leading-none">
                      {count}
                    </p>
                    <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide mt-0.5">
                      {labels[type]}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Timeline */}
            {activityLoading ? (
              <div className="flex items-center justify-center py-16">
                <Spin size="large" />
              </div>
            ) : (
              <div className="flex flex-col">
                {activity.map((event, i) => (
                  <ActivityCard
                    key={event.id}
                    event={event}
                    isLast={i === activity.length - 1}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default LeadNotesDrawer;
