export const ROLE_CONFIG: Record<
  string,
  { color: string; bg: string; border: string; label: string; desc: string }
> = {
  ADMIN: {
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    label: "Administrator",
    desc: "Full access to all portal features & settings",
  },
  COUNSELOR: {
    color: "#0369a1",
    bg: "#f0f9ff",
    border: "#bae6fd",
    label: "Counselor",
    desc: "Access to student pipeline, batches & counselling tools",
  },
};

export const AVATAR_COLORS = [
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#0ea5e9",
  "#14b8a6",
  "#f59e0b",
];
