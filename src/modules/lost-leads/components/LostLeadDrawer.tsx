import React, { useState } from "react";
import {
  RiPhoneLine,
  RiMailLine,
  RiMapPinLine,
  RiUserSmileLine,
  RiCalendarLine,
  RiCloseLine,
  RiHistoryLine,
  RiCloseCircleLine,
  RiArrowGoBackLine,
} from "react-icons/ri";
import { UserAvatar, LostReasonBadge, PriorityBadge } from "./Badges";
import { daysSince, formatDate } from "../utils";
import type { LostLead } from "../types";

interface LostLeadDrawerProps {
  lead: LostLead | null;
  onClose: () => void;
  onReactivate: (lead: LostLead) => void;
}

type DrawerTab = "details" | "reason";
type Tag = { icon: React.ReactNode; text: string };

export const LostLeadDrawer: React.FC<LostLeadDrawerProps> = ({
  lead,
  onClose,
  onReactivate,
}) => {
  const [activeTab, setActiveTab] = useState<DrawerTab>("details");

  if (!lead) return null;

  const daysLost = daysSince(lead.updatedAt);

  const tabs: { key: DrawerTab; label: string; icon: React.ReactNode }[] = [
    { key: "details", label: "Details", icon: <RiHistoryLine size={13} /> },
    {
      key: "reason",
      label: "Lost Details",
      icon: <RiCloseCircleLine size={13} />,
    },
  ];

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[999] animate-fadeIn"
      />
      <div className="fixed top-0 right-0 bottom-0 w-[520px] max-w-[95vw] bg-slate-50 z-[1000] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-500 to-pink-500 px-6 py-5 relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/[0.07]" />
          <div className="flex justify-between items-start relative z-10">
            <div className="flex items-center gap-3">
              <UserAvatar name={lead.fullName} size="xl" />{" "}
              <div>
                <h2 className="text-[17px] font-bold text-white leading-tight">
                  {lead.fullName}
                </h2>
                <p className="text-xs text-white/70 flex items-center gap-1 mt-0.5">
                  <RiPhoneLine size={12} /> {lead.phone}
                </p>
                {lead.email && (
                  <p className="text-xs text-white/60 flex items-center gap-1 mt-0.5">
                    <RiMailLine size={12} /> {lead.email}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/15 hover:bg-white/25 border-none rounded-lg p-1.5 cursor-pointer flex text-white transition-colors"
            >
              <RiCloseLine size={18} />
            </button>
          </div>

          <div className="flex gap-2 mt-3 flex-wrap relative z-10">
            {(
              [
                lead.country && {
                  icon: <RiMapPinLine size={11} />,
                  text: lead.country,
                },
                lead.counselor?.name && {
                  icon: <RiUserSmileLine size={11} />,
                  text: lead.counselor.name,
                },
                {
                  icon: <RiCalendarLine size={11} />,
                  text: `Lost ${daysLost}d ago`,
                },
              ] as (Tag | false)[]
            )
              .filter((tag): tag is Tag => Boolean(tag))
              .map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/20 text-white border border-white/30"
                >
                  {tag.icon} {tag.text}
                </span>
              ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-5 py-2 border-b border-slate-100 bg-white">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold transition-all cursor-pointer border-none ${
                activeTab === tab.key
                  ? "bg-indigo-50 text-indigo-600"
                  : "bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Details Tab */}
          {activeTab === "details" && (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "Priority",
                    content: <PriorityBadge priority={lead.priority} />,
                  },

                  {
                    label: "Lost Date",
                    content: (
                      <span className="text-[13px] font-bold text-slate-800">
                        {formatDate(lead.updatedAt, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    ),
                  },
                  {
                    label: "Days Since Lost",
                    content: (
                      <span className="text-[13px] font-bold text-slate-800">
                        {daysLost} days
                      </span>
                    ),
                  },
                  {
                    label: "Call Attempts",
                    content: (
                      <span className="text-[13px] font-bold text-slate-800">
                        {lead._count.callLogs}
                      </span>
                    ),
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="px-3 py-2.5 rounded-xl bg-white border border-slate-100"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      {item.label}
                    </p>
                    {item.content}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lost Details Tab */}
          {activeTab === "reason" && (
            <div className="flex flex-col gap-4">
              <div className="p-4 bg-red-50/60 rounded-xl border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <RiCloseCircleLine size={15} className="text-red-600" />
                  <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
                    Lost Reason
                  </span>
                </div>
                <LostReasonBadge reasonValue={lead.lostReason} />
              </div>

              {/* Reactivate CTA */}
              <div className="flex items-center justify-between p-3.5 bg-blue-50/60 rounded-xl border border-blue-200">
                <div>
                  <p className="text-xs font-bold text-blue-700">
                    Ready to recover?
                  </p>
                  <p className="text-[11px] text-blue-500 mt-0.5">
                    Move this lead back to the pipeline
                  </p>
                </div>
                <button
                  onClick={() => onReactivate(lead)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold text-white bg-emerald-600 border-none cursor-pointer hover:bg-emerald-700 shadow-sm shadow-emerald-200 transition-all"
                >
                  <RiArrowGoBackLine size={14} /> Reactivate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
