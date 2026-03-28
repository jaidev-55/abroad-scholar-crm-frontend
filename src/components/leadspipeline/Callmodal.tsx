import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  RiPhoneLine,
  RiCloseLine,
  RiUserLine,
  RiCheckLine,
  RiTimeLine,
  RiMicLine,
  RiMicOffLine,
  RiVolumeUpLine,
  RiVolumeMuteLine,
  RiStickyNoteLine,
  RiHistoryLine,
  RiArrowLeftLine,
  RiCalendarLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiPhoneFill,
  RiStarLine,
  RiStarFill,
} from "react-icons/ri";
import type { Dayjs } from "dayjs";
import CustomDatePicker from "../common/CustomDatePicker";


// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

type CallStatus = "idle" | "calling" | "connected" | "logging" | "done";
type CallOutcome =
  | "interested"
  | "not_interested"
  | "callback"
  | "no_answer"
  | "voicemail"
  | "converted";
type CallRating = 1 | 2 | 3 | 4 | 5;

interface CallLogEntry {
  id: string;
  date: string;
  duration: number;
  outcome: CallOutcome;
  notes: string;
  rating: CallRating | null;
  author: string;
  muted: boolean;
  speakerOn: boolean;
  followUpDate: string | null;
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  country: string;
  counselor: string;
}

interface Props {
  lead: Lead | null;
  onClose: () => void;
  existingLogs?: CallLogEntry[];
  onCallLogged?: (log: CallLogEntry) => void;
}

interface CallLogFormValues {
  outcome: CallOutcome | "";
  notes: string;
  rating: CallRating | null;
  followUpDate: Dayjs | null;
}

// ═══════════════════════════════════════════════════════════════
// OUTCOME CONFIG
// ═══════════════════════════════════════════════════════════════

interface OutcomeConfig {
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
  description: string;
  showFollowUp: boolean;
}

const OUTCOME_CONFIG: Record<CallOutcome, OutcomeConfig> = {
  interested: {
    label: "Interested",
    icon: <RiCheckboxCircleLine size={14} />,
    color: "#059669",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    description: "Student is interested and wants to proceed",
    showFollowUp: true,
  },
  converted: {
    label: "Converted",
    icon: <RiStarLine size={14} />,
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
    description: "Lead successfully converted to applicant",
    showFollowUp: false,
  },
  callback: {
    label: "Schedule Callback",
    icon: <RiCalendarLine size={14} />,
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    description: "Student asked to be called back later",
    showFollowUp: true,
  },
  not_interested: {
    label: "Not Interested",
    icon: <RiCloseCircleLine size={14} />,
    color: "#ef4444",
    bg: "#fff5f5",
    border: "#fed7d7",
    description: "Student is not interested at this time",
    showFollowUp: false,
  },
  no_answer: {
    label: "No Answer",
    icon: <RiPhoneLine size={14} />,
    color: "#64748b",
    bg: "#f8fafc",
    border: "#e2e8f0",
    description: "Call was not answered",
    showFollowUp: true,
  },
  voicemail: {
    label: "Voicemail",
    icon: <RiVolumeUpLine size={14} />,
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    description: "Left a voicemail message",
    showFollowUp: true,
  },
};

// ═══════════════════════════════════════════════════════════════
// MOCK PREVIOUS CALL LOGS
// ═══════════════════════════════════════════════════════════════

