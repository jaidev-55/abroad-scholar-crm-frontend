import React from "react";
import { Modal, Spin } from "antd";
import { RiDeleteBin6Line, RiAlertLine } from "react-icons/ri";

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
  <Modal
    open={open}
    onCancel={onCancel}
    footer={null}
    width={420}
    centered
    closable={!loading}
    maskClosable={!loading}
  >
    <div className="flex flex-col items-center text-center py-2">
      <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-4">
        <RiDeleteBin6Line size={28} className="text-red-500" />
      </div>

      <h3 className="text-[17px] font-black text-slate-900 mb-1.5 leading-tight">
        {mode === "single"
          ? "Delete this lead?"
          : `Delete ${count} lead${count > 1 ? "s" : ""}?`}
      </h3>

      <p className="text-[13px] text-slate-500 leading-relaxed max-w-[300px]">
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
            and their associated data — notes, calls, and activity — will be
            permanently deleted.
          </>
        )}
      </p>

      <div className="flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl">
        <RiAlertLine size={12} className="text-amber-500 shrink-0" />
        <span className="text-[11px] font-semibold text-amber-700">
          This action cannot be undone
        </span>
      </div>

      <div className="flex gap-2.5 mt-5 w-full">
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 h-10 rounded-xl border border-slate-200 text-[13px] font-semibold text-slate-600 bg-white hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[13px] font-bold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
    </div>
  </Modal>
);

export default DeleteConfirmModal;
