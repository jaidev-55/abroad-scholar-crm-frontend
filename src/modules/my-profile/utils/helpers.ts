import { AVATAR_COLORS, ROLE_CONFIG } from "./constants";

export const getAvatarColor = (str: string): string =>
  AVATAR_COLORS[str.charCodeAt(0) % AVATAR_COLORS.length];

export const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const getRoleConfig = (role: string) =>
  ROLE_CONFIG[role] ?? {
    color: "#6b7280",
    bg: "#f9fafb",
    border: "#e5e7eb",
    label: role,
    desc: "Standard access",
  };

export const getStrength = (
  pw: string,
): { label: string; color: string; width: string } => {
  if (!pw) return { label: "", color: "", width: "0%" };
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1) return { label: "Weak", color: "#ef4444", width: "20%" };
  if (s <= 2) return { label: "Fair", color: "#f59e0b", width: "40%" };
  if (s <= 3) return { label: "Good", color: "#3b82f6", width: "65%" };
  return { label: "Strong", color: "#22c55e", width: "100%" };
};
