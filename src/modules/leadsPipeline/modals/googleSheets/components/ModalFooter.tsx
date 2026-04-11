import React from "react";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiLoaderLine,
  RiAddCircleLine,
} from "react-icons/ri";
import { SiGooglesheets } from "react-icons/si";

interface Props {
  step: number;
  loading: boolean;
  importing: boolean;
  validCount: number;
  requiredMapped: boolean;
  onBack: () => void;
  onClose: () => void;
}

const ModalFooter: React.FC<Props> = ({
  step,
  loading,
  importing,
  validCount,
  requiredMapped,
  onBack,
  onClose,
}) => {
  if (step === 3) return null;

  return (
    <div className="flex items-center justify-between pt-2">
      {step > 0 ? (
        <button
          onClick={onBack}
          disabled={loading || importing}
          className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer font-medium disabled:opacity-50"
        >
          <RiArrowLeftSLine size={16} /> Back
        </button>
      ) : (
        <div />
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={onClose}
          disabled={loading || importing}
          className="px-4 py-2.5 text-sm text-slate-500 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
        >
          Cancel
        </button>

        {step === 0 && (
          <button
            type="submit"
            form="sheet-url-form"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
          >
            {loading ? (
              <>
                <RiLoaderLine size={15} className="animate-spin" /> Fetching…
              </>
            ) : (
              <>
                <SiGooglesheets size={14} /> Fetch Sheet{" "}
                <RiArrowRightSLine size={15} />
              </>
            )}
          </button>
        )}

        {step === 1 && (
          <button
            onClick={() => {
              /* handled by parent via onNext */
            }}
            disabled={!requiredMapped}
            form="step1-form"
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
          >
            Preview Data <RiArrowRightSLine size={15} />
          </button>
        )}

        {step === 2 && (
          <button
            onClick={() => {
              /* handled by parent via onImport */
            }}
            form="step2-form"
            type="submit"
            disabled={validCount === 0 || importing}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
          >
            {importing ? (
              <>
                <RiLoaderLine size={15} className="animate-spin" /> Importing{" "}
                {validCount}…
              </>
            ) : (
              <>
                <RiAddCircleLine size={15} /> Import {validCount} Lead
                {validCount !== 1 ? "s" : ""}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ModalFooter;
