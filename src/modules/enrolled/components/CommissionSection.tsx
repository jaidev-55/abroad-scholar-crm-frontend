import React, { useState, useMemo } from "react";
import { message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  RiMoneyDollarCircleLine,
  RiPercentLine,
  RiExchangeDollarLine,
  RiCheckboxCircleLine,
  RiTimeLine,
  RiCloseLine,
  RiEditLine,
  RiFileTextLine,
  RiCheckboxCircleFill,
  RiCheckLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiHandCoinLine,
  RiAddLine,
} from "react-icons/ri";
import type {
  Commission,
  CommissionStatus,
  CreateCommissionPayload,
  UpdateCommissionPayload,
  RecordCommissionPaymentPayload,
} from "../Types";
import {
  createCommission,
  updateCommission,
  recordCommissionPayment,
} from "../api/ Enrolledapi";
import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import CustomTextarea from "../../../components/common/Customtextarea";

interface CommissionSectionProps {
  studentId: string;
  commission: Commission | null;
  onRefresh: () => void;
}

interface CommissionFormValues {
  universityRate: string;
  subAgentRate: string;
  expectedAmount: string;
  receivedAmount: string;
  status: string;
  notes: string;
}

interface ReceiveFormValues {
  amount: string;
  notes: string;
}

// ─── Options ─────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "PARTIAL", label: "Partial" },
  { value: "PAID", label: "Paid" },
];

const STATUS_MAP: Record<
  CommissionStatus,
  { cls: string; label: string; dotCls: string }
> = {
  PENDING: {
    cls: "bg-amber-50 text-amber-700 border-amber-200",
    label: "Pending",
    dotCls: "bg-amber-500",
  },
  PARTIAL: {
    cls: "bg-blue-50 text-blue-700 border-blue-200",
    label: "Partial",
    dotCls: "bg-blue-500",
  },
  PAID: {
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    label: "Paid",
    dotCls: "bg-emerald-500",
  },
};

const SuccessOverlay: React.FC<{ show: boolean; msg: string }> = ({
  show,
  msg,
}) => (
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
        transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      <RiCheckboxCircleFill size={32} className="text-emerald-500" />
    </div>
    <p className="text-[15px] font-bold text-slate-800 m-0">{msg}</p>
    <p className="text-[12px] text-slate-400 m-0 mt-1">
      Closing automatically…
    </p>
  </div>
);

