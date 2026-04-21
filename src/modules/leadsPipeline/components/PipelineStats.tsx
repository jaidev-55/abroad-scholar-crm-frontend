import React from "react";
import {
  RiUserLine,
  RiSparklingLine,
  RiTimeLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiBookOpenLine,
  RiBuilding2Line,
} from "react-icons/ri";
import StatsCard from "../../../components/common/StatsCard";

interface Stats {
  total: number;
  newToday: number;
  followUpsDue: number;
  converted: number;
  lost: number;
  academic?: number;
  admission?: number;
}

interface Props {
  stats: Stats;
}

const PipelineStats: React.FC<Props> = ({ stats }) => {
  const statCards = [
    {
      label: "Total Leads",
      value: stats.total,
      icon: RiUserLine,
      twIconBg: "bg-blue-50",
      twIconText: "text-blue-500",
      twBarBg: "bg-blue-500",
    },
    {
      label: "New Today",
      value: stats.newToday,
      icon: RiSparklingLine,
      twIconBg: "bg-violet-50",
      twIconText: "text-violet-500",
      twBarBg: "bg-violet-500",
    },
    {
      label: "Follow-ups Due",
      value: stats.followUpsDue,
      icon: RiTimeLine,
      twIconBg: "bg-amber-50",
      twIconText: "text-amber-500",
      twBarBg: "bg-amber-500",
    },
    {
      label: "Converted",
      value: stats.converted,
      icon: RiCheckboxCircleLine,
      twIconBg: "bg-emerald-50",
      twIconText: "text-emerald-500",
      twBarBg: "bg-emerald-500",
    },
    {
      label: "Lost Leads",
      value: stats.lost,
      icon: RiCloseCircleLine,
      twIconBg: "bg-red-50",
      twIconText: "text-red-500",
      twBarBg: "bg-red-500",
    },
    {
      label: "Academic",
      value: stats.academic ?? 0,
      icon: RiBookOpenLine,
      twIconBg: "bg-violet-50",
      twIconText: "text-violet-600",
      twBarBg: "bg-violet-600",
    },
    {
      label: "Admission",
      value: stats.admission ?? 0,
      icon: RiBuilding2Line,
      twIconBg: "bg-cyan-50",
      twIconText: "text-cyan-500",
      twBarBg: "bg-cyan-500",
    },
  ];

  return (
    <div className="grid grid-cols-7 gap-3">
      {statCards.map((stat) => (
        <StatsCard key={stat.label} {...stat} />
      ))}
    </div>
  );
};

export default PipelineStats;
