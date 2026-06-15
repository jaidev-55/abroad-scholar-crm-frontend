import React, { useState } from "react";
import { Table, ConfigProvider, Tooltip } from "antd";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  RiMoneyDollarCircleLine,
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiCalendarLine,
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiCloseLine,
} from "react-icons/ri";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import CustomDatePicker from "../../../components/common/CustomDatePicker";
import CustomTextarea from "../../../components/common/Customtextarea";
import type {
  EnrolledStudent,
  FeePayment,
  CreateFeePaymentPayload,
  UpdateFeePaymentPayload,
  FeePaymentStatus,
} from "../Types";
import {
  createFeePayment,
  updateFeePayment,
  deleteFeePayment,
} from "../api/ Enrolledapi";
import type { Dayjs } from "dayjs";

interface FeeFormData {
  type: string;
  amount: string;
  dueDate: Dayjs | null;
  paidDate: Dayjs | null;
  status: FeePaymentStatus;
  paymentMode: string;
  notes: string;
}

const FEE_TYPE_OPTIONS = [
  { value: "Tuition Fee", label: "Tuition Fee" },
  { value: "Application Fee", label: "Application Fee" },
  { value: "Accommodation Fee", label: "Accommodation Fee" },
  { value: "Insurance Fee", label: "Insurance Fee" },
  { value: "Visa Fee", label: "Visa Fee" },
  { value: "Service Charge", label: "Service Charge" },
  { value: "Other", label: "Other" },
];

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "OVERDUE", label: "Overdue" },
];

const MODE_OPTIONS = [
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "CARD", label: "Credit Card" },
  { value: "CASH", label: "Cash" },
  { value: "CHEQUE", label: "Cheque" },
  { value: "ONLINE_PAYMENT", label: "Online" },
  { value: "OTHER", label: "Other" },
];

const STATUS_STYLES: Record<string, string> = {
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  OVERDUE: "bg-red-50 text-red-700 border-red-200",
};

interface FeeModalProps {
  studentId: string;
  record: FeePayment | null;
  currency: string;
  onClose: () => void;
  onRefresh: () => void;
}

