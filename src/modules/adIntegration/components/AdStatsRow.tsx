import React from "react";
import {
  RiFileListLine,
  RiSignalTowerLine,
  RiMetaLine,
  RiGoogleLine,
} from "react-icons/ri";
import StatCard from "../../../components/common/StatsCard";
import type { WebhookConfig } from "../../../api/webhook";

interface Props {
  configs: WebhookConfig[];
}

const AdStatsRow: React.FC<Props> = ({ configs }) => {
  const stats = [
    {
      label: "Total Forms",
      value: configs.length,
      icon: RiFileListLine,
      twIconBg: "bg-slate-100",
      twIconText: "text-slate-600",
      twBarBg: "bg-slate-400",
    },
    {
      label: "Active",
      value: configs.filter((c) => c.isActive).length,
      icon: RiSignalTowerLine,
      twIconBg: "bg-emerald-50",
      twIconText: "text-emerald-600",
      twBarBg: "bg-emerald-400",
    },
    {
      label: "Meta Forms",
      value: configs.filter((c) => c.platform === "META").length,
      icon: RiMetaLine,
      twIconBg: "bg-blue-50",
      twIconText: "text-blue-600",
      twBarBg: "bg-blue-400",
    },
    {
      label: "Google Forms",
      value: configs.filter((c) => c.platform === "GOOGLE").length,
      icon: RiGoogleLine,
      twIconBg: "bg-amber-50",
      twIconText: "text-amber-600",
      twBarBg: "bg-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
};

export default AdStatsRow;
