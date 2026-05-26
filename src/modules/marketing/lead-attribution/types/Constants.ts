export const SOURCE_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; dot: string; color: string }
> = {
  META_ADS: {
    label: "Meta Ads",
    bg: "bg-blue-50",
    text: "text-blue-600",
    dot: "bg-blue-500",
    color: "#3b82f6",
  },
  GOOGLE_ADS: {
    label: "Google Ads",
    bg: "bg-red-50",
    text: "text-red-600",
    dot: "bg-red-500",
    color: "#ef4444",
  },
  WEBSITE: {
    label: "Website",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    dot: "bg-emerald-500",
    color: "#10b981",
  },
  REFERRAL: {
    label: "Referral",
    bg: "bg-purple-50",
    text: "text-purple-600",
    dot: "bg-purple-500",
    color: "#8b5cf6",
  },
  MANUAL: {
    label: "Manual",
    bg: "bg-slate-100",
    text: "text-slate-600",
    dot: "bg-slate-400",
    color: "#94a3b8",
  },
};

export const PIPELINE_CONFIG: Record<
  string,
  { bg: string; text: string; color: string }
> = {
  New: { bg: "bg-blue-50", text: "text-blue-600", color: "#3b82f6" },
  "In Progress": {
    bg: "bg-amber-50",
    text: "text-amber-600",
    color: "#f59e0b",
  },
  Converted: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    color: "#10b981",
  },
  Lost: { bg: "bg-slate-100", text: "text-slate-500", color: "#94a3b8" },
};

export const QUALITY_CONFIG: Record<string, { bg: string; text: string }> = {
  Hot: { bg: "bg-rose-50", text: "text-rose-600" },
  Warm: { bg: "bg-amber-50", text: "text-amber-600" },
  Cold: { bg: "bg-sky-50", text: "text-sky-600" },
};

export const PERIOD_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "7days", label: "7 Days" },
  { value: "30days", label: "30 Days" },
  { value: "90days", label: "90 Days" },
  { value: "custom", label: "Custom" },
] as const;

export const SOURCE_OPTIONS = [
  { value: "all", label: "All Sources" },
  { value: "META_ADS", label: "Meta Ads" },
  { value: "GOOGLE_ADS", label: "Google Ads" },
  { value: "WEBSITE", label: "Website" },
  { value: "REFERRAL", label: "Referral" },
  { value: "MANUAL", label: "Manual" },
] as const;

export const PIPELINE_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "New", label: "New" },
  { value: "In Progress", label: "In Progress" },
  { value: "Converted", label: "Converted" },
  { value: "Lost", label: "Lost" },
] as const;

export const QUALITY_OPTIONS = [
  { value: "all", label: "All Quality" },
  { value: "Hot", label: "Hot" },
  { value: "Warm", label: "Warm" },
  { value: "Cold", label: "Cold" },
] as const;