const FeeModal: React.FC<FeeModalProps> = ({
  studentId,
  record,
  currency,
  onClose,
  onRefresh,
}) => {
  const isEdit = !!record;
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FeeFormData>({
    defaultValues: {
      type: record?.type ?? "",
      amount: record?.amount ? String(record.amount) : "",
      dueDate: null,
      paidDate: null,
      status: record?.status ?? "PENDING",
      paymentMode: record?.paymentMode ?? "",
      notes: record?.notes ?? "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FeeFormData) => {
      if (isEdit && record) {
        const payload: UpdateFeePaymentPayload = {
          type: data.type,
          amount: parseFloat(data.amount),
          dueDate: data.dueDate ? data.dueDate.format("YYYY-MM-DD") : undefined,
          paidDate: data.paidDate
            ? data.paidDate.format("YYYY-MM-DD")
            : undefined,
          status: data.status,
          paymentMode: data.paymentMode || undefined,
          notes: data.notes || undefined,
        };
        return updateFeePayment(studentId, record.id, payload);
      }
      const payload: CreateFeePaymentPayload = {
        type: data.type,
        amount: parseFloat(data.amount),
        dueDate: data.dueDate ? data.dueDate.format("YYYY-MM-DD") : undefined,
        status: data.status,
        paymentMode: data.paymentMode || undefined,
        notes: data.notes || undefined,
      };
      return createFeePayment(studentId, payload);
    },
    onSuccess: () => {
      message.success(isEdit ? "Fee payment updated" : "Fee payment added");
      onRefresh();
      onClose();
    },
    onError: () => message.error("Failed to save fee payment"),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
              <RiMoneyDollarCircleLine size={15} className="text-emerald-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {isEdit ? "Edit Fee Payment" : "Add Fee Payment"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 border-none bg-transparent cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
          >
            <RiCloseLine size={17} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <CustomSelect<FeeFormData>
              name="type"
              label="Fee Type"
              placeholder="Select type"
              options={FEE_TYPE_OPTIONS}
              control={control}
              errors={errors}
              required
              rules={{ required: "Fee type is required" }}
            />
            <CustomInput<FeeFormData>
              name="amount"
              label={`Amount (${currency})`}
              placeholder="e.g. 5000"
              icon={
                <RiMoneyDollarCircleLine size={13} className="text-slate-400" />
              }
              control={control}
              required
              rules={{ required: "Amount is required" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <CustomDatePicker
              name="dueDate"
              label="Due Date"
              placeholder="Select date"
              control={control}
              errors={errors}
            />
            <CustomDatePicker
              name="paidDate"
              label="Paid Date"
              placeholder="Select date"
              control={control}
              errors={errors}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <CustomSelect<FeeFormData>
              name="status"
              label="Status"
              placeholder="Select status"
              options={STATUS_OPTIONS}
              control={control}
              errors={errors}
            />
            <CustomSelect<FeeFormData>
              name="paymentMode"
              label="Payment Mode"
              placeholder="Select mode"
              options={MODE_OPTIONS}
              control={control}
              errors={errors}
            />
          </div>
          <CustomTextarea<FeeFormData>
            name="notes"
            label="Notes"
            hint="(optional)"
            placeholder="Add any notes..."
            rows={2}
            control={control}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-4 bg-slate-50/80 border-t border-slate-100 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-500 border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit((d) => mutate(d))}
            disabled={isPending}
            className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-60 flex items-center gap-1.5"
          >
            {isPending ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <RiCheckboxCircleLine size={14} />
            )}
            {isEdit ? "Save Changes" : "Add Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Section ─────────────────────────────────────────────

interface FeePaymentSectionProps {
  student: EnrolledStudent | null;
  onRefresh: () => void;
}

const FeePaymentSection: React.FC<FeePaymentSectionProps> = ({
  student,
  onRefresh,
}) => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<FeePayment | null>(null);

  const payments = student?.feePayments ?? [];
  const totalFee = student?.totalFee ?? 0;
  const feePaid = student?.feePaid ?? 0;
  const currency = student?.feeCurrency ?? "USD";
  const outstanding = totalFee - feePaid;
  const pct = totalFee > 0 ? Math.round((feePaid / totalFee) * 100) : 0;

  const { mutate: handleDelete } = useMutation({
    mutationFn: ({ feeId }: { feeId: string }) =>
      deleteFeePayment(student!.id, feeId),
    onSuccess: () => {
      message.success("Fee payment deleted");
      queryClient.invalidateQueries({ queryKey: ["enrolled-list"] });
      queryClient.invalidateQueries({ queryKey: ["enrolled-stats"] });
      onRefresh();
    },
    onError: () => message.error("Failed to delete fee payment"),
  });

  const summaryCards = [
    {
      label: "Total Fee",
      value: `${currency} ${totalFee.toLocaleString()}`,
      bg: "bg-blue-50",
      tc: "text-blue-700",
      icon: <RiMoneyDollarCircleLine size={14} />,
    },
    {
      label: "Paid",
      value: `${currency} ${feePaid.toLocaleString()}`,
      bg: "bg-emerald-50",
      tc: "text-emerald-700",
      icon: <RiCheckboxCircleLine size={14} />,
    },
    {
      label: "Outstanding",
      value: `${currency} ${outstanding.toLocaleString()}`,
      bg: outstanding > 0 ? "bg-red-50" : "bg-slate-50",
      tc: outstanding > 0 ? "text-red-700" : "text-slate-600",
      icon: <RiErrorWarningLine size={14} />,
    },
    {
      label: "Progress",
      value: `${pct}%`,
      bg: pct >= 100 ? "bg-emerald-50" : "bg-amber-50",
      tc: pct >= 100 ? "text-emerald-700" : "text-amber-700",
      icon: <RiCheckboxCircleLine size={14} />,
    },
  ];

  const columns: ColumnsType<FeePayment> = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 180,
      render: (_: string, record: FeePayment) => (
        <div className="min-w-0">
          <span className="text-[13px] font-semibold text-slate-800">
            {record.type}
          </span>
          {record.notes && (
            <Tooltip title={record.notes} placement="bottom">
              <span className="flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-md text-[9px] font-medium bg-blue-50 text-blue-500 max-w-[160px]">
                <RiMoneyDollarCircleLine size={9} className="shrink-0" />
                <span className="truncate">{record.notes}</span>
              </span>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 130,
      render: (a: number) => (
        <span className="text-[13px] font-bold text-slate-900">
          {currency} {a.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      width: 120,
      render: (d?: string) => {
        if (!d) return <span className="text-slate-300 text-xs">—</span>;
        const overdue = new Date(d) < new Date();
        return (
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium ${overdue ? "text-red-600" : "text-slate-600"}`}
          >
            <RiCalendarLine size={12} />
            {new Date(d).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
            {overdue && <RiErrorWarningLine size={11} />}
          </span>
        );
      },
    },
    {
      title: "Paid Date",
      dataIndex: "paidDate",
      key: "paidDate",
      width: 110,
      render: (d?: string) =>
        d ? (
          <span className="text-xs text-slate-500">
            {new Date(d).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        ) : (
          <span className="text-slate-300 text-xs">—</span>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (s: string) => (
        <span
          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
            STATUS_STYLES[s] ?? "bg-slate-50 text-slate-600 border-slate-200"
          }`}
        >
          {s.charAt(0) + s.slice(1).toLowerCase()}
        </span>
      ),
    },
    {
      title: "Mode",
      dataIndex: "paymentMode",
      key: "paymentMode",
      width: 120,
      render: (m?: string) => (
        <span className="text-xs text-slate-500">{m ?? "—"}</span>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 70,
      fixed: "right",
      render: (_: unknown, record: FeePayment) => (
        <div className="flex items-center gap-1">
          <Tooltip title="Edit">
            <button
              onClick={() => {
                setEditRecord(record);
                setModalOpen(true);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors border-none bg-transparent cursor-pointer"
            >
              <RiEditLine size={14} />
            </button>
          </Tooltip>
          <Tooltip title="Delete">
            <button
              onClick={() => handleDelete({ feeId: record.id })}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors border-none bg-transparent cursor-pointer"
            >
              <RiDeleteBinLine size={14} />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
              <RiMoneyDollarCircleLine size={16} className="text-emerald-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Fee &amp; Payment Tracking
            </h3>
          </div>
          <button
            onClick={() => {
              setEditRecord(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors border-none cursor-pointer"
          >
            <RiAddLine size={13} /> Add Payment
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-5 pb-4">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className={`${card.bg} rounded-xl p-3 border border-slate-100`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`${card.tc} opacity-70`}>{card.icon}</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {card.label}
                </span>
              </div>
              <div className={`text-lg font-extrabold ${card.tc}`}>
                {card.value}
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="px-5 pb-4">
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                pct >= 100
                  ? "bg-emerald-500"
                  : pct > 0
                    ? "bg-amber-500"
                    : "bg-slate-300"
              }`}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
        </div>

        {/* Table */}
        <ConfigProvider
          theme={{
            components: {
              Table: {
                headerBg: "#F8FAFC",
                headerColor: "#64748B",
                headerSplitColor: "transparent",
                borderColor: "#F1F5F9",
                cellPaddingBlock: 12,
                cellPaddingInline: 16,
                fontSize: 13,
              },
            },
          }}
        >
          <Table<FeePayment>
            dataSource={payments}
            columns={columns}
            rowKey="id"
            pagination={false}
            size="middle"
            scroll={{ x: 700 }}
            locale={{
              emptyText: (
                <div className="py-8 text-center text-slate-400 text-sm">
                  No fee payments recorded yet
                </div>
              ),
            }}
          />
        </ConfigProvider>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && student && (
        <FeeModal
          studentId={student.id}
          record={editRecord}
          currency={currency}
          onClose={() => {
            setModalOpen(false);
            setEditRecord(null);
          }}
          onRefresh={() => {
            queryClient.invalidateQueries({ queryKey: ["enrolled-list"] });
            queryClient.invalidateQueries({ queryKey: ["enrolled-stats"] });
            onRefresh();
          }}
        />
      )}
    </>
  );
};

export default FeePaymentSection;
