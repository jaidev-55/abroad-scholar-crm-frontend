import React from "react";
import { Input } from "antd";
import { useForm, Controller } from "react-hook-form";
import {
  RiArrowGoBackLine,
  RiCloseLine,
  RiCheckLine,
  RiInformationLine,
} from "react-icons/ri";
import { PriorityBadge, LostReasonBadge } from "./Badges";
import { REACTIVATION_REASONS } from "../constants/constant";
import { formatDate } from "../utils";
import type { LostLead, ReactivateLeadPayload } from "../types";
import CustomModal from "../../../components/common/CustomModal";
import CustomSelect from "../../../components/common/CustomSelect";

interface ReactivationModalProps {
  lead: LostLead | null;
  onClose: () => void;
  onReactivate: (variables: {
    leadId: string;
    payload: ReactivateLeadPayload;
  }) => void;
  isReactivating?: boolean;
}

interface ReactivationFormValues {
  reason: string;
  notes: string;
}

export const ReactivationModal: React.FC<ReactivationModalProps> = ({
  lead,
  onClose,
  onReactivate,
  isReactivating,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReactivationFormValues>({
    defaultValues: { reason: "", notes: "" },
  });

  const onSubmit = (data: ReactivationFormValues) => {
    if (!lead || !data.reason) return;
    onReactivate({
      leadId: lead.id,
      payload: {
        reason: data.reason as ReactivateLeadPayload["reason"],
        notes: data.notes || undefined,
      },
    });
    reset();
  };

  if (!lead) return null;

  return (
    <CustomModal open={!!lead} onClose={onClose}>
      {/* Header */}
      <div className="flex items-center gap-3.5 px-6 py-5 border-b border-slate-100">
        <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
          <RiArrowGoBackLine size={22} className="text-emerald-600" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-bold text-slate-900 leading-tight">
            Reactivate Lead
          </h3>
          <p className="text-[13px] text-slate-400 mt-0.5 truncate">
            {lead.fullName} · Lost on
            {formatDate(lead.updatedAt)}
          </p>
        </div>
        <button
          onClick={onClose}
          className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <RiCloseLine size={20} />
        </button>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* Lead badges summary */}
        <div className="flex flex-wrap gap-2 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
          <PriorityBadge priority={lead.priority} />
          <span className="text-slate-200">·</span>
          <LostReasonBadge reasonValue={lead.lostReason} />
        </div>

        <CustomSelect
          name="reason"
          label="Reactivation Reason"
          placeholder="Why is this lead being reactivated?"
          required
          control={control}
          errors={errors}
          rules={{ required: "Reason is required" }}
          options={REACTIVATION_REASONS.map((r) => ({
            value: r.value,
            label: r.label,
          }))}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600">Notes</label>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                rows={3}
                placeholder="Add context about the reactivation..."
                className="!rounded-xl"
              />
            )}
          />
        </div>

        {/* Info panel */}
        <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-2 flex items-center gap-1.5">
            <RiInformationLine size={13} /> What happens on reactivation:
          </p>
          <div className="flex flex-col gap-1.5">
            {[
              "Status changes from Lost → Active in Lead Pipeline",
              "Auto-creates follow-up task for assigned counselor",
              "Reactivation attempt is logged in lead history",
              "Reactivated count is incremented for tracking",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-xs text-blue-700"
              >
                <RiCheckLine size={11} className="text-blue-500 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-[13px] font-semibold text-slate-500 bg-transparent border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isReactivating}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-[13px] font-bold text-white bg-emerald-600 border-none cursor-pointer hover:bg-emerald-700 shadow-sm shadow-emerald-200 transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isReactivating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Reactivating...
              </>
            ) : (
              <>
                <RiArrowGoBackLine size={14} /> Reactivate Lead
              </>
            )}
          </button>
        </div>
      </div>
    </CustomModal>
  );
};
