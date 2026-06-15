import React, { useRef, useState } from "react";
import { Tooltip, message } from "antd";
import {
  RiCheckLine,
  RiTimeLine,
  RiMapPinLine,
  RiArrowRightSLine,
  RiArrowLeftSLine,
  RiSkipForwardLine,
  RiArrowGoBackLine,
  RiEditLine,
  RiCloseLine,
  RiArrowRightLine,
  RiFileTextLine,
  RiHistoryLine,
} from "react-icons/ri";
import { getStagesForCountry } from "../utils/Admissionstages";
import type {
  AdmissionStage,
  EnrollmentActivity,
  EnrollmentStage,
} from "../Types";
import CustomModal from "../../../components/common/CustomModal";

// ─── Stage enum order (must match backend) ────────────────────

const STAGE_ORDER: EnrollmentStage[] = [
  "LEAD_CONVERTED",
  "APPLICATION_SUBMITTED",
  "OFFER_RECEIVED",
  "FEE_PAID",
  "CAS_I20_ISSUED",
  "VISA_FILED",
  "VISA_APPROVED",
  "TRAVEL_DONE",
];

const stageToIndex = (stage: EnrollmentStage | undefined): number => {
  if (!stage) return 0;
  const idx = STAGE_ORDER.indexOf(stage);
  return idx === -1 ? 0 : idx;
};

const indexToStage = (idx: number): EnrollmentStage =>
  STAGE_ORDER[Math.max(0, Math.min(idx, STAGE_ORDER.length - 1))];

// ─── Stage Change Modal ───────────────────────────────────────

interface StageChangeModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (note: string) => void;
  type: "advance" | "revert" | "jump";
  fromStage: AdmissionStage | null;
  toStage: AdmissionStage | null;
  country: string;
}

