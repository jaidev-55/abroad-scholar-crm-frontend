import React, { useState } from "react";
import { message, Modal, Select } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import {
  RiCloseLine,
  RiCheckboxCircleLine,
  RiSkipForwardLine,
  RiUserSmileLine,
} from "react-icons/ri";
import { SiGooglesheets } from "react-icons/si";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import type { ImportedRow, ImportResult, SheetUrlForm } from "../utils/types";
import {
  extractGid,
  extractSheetId,
  fetchGoogleSheetCSV,
} from "../utils/sheetUtils";
import { autoMapColumn, EXPECTED_COLUMNS, parseCSV } from "../utils/csvParser";
import { validateRow, LEAD_CATEGORIES } from "../utils/rowValidator";
import { createLead, type CreateLeadPayload } from "../api/leads";
import StepperHeader from "./googleSheets/components/StepperHeader";
import StepConnect from "./googleSheets/components/StepConnect";
import StepMapColumns from "./googleSheets/components/StepMapColumns";
import StepSuccess from "./googleSheets/components/StepSuccess";
import StepPreview from "./googleSheets/components/StepPreview";
import { getUsers } from "../../../api/auth";

interface Props {
  open: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
}

const GoogleSheetsImportModal: React.FC<Props> = ({
  open,
  onClose,
  onImportSuccess,
}) => {
  const queryClient = useQueryClient();

  // Fetch counselors for assignment
  const { data: counselors = [] } = useQuery({
    queryKey: ["counselors"],
    queryFn: () => getUsers("COUNSELOR"),
    staleTime: 5 * 60 * 1000,
  });
  const methods = useForm<SheetUrlForm>({ defaultValues: { sheetUrl: "" } });

  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [loading, setLoading] = useState(false);
  const [detectedGid, setDetectedGid] = useState<string | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [colMap, setColMap] = useState<Record<string, string>>({});
  const [previewRows, setPreviewRows] = useState<ImportedRow[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showSkipped, setShowSkipped] = useState(false);
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<import("../api/leads").LeadCategory>("ACADEMIC");
  const [selectedCounselorId, setSelectedCounselorId] = useState<string | null>(
    null,
  );

  const reset = () => {
    setStep(0);
    methods.reset();
    setLoading(false);
    setDetectedGid(null);
    setCsvHeaders([]);
    setCsvRows([]);
    setColMap({});
    setPreviewRows([]);
    setImportResult(null);
    setShowSkipped(false);
    setApiErrors([]);
    setSelectedCategory("ACADEMIC");
    setSelectedCounselorId(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const onFetchSheet = async (data: SheetUrlForm) => {
    const id = extractSheetId(data.sheetUrl);
    if (!id) {
      methods.setError("sheetUrl", { message: "Invalid URL." });
      return;
    }
    const gid = extractGid(data.sheetUrl);
    setDetectedGid(gid);
    setLoading(true);
    try {
      const csv = await fetchGoogleSheetCSV(id, gid);
      const { headers, rows } = parseCSV(csv);
      setCsvHeaders(headers);
      setCsvRows(rows);
      const auto: Record<string, string> = {};
      headers.forEach((h) => {
        const m = autoMapColumn(h);
        if (m) auto[h] = m;
      });
      setColMap(auto);
      setStep(1);
    } catch (err) {
      methods.setError("sheetUrl", {
        message: err instanceof Error ? err.message : "Failed to fetch sheet",
      });
    } finally {
      setLoading(false);
    }
  };

  const buildPreview = () => {
    const rows = csvRows.map((row, i) => {
      const raw: Record<string, string> = {};
      csvHeaders.forEach((h, idx) => {
        raw[h] = row[idx] ?? "";
      });
      return validateRow(raw, colMap, i + 2, selectedCategory);
    });
    setPreviewRows(rows);
    setApiErrors([]);
    setStep(2);
  };

  const { mutate: importLeads, isPending: importing } = useMutation({
    mutationFn: async (rows: ImportedRow[]) => {
      const validRows = rows.filter((r) => r.valid && !r.skipReason);
      let successCount = 0;
      const failedErrors: string[] = [];

      const results = await Promise.allSettled(
        validRows.map(async (r) => {
          const payload: CreateLeadPayload = {
            fullName: r.mapped.fullName!,
            phone: r.mapped.phone!,
            status: "NEW",
            source: r.mapped.source ?? "REFERRAL",
            priority: r.mapped.priority ?? "COLD",
            assignmentType: selectedCounselorId ? "MANUAL" : "AUTO",
            ...(selectedCounselorId
              ? { counselorId: selectedCounselorId }
              : {}),
            // category: LeadCategory — selectedCategory is now typed correctly
            category: r.mapped.leadCategory ?? selectedCategory,
          };
          const country = r.mapped.country?.trim();
          if (country && country.length >= 2 && !/^\d+$/.test(country))
            payload.country = country;
          if (r.mapped.email?.trim()) payload.email = r.mapped.email.trim();
          if (r.mapped.followUpDate?.trim())
            payload.followUpDate = r.mapped.followUpDate.trim();
          const ieltsRaw = r.mapped.ieltsScore?.trim();
          if (ieltsRaw && !isNaN(Number(ieltsRaw)))
            payload.ieltsScore = Number(ieltsRaw);
          return createLead(payload);
        }),
      );

      results.forEach((result, i) => {
        if (result.status === "fulfilled") {
          successCount++;
        } else {
          const err = result.reason;
          const errMsg =
            err?.response?.data?.message || err?.message || "Unknown error";
          failedErrors.push(
            `Row ${validRows[i]?.rowIndex ?? i + 2}: ${errMsg}`,
          );
        }
      });

      return {
        success: successCount,
        failed: results.length - successCount,
        errors: failedErrors,
      };
    },
    onSuccess: (result) => {
      setImportResult({ success: result.success, failed: result.failed });
      setApiErrors(result.errors);
      if (result.success > 0) {
        queryClient.invalidateQueries({ queryKey: ["leads"] });
        onImportSuccess();
      }
      setStep(3);
      if (result.success === 0 && result.errors.length > 0)
        message.error(`Import failed: ${result.errors[0]}`, 6);
      else if (result.failed > 0)
        message.warning(`${result.failed} rows failed to import`);
    },
    onError: (err: Error) => {
      message.error(`Import error: ${err.message}`, 6);
    },
  });

  const skippedRows = previewRows.filter((r) => !!r.skipReason);
  const validCount = previewRows.filter((r) => r.valid && !r.skipReason).length;
  const invalidCount = previewRows.filter(
    (r) => !r.valid && !r.skipReason,
  ).length;
  const requiredMapped = EXPECTED_COLUMNS.filter((c) => c.required).every((c) =>
    Object.values(colMap).includes(c.key),
  );

  const renderFooter = () => {
    if (step === 3) return null;
    return (
      <div className="flex items-center justify-between pt-2">
        {step > 0 ? (
          <button
            onClick={() => {
              setStep((s) => (s - 1) as 0 | 1 | 2 | 3);
              setShowSkipped(false);
            }}
            disabled={loading || importing}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer font-medium disabled:opacity-50"
          >
            ← Back
          </button>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={handleClose}
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
              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl disabled:opacity-40 transition-all cursor-pointer shadow-sm"
            >
              {loading ? (
                "Fetching…"
              ) : (
                <>
                  <SiGooglesheets size={14} /> Fetch Sheet →
                </>
              )}
            </button>
          )}
          {step === 1 && (
            <button
              onClick={buildPreview}
              disabled={!requiredMapped}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl disabled:opacity-40 transition-all cursor-pointer shadow-sm"
            >
              Preview Data →
            </button>
          )}
          {step === 2 && (
            <button
              onClick={() => importLeads(previewRows)}
              disabled={validCount === 0 || importing}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl disabled:opacity-40 transition-all cursor-pointer shadow-sm"
            >
              {importing
                ? `Importing ${validCount}…`
                : `Import ${validCount} Lead${validCount !== 1 ? "s" : ""}`}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={renderFooter()}
      closable={!loading && !importing}
      maskClosable={!loading && !importing}
      closeIcon={<RiCloseLine size={18} className="text-slate-500" />}
      title={
        <div className="flex items-center gap-3 pr-8">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <SiGooglesheets size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-[15px] font-black text-slate-800 leading-tight">
              Import Leads
            </p>
            <p className="text-[11px] text-slate-500 font-normal">
              From Google Sheets
            </p>
          </div>
        </div>
      }
      width={560}
      styles={{
        body: {
          maxHeight: "60vh",
          overflowY: "auto",
          overflowX: "hidden",
          paddingRight: "4px",
        },
      }}
    >
      {step < 3 && <StepperHeader step={step} />}

      <FormProvider {...methods}>
        {step === 0 && (
          <div className="space-y-4">
            {/* ── Lead Category selector ─────────────────────────────── */}
            <div>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                Lead Category <span className="text-red-500">*</span>
              </p>
              <p className="text-[11px] text-slate-400 mb-2.5">
                All imported leads will be tagged with this category
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {LEAD_CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() =>
                      setSelectedCategory(
                        cat.value as import("../api/leads").LeadCategory,
                      )
                    }
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all text-left ${
                      selectedCategory === cat.value
                        ? "border-green-500 bg-green-50"
                        : "border-slate-200 hover:border-green-300 hover:bg-green-50/40"
                    }`}
                  >
                    <span className="text-lg">
                      {cat.value === "ACADEMIC" ? "🎓" : "🏫"}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">
                        {cat.value === "ACADEMIC" ? "Academic" : "Admission"}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {cat.value === "ACADEMIC"
                          ? "IELTS / PTE Coaching"
                          : "University Application"}
                      </p>
                    </div>
                    {selectedCategory === cat.value && (
                      <RiCheckboxCircleLine
                        size={16}
                        className="text-green-500 ml-auto shrink-0"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Counselor selector ────────────────────────────── */}
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1 flex items-center gap-1">
                <RiUserSmileLine size={12} />
                Assign Counselor
              </p>
              <p className="text-[11px] text-slate-400 mb-2.5">
                Leave empty to auto-assign via round-robin
              </p>
              <Select
                allowClear
                showSearch
                placeholder={
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <RiUserSmileLine size={13} /> Auto (round-robin)
                  </span>
                }
                value={selectedCounselorId ?? undefined}
                onChange={(val) => setSelectedCounselorId(val ?? null)}
                filterOption={(input, option) =>
                  (option?.label as string)
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
                }
                className="w-full"
                size="middle"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                options={counselors.map((c: any) => ({
                  value: c.id,
                  label: c.name,
                  email: c.email,
                }))}
                optionRender={(option) => (
                  <div className="flex items-center gap-2.5 py-0.5">
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-[11px] font-bold text-blue-600 shrink-0">
                      {(option.data.label as string)?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 leading-tight">
                        {option.data.label as string}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {option.data.email}
                      </p>
                    </div>
                  </div>
                )}
              />
            </div>

            <div className="border-t border-slate-100 pt-4">
              <StepConnect onFetch={onFetchSheet} />
            </div>
          </div>
        )}
      </FormProvider>

      {step === 1 && (
        <StepMapColumns
          csvHeaders={csvHeaders}
          csvRows={csvRows}
          colMap={colMap}
          detectedGid={detectedGid}
          onColMapChange={setColMap}
        />
      )}

      {step === 2 && (
        <div className="space-y-3">
          {/* Summary badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs font-bold bg-green-50 border border-green-200 text-green-700 px-2.5 py-1.5 rounded-lg">
              <RiCheckboxCircleLine size={13} /> {validCount} to import
            </span>
            {skippedRows.length > 0 && (
              <span className="flex items-center gap-1.5 text-xs font-bold bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1.5 rounded-lg">
                <RiSkipForwardLine size={13} /> {skippedRows.length} skipped
              </span>
            )}
            {invalidCount > 0 && (
              <span className="flex items-center gap-1.5 text-xs font-bold bg-red-50 border border-red-200 text-red-700 px-2.5 py-1.5 rounded-lg">
                {invalidCount} errors
              </span>
            )}
            <span className="flex items-center gap-1 text-xs bg-blue-50 border border-blue-200 text-blue-700 px-2.5 py-1.5 rounded-lg ml-auto">
              {selectedCategory === "ACADEMIC" ? "🎓 Academic" : "🏫 Admission"}
            </span>
          </div>

          {/* Skipped rows expandable */}
          {skippedRows.length > 0 && (
            <div className="px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl">
              <button
                onClick={() => setShowSkipped((v) => !v)}
                className="flex items-center justify-between w-full text-xs font-semibold text-amber-700 cursor-pointer"
              >
                <span>
                  ⚠️ {skippedRows.length} rows auto-skipped (spam / empty name /
                  lost)
                </span>
                <span className="text-amber-500">
                  {showSkipped ? "Hide ▲" : "Show ▼"}
                </span>
              </button>
              {showSkipped && (
                <ul className="mt-2 space-y-1 max-h-36 overflow-y-auto">
                  {skippedRows.map((r) => (
                    <li
                      key={r.rowIndex}
                      className="text-[11px] text-amber-700 flex gap-2 items-start"
                    >
                      <span className="font-mono text-amber-400 shrink-0">
                        Row {r.rowIndex}
                      </span>
                      <span className="truncate">
                        {Object.values(r.raw)
                          .filter(Boolean)[0]
                          ?.slice(0, 35) ?? "—"}
                      </span>
                      <span className="text-amber-500 ml-auto shrink-0 italic">
                        {r.skipReason}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Valid rows preview (skipped rows excluded) */}
          <StepPreview
            previewRows={previewRows.filter((r) => !r.skipReason)}
            showSkipped={false}
            onToggleSkipped={() => {}}
          />
        </div>
      )}

      {step === 3 && importResult && (
        <StepSuccess
          result={importResult}
          apiErrors={apiErrors}
          onClose={handleClose}
        />
      )}
    </Modal>
  );
};

export default GoogleSheetsImportModal;
