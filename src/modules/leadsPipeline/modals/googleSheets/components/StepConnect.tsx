import React from "react";
import { useFormContext } from "react-hook-form";
import {
  RiCheckboxCircleLine,
  RiInformationLine,
  RiShieldCheckLine,
  RiExternalLinkLine,
  RiLink,
} from "react-icons/ri";
import { SiGooglesheets } from "react-icons/si";
import type { SheetUrlForm } from "../../../utils/types";
import { extractGid, extractSheetId } from "../../../utils/sheetUtils";
import CustomInput from "../../../../../components/common/CustomInput";

interface Props {
  onFetch: (data: SheetUrlForm) => void;
}

const StepConnect: React.FC<Props> = ({ onFetch }) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useFormContext<SheetUrlForm>();
  const watchedUrl = watch("sheetUrl") ?? "";
  const urlGid = watchedUrl ? extractGid(watchedUrl) : null;

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 to-emerald-500 p-5">
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute bottom-0 left-16 w-16 h-16 rounded-full bg-white/5" />
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <SiGooglesheets size={24} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">
              Import from Google Sheets
            </p>
            <p className="text-white/70 text-xs mt-0.5">
              Click the tab you want → copy the URL → paste below
            </p>
          </div>
        </div>
      </div>

      {/* URL input */}
      <form id="sheet-url-form" onSubmit={handleSubmit(onFetch)}>
        <CustomInput
          name="sheetUrl"
          control={control}
          label="Google Sheet URL"
          placeholder="https://docs.google.com/spreadsheets/d/..."
          type="text"
          size="large"
          icon={<RiLink size={14} className="text-slate-400" />}
          rules={{
            required: "Sheet URL is required",
            validate: (val) =>
              !!extractSheetId(val) ||
              "Invalid URL — paste the full Google Sheets link.",
          }}
        />
      </form>

      {/* Live tab detection */}
      {watchedUrl.trim() && !errors.sheetUrl && (
        <div
          className={`flex items-start gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium ${
            urlGid
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-amber-50 border-amber-200 text-amber-700"
          }`}
        >
          {urlGid ? (
            <>
              <RiCheckboxCircleLine size={13} className="shrink-0 mt-0.5" />
              <span>
                Tab detected:{" "}
                <span className="font-bold bg-green-100 px-1.5 py-0.5 rounded">
                  gid={urlGid}
                </span>
                <span className="ml-1.5 text-green-600">
                  — only this tab will be imported ✓
                </span>
              </span>
            </>
          ) : (
            <>
              <RiInformationLine size={13} className="shrink-0 mt-0.5" />
              <span>
                No tab ID in URL — the <strong>first sheet</strong> will be
                imported.
              </span>
            </>
          )}
        </div>
      )}

      {/* Step guide */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
        <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <RiInformationLine size={13} className="text-blue-500" />
          How to import a specific tab
        </p>
        <ol className="space-y-1.5 pl-1">
          {[
            "Open your Google Sheet in the browser",
            'Click the tab you want (e.g. "NEW Leads")',
            "Copy the full URL from the browser address bar",
            "Paste above — the tab ID (gid) is auto-detected",
          ].map((s, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-[11px] text-slate-600"
            >
              <span className="w-4 h-4 rounded-full bg-green-100 text-green-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>
      </div>

      {/* Public access reminder */}
      <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
        <RiShieldCheckLine
          size={16}
          className="text-amber-600 mt-0.5 shrink-0"
        />
        <div>
          <p className="text-xs font-bold text-amber-800">
            Sheet must be publicly accessible
          </p>
          <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
            In Google Sheets:{" "}
            <span className="font-semibold">
              Share → Change → Anyone with the link → Viewer
            </span>
          </p>
          <a
            href="https://support.google.com/docs/answer/9331169"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-amber-700 underline mt-1"
          >
            <RiExternalLinkLine size={11} /> Learn how to share
          </a>
        </div>
      </div>
    </div>
  );
};

export default StepConnect;
