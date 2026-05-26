import React from "react";
import { getBandInfo } from "../Types/Constants";

interface ScoreProgressProps {
  label: string;
  icon: string;
  current: number | null;
  target: number;
}

const ScoreProgress: React.FC<ScoreProgressProps> = ({
  label,
  icon,
  current,
  target,
}) => {
  const pct = current !== null ? Math.min((current / 9) * 100, 100) : 0;
  const targetPct = (target / 9) * 100;
  const met = current !== null && current >= target;
  const band = getBandInfo(current);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{icon}</span>
          <span className="text-xs font-medium text-slate-600">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold" style={{ color: band.color }}>
            {current !== null ? current.toFixed(1) : "—"}
          </span>
          <span className="text-[10px] text-slate-400">
            / {target.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="relative h-2 bg-slate-100 rounded-full overflow-visible">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            backgroundColor: met ? "#10b981" : band.color,
          }}
        />
        <div
          className="absolute top-[-3px] bottom-[-3px] w-0.5 bg-red-400 rounded-full"
          style={{ left: `${targetPct}%` }}
        />
      </div>
    </div>
  );
};

export default ScoreProgress;
