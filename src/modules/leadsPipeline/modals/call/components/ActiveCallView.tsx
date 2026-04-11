import React from "react";
import {
  RiPhoneLine,
  RiCloseLine,
  RiCheckLine,
  RiUserLine,
  RiMicLine,
  RiMicOffLine,
  RiVolumeUpLine,
  RiVolumeMuteLine,
} from "react-icons/ri";

import UserAvatar from "./UserAvatar";
import type { CallStatus, Lead } from "../../../utils/calls/types";
import { formatTimer } from "../../../utils/calls/helpers";

interface Props {
  lead: Lead;
  status: CallStatus;
  seconds: number;
  muted: boolean;
  speaker: boolean;
  onCall: () => void;
  onCancelCall: () => void;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleSpeaker: () => void;
}

const ActiveCallView: React.FC<Props> = ({
  lead,
  status,
  seconds,
  muted,
  speaker,
  onCall,
  onCancelCall,
  onEndCall,
  onToggleMute,
  onToggleSpeaker,
}) => (
  <div className="flex flex-col items-center px-6 pb-6 pt-5 shrink-0">
    {/* Avatar with ring animation */}
    <div className="relative mb-5">
      {status === "calling" && (
        <>
          <div
            className="absolute -inset-5 rounded-3xl bg-emerald-500 opacity-20"
            style={{ animation: "callRing 1.5s ease-in-out infinite" }}
          />
          <div
            className="absolute -inset-3 rounded-3xl bg-emerald-500 opacity-15"
            style={{ animation: "callRing 1.5s ease-in-out 0.5s infinite" }}
          />
        </>
      )}
      {status === "connected" && (
        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center z-10">
          <RiCheckLine size={11} className="text-white" />
        </div>
      )}
      <UserAvatar name={lead.name} size={84} />
    </div>

    <h2 className="text-[18px] font-bold text-slate-900">{lead.name}</h2>
    <p className="text-[13px] text-slate-400 font-medium mt-0.5">
      {lead.phone}
    </p>
    <div className="flex items-center gap-1.5 mt-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
      <RiUserLine size={10} className="text-slate-400" />
      <span className="text-[11px] text-slate-500 font-medium">
        {lead.counselor}
      </span>
    </div>

    {/* Timer */}
    {status === "connected" && (
      <div className="mt-4 flex items-center gap-2.5 px-6 py-3 bg-emerald-50 rounded-2xl border border-emerald-100">
        <div
          className="w-2 h-2 rounded-full bg-emerald-500"
          style={{ animation: "pulseGreen 1.5s infinite" }}
        />
        <span className="text-2xl font-bold text-emerald-600 tabular-nums tracking-widest">
          {formatTimer(seconds)}
        </span>
      </div>
    )}

    {/* Controls during call */}
    {status === "connected" && (
      <div className="flex items-center gap-6 mt-7">
        <button
          onClick={onToggleMute}
          className="flex flex-col items-center gap-1.5 cursor-pointer border-none bg-transparent outline-none group"
        >
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-105 ${muted ? "bg-red-100 text-red-500" : "bg-slate-100 text-slate-500"}`}
          >
            {muted ? <RiMicOffLine size={20} /> : <RiMicLine size={20} />}
          </div>
          <span className="text-[10px] font-semibold text-slate-400">
            {muted ? "Unmute" : "Mute"}
          </span>
        </button>

        <button
          onClick={onEndCall}
          className="flex flex-col items-center gap-1.5 cursor-pointer border-none bg-transparent outline-none group"
        >
          <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-200 transition-all group-hover:scale-105 group-active:scale-95">
            <RiPhoneLine size={26} className="text-white rotate-[135deg]" />
          </div>
          <span className="text-[10px] font-semibold text-slate-400">
            End Call
          </span>
        </button>

        <button
          onClick={onToggleSpeaker}
          className="flex flex-col items-center gap-1.5 cursor-pointer border-none bg-transparent outline-none group"
        >
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-105 ${speaker ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}
          >
            {speaker ? (
              <RiVolumeUpLine size={20} />
            ) : (
              <RiVolumeMuteLine size={20} />
            )}
          </div>
          <span className="text-[10px] font-semibold text-slate-400">
            {speaker ? "Speaker" : "Earpiece"}
          </span>
        </button>
      </div>
    )}

    {/* Idle — call button */}
    {status === "idle" && (
      <button
        onClick={onCall}
        className="mt-7 w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white text-[13px] font-bold border-none cursor-pointer bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-200 hover:opacity-90 active:scale-95 transition-all outline-none"
      >
        <RiPhoneLine size={16} /> Call {lead.name.split(" ")[0]}
      </button>
    )}

    {/* Calling — cancel */}
    {status === "calling" && (
      <div className="mt-7 w-full flex flex-col items-center gap-3">
        <p className="text-[12px] text-slate-400 animate-pulse font-medium">
          Dialing {lead.phone}…
        </p>
        <button
          onClick={onCancelCall}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white text-[13px] font-bold border-none cursor-pointer bg-red-500 shadow-lg shadow-red-200 hover:opacity-90 active:scale-95 transition-all outline-none"
        >
          <RiCloseLine size={16} /> Cancel
        </button>
      </div>
    )}
  </div>
);

export default ActiveCallView;
