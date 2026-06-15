import React, { useState, useCallback } from "react";
import {
  Table,
  ConfigProvider,
  Upload,
  message,
  Progress,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { UploadFile, UploadProps } from "antd/es/upload";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import type { Dayjs } from "dayjs";
import {
  RiFolder3Line,
  RiFileTextLine,
  RiCheckboxCircleLine,
  RiUploadCloud2Line,
  RiTimeLine,
  RiErrorWarningLine,
  RiEyeLine,
  RiAlertLine,
  RiAddLine,
  RiCloseLine,
  RiDeleteBin6Line,
  RiDownloadLine,
  RiFilePdf2Line,
  RiFileImageLine,
  RiFileWord2Line,
  RiShieldCheckLine,
  RiCheckboxCircleFill,
} from "react-icons/ri";
import type {
  EnrollmentDocument,
  DocumentStatus,
  UpdateDocumentPayload,
} from "../Types";
import { updateDocument, deleteDocument } from "../api/ Enrolledapi";
import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";
import CustomDatePicker from "../../../components/common/CustomDatePicker";
import CustomTextarea from "../../../components/common/Customtextarea";
import axiosInstance from "../../../utils/axiosInstance";

const { Dragger } = Upload;

interface DocumentSectionProps {
  studentId: string;
  documents: EnrollmentDocument[];
  onRefresh: () => void;
}

interface UploadFormValues {
  docName: string;
  expiryDate: Dayjs | null;
  notes: string;
}

const STATUS_MAP: Record<
  DocumentStatus,
  { cls: string; label: string; icon: React.ReactNode }
> = {
  VERIFIED: {
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    label: "Verified",
    icon: <RiCheckboxCircleLine size={11} />,
  },
  PENDING: {
    cls: "bg-amber-50 text-amber-700 border-amber-200",
    label: "Pending",
    icon: <RiTimeLine size={11} />,
  },
  REJECTED: {
    cls: "bg-red-50 text-red-700 border-red-200",
    label: "Rejected",
    icon: <RiErrorWarningLine size={11} />,
  },
};

const fileIcon = (name: string) => {
  const ext = name?.split(".").pop()?.toLowerCase();
  if (ext === "pdf")
    return <RiFilePdf2Line size={14} className="text-red-500" />;
  if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext ?? ""))
    return <RiFileImageLine size={14} className="text-violet-500" />;
  if (["doc", "docx"].includes(ext ?? ""))
    return <RiFileWord2Line size={14} className="text-blue-600" />;
  return <RiFileTextLine size={14} className="text-blue-500" />;
};

