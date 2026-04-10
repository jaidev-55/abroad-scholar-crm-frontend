import type {
  LeadStatus as ApiLeadStatus,
  LeadPriority,
} from "../../../modules/leadsPipeline/api/leads";

export type Priority = "Hot" | "Warm" | "Cold";

export const STATUS_LABEL: Record<ApiLeadStatus, string> = {
  NEW: "New",
  IN_PROGRESS: "In Progress",
  CONVERTED: "Converted",
  LOST: "Lost",
};

export const STATUS_CLS: Record<ApiLeadStatus, string> = {
  NEW: "bg-blue-50 text-blue-600 border-blue-200",
  IN_PROGRESS: "bg-violet-50 text-violet-600 border-violet-200",
  CONVERTED: "bg-emerald-50 text-emerald-600 border-emerald-200",
  LOST: "bg-red-50 text-red-500 border-red-200",
};

export const STATUS_DOT_CLS: Record<ApiLeadStatus, string> = {
  NEW: "bg-blue-400",
  IN_PROGRESS: "bg-violet-400",
  CONVERTED: "bg-emerald-400",
  LOST: "bg-red-400",
};

export const PRIORITY_ORDER: Record<LeadPriority, number> = {
  HOT: 0,
  WARM: 1,
  COLD: 2,
};

export const SOURCE_STYLE_MAP: Record<string, string> = {
  INSTAGRAM: "bg-pink-50 text-pink-700 border-pink-200",
  WEBSITE: "bg-blue-50 text-blue-700 border-blue-200",
  WALK_IN: "bg-amber-50 text-amber-700 border-amber-200",
  GOOGLE_ADS: "bg-yellow-50 text-yellow-700 border-yellow-200",
  META_ADS: "bg-indigo-50 text-indigo-700 border-indigo-200",
  REFERRAL: "bg-emerald-50 text-emerald-700 border-emerald-200",
  FACEBOOK: "bg-blue-50 text-blue-700 border-blue-200",
  EDUCATION_FAIR: "bg-violet-50 text-violet-700 border-violet-200",
};

export const DEFAULT_SOURCE_STYLE =
  "bg-slate-50 text-slate-600 border-slate-200";
