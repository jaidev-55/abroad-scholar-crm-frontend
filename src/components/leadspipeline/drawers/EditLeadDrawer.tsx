import React from "react";
import { Drawer, ConfigProvider, Spin, message } from "antd";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  RiPencilLine,
  RiCloseLine,
  RiCheckLine,
  RiUserLine,
  RiPhoneLine,
  RiMailLine,
  RiLoader4Line,
} from "react-icons/ri";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

import CustomInput from "../../common/CustomInput";
import CustomSelect from "../../common/CustomSelect";
import CustomDatePicker from "../../common/CustomDatePicker";
import type { Lead } from "../../../types/lead";
import { COUNTRIES, SOURCES, STAGES } from "../constants"; // ✅ removed COUNSELORS
import { updateLead, type UpdateLeadPayload } from "../../../api/leads";
import { getUsers } from "../../../api/auth"; // ✅ real API

interface EditFormValues {
  name: string;
  phone: string;
  email: string;
  stage: string;
  source: string;
  counselor: string;
  country: string;
  priority: "Hot" | "Warm" | "Cold";
  followUp: Dayjs | null;
  ieltsScore: string;
}

interface Props {
  lead: Lead | null;
  onClose: () => void;
  onSave: (updated: Lead) => void;
}

const STAGE_TO_STATUS: Record<string, string> = {
  new: "NEW",
  progress: "IN_PROGRESS",
  converted: "CONVERTED",
  lost: "LOST",
};

const PRIORITY_TO_API: Record<string, string> = {
  Hot: "HOT",
  Warm: "WARM",
  Cold: "COLD",
};

