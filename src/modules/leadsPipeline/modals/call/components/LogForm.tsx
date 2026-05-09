import React from "react";
import {
  RiStickyNoteLine,
  RiStarLine,
  RiCalendarLine,
  RiCheckLine,
  RiLoader4Line,
  RiTimeLine,
  RiBarChartBoxLine,
} from "react-icons/ri";
import type { Control, FieldErrors, UseFormSetValue } from "react-hook-form";

import StarRating from "./StarRating";
import UserAvatar from "./UserAvatar";
import type {
  CallLogFormValues,
  CallOutcome,
  CallRating,
  Lead,
  PipelineStatus,
} from "../../../utils/calls/types";
import { formatDuration } from "../../../utils/calls/helpers";
import {
  OUTCOME_CONFIG,
  PIPELINE_STATUS_CONFIG,
} from "../../../utils/calls/constants";
import CustomDatePicker from "../../../../../components/common/CustomDatePicker";

interface Props {
  lead: Lead;
  finalDuration: number;
  outcome: CallOutcome | null;
  pipelineStatus: PipelineStatus | null;
  notes: string;
  rating: CallRating | null;
  canSubmit: boolean;
  isSubmitting: boolean;
  showFollowUpDate: boolean;
  isFollowUpRequired: boolean;
  control: Control<CallLogFormValues>;
  errors: FieldErrors<CallLogFormValues>;
  onOutcomeChange: (o: CallOutcome) => void;
  onPipelineStatusChange: (s: PipelineStatus) => void;
  onNotesChange: (n: string) => void;
  onRatingChange: (r: CallRating) => void;
  onSubmit: () => void;
  setValue: UseFormSetValue<CallLogFormValues>;
}

const LogForm: React.FC<Props> = ({
  lead,
  finalDuration,
  outcome,
  pipelineStatus,
  notes,
  rating,
  canSubmit,
  isSubmitting,
  showFollowUpDate,
  isFollowUpRequired,
  control,
  errors,
  onOutcomeChange,
  onPipelineStatusChange,
  onNotesChange,
  onRatingChange,
  onSubmit,
  setValue,
}) => (
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
        <p className="text-[11px] text-slate-400 mt-0.5">{lead.phone}</p>
      </div>
      <div className="shrink-0 bg-emerald-50 rounded-xl px-3 py-2 border border-emerald-100 text-right">
        <p className="text-[13px] font-bold text-emerald-600 flex items-center gap-1">
          <RiTimeLine size={12} /> {formatDuration(finalDuration)}
        </p>
        <p className="text-[9px] text-slate-400 font-medium mt-0.5">duration</p>
      </div>
    </div>

    {/* ── Section 1: Call Outcome ── */}
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
            (typeof OUTCOME_CONFIG)[CallOutcome],
          ][]
        ).map(([key, cfg]) => {
          const sel = outcome === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                onOutcomeChange(key);
                if (!cfg.showFollowUp) setValue("followUpDate", null);
              }}
              className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-left cursor-pointer outline-none transition-all duration-150 border-2 ${
                sel
                  ? `${cfg.bg} ${cfg.border} ${cfg.color} ring-2 ${cfg.ringCls} ring-offset-1`
                  : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  sel ? `${cfg.bg} ${cfg.color}` : "bg-slate-100 text-slate-400"
                }`}
              >
                <cfg.Icon size={14} />
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
        className={`rounded-2xl border p-4 transition-all duration-200 ${
          outcome === "callback"
            ? "bg-amber-50 border-amber-200"
            : "bg-slate-50 border-slate-200"
        }`}
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
            <RiCalendarLine size={10} /> A follow-up task will be auto-created
            for the counselor
          </p>
        )}
      </div>
    )}

    {/* ── Section 2: Pipeline Status — 2-col grid, same visual language as Call Outcome ── */}
    <div>
      <p className="text-[12px] font-bold text-slate-700 mb-2.5 flex items-center gap-1.5">
        <RiBarChartBoxLine size={13} className="text-slate-400" />
        Pipeline Status
        <span className="text-[10px] font-normal text-slate-400 ml-1">
          — shown on the lead card
        </span>
      </p>
      <div className="grid grid-cols-2 gap-2">
        {(
          Object.entries(PIPELINE_STATUS_CONFIG) as [
            PipelineStatus,
            (typeof PIPELINE_STATUS_CONFIG)[PipelineStatus],
          ][]
        ).map(([key, cfg], idx, arr) => {
          const sel = pipelineStatus === key;
          const isLast = idx === arr.length - 1;
          const isOdd = arr.length % 2 !== 0;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onPipelineStatusChange(key)}
              className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-left cursor-pointer outline-none transition-all duration-150 border-2 ${
                isLast && isOdd ? "col-span-2" : ""
              } ${
                sel
                  ? `${cfg.bg} ${cfg.border} ${cfg.color} ring-2 ${cfg.ringCls} ring-offset-1`
                  : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  sel ? `${cfg.bg} ${cfg.color}` : "bg-slate-100 text-slate-400"
                }`}
              >
                <cfg.Icon size={14} />
              </span>
              <span className="text-[12px] font-bold leading-tight flex-1">
                {cfg.label}
              </span>
              {sel && (
                <RiCheckLine size={13} className={`shrink-0 ${cfg.color}`} />
              )}
            </button>
          );
        })}
      </div>
      {pipelineStatus && (
        <p
          className={`text-[11px] mt-2 ml-0.5 flex items-center gap-1.5 font-medium ${PIPELINE_STATUS_CONFIG[pipelineStatus].color}`}
        >
          ● {PIPELINE_STATUS_CONFIG[pipelineStatus].description}
        </p>
      )}
    </div>

    {/* Notes */}
    <div>
      <p className="text-[12px] font-bold text-slate-700 mb-2 flex items-center gap-1.5">
        <RiStickyNoteLine size={13} className="text-slate-400" /> Call Notes
        <span className="text-[10px] font-normal text-slate-400 ml-1">
          — optional
        </span>
      </p>
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="What was discussed? Key details, follow-up actions, student concerns…"
        rows={3}
        className="w-full outline-none resize-none text-[12px] text-slate-700 placeholder:text-slate-300 leading-relaxed bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-[inherit] transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white"
      />
    </div>

    {/* Rating */}
    <div>
      <p className="text-[12px] font-bold text-slate-700 mb-2 flex items-center gap-1.5">
        <RiStarLine size={13} className="text-slate-400" /> Call Quality
        <span className="text-[10px] font-normal text-slate-400 ml-1">
          — optional
        </span>
      </p>
      <StarRating value={rating} onChange={onRatingChange} />
    </div>

    {/* Submit */}
    <button
      type="button"
      onClick={onSubmit}
      disabled={!canSubmit || isSubmitting}
      className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white text-[13px] font-bold border-none outline-none transition-all ${
        canSubmit && !isSubmitting
          ? "bg-blue-500 shadow-lg cursor-pointer hover:opacity-90 active:scale-95"
          : "bg-slate-300 cursor-not-allowed"
      }`}
    >
      {isSubmitting ? (
        <>
          <RiLoader4Line size={15} className="animate-spin" /> Saving…
        </>
      ) : (
        <>
          <RiCheckLine size={15} /> Save Call Log
        </>
      )}
    </button>
  </div>
);

export default LogForm;
