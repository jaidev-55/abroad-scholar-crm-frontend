import React from "react";
import { RiFileTextLine, RiPaletteLine, RiLayoutLine } from "react-icons/ri";

interface PdfPreviewCardProps {
  recordCount: number;
  fieldCount: number;
}

const PdfPreviewCard: React.FC<PdfPreviewCardProps> = ({
  recordCount,
  fieldCount,
}) => {
  return (
    <div className="mt-2 px-3.5 py-3 bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-200 rounded-xl">
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
          <RiFileTextLine size={14} className="text-rose-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-800 mb-0.5">
            Branded PDF Report
          </p>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            A polished, print-ready report with header, footer, and
            zebra-striped table.
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-rose-200 text-[10px] font-semibold text-rose-700">
              <RiLayoutLine size={10} /> Landscape A4
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-rose-200 text-[10px] font-semibold text-rose-700">
              <RiPaletteLine size={10} /> Branded
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white border border-rose-200 text-[10px] font-semibold text-rose-700">
              {recordCount} rows · {fieldCount} cols
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfPreviewCard;
