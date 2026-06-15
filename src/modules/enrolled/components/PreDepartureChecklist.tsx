import React, { useState, useCallback } from "react";
import { message, Tooltip } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  RiFlightTakeoffLine,
  RiCheckLine,
  RiAddLine,
  RiCloseLine,
  RiDeleteBin6Line,
  RiEditLine,
  RiCheckboxCircleFill,
  RiErrorWarningLine,
  RiHome4Line,
  RiExchangeDollarLine,
  RiShieldCheckLine,
  RiSuitcaseLine,
  RiFileTextLine,
  RiInformationLine,
} from "react-icons/ri";
import type { PreDepartureItem, PreDepartureCategory } from "../Types";
import {
  createPreDepartureItem,
  togglePreDepartureItem,
  deletePreDepartureItem,
} from "../api/ Enrolledapi";
import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import CustomTextarea from "../../../components/common/Customtextarea";

interface PreDepartureChecklistProps {
  studentId: string;
  items: PreDepartureItem[];
  onRefresh: () => void;
}

interface AddItemFormValues {
  taskName: string;
  category: PreDepartureCategory;
  notes: string;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  TRAVEL: <RiFlightTakeoffLine size={13} />,
  ACCOMMODATION: <RiHome4Line size={13} />,
  FINANCE: <RiExchangeDollarLine size={13} />,
  DOCUMENTS: <RiFileTextLine size={13} />,
  HEALTH: <RiShieldCheckLine size={13} />,
  OTHER: <RiSuitcaseLine size={13} />,
};

const CATEGORY_OPTIONS: { value: PreDepartureCategory; label: string }[] = [
  { value: "TRAVEL", label: "Travel" },
  { value: "ACCOMMODATION", label: "Accommodation" },
  { value: "FINANCE", label: "Finance / Forex" },
  { value: "DOCUMENTS", label: "Documents" },
  { value: "HEALTH", label: "Health / Insurance" },
  { value: "OTHER", label: "Other" },
];

// ─── Success Overlay ──────────────────────────────────────────

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