const StageChangeModal: React.FC<StageChangeModalProps> = ({
  open,
  onClose,
  onConfirm,
  type,
  fromStage,
  toStage,
  country,
}) => {
  const [note, setNote] = useState("");
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = () => {
    setConfirming(true);
    setTimeout(() => {
      onConfirm(note);
      setNote("");
      setConfirming(false);
    }, 400);
  };

  const handleClose = () => {
    setNote("");
    onClose();
  };

  const isRevert = type === "revert";
  const headerColor = isRevert ? "text-amber-600" : "text-blue-600";
  const headerBg = isRevert ? "bg-amber-50" : "bg-blue-50";
  const headerIcon = isRevert ? (
    <RiArrowGoBackLine size={18} />
  ) : (
    <RiSkipForwardLine size={18} />
  );
  const confirmBg = isRevert
    ? "bg-amber-500 hover:bg-amber-600 shadow-amber-200"
    : "bg-blue-600 hover:bg-blue-700 shadow-blue-200";
  const title = isRevert
    ? "Revert Stage"
    : type === "jump"
      ? "Change Stage"
      : "Advance Stage";

  return (
    <CustomModal open={open} onClose={handleClose}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl ${headerBg} flex items-center justify-center`}
          >
            <span className={headerColor}>{headerIcon}</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              {title}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {country} admission pipeline
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="p-1.5 rounded-lg hover:bg-slate-100 border-none bg-transparent cursor-pointer flex text-slate-400 hover:text-slate-600 transition-colors"
        >
          <RiCloseLine size={18} />
        </button>
      </div>

      <div className="px-6 py-5 space-y-4">
        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex-1 text-center">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              From
            </p>
            <div
              className={`w-11 h-11 rounded-xl mx-auto flex items-center justify-center mb-1.5 ${isRevert ? "bg-blue-600 text-white" : "bg-emerald-100 text-emerald-600"}`}
            >
              {fromStage?.icon || <RiCheckLine size={16} />}
            </div>
            <p className="text-[12px] font-semibold text-slate-700">
              {fromStage?.label}
            </p>
          </div>
          <div className="shrink-0">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${isRevert ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"}`}
            >
              <RiArrowRightLine size={16} />
            </div>
          </div>
          <div className="flex-1 text-center">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              To
            </p>
            <div
              className={`w-11 h-11 rounded-xl mx-auto flex items-center justify-center mb-1.5 ${isRevert ? "bg-slate-100 text-slate-400" : "bg-blue-600 text-white shadow-lg shadow-blue-200"}`}
            >
              {toStage?.icon || <RiCheckLine size={16} />}
            </div>
            <p
              className={`text-[12px] font-semibold ${isRevert ? "text-slate-500" : "text-blue-600"}`}
            >
              {toStage?.label}
            </p>
          </div>
        </div>

        {!isRevert && (
          <div className="flex items-start gap-2.5 p-3 bg-blue-50/60 rounded-xl border border-blue-100">
            <RiFileTextLine
              size={14}
              className="text-blue-500 shrink-0 mt-0.5"
            />
            <p className="text-[11px] text-blue-700 leading-relaxed">
              Advancing to <strong>{toStage?.label}</strong> will update the
              student's admission progress. Make sure all requirements for this
              stage are met.
            </p>
          </div>
        )}
        {isRevert && (
          <div className="flex items-start gap-2.5 p-3 bg-amber-50/60 rounded-xl border border-amber-100">
            <RiArrowGoBackLine
              size={14}
              className="text-amber-500 shrink-0 mt-0.5"
            />
            <p className="text-[11px] text-amber-700 leading-relaxed">
              Reverting to <strong>{toStage?.label}</strong> will move the
              student back. This may be needed if a previous step needs rework.
            </p>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Notes <span className="text-slate-300 font-normal">(optional)</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder={
              isRevert
                ? "Reason for reverting (e.g. documents need correction)..."
                : "Add context (e.g. CAS received via email on May 28)..."
            }
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 resize-none transition-all"
            style={{ fontFamily: "inherit" }}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 px-6 py-4 bg-slate-50/80 border-t border-slate-100">
        <button
          onClick={handleClose}
          className="px-4 py-2 rounded-xl text-[13px] font-semibold text-slate-500 bg-transparent border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={confirming}
          className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-[13px] font-bold text-white border-none cursor-pointer shadow-sm transition-all ${confirming ? "bg-slate-400 cursor-not-allowed" : confirmBg}`}
        >
          {confirming ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
              Updating...
            </>
          ) : isRevert ? (
            <>
              <RiArrowGoBackLine size={14} /> Confirm Revert
            </>
          ) : (
            <>
              <RiSkipForwardLine size={14} /> Confirm{" "}
              {type === "jump" ? "Change" : "Advance"}
            </>
          )}
        </button>
      </div>
    </CustomModal>
  );
};

// ─── Activity-based Stage History Log ────────────────────────
// Renders STAGE_CHANGE entries from the real EnrollmentActivity array

const StageHistoryLog: React.FC<{ activities: EnrollmentActivity[] }> = ({
  activities,
}) => {
  const [expanded, setExpanded] = useState(false);

  // Only show stage-change activities
  const stageActivities = activities.filter((a) => a.type === "STAGE_CHANGE");
  if (stageActivities.length === 0) return null;

  const displayItems = expanded ? stageActivities : stageActivities.slice(0, 3);

  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <div className="flex items-center gap-2 mb-3">
        <RiHistoryLine size={14} className="text-slate-400" />
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Stage History
        </span>
        <span className="text-[10px] text-slate-400">
          ({stageActivities.length} changes)
        </span>
      </div>

      <div className="space-y-2">
        {displayItems.map((entry) => (
          <div
            key={entry.id}
            className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100"
          >
            <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-blue-50">
              <span className="text-blue-600">
                <RiArrowRightLine size={11} />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-semibold text-slate-700">
                  {entry.message.includes(" — ")
                    ? entry.message.split(" — ")[0]
                    : entry.message}
                </span>
                {entry.message.includes(" — ") && (
                  <p className="text-[10px] text-blue-500 m-0 mt-0.5 flex items-center gap-1">
                    <RiFileTextLine size={9} className="shrink-0" />
                    {entry.message.split(" — ").slice(1).join(" — ")}
                  </p>
                )}
                <span className="text-[10px] text-slate-300 ml-auto shrink-0">
                  {new Date(entry.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {entry.user?.name && (
                <p className="text-[10px] text-slate-400 mt-0.5">
                  by {entry.user.name}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {stageActivities.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-transparent border-none cursor-pointer transition-colors"
        >
          {expanded
            ? "Show less"
            : `Show all ${stageActivities.length} changes`}
        </button>
      )}
    </div>
  );
};

interface AdmissionTimelineProps {
  currentStage: EnrollmentStage | undefined;
  country: string;
  activities?: EnrollmentActivity[];
  onStageChange?: (newStage: EnrollmentStage, note?: string) => void;
}

const AdmissionTimeline: React.FC<AdmissionTimelineProps> = ({
  currentStage,
  country,
  activities = [],
  onStageChange,
}) => {
  const stages = getStagesForCountry(country);

  // Convert string enum → numeric index for display logic
  const currentIdx = stageToIndex(currentStage);
  const safeCurrentIdx = Math.min(currentIdx, stages.length - 1);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showActions, setShowActions] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"advance" | "revert" | "jump">(
    "advance",
  );
  const [targetIdx, setTargetIdx] = useState<number>(0);

  const canAdvance = safeCurrentIdx < stages.length - 1;
  const canRevert = safeCurrentIdx > 0;

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "right" ? 160 : -160,
      behavior: "smooth",
    });
  };

  const openModal = (type: "advance" | "revert" | "jump", idx: number) => {
    setModalType(type);
    setTargetIdx(idx);
    setModalOpen(true);
  };

  // Convert target index back to EnrollmentStage string before calling parent
  const handleConfirm = (note: string) => {
    const newStage = indexToStage(targetIdx);
    onStageChange?.(newStage, note);
    const label = stages[targetIdx]?.label;
    if (modalType === "revert") {
      message.info({ content: `Reverted to "${label}"`, duration: 2 });
    } else {
      message.success({ content: `Moved to "${label}"`, duration: 2 });
    }
    setModalOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <RiTimeLine size={16} className="text-indigo-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            Admission Progress
          </h3>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-50 text-slate-500 border border-slate-200">
            <RiMapPinLine size={10} /> {country}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 ml-auto mr-1">
            {safeCurrentIdx + 1} of {stages.length} completed
          </span>
          {onStageChange && (
            <button
              onClick={() => setShowActions(!showActions)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer transition-all ${
                showActions
                  ? "bg-blue-50 text-blue-600 border-blue-200"
                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <RiEditLine size={12} /> {showActions ? "Done" : "Update"}
            </button>
          )}
        </div>

        {/* Action Bar */}
        {showActions && onStageChange && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50/60 rounded-xl border border-blue-100">
            <button
              disabled={!canRevert}
              onClick={() =>
                canRevert && openModal("revert", safeCurrentIdx - 1)
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border cursor-pointer transition-all ${
                canRevert
                  ? "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  : "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
              }`}
            >
              <RiArrowGoBackLine size={12} /> Revert
            </button>
            <div className="flex-1 text-center">
              <span className="text-[11px] text-slate-400">Current: </span>
              <span className="text-[11px] font-bold text-blue-600">
                {stages[safeCurrentIdx]?.label}
              </span>
            </div>
            <button
              disabled={!canAdvance}
              onClick={() =>
                canAdvance && openModal("advance", safeCurrentIdx + 1)
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border-none cursor-pointer transition-all ${
                canAdvance
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Advance <RiSkipForwardLine size={12} />
            </button>
          </div>
        )}

        {/* Timeline */}
        <div className="relative group">
          {stages.length > 6 && (
            <>
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-all opacity-0 group-hover:opacity-100 -ml-2"
              >
                <RiArrowLeftSLine size={14} className="text-slate-500" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-all opacity-0 group-hover:opacity-100 -mr-2"
              >
                <RiArrowRightSLine size={14} className="text-slate-500" />
              </button>
            </>
          )}

          <div
            ref={scrollRef}
            className="overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            <div
              className="relative flex"
              style={{ minWidth: `${stages.length * 100}px`, paddingBottom: 4 }}
            >
              {/* Track */}
              <div className="absolute top-5 left-[50px] right-[50px] h-1 bg-slate-100 rounded-full" />
              {/* Fill */}
              <div
                className="absolute top-5 left-[50px] h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700"
                style={{
                  width:
                    stages.length > 1
                      ? `calc(${(safeCurrentIdx / (stages.length - 1)) * 100}% - ${100 / (stages.length - 1)}px)`
                      : "0px",
                }}
              />

              <div className="relative flex justify-between w-full">
                {stages.map((stage, idx) => {
                  const isCompleted = idx <= safeCurrentIdx;
                  const isCurrent = idx === safeCurrentIdx;
                  const isClickable = !!(showActions && onStageChange);

                  return (
                    <Tooltip
                      key={stage.key}
                      title={
                        <span>
                          <strong>{stage.label}</strong>
                          {isCompleted && !isCurrent && (
                            <span className="block text-emerald-300 text-[10px] mt-0.5">
                              ✓ Completed
                            </span>
                          )}
                          {isCurrent && (
                            <span className="block text-blue-300 text-[10px] mt-0.5">
                              ● Current Stage
                            </span>
                          )}
                          {isClickable && !isCurrent && (
                            <span className="block text-amber-300 text-[10px] mt-0.5">
                              Click to change
                            </span>
                          )}
                        </span>
                      }
                    >
                      <button
                        onClick={() => {
                          if (isClickable && !isCurrent) {
                            openModal(
                              idx < safeCurrentIdx ? "revert" : "jump",
                              idx,
                            );
                          }
                        }}
                        className={`flex flex-col items-center gap-2 bg-transparent border-none transition-all shrink-0 group/item ${isClickable && !isCurrent ? "cursor-pointer" : "cursor-default"} ${isCompleted ? "opacity-100" : "opacity-40"}`}
                        style={{
                          width: `${100 / stages.length}%`,
                          minWidth: 80,
                        }}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            isCurrent
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110"
                              : isCompleted
                                ? "bg-emerald-100 text-emerald-600 group-hover/item:bg-emerald-200"
                                : isClickable
                                  ? "bg-slate-100 text-slate-400 group-hover/item:bg-blue-50 group-hover/item:text-blue-400"
                                  : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {isCompleted && !isCurrent ? (
                            <RiCheckLine size={16} />
                          ) : (
                            stage.icon
                          )}
                        </div>
                        <span
                          className={`text-[10px] font-semibold text-center leading-tight max-w-[80px] ${
                            isCurrent
                              ? "text-blue-600"
                              : isCompleted
                                ? "text-slate-700"
                                : "text-slate-400"
                          }`}
                        >
                          {stage.label}
                        </span>
                      </button>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Stage History from real activities */}
        <StageHistoryLog activities={activities} />
      </div>

      <StageChangeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        type={modalType}
        fromStage={stages[safeCurrentIdx] || null}
        toStage={stages[targetIdx] || null}
        country={country}
      />
    </>
  );
};

export default AdmissionTimeline;
