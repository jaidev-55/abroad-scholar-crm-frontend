import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { message } from "antd";
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
} from "react-icons/ri";
import CustomInput from "../common/CustomInput";
import CustomSelect from "../common/CustomSelect";
import CustomDatePicker from "../common/CustomDatePicker";
import CustomModal from "../common/CustomModal";

// ═══════════════════════════════════════════════════════════════
// FORM TYPES
// ═══════════════════════════════════════════════════════════════

interface EnrollFormData {
  name: string;
  phone: string;
  email: string;
  country: string;
  university: string;
  course: string;
  intake: string;
  intakeDate: any;
  counselor: string;
  feeTotal: string;
  feePaid: string;
  ieltsScore: string;
  passportNumber: string;
  passportExpiry: any;
  visaType: string;
  priority: string;
  source: string;
  notes: string;
}

interface EnrollStudentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (student: Partial<EnrolledStudent>) => void;
}

// ═══════════════════════════════════════════════════════════════
// OPTIONS
// ═══════════════════════════════════════════════════════════════

const COUNTRY_OPTIONS = [
  { value: "🇬🇧 UK", label: "🇬🇧 UK" },
  { value: "🇨🇦 Canada", label: "🇨🇦 Canada" },
  { value: "🇺🇸 USA", label: "🇺🇸 USA" },
  { value: "🇦🇺 Australia", label: "🇦🇺 Australia" },
  { value: "🇩🇪 Germany", label: "🇩🇪 Germany" },
  { value: "🇮🇪 Ireland", label: "🇮🇪 Ireland" },
  { value: "🇳🇿 New Zealand", label: "🇳🇿 New Zealand" },
  { value: "Others", label: "Others" },
];

const COUNSELOR_OPTIONS = [
  { value: "Priya Sharma", label: "Priya Sharma" },
  { value: "Arjun Patel", label: "Arjun Patel" },
  { value: "Sarah Khan", label: "Sarah Khan" },
  { value: "Rohan Mehta", label: "Rohan Mehta" },
  { value: "Anita Desai", label: "Anita Desai" },
];

const INTAKE_OPTIONS = [
  { value: "Jan 2026", label: "Jan 2026" },
  { value: "May 2026", label: "May 2026" },
  { value: "Sep 2026", label: "Sep 2026" },
  { value: "Jan 2027", label: "Jan 2027" },
  { value: "May 2027", label: "May 2027" },
  { value: "Sep 2027", label: "Sep 2027" },
];

const VISA_TYPE_OPTIONS = [
  { value: "Tier 4", label: "Tier 4 (UK)" },
  { value: "F-1", label: "F-1 (USA)" },
  { value: "Study Permit", label: "Study Permit (Canada)" },
  { value: "Student Visa", label: "Student Visa (Other)" },
];

const SOURCE_OPTIONS = [
  { value: "Website", label: "Website" },
  { value: "Referral", label: "Referral" },
  { value: "Facebook", label: "Facebook" },
  { value: "Instagram", label: "Instagram" },
  { value: "Walk-in", label: "Walk-in" },
  { value: "Google Ads", label: "Google Ads" },
  { value: "Education Fair", label: "Education Fair" },
];

// ═══════════════════════════════════════════════════════════════
// STEP INDICATOR
// ═══════════════════════════════════════════════════════════════

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
  <div className="flex items-center gap-1 px-6 py-4 bg-slate-50/80 border-b border-slate-100">
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

// ═══════════════════════════════════════════════════════════════
// MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════

