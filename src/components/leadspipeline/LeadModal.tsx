import React, { useEffect, useState } from "react";
import { message, Spin } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import {
  RiUserLine,
  RiFileTextLine,
  RiStickyNoteLine,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiCheckLine,
  RiPhoneLine,
  RiMailLine,
  RiGlobalLine,
  RiMapPinLine,
  RiUserSmileLine,
  RiCalendarLine,
  RiAwardLine,
  RiFlashlightLine,
  RiAddLine,
  RiDeleteBinLine,
} from "react-icons/ri";
import type { Dayjs } from "dayjs";
import type { Lead } from "../../types/lead.types";
import CustomInput from "../common/CustomInput";
import CustomSelect from "../common/CustomSelect";
import CustomDatePicker from "../common/CustomDatePicker";
import CustomModal from "../common/CustomModal";
import { createLead } from "../../api/leads";
import dayjs from "dayjs";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (lead: Lead) => void;
  defaultStage?: string;
}

type StepKey = 1 | 2 | 3;

interface FormValues {
  name: string;
  phone: string;
  email: string;
  country: string;
  source: string;
  stage: string;
  priority: "Hot" | "Warm" | "Cold";
  counselor: string;
  followUp: Dayjs | null;
  ieltsScore: string;
}

const SOURCE_OPTIONS = [
  "INSTAGRAM",
  "WEBSITE",
  "WALK_IN",
  "GOOGLE_ADS",
  "META_ADS",
  "REFERRAL",
].map((s) => ({
  value: s,
  label: s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
}));

const COUNTRY_OPTIONS = [
  { value: "USA", label: "🇺🇸 USA" },
  { value: "UK", label: "🇬🇧 UK" },
  { value: "Canada", label: "🇨🇦 Canada" },
  { value: "Australia", label: "🇦🇺 Australia" },
  { value: "Germany", label: "🇩🇪 Germany" },
  { value: "France", label: "🇫🇷 France" },
  { value: "Ireland", label: "🇮🇪 Ireland" },
  { value: "New Zealand", label: "🇳🇿 New Zealand" },
  { value: "Singapore", label: "🇸🇬 Singapore" },
  { value: "Japan", label: "🇯🇵 Japan" },
];

const COUNSELOR_OPTIONS = [
  "Priya Sharma",
  "Rahul Gupta",
  "Anjali Mehta",
  "Vikram Singh",
  "Sneha Patel",
].map((c) => ({ value: c, label: c }));

const STAGES = [
  {
    id: "new",
    label: "New",
    apiStatus: "NEW",
    color: "#3B82F6",
    bg: "#EFF6FF",
  },
  {
    id: "progress",
    label: "In Progress",
    apiStatus: "IN_PROGRESS",
    color: "#8B5CF6",
    bg: "#F5F3FF",
  },
  {
    id: "converted",
    label: "Converted",
    apiStatus: "CONVERTED",
    color: "#10B981",
    bg: "#ECFDF5",
  },
] as const;

const PRIORITY_CONFIG = {
  Hot: {
    icon: "🔥",
    color: "#ef4444",
    bg: "#fff5f5",
    border: "#fed7d7",
    apiValue: "HOT",
  },
  Warm: {
    icon: "⚡",
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fde68a",
    apiValue: "WARM",
  },
  Cold: {
    icon: "❄️",
    color: "#3b82f6",
    bg: "#eff6ff",
    border: "#bfdbfe",
    apiValue: "COLD",
  },
} as const;

