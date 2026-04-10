import React, { useState, useEffect, useRef, useMemo } from "react";
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
  RiLoader4Line,
} from "react-icons/ri";
import type { Dayjs } from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import {
  getCallLogs,
  type ApiCallLog,
  type CallOutcomeApi,
} from "../api/leads";
import CustomDatePicker from "../../../components/common/CustomDatePicker";

// ─── Types ────────────────────────────────────────────
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
  onCallLogged?: (log: CallLogEntry) => void;
}
interface CallLogFormValues {
  outcome: CallOutcome | "";
  notes: string;
  rating: CallRating | null;
  followUpDate: Dayjs | null;
}
interface OutcomeConfig {
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
  badgeCls: string;
  ringCls: string;
  description: string;
  showFollowUp: boolean;
}

// ─── Config ───────────────────────────────────────────
const OUTCOME_CONFIG: Record<CallOutcome, OutcomeConfig> = {
  interested: {
    label: "Interested",
    icon: <RiCheckboxCircleLine size={14} />,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    badgeCls: "bg-emerald-50 text-emerald-700",
    ringCls: "ring-emerald-300",
    description: "Student wants to proceed",
    showFollowUp: true,
  },
  converted: {
    label: "Converted",
    icon: <RiStarLine size={14} />,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    badgeCls: "bg-blue-50 text-blue-700",
    ringCls: "ring-blue-300",
    description: "Lead converted to applicant",
    showFollowUp: false,
  },
  callback: {
    label: "Schedule Callback",
    icon: <RiCalendarLine size={14} />,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    badgeCls: "bg-amber-50 text-amber-700",
    ringCls: "ring-amber-300",
    description: "Student asked to call back later",
    showFollowUp: true,
  },
  not_interested: {
    label: "Not Interested",
    icon: <RiCloseCircleLine size={14} />,
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-200",
    badgeCls: "bg-red-50 text-red-600",
    ringCls: "ring-red-300",
    description: "Student is not interested",
    showFollowUp: false,
  },
  no_answer: {
    label: "No Answer",
    icon: <RiPhoneLine size={14} />,
    color: "text-slate-500",
    bg: "bg-slate-50",
    border: "border-slate-200",
    badgeCls: "bg-slate-100 text-slate-600",
    ringCls: "ring-slate-300",
    description: "Call was not answered",
    showFollowUp: true,
  },
  voicemail: {
    label: "Voicemail",
    icon: <RiVolumeUpLine size={14} />,
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    badgeCls: "bg-violet-50 text-violet-700",
    ringCls: "ring-violet-300",
    description: "Left a voicemail message",
    showFollowUp: true,
  },
};

const OUTCOME_TO_API: Record<CallOutcome, CallOutcomeApi> = {
  interested: "INTERESTED",
  not_interested: "NOT_INTERESTED",
  callback: "SCHEDULE_CALLBACK",
  no_answer: "NO_ANSWER",
  voicemail: "VOICEMAIL",
  converted: "CONVERTED",
};
const API_TO_OUTCOME: Partial<Record<CallOutcomeApi, CallOutcome>> = {
  INTERESTED: "interested",
  NOT_INTERESTED: "not_interested",
  SCHEDULE_CALLBACK: "callback",
  NO_ANSWER: "no_answer",
  VOICEMAIL: "voicemail",
  CONVERTED: "converted",
};

// ─── Helpers ──────────────────────────────────────────
function mapApiCallLog(a: ApiCallLog, fallback: string): CallLogEntry {
  const api = a.meta?.outcome;
  return {
    id: a.id,
    date: a.createdAt,
    duration: a.meta?.duration ?? 0,
    outcome: (api ? API_TO_OUTCOME[api] : undefined) ?? "no_answer",
    notes: a.meta?.notes ?? "",
    rating: (a.meta?.rating as CallRating) ?? null,
    author: a.user?.name ?? fallback,
    muted: false,
    speakerOn: false,
    followUpDate: a.meta?.followUpDate
      ? a.meta.followUpDate.split("T")[0]
      : null,
  };
}
function formatDuration(s: number) {
  if (!s) return "—";
  const m = Math.floor(s / 60),
    sec = s % 60;
  return m ? `${m}m ${String(sec).padStart(2, "0")}s` : `${sec}s`;
}
function formatTimer(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}
function timeAgo(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (!d) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// ─── Avatar ───────────────────────────────────────────
const UserAvatar: React.FC<{ name: string; size?: number }> = ({
  name,
  size = 48,
}) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const hue = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div
      className="flex items-center justify-center font-bold shrink-0 select-none rounded-2xl"
      style={{
        width: size,
        height: size,
        background: `hsl(${hue},55%,90%)`,
        color: `hsl(${hue},45%,35%)`,
        fontSize: size * 0.35,
      }}
    >
      {initials}
    </div>
  );
};