const SuccessOverlay: React.FC<{ show: boolean; msg: string }> = ({
  show,
  msg,
}) => (
  <div
    className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white rounded-2xl"
    style={{
      opacity: show ? 1 : 0,
      pointerEvents: show ? "auto" : "none",
      transition: "opacity 0.3s ease",
    }}
  >
    <div
      className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4"
      style={{
        transform: show ? "scale(1)" : "scale(0.5)",
        transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      <RiCheckboxCircleFill size={32} className="text-emerald-500" />
    </div>
    <p className="text-[15px] font-bold text-slate-800 m-0">{msg}</p>
    <p className="text-[12px] text-slate-400 m-0 mt-1">
      Closing automatically…
    </p>
  </div>
);

// ─── Main Component ───────────────────────────────────────────

const DocumentSection: React.FC<DocumentSectionProps> = ({
  studentId,
  documents,
  onRefresh,
}) => {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeDoc, setActiveDoc] = useState<EnrollmentDocument | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UploadFormValues>({
    defaultValues: { docName: "", expiryDate: null, notes: "" },
  });

  // ── Stats ──────────────────────────────────────────────────
  const uploadedCount = documents.filter(
    (d) => d.status === "VERIFIED" || d.status === "PENDING",
  ).length;
  const pct =
    documents.length > 0
      ? Math.round((uploadedCount / documents.length) * 100)
      : 0;

  // ── Reset helpers ──────────────────────────────────────────
  const resetUpload = useCallback(() => {
    setFileList([]);
    setUploadSuccess(false);
    reset({ docName: "", expiryDate: null, notes: "" });
  }, [reset]);

  const openUpload = useCallback(
    (presetName?: string) => {
      resetUpload();
      if (presetName)
        reset({ docName: presetName, expiryDate: null, notes: "" });
      setUploadOpen(true);
    },
    [resetUpload, reset],
  );

  const { mutate: submitUpload, isPending: isUploading } = useMutation({
    mutationFn: async (data: UploadFormValues) => {
      const file = fileList[0];
      if (!file) throw new Error("No file selected");

      const formData = new FormData();
      formData.append("file", file as unknown as Blob);
      formData.append("name", data.docName);
      if (data.expiryDate) {
        formData.append("expiryDate", data.expiryDate.format("YYYY-MM-DD"));
      }
      if (data.notes) {
        formData.append("notes", data.notes);
      }

      const { data: result } = await axiosInstance.post(
        `/enrolled/${studentId}/documents`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return result;
    },
    onSuccess: () => {
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadOpen(false);
        resetUpload();
        onRefresh();
        message.success("Document uploaded");
      }, 1400);
    },
    onError: () => message.error("Failed to upload document"),
  });

  // ── Verify mutation ────────────────────────────────────────
  const { mutate: handleVerify } = useMutation({
    mutationFn: (doc: EnrollmentDocument) => {
      const payload: UpdateDocumentPayload = { status: "VERIFIED" };
      return updateDocument(studentId, doc.id, payload);
    },
    onSuccess: () => {
      message.success("Document verified");
      onRefresh();
      setViewOpen(false);
      setActiveDoc(null);
    },
    onError: () => message.error("Failed to verify document"),
  });

  // ── Delete mutation ────────────────────────────────────────
  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: (doc: EnrollmentDocument) => deleteDocument(studentId, doc.id),
    onSuccess: () => {
      message.success("Document deleted");
      onRefresh();
      setDeleteOpen(false);
      setViewOpen(false);
      setActiveDoc(null);
    },
    onError: () => message.error("Failed to delete document"),
  });

  const getFileUrl = (fileUrl: string) => {
    if (fileUrl.startsWith("http")) return fileUrl;
    const base = (
      axiosInstance.defaults.baseURL || "http://localhost:5000"
    ).replace(/\/api\/?$/, "");
    return `${base}${fileUrl}`;
  };

  // ── Dragger config ─────────────────────────────────────────
  const draggerProps: UploadProps = {
    name: "file",
    multiple: false,
    fileList,
    accept: ".pdf,.jpg,.jpeg,.png,.doc,.docx",
    maxCount: 1,
    beforeUpload: (file) => {
      if (file.size / 1024 / 1024 >= 10) {
        message.error("File must be under 10 MB");
        return Upload.LIST_IGNORE;
      }
      setFileList([file as unknown as UploadFile]);
      return false;
    },
    onRemove: () => setFileList([]),
    showUploadList: false,
  };

  // ── Table columns ──────────────────────────────────────────
  const columns: ColumnsType<EnrollmentDocument> = [
    {
      title: "Document",
      dataIndex: "name",
      key: "name",
      width: 220,
      render: (name: string) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            {fileIcon(name)}
          </div>
          <span className="text-[13px] font-semibold text-slate-800 truncate">
            {name}
          </span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (s: DocumentStatus) => {
        const c = STATUS_MAP[s] ?? STATUS_MAP.PENDING;
        return (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${c.cls}`}
          >
            {c.icon} {c.label}
          </span>
        );
      },
    },
    {
      title: "Uploaded",
      dataIndex: "uploadedAt",
      key: "uploadedAt",
      width: 130,
      render: (d: string) =>
        d ? (
          <span className="text-xs text-slate-500">
            {new Date(d).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        ),
    },
    {
      title: "Expiry",
      dataIndex: "expiryDate",
      key: "expiryDate",
      width: 130,
      render: (d?: string) => {
        if (!d) return <span className="text-xs text-slate-400">—</span>;
        const left = Math.ceil(
          (new Date(d).getTime() - Date.now()) / 86_400_000,
        );
        const gone = left < 0;
        const soon = left >= 0 && left < 180;
        return (
          <Tooltip
            title={gone ? "Expired" : soon ? `Expires in ${left} days` : ""}
          >
            <span
              className={`text-xs font-medium ${
                gone
                  ? "text-red-600"
                  : soon
                    ? "text-amber-600"
                    : "text-slate-500"
              }`}
            >
              {new Date(d).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
              {(gone || soon) && (
                <RiAlertLine size={11} className="inline ml-1" />
              )}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      render: (_: unknown, r: EnrollmentDocument) => (
        <div className="flex gap-1.5">
          <button
            onClick={() => {
              setActiveDoc(r);
              setViewOpen(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-50 text-slate-600 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <RiEyeLine size={12} /> View
          </button>
          <Tooltip title="Download">
            <a
              href={getFileUrl(r.fileUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-[26px] h-[26px] rounded-lg bg-slate-50 text-slate-500 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <RiDownloadLine size={12} />
            </a>
          </Tooltip>
        </div>
      ),
    },
  ];

  // ── Render ─────────────────────────────────────────────────
  return (
    <>
      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center gap-2 px-5 pt-5 pb-3">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
            <RiFolder3Line size={16} className="text-amber-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Documents</h3>
          <div className="flex items-center gap-2 ml-1">
            <span className="text-[11px] font-semibold text-slate-400">
              {uploadedCount}/{documents.length}
            </span>
            <div className="w-16">
              <Progress
                percent={pct}
                size="small"
                strokeColor={pct === 100 ? "#10b981" : "#3b82f6"}
                showInfo={false}
                style={{ marginBottom: 0 }}
              />
            </div>
          </div>
          <button
            onClick={() => openUpload()}
            className="ml-auto flex items-center gap-1.5 px-3.5 py-[7px] rounded-xl text-[12px] font-semibold bg-blue-600 text-white border-none cursor-pointer hover:bg-blue-700 transition-all shadow-sm"
          >
            <RiAddLine size={14} /> Add Document
          </button>
        </div>

        <ConfigProvider
          theme={{
            components: {
              Table: {
                headerBg: "#F8FAFC",
                headerColor: "#64748B",
                headerSplitColor: "transparent",
                borderColor: "#F1F5F9",
                cellPaddingBlock: 10,
                cellPaddingInline: 16,
                fontSize: 13,
                rowHoverBg: "#f8fafc",
              },
            },
          }}
        >
          <Table<EnrollmentDocument>
            dataSource={documents}
            columns={columns}
            rowKey="id"
            pagination={false}
            size="small"
            locale={{
              emptyText: (
                <div className="py-8 text-center text-slate-400 text-sm">
                  No documents uploaded yet
                </div>
              ),
            }}
          />
        </ConfigProvider>
      </div>

      {/* ── Upload Modal ── */}
      <CustomModal
        open={uploadOpen}
        onClose={() => {
          if (!isUploading) {
            setUploadOpen(false);
            resetUpload();
          }
        }}
      >
        <div className="relative">
          <SuccessOverlay show={uploadSuccess} msg="Document Uploaded!" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <RiAddLine size={18} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-slate-800 m-0">
                  Upload Document
                </h3>
                <p className="text-[12px] text-slate-400 m-0 mt-0.5">
                  Upload a document for this student
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                if (!isUploading) {
                  setUploadOpen(false);
                  resetUpload();
                }
              }}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center border-none cursor-pointer transition-colors"
            >
              <RiCloseLine size={18} className="text-slate-500" />
            </button>
          </div>

          {/* Body */}
          <div
            className="px-6 pt-4 pb-1 overflow-y-auto space-y-4"
            style={{ maxHeight: "calc(90vh - 200px)" }}
          >
            <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider m-0">
              Document Info
            </p>

            <CustomInput<UploadFormValues>
              name="docName"
              label="Document Name"
              placeholder="e.g. Passport, Offer Letter, SOP..."
              control={control}
              required
              rules={{ required: "Document name is required" }}
              icon={<RiFileTextLine size={14} className="text-slate-400" />}
            />

            {/* File dragger */}
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                Attach File <span className="text-red-500">*</span>
              </label>
              {fileList.length === 0 ? (
                <Dragger
                  {...draggerProps}
                  style={{
                    borderRadius: 14,
                    border: "2px dashed #cbd5e1",
                    background: "#f8fafc",
                  }}
                >
                  <div className="py-6">
                    <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-blue-50 flex items-center justify-center">
                      <RiUploadCloud2Line size={28} className="text-blue-500" />
                    </div>
                    <p className="text-[14px] font-semibold text-slate-700 m-0">
                      Drag &amp; drop your file here
                    </p>
                    <p className="text-[12px] text-slate-400 m-0 mt-1.5">
                      or{" "}
                      <span className="text-blue-600 font-semibold underline cursor-pointer">
                        browse from computer
                      </span>
                    </p>
                    <div className="flex items-center justify-center gap-1.5 mt-3">
                      {["PDF", "JPG", "PNG", "DOC"].map((ext) => (
                        <span
                          key={ext}
                          className="px-2 py-0.5 rounded-md bg-slate-200/60 text-[10px] font-semibold text-slate-500"
                        >
                          {ext}
                        </span>
                      ))}
                    </div>
                  </div>
                </Dragger>
              ) : (
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    {fileIcon(fileList[0].name ?? "")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-slate-800 m-0 truncate">
                      {fileList[0].name}
                    </p>
                    <p className="text-[11px] text-slate-400 m-0 mt-0.5">
                      {fileList[0].size
                        ? `${(fileList[0].size / 1024 / 1024).toFixed(2)} MB`
                        : "Ready to upload"}
                    </p>
                  </div>
                  <button
                    onClick={() => setFileList([])}
                    className="w-8 h-8 rounded-lg bg-white hover:bg-red-50 flex items-center justify-center border border-slate-200 cursor-pointer transition-colors group"
                  >
                    <RiCloseLine
                      size={14}
                      className="text-slate-400 group-hover:text-red-500"
                    />
                  </button>
                </div>
              )}
            </div>

            <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider m-0">
              Additional Info
            </p>

            <CustomDatePicker<UploadFormValues>
              name="expiryDate"
              label="Expiry Date (optional)"
              placeholder="Pick a date"
              control={control}
              errors={errors}
            />

            <CustomTextarea<UploadFormValues>
              name="notes"
              label="Notes"
              hint="(optional)"
              placeholder="Any notes about this document…"
              rows={2}
              control={control}
            />
          </div>

          {/* Footer */}
          <div className="px-6 py-4 flex gap-3 border-t border-slate-100">
            <button
              onClick={() => {
                setUploadOpen(false);
                resetUpload();
              }}
              disabled={isUploading}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-slate-600 bg-slate-100 border-none cursor-pointer hover:bg-slate-200 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit((d) => {
                if (!fileList.length) {
                  message.warning("Please attach a file");
                  return;
                }
                submitUpload(d);
              })}
              disabled={isUploading}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-blue-600 border-none cursor-pointer hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <RiUploadCloud2Line size={16} /> Upload Document
                </>
              )}
            </button>
          </div>
        </div>
      </CustomModal>

      {/* ── View Modal ── */}
      <CustomModal
        open={viewOpen}
        onClose={() => {
          setViewOpen(false);
          setActiveDoc(null);
        }}
      >
        {activeDoc && (
          <>
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <RiFileTextLine size={18} className="text-slate-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[15px] font-bold text-slate-800 m-0 truncate">
                    {activeDoc.name}
                  </h3>
                  <p className="text-[12px] text-slate-400 m-0 mt-0.5">
                    {activeDoc.fileType?.toUpperCase()} · Document details
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                    STATUS_MAP[activeDoc.status]?.cls
                  }`}
                >
                  {STATUS_MAP[activeDoc.status]?.icon}{" "}
                  {STATUS_MAP[activeDoc.status]?.label}
                </span>
                <button
                  onClick={() => {
                    setViewOpen(false);
                    setActiveDoc(null);
                  }}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center border-none cursor-pointer transition-colors"
                >
                  <RiCloseLine size={18} className="text-slate-500" />
                </button>
              </div>
            </div>

            <div className="px-6 py-5">
              {/* Preview placeholder */}
              <div className="w-full h-48 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex flex-col items-center justify-center mb-5">
                <RiFilePdf2Line size={36} className="text-slate-300 mb-2" />
                <span className="text-[13px] text-slate-400 font-semibold">
                  Document Preview
                </span>
                <a
                  href={getFileUrl(activeDoc.fileUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 px-3 py-1 rounded-lg text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  Open Full File
                </a>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Uploaded
                  </span>
                  <p className="text-[13px] font-semibold text-slate-700 m-0 mt-1">
                    {new Date(activeDoc.uploadedAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Expiry
                  </span>
                  <p className="text-[13px] font-semibold text-slate-700 m-0 mt-1">
                    {activeDoc.expiryDate
                      ? new Date(activeDoc.expiryDate).toLocaleDateString(
                          "en-US",
                          { month: "long", day: "numeric", year: "numeric" },
                        )
                      : "No expiry set"}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 pb-5 flex items-center gap-2">
              <a
                href={getFileUrl(activeDoc.fileUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 no-underline"
              >
                <RiDownloadLine size={15} /> Download
              </a>
              {activeDoc.status !== "VERIFIED" && (
                <button
                  onClick={() => handleVerify(activeDoc)}
                  className="py-2.5 px-4 rounded-xl text-[13px] font-semibold text-white border-none cursor-pointer transition-colors flex items-center gap-1.5"
                  style={{
                    background: "linear-gradient(135deg,#10b981,#059669)",
                  }}
                >
                  <RiShieldCheckLine size={15} /> Verify
                </button>
              )}
              <button
                onClick={() => setDeleteOpen(true)}
                className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 border-none cursor-pointer transition-colors flex items-center justify-center"
              >
                <RiDeleteBin6Line size={16} />
              </button>
            </div>
          </>
        )}
      </CustomModal>

      {/* ── Delete Confirm Modal ── */}
      <CustomModal open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <div className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <RiErrorWarningLine size={20} className="text-red-500" />
            </div>
            <div>
              <h4 className="text-[14px] font-bold text-slate-800 m-0">
                Delete Document
              </h4>
              <p className="text-[13px] text-slate-500 m-0 mt-1.5 leading-relaxed">
                Are you sure you want to delete "{activeDoc?.name}"? This action
                cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex gap-2.5 mt-5">
            <button
              onClick={() => setDeleteOpen(false)}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-slate-600 bg-slate-100 border-none cursor-pointer hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => activeDoc && handleDelete(activeDoc)}
              disabled={isDeleting}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-red-500 hover:bg-red-600 border-none cursor-pointer disabled:opacity-60 transition-colors"
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default DocumentSection;
