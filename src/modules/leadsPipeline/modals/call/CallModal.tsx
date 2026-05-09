import React, { useState, useEffect, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import type { Dayjs } from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

import { getCallLogs, logCall } from "../../api/leads";
import type {
  CallModalProps,
  CallStatus,
  CallOutcome,
  PipelineStatus,
  CallRating,
  CallLogFormValues,
} from "../../utils/calls/types";

import CallHeader from "./components/CallHeader";
import ActiveCallView from "./components/ActiveCallView";
import LogForm from "./components/LogForm";
import CallDoneScreen from "./components/CallDoneScreen";
import HistoryView from "./components/HistoryView";
import {
  OUTCOME_CONFIG,
  OUTCOME_TO_API,
  PIPELINE_STATUS_TO_API,
} from "../../utils/calls/constants";
import { mapApiCallLog } from "../../utils/calls/helpers";

const CallModal: React.FC<CallModalProps> = ({
  lead,
  onClose,
  onCallLogged,
}) => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<CallStatus>("idle");
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [view, setView] = useState<"call" | "history">("call");
  const [outcome, setOutcome] = useState<CallOutcome | null>(null);
  const [pipelineStatus, setPipelineStatus] = useState<PipelineStatus | null>(
    null,
  );
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
    defaultValues: {
      outcome: "",
      pipelineStatus: "",
      notes: "",
      rating: null,
      followUpDate: null,
    },
  });

  const followUpDateValue = watch("followUpDate");
  const showFollowUpDate =
    outcome !== null && OUTCOME_CONFIG[outcome].showFollowUp;
  const isFollowUpRequired = outcome === "callback";
  const canSubmit =
    outcome !== null && (!isFollowUpRequired || followUpDateValue !== null);

  // ── Data ──────────────────────────────────────────────────────────────────
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

  // ── Reset on lead change ──────────────────────────────────────────────────
  useEffect(() => {
    if (lead) {
      setStatus("idle");
      setSeconds(0);
      setOutcome(null);
      setPipelineStatus(null);
      setNotes("");
      setRating(null);
      setMuted(false);
      setSpeaker(false);
      setView("call");
      resetForm();
    }
  }, [lead, resetForm]);

  // ── Timer ─────────────────────────────────────────────────────────────────
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

  // ── Mutation ──────────────────────────────────────────────────────────────
  const { mutate: submitCallLog, isPending: isSubmitting } = useMutation({
    mutationFn: () => {
      if (!outcome || !lead) throw new Error("Missing data");
      return logCall(lead.id, {
        outcome: OUTCOME_TO_API[outcome],

        pipelineStatus: pipelineStatus
          ? PIPELINE_STATUS_TO_API[pipelineStatus]
          : null,
        notes: notes.trim() || undefined,
        duration: finalDuration.current,
        rating: rating ?? null,
        followUpDate: followUpDateValue
          ? (followUpDateValue as Dayjs).toISOString()
          : null,
      });
    },
    onSuccess: () => {
      if (!outcome) return;
      onCallLogged?.({
        id: `call-${Date.now()}`,
        date: new Date().toISOString(),
        duration: finalDuration.current,
        outcome,
        pipelineStatus,
        notes: notes.trim(),
        rating,
        author: lead!.counselor,
        muted,
        speakerOn: speaker,
        followUpDate: followUpDateValue
          ? (followUpDateValue as Dayjs).format("YYYY-MM-DD")
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md">
      <div
        className="bg-white w-full flex flex-col overflow-hidden rounded-3xl shadow-2xl ring-1 ring-slate-900/5"
        style={{
          maxWidth: 440,
          maxHeight: "92vh",
          animation: "modalUp 0.24s cubic-bezier(0.34,1.4,0.64,1)",
        }}
      >
        <CallHeader
          leadName={lead.name}
          status={status}
          view={view}
          totalCalls={callLogsData?.summary.totalCalls ?? 0}
          logsLoading={logsLoading}
          onToggleView={() =>
            setView((v) => (v === "call" ? "history" : "call"))
          }
          onClose={onClose}
        />

        {/* History view */}
        {view === "history" && (
          <HistoryView
            logs={logs}
            logsLoading={logsLoading}
            totalCalls={callLogsData?.summary.totalCalls ?? 0}
            avgDuration={callLogsData?.summary.avgDurationSeconds ?? 0}
            conversions={callLogsData?.summary.conversions ?? 0}
            outcomeCounts={callLogsData?.summary.outcomeCounts ?? {}}
          />
        )}

        {/* Call view */}
        {view === "call" && (
          <>
            {(status === "idle" ||
              status === "calling" ||
              status === "connected") && (
              <ActiveCallView
                lead={lead}
                status={status}
                seconds={seconds}
                muted={muted}
                speaker={speaker}
                onCall={() => {
                  setStatus("calling");
                  setTimeout(() => setStatus("connected"), 2200);
                }}
                onCancelCall={() => {
                  setStatus("idle");
                  setSeconds(0);
                }}
                onEndCall={() => {
                  finalDuration.current = seconds;
                  setStatus("logging");
                }}
                onToggleMute={() => setMuted(!muted)}
                onToggleSpeaker={() => setSpeaker(!speaker)}
              />
            )}

            {status === "logging" && (
              <LogForm
                lead={lead}
                finalDuration={finalDuration.current}
                outcome={outcome}
                pipelineStatus={pipelineStatus}
                notes={notes}
                rating={rating}
                canSubmit={canSubmit}
                isSubmitting={isSubmitting}
                showFollowUpDate={showFollowUpDate}
                isFollowUpRequired={isFollowUpRequired}
                control={control}
                errors={errors}
                onOutcomeChange={setOutcome}
                onPipelineStatusChange={setPipelineStatus}
                onNotesChange={setNotes}
                onRatingChange={setRating}
                onSubmit={() => submitCallLog()}
                setValue={setValue}
              />
            )}

            {status === "done" && (
              <CallDoneScreen
                lead={lead}
                outcome={outcome}
                finalDuration={finalDuration.current}
                followUpDateValue={followUpDateValue}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CallModal;
