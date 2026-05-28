import React from "react";
import { RiDeleteBinLine, RiCloseLine } from "react-icons/ri";
import { Spin } from "antd";
import type { IeltsRecord } from "../api/ielts";

interface Props {
  open: boolean;
  record: IeltsRecord | null;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const IeltsDeleteModal: React.FC<Props> = ({
  open,
  record,
  isLoading,
  onConfirm,
  onClose,
}) => {
  if (!open || !record) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
              <RiDeleteBinLine size={18} className="text-red-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Delete Record
              </h3>
              <p className="text-[11px] text-slate-400">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <RiCloseLine size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5">
          <p className="text-[13px] text-slate-500 leading-relaxed">
            <span className="font-semibold text-slate-700">
              {record.studentName}
            </span>{" "}
            will be permanently removed. All score history and exam data will be
            lost.
          </p>
          <div className="mt-3 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2">
            <span className="text-amber-500 text-sm">⚠</span>
            <span className="text-[11px] font-semibold text-amber-600">
              This action cannot be undone
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-10 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 h-10 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Spin size="small" /> Deleting...
              </>
            ) : (
              <>
                <RiDeleteBinLine size={14} /> Yes, Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IeltsDeleteModal;
