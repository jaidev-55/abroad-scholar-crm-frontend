import React from "react";
import { Drawer, ConfigProvider } from "antd";
import { useForm, FormProvider, Controller } from "react-hook-form";
import {
  RiPencilLine,
  RiCloseLine,
  RiCheckLine,
  RiUserLine,
  RiPhoneLine,
  RiMailLine,
} from "react-icons/ri";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

import CustomInput from "../../common/CustomInput";
import CustomSelect from "../../common/CustomSelect";
import CustomDatePicker from "../../common/CustomDatePicker";
import type { FormValues, Lead } from "../../../types/lead.types";
import { COUNSELORS, COUNTRIES, SOURCES, STAGES } from "../constants";

interface Props {
  lead: Lead | null;
  onClose: () => void;
  onSave: (updated: Lead) => void;
}

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
  const methods = useForm<FormValues>({
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

  const onSubmit = (data: FormValues) => {
    if (!lead) return;

    onSave({
      ...lead,
      ...data,
      followUp: data.followUp
        ? (data.followUp as Dayjs).format("YYYY-MM-DD")
        : lead.followUp,
      ieltsScore: data.ieltsScore || null,
    });
    onClose();
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
            <div className=" flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
              {/* Personal Info card */}
              <div className="bg-white shadow rounded-2xl border border-slate-100 p-4 flex flex-col gap-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Personal Info
                </p>

                {/* CustomInput uses useFormContext internally */}
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

              {/* Classification card */}
              <div className="bg-white shadow rounded-2xl border border-slate-100 p-4 flex flex-col gap-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Classification
                </p>

                {/* Stage — custom button grid, use Controller directly */}
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

                {/* Priority — custom button row, use Controller directly */}
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
                  <CustomSelect
                    name="counselor"
                    label="Assign Counselor"
                    placeholder="Assign to…"
                    control={control}
                    errors={errors}
                    options={COUNSELORS.map((c) => ({
                      value: c,
                      label: (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-5 h-5 rounded-md bg-blue-50 text-blue-500 font-bold flex items-center justify-center shrink-0"
                            style={{ fontSize: 9 }}
                          >
                            {c
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <span>{c}</span>
                        </div>
                      ),
                    }))}
                  />

                  {/* CustomDatePicker uses useFormContext internally */}
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
                    <span
                      className="text-xs font-bold text-slate-300 pr-2 mr-1"
                      style={{ borderRight: "1px solid #f1f5f9" }}
                    >
                      Band
                    </span>
                  }
                />
              </div>
            </div>

            <div className="bg-white border-t border-slate-200 px-5 py-4 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-semibold cursor-pointer hover:bg-slate-50 outline-none transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!isDirty}
                className="flex items-center gap-1.5 px-6 py-2 rounded-xl text-white text-xs font-bold border-none outline-none transition-all duration-150"
                style={{
                  background: isDirty ? "#2563eb" : "#94a3b8",
                  cursor: isDirty ? "pointer" : "not-allowed",
                  boxShadow: isDirty ? "0 2px 8px rgba(37,99,235,0.2)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (isDirty) e.currentTarget.style.background = "#1d4ed8";
                }}
                onMouseLeave={(e) => {
                  if (isDirty) e.currentTarget.style.background = "#2563eb";
                }}
              >
                <RiCheckLine size={13} /> Save Changes
              </button>
            </div>
          </form>
        </FormProvider>
      </ConfigProvider>
    </Drawer>
  );
};

export default EditLeadDrawer;
