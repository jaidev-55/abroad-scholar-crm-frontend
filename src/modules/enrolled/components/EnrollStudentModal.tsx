import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Dayjs } from "dayjs";
import {
  RiUserLine,
  RiPhoneLine,
  RiMailLine,
  RiGraduationCapLine,
  RiBuilding2Line,
  RiMoneyDollarCircleLine,
  RiPassportLine,
  RiBookOpenLine,
  RiCloseLine,
  RiAddLine,
  RiHashtag,
  RiFileTextLine,
  RiCheckLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiEditLine,
} from "react-icons/ri";
import CustomDatePicker from "../../../components/common/CustomDatePicker";
import CustomInput from "../../../components/common/CustomInput";
import CustomModal from "../../../components/common/CustomModal";
import CustomSelect from "../../../components/common/CustomSelect";
import CustomTextarea from "../../../components/common/Customtextarea";
import type {
  EnrolledStudent,
  CreateEnrolledStudentPayload,
  UpdateEnrolledStudentPayload,
} from "../Types";
import {
  createEnrolledStudent,
  updateEnrolledStudent,
} from "../api/ Enrolledapi";
import { message } from "antd";
import dayjs from "dayjs";

// ─── Props ────────────────────────────────────────────────────

interface SelectOption {
  value: string;
  label: string;
}

interface EnrollStudentModalProps {
  open: boolean;
  record: EnrolledStudent | null;
  onClose: () => void;
  isLoading: boolean;
  counselorOptions: SelectOption[];
  onSuccess?: () => void;
  onSubmit: (
    leadId: string,
    payload: Partial<CreateEnrolledStudentPayload>,
  ) => void;
}

// ─── Form shape ───────────────────────────────────────────────

interface EnrollFormData {
  fullName: string;
  phone: string;
  email: string;
  country: string;
  university: string;
  course: string;
  intakeDate: Dayjs | null;
  counselorId: string;
  totalFee: string;
  feePaid: string;
  feeCurrency: string;
  ieltsScore: string;
  source: string;
  passportNumber: string;
  passportExpiry: Dayjs | null;
  visaType: string;
  notes: string;
  leadId: string;
}

const SOURCE_OPTIONS = [
  { value: "WEBSITE", label: "Website" },
  { value: "REFERRAL", label: "Referral" },
  { value: "FACEBOOK", label: "Facebook" },
  { value: "INSTAGRAM", label: "Instagram" },
  { value: "WALK_IN", label: "Walk-in" },
  { value: "GOOGLE_ADS", label: "Google Ads" },
  { value: "META_ADS", label: "Meta Ads" },
  { value: "GOOGLE_SHEET", label: "Google Sheet" },
  { value: "WHATSAPP", label: "WhatsApp" },
];

const VISA_TYPE_OPTIONS = [
  { value: "TIER_4", label: "Tier 4 (UK)" },
  { value: "F1", label: "F-1 (USA)" },
  { value: "STUDY_PERMIT", label: "Study Permit (Canada)" },
  { value: "SUBCLASS_500", label: "Subclass 500 (Australia)" },
  { value: "STUDENT_VISA", label: "Student Visa (Other)" },
];

const COUNTRY_OPTIONS = [
  { value: "UK", label: "🇬🇧 UK" },
  { value: "Canada", label: "🇨🇦 Canada" },
  { value: "USA", label: "🇺🇸 USA" },
  { value: "Australia", label: "🇦🇺 Australia" },
  { value: "Germany", label: "🇩🇪 Germany" },
  { value: "Ireland", label: "🇮🇪 Ireland" },
  { value: "New Zealand", label: "🇳🇿 New Zealand" },
  { value: "Others", label: "Others" },
];

const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD" },
  { value: "GBP", label: "GBP" },
  { value: "CAD", label: "CAD" },
  { value: "AUD", label: "AUD" },
  { value: "EUR", label: "EUR" },
  { value: "INR", label: "INR" },
];

const STEPS = [
  { key: "personal", label: "Personal Info", icon: <RiUserLine size={14} /> },
  {
    key: "academic",
    label: "Academic Details",
    icon: <RiGraduationCapLine size={14} />,
  },
  {
    key: "financial",
    label: "Financial & Visa",
    icon: <RiMoneyDollarCircleLine size={14} />,
  },
];

