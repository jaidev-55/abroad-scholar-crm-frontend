export const ALERT_TYPE_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; iconBg: string; iconColor: string }
> = {
  budget: {
    label: "Budget",
    bg: "bg-blue-50",
    text: "text-blue-600",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  performance: {
    label: "Performance",
    bg: "bg-purple-50",
    text: "text-purple-600",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
  },
  sync: {
    label: "Sync",
    bg: "bg-teal-50",
    text: "text-teal-600",
    iconBg: "bg-teal-50",
    iconColor: "text-teal-500",
  },
  quality: {
    label: "Quality",
    bg: "bg-amber-50",
    text: "text-amber-600",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  response: {
    label: "Response",
    bg: "bg-rose-50",
    text: "text-rose-600",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
  },
};

export const SEVERITY_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  critical: {
    label: "Critical",
    bg: "bg-red-50",
    text: "text-red-600",
    dot: "bg-red-500",
  },
  warning: {
    label: "Warning",
    bg: "bg-amber-50",
    text: "text-amber-600",
    dot: "bg-amber-500",
  },
  info: {
    label: "Info",
    bg: "bg-blue-50",
    text: "text-blue-600",
    dot: "bg-blue-500",
  },
};

export const OPERATOR_LABELS: Record<string, string> = {
  gt: "greater than",
  lt: "less than",
  eq: "equal to",
  gte: "at least",
  lte: "at most",
};

export const METRIC_OPTIONS = [
  { value: "cpl", label: "Cost per Lead (₹)" },
  { value: "costPerConversion", label: "Cost per Conversion (₹)" },
  { value: "dailySpend", label: "Daily Spend (₹)" },
  { value: "totalSpend", label: "Total Spend (₹)" },
  { value: "leads", label: "Leads Count" },
  { value: "conversionRate", label: "Conversion Rate (%)" },
  { value: "coldLeadPercent", label: "Cold Lead % " },
  { value: "responseTime", label: "Response Time (mins)" },
  { value: "syncGap", label: "No Sync Duration (hours)" },
  { value: "lostLeadPercent", label: "Lost Lead %" },
] as const;

export const OPERATOR_OPTIONS = [
  { value: "gt", label: "Greater than" },
  { value: "lt", label: "Less than" },
  { value: "gte", label: "At least" },
  { value: "lte", label: "At most" },
  { value: "eq", label: "Equal to" },
] as const;

export const ACTION_OPTIONS = [
  { value: "notification", label: "Send Notification" },
  { value: "email", label: "Send Email Alert" },
  { value: "pause_campaign", label: "Pause Campaign" },
  { value: "assign_counselor", label: "Auto-assign Counselor" },
] as const;
