import React from "react";
import { FiKey, FiLock, FiLogOut } from "react-icons/fi";

interface Props {
  onChangePassword: () => void;
}

const ProfileSecurityCard: React.FC<Props> = ({ onChangePassword }) => {
  const handleSignOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-50">
        <h3 className="text-[13px] font-bold text-slate-800">Security</h3>
      </div>

      <div className="divide-y divide-slate-50">
        {/* Change password */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
              <FiKey size={14} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-slate-800">
                Password
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Keep your account secure with a strong password
              </p>
            </div>
          </div>
          <button
            onClick={onChangePassword}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-[12px] font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer transition-all shadow-sm"
          >
            <FiLock size={11} /> Change
          </button>
        </div>

        {/* Sign out */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
              <FiLogOut size={14} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-slate-800">
                Sign Out
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Sign out from your current session
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-red-200 bg-red-50 text-[12px] font-semibold text-red-600 hover:bg-red-100 cursor-pointer transition-all"
          >
            <FiLogOut size={11} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSecurityCard;