const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => (
  <div className="flex items-center gap-1 px-6 py-3 border-b border-slate-100">
    {STEPS.map((step, idx) => {
      const isCompleted = idx < currentStep;
      const isCurrent = idx === currentStep;
      return (
        <React.Fragment key={step.key}>
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${
                isCompleted
                  ? "bg-emerald-500 text-white"
                  : isCurrent
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-slate-200 text-slate-400"
              }`}
            >
              {isCompleted ? <RiCheckLine size={13} /> : step.icon}
            </div>
            <span
              className={`text-xs font-semibold hidden sm:inline transition-colors ${
                isCurrent
                  ? "text-blue-600"
                  : isCompleted
                    ? "text-emerald-600"
                    : "text-slate-400"
              }`}
            >
              {step.label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div
              className={`flex-1 h-0.5 rounded-full mx-2 transition-all duration-500 ${
                isCompleted ? "bg-emerald-400" : "bg-slate-200"
              }`}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

const EnrollStudentModal: React.FC<EnrollStudentModalProps> = ({
  open,
  record,
  onClose,
  isLoading,
  onSuccess,
  counselorOptions,
  onSubmit,
}) => {
  const isEdit = !!record;
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
  } = useForm<EnrollFormData>({
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      country: "",
      university: "",
      course: "",
      intakeDate: null,
      counselorId: "",
      totalFee: "",
      feePaid: "",
      feeCurrency: "USD",
      ieltsScore: "",
      source: "",
      passportNumber: "",
      passportExpiry: null,
      visaType: "",
      notes: "",
      leadId: "",
    },
  });

  useEffect(() => {
    if (record) {
      reset({
        fullName: record.fullName ?? "",
        phone: record.phone ?? "",
        email: record.email ?? "",
        country: record.country ?? "",
        university: record.university ?? "",
        course: record.course ?? "",
        intakeDate: record.intakeDate ? dayjs(record.intakeDate) : null,
        counselorId: record.counselorId ?? "",
        totalFee: record.totalFee ? String(record.totalFee) : "",
        feePaid: record.feePaid ? String(record.feePaid) : "",
        feeCurrency: record.feeCurrency ?? "USD",
        ieltsScore: record.ieltsScore ? String(record.ieltsScore) : "",
        source: record.source ?? "",
        passportNumber: record.visaDetail?.passportNumber ?? "",
        passportExpiry: null,
        visaType: record.visaDetail?.visaType ?? "",
        notes: record.notes ?? "",
        leadId: "",
      });
    } else {
      reset({
        fullName: "",
        phone: "",
        email: "",
        country: "",
        university: "",
        course: "",
        intakeDate: null,
        counselorId: "",
        totalFee: "",
        feePaid: "",
        feeCurrency: "USD",
        ieltsScore: "",
        source: "",
        passportNumber: "",
        passportExpiry: null,
        visaType: "",
        notes: "",
        leadId: "",
      });
    }
    setStep(0);
  }, [record, open, reset]);

  const handleClose = useCallback(() => {
    reset();
    setStep(0);
    onClose();
  }, [reset, onClose]);

  const handleNext = useCallback(async () => {
    const stepFields: Record<number, (keyof EnrollFormData)[]> = {
      0: ["fullName", "phone", "email"],
      1: ["country", "university", "course", "intakeDate", "counselorId"],
      2: ["totalFee"],
    };
    const fields = stepFields[step] ?? [];
    const isValid = fields.length ? await trigger(fields) : true;
    if (isValid) setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  }, [step, trigger]);

  const handleBack = useCallback(
    () => setStep((prev) => Math.max(prev - 1, 0)),
    [],
  );

  const onFormSubmit = useCallback(
    async (data: EnrollFormData) => {
      setIsSubmitting(true);
      try {
        if (isEdit && record) {
          const payload: UpdateEnrolledStudentPayload = {
            fullName: data.fullName,
            phone: data.phone,
            email: data.email,
            country: data.country,
            university: data.university,
            course: data.course,
            intakeDate: data.intakeDate?.format("YYYY-MM-DD"),
            counselorId: data.counselorId || undefined,
            totalFee: parseFloat(data.totalFee) || undefined,
            feePaid: parseFloat(data.feePaid) || undefined,
            feeCurrency: data.feeCurrency || undefined,
            ieltsScore: parseFloat(data.ieltsScore) || undefined,
            source:
              (data.source as UpdateEnrolledStudentPayload["source"]) ||
              undefined,
            notes: data.notes || undefined,
          };
          await updateEnrolledStudent(record.id, payload);
          message.success("Student updated successfully!");
          onSuccess?.();
          handleClose();
        } else if (data.leadId) {
          const payload: Partial<CreateEnrolledStudentPayload> = {
            email: data.email,
            country: data.country,
            university: data.university,
            course: data.course,
            intakeDate:
              data.intakeDate?.format("YYYY-MM-DD") ??
              new Date().toISOString().split("T")[0],
            counselorId: data.counselorId || undefined,
            totalFee: parseFloat(data.totalFee) || 0,
            feePaid: parseFloat(data.feePaid) || 0,
            feeCurrency: data.feeCurrency || "USD",
            notes: data.notes || undefined,
          };
          onSubmit(data.leadId, payload);
        } else {
          const payload: CreateEnrolledStudentPayload = {
            fullName: data.fullName,
            phone: data.phone,
            email: data.email,
            country: data.country,
            university: data.university,
            course: data.course,
            intakeDate:
              data.intakeDate?.format("YYYY-MM-DD") ??
              new Date().toISOString().split("T")[0],
            counselorId: data.counselorId || undefined,
            totalFee: parseFloat(data.totalFee) || 0,
            feePaid: parseFloat(data.feePaid) || 0,
            feeCurrency: data.feeCurrency || "USD",
            ieltsScore: parseFloat(data.ieltsScore) || undefined,
            source:
              (data.source as CreateEnrolledStudentPayload["source"]) ||
              undefined,
            notes: data.notes || undefined,
          };
          await createEnrolledStudent(payload);
          message.success("Student enrolled successfully!");
          onSuccess?.();
          handleClose();
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        const serverMsg = err?.response?.data?.message || err?.message || null;
        if (isEdit) {
          message.error(serverMsg || "Failed to update student");
        } else {
          message.error(serverMsg || "Failed to enroll student");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [isEdit, record, onSubmit, onSuccess, handleClose],
  );

  const busy = isSubmitting || isLoading;

  return (
    <CustomModal open={open} onClose={handleClose}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            {isEdit ? (
              <RiEditLine size={18} className="text-blue-600" />
            ) : (
              <RiAddLine size={18} className="text-blue-600" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              {isEdit ? "Edit Student" : "Enroll New Student"}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isEdit
                ? `Editing ${record?.fullName}`
                : "Fill in the details to create enrollment"}
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="p-1.5 rounded-lg hover:bg-slate-100 border-none bg-transparent cursor-pointer flex text-slate-400 hover:text-slate-600 transition-colors"
        >
          <RiCloseLine size={18} />
        </button>
      </div>

      <StepIndicator currentStep={step} />

      <div>
        <div
          className="px-6 py-5 max-h-[420px] overflow-y-auto"
          style={{ scrollbarWidth: "thin" }}
        >
          {/* Step 1: Personal Info */}
          {step === 0 && (
            <div className="flex flex-col gap-4">
              <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                Personal Information
              </p>
              <CustomInput<EnrollFormData>
                name="fullName"
                label="Full Name"
                placeholder="Enter student's full name"
                icon={<RiUserLine size={14} className="text-slate-400" />}
                control={control}
                required
                rules={{ required: "Full name is required" }}
              />
              <div className="grid grid-cols-2 gap-3">
                <CustomInput<EnrollFormData>
                  name="phone"
                  label="Phone Number"
                  placeholder="+91 9876543210"
                  icon={<RiPhoneLine size={14} className="text-slate-400" />}
                  control={control}
                  required
                  rules={{ required: "Phone number is required" }}
                />
                <CustomInput<EnrollFormData>
                  name="email"
                  label="Email Address"
                  type="email"
                  placeholder="student@email.com"
                  icon={<RiMailLine size={14} className="text-slate-400" />}
                  control={control}
                  required
                  rules={{
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* value sent to API is already the enum string e.g. "INSTAGRAM" */}
                <CustomSelect<EnrollFormData>
                  name="source"
                  label="Lead Source"
                  placeholder="Select source"
                  options={SOURCE_OPTIONS}
                  control={control}
                  errors={errors}
                />
                <CustomInput<EnrollFormData>
                  name="ieltsScore"
                  label="IELTS Score"
                  placeholder="e.g. 7.0"
                  icon={<RiFileTextLine size={14} className="text-slate-400" />}
                  control={control}
                />
              </div>
            </div>
          )}

          {/* Step 2: Academic Details */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <p className="text-[11px] font-bold text-violet-600 uppercase tracking-wider">
                Academic &amp; Assignment
              </p>
              <div className="grid grid-cols-2 gap-3">
                <CustomSelect<EnrollFormData>
                  name="country"
                  label="Destination Country"
                  placeholder="Select country"
                  options={COUNTRY_OPTIONS}
                  control={control}
                  errors={errors}
                  required
                  rules={{ required: "Country is required" }}
                />
                <CustomSelect<EnrollFormData>
                  name="counselorId"
                  label="Assigned Counselor"
                  placeholder="Select counselor"
                  options={counselorOptions}
                  control={control}
                  errors={errors}
                  required
                  rules={{ required: "Counselor is required" }}
                />
              </div>
              <CustomInput<EnrollFormData>
                name="university"
                label="University"
                placeholder="Enter university name"
                icon={<RiBuilding2Line size={14} className="text-slate-400" />}
                control={control}
                required
                rules={{ required: "University is required" }}
              />
              <CustomInput<EnrollFormData>
                name="course"
                label="Course / Program"
                placeholder="e.g. MSc Data Science"
                icon={<RiBookOpenLine size={14} className="text-slate-400" />}
                control={control}
                required
                rules={{ required: "Course is required" }}
              />
              <CustomDatePicker
                name="intakeDate"
                label="Intake Date"
                placeholder="Select date"
                control={control}
                errors={errors}
                rules={{ required: "Intake date is required" }}
              />
            </div>
          )}

          {/* Step 3: Financial & Visa */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                Financial &amp; Visa Details
              </p>
              <div className="grid grid-cols-3 gap-3">
                <CustomInput<EnrollFormData>
                  name="totalFee"
                  label="Total Fee"
                  placeholder="e.g. 25000"
                  icon={
                    <RiMoneyDollarCircleLine
                      size={14}
                      className="text-slate-400"
                    />
                  }
                  control={control}
                  required
                  rules={{ required: "Total fee is required" }}
                />
                <CustomInput<EnrollFormData>
                  name="feePaid"
                  label="Fee Paid"
                  placeholder="e.g. 5000"
                  icon={
                    <RiMoneyDollarCircleLine
                      size={14}
                      className="text-slate-400"
                    />
                  }
                  control={control}
                />
                <CustomSelect<EnrollFormData>
                  name="feeCurrency"
                  label="Currency"
                  placeholder="USD"
                  options={CURRENCY_OPTIONS}
                  control={control}
                  errors={errors}
                />
              </div>

              {!isEdit && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-3">
                    <RiPassportLine size={14} className="text-cyan-600" />
                    <span className="text-xs font-bold text-slate-600">
                      Passport &amp; Visa
                    </span>
                    <span className="text-[10px] text-slate-400">
                      (optional)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <CustomInput<EnrollFormData>
                      name="passportNumber"
                      label="Passport Number"
                      placeholder="e.g. P1234567"
                      icon={<RiHashtag size={14} className="text-slate-400" />}
                      control={control}
                    />
                    <CustomDatePicker
                      name="passportExpiry"
                      label="Passport Expiry"
                      placeholder="Select date"
                      control={control}
                      errors={errors}
                    />
                  </div>
                  <div className="mt-3">
                    {/* values match Prisma VisaType enum e.g. "TIER_4" */}
                    <CustomSelect<EnrollFormData>
                      name="visaType"
                      label="Visa Type"
                      placeholder="Select visa type"
                      options={VISA_TYPE_OPTIONS}
                      control={control}
                      errors={errors}
                    />
                  </div>
                </div>
              )}

              <CustomTextarea<EnrollFormData>
                name="notes"
                label="Additional Notes"
                hint="(optional)"
                placeholder="Any additional notes about this enrollment..."
                rows={3}
                control={control}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50/80 border-t border-slate-100">
          <div>
            {step > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold text-slate-600 bg-white border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all"
              >
                <RiArrowLeftLine size={14} /> Back
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl text-[13px] font-semibold text-slate-500 bg-transparent border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-[13px] font-bold text-white bg-blue-600 border-none cursor-pointer hover:bg-blue-700 shadow-sm shadow-blue-200 transition-all"
              >
                Next <RiArrowRightLine size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit(onFormSubmit)}
                disabled={busy}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-[13px] font-bold text-white border-none cursor-pointer shadow-sm transition-all ${
                  busy
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                }`}
              >
                {busy ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isEdit ? "Saving..." : "Enrolling..."}
                  </>
                ) : (
                  <>
                    <RiCheckLine size={14} />
                    {isEdit ? "Save Changes" : "Enroll Student"}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default EnrollStudentModal;
