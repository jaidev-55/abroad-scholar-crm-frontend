import React from "react";
import type { Dayjs } from "dayjs";
import {
  RiUserLine,
  RiPhoneLine,
  RiMailLine,
  RiGlobalLine,
  RiMapPinLine,
  RiFlashlightLine,
  RiUserSmileLine,
  RiCalendarLine,
  RiAwardLine,
  RiStickyNoteLine,
  RiAddLine,
  RiDeleteBinLine,
} from "react-icons/ri";

import ReviewRow from "./ReviewRow";
import type { FormValues } from "../../../utils/lead/types";
import { PRIORITY_CONFIG, STAGES } from "../../../utils/lead/constants";

interface Props {
  watchedValues: FormValues;
  selectedCounselorName: string;
  notes: string[];
  newNote: string;
  onNewNoteChange: (v: string) => void;
  onAddNote: () => void;
  onRemoveNote: (idx: number) => void;
}

const StepNotesReview: React.FC<Props> = ({
  watchedValues,
  selectedCounselorName,
  notes,
  newNote,
  onNewNoteChange,
  onAddNote,
  onRemoveNote,
}) => {
  const stageCfg =
    STAGES.find((s) => s.id === watchedValues.stage) ?? STAGES[0];
  const priorityCfg = PRIORITY_CONFIG[watchedValues.priority ?? "Warm"];

  return (
    <div className="flex flex-col gap-4">
      {/* Review */}
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          Review Details
        </p>
        <div className="bg-white rounded-2xl border border-slate-100 px-4 py-1">
          <ReviewRow
            icon={<RiUserLine size={13} />}
            label="Name"
            value={watchedValues.name}
          />
          <ReviewRow
            icon={<RiPhoneLine size={13} />}
            label="Phone"
            value={watchedValues.phone}
          />
          <ReviewRow
            icon={<RiMailLine size={13} />}
            label="Email"
            value={watchedValues.email ?? ""}
          />
          <ReviewRow
            icon={<RiGlobalLine size={13} />}
            label="Country"
            value={watchedValues.country}
          />
          <ReviewRow
            icon={<RiMapPinLine size={13} />}
            label="Source"
            value={watchedValues.source}
          />
          <ReviewRow
            icon={<RiFlashlightLine size={13} />}
            label="Stage"
            value={stageCfg.label}
          />
          <ReviewRow
            icon={<span style={{ fontSize: 13 }}>{priorityCfg.icon}</span>}
            label="Priority"
            value={watchedValues.priority}
          />
          <ReviewRow
            icon={<RiUserSmileLine size={13} />}
            label="Counselor"
            value={selectedCounselorName}
          />
          {watchedValues.followUp && (
            <ReviewRow
              icon={<RiCalendarLine size={13} />}
              label="Follow-up"
              value={(watchedValues.followUp as Dayjs).format("MMM D, YYYY")}
            />
          )}
          {watchedValues.ieltsScore && (
            <ReviewRow
              icon={<RiAwardLine size={13} />}
              label="IELTS"
              value={watchedValues.ieltsScore}
            />
          )}
        </div>
      </div>

      {/* Notes */}
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          Initial Notes (optional)
        </p>

        {notes.length > 0 && (
          <div className="flex flex-col gap-2 mb-3">
            {notes.map((note, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 bg-white rounded-xl border border-slate-100 px-3 py-2.5"
              >
                <RiStickyNoteLine
                  size={13}
                  className="text-blue-400 mt-0.5 shrink-0"
                />
                <p className="flex-1 text-[12.5px] text-slate-600 leading-relaxed">
                  {note}
                </p>
                <button
                  type="button"
                  onClick={() => onRemoveNote(idx)}
                  className="border-none bg-transparent cursor-pointer p-1 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 outline-none transition-colors shrink-0"
                >
                  <RiDeleteBinLine size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1.5px solid #e2e8f0" }}
        >
          <textarea
            value={newNote}
            onChange={(e) => onNewNoteChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onAddNote();
              }
            }}
            placeholder="Add a note about this student — key details, concerns, next steps…"
            rows={3}
            className="w-full outline-none resize-none text-[12.5px] text-slate-700 placeholder:text-slate-300 leading-relaxed bg-white"
            style={{
              padding: "10px 12px",
              fontFamily: "inherit",
              border: "none",
            }}
          />
          <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-t border-slate-100">
            <span className="text-[10px] text-slate-400">⌘ Enter to add</span>
            <button
              type="button"
              onClick={onAddNote}
              disabled={!newNote.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold border-none cursor-pointer outline-none transition-all"
              style={{
                background: newNote.trim() ? "#2563eb" : "#e2e8f0",
                color: newNote.trim() ? "#fff" : "#94a3b8",
                cursor: newNote.trim() ? "pointer" : "not-allowed",
              }}
            >
              <RiAddLine size={12} /> Add Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepNotesReview;
