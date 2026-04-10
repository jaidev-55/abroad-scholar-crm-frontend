import { STAGES } from "../../modules/leadsPipeline/utils/constants";

interface StagePickerProps {
  value: string;
  onChange: (v: string) => void;
}

const StagePicker: React.FC<StagePickerProps> = ({ value, onChange }) => (
  <div className="grid grid-cols-2 gap-2">
    {STAGES.map((s) => {
      const sel = value === s.id;
      return (
        <button
          key={s.id}
          type="button"
          onClick={() => onChange(s.id)}
          className="py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer outline-none text-left"
          style={{
            border: `2px solid ${sel ? "#2563eb" : "#e8edf2"}`,
            background: sel ? "#eff6ff" : "#fafbfc",
            color: sel ? "#2563eb" : "#64748b",
          }}
        >
          {s.label}
        </button>
      );
    })}
  </div>
);

export default StagePicker;
