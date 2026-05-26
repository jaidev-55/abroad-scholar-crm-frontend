import type {
  LostReasonOption,
  ReactivationReasonOption,
  StageOption,
} from "../types";

import {
  RiMoneyDollarCircleLine,
  RiBookOpenLine,
  RiBuilding2Line,
  RiCloseCircleLine,
  RiPhoneLine,
  RiTimeLine,
  RiEarthLine,
  RiGroupLine,
  RiProhibitedLine, // ✅ instead of RiBankLine
  RiVolumeMuteLine, // ✅ instead of RiSkipLeftLine
  RiThumbDownLine,
  RiFileCopyLine,
  RiQuestionLine,
} from "react-icons/ri";
export const AVATAR_COLORS: [string, string][] = [
  ["bg-indigo-100", "text-indigo-700"],
  ["bg-emerald-100", "text-emerald-700"],
  ["bg-amber-100", "text-amber-700"],
  ["bg-pink-100", "text-pink-700"],
  ["bg-sky-100", "text-sky-700"],
  ["bg-orange-100", "text-orange-700"],
  ["bg-violet-100", "text-violet-700"],
  ["bg-cyan-100", "text-cyan-700"],
  ["bg-rose-100", "text-rose-700"],
  ["bg-teal-100", "text-teal-700"],
];

export const STAGES: StageOption[] = [
  {
    id: "COUNSELLING_COMPLETED",
    label: "Counselling Completed",
    color: "#3B82F6",
    twBg: "bg-blue-50",
    twText: "text-blue-700",
    twBorder: "border-blue-200",
  },
  {
    id: "FOLLOW_UP",
    label: "Follow Up",
    color: "#0EA5E9",
    twBg: "bg-sky-50",
    twText: "text-sky-700",
    twBorder: "border-sky-200",
  },
  {
    id: "ACTIVE_PIPELINE",
    label: "Active Pipeline",
    color: "#8B5CF6",
    twBg: "bg-violet-50",
    twText: "text-violet-700",
    twBorder: "border-violet-200",
  },
  {
    id: "DOCS_PENDING",
    label: "Docs Pending",
    color: "#F59E0B",
    twBg: "bg-amber-50",
    twText: "text-amber-700",
    twBorder: "border-amber-200",
  },
  {
    id: "NO_RESPONSE_1ST_CALL",
    label: "No Response 1st Call",
    color: "#EF4444",
    twBg: "bg-red-50",
    twText: "text-red-700",
    twBorder: "border-red-200",
  },
];

export const LOST_REASONS: LostReasonOption[] = [
  {
    value: "FINANCIAL_ISSUE",
    label: "Financial Issue",
    icon: <RiMoneyDollarCircleLine size={12} className="text-amber-500" />,
  },
  {
    value: "DIRECT_ADMISSION",
    label: "Direct Admission",
    icon: <RiBookOpenLine size={12} className="text-violet-500" />,
  },
  {
    value: "ANOTHER_CONSULTANCY",
    label: "Another Consultancy",
    icon: <RiBuilding2Line size={12} className="text-blue-500" />,
  },
  {
    value: "NOT_ELIGIBLE",
    label: "Not Eligible",
    icon: <RiCloseCircleLine size={12} className="text-red-500" />,
  },
  {
    value: "NOT_RESPONDING",
    label: "Not Responding",
    icon: <RiPhoneLine size={12} className="text-slate-400" />,
  },
  {
    value: "DEFERRED_INTAKE",
    label: "Deferred Intake",
    icon: <RiTimeLine size={12} className="text-orange-500" />,
  },
  {
    value: "CHANGED_COUNTRY",
    label: "Changed Country",
    icon: <RiEarthLine size={12} className="text-emerald-500" />,
  },
  {
    value: "FAMILY_DECISION",
    label: "Family Decision",
    icon: <RiGroupLine size={12} className="text-pink-500" />,
  },
  {
    value: "VISA_REJECTION",
    label: "Visa Rejection",
    icon: <RiProhibitedLine size={12} className="text-red-500" />,
  },
  {
    value: "NO_RESPONSE",
    label: "No Response",
    icon: <RiVolumeMuteLine size={12} className="text-slate-400" />,
  },
  {
    value: "VISA_REJECTED",
    label: "Visa Rejected",
    icon: <RiProhibitedLine size={12} className="text-red-500" />,
  },
  {
    value: "NOT_INTERESTED",
    label: "Not Interested",
    icon: <RiThumbDownLine size={12} className="text-slate-500" />,
  },
  {
    value: "CHOSE_OTHER_CONSULTANT",
    label: "Another Consultancy",
    icon: <RiBuilding2Line size={12} className="text-blue-500" />,
  },
  {
    value: "DUPLICATE_LEAD",
    label: "Duplicate Lead",
    icon: <RiFileCopyLine size={12} className="text-slate-400" />,
  },

  {
    value: "OTHER",
    label: "Other",
    icon: <RiQuestionLine size={12} className="text-slate-400" />,
  },
];

export const REACTIVATION_REASONS: ReactivationReasonOption[] = [
  { value: "NEW_INFORMATION", label: "New Information" },
  { value: "FINANCIAL_RESOLVED", label: "Financially Ready Now" },
  { value: "RECONNECTED", label: "Reconnected" },
  { value: "ELIGIBILITY_CHANGED", label: "Eligibility Changed" },
  { value: "CHANGED_MIND", label: "Changed Mind" },
  { value: "OTHER", label: "Other" },
];

export const SOURCES: string[] = [
  "Website",
  "Referral",
  "Facebook",
  "Instagram",
  "Walk-in",
  "Google Ads",
  "Education Fair",
];

export const COUNTRIES: string[] = [
  "🇬🇧 UK",
  "🇨🇦 Canada",
  "🇺🇸 USA",
  "🇦🇺 Australia",
  "🇩🇪 Germany",
  "🇮🇪 Ireland",
  "🇳🇿 New Zealand",
];
