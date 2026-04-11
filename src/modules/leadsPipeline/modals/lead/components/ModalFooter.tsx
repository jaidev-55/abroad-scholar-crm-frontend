import React from "react";
import { Spin } from "antd";
import { RiArrowLeftLine, RiArrowRightLine, RiCheckLine } from "react-icons/ri";
import type { StepKey } from "../../../utils/lead/types";

interface Props {
  step: StepKey;
  isPending: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const ModalFooter: React.FC<Props> = ({
  step,
  isPending,
  onBack,
  onNext,
  onSubmit,
}) => (
  <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
    {/* Step dots */}
    <div className="flex items-center gap-1.5">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className="rounded-full transition-all duration-200"
          style={{
            width: step === s ? 20 : 6,
            height: 6,
            background:
              step === s ? "#2563eb" : step > s ? "#10B981" : "#e2e8f0",
          }}
        />
      ))}
    </div>

    <div className="flex items-center gap-2">
      {step > 1 && (
        <button
          type="button"
          onClick={onBack}
          disabled={isPending}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold border border-slate-200 bg-white text-slate-600 cursor-pointer outline-none hover:bg-slate-50 transition-all disabled:opacity-50"
        >
          <RiArrowLeftLine size={14} /> Back
        </button>
      )}

      {step < 3 ? (
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-bold border-none bg-blue-600 text-white cursor-pointer outline-none hover:bg-blue-700 transition-all"
        >
          Continue <RiArrowRightLine size={14} />
        </button>
      ) : (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isPending}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-bold border-none bg-emerald-600 text-white cursor-pointer outline-none hover:bg-emerald-700 transition-all disabled:opacity-75"
        >
          {isPending ? (
            <>
              <Spin size="small" /> Saving…
            </>
          ) : (
            <>
              <RiCheckLine size={14} /> Save Lead
            </>
          )}
        </button>
      )}
    </div>
  </div>
);

export default ModalFooter;
