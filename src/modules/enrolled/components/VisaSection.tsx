import React, { useState, useCallback, useEffect } from "react";
import { message } from "antd";
import { useForm } from "react-hook-form";
import type { Dayjs } from "dayjs";
import {
  RiPassportLine,
  RiFileTextLine,
  RiUserLine,
  RiChat3Line,
  RiShieldCheckLine,
  RiCloseCircleLine,
  RiCheckLine,
  RiHashtag,
  RiCalendarLine,
  RiAlertLine,
  RiEditLine,
  RiCloseLine,
  RiCheckboxCircleFill,
} from "react-icons/ri";
import type { VisaDetail, VisaStatus, UpdateVisaDetailPayload } from "../Types";
import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import CustomDatePicker from "../../../components/common/CustomDatePicker";
import dayjs from "dayjs";

// ─── Props ────────────────────────────────────────────────────

interface VisaSectionProps {
  studentId: string;
  visaDetail: VisaDetail | null;
  visaStatus: VisaStatus | undefined;
  casRef?: string;
  onVisaUpdate: (payload: UpdateVisaDetailPayload) => Promise<void>;
}

// ─── Form shape ───────────────────────────────────────────────

interface VisaFormValues {
  passportNumber: string;
  passportExpiry: Dayjs | null;
  visaType: string;
  visaStatus: string;
  filingDate: Dayjs | null;
  biometricDate: Dayjs | null;
  interviewDate: Dayjs | null;
  decisionDate: Dayjs | null;
  casRef: string;
}

// ─── Options ─────────────────────────────────────────────────