const StepIndicator: React.FC<{ current: StepKey }> = ({ current }) => {
  const steps = [
    {
      key: 1 as StepKey,
      label: "Personal Info",
      icon: <RiUserLine size={13} />,
    },
    {
      key: 2 as StepKey,
      label: "Classification",
      icon: <RiFileTextLine size={13} />,
    },
    {
      key: 3 as StepKey,
      label: "Notes & Review",
      icon: <RiStickyNoteLine size={13} />,
    },
  ];
  return (
    <div className="flex items-center mb-6">
      {steps.map((step, i) => {
        const done = current > step.key;
        const active = current === step.key;
        return (
          <React.Fragment key={step.key}>
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-200"
                style={{
                  background: done ? "#10B981" : active ? "#2563eb" : "#f1f5f9",
                  color: done || active ? "#fff" : "#94a3b8",
                }}
              >
                {done ? <RiCheckLine size={13} /> : step.icon}
              </div>
              <span
                className="text-[12px] font-semibold whitespace-nowrap"
                style={{
                  color: active ? "#2563eb" : done ? "#10B981" : "#94a3b8",
                }}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="flex-1 h-px mx-3"
                style={{
                  background: current > step.key ? "#10B981" : "#e2e8f0",
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const ReviewRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
    <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 text-slate-400">
      {icon}
    </div>
    <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide shrink-0">
        {label}
      </span>
      <span className="text-[13px] font-semibold text-slate-700 truncate text-right">
        {value || <span className="text-slate-300 font-normal">—</span>}
      </span>
    </div>
  </div>
);

const LeadModal: React.FC<Props> = ({
  open,
  onClose,
  onSave,
  defaultStage,
}) => {
  const [step, setStep] = useState<StepKey>(1);
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState("");

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      country: "",
      source: "",
      stage: defaultStage ?? "new",
      priority: "Warm",
      counselor: "",
      followUp: null,
      ieltsScore: "",
    },
  });

  const { mutate, isPending } = useMutation({ mutationFn: createLead });

  useEffect(() => {
    if (open) {
      setStep(1);
      setNotes([]);
      setNewNote("");
      reset({
        name: "",
        phone: "",
        email: "",
        country: "",
        source: "",
        stage: defaultStage ?? "new",
        priority: "Warm",
        counselor: "",
        followUp: null,
        ieltsScore: "",
      });
    }
  }, [open, defaultStage, reset]);

  const watchedValues = watch();
  const stageCfg =
    STAGES.find((s) => s.id === watchedValues.stage) ?? STAGES[0];
  const priorityCfg = PRIORITY_CONFIG[watchedValues.priority ?? "Warm"];

  const handleNext = async () => {
    const fields =
      step === 1
        ? (["name", "phone", "country", "source"] as const)
        : step === 2
          ? (["counselor"] as const)
          : [];
    const valid = await trigger(fields as (keyof FormValues)[]);
    if (valid) setStep((p) => (p < 3 ? ((p + 1) as StepKey) : p));
  };

  const handleBack = () => setStep((p) => (p > 1 ? ((p - 1) as StepKey) : p));

  const handleAddNote = () => {
    const text = newNote.trim();
    if (!text) return;
    setNotes((prev) => [...prev, text]);
    setNewNote("");
  };

  const onSubmit = (data: FormValues) => {
    const formatDate = (date: Dayjs) => date.format("YYYY-MM-DD");
    const followUpDate = data.followUp
      ? formatDate(data.followUp)
      : formatDate(dayjs().add(7, "day"));

    // Capture notes at submit time so closure is always fresh
    const currentNotes = [...notes];
    // Add any unsaved note still sitting in the textarea
    const pendingNote = newNote.trim();
    if (pendingNote) currentNotes.push(pendingNote);

    mutate(
      {
        fullName: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email?.trim() || undefined,
        country: data.country, // clean value, no emoji
        source: data.source,
        status: stageCfg.apiStatus,
        priority: priorityCfg.apiValue,
        ieltsScore: data.ieltsScore ? parseFloat(data.ieltsScore) : undefined,
        followUpDate,
        notes: currentNotes.length > 0 ? currentNotes : undefined,
      },
      {
        onSuccess: (res) => {
          const now = new Date().toISOString();

          const newLead: Lead = {
            id: res.id ?? `lead-${Date.now()}`,
            name: res.fullName,
            phone: res.phone,
            email: res.email ?? "",
            country: res.country,
            source: data.source,
            status: stageCfg.apiStatus,
            stage: data.stage,
            priority: data.priority,
            counselor: data.counselor,
            followUp: data.followUp
              ? data.followUp.format("YYYY-MM-DD")
              : followUpDate,
            ieltsScore: data.ieltsScore || undefined,
            notes: currentNotes.map((text, i) => ({
              id: `note-${Date.now()}-${i}`,
              text,
              createdAt: now,
              author: data.counselor || "Admin",
            })),
            createdAt: now.split("T")[0],
          };

          message.success("Lead added successfully!");
          onSave(newLead);
        },
        onError: (err) => {
          message.error(err?.message || "Failed to create lead");
        },
      },
    );
  };

  return (
    <CustomModal open={open} onClose={onClose}>
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <RiAddLine size={18} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-slate-900">
              Add New Lead
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Step {step} of 3 —{" "}
              {step === 1
                ? "Personal Info"
                : step === 2
                  ? "Classification"
                  : "Notes & Review"}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 border-none bg-transparent cursor-pointer outline-none transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
        <StepIndicator current={step} />

        {/* STEP 1 */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-1 bg-blue-50">
              <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                <RiUserLine size={15} className="text-blue-600" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-blue-700">
                  Personal Information
                </p>
                <p className="text-[11px] text-blue-500">
                  Student's basic contact details
                </p>
              </div>
            </div>

            <CustomInput
              name="name"
              label="Full Name"
              placeholder="e.g. Aarav Mehta"
              icon={<RiUserLine size={13} className="text-slate-300" />}
              control={control}
              rules={{ required: "Name is required" }}
            />

            <div className="flex gap-3">
              <div className="flex-1">
                <CustomInput
                  name="phone"
                  label="Phone Number"
                  placeholder="+91 9000000000"
                  icon={<RiPhoneLine size={13} className="text-slate-300" />}
                  control={control}
                  rules={{ required: "Phone is required" }}
                />
              </div>
              <div className="flex-1">
                <CustomInput
                  name="email"
                  label="Email Address"
                  type="email"
                  placeholder="student@email.com"
                  icon={<RiMailLine size={13} className="text-slate-300" />}
                  control={control}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <CustomSelect
                  name="country"
                  label="Destination Country"
                  placeholder="Select country"
                  options={COUNTRY_OPTIONS}
                  required
                  control={control}
                  errors={errors}
                  rules={{ required: "Country is required" }}
                />
              </div>
              <div className="flex-1">
                <CustomSelect
                  name="source"
                  label="Lead Source"
                  placeholder="How did they find us?"
                  options={SOURCE_OPTIONS}
                  required
                  control={control}
                  errors={errors}
                  rules={{ required: "Source is required" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-1 bg-purple-50">
              <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
                <RiFileTextLine size={15} className="text-purple-600" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-purple-700">
                  Classification
                </p>
                <p className="text-[11px] text-purple-500">
                  Pipeline stage, priority & assignment
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-2">
                Pipeline Stage
              </label>
              <Controller
                name="stage"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-4 gap-2">
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
                            borderColor:
                              field.value === p ? cfg.border : "#e2e8f0",
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

            <div className="flex gap-3">
              <div className="flex-1">
                <CustomSelect
                  name="counselor"
                  label="Assign Counselor"
                  placeholder="Select counselor"
                  options={COUNSELOR_OPTIONS}
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
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Review Details
              </p>
              <div className="bg-white rounded-2xl border border-slate-100 px-4 py-1">
                <ReviewRow
                  icon={<RiUserLine size={13} />}
                  label="Name"
                  value={watchedValues.name}
                />
                <ReviewRow
                  icon={<RiPhoneLine size={13} />}
                  label="Phone"
                  value={watchedValues.phone}
                />
                <ReviewRow
                  icon={<RiMailLine size={13} />}
                  label="Email"
                  value={watchedValues.email ?? ""}
                />
                <ReviewRow
                  icon={<RiGlobalLine size={13} />}
                  label="Country"
                  value={watchedValues.country}
                />
                <ReviewRow
                  icon={<RiMapPinLine size={13} />}
                  label="Source"
                  value={watchedValues.source}
                />
                <ReviewRow
                  icon={<RiFlashlightLine size={13} />}
                  label="Stage"
                  value={stageCfg.label}
                />
                <ReviewRow
                  icon={
                    <span style={{ fontSize: 13 }}>{priorityCfg.icon}</span>
                  }
                  label="Priority"
                  value={watchedValues.priority}
                />
                <ReviewRow
                  icon={<RiUserSmileLine size={13} />}
                  label="Counselor"
                  value={watchedValues.counselor}
                />
                {watchedValues.followUp && (
                  <ReviewRow
                    icon={<RiCalendarLine size={13} />}
                    label="Follow-up"
                    value={watchedValues.followUp.format("MMM D, YYYY")}
                  />
                )}
                {watchedValues.ieltsScore && (
                  <ReviewRow
                    icon={<RiAwardLine size={13} />}
                    label="IELTS"
                    value={watchedValues.ieltsScore}
                  />
                )}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Initial Notes (optional)
              </p>

              {notes.length > 0 && (
                <div className="flex flex-col gap-2 mb-3">
                  {notes.map((note, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 bg-white rounded-xl border border-slate-100 px-3 py-2.5"
                    >
                      <RiStickyNoteLine
                        size={13}
                        className="text-blue-400 mt-0.5 shrink-0"
                      />
                      <p className="flex-1 text-[12.5px] text-slate-600 leading-relaxed">
                        {note}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setNotes((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="border-none bg-transparent cursor-pointer p-1 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 outline-none transition-colors shrink-0"
                      >
                        <RiDeleteBinLine size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div
                className="rounded-xl overflow-hidden"
                style={{ border: "1.5px solid #e2e8f0" }}
              >
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      handleAddNote();
                    }
                  }}
                  placeholder="Add a note about this student — key details, concerns, next steps…"
                  rows={3}
                  className="w-full outline-none resize-none text-[12.5px] text-slate-700 placeholder:text-slate-300 leading-relaxed bg-white"
                  style={{
                    padding: "10px 12px",
                    fontFamily: "inherit",
                    border: "none",
                  }}
                />
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400">
                    ⌘ Enter to add
                  </span>
                  <button
                    type="button"
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold border-none cursor-pointer outline-none transition-all"
                    style={{
                      background: newNote.trim() ? "#2563eb" : "#e2e8f0",
                      color: newNote.trim() ? "#fff" : "#94a3b8",
                      cursor: newNote.trim() ? "pointer" : "not-allowed",
                    }}
                  >
                    <RiAddLine size={12} /> Add Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className="rounded-full transition-all duration-200"
              style={{
                width: step === s ? 20 : 6,
                height: 6,
                background:
                  step === s ? "#2563eb" : step > s ? "#10B981" : "#e2e8f0",
              }}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              disabled={isPending}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold border border-slate-200 bg-white text-slate-600 cursor-pointer outline-none hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              <RiArrowLeftLine size={14} /> Back
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-bold border-none bg-blue-600 text-white cursor-pointer outline-none hover:bg-blue-700 transition-all"
            >
              Continue <RiArrowRightLine size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isPending}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-bold border-none bg-emerald-600 text-white cursor-pointer outline-none hover:bg-emerald-700 transition-all disabled:opacity-75"
            >
              {isPending ? (
                <>
                  <Spin size="small" />
                  Saving…
                </>
              ) : (
                <>
                  <RiCheckLine size={14} /> Save Lead
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </CustomModal>
  );
};

export default LeadModal;
