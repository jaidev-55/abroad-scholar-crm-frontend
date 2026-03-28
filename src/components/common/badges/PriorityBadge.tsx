import React from "react";
import { RiFireLine, RiFlashlightLine, RiSnowflakeLine } from "react-icons/ri";

interface PriorityBadgeProps {
  priority: "Hot" | "Warm" | "Cold";
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const config = {
    Hot: {
      classes: "text-red-600 bg-red-50 border-red-200",
      icon: <RiFireLine size={11} />,
    },
    Warm: {
      classes: "text-amber-600 bg-amber-50 border-amber-200",
      icon: <RiFlashlightLine size={11} />,
    },
    Cold: {
      classes: "text-blue-600 bg-blue-50 border-blue-200",
      icon: <RiSnowflakeLine size={11} />,
    },
  };

  const current = config[priority];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${current.classes}`}
    >
      {current.icon}
      {priority}
    </span>
  );
};

export default PriorityBadge;
