import {
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiSparklingLine,
  RiTimeLine,
} from "react-icons/ri";

// LEAD SOURCES
export const SOURCES = [
  "WEBSITE",
  "REFERRAL",
  "FACEBOOK",
  "INSTAGRAM",
  "WALK-IN",
  "GOOGLE ADS",
  "EDUCATION FAIR",
  "WHATSAPP",
];

// COUNSELORS
export const COUNSELORS = [
  "Priya Sharma",
  "Arjun Patel",
  "Sarah Khan",
  "Rohan Mehta",
  "Anita Desai",
];

// DESTINATION COUNTRIES
export const COUNTRIES = [
  "🇬🇧 UK",
  "🇨🇦 Canada",
  "🇺🇸 USA",
  "🇦🇺 Australia",
  "🇩🇪 Germany",
  "🇮🇪 Ireland",
  "🇳🇿 New Zealand",
  "Others",
];

// PRIORITY LEVELS
export const PRIORITIES = ["Hot", "Warm", "Cold"];

// STATUS OPTIONS
export const STATUSES = ["Active", "Lost"];

export const STAGES = [
  {
    id: "new",
    label: "New",
    color: "#3B82F6",
    bg: "#EFF6FF",
    icon: RiSparklingLine,
    borderColor: "#BFDBFE",
    twText: "text-blue-500",
    twBg: "bg-blue-50",
    twBorder: "border-blue-200",
  },
  {
    id: "progress",
    label: "In Progress",
    color: "#8B5CF6",
    bg: "#F5F3FF",
    icon: RiTimeLine,
    borderColor: "#DDD6FE",
    twText: "text-violet-500",
    twBg: "bg-violet-50",
    twBorder: "border-violet-200",
  },
  {
    id: "converted",
    label: "Converted",
    color: "#10B981",
    bg: "#ECFDF5",
    icon: RiCheckboxCircleLine,
    borderColor: "#A7F3D0",
    twText: "text-emerald-500",
    twBg: "bg-emerald-50",
    twBorder: "border-emerald-200",
  },
  {
    id: "lost",
    label: "Lost",
    color: "#EF4444",
    bg: "#FEF2F2",
    icon: RiCloseCircleLine,
    borderColor: "#FCA5A5",
    twText: "text-red-500",
    twBg: "bg-red-50",
    twBorder: "border-red-200",
  },
];

export const LOST_REASONS = [
  "Budget constraints",
  "Chose another agency",
  "Decided not to study abroad",
  "Visa rejected",
  "Unresponsive",
  "Poor IELTS score",
  "Family issues",
  "Other",
];

export const STAGE_TO_STATUS: Record<string, string> = {
  new: "NEW",
  progress: "IN_PROGRESS",
  converted: "CONVERTED",
  lost: "LOST",
};

export const PRIORITY_TO_API: Record<string, string> = {
  Hot: "HOT",
  Warm: "WARM",
  Cold: "COLD",
};
