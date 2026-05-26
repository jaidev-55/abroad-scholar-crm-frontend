import {
  RiMoneyDollarCircleLine,
  RiPriceTag3Line,
  RiLineChartLine,
  RiRefreshLine,
  RiThermometerLine,
  RiTimeLine,
  RiAddLine,
} from "react-icons/ri";
import type { RuleTemplate } from "../types/Index";
import { ALERT_TYPE_CONFIG } from "../types/Constants";


interface Props {
  templates: RuleTemplate[];
  loading?: boolean;
  onSelect: (template: RuleTemplate) => void;
}

const ICON_MAP: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  money: RiMoneyDollarCircleLine,
  tag: RiPriceTag3Line,
  chart: RiLineChartLine,
  sync: RiRefreshLine,
  quality: RiThermometerLine,
  clock: RiTimeLine,
};

const RuleTemplatesGrid: React.FC<Props> = ({
  templates,
  loading,
  onSelect,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
        <div className="h-5 w-40 bg-slate-200 rounded mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 bg-slate-50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Quick Templates</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Click a template to create a rule instantly
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {templates.map((t) => {
          const Icon = ICON_MAP[t.icon] || RiMoneyDollarCircleLine;
          const typeCfg = ALERT_TYPE_CONFIG[t.type];

          return (
            <button
              key={t.id}
              onClick={() => onSelect(t)}
              className="text-left border border-slate-100 rounded-xl p-3.5 hover:border-slate-200 hover:shadow-md hover:shadow-slate-200/50 hover:-translate-y-0.5 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${typeCfg?.iconBg}`}
                >
                  <Icon size={15} className={typeCfg?.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-slate-800 truncate">
                    {t.name}
                  </p>
                </div>
                <RiAddLine
                  size={14}
                  className="text-slate-300 group-hover:text-blue-500 transition-colors shrink-0"
                />
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                {t.description}
              </p>
              <div className="mt-2 text-[9px] text-slate-400">
                Default: {t.defaultCondition.metric}{" "}
                {t.defaultCondition.operator === "gt" ? ">" : "<"}{" "}
                {t.defaultCondition.unit}
                {t.defaultCondition.value}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RuleTemplatesGrid;
