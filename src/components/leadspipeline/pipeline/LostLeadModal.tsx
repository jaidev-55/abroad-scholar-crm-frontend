import React, { useEffect, useState } from "react";
import {
  RiCloseCircleLine,
  RiCloseLine,
  RiCheckLine,
  RiPhoneLine,
  RiMapPinLine,
  RiErrorWarningLine,
  RiFileTextLine,
} from "react-icons/ri";
import CustomModal from "../../common/CustomModal";
import CustomSelect from "../../common/CustomSelect";
import { useForm } from "react-hook-form";
import type { Lead } from "../../../types/lead.types";

type Priority = "Hot" | "Warm" | "Cold";

interface Props {
  lead: Lead | null;
  onClose: () => void;
  onSave: (leadId: string, reason: string, notes: string) => void;
}

const LOST_REASONS = [
  "Budget constraints",
  "Chose another agency",
  "Decided not to study abroad",
  "Visa rejected",
  "Unresponsive",
  "Poor IELTS score",
  "Family issues",
  "Other",
];

const PRIORITY_CONFIG: Record<
  Priority,
  { color: string; bg: string; border: string; icon: string }
> = {
  Hot: { color: "#ef4444", bg: "#fff5f5", border: "#fed7d7", icon: "🔥" },
  Warm: { color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", icon: "⚡" },
  Cold: { color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe", icon: "❄️" },
};

const STAGE_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string }
> = {
  new: { label: "New", color: "#3B82F6", bg: "#EFF6FF", border: "#BFDBFE" },
  progress: {
    label: "In Progress",
    color: "#8B5CF6",
    bg: "#F5F3FF",
    border: "#DDD6FE",
  },
  applied: {
    label: "Applied",
    color: "#F59E0B",
    bg: "#FFFBEB",
    border: "#FDE68A",
  },
  converted: {
    label: "Converted",
    color: "#10B981",
    bg: "#ECFDF5",
    border: "#A7F3D0",
  },
};

const UserAvatar: React.FC<{ name: string; size?: number }> = ({
  name,
  size = 36,
}) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");
  const hue = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  return (
    <div
      className="flex items-center justify-center font-bold shrink-0 select-none"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.35,
        background: `hsl(${hue},60%,92%)`,
        color: `hsl(${hue},50%,35%)`,
        fontSize: size * 0.35,
      }}
    >
      {initials}
    </div>
  );
};

const LostLeadModal: React.FC<Props> = ({ lead, onClose, onSave }) => {
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!lead) return;

    setReason("");
    setNotes("");
    setSaving(false);
    setDone(false);
  }, [lead?.id]);

  const {
    control,
    formState: { errors },
  } = useForm({});

  if (!lead) return null;

  const priority = PRIORITY_CONFIG[lead.priority];
  const stage = STAGE_CONFIG[lead.stage] ?? {
    label: lead.stage,
    color: "#64748b",
    bg: "#f8fafc",
    border: "#e2e8f0",
  };

  const handleConfirm = () => {
    if (!reason) return;
    setSaving(true);
    setTimeout(() => {
      onSave(lead.id, reason, notes);
      setDone(true);
      setSaving(false);
      setTimeout(() => onClose(), 1400);
    }, 600);
  };

  return (
    <CustomModal open={!!lead} onClose={onClose}>
      <div className="flex flex-col">
        {/* ── HEADER ── */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
              <RiCloseCircleLine size={20} color="#ef4444" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-slate-900">
                Mark as Lost
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                This lead will be removed from the pipeline
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 border-none bg-transparent cursor-pointer outline-none transition-colors"
          >
            <RiCloseLine size={17} />
          </button>
        </div>

        {/* ── BODY ── */}
        {!done ? (
          <div className="px-6 py-5 flex flex-col gap-4">
            {/* Lead info card */}
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <UserAvatar name={lead.name} size={40} />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-slate-800 truncate">
                  {lead.name}
                </p>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <RiPhoneLine size={11} /> {lead.phone}
                </p>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <RiMapPinLine size={11} /> {lead.country}
                </p>
              </div>
              <div className="flex flex-col gap-1.5 items-end shrink-0">
                {/* Stage badge */}
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold border"
                  style={{
                    background: stage.bg,
                    color: stage.color,
                    borderColor: stage.border,
                  }}
                >
                  {stage.label}
                </span>
                {/* Priority badge */}
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold border"
                  style={{
                    background: priority.bg,
                    color: priority.color,
                    borderColor: priority.border,
                  }}
                >
                  {priority.icon} {lead.priority}
                </span>
              </div>
            </div>

            {/* Warning banner */}
            <div className="flex items-start gap-2.5 px-3.5 py-3 bg-red-50 rounded-xl border border-red-100">
              <RiErrorWarningLine
                size={15}
                color="#ef4444"
                className="shrink-0 mt-0.5"
              />
              <p className="text-xs text-red-600 leading-relaxed">
                Marking this lead as lost will remove them from your active
                pipeline. This action can be reviewed in your lost leads report.
              </p>
            </div>

            <CustomSelect
              name="lostReason"
              label="Lost Reason"
              placeholder="Select a reason…"
              required
              control={control}
              errors={errors}
              rules={{ required: "Lost reason is required" }}
              options={LOST_REASONS.map((r) => ({ value: r, label: r }))}
            />

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <RiFileTextLine size={12} className="text-slate-400" />
                Additional Notes
                <span className="text-slate-300 font-normal">(optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any context about why this lead was lost…"
                rows={3}
                className="w-full outline-none resize-none text-[12.5px] text-slate-700 placeholder:text-slate-300 leading-relaxed"
                style={{
                  border: "1.5px solid #e8edf2",
                  borderRadius: 10,
                  padding: "10px 12px",
                  fontFamily: "inherit",
                  background: "#fafbfc",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#ef4444")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e8edf2")}
              />
            </div>
          </div>
        ) : (
          /* ── DONE STATE ── */
          <div className="flex flex-col items-center justify-center px-6 py-10">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ background: "#fff5f5", boxShadow: "0 0 0 8px #fee2e2" }}
            >
              <RiCloseCircleLine size={34} color="#ef4444" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Lead marked as lost
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 text-center max-w-xs">
              <span className="font-semibold text-slate-600">{lead.name}</span>{" "}
              has been removed from the pipeline and logged in your lost leads
              report.
            </p>
            {reason && (
              <span className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-50 text-red-600 border border-red-100">
                <RiCloseCircleLine size={12} /> {reason}
              </span>
            )}
          </div>
        )}

        {/* ── FOOTER ── */}
        {!done && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-semibold cursor-pointer hover:bg-slate-100 outline-none transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={!reason || saving}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-white text-xs font-bold border-none outline-none transition-all duration-150"
              style={{
                background: reason && !saving ? "#ef4444" : "#94a3b8",
                cursor: reason && !saving ? "pointer" : "not-allowed",
                boxShadow:
                  reason && !saving ? "0 2px 8px rgba(239,68,68,0.28)" : "none",
              }}
              onMouseEnter={(e) => {
                if (reason && !saving)
                  e.currentTarget.style.background = "#dc2626";
              }}
              onMouseLeave={(e) => {
                if (reason && !saving)
                  e.currentTarget.style.background = "#ef4444";
              }}
            >
              {saving ? (
                <>
                  <span
                    className="w-3.5 h-3.5 rounded-full inline-block border-2 border-white/30"
                    style={{
                      borderTopColor: "#fff",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                  <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                  Saving…
                </>
              ) : (
                <>
                  <RiCheckLine size={13} /> Confirm Lost
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </CustomModal>
  );
};

export default LostLeadModal;
