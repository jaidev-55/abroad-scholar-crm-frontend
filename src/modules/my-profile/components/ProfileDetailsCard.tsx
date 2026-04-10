import React from "react";
import { FiUser, FiMail, FiShield, FiCheckCircle } from "react-icons/fi";
import { getRoleConfig } from "../utils/helpers";

interface Props {
  displayName: string;
  email: string;
  role: string;
  onEdit: () => void;
}

const ProfileDetailsCard: React.FC<Props> = ({
  displayName,
  email,
  role,
  onEdit,
}) => {
  const roleConfig = getRoleConfig(role);

  const rows = [
    {
      icon: <FiUser size={14} />,
      label: "Full Name",
      value: displayName,
      color: "#3b82f6",
      bg: "#eff6ff",
    },
    {
      icon: <FiMail size={14} />,
      label: "Email Address",
      value: email,
      color: "#6366f1",
      bg: "#f5f3ff",
    },
    {
      icon: <FiShield size={14} />,
      label: "Role",
      value: roleConfig.label,
      color: roleConfig.color,
      bg: roleConfig.bg,
    },
    {
      icon: <FiCheckCircle size={14} />,
      label: "Account Status",
      value: "Active",
      color: "#059669",
      bg: "#ecfdf5",
      badge: true,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-5">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-50">
        <h3 className="text-[13px] font-bold text-slate-800">
          Account Details
        </h3>
        <button
          onClick={onEdit}
          className="text-[12px] font-semibold text-blue-500 hover:text-blue-700 bg-transparent border-none cursor-pointer transition-colors"
        >
          Edit
        </button>
      </div>

      <div>
        {rows.map(({ icon, label, value, color, bg, badge }, i) => (
          <div
            key={label}
            className={`flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/50 transition-colors ${i > 0 ? "border-t border-slate-50" : ""}`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: bg, color }}
              >
                {icon}
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  {label}
                </p>
                <p className="text-[13px] font-semibold text-slate-800 mt-0.5">
                  {value}
                </p>
              </div>
            </div>
            {badge && (
              <span
                className="inline-flex items-center gap-1 text-[10px] font-bold rounded-full px-2 py-0.5"
                style={{ color, backgroundColor: bg }}
              >
                <FiCheckCircle size={10} /> Active
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileDetailsCard;
