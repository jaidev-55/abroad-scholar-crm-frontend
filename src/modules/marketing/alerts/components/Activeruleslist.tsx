import { Switch, Tag } from "antd";
import {
  RiMoneyDollarCircleLine,
  RiLineChartLine,
  RiRefreshLine,
  RiThermometerLine,
  RiTimeLine,
  RiDeleteBinLine,
  RiEdit2Line,
} from "react-icons/ri";
import { ALERT_TYPE_CONFIG, OPERATOR_LABELS } from "../types/Constants";
import type { AlertRule } from "../types/Index";
import { timeAgo } from "../utils/Alertshelpers";


interface Props {
  rules: AlertRule[];
  loading?: boolean;
  onToggle: (ruleId: string, active: boolean) => void;
  onDelete: (ruleId: string) => void;
  onEdit: (rule: AlertRule) => void;
}

const TypeIcon = ({ type }: { type: string }) => {
  const icons: Record<
    string,
    React.ComponentType<{ size?: number; className?: string }>
  > = {
    budget: RiMoneyDollarCircleLine,
    performance: RiLineChartLine,
    sync: RiRefreshLine,
    quality: RiThermometerLine,
    response: RiTimeLine,
  };
  const Icon = icons[type] || RiMoneyDollarCircleLine;
  const cfg = ALERT_TYPE_CONFIG[type];
  return (
    <div
      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cfg?.iconBg || "bg-slate-100"}`}
    >
      <Icon size={17} className={cfg?.iconColor || "text-slate-500"} />
    </div>
  );
};

const ActiveRulesList: React.FC<Props> = ({
  rules,
  loading,
  onToggle,
  onDelete,
  onEdit,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
        <div className="h-5 w-32 bg-slate-200 rounded mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-slate-50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Alert Rules</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {rules.filter((r) => r.isActive).length} active · {rules.length}{" "}
            total
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {rules.map((rule) => {
          const typeCfg = ALERT_TYPE_CONFIG[rule.type];
          return (
            <div
              key={rule.id}
              className={`border rounded-xl p-4 transition-all ${
                rule.isActive
                  ? "border-slate-200 bg-white"
                  : "border-slate-100 bg-slate-50/50 opacity-70"
              }`}
            >
              <div className="flex items-start gap-3">
                <TypeIcon type={rule.type} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-xs font-bold text-slate-800">
                      {rule.name}
                    </h4>
                    <Tag
                      className={`${typeCfg?.bg} ${typeCfg?.text} border-0 rounded-full text-[9px] font-semibold px-2 py-0`}
                    >
                      {typeCfg?.label}
                    </Tag>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2">
                    {rule.description}
                  </p>

                  {/* Condition display */}
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                      If {rule.condition.metric}
                    </span>
                    <span className="text-slate-400">
                      {OPERATOR_LABELS[rule.condition.operator]}
                    </span>
                    <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md font-bold">
                      {rule.condition.unit}
                      {rule.condition.value}
                    </span>
                    <span className="text-slate-400">→</span>
                    <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-medium capitalize">
                      {rule.action.type.replace("_", " ")}
                    </span>
                  </div>

                  {/* Meta info */}
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                    {rule.lastTriggered && (
                      <span>Last triggered: {timeAgo(rule.lastTriggered)}</span>
                    )}
                    {rule.triggerCount > 0 && (
                      <span>Triggered {rule.triggerCount}x</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onEdit(rule)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <RiEdit2Line size={14} className="text-slate-400" />
                  </button>
                  <button
                    onClick={() => onDelete(rule.id)}
                    className="p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <RiDeleteBinLine
                      size={14}
                      className="text-slate-400 hover:text-red-500"
                    />
                  </button>
                  <Switch
                    size="small"
                    checked={rule.isActive}
                    onChange={(checked) => onToggle(rule.id, checked)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveRulesList;
