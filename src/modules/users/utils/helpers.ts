import { AVATAR_COLORS, ROLE_CONFIG, type User } from "./constants";

export const getAvatarColor = (name: string): string =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

export const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const getRoleStyle = (role: string) =>
  ROLE_CONFIG[role] ?? {
    color: "#6b7280",
    bg: "#f9fafb",
    border: "#e5e7eb",
    label: role,
  };

export const formatJoinDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const formatJoinTime = (iso: string): string =>
  new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const exportUsersCSV = (users: User[]): void => {
  const csv = [
    ["Name", "Email", "Role", "Joined"],
    ...users.map((u) => [u.name, u.email, u.role, formatJoinDate(u.createdAt)]),
  ]
    .map((r) => r.join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `users_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
