import React from "react";
import { RiCheckLine } from "react-icons/ri";

const StepDot: React.FC<{ step: number; current: number; label: string }> = ({
  step,
  current,
  label,
}) => {
  const done = step < current,
    active = step === current;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
          done
            ? "bg-emerald-500 text-white"
            : active
              ? "bg-green-600 text-white ring-4 ring-green-100"
              : "bg-slate-100 text-slate-400"
        }`}
      >
        {done ? <RiCheckLine size={14} /> : step + 1}
      </div>
      <span
        className={`text-[10px] font-semibold uppercase tracking-wider ${
          active
            ? "text-green-700"
            : done
              ? "text-emerald-600"
              : "text-slate-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
};

const StepConnector: React.FC<{ done: boolean }> = ({ done }) => (
  <div className="flex-1 h-[2px] mt-[-12px] mx-1">
    <div
      className={`h-full rounded-full transition-all duration-500 ${done ? "bg-emerald-400" : "bg-slate-200"}`}
    />
  </div>
);

const STEP_LABELS = ["Connect", "Map Columns", "Preview"];

interface Props {
  step: number;
}

const StepperHeader: React.FC<Props> = ({ step }) => (
  <div className="flex items-center mb-6 mt-1 px-2">
    {STEP_LABELS.map((label, i) => (
      <React.Fragment key={label}>
        <StepDot step={i} current={step} label={label} />
        {i < STEP_LABELS.length - 1 && <StepConnector done={step > i} />}
      </React.Fragment>
    ))}
  </div>
);

export default StepperHeader;
