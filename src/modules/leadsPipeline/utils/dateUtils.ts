// ─── Check if an ISO date string represents today ─────────────────────────────
export const isTodayDate = (dateStr?: string): boolean => {
  if (!dateStr) return false;
  return new Date(dateStr).toDateString() === new Date().toDateString();
};

// ─── Get today's date as YYYY-MM-DD ──────────────────────────────────────────
export const todayString = (): string => new Date().toISOString().split("T")[0];

// ─── Check if a YYYY-MM-DD date string is overdue (strictly before today) ─────
export const isOverdue = (dateStr?: string): boolean => {
  if (!dateStr) return false;
  return dateStr < todayString();
};

// ─── Check if a YYYY-MM-DD date string is exactly today ──────────────────────
export const isToday = (dateStr?: string): boolean => {
  if (!dateStr) return false;
  return dateStr === todayString();
};

// ─── Format an ISO/date string to "Apr 9" style ───────────────────────────────
export const formatShortDate = (dateStr?: string): string => {
  if (!dateStr) return "Not set";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

// ─── Relative timestamp: "3m ago" / "2h ago" / "Apr 9" ───────────────────────
export const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

// ─── Full readable date for tooltips: "Mon, Apr 9, 2026, 02:30 PM" ───────────
export const fullDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
