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
import type { Lead } from "../types/lead";
import {
  COUNTRIES,
  PRIORITY_TO_API,
  SOURCES,
  STAGE_TO_STATUS,
} from "../utils/constants";
import { getUsers } from "../../../api/auth";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import CustomDatePicker from "../../../components/common/CustomDatePicker";

import Field from "../../../components/common/Field";
import StagePicker from "../../../components/common/Stagepicker";
import PriorityPicker from "../../../components/common/Prioritypicker";
import type { EditFormValues } from "../types/lead";
import { REGEX } from "../../../utils/regex";
import { updateLead, type UpdateLeadPayload } from "../api/leads";

interface Props {
  lead: Lead | null;
  onClose: () => void;
  onSave: (updated: Lead) => void;
}

const EditLeadDrawer: React.FC<Props> = ({ lead, onClose, onSave }) => {
  const queryClient = useQueryClient();

  const { data: counselorUsers = [], isLoading: counselorsLoading } = useQuery({
    queryKey: ["counselors"],
    queryFn: () => getUsers("COUNSELOR"),
    staleTime: 5 * 60 * 1000,
    enabled: !!lead,
  });

  const counselorOptions = counselorUsers.map((u) => ({
    value: u.id,
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

  // ── Form — syncs values whenever `lead` changes ───────────────────────────
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
          priority: lead.priority as EditFormValues["priority"],
          followUp: lead.followUp ? dayjs(lead.followUp) : null,
          ieltsScore: lead.ieltsScore || "",
          category: lead.category ?? "",
        }
      : undefined,
  });

  const {
    handleSubmit,
    control,
    formState: { isDirty, errors },
  } = methods;

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
        counselorId: data.counselor || undefined,
        followUpDate: data.followUp
          ? data.followUp.format("YYYY-MM-DD")
          : undefined,
        ieltsScore: data.ieltsScore ? parseFloat(data.ieltsScore) : undefined,
        category: (data.category as UpdateLeadPayload["category"]) || undefined,
      },
    });
  };

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
            {/* ── Header ── */}
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

            <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
              {/* Personal info card */}
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
                        value: REGEX.EMAIL,
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

              {/* Classification card */}
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
                  {/* Counselor with loading spinner overlay */}
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

                <CustomSelect
                  name="category"
                  label="Lead Category"
                  placeholder="Select category (optional)"
                  control={control}
                  errors={errors}
                  options={[
                    {
                      value: "ACADEMIC",
                      label: "🎓 Academic — IELTS / PTE Coaching",
                    },
                    {
                      value: "ADMISSION",
                      label: "🏫 Admission — University Applications",
                    },
                  ]}
                />
              </div>
            </div>

            {/* ── Footer ── */}
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
                className={`flex items-center gap-1.5 px-6 py-2 rounded-xl text-white text-xs font-bold border-none outline-none transition-all duration-150 ${
                  isDirty && !isPending
                    ? "bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-md shadow-blue-600/20"
                    : "bg-slate-400 cursor-not-allowed"
                }`}
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
