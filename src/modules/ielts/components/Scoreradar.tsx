import React from "react";
import type { IeltsScore, IeltsTargetScore } from "../Types";

interface ScoreRadarProps {
  current: IeltsScore | null;
  target: IeltsTargetScore;
  size?: number;
}

const ScoreRadar: React.FC<ScoreRadarProps> = ({
  current,
  target,
  size = 200,
}) => {
  const modules = ["listening", "reading", "writing", "speaking"] as const;
  const labels = ["Listening", "Reading", "Writing", "Speaking"];
  const cx = size / 2;
  const cy = size / 2;
  const maxScore = 9;
  const radius = (size / 2) * 0.72;

  const getPoint = (i: number, score: number): [number, number] => {
    const angle = (Math.PI * 2 * i) / 4 - Math.PI / 2;
    const r = (score / maxScore) * radius;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  };

  const poly = (scores: (number | null)[]) =>
    scores.map((s, i) => getPoint(i, s ?? 0).join(",")).join(" ");

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="shrink-0"
    >
      {[3, 5, 7, 9].map((lv) => (
        <polygon
          key={lv}
          points={modules.map((_, i) => getPoint(i, lv).join(",")).join(" ")}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={0.5}
        />
      ))}

      {modules.map((_, i) => {
        const [px, py] = getPoint(i, maxScore);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={px}
            y2={py}
            stroke="#e2e8f0"
            strokeWidth={0.5}
          />
        );
      })}

      <polygon
        points={poly(modules.map((m) => target[m]))}
        fill="rgba(239,68,68,0.06)"
        stroke="#ef4444"
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />

      {current && (
        <polygon
          points={poly(modules.map((m) => current[m]))}
          fill="rgba(59,130,246,0.1)"
          stroke="#3b82f6"
          strokeWidth={2}
        />
      )}

      {current &&
        modules.map((m, i) => {
          if (current[m] === null) return null;
          const [px, py] = getPoint(i, current[m]!);
          return (
            <circle
              key={m}
              cx={px}
              cy={py}
              r={3.5}
              fill="#3b82f6"
              stroke="white"
              strokeWidth={2}
            />
          );
        })}

      {labels.map((label, i) => {
        const [px, py] = getPoint(i, maxScore + 1.4);
        return (
          <text
            key={i}
            x={px}
            y={py}
            textAnchor="middle"
            dominantBaseline="central"
            className="text-[9px] fill-slate-400 font-semibold"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
};

export default ScoreRadar;
