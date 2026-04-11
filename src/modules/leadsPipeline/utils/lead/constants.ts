export const SOURCE_OPTIONS = [
  "INSTAGRAM",
  "WEBSITE",
  "WALK_IN",
  "GOOGLE_ADS",
  "META_ADS",
  "REFERRAL",
].map((s) => ({
  value: s,
  label: s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
}));

export const COUNTRY_OPTIONS = [
  { value: "USA", label: "🇺🇸 USA" },
  { value: "UK", label: "🇬🇧 UK" },
  { value: "Canada", label: "🇨🇦 Canada" },
  { value: "Australia", label: "🇦🇺 Australia" },
  { value: "Germany", label: "🇩🇪 Germany" },
  { value: "France", label: "🇫🇷 France" },
  { value: "Ireland", label: "🇮🇪 Ireland" },
  { value: "New Zealand", label: "🇳🇿 New Zealand" },
  { value: "Singapore", label: "🇸🇬 Singapore" },
  { value: "Japan", label: "🇯🇵 Japan" },
];

export const STAGES = [
  {
    id: "new",
    label: "New",
    apiStatus: "NEW",
    color: "#3B82F6",
    bg: "#EFF6FF",
  },
  {
    id: "progress",
    label: "In Progress",
    apiStatus: "IN_PROGRESS",
    color: "#8B5CF6",
    bg: "#F5F3FF",
  },
  {
    id: "converted",
    label: "Converted",
    apiStatus: "CONVERTED",
    color: "#10B981",
    bg: "#ECFDF5",
  },
] as const;

export const PRIORITY_CONFIG = {
  Hot: {
    icon: "🔥",
    color: "#ef4444",
    bg: "#fff5f5",
    border: "#fed7d7",
    apiValue: "HOT",
  },
  Warm: {
    icon: "⚡",
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fde68a",
    apiValue: "WARM",
  },
  Cold: {
    icon: "❄️",
    color: "#3b82f6",
    bg: "#eff6ff",
    border: "#bfdbfe",
    apiValue: "COLD",
  },
} as const;
