import React from "react";

interface SourceBadgeProps {
  source: string;
}

const SourceBadge: React.FC<SourceBadgeProps> = ({ source }) => {
  const colors: Record<string, string> = {
    Website: "text-blue-700 bg-blue-50 border-blue-200",
    Referral: "text-emerald-700 bg-emerald-50 border-emerald-200",
    Facebook: "text-indigo-700 bg-indigo-50 border-indigo-200",
    Instagram: "text-pink-700 bg-pink-50 border-pink-200",
    "Walk-in": "text-amber-700 bg-amber-50 border-amber-200",
    "Google Ads": "text-yellow-700 bg-yellow-50 border-yellow-200",
    "Education Fair": "text-violet-700 bg-violet-50 border-violet-200",
  };

  const defaultStyle = "text-gray-700 bg-gray-50 border-gray-200";

  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${
        colors[source] || defaultStyle
      }`}
    >
      {source}
    </span>
  );
};

export default SourceBadge;
