import React from "react";
import { Controller } from "react-hook-form";
import { RiFileTextLine, RiAwardLine } from "react-icons/ri";
import type { Control, FieldErrors } from "react-hook-form";
import type { FormValues } from "../../../utils/lead/types";
import { PRIORITY_CONFIG, STAGES } from "../../../utils/lead/constants";
import CustomSelect from "../../../../../components/common/CustomSelect";
import CustomDatePicker from "../../../../../components/common/CustomDatePicker";
import CustomInput from "../../../../../components/common/CustomInput";

interface CounselorOption {
  value: string;
  label: string;
}

interface Props {
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
  counselorOptions: CounselorOption[];
  counselorsLoading: boolean;
}

const StepClassification: React.FC<Props> = ({
  control,
  errors,
  counselorOptions,
  counselorsLoading,
}) => (
  <div className="flex flex-col gap-4">
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-1 bg-purple-50">
      <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
        <RiFileTextLine size={15} className="text-purple-600" />
      </div>
      <div>
        <p className="text-[13px] font-bold text-purple-700">Classification</p>
        <p className="text-[11px] text-purple-500">
          Pipeline stage, priority & assignment
        </p>
      </div>
    </div>

    {/* Stage */}
    <div>
      <label className="block text-xs font-semibold text-gray-800 mb-2">
        Pipeline Stage
      </label>
      <Controller
        name="stage"
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-3 gap-2">
            {STAGES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => field.onChange(s.id)}
                className="px-3 py-2.5 rounded-xl text-[12px] font-bold border-2 cursor-pointer outline-none transition-all"
                style={{
                  background: field.value === s.id ? s.bg : "#f8fafc",
                  color: field.value === s.id ? s.color : "#94a3b8",
                  borderColor:
                    field.value === s.id ? s.color + "80" : "#e2e8f0",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      />
    </div>

    {/* Priority */}
    <div>
      <label className="block text-xs font-semibold text-gray-800 mb-2">
        Priority
      </label>
      <Controller
        name="priority"
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-3 gap-2">
            {(["Hot", "Warm", "Cold"] as const).map((p) => {
              const cfg = PRIORITY_CONFIG[p];
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => field.onChange(p)}
                  className="px-3 py-2.5 rounded-xl text-[13px] font-bold border-2 cursor-pointer outline-none transition-all"
                  style={{
                    background: field.value === p ? cfg.bg : "#f8fafc",
                    color: field.value === p ? cfg.color : "#94a3b8",
                    borderColor: field.value === p ? cfg.border : "#e2e8f0",
                  }}
                >
                  {cfg.icon} {p}
                </button>
              );
            })}
          </div>
        )}
      />
    </div>

    {/* Counselor + Follow-up */}
    <div className="flex gap-3">
      <div className="flex-1">
        <CustomSelect
          name="counselor"
          label="Assign Counselor"
          placeholder={
            counselorsLoading ? "Loading counselors…" : "Select counselor"
          }
          options={counselorOptions}
          required
          control={control}
          errors={errors}
          rules={{ required: "Assign a counselor" }}
        />
      </div>
      <div className="flex-1">
        <CustomDatePicker
          name="followUp"
          label="Follow-up Date"
          placeholder="Pick a date"
          control={control}
          errors={errors}
        />
      </div>
    </div>

    <CustomInput
      name="ieltsScore"
      label="IELTS Score (optional)"
      placeholder="e.g. 7.5"
      icon={<RiAwardLine size={13} className="text-slate-300" />}
      control={control}
    />
  </div>
);

export default StepClassification;