const CommissionSection: React.FC<CommissionSectionProps> = ({
  studentId,
  commission,
  onRefresh,
}) => {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);

  const pendingAmount = useMemo(
    () =>
      commission ? commission.expectedAmount - commission.receivedAmount : 0,
    [commission],
  );

  const statusCfg =
    STATUS_MAP[commission?.status ?? "PENDING"] ?? STATUS_MAP.PENDING;

  const {
    control: addControl,
    handleSubmit: handleAddSubmit,
    reset: resetAdd,
  } = useForm<CommissionFormValues>({
    defaultValues: {
      universityRate: "",
      subAgentRate: "",
      expectedAmount: "",
      receivedAmount: "",
      notes: "",
    },
  });

  const {
    control: editControl,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<CommissionFormValues>({
    defaultValues: {
      universityRate: String(commission?.universityRate ?? ""),
      subAgentRate: String(commission?.subAgentRate ?? ""),
      expectedAmount: String(commission?.expectedAmount ?? ""),
      receivedAmount: String(commission?.receivedAmount ?? ""),
      notes: "",
    },
  });

  // ── Receive form ────────────────────────────────────────────
  const {
    control: receiveControl,
    handleSubmit: handleReceiveSubmit,
    reset: resetReceive,
  } = useForm<ReceiveFormValues>({
    defaultValues: { amount: "", notes: "" },
  });

  // ── Create mutation ─────────────────────────────────────────
  const { mutate: submitAdd, isPending: isAdding } = useMutation({
    mutationFn: (data: CommissionFormValues) => {
      const payload: CreateCommissionPayload = {
        universityRate: parseFloat(data.universityRate) || 0,
        subAgentRate: parseFloat(data.subAgentRate) || 0,
        expectedAmount: parseFloat(data.expectedAmount) || 0,
        receivedAmount: parseFloat(data.receivedAmount) || 0,
        notes: data.notes || undefined,
      };
      return createCommission(studentId, payload);
    },
    onSuccess: () => {
      setAddSuccess(true);
      setTimeout(() => {
        setAddOpen(false);
        setAddSuccess(false);
        resetAdd();
        onRefresh();
        message.success("Commission added successfully");
      }, 1400);
    },
    onError: () => message.error("Failed to add commission"),
  });

  // ── Update mutation ─────────────────────────────────────────
  const { mutate: submitEdit, isPending: isEditing } = useMutation({
    mutationFn: (data: CommissionFormValues) => {
      const payload: UpdateCommissionPayload = {
        universityRate: parseFloat(data.universityRate) || undefined,
        subAgentRate: parseFloat(data.subAgentRate) || undefined,
        expectedAmount: parseFloat(data.expectedAmount) || undefined,
        status: (data.status as CommissionStatus) || undefined,
        notes: data.notes || undefined,
      };
      return updateCommission(studentId, payload);
    },
    onSuccess: () => {
      setEditSuccess(true);
      setTimeout(() => {
        setEditOpen(false);
        setEditSuccess(false);
        resetEdit();
        onRefresh();
        message.success("Commission updated");
      }, 1400);
    },
    onError: () => message.error("Failed to update commission"),
  });

  // ── Record payment mutation ─────────────────────────────────
  const { mutate: submitPayment, isPending: isRecording } = useMutation({
    mutationFn: (data: ReceiveFormValues) => {
      const payload: RecordCommissionPaymentPayload = {
        amount: parseFloat(data.amount) || 0,
        notes: data.notes || undefined,
      };
      return recordCommissionPayment(studentId, payload);
    },
    onSuccess: (res) => {
      message.success(
        `$${res.payment.amount.toLocaleString()} payment recorded`,
      );
      setReceiveOpen(false);
      resetReceive();
      onRefresh();
    },
    onError: () => message.error("Failed to record payment"),
  });

  // ── Open edit pre-fill ──────────────────────────────────────
  const openEdit = () => {
    resetEdit({
      universityRate: String(commission?.universityRate ?? ""),
      subAgentRate: String(commission?.subAgentRate ?? ""),
      expectedAmount: String(commission?.expectedAmount ?? ""),
      receivedAmount: String(commission?.receivedAmount ?? ""),
      status: commission?.status ?? "PENDING",
      notes: commission?.notes ?? "",
    });
    setEditOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
            <RiHandCoinLine size={16} className="text-red-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            Commission &amp; Partner
          </h3>
          <div className="ml-auto flex items-center gap-2">
            {commission && (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${statusCfg.cls}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotCls}`}
                />
                {statusCfg.label}
              </span>
            )}

            {/* Show Add only when no commission exists */}
            {!commission && (
              <button
                onClick={() => {
                  resetAdd();
                  setAddOpen(true);
                }}
                className="flex items-center gap-1 px-3 py-[6px] rounded-xl text-[12px] font-semibold bg-emerald-600 text-white border-none cursor-pointer hover:bg-emerald-700 transition-all shadow-sm"
              >
                <RiAddLine size={13} /> Add Commission
              </button>
            )}

            {/* Show Edit only when commission exists */}
            {commission && (
              <button
                onClick={openEdit}
                className="flex items-center gap-1 px-3 py-[6px] rounded-xl text-[12px] font-semibold bg-blue-600 text-white border-none cursor-pointer hover:bg-blue-700 transition-all shadow-sm"
              >
                <RiEditLine size={13} /> Edit
              </button>
            )}
          </div>
        </div>

        {/* No commission yet */}
        {!commission ? (
          <div className="py-10 text-center text-slate-400 text-sm">
            No commission recorded yet.{" "}
            <button
              onClick={() => {
                resetAdd();
                setAddOpen(true);
              }}
              className="text-blue-500 font-semibold border-none bg-transparent cursor-pointer hover:underline"
            >
              Add Commission
            </button>
          </div>
        ) : (
          <>
            {/* Metric cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <RiPercentLine size={12} className="text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    University Rate
                  </span>
                </div>
                <p className="text-[18px] font-bold text-slate-800 m-0">
                  {commission.universityRate}%
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <RiExchangeDollarLine size={12} className="text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Sub-Agent Rate
                  </span>
                </div>
                <p className="text-[18px] font-bold text-slate-800 m-0">
                  {commission.subAgentRate}%
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <RiArrowUpLine size={12} className="text-emerald-500" />
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                    Expected
                  </span>
                </div>
                <p className="text-[18px] font-bold text-emerald-700 m-0">
                  ${commission.expectedAmount.toLocaleString()}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <RiCheckboxCircleLine
                    size={12}
                    className="text-emerald-500"
                  />
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                    Received
                  </span>
                </div>
                <p className="text-[18px] font-bold text-emerald-700 m-0">
                  ${commission.receivedAmount.toLocaleString()}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-red-50/50 border border-red-100">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <RiTimeLine size={12} className="text-red-500" />
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
                    Pending
                  </span>
                </div>
                <p className="text-[18px] font-bold text-red-700 m-0">
                  ${pendingAmount.toLocaleString()}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <RiFileTextLine size={12} className="text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Agreement
                  </span>
                </div>
                <p
                  className={`text-[15px] font-bold m-0 ${
                    commission.agreementUrl
                      ? "text-emerald-700"
                      : "text-slate-400"
                  }`}
                >
                  {commission.agreementUrl ? (
                    <a
                      href={commission.agreementUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:underline"
                    >
                      View File
                    </a>
                  ) : (
                    "Not uploaded"
                  )}
                </p>
              </div>
            </div>

            {/* Commission notes */}
            {commission.notes && (
              <div className="mt-3 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                  <RiFileTextLine size={12} className="text-blue-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Notes
                  </span>
                  <p className="text-[12px] text-slate-600 m-0 mt-0.5 leading-relaxed whitespace-pre-wrap">
                    {commission.notes}
                  </p>
                </div>
              </div>
            )}

            {/* Payment history */}
            {commission.payments.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Payment History
                </p>
                <div className="space-y-2">
                  {commission.payments.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-start justify-between px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="text-[12px] font-semibold text-slate-700">
                          ${p.amount.toLocaleString()}
                        </span>
                        {p.notes && (
                          <p className="text-[10px] text-slate-400 m-0 mt-0.5 truncate">
                            {p.notes}
                          </p>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-3 mt-0.5">
                        {new Date(p.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Record payment CTA */}
            {pendingAmount > 0 && (
              <button
                onClick={() => {
                  resetReceive();
                  setReceiveOpen(true);
                }}
                className="w-full mt-3 py-2.5 rounded-xl text-[12px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5"
              >
                <RiArrowDownLine size={14} /> Record Payment Received
              </button>
            )}
          </>
        )}
      </div>

      {/* ── Add Commission Modal ── */}
      <CustomModal
        open={addOpen}
        onClose={() => {
          setAddOpen(false);
          resetAdd();
        }}
      >
        <div className="relative">
          <SuccessOverlay show={addSuccess} msg="Commission Added!" />

          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                <RiAddLine size={18} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-slate-800 m-0">
                  Add Commission
                </h3>
                <p className="text-[12px] text-slate-400 m-0 mt-0.5">
                  Enter commission details
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setAddOpen(false);
                resetAdd();
              }}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center border-none cursor-pointer transition-colors"
            >
              <RiCloseLine size={18} className="text-slate-500" />
            </button>
          </div>

          <div
            className="px-6 pt-4 pb-1 overflow-y-auto space-y-4"
            style={{ maxHeight: "calc(90vh - 200px)" }}
          >
            <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider m-0">
              Commission Rates
            </p>
            <div className="grid grid-cols-2 gap-3">
              <CustomInput<CommissionFormValues>
                name="universityRate"
                label="University Rate (%)"
                placeholder="e.g. 18"
                control={addControl}
                required
                size="middle"
                rules={{ required: "Rate is required" }}
                icon={<RiPercentLine size={14} className="text-slate-400" />}
              />
              <CustomInput<CommissionFormValues>
                name="subAgentRate"
                label="Sub-Agent Rate (%)"
                placeholder="e.g. 1"
                control={addControl}
                size="middle"
                icon={
                  <RiExchangeDollarLine size={14} className="text-slate-400" />
                }
              />
            </div>

            <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider m-0">
              Amounts
            </p>
            <div className="grid grid-cols-2 gap-3">
              <CustomInput<CommissionFormValues>
                name="expectedAmount"
                label="Expected Amount ($)"
                placeholder="e.g. 3451"
                control={addControl}
                required
                size="middle"
                rules={{ required: "Expected amount is required" }}
                icon={
                  <RiMoneyDollarCircleLine
                    size={14}
                    className="text-slate-400"
                  />
                }
              />
              <CustomInput<CommissionFormValues>
                name="receivedAmount"
                label="Received Amount ($)"
                placeholder="e.g. 0"
                control={addControl}
                size="middle"
                icon={
                  <RiMoneyDollarCircleLine
                    size={14}
                    className="text-slate-400"
                  />
                }
              />
            </div>

            <CustomTextarea<CommissionFormValues>
              name="notes"
              label="Notes"
              hint="(optional)"
              placeholder="Any notes about this commission…"
              rows={2}
              control={addControl}
            />
          </div>

          <div className="px-6 py-4 flex gap-3 border-t border-slate-100">
            <button
              onClick={() => {
                setAddOpen(false);
                resetAdd();
              }}
              disabled={isAdding}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-slate-600 bg-slate-100 border-none cursor-pointer hover:bg-slate-200 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddSubmit((d) => submitAdd(d))}
              disabled={isAdding}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white border-none cursor-pointer disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}
            >
              {isAdding ? (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <RiAddLine size={16} />
              )}
              Add Commission
            </button>
          </div>
        </div>
      </CustomModal>

      {/* ── Edit Commission Modal ── */}
      <CustomModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          resetEdit();
        }}
      >
        <div className="relative">
          <SuccessOverlay show={editSuccess} msg="Commission Updated!" />

          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                <RiEditLine size={18} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-slate-800 m-0">
                  Edit Commission
                </h3>
                <p className="text-[12px] text-slate-400 m-0 mt-0.5">
                  Update rates &amp; amounts
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditOpen(false);
                resetEdit();
              }}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center border-none cursor-pointer transition-colors"
            >
              <RiCloseLine size={18} className="text-slate-500" />
            </button>
          </div>

          <div
            className="px-6 pt-4 pb-1 overflow-y-auto space-y-4"
            style={{ maxHeight: "calc(90vh - 200px)" }}
          >
            <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider m-0">
              Commission Rates
            </p>
            <div className="grid grid-cols-2 gap-3">
              <CustomInput<CommissionFormValues>
                name="universityRate"
                label="University Rate (%)"
                placeholder="e.g. 18"
                control={editControl}
                required
                size="middle"
                rules={{ required: "Rate is required" }}
                icon={<RiPercentLine size={14} className="text-slate-400" />}
              />
              <CustomInput<CommissionFormValues>
                name="subAgentRate"
                label="Sub-Agent Rate (%)"
                placeholder="e.g. 1"
                control={editControl}
                size="middle"
                icon={
                  <RiExchangeDollarLine size={14} className="text-slate-400" />
                }
              />
            </div>

            <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider m-0">
              Amounts
            </p>
            <div className="grid grid-cols-2 gap-3">
              <CustomInput<CommissionFormValues>
                name="expectedAmount"
                label="Expected Amount ($)"
                placeholder="e.g. 3451"
                control={editControl}
                required
                size="middle"
                rules={{ required: "Required" }}
                icon={
                  <RiMoneyDollarCircleLine
                    size={14}
                    className="text-slate-400"
                  />
                }
              />
              <CustomInput<CommissionFormValues>
                name="receivedAmount"
                label="Received Amount ($)"
                placeholder="e.g. 1653"
                control={editControl}
                size="middle"
                icon={
                  <RiMoneyDollarCircleLine
                    size={14}
                    className="text-slate-400"
                  />
                }
              />
            </div>

            <CustomSelect<CommissionFormValues>
              name="status"
              label="Status"
              placeholder="Select status"
              options={STATUS_OPTIONS}
              control={editControl}
              errors={editErrors}
              size="middle"
            />

            <CustomTextarea<CommissionFormValues>
              name="notes"
              label="Notes"
              hint="(optional)"
              placeholder="Any notes about commission changes…"
              rows={2}
              control={editControl}
            />
          </div>

          <div className="px-6 py-4 flex gap-3 border-t border-slate-100">
            <button
              onClick={() => {
                setEditOpen(false);
                resetEdit();
              }}
              disabled={isEditing}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-slate-600 bg-slate-100 border-none cursor-pointer hover:bg-slate-200 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEditSubmit((d) => submitEdit(d))}
              disabled={isEditing}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-blue-600 border-none cursor-pointer hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {isEditing ? (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <RiCheckLine size={16} />
              )}
              Save Changes
            </button>
          </div>
        </div>
      </CustomModal>

      {/* ── Record Payment Modal ── */}
      <CustomModal
        open={receiveOpen}
        onClose={() => {
          setReceiveOpen(false);
          resetReceive();
        }}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
              <RiArrowDownLine size={18} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-slate-800 m-0">
                Record Payment
              </h3>
              <p className="text-[12px] text-slate-400 m-0 mt-0.5">
                Pending: ${pendingAmount.toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setReceiveOpen(false);
              resetReceive();
            }}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center border-none cursor-pointer transition-colors"
          >
            <RiCloseLine size={18} className="text-slate-500" />
          </button>
        </div>

        <div className="px-6 pt-4 pb-1 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                Received
              </span>
              <p className="text-[16px] font-bold text-emerald-700 m-0 mt-0.5">
                ${(commission?.receivedAmount ?? 0).toLocaleString()}
              </p>
            </div>
            <div className="flex-1 p-3 rounded-xl bg-red-50 border border-red-100 text-center">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
                Pending
              </span>
              <p className="text-[16px] font-bold text-red-700 m-0 mt-0.5">
                ${pendingAmount.toLocaleString()}
              </p>
            </div>
          </div>

          <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider m-0">
            Payment Details
          </p>

          <CustomInput<ReceiveFormValues>
            name="amount"
            label="Amount Received ($)"
            placeholder={`e.g. ${pendingAmount}`}
            control={receiveControl}
            required
            size="middle"
            rules={{ required: "Amount is required" }}
            icon={
              <RiMoneyDollarCircleLine size={14} className="text-slate-400" />
            }
          />

          <CustomTextarea<ReceiveFormValues>
            name="notes"
            label="Notes"
            hint="(optional)"
            placeholder="Payment reference, date, method…"
            rows={2}
            control={receiveControl}
          />
        </div>

        <div className="px-6 py-4 flex gap-3 border-t border-slate-100">
          <button
            onClick={() => {
              setReceiveOpen(false);
              resetReceive();
            }}
            disabled={isRecording}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-slate-600 bg-slate-100 border-none cursor-pointer hover:bg-slate-200 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleReceiveSubmit((d) => submitPayment(d))}
            disabled={isRecording}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white border-none cursor-pointer disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}
          >
            {isRecording ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <RiCheckLine size={16} />
            )}
            Record Payment
          </button>
        </div>
      </CustomModal>
    </>
  );
};

export default CommissionSection;
