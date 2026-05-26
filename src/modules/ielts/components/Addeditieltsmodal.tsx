import React from "react";
import { useForm } from "react-hook-form";
import CustomDatePicker from "../../../components/common/CustomDatePicker";
import CustomInput from "../../../components/common/CustomInput";
import CustomModal from "../../../components/common/CustomModal";
import CustomSelect from "../../../components/common/CustomSelect";
import CustomTextarea from "../../../components/common/Customtextarea";
import type { IeltsRecord } from "../Types";
import {
  EXAM_TYPE_OPTIONS,
  STATUS_OPTIONS,
  SCORE_OPTIONS,
  COUNTRY_OPTIONS,
} from "../Types/Constants";

interface AddEditModalProps {
  open: boolean;
  record: IeltsRecord | null;
  onClose: () => void;
  onSubmit: (data: IeltsFormData) => void;
  counselorOptions: { value: string; label: string }[];
  studentOptions: { value: string; label: string }[];
}

export interface IeltsFormData {
  studentId: string;
  studentName: string;
  country: string;
  examType: string;
  status: string;
  examDate: any;
  counselor: string;
  university: string;
  registrationId: string;
  requiredScore: string;
  targetListening: string;
  targetReading: string;
  targetWriting: string;
  targetSpeaking: string;
  targetOverall: string;
  notes: string;
}

const AddEditIeltsModal: React.FC<AddEditModalProps> = ({
  open,
  record,
  onClose,
  onSubmit,
  counselorOptions,
  studentOptions,
}) => {
  const isEdit = record !== null;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IeltsFormData>({
    defaultValues: isEdit
      ? {
          studentId: record.studentId,
          studentName: record.studentName,
          country: record.country,
          examType: record.examType,
          status: record.status,
          counselor: record.counselor,
          university: record.university,
          registrationId: record.registrationId,
          requiredScore: record.requiredScore?.toString() ?? "",
          targetListening: record.targetScore.listening.toString(),
          targetReading: record.targetScore.reading.toString(),
          targetWriting: record.targetScore.writing.toString(),
          targetSpeaking: record.targetScore.speaking.toString(),
          targetOverall: record.targetScore.overall.toString(),
          notes: record.notes,
        }
      : {
          studentId: "",
          studentName: "",
          country: "",
          examType: "Academic",
          status: "Not Started",
          counselor: "",
          university: "",
          registrationId: "",
          requiredScore: "",
          targetListening: "6.5",
          targetReading: "6.5",
          targetWriting: "6.0",
          targetSpeaking: "6.0",
          targetOverall: "6.5",
          notes: "",
        },
  });

  return (
    <CustomModal open={open} onClose={onClose}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800">
            {isEdit ? "Edit IELTS Record" : "Add IELTS Tracking"}
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {isEdit
              ? `Editing ${record.studentName}`
              : "Set up IELTS tracking for a student"}
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto"
      >
        {/* ── Student Info Section ── */}
        <div>
          <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider mb-2">
            Student Information
          </p>

          {!isEdit ? (
            <>
              {/* If studentOptions available, show dropdown; else manual entry */}
              {studentOptions.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  <CustomSelect
                    name="studentId"
                    label="Student"
                    placeholder="Select student"
                    options={studentOptions}
                    control={control}
                    errors={errors}
                    rules={{ required: "Student is required" }}
                    required
                  />
                  <CustomSelect
                    name="country"
                    label="Country"
                    placeholder="Select country"
                    options={COUNTRY_OPTIONS.filter((c) => c.value !== "")}
                    control={control}
                    errors={errors}
                    required
                    rules={{ required: "Country is required" }}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <CustomInput
                    name="studentName"
                    label="Student Name"
                    placeholder="e.g. Abhishek Yadav"
                    control={control}
                    rules={{ required: "Student name is required" }}
                    required
                  />
                  <CustomSelect
                    name="country"
                    label="Country"
                    placeholder="Select country"
                    options={COUNTRY_OPTIONS.filter((c) => c.value !== "")}
                    control={control}
                    errors={errors}
                    required
                    rules={{ required: "Country is required" }}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-[13px] font-semibold text-slate-700">
                {record.studentName}
              </p>
              <p className="text-[11px] text-slate-400">{record.country}</p>
            </div>
          )}
        </div>

        {/* ── Exam Details Section ── */}
        <div>
          <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider mb-2">
            Exam Details
          </p>

          <div className="grid grid-cols-2 gap-3">
            <CustomSelect
              name="examType"
              label="Exam Type"
              placeholder="Select type"
              options={EXAM_TYPE_OPTIONS}
              control={control}
              errors={errors}
              required
            />
            <CustomSelect
              name="status"
              label="Status"
              placeholder="Select status"
              options={STATUS_OPTIONS.filter((s) => s.value !== "")}
              control={control}
              errors={errors}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <CustomDatePicker
              name="examDate"
              label="Exam Date"
              placeholder="Pick exam date"
              control={control}
              errors={errors}
            />
            <CustomInput
              name="registrationId"
              label="Registration ID"
              placeholder="e.g. IDP-2026-XXXX"
              control={control}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <CustomSelect
              name="counselor"
              label="Counselor"
              placeholder="Select counselor"
              options={counselorOptions}
              control={control}
              errors={errors}
              required
              rules={{ required: "Counselor is required" }}
            />
            <CustomInput
              name="university"
              label="Target University"
              placeholder="e.g. University of Melbourne"
              control={control}
            />
          </div>
        </div>

        {/* ── Target Scores Section ── */}
        <div>
          <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider mb-2">
            Target Scores
          </p>

          {/* Required overall score */}
          <div className="mb-3">
            <CustomInput
              name="requiredScore"
              label="University Required Score"
              placeholder="e.g. 7.0"
              control={control}
              type="text"
            />
          </div>

          {/* Individual module targets */}
          <label className="text-xs font-semibold text-slate-600 mb-2 block">
            Module-wise Targets
          </label>
          <div className="grid grid-cols-5 gap-2">
            {[
              { name: "targetListening" as const, icon: "🎧", short: "L" },
              { name: "targetReading" as const, icon: "📖", short: "R" },
              { name: "targetWriting" as const, icon: "✍️", short: "W" },
              { name: "targetSpeaking" as const, icon: "🎤", short: "S" },
              { name: "targetOverall" as const, icon: "⭐", short: "OA" },
            ].map((item) => (
              <div key={item.name} className="flex flex-col gap-1">
                <span className="text-[9px] text-slate-400 font-semibold text-center uppercase tracking-wider">
                  {item.icon} {item.short}
                </span>
                <CustomSelect
                  name={item.name}
                  options={SCORE_OPTIONS}
                  control={control}
                  errors={errors}
                  size="small"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Notes Section ── */}
        <div>
          <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider mb-2">
            Additional Info
          </p>
          <CustomTextarea
            name="notes"
            label="Notes"
            placeholder="Preparation plan, weak areas, coaching notes..."
            hint="(optional)"
            rows={3}
            control={control}
          />
        </div>

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
            {isEdit ? "Update Record" : "Add Student"}
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

export default AddEditIeltsModal;
