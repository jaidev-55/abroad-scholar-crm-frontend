import React from "react";
import { RiStarFill, RiStarLine } from "react-icons/ri";
import type { CallRating } from "../../../utils/calls/types";

interface Props {
  value: CallRating | null;
  onChange: (v: CallRating) => void;
}

const LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

const StarRating: React.FC<Props> = ({ value, onChange }) => (
  <div className="flex items-center gap-1.5">
    {([1, 2, 3, 4, 5] as CallRating[]).map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        className="border-none bg-transparent cursor-pointer p-0.5 outline-none transition-transform hover:scale-110 active:scale-95"
      >
        {value !== null && star <= value ? (
          <RiStarFill size={20} className="text-amber-400" />
        ) : (
          <RiStarLine size={20} className="text-slate-300" />
        )}
      </button>
    ))}
    {value && (
      <span className="text-xs font-semibold text-amber-600 ml-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
        {LABELS[value]}
      </span>
    )}
  </div>
);

export default StarRating;
