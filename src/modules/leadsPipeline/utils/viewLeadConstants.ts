import type { ActivityType } from "../types/Viewlead";

// ─── Activity type visual config (colors/labels only — icons in viewLeadConfig.tsx) ──
export const ACTIVITY_STYLE: Record<
  ActivityType,
  { color: string; bg: string; border: string; label: string }
> = {
  created: {
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
    label: "Created",
  },
  stage_change: {
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    label: "Stage Change",
  },
  note_added: {
    color: "#0891b2",
    bg: "#ecfeff",
    border: "#a5f3fc",
    label: "Note",
  },
  call: { color: "#059669", bg: "#f0fdf4", border: "#bbf7d0", label: "Call" },
  email: { color: "#d97706", bg: "#fffbeb", border: "#fde68a", label: "Email" },
  edit: {
    color: "#475569",
    bg: "#f8fafc",
    border: "#e2e8f0",
    label: "Updated",
  },
  followup_set: {
    color: "#db2777",
    bg: "#fdf2f8",
    border: "#fbcfe8",
    label: "Follow-up",
  },
  overdue: {
    color: "#ef4444",
    bg: "#fff5f5",
    border: "#fed7d7",
    label: "Overdue",
  },
};

// ─── Priority colors ──────────────────────────────────────────────────────────
export const PRIORITY_STYLE: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  Hot: { color: "#ef4444", bg: "#fff5f5", border: "#fed7d7" },
  Warm: { color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
  Cold: { color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" },
};

// ─── Stage display map ────────────────────────────────────────────────────────
export const STAGE_MAP: Record<
  string,
  { label: string; color: string; bg: string; border: string }
> = {
  new: { label: "New", color: "#3B82F6", bg: "#EFF6FF", border: "#BFDBFE" },
  progress: {
    label: "In Progress",
    color: "#8B5CF6",
    bg: "#F5F3FF",
    border: "#DDD6FE",
  },
  converted: {
    label: "Converted",
    color: "#10B981",
    bg: "#ECFDF5",
    border: "#A7F3D0",
  },
  lost: { label: "Lost", color: "#EF4444", bg: "#FEF2F2", border: "#FECACA" },
};
