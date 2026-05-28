import React from "react";
import { getBandInfo } from "../Types/Constants";

interface ScoreBadgeProps {
  score: number | null;
  target?: number | null;
  size?: "sm" | "md" | "lg";
  showBand?: boolean;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({
  score,
  target,
  size = "md",
  showBand = false,
}) => {
  const band = getBandInfo(score);
  const met = target != null && score !== null && score >= target;

  const sizeMap = {
    sm: "text-[11px] px-1.5 py-0.5 min-w-[32px]",
    md: "text-xs px-2 py-0.5 min-w-[40px]",
    lg: "text-sm px-2.5 py-1 min-w-[48px] font-bold",
  };

  if (score === null) {
    return <span className="text-[11px] text-slate-300 italic">—</span>;
  }

  return (
    <div className="flex items-center gap-1">
      <span
        className={`inline-flex items-center justify-center font-semibold rounded-md ${sizeMap[size]}`}
        style={{
          backgroundColor: `${band.color}14`,
          color: band.color,
          border: `1px solid ${band.color}30`,
        }}
      >
        {score.toFixed(1)}
      </span>
      {target !== undefined && (
        <span
          className={`text-[9px] font-semibold ${
            met ? "text-emerald-500" : "text-orange-400"
          }`}
        >
          {target != null && (
            <span
              className={`text-[9px] font-semibold ${met ? "text-emerald-500" : "text-orange-400"}`}
            >
              {met ? "✓" : `↑${(target - score!).toFixed(1)}`}
            </span>
          )}
        </span>
      )}
      {showBand && (
        <span className="text-[9px] text-slate-400 font-medium">
          {band.label}
        </span>
      )}
    </div>
  );
};

export default ScoreBadge;
