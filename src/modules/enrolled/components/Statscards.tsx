import React from "react";
import {
  RiGroupLine,
  RiShieldCheckLine,
  RiPassportLine,
  RiMoneyDollarCircleLine,
  RiCheckboxCircleLine,
  RiFlightTakeoffLine,
  RiAlertLine,
  RiTimeLine,
} from "react-icons/ri";
import StatCard from "../../../components/common/StatsCard";
import type { EnrolledStats } from "../api/ Enrolledapi";

interface StatsCardsProps {
  stats: EnrolledStats | null | undefined;
  isLoading?: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, isLoading }) => {
  const cards = [
    {
      label: "Total Enrolled",
      value: stats?.totalEnrolled ?? 0,
      icon: RiGroupLine,
      twIconBg: "bg-blue-50",
      twIconText: "text-blue-600",
      twBarBg: "bg-blue-500",
    },
    {
      label: "Visa Approved",
      value: stats?.visaApproved ?? 0,
      icon: RiShieldCheckLine,
      twIconBg: "bg-emerald-50",
      twIconText: "text-emerald-600",
      twBarBg: "bg-emerald-500",
    },
    {
      label: "Visa In Progress",
      value: stats?.visaInProgress ?? 0,
      icon: RiPassportLine,
      twIconBg: "bg-violet-50",
      twIconText: "text-violet-600",
      twBarBg: "bg-violet-500",
    },
    {
      label: "Visa Not Started",
      value: stats?.visaNotStarted ?? 0,
      icon: RiTimeLine,
      twIconBg: "bg-amber-50",
      twIconText: "text-amber-600",
      twBarBg: "bg-amber-500",
    },
    {
      label: "Fee Paid",
      value: stats?.feePaid ?? 0,
      icon: RiCheckboxCircleLine,
      twIconBg: "bg-teal-50",
      twIconText: "text-teal-600",
      twBarBg: "bg-teal-500",
    },
    {
      label: "Fee Pending",
      value: stats?.feePending ?? 0,
      icon: RiMoneyDollarCircleLine,
      twIconBg: "bg-orange-50",
      twIconText: "text-orange-600",
      twBarBg: "bg-orange-500",
    },
    {
      label: "Travel Ready",
      value: stats?.travelReady ?? 0,
      icon: RiFlightTakeoffLine,
      twIconBg: "bg-cyan-50",
      twIconText: "text-cyan-600",
      twBarBg: "bg-cyan-500",
    },
    {
      label: "At Risk",
      value: stats?.atRisk ?? 0,
      icon: RiAlertLine,
      twIconBg: "bg-red-50",
      twIconText: "text-red-600",
      twBarBg: "bg-red-500",
    },
  ];

  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {cards.map((card) => (
        <div key={card.label} className="min-w-[150px] flex-1">
          <StatCard
            label={card.label}
            value={card.value}
            icon={card.icon}
            twIconBg={card.twIconBg}
            twIconText={card.twIconText}
            twBarBg={card.twBarBg}
            isLoading={isLoading}
          />
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