const EnrollStudentModal: React.FC<EnrollStudentModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
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
      name: "",
      phone: "",
      email: "",
      country: "",
      university: "",
      course: "",
      intake: "",
      intakeDate: null,
      counselor: "",
      feeTotal: "",
      feePaid: "",
      ieltsScore: "",
      passportNumber: "",
      passportExpiry: null,
      visaType: "",
      priority: "",
      source: "",
      notes: "",
    },
  });

  const handleClose = () => {
    reset();
    setStep(0);
    onClose();
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof EnrollFormData)[] = [];
    if (step === 0) fieldsToValidate = ["name", "phone", "email"];
    if (step === 1)
      fieldsToValidate = [
        "country",
        "university",
        "course",
        "intake",
        "counselor",
      ];
    if (step === 2) fieldsToValidate = ["feeTotal"];

    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));

  const onFormSubmit = (data: EnrollFormData) => {
    setIsSubmitting(true);

    const newStudent: Partial<any> = {
      id: `STU-${Date.now()}`,
      studentId: `STU-${1000 + Math.floor(Math.random() * 9000)}`,
      name: data.name,
      phone: data.phone,
      email: data.email,
      country: data.country,
      university: data.university,
      course: data.course,
      intake: data.intake,
      intakeDate: data.intakeDate
        ? data.intakeDate.format("YYYY-MM-DD")
        : new Date().toISOString().split("T")[0],
      counselor: data.counselor,
      feeTotal: parseFloat(data.feeTotal) || 0,
      feePaid: parseFloat(data.feePaid) || 0,
      ieltsScore: data.ieltsScore || "0.0",
      visaStatus: "not_started",
      travelStatus: "not_booked",
      admissionStage: 0,
      visa: {
        type: data.visaType || "Student Visa",
        filingDate: null,
        biometricDate: null,
        interviewDate: null,
        status: "not_started",
        passportNumber: data.passportNumber || "",
        passportExpiry: data.passportExpiry
          ? data.passportExpiry.format("YYYY-MM-DD")
          : "",
      },
      documents: [],
      payments: [],
      communications: [],
      preDeparture: [],
      commission: {
        universityRate: 10,
        subAgentRate: 0,
        expectedAmount: 0,
        receivedAmount: 0,
        paymentStatus: "pending",
        agreementUploaded: false,
      },
      risks: [],
    };

    setTimeout(() => {
      onSubmit(newStudent);
      message.success({
        content: "Student enrolled successfully!",
        duration: 2,
      });
      setIsSubmitting(false);
      handleClose();
    }, 600);
  };

  return (
    <CustomModal open={open} onClose={handleClose}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/[0.06]" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <RiAddLine size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white leading-tight">
              Enroll New Student
            </h3>
            <p className="text-[11px] text-white/60 mt-0.5">
              Fill in the details to create enrollment
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="bg-white/15 hover:bg-white/25 border-none rounded-lg p-1.5 cursor-pointer flex text-white transition-colors relative z-10"
        >
          <RiCloseLine size={18} />
        </button>
      </div>

      {/* Step Indicator */}
      <StepIndicator currentStep={step} />

      {/* Form Body */}
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div
          className="px-6 py-5 max-h-[420px] overflow-y-auto"
          style={{ scrollbarWidth: "thin" }}
        >
          {/* Step 1: Personal Info */}
          {step === 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center">
                  <RiUserLine size={13} className="text-blue-600" />
                </div>
                <span className="text-xs font-bold text-slate-700">
                  Personal Information
                </span>
              </div>

              <CustomInput
                name="name"
                label="Full Name"
                placeholder="Enter student's full name"
                icon={<RiUserLine size={14} className="text-slate-400" />}
                control={control}
                rules={{ required: "Full name is required" }}
              />

              <div className="grid grid-cols-2 gap-3">
                <CustomInput
                  name="phone"
                  label="Phone Number"
                  placeholder="+91 9876543210"
                  icon={<RiPhoneLine size={14} className="text-slate-400" />}
                  control={control}
                  rules={{ required: "Phone number is required" }}
                />
                <CustomInput
                  name="email"
                  label="Email Address"
                  type="email"
                  placeholder="student@email.com"
                  icon={<RiMailLine size={14} className="text-slate-400" />}
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email format",
                    },
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <CustomSelect
                  name="source"
                  label="Lead Source"
                  placeholder="Select source"
                  options={SOURCE_OPTIONS}
                  control={control}
                  errors={errors}
                />
                <CustomInput
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
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-lg bg-violet-50 flex items-center justify-center">
                  <RiGraduationCapLine size={13} className="text-violet-600" />
                </div>
                <span className="text-xs font-bold text-slate-700">
                  Academic & Assignment
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <CustomSelect
                  name="country"
                  label="Destination Country"
                  placeholder="Select country"
                  options={COUNTRY_OPTIONS}
                  control={control}
                  errors={errors}
                  required
                  rules={{ required: "Country is required" }}
                />
                <CustomSelect
                  name="counselor"
                  label="Assigned Counselor"
                  placeholder="Select counselor"
                  options={COUNSELOR_OPTIONS}
                  control={control}
                  errors={errors}
                  required
                  rules={{ required: "Counselor is required" }}
                />
              </div>

              <CustomInput
                name="university"
                label="University"
                placeholder="Enter university name"
                icon={<RiBuilding2Line size={14} className="text-slate-400" />}
                control={control}
                rules={{ required: "University is required" }}
              />

              <CustomInput
                name="course"
                label="Course / Program"
                placeholder="e.g. MSc Data Science"
                icon={<RiBookOpenLine size={14} className="text-slate-400" />}
                control={control}
                rules={{ required: "Course is required" }}
              />

              <div className="grid grid-cols-2 gap-3">
                <CustomSelect
                  name="intake"
                  label="Intake"
                  placeholder="Select intake"
                  options={INTAKE_OPTIONS}
                  control={control}
                  errors={errors}
                  required
                  rules={{ required: "Intake is required" }}
                />
                <CustomDatePicker
                  name="intakeDate"
                  label="Intake Date"
                  placeholder="Select date"
                  control={control}
                  errors={errors}
                />
              </div>
            </div>
          )}

          {/* Step 3: Financial & Visa */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <RiMoneyDollarCircleLine
                    size={13}
                    className="text-emerald-600"
                  />
                </div>
                <span className="text-xs font-bold text-slate-700">
                  Financial & Visa Details
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <CustomInput
                  name="feeTotal"
                  label="Total Fee (USD)"
                  placeholder="e.g. 25000"
                  icon={
                    <RiMoneyDollarCircleLine
                      size={14}
                      className="text-slate-400"
                    />
                  }
                  control={control}
                  rules={{ required: "Total fee is required" }}
                />
                <CustomInput
                  name="feePaid"
                  label="Fee Paid (USD)"
                  placeholder="e.g. 5000"
                  icon={
                    <RiMoneyDollarCircleLine
                      size={14}
                      className="text-slate-400"
                    />
                  }
                  control={control}
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <RiPassportLine size={14} className="text-cyan-600" />
                  <span className="text-xs font-bold text-slate-600">
                    Passport & Visa
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <CustomInput
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
                  <CustomSelect
                    name="visaType"
                    label="Visa Type"
                    placeholder="Select visa type"
                    options={VISA_TYPE_OPTIONS}
                    control={control}
                    errors={errors}
                  />
                </div>
              </div>

              <div className="mt-1">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Additional Notes
                </label>
                <textarea
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 resize-none transition-all"
                  rows={3}
                  placeholder="Any additional notes about this enrollment..."
                />
              </div>
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
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-[13px] font-bold text-white border-none cursor-pointer shadow-sm transition-all ${
                  isSubmitting
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enrolling...
                  </>
                ) : (
                  <>
                    <RiCheckLine size={14} /> Enroll Student
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </CustomModal>
  );
};

export default EnrollStudentModal;
