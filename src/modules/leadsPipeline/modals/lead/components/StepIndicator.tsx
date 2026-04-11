import React from "react";
import {
  RiUserLine,
  RiFileTextLine,
  RiStickyNoteLine,
  RiCheckLine,
} from "react-icons/ri";
import type { StepKey } from "../../../utils/lead/types";

const STEPS = [
  { key: 1 as StepKey, label: "Personal Info", icon: <RiUserLine size={13} /> },
  {
    key: 2 as StepKey,
    label: "Classification",
    icon: <RiFileTextLine size={13} />,
  },
  {
    key: 3 as StepKey,
    label: "Notes & Review",
    icon: <RiStickyNoteLine size={13} />,
  },
];

const StepIndicator: React.FC<{ current: StepKey }> = ({ current }) => (
  <div className="flex items-center mb-6">
    {STEPS.map((step, i) => {
      const done = current > step.key;
      const active = current === step.key;
      return (
        <React.Fragment key={step.key}>
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-200"
              style={{
                background: done ? "#10B981" : active ? "#2563eb" : "#f1f5f9",
                color: done || active ? "#fff" : "#94a3b8",
              }}
            >
              {done ? <RiCheckLine size={13} /> : step.icon}
            </div>
            <span
              className="text-[12px] font-semibold whitespace-nowrap"
              style={{
                color: active ? "#2563eb" : done ? "#10B981" : "#94a3b8",
              }}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className="flex-1 h-px mx-3"
              style={{ background: current > step.key ? "#10B981" : "#e2e8f0" }}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

export default StepIndicator;
