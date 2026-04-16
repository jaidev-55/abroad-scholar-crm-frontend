import React from "react";
import { HiOutlineSparkles } from "react-icons/hi";
import type { CounselorItem } from "../api/dashboard";

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-pink-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-purple-500",
];

interface Props {
  counselors: CounselorItem[];
}

const CounselorLeaderboard: React.FC<Props> = ({ counselors }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h3 className="text-sm font-bold text-slate-900">Top Counselors</h3>
        <p className="text-xs text-slate-500">Conversion leaderboard</p>
      </div>
      <HiOutlineSparkles className="h-4 w-4 text-blue-500" />
    </div>
    {counselors.length === 0 ? (
      <p className="py-8 text-center text-xs text-slate-400">
        No counselor matches this filter
      </p>
    ) : (
      <div className="space-y-4">
        {counselors.map((c, i) => {
          const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
          return (
            <div key={c.id}>
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full ${color} text-xs font-bold text-white`}
                  >
                    {c.initials}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800">
                      {c.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {c.totalLeads} leads · {c.converted} converted
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {i === 0 && counselors.length > 1 && (
                    <span className="text-xs">🏆</span>
                  )}
                  <span className="text-xs font-bold text-slate-700">
                    {c.conversionRate}%
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${color} transition-all duration-500`}
                  style={{ width: `${Math.min(c.conversionRate * 2, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

export default CounselorLeaderboard;
