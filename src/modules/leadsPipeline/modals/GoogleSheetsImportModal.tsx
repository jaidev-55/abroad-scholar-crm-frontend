import React, { useState } from "react";
import { message, Modal } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import { RiCloseLine } from "react-icons/ri";
import { SiGooglesheets } from "react-icons/si";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ImportedRow, ImportResult, SheetUrlForm } from "../utils/types";
import {
  extractGid,
  extractSheetId,
  fetchGoogleSheetCSV,
} from "../utils/sheetUtils";
import { autoMapColumn, EXPECTED_COLUMNS, parseCSV } from "../utils/csvParser";
import { validateRow } from "../utils/rowValidator";
import { createLead, type CreateLeadPayload } from "../api/leads";
import StepperHeader from "./googleSheets/components/StepperHeader";
import StepConnect from "./googleSheets/components/StepConnect";
import StepMapColumns from "./googleSheets/components/StepMapColumns";
import StepSuccess from "./googleSheets/components/StepSuccess";
import StepPreview from "./googleSheets/components/StepPreview";

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
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // ── Step 0: fetch sheet ──────────────────────────────────────────────────
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

  // ── Step 1 → 2: build preview ────────────────────────────────────────────
  const buildPreview = () => {
    const rows = csvRows.map((row, i) => {
      const raw: Record<string, string> = {};
      csvHeaders.forEach((h, idx) => {
        raw[h] = row[idx] ?? "";
      });
      return validateRow(raw, colMap, i + 2);
    });
    setPreviewRows(rows);
    setApiErrors([]);
    setStep(2);
  };

  // ── Step 2: import leads (sequential to catch first error) ─────────────
  const { mutate: importLeads, isPending: importing } = useMutation({
    mutationFn: async (rows: ImportedRow[]) => {
      const validRows = rows.filter((r) => r.valid);
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
            assignmentType: "AUTO",
            country: "",
          };

          const country = r.mapped.country?.trim();
          if (country && country.length >= 2 && !/^\d+$/.test(country))
            payload.country = country;
          if (r.mapped.email?.trim()) payload.email = r.mapped.email.trim();
          if (r.mapped.followUpDate?.trim())
            payload.followUpDate = r.mapped.followUpDate.trim();
          if (r.mapped.notes?.trim()) payload.notes = [r.mapped.notes.trim()];
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
          // Extract meaningful error message
          const err = result.reason;
          const errMsg =
            err?.response?.data?.message ||
            err?.message ||
            `Row ${validRows[i]?.rowIndex ?? i + 2}: Unknown error`;
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

      // Always move to step 3 to show the result
      setStep(3);

      // Show a toast with the first error if all failed
      if (result.success === 0 && result.errors.length > 0) {
        message.error(`Import failed: ${result.errors[0]}`, 6);
      } else if (result.failed > 0) {
        message.warning(`${result.failed} rows failed to import`);
      }
    },
    onError: (err: Error) => {
      // Mutation-level error (network, auth, etc.)
      message.error(`Import error: ${err.message}`, 6);
    },
  });

  const validCount = previewRows.filter((r) => r.valid).length;
  const requiredMapped = EXPECTED_COLUMNS.filter((c) => c.required).every((c) =>
    Object.values(colMap).includes(c.key),
  );

  // ── Footer ────────────────────────────────────────────────────────────────
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
    >
      {step < 3 && <StepperHeader step={step} />}

      <FormProvider {...methods}>
        {step === 0 && <StepConnect onFetch={onFetchSheet} />}
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
        <StepPreview
          previewRows={previewRows}
          showSkipped={showSkipped}
          onToggleSkipped={setShowSkipped}
        />
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
