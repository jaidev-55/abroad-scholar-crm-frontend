import React from "react";
import { Select } from "antd";
import { useForm, Controller } from "react-hook-form";
import CustomModal from "../../../components/common/CustomModal";
import CustomTextarea from "../../../components/common/Customtextarea";
import type { IeltsRecord } from "../Types";
import { MODULE_LABELS, SCORE_OPTIONS } from "../Types/Constants";
import { calcOverall } from "../utils/Helpers";

interface UpdateScoreModalProps {
  open: boolean;
  record: IeltsRecord | null;
  onClose: () => void;
  onSubmit: (data: ScoreFormData) => void;
}

export interface ScoreFormData {
  listening: string;
  reading: string;
  writing: string;
  speaking: string;
  testType: string;
  notes: string;
}

const UpdateScoreModal: React.FC<UpdateScoreModalProps> = ({
  open,
  record,
  onClose,
  onSubmit,
}) => {
  const { control, handleSubmit, watch } = useForm<ScoreFormData>({
    defaultValues: {
      listening: record?.currentScore?.listening?.toString() ?? "",
      reading: record?.currentScore?.reading?.toString() ?? "",
      writing: record?.currentScore?.writing?.toString() ?? "",
      speaking: record?.currentScore?.speaking?.toString() ?? "",
      testType: "Official",
      notes: "",
    },
  });

  const vals = watch(["listening", "reading", "writing", "speaking"]);
  const overall = calcOverall(
    vals[0] ? parseFloat(vals[0]) : null,
    vals[1] ? parseFloat(vals[1]) : null,
    vals[2] ? parseFloat(vals[2]) : null,
    vals[3] ? parseFloat(vals[3]) : null,
  );

  if (!record) return null;

  return (
    <CustomModal open={open} onClose={onClose}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800">Update Scores</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {record.studentName} · {record.examType}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors text-sm"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-5">
        {/* Module Scores */}
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-3 block">
            Module Scores
          </label>
          <div className="grid grid-cols-2 gap-3">
            {MODULE_LABELS.map((mod) => (
              <div key={mod.key} className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <span>{mod.icon}</span> {mod.label}
                </span>
                <Controller
                  name={mod.key as keyof ScoreFormData}
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      value={field.value || undefined}
                      className="w-full"
                      size="middle"
                      placeholder="Select"
                      options={SCORE_OPTIONS}
                      onChange={(v) => field.onChange(v)}
                    />
                  )}
                />
                <span className="text-[9px] text-slate-300">
                  Target:{" "}
                  {record.targetScore[
                    mod.key as keyof typeof record.targetScore
                  ].toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Calculated Overall */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-between">
          <span className="text-[13px] font-bold text-blue-700">
            Calculated Overall
          </span>
          <span className="text-xl font-extrabold text-blue-600">
            {overall !== null ? overall.toFixed(1) : "—"}
          </span>
        </div>

        {/* Test Type */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600">
            Test Type
          </label>
          <Controller
            name="testType"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                className="w-full"
                size="middle"
                options={[
                  { value: "Mock", label: "Mock Test" },
                  { value: "Practice", label: "Practice Test" },
                  { value: "Official", label: "Official Exam" },
                ]}
              />
            )}
          />
        </div>

        {/* Notes */}
        <CustomTextarea
          name="notes"
          label="Notes"
          placeholder="Areas of improvement, observations..."
          rows={3}
          control={control}
        />

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 h-10 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
          >
            Save Scores
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

export default UpdateScoreModal;
