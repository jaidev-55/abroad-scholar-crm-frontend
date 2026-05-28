import React from "react";
import { useForm } from "react-hook-form";
import CustomDatePicker from "../../../components/common/CustomDatePicker";
import CustomInput from "../../../components/common/CustomInput";
import CustomModal from "../../../components/common/CustomModal";
import CustomSelect from "../../../components/common/CustomSelect";
import CustomTextarea from "../../../components/common/Customtextarea";
import type { IeltsRecord, CreateIeltsPayload } from "../api/ielts";
import type { Dayjs } from "dayjs";
import {
  EXAM_TYPE_OPTIONS,
  STATUS_OPTIONS,
  SCORE_OPTIONS,
  COUNTRY_OPTIONS,
} from "../Types/Constants";
import {
  RiHeadphoneLine,
  RiBook2Line,
  RiEditLine,
  RiMicLine,
  RiStarLine,
  RiAddLine,
  RiCloseLine,
} from "react-icons/ri";
import dayjs from "dayjs";

interface AddEditModalProps {
  open: boolean;
  record: IeltsRecord | null;
  onClose: () => void;
  onSubmit: (payload: CreateIeltsPayload) => void;
  isLoading?: boolean;
  counselorOptions: { value: string; label: string }[];
  studentOptions: { value: string; label: string }[];
}

interface IeltsFormData {
  studentName: string;
  country: string;
  examType: string;
  status: string;
  examDate: Dayjs | null;
  counselorId: string;
  targetUniversity: string;
  registrationId: string;
  requiredScore: string;
  targetL: string;
  targetR: string;
  targetW: string;
  targetS: string;
  targetOA: string;
  notes: string;
}

const AddEditIeltsModal: React.FC<AddEditModalProps> = ({
  open,
  record,
  onClose,
  onSubmit,
  isLoading,
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
          studentName: record.studentName,
          country: record.country ?? "",
          examType: record.examType,
          status: record.status,
          examDate: record.examDate ? dayjs(record.examDate) : null,
          counselorId: record.counselorId ?? "",
          targetUniversity: record.targetUniversity ?? "",
          registrationId: record.registrationId ?? "",
          requiredScore: record.requiredScore?.toString() ?? "",
          targetL: record.targetL?.toString() ?? "6.5",
          targetR: record.targetR?.toString() ?? "6.5",
          targetW: record.targetW?.toString() ?? "6.0",
          targetS: record.targetS?.toString() ?? "6.0",
          targetOA: record.targetOA?.toString() ?? "6.5",
          notes: record.notes ?? "",
        }
      : {
          studentName: "",
          country: "",
          examType: "ACADEMIC",
          status: "NOT_STARTED",
          examDate: "",
          counselorId: "",
          targetUniversity: "",
          registrationId: "",
          requiredScore: "",
          targetL: "6.5",
          targetR: "6.5",
          targetW: "6.0",
          targetS: "6.0",
          targetOA: "6.5",
          notes: "",
        },
  });

  const handleFormSubmit = (data: IeltsFormData) => {
    console.log("Form data:", data);
    const payload: CreateIeltsPayload = {
      studentName: data.studentName,
      country: data.country || undefined,
      examType: data.examType as "ACADEMIC" | "GENERAL",
      status: data.status as CreateIeltsPayload["status"],
      examDate: data.examDate ? data.examDate.toISOString() : undefined,
      counselorId: data.counselorId || undefined,
      targetUniversity: data.targetUniversity || undefined,
      registrationId: data.registrationId || undefined,
      requiredScore: data.requiredScore
        ? parseFloat(data.requiredScore)
        : undefined,
      targetL: data.targetL ? parseFloat(data.targetL) : undefined,
      targetR: data.targetR ? parseFloat(data.targetR) : undefined,
      targetW: data.targetW ? parseFloat(data.targetW) : undefined,
      targetS: data.targetS ? parseFloat(data.targetS) : undefined,
      targetOA: data.targetOA ? parseFloat(data.targetOA) : undefined,
      notes: data.notes || undefined,
    };
    console.log("Form data:", data);
    onSubmit(payload);
  };

  return (
    <CustomModal open={open} onClose={onClose}>
      {/* Header */}

      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isEdit ? "bg-blue-50" : "bg-emerald-50"
            }`}
          >
            {isEdit ? (
              <RiEditLine size={18} className="text-blue-500" />
            ) : (
              <RiAddLine size={18} className="text-emerald-500" />
            )}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              {isEdit ? "Edit IELTS Record" : "Add IELTS Tracking"}
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isEdit ? (
                <>
                  <span className="font-semibold text-slate-600">
                    {record.studentName}
                  </span>{" "}
                  · Editing record
                </>
              ) : (
                "Set up IELTS tracking for a student"
              )}
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

      {/* Body */}
      <form className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
        {/* Student Info */}
        <div>
          <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider mb-2">
            Student Information
          </p>
          {!isEdit ? (
            <div className="grid grid-cols-2 gap-3">
              {studentOptions.length > 0 ? (
                <CustomSelect
                  name="studentName"
                  label="Student"
                  placeholder="Select student"
                  options={studentOptions}
                  control={control}
                  errors={errors}
                  rules={{ required: "Student is required" }}
                  required
                />
              ) : (
                <CustomInput
                  name="studentName"
                  label="Student Name"
                  placeholder="e.g. Abhishek Yadav"
                  control={control}
                  rules={{ required: "Student name is required" }}
                  required
                />
              )}
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
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-[13px] font-semibold text-slate-700">
                {record.studentName}
              </p>
              <p className="text-[11px] text-slate-400">{record.country}</p>
            </div>
          )}
        </div>

        {/* Exam Details */}
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
              name="counselorId"
              label="Counselor"
              placeholder="Select counselor"
              options={counselorOptions}
              control={control}
              errors={errors}
              required
              rules={{ required: "Counselor is required" }}
            />
            <CustomInput
              name="targetUniversity"
              label="Target University"
              placeholder="e.g. University of Melbourne"
              control={control}
            />
          </div>
        </div>

        {/* Target Scores */}
        <div>
          <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider mb-2">
            Target Scores
          </p>
          <div className="mb-3">
            <CustomInput
              name="requiredScore"
              label="Required Score"
              placeholder="e.g. 7.0"
              control={control}
              type="text"
            />
          </div>
          <label className="text-xs font-semibold text-slate-600 mb-2 block">
            Module-wise Targets
          </label>
          <div className="grid grid-cols-5 gap-2">
            {[
              {
                name: "targetL" as const,
                icon: <RiHeadphoneLine size={11} />,
                short: "L",
              },
              {
                name: "targetR" as const,
                icon: <RiBook2Line size={11} />,
                short: "R",
              },
              {
                name: "targetW" as const,
                icon: <RiEditLine size={11} />,
                short: "W",
              },
              {
                name: "targetS" as const,
                icon: <RiMicLine size={11} />,
                short: "S",
              },
              {
                name: "targetOA" as const,
                icon: <RiStarLine size={11} />,
                short: "OA",
              },
            ].map((item) => (
              <div key={item.name} className="flex flex-col gap-1">
                <span className="text-[9px] text-slate-400 font-semibold text-center uppercase tracking-wider flex items-center justify-center gap-0.5">
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

        {/* Notes */}
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
            onClick={handleSubmit(handleFormSubmit)}
            disabled={isLoading}
            className="flex-1 h-10 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isEdit ? "Updating..." : "Adding..."}
              </span>
            ) : isEdit ? (
              "Update Record"
            ) : (
              "Add Student"
            )}
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

export default AddEditIeltsModal;
