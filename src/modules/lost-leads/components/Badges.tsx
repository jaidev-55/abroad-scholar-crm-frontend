import React from "react";
import {
  RiUserLine,
  RiFireLine,
  RiFlashlightLine,
  RiSnowflakeLine,
} from "react-icons/ri";
import { getInitials, getAvatarClasses } from "../utils";
import { STAGES, LOST_REASONS } from "../constants/constant";
import type { LostReason } from "../types";

interface UserAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  size = "md",
}) => {
  const initials = getInitials(name);
  const [bgClass, textClass] = getAvatarClasses(name);
  const sizeMap: Record<string, string> = {
    sm: "w-7 h-7 text-[10px] rounded-lg",
    md: "w-8 h-8 text-xs rounded-xl",
    lg: "w-10 h-10 text-sm rounded-xl",
    xl: "w-12 h-12 text-base rounded-2xl",
  };
  return (
    <div
      className={`flex items-center justify-center font-bold shrink-0 select-none ${sizeMap[size]} ${bgClass} ${textClass}`}
    >
      {initials || <RiUserLine className="w-1/2 h-1/2" />}
    </div>
  );
};

// ─── PriorityBadge ────────────────────────────────────────────

type Priority = "HOT" | "WARM" | "COLD";

interface PriorityBadgeProps {
  priority: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const cfg: Record<
    Priority,
    { cls: string; icon: React.ReactNode; label: string }
  > = {
    HOT: {
      cls: "text-red-600 bg-red-50 border-red-200",
      icon: <RiFireLine size={11} />,
      label: "Hot",
    },
    WARM: {
      cls: "text-amber-600 bg-amber-50 border-amber-200",
      icon: <RiFlashlightLine size={11} />,
      label: "Warm",
    },
    COLD: {
      cls: "text-blue-600 bg-blue-50 border-blue-200",
      icon: <RiSnowflakeLine size={11} />,
      label: "Cold",
    },
  };

  const c = cfg[priority as Priority];
  if (!c) return <span className="text-xs text-slate-400">{priority}</span>;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${c.cls}`}
    >
      {c.icon} {c.label}
    </span>
  );
};

// StageBadge

interface StageBadgeProps {
  stageId: string | null | undefined;
}

export const StageBadge: React.FC<StageBadgeProps> = ({ stageId }) => {
  const stage = STAGES.find((s) => s.id === stageId);
  if (!stage) return <span className="text-xs text-slate-400">—</span>;
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-semibold border ${stage.twBg} ${stage.twText} ${stage.twBorder}`}
    >
      {stage.label}
    </span>
  );
};

// ─── LostReasonBadge ──────────────────────────────────────────

interface LostReasonBadgeProps {
  reasonValue: LostReason | null | undefined;
}

export const LostReasonBadge: React.FC<LostReasonBadgeProps> = ({
  reasonValue,
}) => {
  const reason = LOST_REASONS.find((r) => r.value === reasonValue);
  if (!reason) return <span className="text-xs text-slate-400">—</span>;
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
      {reason.icon}
      {reason.label}
    </span>
  );
};
