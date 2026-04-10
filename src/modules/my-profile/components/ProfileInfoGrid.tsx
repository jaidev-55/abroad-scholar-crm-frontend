import React, { useState } from "react";
import { FiShield, FiUser, FiCheckCircle, FiCopy } from "react-icons/fi";
import { message } from "antd";
import { getRoleConfig } from "../utils/helpers";

interface Props {
  role: string;
  userId: string;
}

const ProfileInfoGrid: React.FC<Props> = ({ role, userId }) => {
  const [copied, setCopied] = useState(false);
  const roleConfig = getRoleConfig(role);

  const copyId = () => {
    navigator.clipboard.writeText(userId);
    setCopied(true);
    message.success("User ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-2 gap-4 mb-5">
      {/* Role card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <div className="flex items-center gap-2.5 mb-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: roleConfig.bg, color: roleConfig.color }}
          >
            <FiShield size={15} />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Role
          </p>
        </div>
        <p
          className="text-[15px] font-bold"
          style={{ color: roleConfig.color }}
        >
          {roleConfig.label}
        </p>
        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
          {roleConfig.desc}
        </p>
      </div>

      {/* User ID card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
            <FiUser size={15} />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            User ID
          </p>
        </div>
        <div className="flex items-center gap-2">
          <code className="text-[11px] font-mono text-slate-700 bg-slate-50 rounded-lg px-2.5 py-1.5 border border-slate-100 truncate flex-1">
            {userId}
          </code>
          <button
            onClick={copyId}
            className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all cursor-pointer"
            style={{
              borderColor: copied ? "#bfdbfe" : "#e2e8f0",
              backgroundColor: copied ? "#eff6ff" : "transparent",
            }}
          >
            {copied ? (
              <FiCheckCircle size={13} className="text-blue-500" />
            ) : (
              <FiCopy size={13} className="text-slate-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoGrid;
