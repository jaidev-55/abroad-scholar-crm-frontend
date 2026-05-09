import React from "react";
import { RiFireLine, RiFlashlightLine, RiSnowflakeLine } from "react-icons/ri";

const PRIORITY_OPTIONS = [
  {
    v: "Hot",
    icon: <RiFireLine size={13} />,
    active: "#ef4444",
    lightBg: "#fff5f5",
    border: "#fed7d7",
  },
  {
    v: "Warm",
    icon: <RiFlashlightLine size={13} />,
    active: "#f59e0b",
    lightBg: "#fffbeb",
    border: "#fde68a",
  },
  {
    v: "Cold",
    icon: <RiSnowflakeLine size={13} />,
    active: "#3b82f6",
    lightBg: "#eff6ff",
    border: "#bfdbfe",
  },
] as const;

interface PriorityPickerProps {
  value: string;
  onChange: (v: string) => void;
}

const PriorityPicker: React.FC<PriorityPickerProps> = ({ value, onChange }) => (
  <div className="flex gap-2">
    {PRIORITY_OPTIONS.map((o) => {
      const sel = value === o.v;
      return (
        <button
          key={o.v}
          type="button"
          onClick={() => onChange(o.v)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer outline-none"
          style={{
            border: `2px solid ${sel ? o.active : o.border}`,
            background: sel ? o.active : o.lightBg,
            color: sel ? "#fff" : o.active,
            boxShadow: sel ? `0 2px 8px ${o.active}33` : "none",
          }}
        >
          {o.icon}
          {o.v}
        </button>
      );
    })}
  </div>
);

export default PriorityPicker;
