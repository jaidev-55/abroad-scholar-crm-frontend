import React, { useEffect, useState } from "react";
import { message } from "antd";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { RiAddLine } from "react-icons/ri";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import StepIndicator from "./components/StepIndicator";
import StepPersonalInfo from "./components/StepPersonalInfo";
import StepClassification from "./components/StepClassification";
import StepNotesReview from "./components/StepNotesReview";
import ModalFooter from "./components/ModalFooter";
import type { Lead, LeadStage } from "../../types/lead";
import { getUsers } from "../../../../api/auth";
import { createLead } from "../../api/leads";
import { STAGES, PRIORITY_CONFIG } from "../../utils/lead/constants";
import CustomModal from "../../../../components/common/CustomModal";
import type { FormValues, StepKey } from "../../utils/lead/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (lead: Lead) => void;
  defaultStage?: string;
}

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

  const { data: counselorUsers = [], isLoading: counselorsLoading } = useQuery({
    queryKey: ["counselors"],
    queryFn: () => getUsers("COUNSELOR"),
    staleTime: 5 * 60 * 1000,
  });

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
  const counselorOptions = counselorUsers.map((u) => ({
    value: u.id,
    label: u.name,
  }));
  const selectedCounselorName =
    counselorUsers.find((u) => u.id === watchedValues.counselor)?.name ?? "";

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
    const t = newNote.trim();
    if (t) {
      setNotes((n) => [...n, t]);
      setNewNote("");
    }
  };

  const onSubmit = (data: FormValues) => {
    const followUpDate = data.followUp
      ? (data.followUp as Dayjs).format("YYYY-MM-DD")
      : dayjs().add(7, "day").format("YYYY-MM-DD");

    const currentNotes = [...notes];
    const pendingNote = newNote.trim();
    if (pendingNote) currentNotes.push(pendingNote);

    const selectedCounselor = counselorUsers.find(
      (u) => u.name === data.counselor,
    );

    mutate(
      {
        fullName: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email?.trim() || undefined,
        country: data.country,
        source: data.source,
        status: stageCfg.apiStatus,
        priority: priorityCfg.apiValue,
        assignmentType: selectedCounselor ? "MANUAL" : "AUTO",
        counselorId: selectedCounselor?.id || undefined,
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
            stage: data.stage as LeadStage,
            priority: data.priority as Lead["priority"],
            counselor: data.counselor,
            followUp: data.followUp
              ? (data.followUp as Dayjs).format("YYYY-MM-DD")
              : followUpDate,
            ieltsScore: data.ieltsScore || undefined,
            notes: currentNotes.map((text, i) => ({
              id: `note-${Date.now()}-${i}`,
              text,
              createdAt: now,
              author: data.counselor || "Admin",
            })),
            createdAt: now.split("T")[0],
            updatedAt: now.split("T")[0],
          };
          message.success("Lead added successfully!");
          onSave(newLead);
        },
        onError: (err) =>
          message.error(err?.message || "Failed to create lead"),
      },
    );
  };

  return (
    <CustomModal open={open} onClose={onClose}>
      {/* Header */}
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

      {/* Body */}
      <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
        <StepIndicator current={step} />
        {step === 1 && <StepPersonalInfo control={control} errors={errors} />}
        {step === 2 && (
          <StepClassification
            control={control}
            errors={errors}
            counselorOptions={counselorOptions}
            counselorsLoading={counselorsLoading}
          />
        )}
        {step === 3 && (
          <StepNotesReview
            watchedValues={watchedValues}
            selectedCounselorName={selectedCounselorName}
            notes={notes}
            newNote={newNote}
            onNewNoteChange={setNewNote}
            onAddNote={handleAddNote}
            onRemoveNote={(idx) =>
              setNotes((p) => p.filter((_, i) => i !== idx))
            }
          />
        )}
      </div>

      <ModalFooter
        step={step}
        isPending={isPending}
        onBack={handleBack}
        onNext={handleNext}
        onSubmit={handleSubmit(onSubmit)}
      />
    </CustomModal>
  );
};

export default LeadModal;
