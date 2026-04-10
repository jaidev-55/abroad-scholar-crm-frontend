import React from "react";
import { FiUsers, FiShield, FiUserPlus, FiTrendingUp } from "react-icons/fi";
import type { User } from "../utils/constants";

interface Props {
  users: User[];
}

const UserStatsRow: React.FC<Props> = ({ users }) => {
  const now = new Date();
  const thisMonth = users.filter((u) => {
    const d = new Date(u.createdAt);
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  }).length;

  const stats = [
    {
      label: "TOTAL USERS",
      value: users.length,
      icon: FiUsers,
      color: "#3b82f6",
      bg: "#eff6ff",
      border: "#bfdbfe",
      bar: "bg-blue-400",
    },
    {
      label: "ADMINS",
      value: users.filter((u) => u.role === "ADMIN").length,
      icon: FiShield,
      color: "#7c3aed",
      bg: "#f5f3ff",
      border: "#ddd6fe",
      bar: "bg-violet-400",
    },
    {
      label: "COUNSELORS",
      value: users.filter((u) => u.role === "COUNSELOR").length,
      icon: FiUserPlus,
      color: "#0369a1",
      bg: "#f0f9ff",
      border: "#bae6fd",
      bar: "bg-sky-400",
    },
    {
      label: "JOINED THIS MONTH",
      value: thisMonth,
      icon: FiTrendingUp,
      color: "#059669",
      bg: "#ecfdf5",
      border: "#a7f3d0",
      bar: "bg-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map(({ label, value, icon: Icon, color, bg, bar }) => (
        <div
          key={label}
          className="bg-white rounded-2xl border p-4 flex items-center gap-3 relative overflow-hidden hover:shadow-md hover:shadow-slate-100 transition-all duration-200 cursor-default"
        //   style={{ borderColor: border }}
        >
          {/* Icon */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: bg, color }}
          >
            <Icon size={18} />
          </div>

          {/* Text */}
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-slate-400 tracking-widest whitespace-nowrap m-0">
              {label}
            </p>
            <p
              className="text-2xl font-black leading-none mt-0.5 m-0"
              style={{ color }}
            >
              {value}
            </p>
          </div>

          {/* Bottom bar */}
          <div className={`absolute bottom-0 left-0 right-0 h-[3px] ${bar}`} />
        </div>
      ))}
    </div>
  );
};

export default UserStatsRow;
