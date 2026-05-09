import {
  RiCheckboxCircleLine,
  RiStarLine,
  RiCalendarLine,
  RiCloseCircleLine,
  RiVolumeUpLine,
  RiUserSmileLine,
  RiRefreshLine,
  RiBarChartLine,
  RiFileList3Line,
  RiPhoneLine,
} from "react-icons/ri";

import type {
  CallOutcome,
  OutcomeConfig,
  PipelineStatus,
  PipelineStatusConfig,
} from "./types";
import type { CallOutcomeApi } from "../../api/leads";

// ── Call Disposition ──────────────────────────────────────────────────────────

export const OUTCOME_CONFIG: Record<CallOutcome, OutcomeConfig> = {
  interested: {
    label: "Interested",
    Icon: RiCheckboxCircleLine,
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
    Icon: RiStarLine,
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
    Icon: RiCalendarLine,
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
    Icon: RiCloseCircleLine,
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-200",
    badgeCls: "bg-red-50 text-red-600",
    ringCls: "ring-red-300",
    description: "Student is not interested",
    showFollowUp: false,
  },
  no_answer: {
    label: "RNR / Not Picked",
    Icon: RiPhoneLine,
    color: "text-slate-500",
    bg: "bg-slate-50",
    border: "border-slate-200",
    badgeCls: "bg-slate-100 text-slate-600",
    ringCls: "ring-slate-300",
    description: "Ring No Response — not picked up",
    showFollowUp: true,
  },
  voicemail: {
    label: "Voicemail",
    Icon: RiVolumeUpLine,
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    badgeCls: "bg-violet-50 text-violet-700",
    ringCls: "ring-violet-300",
    description: "Left a voicemail message",
    showFollowUp: true,
  },
};

// ── Pipeline Status ───────────────────────────────────────────────────────────
// Keys now match the API enum (UPPERCASE) and types/lead.ts PipelineStatus

export const PIPELINE_STATUS_CONFIG: Record<
  PipelineStatus,
  PipelineStatusConfig
> = {
  COUNSELLING_COMPLETED: {
    label: "Counselling Completed",
    Icon: RiUserSmileLine,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    badgeCls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    ringCls: "ring-emerald-300",
    description: "Full counselling session done",
  },
  FOLLOW_UP: {
    label: "Follow-Up",
    Icon: RiRefreshLine,
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    badgeCls: "bg-blue-50 text-blue-700 border-blue-200",
    ringCls: "ring-blue-300",
    description: "Needs another call or follow-up",
  },
  ACTIVE_PIPELINE: {
    label: "Active Pipeline",
    Icon: RiBarChartLine,
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    badgeCls: "bg-violet-50 text-violet-700 border-violet-200",
    ringCls: "ring-violet-300",
    description: "Student is actively considering",
  },
  DOCS_PENDING: {
    label: "Docs Pending",
    Icon: RiFileList3Line,
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    badgeCls: "bg-amber-50 text-amber-700 border-amber-200",
    ringCls: "ring-amber-300",
    description: "Waiting on student documents",
  },
  NO_RESPONSE_1ST_CALL: {
    label: "No Response – 1st Call",
    Icon: RiPhoneLine,
    color: "text-slate-600",
    bg: "bg-slate-50",
    border: "border-slate-200",
    badgeCls: "bg-slate-50 text-slate-600 border-slate-200",
    ringCls: "ring-slate-300",
    description: "Called once, no answer yet",
  },
};

// ── API mappings ──────────────────────────────────────────────────────────────

export const OUTCOME_TO_API: Record<CallOutcome, CallOutcomeApi> = {
  interested: "INTERESTED",
  not_interested: "NOT_INTERESTED",
  callback: "SCHEDULE_CALLBACK",
  no_answer: "NO_ANSWER",
  voicemail: "VOICEMAIL",
  converted: "CONVERTED",
};

export const API_TO_OUTCOME: Partial<Record<CallOutcomeApi, CallOutcome>> = {
  INTERESTED: "interested",
  NOT_INTERESTED: "not_interested",
  SCHEDULE_CALLBACK: "callback",
  NO_ANSWER: "no_answer",
  VOICEMAIL: "voicemail",
  CONVERTED: "converted",
};

// ── Pipeline status API mappings ──────────────────────────────────────────────
// PipelineStatus is now UPPERCASE so API ↔ local is a 1:1 identity mapping

export type PipelineStatusApi =
  | "COUNSELLING_COMPLETED"
  | "FOLLOW_UP"
  | "ACTIVE_PIPELINE"
  | "DOCS_PENDING"
  | "NO_RESPONSE_1ST_CALL";

export const PIPELINE_STATUS_TO_API: Record<PipelineStatus, PipelineStatusApi> =
  {
    COUNSELLING_COMPLETED: "COUNSELLING_COMPLETED",
    FOLLOW_UP: "FOLLOW_UP",
    ACTIVE_PIPELINE: "ACTIVE_PIPELINE",
    DOCS_PENDING: "DOCS_PENDING",
    NO_RESPONSE_1ST_CALL: "NO_RESPONSE_1ST_CALL",
  };

export const API_TO_PIPELINE_STATUS: Partial<
  Record<PipelineStatusApi, PipelineStatus>
> = {
  COUNSELLING_COMPLETED: "COUNSELLING_COMPLETED",
  FOLLOW_UP: "FOLLOW_UP",
  ACTIVE_PIPELINE: "ACTIVE_PIPELINE",
  DOCS_PENDING: "DOCS_PENDING",
  NO_RESPONSE_1ST_CALL: "NO_RESPONSE_1ST_CALL",
};
