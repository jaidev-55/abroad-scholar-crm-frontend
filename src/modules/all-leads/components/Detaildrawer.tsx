import React from "react";
import { Tooltip } from "antd";
import {
  RiPhoneLine,
  RiMailLine,
  RiCalendarLine,
  RiStickyNoteLine,
  RiDeleteBinLine,
} from "react-icons/ri";
import type { ApiLead } from "../../../modules/leadsPipeline/api/leads";

import { STATUS_LABEL } from "../utils/constants";
import { formatSourceLabel } from "../utils/Allleadshelpers";
import { Avatar, PRIORITY_MAP } from "./Allleadsatoms";

interface Props {
  lead: ApiLead;
  today: string;
  onClose: () => void;
  onDelete: (id: string, name: string) => void;
}

const DetailDrawer: React.FC<Props> = ({ lead, today, onClose, onDelete }) => {
  const fu = lead.followUpDate?.split("T")[0] ?? null;
  const isOverdue = fu ? fu < today : false;
  const noteCount = lead.notes?.length ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative w-[460px] h-full bg-slate-50 flex flex-col shadow-2xl">
        {/* Hero header */}
        <div className="px-6 pt-6 pb-5 relative overflow-hidden bg-gradient-to-br from-blue-700 to-blue-500 shrink-0">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/[0.07]" />
          <div className="absolute -bottom-6 left-20 w-24 h-24 rounded-full bg-white/[0.05]" />

          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-3">
              <Avatar name={lead.fullName} size={50} />
              <div>
                <h2 className="text-lg font-black text-white leading-tight">
                  {lead.fullName}
                </h2>
                <p className="text-xs text-white/60 mt-0.5">
                  {lead.country ?? ""}
                  {lead.source ? ` · ${formatSourceLabel(lead.source)}` : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip title="Delete lead">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(lead.id, lead.fullName);
                  }}
                  className="w-8 h-8 rounded-xl bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-white border-none cursor-pointer transition-colors"
                >
                  <RiDeleteBinLine size={14} />
                </button>
              </Tooltip>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white border-none cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex gap-2 mt-4 flex-wrap relative z-10">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/20 text-white border border-white/25">
              {STATUS_LABEL[lead.status]}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/20 text-white border border-white/25">
              {PRIORITY_MAP[lead.priority].label} Priority
            </span>
            {lead.counselor?.name && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/20 text-white border border-white/25">
                {lead.counselor.name}
              </span>
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
          {/* Contact */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              Contact Info
            </p>
            <div className="flex flex-col gap-2.5">
              <a
                href={`tel:${lead.phone}`}
                className="flex items-center gap-2.5 text-[13px] text-slate-700 hover:text-blue-600 no-underline transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <RiPhoneLine size={14} className="text-blue-500" />
                </div>
                {lead.phone}
              </a>
              {lead.email && (
                <a
                  href={`mailto:${lead.email}`}
                  className="flex items-center gap-2.5 text-[13px] text-slate-700 hover:text-blue-600 no-underline transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <RiMailLine size={14} className="text-blue-500" />
                  </div>
                  <span className="truncate">{lead.email}</span>
                </a>
              )}
            </div>
          </div>

          {/* Details grid */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              Lead Details
            </p>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { label: "Country", value: lead.country ?? "—" },
                  {
                    label: "Source",
                    value: lead.source ? formatSourceLabel(lead.source) : "—",
                  },
                  {
                    label: "Counselor",
                    value: lead.counselor?.name ?? "Unassigned",
                  },
                  {
                    label: "IELTS Score",
                    value:
                      lead.ieltsScore != null ? `Band ${lead.ieltsScore}` : "—",
                  },
                  {
                    label: "Notes",
                    value: `${noteCount} note${noteCount !== 1 ? "s" : ""}`,
                  },
                  {
                    label: "Created",
                    value: lead.createdAt
                      ? new Date(lead.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—",
                  },
                ] as const
              ).map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                    {label}
                  </p>
                  <p className="text-[13px] font-semibold text-slate-700">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Follow-up */}
          {fu && (
            <div
              className={`rounded-2xl border p-4 shadow-sm ${isOverdue ? "bg-red-50 border-red-200" : "bg-white border-slate-100"}`}
            >
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Follow-up Date
              </p>
              <div
                className={`flex items-center gap-2 text-sm font-bold ${isOverdue ? "text-red-600" : "text-slate-800"}`}
              >
                <RiCalendarLine size={16} />
                {new Date(fu).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "long",
                  day: "numeric",
                })}
                {isOverdue && (
                  <span className="text-[11px] font-semibold bg-red-100 text-red-600 px-2 py-0.5 rounded-full border border-red-200 ml-1">
                    Overdue
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Lost reason */}
          {lead.lostReason && (
            <div className="bg-red-50 rounded-2xl border border-red-200 p-4 shadow-sm">
              <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">
                Lost Reason
              </p>
              <p className="text-[13px] font-semibold text-red-700">
                {formatSourceLabel(lead.lostReason)}
              </p>
            </div>
          )}

          {/* Notes */}
          {noteCount > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 shrink-0">
                Notes ({noteCount})
              </p>
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                {lead.notes!.map((note) => (
                  <div
                    key={note.id}
                    className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100"
                  >
                    <RiStickyNoteLine
                      size={13}
                      className="text-blue-400 mt-0.5 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {note.content}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {new Date(note.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailDrawer;