function getMockLogs(lead: Lead): CallLogEntry[] {
  return [
    {
      id: "log-1",
      date: new Date(Date.now() - 3 * 86400000).toISOString(),
      duration: 274,
      outcome: "interested",
      notes:
        "Student is interested in UK universities. Mentioned budget of £20K/year. Needs IELTS guidance.",
      rating: 4,
      author: lead.counselor,
      muted: false,
      speakerOn: true,
      followUpDate: new Date(Date.now() + 2 * 86400000)
        .toISOString()
        .split("T")[0],
    },
    {
      id: "log-2",
      date: new Date(Date.now() - 7 * 86400000).toISOString(),
      duration: 0,
      outcome: "no_answer",
      notes: "",
      rating: null,
      author: lead.counselor,
      muted: false,
      speakerOn: false,
      followUpDate: null,
    },
    {
      id: "log-3",
      date: new Date(Date.now() - 10 * 86400000).toISOString(),
      duration: 664,
      outcome: "callback",
      notes:
        "Busy with exams. Asked to call back after the 22nd. Interested in Canada and UK.",
      rating: 3,
      author: lead.counselor,
      muted: false,
      speakerOn: false,
      followUpDate: new Date(Date.now() - 3 * 86400000)
        .toISOString()
        .split("T")[0],
    },
  ];
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

function formatDuration(s: number): string {
  if (s === 0) return "—";
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m ${String(sec).padStart(2, "0")}s` : `${sec}s`;
}

function formatTimer(s: number): string {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d} days ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

const UserAvatar: React.FC<{ name: string; size?: number }> = ({
  name,
  size = 48,
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

// ═══════════════════════════════════════════════════════════════
// STAR RATING
// ═══════════════════════════════════════════════════════════════

const StarRating: React.FC<{
  value: CallRating | null;
  onChange: (v: CallRating) => void;
}> = ({ value, onChange }) => (
  <div className="flex items-center gap-1">
    {([1, 2, 3, 4, 5] as CallRating[]).map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        className="border-none bg-transparent cursor-pointer p-0.5 outline-none transition-transform hover:scale-110"
      >
        {value !== null && star <= value ? (
          <RiStarFill size={18} color="#f59e0b" />
        ) : (
          <RiStarLine size={18} color="#cbd5e1" />
        )}
      </button>
    ))}
    {value && (
      <span className="text-xs font-semibold text-slate-500 ml-1">
        {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][value]}
      </span>
    )}
  </div>
);

// ═══════════════════════════════════════════════════════════════
// LOG HISTORY ENTRY
// ═══════════════════════════════════════════════════════════════

const LogEntry: React.FC<{ log: CallLogEntry }> = ({ log }) => {
  const [expanded, setExpanded] = useState(false);
  const outcome = OUTCOME_CONFIG[log.outcome];

  return (
    <div
      className="bg-white rounded-xl border border-slate-100 overflow-hidden cursor-pointer hover:border-slate-200 hover:shadow-sm transition-all duration-150"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: outcome.bg, color: outcome.color }}
        >
          {outcome.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-md"
              style={{ background: outcome.bg, color: outcome.color }}
            >
              {outcome.label}
            </span>
            {log.duration > 0 && (
              <span className="flex items-center gap-0.5 text-[11px] text-slate-400 font-medium">
                <RiTimeLine size={10} /> {formatDuration(log.duration)}
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
            <RiCalendarLine size={10} /> {timeAgo(log.date)} · {log.author}
          </p>
        </div>
        {log.rating && (
          <div className="flex items-center gap-0.5 shrink-0">
            {([1, 2, 3, 4, 5] as CallRating[]).map((s) => (
              <span key={s}>
                {s <= log.rating! ? (
                  <RiStarFill size={11} color="#f59e0b" />
                ) : (
                  <RiStarLine size={11} color="#e2e8f0" />
                )}
              </span>
            ))}
          </div>
        )}
        <span className="text-[10px] text-slate-300 ml-1">
          {expanded ? "▲" : "▼"}
        </span>
      </div>

      <div
        className="overflow-hidden transition-all duration-200"
        style={{ maxHeight: expanded ? 160 : 0 }}
      >
        <div className="px-4 pb-3 border-t border-slate-50 pt-2 space-y-1.5">
          {log.notes ? (
            <p className="text-[12px] text-slate-500 leading-relaxed">
              {log.notes}
            </p>
          ) : (
            <p className="text-[12px] text-slate-300 italic">
              No notes recorded.
            </p>
          )}
          {log.followUpDate && (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 w-fit">
              <RiCalendarLine size={11} />
              Follow-up:{" "}
              {new Date(log.followUpDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN CALL MODAL
// ═══════════════════════════════════════════════════════════════

const CallModal: React.FC<Props> = ({
  lead,
  onClose,
  existingLogs,
  onCallLogged,
}) => {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [view, setView] = useState<"call" | "history">("call");

  // Log form (non-hook-form fields)
  const [outcome, setOutcome] = useState<CallOutcome | null>(null);
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState<CallRating | null>(null);

  // react-hook-form for the follow-up date (using CustomDatePicker)
  const {
    control,
    formState: { errors },
    watch,
    reset: resetForm,
    setValue,
  } = useForm<CallLogFormValues>({
    defaultValues: {
      outcome: "",
      notes: "",
      rating: null,
      followUpDate: null,
    },
  });

  const followUpDateValue = watch("followUpDate");

  const [logs, setLogs] = useState<CallLogEntry[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finalDuration = useRef(0);

  // Show follow-up date field based on selected outcome
  const showFollowUpDate =
    outcome !== null && OUTCOME_CONFIG[outcome].showFollowUp;

  // Is follow-up required for callback outcome
  const isFollowUpRequired = outcome === "callback";

  useEffect(() => {
    if (lead) {
      setLogs(existingLogs ?? getMockLogs(lead));
      setStatus("idle");
      setSeconds(0);
      setOutcome(null);
      setNotes("");
      setRating(null);
      setMuted(false);
      setSpeaker(false);
      setView("call");
      resetForm();
    }
  }, [lead, existingLogs, resetForm]);

  useEffect(() => {
    if (status === "connected") {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  if (!lead) return null;

  const startCall = () => {
    setStatus("calling");
    setTimeout(() => setStatus("connected"), 2200);
  };

  const endCall = () => {
    finalDuration.current = seconds;
    setStatus("logging");
  };

  const canSubmit =
    outcome !== null && (!isFollowUpRequired || followUpDateValue !== null);

  const submitLog = () => {
    if (!outcome || !canSubmit) return;

    const newLog: CallLogEntry = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString(),
      duration: finalDuration.current,
      outcome,
      notes,
      rating,
      author: lead.counselor,
      muted,
      speakerOn: speaker,
      followUpDate: followUpDateValue
        ? (followUpDateValue as Dayjs).format("YYYY-MM-DD")
        : null,
    };
    setLogs((prev) => [newLog, ...prev]);
    onCallLogged?.(newLog);
    setStatus("done");
    setTimeout(() => onClose(), 2000);
  };

  // Summary stats
  const totalCalls = logs.length;
  const answeredCalls = logs.filter((l) => l.duration > 0).length;
  const avgDuration =
    answeredCalls > 0
      ? Math.round(
          logs
            .filter((l) => l.duration > 0)
            .reduce((a, l) => a + l.duration, 0) / answeredCalls,
        )
      : 0;
  const conversions = logs.filter(
    (l) => l.outcome === "converted" || l.outcome === "interested",
  ).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(15,23,42,0.48)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <style>{`
        @keyframes callRing  { 0%,100%{transform:scale(1);opacity:0.5} 50%{transform:scale(1.5);opacity:0} }
        @keyframes modalUp   { from{opacity:0;transform:translateY(18px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
      `}</style>

      <div
        className="bg-white w-full flex flex-col overflow-hidden"
        style={{
          maxWidth: 420,
          maxHeight: "90vh",
          borderRadius: 24,
          boxShadow:
            "0 24px 60px rgba(15,23,42,0.22), 0 0 0 1px rgba(15,23,42,0.06)",
          animation: "modalUp 0.22s cubic-bezier(0.34,1.4,0.64,1)",
        }}
      >
        {/* ── TOP BAR ── */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-50 flex items-center justify-center">
              <RiPhoneFill size={13} color="#059669" />
            </div>
            <span className="text-xs font-bold text-slate-700">
              {status === "idle"
                ? "Call Student"
                : status === "calling"
                  ? "Calling…"
                  : status === "connected"
                    ? "Live Call"
                    : status === "logging"
                      ? "Log This Call"
                      : "Call Logged ✓"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {(status === "idle" || status === "done") && (
              <button
                onClick={() => setView(view === "call" ? "history" : "call")}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 cursor-pointer outline-none transition-colors"
              >
                {view === "history" ? (
                  <>
                    <RiArrowLeftLine size={11} /> Back
                  </>
                ) : (
                  <>
                    <RiHistoryLine size={11} /> History ({totalCalls})
                  </>
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 border-none bg-transparent cursor-pointer outline-none transition-colors"
            >
              <RiCloseLine size={15} />
            </button>
          </div>
        </div>

        {/* ═══════════════ HISTORY VIEW ═══════════════ */}
        {view === "history" && (
          <div
            className="flex flex-col overflow-hidden flex-1 min-h-0"
            style={{ animation: "fadeIn 0.15s ease" }}
          >
            <div className="px-5 pb-3 shrink-0">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Total Calls", value: totalCalls, color: "#2563eb" },
                  {
                    label: "Avg Duration",
                    value: formatDuration(avgDuration),
                    color: "#059669",
                  },
                  {
                    label: "Conversions",
                    value: conversions,
                    color: "#f59e0b",
                  },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100"
                  >
                    <p
                      className="text-base font-extrabold leading-none"
                      style={{ color }}
                    >
                      {value}
                    </p>
                    <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide mt-1">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-5 pb-3 shrink-0">
              <div className="flex gap-1.5 flex-wrap">
                {(
                  Object.entries(OUTCOME_CONFIG) as [
                    CallOutcome,
                    OutcomeConfig,
                  ][]
                ).map(([key, cfg]) => {
                  const count = logs.filter((l) => l.outcome === key).length;
                  if (count === 0) return null;
                  return (
                    <span
                      key={key}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border"
                      style={{
                        background: cfg.bg,
                        color: cfg.color,
                        borderColor: cfg.border,
                      }}
                    >
                      {cfg.icon} {cfg.label} · {count}
                    </span>
                  );
                })}
              </div>
            </div>

            <div
              className="flex-1 overflow-y-auto px-5 pb-5 flex flex-col gap-2.5"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#e2e8f0 transparent",
              }}
            >
              {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                    <RiHistoryLine size={22} className="text-slate-300" />
                  </div>
                  <p className="text-sm font-semibold text-slate-500">
                    No call history yet
                  </p>
                </div>
              ) : (
                logs.map((log) => <LogEntry key={log.id} log={log} />)
              )}
            </div>
          </div>
        )}

        {/* ═══════════════ CALL VIEW ═══════════════ */}
        {view === "call" && (
          <>
            {/* ── IDLE / CALLING / CONNECTED ── */}
            {(status === "idle" ||
              status === "calling" ||
              status === "connected") && (
              <div className="flex flex-col items-center px-5 pb-2 pt-2 shrink-0">
                <div className="relative mb-4">
                  {status === "calling" && (
                    <>
                      <div
                        className="absolute -inset-4 rounded-[28px] opacity-20"
                        style={{
                          background: "#059669",
                          animation: "callRing 1.4s ease-in-out infinite",
                        }}
                      />
                      <div
                        className="absolute -inset-2 rounded-[24px] opacity-15"
                        style={{
                          background: "#059669",
                          animation: "callRing 1.4s ease-in-out 0.4s infinite",
                        }}
                      />
                    </>
                  )}
                  {status === "connected" && (
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center z-10">
                      <RiCheckLine size={11} color="#fff" />
                    </div>
                  )}
                  <UserAvatar name={lead.name} size={76} />
                </div>

                <h2 className="text-lg font-bold text-slate-900">
                  {lead.name}
                </h2>
                <p className="text-sm text-slate-400 font-medium mt-0.5">
                  {lead.phone}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <RiUserLine size={10} /> {lead.counselor}
                </p>

                {status === "connected" && (
                  <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-base font-bold text-emerald-600 tabular-nums tracking-widest">
                      {formatTimer(seconds)}
                    </span>
                  </div>
                )}

                {status === "connected" && (
                  <div className="flex items-center gap-4 mt-5">
                    <button
                      onClick={() => setMuted(!muted)}
                      className="flex flex-col items-center gap-1 cursor-pointer border-none bg-transparent outline-none"
                    >
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all"
                        style={{
                          background: muted ? "#fee2e2" : "#f1f5f9",
                          color: muted ? "#ef4444" : "#64748b",
                        }}
                      >
                        {muted ? (
                          <RiMicOffLine size={20} />
                        ) : (
                          <RiMicLine size={20} />
                        )}
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {muted ? "Unmute" : "Mute"}
                      </span>
                    </button>

                    <button
                      onClick={endCall}
                      className="flex flex-col items-center gap-1 cursor-pointer border-none bg-transparent outline-none"
                    >
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-105"
                        style={{
                          background: "#ef4444",
                          boxShadow: "0 6px 20px rgba(239,68,68,0.4)",
                        }}
                      >
                        <RiPhoneLine
                          size={26}
                          color="#fff"
                          style={{ transform: "rotate(135deg)" }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400">
                        End
                      </span>
                    </button>

                    <button
                      onClick={() => setSpeaker(!speaker)}
                      className="flex flex-col items-center gap-1 cursor-pointer border-none bg-transparent outline-none"
                    >
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all"
                        style={{
                          background: speaker ? "#eff6ff" : "#f1f5f9",
                          color: speaker ? "#2563eb" : "#64748b",
                        }}
                      >
                        {speaker ? (
                          <RiVolumeUpLine size={20} />
                        ) : (
                          <RiVolumeMuteLine size={20} />
                        )}
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {speaker ? "Speaker" : "Earpiece"}
                      </span>
                    </button>
                  </div>
                )}

                {status === "idle" && (
                  <button
                    onClick={startCall}
                    className="mt-5 w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white text-sm font-bold border-none cursor-pointer transition-all"
                    style={{
                      background: "#059669",
                      boxShadow: "0 4px 16px rgba(5,150,105,0.32)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#047857")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#059669")
                    }
                  >
                    <RiPhoneLine size={17} /> Call {lead.name.split(" ")[0]}
                  </button>
                )}

                {status === "calling" && (
                  <div className="mt-5 w-full flex flex-col items-center gap-3">
                    <p className="text-xs text-slate-400 animate-pulse">
                      Dialing {lead.phone}…
                    </p>
                    <button
                      onClick={() => {
                        setStatus("idle");
                        setSeconds(0);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-white text-sm font-bold border-none cursor-pointer"
                      style={{
                        background: "#ef4444",
                        boxShadow: "0 4px 14px rgba(239,68,68,0.3)",
                      }}
                    >
                      <RiCloseLine size={16} /> Cancel
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── LOG FORM ── */}
            {status === "logging" && (
              <div
                className="flex-1 overflow-y-auto px-5 pb-5 flex flex-col gap-4"
                style={{
                  animation: "fadeIn 0.18s ease",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#e2e8f0 transparent",
                }}
              >
                {/* Duration recap */}
                <div className="flex items-center gap-3 bg-slate-50 rounded-2xl border border-slate-100 p-4">
                  <UserAvatar name={lead.name} size={40} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800">
                      {lead.name}
                    </p>
                    <p className="text-xs text-slate-400">{lead.phone}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-slate-700 flex items-center gap-1 justify-end">
                      <RiTimeLine size={11} color="#059669" />
                      <span style={{ color: "#059669" }}>
                        {formatDuration(finalDuration.current)}
                      </span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Call duration
                    </p>
                  </div>
                </div>

                {/* Outcome picker */}
                <div>
                  <p className="text-xs font-bold text-slate-700 mb-2">
                    Call Outcome <span className="text-rose-400">*</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      Object.entries(OUTCOME_CONFIG) as [
                        CallOutcome,
                        OutcomeConfig,
                      ][]
                    ).map(([key, cfg]) => {
                      const sel = outcome === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setOutcome(key);
                            // Clear follow-up date when switching to an outcome that doesn't need it
                            if (!cfg.showFollowUp) {
                              setValue("followUpDate", null);
                            }
                          }}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left cursor-pointer outline-none transition-all duration-150 border-2"
                          style={{
                            background: sel ? cfg.bg : "#fafbfc",
                            borderColor: sel ? cfg.color : "#e8edf2",
                            color: sel ? cfg.color : "#64748b",
                            boxShadow: sel
                              ? `0 2px 8px ${cfg.color}22`
                              : "none",
                          }}
                        >
                          <span
                            className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                            style={{
                              background: sel ? cfg.color : "#f1f5f9",
                              color: sel ? "#fff" : "#94a3b8",
                            }}
                          >
                            {cfg.icon}
                          </span>
                          <span className="text-[11px] font-bold leading-tight">
                            {cfg.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {outcome && (
                    <p className="text-[11px] text-slate-400 mt-1.5 ml-1 italic">
                      {OUTCOME_CONFIG[outcome].description}
                    </p>
                  )}
                </div>

                {/* ── FOLLOW-UP DATE (CustomDatePicker) ── */}
                {showFollowUpDate && (
                  <div
                    className="rounded-xl border p-3.5 transition-all duration-200"
                    style={{
                      borderColor:
                        outcome === "callback" ? "#fde68a" : "#e2e8f0",
                      background:
                        outcome === "callback" ? "#fffbeb" : "#fafbfc",
                      animation: "fadeIn 0.2s ease",
                    }}
                  >
                    <CustomDatePicker
                      name="followUpDate"
                      label={
                        outcome === "callback"
                          ? "Callback Date & Time"
                          : "Follow-up Date"
                      }
                      placeholder={
                        outcome === "callback"
                          ? "When should we call back?"
                          : "Schedule next follow-up"
                      }
                      showTime={outcome === "callback"}
                      required={isFollowUpRequired}
                      control={control}
                      errors={errors}
                      rules={
                        isFollowUpRequired
                          ? { required: "Callback date is required" }
                          : undefined
                      }
                    />
                    {outcome === "callback" && (
                      <p className="text-[10px] text-amber-600 mt-2 flex items-center gap-1">
                        <RiCalendarLine size={10} />A follow-up task will be
                        auto-created for the counselor
                      </p>
                    )}
                  </div>
                )}

                {/* Notes */}
                <div>
                  <p className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                    <RiStickyNoteLine size={12} color="#64748b" /> Call Notes
                  </p>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="What was discussed? Any key details, follow-up actions, student concerns…"
                    rows={4}
                    className="w-full outline-none resize-none text-[12.5px] text-slate-700 placeholder:text-slate-300 leading-relaxed"
                    style={{
                      border: "1.5px solid #e8edf2",
                      borderRadius: 12,
                      padding: "10px 12px",
                      fontFamily: "inherit",
                      background: "#fafbfc",
                      transition: "border-color 0.15s",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#2563eb")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "#e8edf2")
                    }
                  />
                </div>

                {/* Rating */}
                <div>
                  <p className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                    <RiStarLine size={12} color="#64748b" /> Call Quality
                  </p>
                  <StarRating value={rating} onChange={setRating} />
                </div>

                {/* Submit */}
                <button
                  type="button"
                  onClick={submitLog}
                  disabled={!canSubmit}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white text-sm font-bold border-none cursor-pointer outline-none transition-all"
                  style={{
                    background: canSubmit ? "#2563eb" : "#94a3b8",
                    cursor: canSubmit ? "pointer" : "not-allowed",
                    boxShadow: canSubmit
                      ? "0 4px 14px rgba(37,99,235,0.28)"
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (canSubmit) e.currentTarget.style.background = "#1d4ed8";
                  }}
                  onMouseLeave={(e) => {
                    if (canSubmit) e.currentTarget.style.background = "#2563eb";
                  }}
                >
                  <RiCheckLine size={16} /> Save Call Log
                </button>
              </div>
            )}

            {/* ── DONE ── */}
            {status === "done" && (
              <div
                className="flex flex-col items-center justify-center px-5 pb-8 pt-4"
                style={{ animation: "fadeIn 0.2s ease" }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{
                    background: "#f0fdf4",
                    boxShadow: "0 0 0 8px #dcfce7",
                  }}
                >
                  <RiCheckboxCircleLine size={36} color="#059669" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Call logged successfully!
                </h3>
                <p className="text-xs text-slate-400 mt-1 text-center">
                  The call has been saved to {lead.name}'s activity history.
                </p>

                {outcome && (
                  <div
                    className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl border"
                    style={{
                      background: OUTCOME_CONFIG[outcome].bg,
                      borderColor: OUTCOME_CONFIG[outcome].border,
                      color: OUTCOME_CONFIG[outcome].color,
                    }}
                  >
                    {OUTCOME_CONFIG[outcome].icon}
                    <span className="text-xs font-bold">
                      {OUTCOME_CONFIG[outcome].label}
                    </span>
                    {finalDuration.current > 0 && (
                      <span className="text-xs opacity-70">
                        · {formatDuration(finalDuration.current)}
                      </span>
                    )}
                  </div>
                )}

                {followUpDateValue && (
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                    <RiCalendarLine size={12} />
                    Follow-up scheduled:{" "}
                    {(followUpDateValue as Dayjs).format("MMM D, YYYY")}
                    {outcome === "callback" &&
                      ` at ${(followUpDateValue as Dayjs).format("h:mm A")}`}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CallModal;
