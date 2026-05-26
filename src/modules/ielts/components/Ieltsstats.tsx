import React from "react";
import { RiGroupLine, RiBookOpenLine, RiCalendarScheduleLine, RiCheckboxCircleLine, RiLineChartLine, RiTrophyLine, RiTimeLine, RiAlertLine } from "react-icons/ri";

import type { IeltsStatsData } from "../Types";
import StatCard from "../../../components/common/StatsCard";


const IeltsStats: React.FC<{ stats: IeltsStatsData }> = ({ stats }) => {
  const cards = [
    {
      label: "Total Students",
      value: stats.totalStudents,
      icon: RiGroupLine,
      twIconBg: "bg-blue-50",
      twIconText: "text-blue-500",
      twBarBg: "bg-blue-400",
    },
    {
      label: "Preparing",
      value: stats.preparing,
      icon: RiBookOpenLine,
      twIconBg: "bg-amber-50",
      twIconText: "text-amber-500",
      twBarBg: "bg-amber-400",
    },
    {
      label: "Scheduled",
      value: stats.scheduled,
      icon: RiCalendarScheduleLine,
      twIconBg: "bg-indigo-50",
      twIconText: "text-indigo-500",
      twBarBg: "bg-indigo-400",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: RiCheckboxCircleLine,
      twIconBg: "bg-emerald-50",
      twIconText: "text-emerald-500",
      twBarBg: "bg-emerald-400",
    },
    {
      label: "Avg. Score",
      value: stats.avgOverallScore,
      icon: RiLineChartLine,
      twIconBg: "bg-purple-50",
      twIconText: "text-purple-500",
      twBarBg: "bg-purple-400",
    },
    {
      label: "Target Met",
      value: stats.targetMet,
      icon: RiTrophyLine,
      twIconBg: "bg-green-50",
      twIconText: "text-green-500",
      twBarBg: "bg-green-400",
    },
    {
      label: "Upcoming Exams",
      value: stats.upcomingExams,
      icon: RiTimeLine,
      twIconBg: "bg-cyan-50",
      twIconText: "text-cyan-500",
      twBarBg: "bg-cyan-400",
    },
    {
      label: "Not Started",
      value: stats.notStarted,
      icon: RiAlertLine,
      twIconBg: "bg-slate-50",
      twIconText: "text-slate-400",
      twBarBg: "bg-slate-300",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {cards.map((c) => (
        <StatCard key={c.label} {...c} />
      ))}
    </div>
  );
};

export default IeltsStats;