const PreDepartureChecklist: React.FC<PreDepartureChecklistProps> = ({
  studentId,
  items,
  onRefresh,
}) => {
  const [addOpen, setAddOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<PreDepartureItem | null>(null);
  const [addSuccess, setAddSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddItemFormValues>({
    defaultValues: { taskName: "", category: "OTHER", notes: "" },
  });

  // ── Derived stats ──────────────────────────────────────────
  const completedCount = items.filter((i) => i.isCompleted).length;
  const percent =
    items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  // ── Reset helpers ──────────────────────────────────────────
  const resetAll = useCallback(() => {
    reset({ taskName: "", category: "OTHER", notes: "" });
    setAddSuccess(false);
  }, [reset]);

  // ── Create mutation ────────────────────────────────────────
  const { mutate: submitAdd, isPending: isAdding } = useMutation({
    mutationFn: (data: AddItemFormValues) =>
      createPreDepartureItem(studentId, {
        taskName: data.taskName,
        category: data.category,
        notes: data.notes || undefined,
      }),
    onSuccess: (_, data) => {
      setAddSuccess(true);
      setTimeout(() => {
        setAddOpen(false);
        resetAll();
        onRefresh();
        message.success(`"${data.taskName}" added to checklist`);
      }, 1400);
    },
    onError: () => message.error("Failed to add checklist item"),
  });

  // ── Toggle mutation ────────────────────────────────────────
  const { mutate: handleToggle } = useMutation({
    mutationFn: (itemId: string) => togglePreDepartureItem(studentId, itemId),
    onSuccess: () => onRefresh(),
    onError: () => message.error("Failed to update item"),
  });

  // ── Delete mutation ────────────────────────────────────────
  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: (itemId: string) => deletePreDepartureItem(studentId, itemId),
    onSuccess: () => {
      message.success("Item removed from checklist");
      onRefresh();
      setDeleteOpen(false);
      setDetailOpen(false);
      setActiveItem(null);
    },
    onError: () => message.error("Failed to delete item"),
  });

  // ── Render ─────────────────────────────────────────────────
  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center">
            <RiFlightTakeoffLine size={16} className="text-orange-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            Pre-Departure Checklist
          </h3>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500">
                {completedCount}/{items.length} · {percent}%
              </span>
              <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    percent === 100 ? "bg-emerald-500" : "bg-orange-500"
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
            <button
              onClick={() => {
                resetAll();
                setAddOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-[6px] rounded-xl text-[12px] font-semibold bg-blue-600 text-white border-none cursor-pointer hover:bg-blue-700 transition-all shadow-sm"
            >
              <RiAddLine size={14} /> Add Item
            </button>
          </div>
        </div>

        {/* Checklist grid */}
        {items.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm">
            No checklist items yet. Click Add Item to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleToggle(item.id)}
                onDoubleClick={() => {
                  setActiveItem(item);
                  setDetailOpen(true);
                }}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer bg-transparent text-left group ${
                  item.isCompleted
                    ? "border-emerald-200 bg-emerald-50/50"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {/* Checkbox */}
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    item.isCompleted
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {item.isCompleted ? (
                    <RiCheckLine size={13} />
                  ) : (
                    (CATEGORY_ICONS[item.category] ?? (
                      <RiSuitcaseLine size={13} />
                    ))
                  )}
                </div>

                {/* Task name */}
                <div className="flex-1 min-w-0">
                  <span
                    className={`text-[13px] font-medium block truncate ${
                      item.isCompleted
                        ? "text-emerald-700 line-through"
                        : "text-slate-700"
                    }`}
                  >
                    {item.taskName}
                  </span>
                  {item.category && (
                    <span className="text-[10px] text-slate-400 pr-3">
                      {CATEGORY_OPTIONS.find((c) => c.value === item.category)
                        ?.label ?? item.category}
                    </span>
                  )}
                  {item.notes && (
                    <Tooltip
                      title={item.notes}
                      placement="bottom"
                      overlayStyle={{ maxWidth: 260 }}
                      overlayInnerStyle={{
                        fontSize: 12,
                        padding: "8px 12px",
                        borderRadius: 10,
                      }}
                    >
                      <span
                        className={`inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-md text-[9px] font-medium max-w-full ${
                          item.isCompleted
                            ? "bg-emerald-100/60 text-emerald-600"
                            : "bg-blue-50 text-blue-500"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <RiFileTextLine size={9} className="shrink-0" />
                        <span className="truncate">{item.notes}</span>
                      </span>
                    </Tooltip>
                  )}
                </div>

                {/* Edit icon on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <RiEditLine
                    size={13}
                    className="text-slate-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveItem(item);
                      setDetailOpen(true);
                    }}
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <CustomModal
        open={addOpen}
        onClose={() => {
          setAddOpen(false);
          resetAll();
        }}
      >
        <div className="relative">
          <SuccessOverlay show={addSuccess} msg="Item Added!" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">
                <RiAddLine size={18} className="text-orange-600" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-slate-800 m-0">
                  Add Checklist Item
                </h3>
                <p className="text-[12px] text-slate-400 m-0 mt-0.5">
                  Add a pre-departure task for this student
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setAddOpen(false);
                resetAll();
              }}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center border-none cursor-pointer transition-colors"
            >
              <RiCloseLine size={18} className="text-slate-500" />
            </button>
          </div>

          {/* Body */}
          <div
            className="px-6 pt-4 pb-1 overflow-y-auto space-y-4"
            style={{ maxHeight: "calc(90vh - 200px)" }}
          >
            <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider m-0">
              Task Details
            </p>

            <CustomInput<AddItemFormValues>
              name="taskName"
              label="Task Name"
              placeholder="e.g. Book accommodation, Get travel insurance..."
              control={control}
              required
              size="middle"
              rules={{ required: "Task name is required" }}
            />

            <CustomSelect<AddItemFormValues>
              name="category"
              label="Category"
              placeholder="Select category"
              options={CATEGORY_OPTIONS}
              control={control}
              errors={errors}
              size="middle"
            />

            <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider m-0">
              Additional Info
            </p>

            <CustomTextarea<AddItemFormValues>
              name="notes"
              label="Notes"
              hint="(optional)"
              placeholder="Any additional details or instructions…"
              rows={2}
              control={control}
            />
          </div>

          {/* Footer */}
          <div className="px-6 py-4 flex gap-3 border-t border-slate-100">
            <button
              onClick={() => {
                setAddOpen(false);
                resetAll();
              }}
              disabled={isAdding}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-slate-600 bg-slate-100 border-none cursor-pointer hover:bg-slate-200 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit((d) => submitAdd(d))}
              disabled={isAdding}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-blue-600 border-none cursor-pointer hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {isAdding ? (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <RiAddLine size={16} />
              )}
              Add Item
            </button>
          </div>
        </div>
      </CustomModal>

      {/* ── Detail Modal ── */}
      <CustomModal
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setActiveItem(null);
        }}
      >
        {activeItem && (
          <>
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    activeItem.isCompleted ? "bg-emerald-50" : "bg-slate-100"
                  }`}
                >
                  {activeItem.isCompleted ? (
                    <RiCheckLine size={18} className="text-emerald-600" />
                  ) : (
                    <span className="text-slate-500">
                      {CATEGORY_ICONS[activeItem.category] ?? (
                        <RiSuitcaseLine size={18} />
                      )}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-slate-800 m-0">
                    {activeItem.taskName}
                  </h3>
                  <p className="text-[12px] text-slate-400 m-0 mt-0.5">
                    {CATEGORY_OPTIONS.find(
                      (c) => c.value === activeItem.category,
                    )?.label ?? activeItem.category}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setDetailOpen(false);
                  setActiveItem(null);
                }}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center border-none cursor-pointer transition-colors"
              >
                <RiCloseLine size={18} className="text-slate-500" />
              </button>
            </div>

            <div className="px-6 py-5">
              <div
                className={`flex items-center gap-3 p-4 rounded-xl border ${
                  activeItem.isCompleted
                    ? "bg-emerald-50/50 border-emerald-200"
                    : "bg-amber-50/50 border-amber-200"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activeItem.isCompleted
                      ? "bg-emerald-500 text-white"
                      : "bg-amber-500 text-white"
                  }`}
                >
                  {activeItem.isCompleted ? (
                    <RiCheckLine size={15} />
                  ) : (
                    <RiInformationLine size={15} />
                  )}
                </div>
                <div>
                  <p
                    className={`text-[13px] font-semibold m-0 ${
                      activeItem.isCompleted
                        ? "text-emerald-700"
                        : "text-amber-700"
                    }`}
                  >
                    {activeItem.isCompleted ? "Completed" : "Pending"}
                  </p>
                  {activeItem.completedAt && (
                    <p className="text-[11px] text-slate-400 m-0 mt-0.5">
                      Completed on{" "}
                      {new Date(activeItem.completedAt).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" },
                      )}
                    </p>
                  )}
                  {activeItem.notes && (
                    <p className="text-[11px] text-slate-500 m-0 mt-1">
                      {activeItem.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 pb-5 flex items-center gap-2">
              <button
                onClick={() => {
                  handleToggle(activeItem.id);
                  setDetailOpen(false);
                  setActiveItem(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold border-none cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
                  activeItem.isCompleted
                    ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                    : "bg-emerald-500 text-white hover:bg-emerald-600"
                }`}
              >
                <RiCheckLine size={15} />
                {activeItem.isCompleted
                  ? "Mark as Pending"
                  : "Mark as Complete"}
              </button>
              <Tooltip title="Delete item">
                <button
                  onClick={() => setDeleteOpen(true)}
                  className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 border-none cursor-pointer transition-colors flex items-center justify-center"
                >
                  <RiDeleteBin6Line size={16} />
                </button>
              </Tooltip>
            </div>
          </>
        )}
      </CustomModal>

      {/* ── Delete Confirm Modal ── */}
      <CustomModal open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <div className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <RiErrorWarningLine size={20} className="text-red-500" />
            </div>
            <div>
              <h4 className="text-[14px] font-bold text-slate-800 m-0">
                Remove Checklist Item
              </h4>
              <p className="text-[13px] text-slate-500 m-0 mt-1.5 leading-relaxed">
                Are you sure you want to remove "{activeItem?.taskName}"? This
                cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex gap-2.5 mt-5">
            <button
              onClick={() => setDeleteOpen(false)}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-slate-600 bg-slate-100 border-none cursor-pointer hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => activeItem && handleDelete(activeItem.id)}
              disabled={isDeleting}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-red-500 hover:bg-red-600 border-none cursor-pointer disabled:opacity-60 transition-colors"
            >
              {isDeleting ? "Removing…" : "Remove"}
            </button>
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default PreDepartureChecklist;
