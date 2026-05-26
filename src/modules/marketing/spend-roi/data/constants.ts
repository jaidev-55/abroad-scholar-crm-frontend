export const PERIOD_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "7days", label: "7 Days" },
  { value: "30days", label: "30 Days" },
  { value: "90days", label: "90 Days" },
  { value: "custom", label: "Custom" },
] as const;

export const PLATFORM_OPTIONS = [
  { value: "all", label: "All Platforms" },
  { value: "meta", label: "Meta Ads" },
  { value: "google", label: "Google Ads" },
] as const;

export const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  active: { bg: "bg-emerald-50", text: "text-emerald-600" },
  paused: { bg: "bg-amber-50", text: "text-amber-600" },
  completed: { bg: "bg-slate-100", text: "text-slate-500" },
};

export const PLATFORM_COLORS: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  meta: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
  google: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
};
