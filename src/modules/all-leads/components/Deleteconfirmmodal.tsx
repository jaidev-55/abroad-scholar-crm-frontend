import React from "react";
import { Spin } from "antd";
import { RiDeleteBin6Line, RiAlertLine, RiCloseLine } from "react-icons/ri";
import CustomModal from "../../../components/common/CustomModal";

interface Props {
  open: boolean;
  mode: "single" | "bulk";
  count?: number;
  leadName?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

const DeleteConfirmModal: React.FC<Props> = ({
  open,
  mode,
  count = 0,
  leadName,
  onConfirm,
  onCancel,
  loading,
}) => (
  <CustomModal open={open} onClose={loading ? undefined : onCancel}>
    {/* Header */}
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
          <RiDeleteBin6Line size={18} className="text-red-500" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            {mode === "single"
              ? "Delete this lead?"
              : `Delete ${count} lead${count > 1 ? "s" : ""}?`}
          </h3>
          <p className="text-[11px] text-slate-400">
            This action cannot be undone
          </p>
        </div>
      </div>
      {!loading && (
        <button
          onClick={onCancel}
          className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
        >
          <RiCloseLine size={15} />
        </button>
      )}
    </div>

    {/* Body */}
    <div className="px-5 py-5">
      <p className="text-[13px] text-slate-500 leading-relaxed">
        {mode === "single" ? (
          <>
            <span className="font-semibold text-slate-700">{leadName}</span>{" "}
            will be permanently removed. All call logs, notes, and activity
            history will be lost.
          </>
        ) : (
          <>
            All{" "}
            <span className="font-semibold text-slate-700">
              {count} selected leads
            </span>{" "}
            and their associated data  notes, calls, and activity will be
            permanently deleted.
          </>
        )}
      </p>
      <div className="flex items-center gap-1.5 mt-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl">
        <RiAlertLine size={12} className="text-amber-500 shrink-0" />
        <span className="text-[11px] font-semibold text-amber-700">
          This action cannot be undone
        </span>
      </div>
    </div>

    {/* Actions */}
    <div className="flex gap-3 px-5 pb-5">
      <button
        onClick={onCancel}
        disabled={loading}
        className="flex-1 h-10 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        disabled={loading}
        className="flex-1 h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Spin size="small" /> Deleting…
          </>
        ) : (
          <>
            <RiDeleteBin6Line size={14} />{" "}
            {mode === "single" ? "Yes, Delete" : `Delete ${count}`}
          </>
        )}
      </button>
    </div>
  </CustomModal>
);

export default DeleteConfirmModal;