const Field: React.FC<{
  label: string;
  required?: boolean;
  children: React.ReactNode;
}> = ({ label, required, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-slate-600">
      {label}
      {required && <span className="text-rose-400 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const PriorityPicker: React.FC<{
  value: string;
  onChange: (v: string) => void;
}> = ({ value, onChange }) => {
  const opts = [
    {
      v: "Hot",
      icon: "🔥",
      active: "#ef4444",
      lightBg: "#fff5f5",
      border: "#fed7d7",
    },
    {
      v: "Warm",
      icon: "⚡",
      active: "#f59e0b",
      lightBg: "#fffbeb",
      border: "#fde68a",
    },
    {
      v: "Cold",
      icon: "❄️",
      active: "#3b82f6",
      lightBg: "#eff6ff",
      border: "#bfdbfe",
    },
  ];
  return (
    <div className="flex gap-2">
      {opts.map((o) => {
        const sel = value === o.v;
        return (
          <button
            key={o.v}
            type="button"
            onClick={() => onChange(o.v)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer outline-none"
            style={{
              border: `2px solid ${sel ? o.active : o.border}`,
              background: sel ? o.active : o.lightBg,
              color: sel ? "#fff" : o.active,
              boxShadow: sel ? `0 2px 8px ${o.active}33` : "none",
            }}
          >
            <span>{o.icon}</span>
            {o.v}
          </button>
        );
      })}
    </div>
  );
};

const StagePicker: React.FC<{
  value: string;
  onChange: (v: string) => void;
}> = ({ value, onChange }) => (
  <div className="grid grid-cols-2 gap-2">
    {STAGES.map((s) => {
      const sel = value === s.id;
      return (
        <button
          key={s.id}
          type="button"
          onClick={() => onChange(s.id)}
          className="py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer outline-none text-left"
          style={{
            border: `2px solid ${sel ? "#2563eb" : "#e8edf2"}`,
            background: sel ? "#eff6ff" : "#fafbfc",
            color: sel ? "#2563eb" : "#64748b",
          }}
        >
          {s.label}
        </button>
      );
    })}
  </div>
);

const EditLeadDrawer: React.FC<Props> = ({ lead, onClose, onSave }) => {
  const queryClient = useQueryClient();

  // ── Fetch real counselors ─────────────────────────
  const { data: counselorUsers = [], isLoading: counselorsLoading } = useQuery({
    queryKey: ["counselors"],
    queryFn: () => getUsers("COUNSELOR"),
    staleTime: 5 * 60 * 1000,
    enabled: !!lead, // only fetch when drawer is open
  });

  const counselorOptions = counselorUsers.map((u) => ({
    value: u.name,
    label: (
      <div className="flex items-center gap-2">
        <div
          className="w-5 h-5 rounded-md bg-blue-50 text-blue-500 font-bold flex items-center justify-center shrink-0"
          style={{ fontSize: 9 }}
        >
          {u.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </div>
        <span>{u.name}</span>
      </div>
    ),
  }));

  const { mutate: updateLeadMutation, isPending } = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateLeadPayload }) =>
      updateLead(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["lead-activity", lead?.id] });
      message.success("Lead updated successfully!");
      onSave(lead!);
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      message.error(
        axiosError?.response?.data?.message || "Failed to update lead.",
      );
    },
  });

  const methods = useForm<EditFormValues>({
    values: lead
      ? {
          name: lead.name,
          phone: lead.phone,
          email: lead.email,
          stage: lead.stage,
          source: lead.source,
          counselor: lead.counselor,
          country: lead.country,
          priority: lead.priority,
          followUp: lead.followUp ? dayjs(lead.followUp) : null,
          ieltsScore: lead.ieltsScore || "",
        }
      : undefined,
  });

  const onSubmit = (data: EditFormValues) => {
    if (!lead) return;
    updateLeadMutation({
      id: lead.id,
      payload: {
        fullName: data.name?.trim(),
        phone: data.phone?.trim(),
        email: data.email?.trim() || undefined,
        country: data.country,
        source: data.source,
        status: STAGE_TO_STATUS[data.stage] as UpdateLeadPayload["status"],
        priority: PRIORITY_TO_API[
          data.priority
        ] as UpdateLeadPayload["priority"],
        followUpDate: data.followUp
          ? data.followUp.format("YYYY-MM-DD")
          : undefined,
        ieltsScore: data.ieltsScore ? parseFloat(data.ieltsScore) : undefined,
      },
    });
  };

  const {
    handleSubmit,
    control,
    formState: { isDirty, errors },
  } = methods;

  if (!lead) return null;

  return (
    <Drawer
      open={!!lead}
      onClose={onClose}
      width={600}
      title={null}
      styles={{
        body: { padding: 0, background: "#f8fafc" },
        header: { display: "none" },
      }}
    >
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#2563EB",
            borderRadius: 10,
            fontFamily: "inherit",
            fontSize: 13,
          },
          components: {
            Input: { borderRadius: 10, colorBorder: "#e8edf2" },
            Select: { borderRadius: 10, colorBorder: "#e8edf2" },
            DatePicker: { borderRadius: 10, colorBorder: "#e8edf2" },
          },
        }}
      >
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col h-full"
          >
            {/* ── HEADER ── */}
            <div className="bg-white px-6 pt-5 pb-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                    <RiPencilLine size={17} color="#7c3aed" />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-bold text-slate-800">
                      Edit Lead
                    </h2>
                    <p className="text-xs text-slate-400">{lead.name}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 border-none bg-transparent cursor-pointer outline-none"
                >
                  <RiCloseLine size={17} />
                </button>
              </div>
            </div>

            {/* ── BODY ── */}
            <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
              {/* Personal Info */}
              <div className="bg-white shadow rounded-2xl border border-slate-100 p-4 flex flex-col gap-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Personal Info
                </p>

                <CustomInput
                  name="name"
                  label="Full Name"
                  placeholder="Full name"
                  control={control}
                  icon={<RiUserLine size={13} className="text-slate-300" />}
                  rules={{ required: "Full name is required" }}
                />

                <div className="grid grid-cols-2 gap-3">
                  <CustomInput
                    name="phone"
                    label="Phone"
                    placeholder="+91 9000000000"
                    control={control}
                    icon={<RiPhoneLine size={13} className="text-slate-300" />}
                    rules={{ required: "Phone is required" }}
                  />
                  <CustomInput
                    name="email"
                    label="Email"
                    type="email"
                    control={control}
                    placeholder="student@email.com"
                    icon={<RiMailLine size={13} className="text-slate-300" />}
                    rules={{
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email",
                      },
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <CustomSelect
                    name="country"
                    label="Country"
                    placeholder="Select country"
                    control={control}
                    errors={errors}
                    options={COUNTRIES.map((c) => ({ value: c, label: c }))}
                  />
                  <CustomSelect
                    name="source"
                    label="Lead Source"
                    placeholder="How did they find us?"
                    control={control}
                    errors={errors}
                    options={SOURCES.map((s) => ({ value: s, label: s }))}
                  />
                </div>
              </div>

              {/* Classification */}
              <div className="bg-white shadow rounded-2xl border border-slate-100 p-4 flex flex-col gap-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Classification
                </p>

                <Controller
                  name="stage"
                  control={control}
                  render={({ field }) => (
                    <Field label="Stage">
                      <StagePicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </Field>
                  )}
                />

                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Field label="Priority">
                      <PriorityPicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </Field>
                  )}
                />

                <div className="grid grid-cols-2 gap-3">
                  {/* ✅ Real counselors from API */}
                  <div className="relative">
                    <CustomSelect
                      name="counselor"
                      label="Assign Counselor"
                      placeholder={
                        counselorsLoading ? "Loading…" : "Assign to…"
                      }
                      control={control}
                      errors={errors}
                      options={counselorOptions}
                    />
                    {counselorsLoading && (
                      <div className="absolute right-3 top-8 flex items-center">
                        <RiLoader4Line
                          size={13}
                          className="animate-spin text-slate-400"
                        />
                      </div>
                    )}
                  </div>

                  <CustomDatePicker
                    name="followUp"
                    label="Follow-up Date"
                    placeholder="Pick a date"
                    control={control}
                    errors={errors}
                  />
                </div>

                <CustomInput
                  name="ieltsScore"
                  label="IELTS Score (if known)"
                  placeholder="e.g. 6.5"
                  icon={
                    <span className="text-xs font-bold text-slate-300 pr-2 mr-1 border-r border-slate-100">
                      Band
                    </span>
                  }
                  control={control}
                />
              </div>
            </div>

            {/* ── FOOTER ── */}
            <div className="bg-white border-t border-slate-200 px-5 py-4 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-semibold cursor-pointer hover:bg-slate-50 outline-none transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isDirty || isPending}
                className={`flex items-center gap-1.5 px-6 py-2 rounded-xl text-white text-xs font-bold border-none outline-none transition-all duration-150 ${isDirty && !isPending ? "bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-md shadow-blue-600/20" : "bg-slate-400 cursor-not-allowed"}`}
              >
                {isPending ? (
                  <>
                    <Spin size="small" /> Saving…
                  </>
                ) : (
                  <>
                    <RiCheckLine size={13} /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </FormProvider>
      </ConfigProvider>
    </Drawer>
  );
};

export default EditLeadDrawer;
