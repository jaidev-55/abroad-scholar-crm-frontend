import React from "react";
import { RiUserLine } from "react-icons/ri";

interface UserAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const COLOR_MAP = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
  "bg-pink-100 text-pink-700",
  "bg-teal-100 text-teal-700",
  "bg-indigo-100 text-indigo-700",
  "bg-orange-100 text-orange-700",
];

const SIZE_MAP = {
  sm: "w-7 h-7 text-[10px] rounded-lg",
  md: "w-8 h-8 text-xs rounded-xl",
  lg: "w-10 h-10 text-sm rounded-xl",
  xl: "w-12 h-12 text-base rounded-2xl",
};

const UserAvatar: React.FC<UserAvatarProps> = ({ name, size = "md" }) => {
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("");
  const idx =
    (name || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0) %
    COLOR_MAP.length;

  return (
    <div
      className={`flex items-center justify-center font-bold shrink-0 select-none ${SIZE_MAP[size]} ${
        initials ? COLOR_MAP[idx] : "bg-slate-100 text-slate-400"
      }`}
    >
      {initials || <RiUserLine className="w-1/2 h-1/2" />}
    </div>
  );
};

export default UserAvatar;
