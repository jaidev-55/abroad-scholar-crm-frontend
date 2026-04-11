import {
  RiCheckboxCircleLine,
  RiStarLine,
  RiCalendarLine,
  RiCloseCircleLine,
  RiPhoneLine,
  RiVolumeUpLine,
} from "react-icons/ri";

import type { CallOutcome, OutcomeConfig } from "./types";
import type { CallOutcomeApi } from "../../api/leads";

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