// ─── Star Rating ──────────────────────────────────────
const StarRating: React.FC<{
  value: CallRating | null;
  onChange: (v: CallRating) => void;
}> = ({ value, onChange }) => (
  <div className="flex items-center gap-1.5">
    {([1, 2, 3, 4, 5] as CallRating[]).map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        className="border-none bg-transparent cursor-pointer p-0.5 outline-none transition-transform hover:scale-110 active:scale-95"
      >
        {value !== null && star <= value ? (
          <RiStarFill size={20} className="text-amber-400" />
        ) : (
          <RiStarLine size={20} className="text-slate-300" />
        )}
      </button>
    ))}
    {value && (
      <span className="text-xs font-semibold text-amber-600 ml-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
        {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][value]}
      </span>
    )}
  </div>
);

// ─── Log Entry ────────────────────────────────────────
const LogEntry: React.FC<{ log: CallLogEntry }> = ({ log }) => {
  const [expanded, setExpanded] = useState(false);
  const cfg = OUTCOME_CONFIG[log.outcome];
  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden cursor-pointer hover:border-slate-200 hover:shadow-sm transition-all duration-150"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${cfg.bg} ${cfg.color} ${cfg.border}`}
        >
          {cfg.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${cfg.badgeCls}`}
            >
              {cfg.label}
            </span>
            {log.duration > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                <RiTimeLine size={10} /> {formatDuration(log.duration)}
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
            <RiCalendarLine size={10} /> {timeAgo(log.date)} · {log.author}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {log.rating && (
            <div className="flex items-center gap-0.5">
              {([1, 2, 3, 4, 5] as CallRating[]).map((s) => (
                <span key={s}>
                  {s <= log.rating! ? (
                    <RiStarFill size={10} className="text-amber-400" />
                  ) : (
                    <RiStarLine size={10} className="text-slate-200" />
                  )}
                </span>
              ))}
            </div>
          )}
          <span className="text-[9px] text-slate-300">
            {expanded ? "▲" : "▼"}
          </span>
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all duration-200 ${expanded ? "max-h-40" : "max-h-0"}`}
      >
        <div className="px-4 pb-3 border-t border-slate-50 pt-2.5 space-y-2">
          {log.notes ? (
            <p className="text-[12px] text-slate-600 leading-relaxed">
              {log.notes}
            </p>
          ) : (
            <p className="text-[12px] text-slate-300 italic">
              No notes recorded.
            </p>
          )}
          {log.followUpDate && (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100 w-fit">
              <RiCalendarLine size={10} />
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

// ─── MAIN COMPONENT ───────────────────────────────────
const CallModal: React.FC<Props> = ({ lead, onClose, onCallLogged }) => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<CallStatus>("idle");
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [view, setView] = useState<"call" | "history">("call");
  const [outcome, setOutcome] = useState<CallOutcome | null>(null);
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState<CallRating | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finalDuration = useRef(0);

  const {
    control,
    formState: { errors },
    watch,
    reset: resetForm,
    setValue,
  } = useForm<CallLogFormValues>({
    defaultValues: { outcome: "", notes: "", rating: null, followUpDate: null },
  });
  const followUpDateValue = watch("followUpDate");
  const showFollowUpDate =
    outcome !== null && OUTCOME_CONFIG[outcome].showFollowUp;
  const isFollowUpRequired = outcome === "callback";
  const canSubmit =
    outcome !== null && (!isFollowUpRequired || followUpDateValue !== null);

  // ── Real API data ─────────────────────────────────
  const { data: callLogsData, isLoading: logsLoading } = useQuery({
    queryKey: ["call-logs", lead?.id],
    queryFn: () => getCallLogs(lead!.id),
    enabled: !!lead?.id,
  });

  const logs = useMemo(
    () =>
      (callLogsData?.calls ?? []).map((c) =>
        mapApiCallLog(c, lead?.counselor ?? ""),
      ),
    [callLogsData, lead?.counselor],
  );

  const totalCalls = callLogsData?.summary.totalCalls ?? 0;
  const avgDuration = callLogsData?.summary.avgDurationSeconds ?? 0;
  const conversions = callLogsData?.summary.conversions ?? 0;
  const outcomeCounts = callLogsData?.summary.outcomeCounts ?? {};

  useEffect(() => {
    if (lead) {
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
  }, [lead, resetForm]);

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

  const { mutate: submitCallLog, isPending: isSubmitting } = useMutation({
    mutationFn: () => {
      if (!outcome || !lead) throw new Error("Missing data");
      return logCall(lead.id, {
        outcome: OUTCOME_TO_API[outcome],
        notes: notes.trim() || undefined,
        duration: finalDuration.current,
        rating: rating ?? null,
        followUpDate: followUpDateValue
          ? (followUpDateValue as Dayjs).toISOString()
          : null,
      });
    },
    onSuccess: (response) => {
      if (!outcome) return;
      onCallLogged?.({
        id: response.id,
        date: response.createdAt,
        duration: response.duration,
        outcome,
        notes: response.notes ?? "",
        rating: (response.rating as CallRating) ?? null,
        author: lead!.counselor,
        muted,
        speakerOn: speaker,
        followUpDate: response.followUpDate
          ? response.followUpDate.split("T")[0]
          : null,
      });
      queryClient.invalidateQueries({ queryKey: ["call-logs", lead!.id] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["lead-activity", lead!.id] });
      queryClient.invalidateQueries({ queryKey: ["lead", lead!.id] });
      setStatus("done");
      setTimeout(() => onClose(), 2200);
    },
    onError: (error: unknown) => {
      const e = error as { response?: { data?: { message?: string } } };
      message.error(
        e?.response?.data?.message ?? "Failed to log call. Please try again.",
      );
    },
  });

  if (!lead) return null;

  const statusLabel = {
    idle: "Call Student",
    calling: "Calling…",
    connected: "Live Call",
    logging: "Log This Call",
    done: "Call Logged ✓",
  }[status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md">
      <style>{`
        @keyframes callRing  { 0%,100%{transform:scale(1);opacity:0.3} 50%{transform:scale(1.7);opacity:0} }
        @keyframes modalUp   { from{opacity:0;transform:translateY(20px) scale(0.96)} to{opacity:1;transform:none} }
        @keyframes fadeSlide { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        @keyframes pulseGreen{ 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0.5)} 70%{box-shadow:0 0 0 10px rgba(16,185,129,0)} }
      `}</style>

      <div
        className="bg-white w-full flex flex-col overflow-hidden rounded-3xl shadow-2xl ring-1 ring-slate-900/5"
        style={{
          maxWidth: 440,
          maxHeight: "92vh",
          animation: "modalUp 0.24s cubic-bezier(0.34,1.4,0.64,1)",
        }}
      >
        {/* ── TOP BAR ── */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 shrink-0 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <RiPhoneFill size={14} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-800 leading-tight">
                {statusLabel}
              </p>
              <p className="text-[10px] text-slate-400 leading-tight">
                {lead.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {(status === "idle" || status === "done") && (
              <button
                onClick={() =>
                  setView((v) => (v === "call" ? "history" : "call"))
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 cursor-pointer outline-none transition-all"
              >
                {view === "history" ? (
                  <>
                    <RiArrowLeftLine size={11} /> Back
                  </>
                ) : (
                  <>
                    <RiHistoryLine size={11} /> History
                    <span className="bg-slate-200 text-slate-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-0.5">
                      {logsLoading ? "…" : totalCalls}
                    </span>
                  </>
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 border-none bg-transparent cursor-pointer outline-none transition-all"
            >
              <RiCloseLine size={16} />
            </button>
          </div>
        </div>

        {/* ═══════════ HISTORY VIEW ═══════════ */}
        {view === "history" && (
          <div
            className="flex flex-col overflow-hidden flex-1 min-h-0"
            style={{ animation: "fadeSlide 0.15s ease" }}
          >
            {/* Stats */}
            <div className="px-5 pt-4 pb-3 shrink-0">
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    label: "Total Calls",
                    value: logsLoading ? "…" : totalCalls,
                    cls: "text-blue-600",
                    bg: "bg-blue-50",
                  },
                  {
                    label: "Avg Duration",
                    value: logsLoading ? "…" : formatDuration(avgDuration),
                    cls: "text-emerald-600",
                    bg: "bg-emerald-50",
                  },
                  {
                    label: "Conversions",
                    value: logsLoading ? "…" : conversions,
                    cls: "text-amber-600",
                    bg: "bg-amber-50",
                  },
                ].map(({ label, value, cls, bg }) => (
                  <div
                    key={label}
                    className={`${bg} rounded-2xl p-3 text-center border border-slate-100`}
                  >
                    <p className={`text-lg font-extrabold leading-none ${cls}`}>
                      {value}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Outcome breakdown */}
            <div className="px-5 pb-3 shrink-0">
              <div className="flex gap-1.5 flex-wrap">
                {(
                  Object.entries(outcomeCounts) as [CallOutcomeApi, number][]
                ).map(([apiKey, count]) => {
                  const localKey = API_TO_OUTCOME[apiKey];
                  if (!localKey || !count) return null;
                  const cfg = OUTCOME_CONFIG[localKey];
                  return (
                    <span
                      key={apiKey}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border ${cfg.bg} ${cfg.color} ${cfg.border}`}
                    >
                      {cfg.icon} {cfg.label} · {count}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Log list */}
            <div
              className="flex-1 overflow-y-auto px-5 pb-5 flex flex-col gap-2.5"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#e2e8f0 transparent",
              }}
            >
              {logsLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <RiLoader4Line
                    size={24}
                    className="animate-spin text-slate-300 mb-3"
                  />
                  <p className="text-[12px] text-slate-400">
                    Loading call history…
                  </p>
                </div>
              ) : logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                    <RiHistoryLine size={22} className="text-slate-300" />
                  </div>
                  <p className="text-[13px] font-semibold text-slate-400">
                    No call history yet
                  </p>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Logs will appear after calls
                  </p>
                </div>
              ) : (
                logs.map((log) => <LogEntry key={log.id} log={log} />)
              )}
            </div>
          </div>
        )}

        {/* ═══════════ CALL VIEW ═══════════ */}
        {view === "call" && (
          <>
            {/* ── IDLE / CALLING / CONNECTED ── */}
            {(status === "idle" ||
              status === "calling" ||
              status === "connected") && (
              <div className="flex flex-col items-center px-6 pb-6 pt-5 shrink-0">
                <div className="relative mb-5">
                  {status === "calling" && (
                    <>
                      <div
                        className="absolute -inset-5 rounded-3xl bg-emerald-500 opacity-20"
                        style={{
                          animation: "callRing 1.5s ease-in-out infinite",
                        }}
                      />
                      <div
                        className="absolute -inset-3 rounded-3xl bg-emerald-500 opacity-15"
                        style={{
                          animation: "callRing 1.5s ease-in-out 0.5s infinite",
                        }}
                      />
                    </>
                  )}
                  {status === "connected" && (
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center z-10">
                      <RiCheckLine size={11} className="text-white" />
                    </div>
                  )}
                  <UserAvatar name={lead.name} size={84} />
                </div>

                <h2 className="text-[18px] font-bold text-slate-900">
                  {lead.name}
                </h2>
                <p className="text-[13px] text-slate-400 font-medium mt-0.5">
                  {lead.phone}
                </p>
                <div className="flex items-center gap-1.5 mt-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                  <RiUserLine size={10} className="text-slate-400" />
                  <span className="text-[11px] text-slate-500 font-medium">
                    {lead.counselor}
                  </span>
                </div>

                {status === "connected" && (
                  <div className="mt-4 flex items-center gap-2.5 px-6 py-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <div
                      className="w-2 h-2 rounded-full bg-emerald-500"
                      style={{ animation: "pulseGreen 1.5s infinite" }}
                    />
                    <span className="text-2xl font-bold text-emerald-600 tabular-nums tracking-widest">
                      {formatTimer(seconds)}
                    </span>
                  </div>
                )}

                {status === "connected" && (
                  <div className="flex items-center gap-6 mt-7">
                    <button
                      onClick={() => setMuted(!muted)}
                      className="flex flex-col items-center gap-1.5 cursor-pointer border-none bg-transparent outline-none group"
                    >
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-105 ${muted ? "bg-red-100 text-red-500" : "bg-slate-100 text-slate-500"}`}
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
                      onClick={() => {
                        finalDuration.current = seconds;
                        setStatus("logging");
                      }}
                      className="flex flex-col items-center gap-1.5 cursor-pointer border-none bg-transparent outline-none group"
                    >
                      <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-200 transition-all group-hover:scale-105 group-active:scale-95">
                        <RiPhoneLine
                          size={26}
                          className="text-white rotate-[135deg]"
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400">
                        End Call
                      </span>
                    </button>

                    <button
                      onClick={() => setSpeaker(!speaker)}
                      className="flex flex-col items-center gap-1.5 cursor-pointer border-none bg-transparent outline-none group"
                    >
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-105 ${speaker ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}
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
                    onClick={() => {
                      setStatus("calling");
                      setTimeout(() => setStatus("connected"), 2200);
                    }}
                    className="mt-7 w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white text-[13px] font-bold border-none cursor-pointer bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-200 hover:opacity-90 active:scale-95 transition-all outline-none"
                  >
                    <RiPhoneLine size={16} /> Call {lead.name.split(" ")[0]}
                  </button>
                )}

                {status === "calling" && (
                  <div className="mt-7 w-full flex flex-col items-center gap-3">
                    <p className="text-[12px] text-slate-400 animate-pulse font-medium">
                      Dialing {lead.phone}…
                    </p>
                    <button
                      onClick={() => {
                        setStatus("idle");
                        setSeconds(0);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white text-[13px] font-bold border-none cursor-pointer bg-red-500 shadow-lg shadow-red-200 hover:opacity-90 active:scale-95 transition-all outline-none"
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
                className="flex-1 overflow-y-auto px-5 pb-5 pt-2 flex flex-col gap-4"
                style={{
                  animation: "fadeSlide 0.18s ease",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#e2e8f0 transparent",
                }}
              >
                {/* Duration recap */}
                <div className="flex items-center gap-3 bg-gradient-to-r from-slate-50 to-white rounded-2xl border border-slate-100 p-3.5">
                  <UserAvatar name={lead.name} size={42} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-slate-800 leading-tight">
                      {lead.name}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {lead.phone}
                    </p>
                  </div>
                  <div className="shrink-0 bg-emerald-50 rounded-xl px-3 py-2 border border-emerald-100 text-right">
                    <p className="text-[13px] font-bold text-emerald-600 flex items-center gap-1">
                      <RiTimeLine size={12} />{" "}
                      {formatDuration(finalDuration.current)}
                    </p>
                    <p className="text-[9px] text-slate-400 font-medium mt-0.5">
                      duration
                    </p>
                  </div>
                </div>

                {/* Outcome picker */}
                <div>
                  <p className="text-[12px] font-bold text-slate-700 mb-2.5 flex items-center gap-1.5">
                    Call Outcome <span className="text-rose-400">*</span>
                    {!outcome && (
                      <span className="text-[10px] font-normal text-slate-400 ml-1">
                        — select one below
                      </span>
                    )}
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
                            if (!cfg.showFollowUp)
                              setValue("followUpDate", null);
                          }}
                          className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-left cursor-pointer outline-none transition-all duration-150 border-2 ${sel ? `${cfg.bg} ${cfg.border} ${cfg.color} ring-2 ${cfg.ringCls} ring-offset-1` : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"}`}
                        >
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${sel ? `${cfg.bg} ${cfg.color}` : "bg-slate-100 text-slate-400"}`}
                          >
                            {cfg.icon}
                          </span>
                          <span className="text-[12px] font-bold leading-tight">
                            {cfg.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {outcome && (
                    <p
                      className={`text-[11px] mt-2 ml-0.5 flex items-center gap-1.5 font-medium ${OUTCOME_CONFIG[outcome].color}`}
                    >
                      ● {OUTCOME_CONFIG[outcome].description}
                    </p>
                  )}
                </div>

                {/* Follow-up date */}
                {showFollowUpDate && (
                  <div
                    className={`rounded-2xl border p-4 transition-all duration-200 ${outcome === "callback" ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200"}`}
                    style={{ animation: "fadeSlide 0.2s ease" }}
                  >
                    <CustomDatePicker
                      name="followUpDate"
                      label={
                        outcome === "callback"
                          ? `Callback Date ${isFollowUpRequired ? "*" : ""}`
                          : "Follow-up Date"
                      }
                      placeholder={
                        outcome === "callback"
                          ? "When should we call back?"
                          : "Schedule next follow-up"
                      }
                      control={control}
                      errors={errors}
                      rules={
                        isFollowUpRequired
                          ? { required: "Callback date is required" }
                          : undefined
                      }
                    />
                    {outcome === "callback" && (
                      <p className="text-[10px] text-amber-600 mt-2 flex items-center gap-1 font-medium">
                        <RiCalendarLine size={10} /> A follow-up task will be
                        auto-created for the counselor
                      </p>
                    )}
                  </div>
                )}

                {/* Notes */}
                <div>
                  <p className="text-[12px] font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                    <RiStickyNoteLine size={13} className="text-slate-400" />{" "}
                    Call Notes
                    <span className="text-[10px] font-normal text-slate-400 ml-1">
                      — optional
                    </span>
                  </p>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="What was discussed? Key details, follow-up actions, student concerns…"
                    rows={4}
                    className="w-full outline-none resize-none text-[12px] text-slate-700 placeholder:text-slate-300 leading-relaxed bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-[inherit] transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white"
                  />
                </div>

                {/* Rating */}
                <div>
                  <p className="text-[12px] font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                    <RiStarLine size={13} className="text-slate-400" /> Call
                    Quality
                    <span className="text-[10px] font-normal text-slate-400 ml-1">
                      — optional
                    </span>
                  </p>
                  <StarRating value={rating} onChange={setRating} />
                </div>

                {/* Submit */}
                <button
                  type="button"
                  onClick={() => submitCallLog()}
                  disabled={!canSubmit || isSubmitting}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white text-[13px] font-bold border-none outline-none transition-all ${canSubmit && !isSubmitting ? "bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-200 cursor-pointer hover:opacity-90 active:scale-95" : "bg-slate-300 cursor-not-allowed"}`}
                >
                  {isSubmitting ? (
                    <>
                      <RiLoader4Line size={15} className="animate-spin" />{" "}
                      Saving…
                    </>
                  ) : (
                    <>
                      <RiCheckLine size={15} /> Save Call Log
                    </>
                  )}
                </button>
              </div>
            )}

            {/* ── DONE ── */}
            {status === "done" && (
              <div
                className="flex flex-col items-center justify-center px-6 pb-10 pt-6"
                style={{ animation: "fadeSlide 0.22s ease" }}
              >
                <div className="w-20 h-20 rounded-full bg-emerald-50 ring-8 ring-emerald-100 flex items-center justify-center mb-4">
                  <RiCheckboxCircleLine
                    size={42}
                    className="text-emerald-500"
                  />
                </div>
                <h3 className="text-[16px] font-bold text-slate-900">
                  Call Logged!
                </h3>
                <p className="text-[12px] text-slate-400 mt-1.5 text-center leading-relaxed">
                  Saved to {lead.name}'s activity history
                </p>
                {outcome && (
                  <div
                    className={`mt-5 flex items-center gap-2 px-4 py-2.5 rounded-2xl border ${OUTCOME_CONFIG[outcome].bg} ${OUTCOME_CONFIG[outcome].border} ${OUTCOME_CONFIG[outcome].color}`}
                  >
                    {OUTCOME_CONFIG[outcome].icon}
                    <span className="text-[12px] font-bold">
                      {OUTCOME_CONFIG[outcome].label}
                    </span>
                    {finalDuration.current > 0 && (
                      <span className="text-[11px] opacity-60">
                        · {formatDuration(finalDuration.current)}
                      </span>
                    )}
                  </div>
                )}
                {followUpDateValue && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                    <RiCalendarLine size={11} />
                    Follow-up:{" "}
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
