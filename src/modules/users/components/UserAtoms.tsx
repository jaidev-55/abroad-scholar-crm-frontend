import React from "react";
import { getRoleStyle, getAvatarColor, getInitials } from "../utils/helpers";

// ─── User Avatar ──────────────────────────────────────────────────────────────
export const UserAvatar: React.FC<{ name: string; size?: number }> = ({
  name,
  size = 38,
}) => (
  <div
    className="flex items-center justify-center font-bold shrink-0 select-none rounded-xl"
    style={{
      width: size,
      height: size,
      background: `${getAvatarColor(name)}18`,
      color: getAvatarColor(name),
      fontSize: size * 0.34,
      borderRadius: size * 0.3,
    }}
  >
    {getInitials(name)}
  </div>
);

// ─── Role Badge ───────────────────────────────────────────────────────────────
export const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
  const s = getRoleStyle(role);
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold border"
      style={{ color: s.color, background: s.bg, borderColor: s.border }}
    >
      {s.label}
    </span>
  );
};
