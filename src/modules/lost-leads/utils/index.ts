import { AVATAR_COLORS, STAGES } from "../constants/constant";

// ─── Date Helpers ─────────────────────────────────────────────

export const daysSince = (dateStr: string): number =>
  Math.ceil((Date.now() - new Date(dateStr).getTime()) / 86400000);

export const formatDate = (
  dateStr: string,
  opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" },
): string => new Date(dateStr).toLocaleDateString("en-US", opts);

// ─── Avatar Helpers ────────────────────────────────────────────

export const getInitials = (name: string): string =>
  name
    ?.split(" ")
    .map((n) => n[0])
    .join("") || "?";

export const getAvatarClasses = (name: string): [string, string] => {
  const idx =
    (name || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0) %
    AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

// ─── Stage Helper ──────────────────────────────────────────────

export const getStage = (id: string | null | undefined) =>
  STAGES.find((s) => s.id === id);
