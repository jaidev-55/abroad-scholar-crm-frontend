import type { IeltsStatus } from ".";

export const IELTS_STATUS_CONFIG: Record<
  IeltsStatus,
  { tw: string; dot: string; label: string }
> = {
  NOT_STARTED: {
    tw: "bg-slate-50 text-slate-500",
    dot: "bg-slate-400",
    label: "Not Started",
  },
  PREPARING: {
    tw: "bg-amber-50 text-amber-600",
    dot: "bg-amber-400",
    label: "Preparing",
  },
  SCHEDULED: {
    tw: "bg-blue-50 text-blue-600",
    dot: "bg-blue-400",
    label: "Scheduled",
  },
  COMPLETED: {
    tw: "bg-emerald-50 text-emerald-600",
    dot: "bg-emerald-400",
    label: "Completed",
  },
  CANCELLED: {
    tw: "bg-red-50 text-red-500",
    dot: "bg-red-400",
    label: "Cancelled",
  },
};

export const IELTS_BANDS = [
  { min: 9.0, max: 9.0, label: "Expert", color: "#10b981" },
  { min: 8.0, max: 8.5, label: "Very Good", color: "#22c55e" },
  { min: 7.0, max: 7.5, label: "Good", color: "#84cc16" },
  { min: 6.0, max: 6.5, label: "Competent", color: "#eab308" },
  { min: 5.0, max: 5.5, label: "Modest", color: "#f97316" },
  { min: 4.0, max: 4.5, label: "Limited", color: "#ef4444" },
  { min: 0, max: 3.5, label: "Below", color: "#dc2626" },
];

export const getBandInfo = (score: number | null) => {
  if (score === null) return { label: "N/A", color: "#94a3b8" };
  const band = IELTS_BANDS.find((b) => score >= b.min && score <= b.max);
  return band ?? { label: "N/A", color: "#94a3b8" };
};

//  IELTS scores range 1.0 - 9.0 in 0.5 steps (17 values)
export const SCORE_OPTIONS = Array.from({ length: 17 }, (_, i) => {
  const val = (1 + i * 0.5).toFixed(1);
  return { value: val, label: val };
});

export const EXAM_TYPE_OPTIONS = [
  { value: "ACADEMIC", label: "Academic" },
  { value: "GENERAL", label: "General" },
];

export const STATUS_OPTIONS: { value: IeltsStatus | ""; label: string }[] = [
  { value: "", label: "All Statuses" },
  { value: "NOT_STARTED", label: "Not Started" },
  { value: "PREPARING", label: "Preparing" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const MODULE_LABELS = [
  { key: "listening", label: "Listening", icon: "listening" },
  { key: "reading", label: "Reading", icon: "reading" },
  { key: "writing", label: "Writing", icon: "writing" },
  { key: "speaking", label: "Speaking", icon: "speaking" },
] as const;

export const COUNTRY_OPTIONS = [
  { value: "", label: "All Countries" },
  { value: "Australia", label: "🇦🇺 Australia" },
  { value: "Canada", label: "🇨🇦 Canada" },
  { value: "Germany", label: "🇩🇪 Germany" },
  { value: "Ireland", label: "🇮🇪 Ireland" },
  { value: "New Zealand", label: "🇳🇿 New Zealand" },
  { value: "UK", label: "🇬🇧 United Kingdom" },
  { value: "USA", label: "🇺🇸 United States" },
];
