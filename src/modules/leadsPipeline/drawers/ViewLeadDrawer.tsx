import React, { useState, useMemo } from "react";
import { Drawer, Input, Spin, message } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  RiPhoneLine,
  RiMailLine,
  RiGlobalLine,
  RiCalendarLine,
  RiUserSmileLine,
  RiStickyNoteLine,
  RiCloseLine,
  RiMapPinLine,
  RiAwardLine,
  RiHistoryLine,
  RiAddLine,
  RiSearchLine,
  RiFilter3Line,
  RiSendPlaneLine,
  RiPhoneFill,
  RiMailFill,
  RiArrowRightLine,
  RiBookOpenLine,
  RiBuilding2Line,
  RiLoader4Line,
} from "react-icons/ri";

import type { Lead } from "../types/lead";
import {
  getLeadActivity,
  getLeadById,
  addLeadNote,
  type ApiLead,
} from "../api/leads";

import { timeAgo, fullDate } from "../utils/dateUtils";
import type { ActivityEvent, ActivityType } from "../types/Viewlead";
import { apiLeadToLocal } from "../types/Transformlead";
import { groupByDate, mapApiActivity } from "../utils/Viewleadhelpers";
import {
  PRIORITY_CONFIG,
  ACTIVITY_CONFIG,
  TABS,
  FILTER_TYPES,
} from "../utils/Viewleadconfig";

import UserAvatar from "../../../components/common/UserAvatar";
import DetailRow from "../../../components/common/Detailrow";
import ViewActivityCard from "../components/Viewactivitycard";
import { STAGE_MAP } from "../utils/viewLeadConstants";
import { getIsAdmin } from "../../../utils/getStoredUser";

interface Props {
  lead: Lead | null;
  onClose: () => void;
  initialTab?: "notes" | "details" | "activity";
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
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = getIsAdmin();
  const queryClient = useQueryClient();

  const { data: freshLead, isLoading: leadLoading } = useQuery({
    queryKey: ["lead", lead?.id],
    queryFn: () => getLeadById(lead!.id),
    enabled: !!lead?.id,
    select: (a: ApiLead) => apiLeadToLocal(a),
  });

  const displayLead = freshLead ?? lead;

  const { data: rawActivity = [], isLoading: activityLoading } = useQuery({
    queryKey: ["lead-activity", lead?.id],
    queryFn: () => getLeadActivity(lead!.id),
    enabled: !!lead?.id,
  });

  const allActivity: ActivityEvent[] = useMemo(
    () => rawActivity.map(mapApiActivity),
    [rawActivity],
  );

  // ─── Add Note Mutation ───────────────────────────────
  const { mutate: submitNote } = useMutation({
    mutationFn: (content: string) => addLeadNote(lead!.id, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead", lead?.id] });
      queryClient.invalidateQueries({ queryKey: ["lead-activity", lead?.id] });
      setNewNote("");
      setSubmitting(false);
      message.success("Note added!");
    },
    onError: () => {
      message.error("Failed to add note. Please try again.");
      setSubmitting(false);
    },
  });

  const handleAddNote = () => {
    const text = newNote.trim();
    if (!text || submitting) return;
    setSubmitting(true);
    submitNote(text);
  };

