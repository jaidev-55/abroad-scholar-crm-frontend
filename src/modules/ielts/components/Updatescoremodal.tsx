import React from "react";
import { Select, Spin } from "antd";
import { useForm, Controller } from "react-hook-form";
import CustomModal from "../../../components/common/CustomModal";
import CustomTextarea from "../../../components/common/Customtextarea";
import type { IeltsRecord, UpdateScoresPayload } from "../api/ielts";
import { MODULE_LABELS, SCORE_OPTIONS } from "../Types/Constants";
import { calcOverall } from "../utils/Helpers";
import { RiArrowUpCircleLine, RiCloseLine } from "react-icons/ri";

interface ScoreFormData {
  listening: string;
  reading: string;
  writing: string;
  speaking: string;
  testType: "OFFICIAL_EXAM" | "MOCK_TEST" | "PRACTICE";
  notes: string;
}

interface UpdateScoreModalProps {
  open: boolean;
  record: IeltsRecord | null;
  onClose: () => void;
  onSubmit: (payload: UpdateScoresPayload) => void;
  isLoading?: boolean;
}

const UpdateScoreModal: React.FC<UpdateScoreModalProps> = ({
  open,
  record,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const { control, handleSubmit, watch } = useForm<ScoreFormData>({
    defaultValues: {
      listening: record?.currentL?.toString() ?? "",
      reading: record?.currentR?.toString() ?? "",
      writing: record?.currentW?.toString() ?? "",
      speaking: record?.currentS?.toString() ?? "",
      testType: "OFFICIAL_EXAM",
      notes: "",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const vals = watch(["listening", "reading", "writing", "speaking"]);
  const overall = calcOverall(
    vals[0] ? parseFloat(vals[0]) : null,
    vals[1] ? parseFloat(vals[1]) : null,
    vals[2] ? parseFloat(vals[2]) : null,
    vals[3] ? parseFloat(vals[3]) : null,
  );

  const handleFormSubmit = (data: ScoreFormData) => {
    const payload: UpdateScoresPayload = {
      listening: data.listening ? parseFloat(data.listening) : undefined,
      reading: data.reading ? parseFloat(data.reading) : undefined,
      writing: data.writing ? parseFloat(data.writing) : undefined,
      speaking: data.speaking ? parseFloat(data.speaking) : undefined,
      testType: data.testType,
      notes: data.notes || undefined,
    };

    onSubmit(payload);
  };

  if (!record) return null;

  return (
    <CustomModal open={open} onClose={onClose}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <RiArrowUpCircleLine size={18} className="text-blue-500" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Update Scores
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              <span className="font-semibold text-slate-600">
                {record.studentName}
              </span>
              {" · "}
              {record.examType === "ACADEMIC" ? "Academic" : "General"}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
        >
          <RiCloseLine size={16} />
        </button>
      </div>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="px-6 py-5 space-y-5"
      >
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
                  {(mod.key === "listening"
                    ? record.targetL
                    : mod.key === "reading"
                      ? record.targetR
                      : mod.key === "writing"
                        ? record.targetW
                        : mod.key === "speaking"
                          ? record.targetS
                          : null
                  )?.toFixed(1) ?? "—"}
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
                  { value: "OFFICIAL_EXAM", label: "Official Exam" },
                  { value: "MOCK_TEST", label: "Mock Test" },
                  { value: "PRACTICE", label: "Practice Test" },
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
            disabled={isLoading}
            className="flex-1 h-10 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Spin size="small" />
                Saving...
              </span>
            ) : (
              "Save Scores"
            )}
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

export default UpdateScoreModal;
