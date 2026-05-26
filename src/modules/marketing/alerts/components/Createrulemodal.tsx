import { Select, InputNumber } from "antd";
import { RiCloseLine, RiShieldCheckLine } from "react-icons/ri";


interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (rule: any) => void;
  initialValues?: {
    name?: string;
    metric?: string;
    operator?: string;
    value?: number;
    action?: string;
  };
  mode: "create" | "edit";
}

import { useState, useEffect } from "react";
import { ACTION_OPTIONS, METRIC_OPTIONS, OPERATOR_OPTIONS } from "../types/Constants";

const CreateRuleModal: React.FC<Props> = ({
  open,
  onClose,
  onSave,
  initialValues,
  mode,
}) => {
  const [name, setName] = useState(initialValues?.name || "");
  const [metric, setMetric] = useState(initialValues?.metric || "cpl");
  const [operator, setOperator] = useState(initialValues?.operator || "gt");
  const [value, setValue] = useState<number>(initialValues?.value || 500);
  const [action, setAction] = useState(initialValues?.action || "notification");

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name || "");
      setMetric(initialValues.metric || "cpl");
      setOperator(initialValues.operator || "gt");
      setValue(initialValues.value || 500);
      setAction(initialValues.action || "notification");
    }
  }, [initialValues]);

  if (!open) return null;

  const handleSave = () => {
    onSave({ name, metric, operator, value, action });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <RiShieldCheckLine size={18} className="text-blue-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                {mode === "create" ? "Create Alert Rule" : "Edit Alert Rule"}
              </h3>
              <p className="text-[10px] text-slate-400">
                Set conditions and actions for automated alerts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <RiCloseLine size={18} className="text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4">
          {/* Rule name */}
          <div>
            <label className="text-[11px] font-semibold text-slate-600 mb-1.5 block">
              Rule Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. High CPL Alert"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            />
          </div>

          {/* Condition row */}
          <div>
            <label className="text-[11px] font-semibold text-slate-600 mb-1.5 block">
              Condition
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-slate-500 font-medium">If</span>
              <Select
                value={metric}
                onChange={setMetric}
                options={[...METRIC_OPTIONS]}
                className="w-48"
                size="small"
                style={{ borderRadius: 8, fontSize: 11 }}
              />
              <Select
                value={operator}
                onChange={setOperator}
                options={[...OPERATOR_OPTIONS]}
                className="w-32"
                size="small"
                style={{ borderRadius: 8, fontSize: 11 }}
              />
              <InputNumber
                value={value}
                onChange={(v) => setValue(v || 0)}
                className="w-24"
                size="small"
                min={0}
                style={{ borderRadius: 8, fontSize: 11 }}
              />
            </div>
          </div>

          {/* Action */}
          <div>
            <label className="text-[11px] font-semibold text-slate-600 mb-1.5 block">
              Then
            </label>
            <Select
              value={action}
              onChange={setAction}
              options={[...ACTION_OPTIONS]}
              className="w-full"
              size="small"
              style={{ borderRadius: 8, fontSize: 11 }}
            />
          </div>

          {/* Preview */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Rule Preview
            </p>
            <p className="text-[11px] text-slate-600">
              If{" "}
              <span className="font-bold text-slate-800">
                {METRIC_OPTIONS.find((m) => m.value === metric)?.label ||
                  metric}
              </span>{" "}
              is{" "}
              <span className="font-bold text-slate-800">
                {OPERATOR_OPTIONS.find((o) => o.value === operator)?.label ||
                  operator}
              </span>{" "}
              <span className="font-bold text-blue-600">{value}</span>, then{" "}
              <span className="font-bold text-emerald-600">
                {ACTION_OPTIONS.find((a) => a.value === action)?.label ||
                  action}
              </span>
              .
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-5 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-4 py-2 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mode === "create" ? "Create Rule" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRuleModal;