  const handleNoteKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleAddNote();
    }
  };
  // ────────────────────────────────────────────────────

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
          Object.values(e.meta || {}).some((v) =>
            String(v).toLowerCase().includes(q),
          ),
      );
    }
    return list;
  }, [allActivity, activityFilter, activitySearch]);

  const grouped = useMemo(
    () => groupByDate(filteredActivity),
    [filteredActivity],
  );

  if (!displayLead) return null;

  const stage = STAGE_MAP[displayLead.stage] ?? {
    label: displayLead.stage,
    color: "#64748b",
    bg: "#f8fafc",
    border: "#e2e8f0",
  };
  const priorityConfig = PRIORITY_CONFIG[displayLead.priority] ?? {
    icon: null,
    color: "#64748b",
    bg: "#f8fafc",
    border: "#e2e8f0",
  };
  const isOverdue = displayLead.followUp
    ? new Date(displayLead.followUp) < new Date()
    : false;

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
      {/* ── Header ── */}
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
                <UserAvatar name={displayLead.name} size="lg" />
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
            {priorityConfig.Icon && (
              <priorityConfig.Icon size={priorityConfig.iconSize} />
            )}
            {displayLead.priority}
          </span>
          {isAdmin && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 text-slate-500 border border-slate-200">
              <RiMapPinLine size={11} /> {displayLead.source}
            </span>
          )}
          {displayLead.counselor && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 text-slate-500 border border-slate-200">
              <RiUserSmileLine size={11} /> {displayLead.counselor}
            </span>
          )}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="bg-white border-b border-slate-100 px-4 flex shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className="px-4 py-3 bg-transparent border-none text-[13px] font-semibold cursor-pointer flex items-center gap-1.5 transition-colors border-b-2 whitespace-nowrap"
            style={{
              color: activeTab === tab.key ? "#2563eb" : "#94a3b8",
              borderBottomColor:
                activeTab === tab.key ? "#2563eb" : "transparent",
            }}
          >
            <tab.Icon size={tab.iconSize} /> {tab.label}
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

      {/* ── Tab content ── */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        {/* ─ Notes tab ─ */}
        {activeTab === "notes" && (
          <>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
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
                      <UserAvatar name={note.author || "Admin"} size="sm" />
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

            {/* ── Add note form ── */}
            <div className="bg-white border-t border-slate-100 p-4 shrink-0">
              <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <RiAddLine size={12} className="text-slate-400" /> Add a note
              </p>
              <Input.TextArea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={handleNoteKeyDown}
                rows={3}
                placeholder="Write a note about this student…"
                disabled={submitting}
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
                  onClick={handleAddNote}
                  disabled={!newNote.trim() || submitting}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border-none transition-all outline-none"
                  style={{
                    background:
                      newNote.trim() && !submitting ? "#2563eb" : "#e2e8f0",
                    color: newNote.trim() && !submitting ? "#fff" : "#94a3b8",
                    cursor:
                      newNote.trim() && !submitting ? "pointer" : "not-allowed",
                  }}
                >
                  {submitting ? (
                    <>
                      <RiLoader4Line size={14} className="animate-spin" />{" "}
                      Saving…
                    </>
                  ) : (
                    <>
                      <RiSendPlaneLine size={14} /> Add Note
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        {/* ─ Details tab ─ */}
        {activeTab === "details" && (
          <div className="flex-1 overflow-y-auto">
            <div className="mx-4 mt-4 bg-white shadow-sm rounded-2xl border border-slate-100 px-4 py-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-3 pb-1">
                Contact Details
              </p>
              <DetailRow
                icon={<RiPhoneLine size={14} />}
                label="Phone"
                value={displayLead.phone}
              />
              <DetailRow
                icon={<RiMailLine size={14} />}
                label="Email"
                value={displayLead.email || "Not provided"}
              />
              <DetailRow
                icon={<RiGlobalLine size={14} />}
                label="Destination"
                value={displayLead.country ?? "Not provided"}
              />
              <DetailRow
                icon={<RiUserSmileLine size={14} />}
                label="Counselor"
                value={displayLead.counselor || "Unassigned"}
              />
              <DetailRow
                icon={<RiCalendarLine size={14} />}
                label="Follow-up"
                value={
                  displayLead.followUp
                    ? new Date(displayLead.followUp).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )
                    : "Not set"
                }
                highlight={isOverdue}
              />
              {displayLead.ieltsScore && (
                <DetailRow
                  icon={<RiAwardLine size={14} />}
                  label="IELTS Score"
                  value={`Band ${displayLead.ieltsScore}`}
                />
              )}
              {displayLead.category && (
                <DetailRow
                  icon={
                    displayLead.category === "ACADEMIC" ? (
                      <RiBookOpenLine size={14} />
                    ) : (
                      <RiBuilding2Line size={14} />
                    )
                  }
                  label="Category"
                  value={
                    displayLead.category === "ACADEMIC"
                      ? "Academic"
                      : "Admission"
                  }
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

        {/* ─ Activity tab ─ */}
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
                      {f.Icon && <f.Icon size={f.iconSize} />} {f.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-4 shrink-0 overflow-x-auto">
              {(
                [
                  "call",
                  "email",
                  "note_added",
                  "stage_change",
                ] as ActivityType[]
              ).map((type) => {
                const count = allActivity.filter((e) => e.type === type).length;
                const cfg = ACTIVITY_CONFIG[type];
                const icons: Record<string, React.ReactNode> = {
                  call: <RiPhoneFill size={10} />,
                  email: <RiMailFill size={10} />,
                  note_added: <RiStickyNoteLine size={10} />,
                  stage_change: <RiArrowRightLine size={10} />,
                };
                return (
                  <div
                    key={type}
                    className="flex items-center gap-1.5 shrink-0"
                  >
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center"
                      style={{ background: cfg.bg, color: cfg.color }}
                    >
                      {icons[type]}
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

            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
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
                      <ViewActivityCard
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
