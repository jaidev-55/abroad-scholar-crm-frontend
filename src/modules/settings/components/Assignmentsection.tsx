import { Switch, Tag } from "antd";
import {
  RiAddLine,
  RiDeleteBinLine,
  RiEdit2Line,
  RiUser3Line,
  RiArrowRightSLine,
} from "react-icons/ri";
import type { AssignmentRule } from "../types";

interface Props {
  rules: AssignmentRule[];
}

const TYPE_CONFIG: Record<string, { label: string; bg: string; text: string }> =
  {
    round_robin: {
      label: "Round Robin",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    weighted: {
      label: "Weighted",
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
    manual: { label: "Manual", bg: "bg-slate-100", text: "text-slate-600" },
    rule_based: {
      label: "Rule Based",
      bg: "bg-amber-50",
      text: "text-amber-600",
    },
  };

const AssignmentSection: React.FC<Props> = ({ rules }) => {
  return (
    <div className="space-y-4">
      {/* Header card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Lead Assignment Rules
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure how incoming leads are assigned to counselors
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer">
            <RiAddLine size={13} />
            Add Rule
          </button>
        </div>

        {/* How it works */}
        <div className="bg-slate-50 rounded-xl p-4 mb-5">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            How it works
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-600">
            <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-medium">
              New lead arrives
            </span>
            <RiArrowRightSLine size={14} className="text-slate-400" />
            <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-medium">
              Check rule conditions
            </span>
            <RiArrowRightSLine size={14} className="text-slate-400" />
            <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-medium">
              Assign to counselor
            </span>
            <RiArrowRightSLine size={14} className="text-slate-400" />
            <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-medium">
              Notify counselor
            </span>
          </div>
        </div>

        {/* Rules list */}
        <div className="space-y-3">
          {rules.map((rule) => {
            const typeCfg = TYPE_CONFIG[rule.type];
            return (
              <div
                key={rule.id}
                className={`border rounded-xl p-4 transition-colors ${
                  rule.isActive
                    ? "border-slate-200 bg-white"
                    : "border-slate-100 bg-slate-50/50 opacity-70"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h4 className="text-xs font-bold text-slate-800">
                        {rule.name}
                      </h4>
                      <Tag
                        className={`${typeCfg?.bg} ${typeCfg?.text} border-0 rounded-full text-[9px] font-semibold px-2 py-0`}
                      >
                        {typeCfg?.label}
                      </Tag>
                    </div>

                    {/* Conditions */}
                    {rule.conditions && rule.conditions.length > 0 && (
                      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                        <span className="text-[10px] text-slate-400">
                          When:
                        </span>
                        {rule.conditions.map((cond, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md font-medium"
                          >
                            {cond.field} = {cond.value}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Counselors */}
                    <div className="flex items-center gap-1.5">
                      <RiUser3Line size={11} className="text-slate-400" />
                      <span className="text-[10px] text-slate-500">
                        Assigns to:
                      </span>
                      {rule.counselors.map((c) => (
                        <span
                          key={c}
                          className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-medium"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
                      <RiEdit2Line size={13} className="text-slate-400" />
                    </button>
                    <button className="p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                      <RiDeleteBinLine
                        size={13}
                        className="text-slate-400 hover:text-red-500"
                      />
                    </button>
                    <Switch size="small" checked={rule.isActive} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AssignmentSection;