const VISA_STATUS_OPTIONS = [
  { value: "NOT_STARTED", label: "Not Started" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

const VISA_TYPE_OPTIONS = [
  { value: "TIER_4_UK", label: "Tier 4 (UK)" },
  { value: "F1_USA", label: "F-1 (USA)" },
  { value: "STUDY_PERMIT_CA", label: "Study Permit (Canada)" },
  { value: "SUBCLASS_500_AU", label: "Subclass 500 (Australia)" },
  { value: "STUDENT_DE", label: "Student Visa (Germany)" },
  { value: "STUDENT_IE", label: "Student Visa (Ireland)" },
  { value: "STUDENT_NZ", label: "Student Visa (New Zealand)" },
  { value: "OTHER", label: "Other" },
];

// ─── Success Overlay ──────────────────────────────────────────

const SuccessOverlay: React.FC<{ show: boolean }> = ({ show }) => (
  <div
    className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white rounded-2xl"
    style={{
      opacity: show ? 1 : 0,
      pointerEvents: show ? "auto" : "none",
      transition: "opacity 0.3s ease",
    }}
  >
    <div
      className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4"
      style={{
        transform: show ? "scale(1)" : "scale(0.5)",
        transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      <RiCheckboxCircleFill size={32} className="text-emerald-500" />
    </div>
    <p className="text-[15px] font-bold text-slate-800 m-0">
      Visa Details Updated!
    </p>
    <p className="text-[12px] text-slate-400 m-0 mt-1">
      Closing automatically…
    </p>
  </div>
);

// ─── Edit Visa Modal ──────────────────────────────────────────

interface EditVisaModalProps {
  open: boolean;
  visaDetail: VisaDetail | null;
  visaStatus: VisaStatus | undefined;
  casRef?: string;
  onClose: () => void;
  onSave: (payload: UpdateVisaDetailPayload) => Promise<void>;
}

const EditVisaModal: React.FC<EditVisaModalProps> = ({
  open,
  visaDetail,
  visaStatus,
  casRef,
  onClose,
  onSave,
}) => {
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VisaFormValues>({
    defaultValues: {
      passportNumber: visaDetail?.passportNumber ?? "",
      passportExpiry: null,
      visaType: visaDetail?.visaType ?? "",
      visaStatus: visaDetail?.visaStatus ?? visaStatus ?? "NOT_STARTED",
      casRef: casRef ?? "",
      filingDate: null,
      biometricDate: null,
      interviewDate: null,
      decisionDate: null,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        passportNumber: visaDetail?.passportNumber ?? "",
        passportExpiry: visaDetail?.passportExpiry
          ? dayjs(visaDetail.passportExpiry)
          : null,
        visaType: visaDetail?.visaType ?? "",
        visaStatus: visaDetail?.visaStatus ?? visaStatus ?? "NOT_STARTED",
        casRef: casRef ?? "",
        filingDate: visaDetail?.filingDate
          ? dayjs(visaDetail.filingDate)
          : null,
        biometricDate: visaDetail?.biometricDate
          ? dayjs(visaDetail.biometricDate)
          : null,
        interviewDate: visaDetail?.interviewDate
          ? dayjs(visaDetail.interviewDate)
          : null,
        decisionDate: visaDetail?.decisionDate
          ? dayjs(visaDetail.decisionDate)
          : null,
      });
    }
  }, [open, visaDetail, visaStatus, casRef, reset]);

  const handleClose = useCallback(() => {
    reset();
    setSuccess(false);
    onClose();
  }, [reset, onClose]);

  const onSubmit = useCallback(
    async (data: VisaFormValues) => {
      setSaving(true);
      try {
        const payload: UpdateVisaDetailPayload = {
          passportNumber: data.passportNumber || undefined,
          passportExpiry: data.passportExpiry
            ? data.passportExpiry.format("YYYY-MM-DD")
            : undefined,
          visaType: data.visaType || undefined,
          visaStatus: (data.visaStatus as VisaStatus) || undefined,
          casRef: data.casRef || undefined,
          filingDate: data.filingDate
            ? data.filingDate.format("YYYY-MM-DD")
            : undefined,
          biometricDate: data.biometricDate
            ? data.biometricDate.format("YYYY-MM-DD")
            : undefined,
          interviewDate: data.interviewDate
            ? data.interviewDate.format("YYYY-MM-DD")
            : undefined,
          decisionDate: data.decisionDate
            ? data.decisionDate.format("YYYY-MM-DD")
            : undefined,
        };
        await onSave(payload);
        setSuccess(true);
        setTimeout(() => handleClose(), 1400);
      } catch {
        message.error("Failed to update visa details");
      } finally {
        setSaving(false);
      }
    },
    [onSave, handleClose],
  );

  return (
    <CustomModal open={open} onClose={handleClose}>
      <div className="relative">
        <SuccessOverlay show={success} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-50 flex items-center justify-center">
              <RiEditLine size={18} className="text-cyan-600" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-slate-800 m-0">
                Edit Visa Details
              </h3>
              <p className="text-[12px] text-slate-400 m-0 mt-0.5">
                Update passport &amp; visa information
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center border-none cursor-pointer transition-colors"
          >
            <RiCloseLine size={18} className="text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div
          className="px-6 pt-4 pb-1 overflow-y-auto space-y-4"
          style={{ maxHeight: "calc(90vh - 200px)" }}
        >
          {/* Passport */}
          <p className="text-[11px] font-bold text-cyan-600 uppercase tracking-wider m-0">
            Passport Details
          </p>
          <div className="grid grid-cols-2 gap-3">
            <CustomInput<VisaFormValues>
              name="passportNumber"
              label="Passport Number"
              placeholder="e.g. P1234567"
              icon={<RiHashtag size={14} className="text-slate-400" />}
              control={control}
              size="middle"
            />
            <CustomDatePicker
              name="passportExpiry"
              label="Passport Expiry"
              placeholder="Select date"
              control={control}
              errors={errors}
            />
          </div>

          {/* Visa Info */}
          <p className="text-[11px] font-bold text-cyan-600 uppercase tracking-wider m-0">
            Visa Information
          </p>
          <div className="grid grid-cols-2 gap-3">
            <CustomSelect<VisaFormValues>
              name="visaType"
              label="Visa Type"
              placeholder="Select type"
              options={VISA_TYPE_OPTIONS}
              control={control}
              errors={errors}
              size="middle"
            />
            <CustomSelect<VisaFormValues>
              name="visaStatus"
              label="Visa Status"
              placeholder="Select status"
              options={VISA_STATUS_OPTIONS}
              control={control}
              errors={errors}
              size="middle"
            />
          </div>

          {/* CAS / I-20 Reference */}
          <p className="text-[11px] font-bold text-cyan-600 uppercase tracking-wider m-0">
            CAS / I-20 Details
          </p>
          <CustomInput<VisaFormValues>
            name="casRef"
            label="CAS / I-20 Reference Number"
            placeholder="e.g. CAS-123456789"
            icon={<RiHashtag size={14} className="text-slate-400" />}
            control={control}
            size="middle"
          />

          {/* Processing Dates */}
          <p className="text-[11px] font-bold text-cyan-600 uppercase tracking-wider m-0">
            Processing Dates
          </p>
          <div className="grid grid-cols-2 gap-3">
            <CustomDatePicker
              name="filingDate"
              label="Filing Date"
              placeholder="Pick date"
              control={control}
              errors={errors}
            />
            <CustomDatePicker
              name="biometricDate"
              label="Biometric Date"
              placeholder="Pick date"
              control={control}
              errors={errors}
            />
            <CustomDatePicker
              name="interviewDate"
              label="Interview Date"
              placeholder="Pick date"
              control={control}
              errors={errors}
            />
            <CustomDatePicker
              name="decisionDate"
              label="Decision Date"
              placeholder="Pick date"
              control={control}
              errors={errors}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex gap-3 border-t border-slate-100">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-slate-600 bg-slate-100 border-none cursor-pointer hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-blue-600 border-none cursor-pointer hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <RiCheckLine size={16} />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

// ─── Main Visa Section ────────────────────────────────────────

const VisaSection: React.FC<VisaSectionProps> = ({
  visaDetail,
  visaStatus,
  casRef,
  onVisaUpdate,
}) => {
  const [editOpen, setEditOpen] = useState(false);

  // ── Status badge style ──────────────────────────────────────
  const statusStyle =
    visaStatus === "APPROVED"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : visaStatus === "REJECTED"
        ? "bg-red-50 text-red-700 border-red-200"
        : visaStatus === "IN_PROGRESS"
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : "bg-slate-50 text-slate-600 border-slate-200";

  const formatLabel = (s: string) =>
    s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  // ── Passport expiry warning ─────────────────────────────────
  const passportDaysLeft = visaDetail?.passportExpiry
    ? Math.ceil(
        // eslint-disable-next-line react-hooks/purity
        (new Date(visaDetail.passportExpiry).getTime() - Date.now()) /
          86_400_000,
      )
    : null;
  const passportAlert = passportDaysLeft !== null && passportDaysLeft < 365;

  // ── Info cards ──────────────────────────────────────────────
  const infoCards = [
    {
      label: "Passport No.",
      value: visaDetail?.passportNumber ?? "Not set",
      icon: <RiHashtag size={12} />,
      alert: false,
    },
    {
      label: "Passport Expiry",
      value: visaDetail?.passportExpiry
        ? new Date(visaDetail.passportExpiry).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Not set",
      icon: <RiCalendarLine size={12} />,
      alert: passportAlert,
    },
    {
      label: "Visa Type",
      value: visaDetail?.visaType ?? "Not set",
      icon: <RiFileTextLine size={12} />,
      alert: false,
    },
    {
      label: "Filing Date",
      value: visaDetail?.filingDate
        ? new Date(visaDetail.filingDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Not filed",
      icon: <RiCalendarLine size={12} />,
      alert: false,
    },
    {
      label: "CAS / I-20 Ref",
      value: casRef || "Not set",
      icon: <RiHashtag size={12} />,
      alert: false,
    },
  ];

  // ── Processing timeline steps ───────────────────────────────
  const timelineSteps = [
    {
      key: "filed",
      label: "Visa Filed",
      date: visaDetail?.filingDate ?? null,
      icon: <RiFileTextLine size={14} />,
    },
    {
      key: "biometric",
      label: "Biometric",
      date: visaDetail?.biometricDate ?? null,
      icon: <RiUserLine size={14} />,
    },
    {
      key: "interview",
      label: "Interview",
      date: visaDetail?.interviewDate ?? null,
      icon: <RiChat3Line size={14} />,
    },
    {
      key: "decision",
      label: visaStatus === "REJECTED" ? "Rejected" : "Approved",
      date: visaDetail?.decisionDate ?? null,
      icon:
        visaStatus === "REJECTED" ? (
          <RiCloseCircleLine size={14} />
        ) : (
          <RiShieldCheckLine size={14} />
        ),
    },
  ];

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-cyan-50 flex items-center justify-center">
            <RiPassportLine size={16} className="text-cyan-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Visa Processing</h3>
          <div className="ml-auto flex items-center gap-2">
            {/* Current status badge */}
            <span
              className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${statusStyle}`}
            >
              {visaStatus ? formatLabel(visaStatus) : "Not Started"}
            </span>
            <button
              onClick={() => setEditOpen(true)}
              className="flex items-center gap-1 px-3 py-[6px] rounded-xl text-[12px] font-semibold bg-blue-600 text-white border-none cursor-pointer hover:bg-blue-700 transition-all shadow-sm"
            >
              <RiEditLine size={13} /> Edit
            </button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
          {infoCards.map((item) => (
            <div
              key={item.label}
              className={`px-3 py-2.5 rounded-xl border ${
                item.alert
                  ? "bg-red-50 border-red-200"
                  : "bg-slate-50 border-slate-100"
              }`}
            >
              <div className="flex items-center gap-1 mb-0.5">
                <span
                  className={item.alert ? "text-red-500" : "text-slate-400"}
                >
                  {item.icon}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {item.label}
                </span>
                {item.alert && (
                  <RiAlertLine size={11} className="text-red-500 ml-auto" />
                )}
              </div>
              <div
                className={`text-[13px] font-bold ${
                  item.alert ? "text-red-700" : "text-slate-800"
                }`}
              >
                {item.value}
              </div>
              {item.label === "Passport Expiry" &&
                passportDaysLeft !== null && (
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {passportDaysLeft > 0
                      ? `${passportDaysLeft}d remaining`
                      : "Expired"}
                  </div>
                )}
            </div>
          ))}
        </div>

        {/* Processing Timeline */}
        <div className="flex items-center justify-between gap-1">
          {timelineSteps.map((step, idx) => {
            const isDone = !!step.date;
            const isLast = idx === timelineSteps.length - 1;
            const isRejected =
              step.key === "decision" && visaStatus === "REJECTED";

            return (
              <React.Fragment key={step.key}>
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isDone
                        ? isRejected
                          ? "bg-red-100 text-red-600"
                          : "bg-emerald-100 text-emerald-600"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isDone && !isRejected && step.key !== "decision" ? (
                      <RiCheckLine size={15} />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-semibold text-center ${
                      isDone ? "text-slate-700" : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </span>
                  {step.date && (
                    <span className="text-[9px] text-slate-400">
                      {new Date(step.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>
                {!isLast && (
                  <div
                    className={`h-0.5 flex-1 rounded-full mt-[-20px] ${
                      isDone ? "bg-emerald-300" : "bg-slate-200"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* No visa data yet */}
        {!visaDetail && (
          <div className="mt-4 py-4 text-center text-sm text-slate-400 border-t border-slate-100">
            No visa details recorded yet. Click{" "}
            <button
              onClick={() => setEditOpen(true)}
              className="text-blue-500 font-semibold border-none bg-transparent cursor-pointer hover:underline"
            >
              Edit
            </button>{" "}
            to add them.
          </div>
        )}
      </div>

      <EditVisaModal
        open={editOpen}
        visaDetail={visaDetail}
        visaStatus={visaStatus}
        casRef={casRef}
        onClose={() => setEditOpen(false)}
        onSave={async (payload) => {
          await onVisaUpdate(payload);
          setEditOpen(false);
        }}
      />
    </>
  );
};

export default VisaSection;
