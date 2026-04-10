import React from "react";
import { FiEdit2, FiShield } from "react-icons/fi";
import { getAvatarColor, getInitials, getRoleConfig } from "../utils/helpers";

interface Props {
  displayName: string;
  email: string;
  role: string;
  onEdit: () => void;
}

const ProfileHeroCard: React.FC<Props> = ({
  displayName,
  email,
  role,
  onEdit,
}) => {
  const roleConfig = getRoleConfig(role);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-5">
      {/* Banner */}
      <div
        className="h-32 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.10) 1.5px, transparent 1.5px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div
          className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/10"
          style={{ filter: "blur(25px)" }}
        />
        <div
          className="absolute -bottom-8 -left-4 w-28 h-28 rounded-full bg-white/10"
          style={{ filter: "blur(20px)" }}
        />

        <div className="absolute bottom-4 left-[104px] right-5 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-[17px] font-black text-white leading-tight drop-shadow">
              {displayName}
            </h2>
            <p className="text-[12px] text-white/70 mt-0.5">{email}</p>
          </div>
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-[12px] font-semibold text-white cursor-pointer transition-all shrink-0 backdrop-blur-sm"
          >
            <FiEdit2 size={12} /> Edit Profile
          </button>
        </div>
      </div>

      {/* Avatar + role badge */}
      <div className="px-5 pb-4 relative">
        <div className="absolute -top-9 left-5">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-xl ring-[3px] ring-white"
            style={{ backgroundColor: getAvatarColor(displayName) }}
          >
            {getInitials(displayName)}
          </div>
        </div>

        <div className="pt-10 pl-1 flex items-center gap-2 flex-wrap">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border"
            style={{
              color: roleConfig.color,
              backgroundColor: roleConfig.bg,
              borderColor: roleConfig.border,
            }}
          >
            <FiShield size={11} /> {roleConfig.label}
          </span>
          <span className="text-[11px] text-slate-400">{roleConfig.desc}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeroCard;
