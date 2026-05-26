export const SYNC_STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  success: {
    label: "Success",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    dot: "bg-emerald-500",
  },
  failed: {
    label: "Failed",
    bg: "bg-red-50",
    text: "text-red-600",
    dot: "bg-red-500",
  },
  duplicate: {
    label: "Duplicate",
    bg: "bg-amber-50",
    text: "text-amber-600",
    dot: "bg-amber-500",
  },
  partial: {
    label: "Partial",
    bg: "bg-blue-50",
    text: "text-blue-600",
    dot: "bg-blue-500",
  },
};

export const PERIOD_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "7days", label: "7 Days" },
  { value: "30days", label: "30 Days" },
  { value: "custom", label: "Custom" },
] as const;

export const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "success", label: "Success" },
  { value: "failed", label: "Failed" },
  { value: "duplicate", label: "Duplicate" },
  { value: "partial", label: "Partial" },
] as const;
