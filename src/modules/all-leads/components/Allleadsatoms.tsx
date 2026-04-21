import React from "react";
import {
  RiFireLine,
  RiFlashlightLine,
  RiSnowflakeLine,
  RiBookOpenLine,
  RiBuilding2Line,
} from "react-icons/ri";
import type {
  LeadStatus as ApiLeadStatus,
  LeadPriority,
} from "../../../modules/leadsPipeline/api/leads";
import {
  STATUS_CLS,
  STATUS_DOT_CLS,
  STATUS_LABEL,
  SOURCE_STYLE_MAP,
  DEFAULT_SOURCE_STYLE,
  type Priority,
} from "../utils/constants";
import {
  formatSourceLabel,
  getHue,
  getInitials,
} from "../utils/Allleadshelpers";

export const Avatar: React.FC<{ name: string; size?: number }> = ({
  name,
  size = 32,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.3,
      background: `hsl(${getHue(name)}, 55%, 90%)`,
      color: `hsl(${getHue(name)}, 45%, 32%)`,
      fontSize: size * 0.36,
      fontWeight: 700,
    }}
    className="flex items-center justify-center shrink-0 select-none"
  >
    {getInitials(name)}
  </div>
);

// ─── Priority badge ───────────────────────────────────────────────────────────
const PRIORITY_MAP: Record<
  LeadPriority,
  { label: Priority; cls: string; icon: React.ReactNode }
> = {
  HOT: {
    label: "Hot",
    cls: "text-red-600 bg-red-50 border-red-200",
    icon: <RiFireLine size={10} />,
  },
  WARM: {
    label: "Warm",
    cls: "text-amber-600 bg-amber-50 border-amber-200",
    icon: <RiFlashlightLine size={10} />,
  },
  COLD: {
    label: "Cold",
    cls: "text-blue-600 bg-blue-50 border-blue-200",
    icon: <RiSnowflakeLine size={10} />,
  },
};

export const PriBadge: React.FC<{ p: LeadPriority }> = ({ p }) => {
  const { cls, icon, label } = PRIORITY_MAP[p];
  return (
    <span
      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold border ${cls}`}
    >
      {icon}
      {label}
    </span>
  );
};

export { PRIORITY_MAP };

// ─── Status badge ─────────────────────────────────────────────────────────────
export const StatusBadge: React.FC<{ s: ApiLeadStatus }> = ({ s }) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_CLS[s]}`}
  >
    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT_CLS[s]}`} />
    {STATUS_LABEL[s]}
  </span>
);

// ─── Source badge ─────────────────────────────────────────────────────────────
export const SrcBadge: React.FC<{ src: string }> = ({ src }) => {
  if (!src) return <span className="text-[11px] text-slate-300">—</span>;
  return (
    <span
      className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${SOURCE_STYLE_MAP[src] ?? DEFAULT_SOURCE_STYLE}`}
    >
      {formatSourceLabel(src)}
    </span>
  );
};

const CATEGORY_CONFIG = {
  ACADEMIC: {
    icon: RiBookOpenLine,
    label: "Academic",
    cls: "bg-violet-50 text-violet-700 border-violet-200",
  },
  ADMISSION: {
    icon: RiBuilding2Line,
    label: "Admission",
    cls: "bg-blue-50 text-blue-700 border-blue-200",
  },
} as const;

export const CategoryBadge: React.FC<{ category?: string | null }> = ({
  category,
}) => {
  if (!category) return <span className="text-[11px] text-slate-300">—</span>;
  const cfg = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
  if (!cfg) return <span className="text-[11px] text-slate-300">—</span>;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${cfg.cls}`}
    >
      <Icon size={10} /> {cfg.label}
    </span>
  );
};

// ─── Stat card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ size?: number }>;
  colorCls: string;
  barCls: string;

  loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  colorCls,
  barCls,

  loading,
}) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-3 flex items-center gap-3 relative overflow-hidden hover:shadow-md hover:shadow-slate-100 transition-all duration-200 cursor-default">
    <div
      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${colorCls}`}
    >
      <Icon size={20} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
        {label}
      </p>
      <div className="flex items-baseline gap-1.5 mt-0.5">
        {loading ? (
          <div className="h-7 w-10 bg-slate-100 animate-pulse rounded-lg" />
        ) : (
          <p className="text-2xl font-black text-slate-900 leading-none">
            {value}
          </p>
        )}
      </div>
    </div>
    <div className={`absolute bottom-0 left-0 right-0 h-[3px] ${barCls}`} />
  </div>
);
