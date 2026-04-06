import React, { useState, useRef, useCallback } from "react";
import { Input, message } from "antd";
import { useForm } from "react-hook-form";
import {
  RiMailLine,
  RiCloseLine,
  RiSendPlaneLine,
  RiAttachment2,
  RiUserLine,
  RiCalendarLine,
  RiCheckLine,
  RiDeleteBinLine,
  RiFilePdf2Line,
  RiImageLine,
  RiFileTextLine,
  RiInformationLine,
  RiAddLine,
  RiDragDropLine,
  RiEyeLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
} from "react-icons/ri";
import type { Dayjs } from "dayjs";
import CustomModal from "../common/CustomModal";
import CustomDatePicker from "../common/CustomDatePicker";

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  counselor: string;
}

interface Props {
  lead: Lead | null;
  onClose: () => void;
  onEmailSent?: (data: EmailPayload) => void;
}

interface EmailFormValues {
  followUpDate: Dayjs | null;
}

interface EmailPayload {
  to: string;
  subject: string;
  body: string;
  attachments: AttachedFile[];
  followUpDate: string | null;
}

interface AttachedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview: string | null;
}

interface QuickTemplate {
  label: string;
  emoji: string;
  subject: string;
  body: string;
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
];

const QUICK_TEMPLATES: QuickTemplate[] = [
  {
    label: "Follow-up",
    emoji: "📋",
    subject: "Following up on your application",
    body: "Hi {name},\n\nI wanted to follow up regarding your study abroad application. Please let me know if you have any questions or need assistance with the next steps.\n\nBest regards,\n{counselor}",
  },
  {
    label: "Document Check",
    emoji: "📄",
    subject: "Documents required for your application",
    body: "Hi {name},\n\nWe need the following documents to proceed with your application:\n\n1. Academic transcripts\n2. IELTS/TOEFL score report\n3. Statement of Purpose\n4. Passport copy\n\nPlease send these at your earliest convenience.\n\nBest regards,\n{counselor}",
  },
  {
    label: "Interview Prep",
    emoji: "🎯",
    subject: "Interview preparation tips for {country}",
    body: "Hi {name},\n\nCongratulations on your progress! Here are some tips to prepare for your upcoming visa interview:\n\n• Be clear about your study plans\n• Know your course details\n• Prepare financial documents\n\nFeel free to reach out for a mock interview.\n\nBest regards,\n{counselor}",
  },
  {
    label: "Offer Letter",
    emoji: "🎉",
    subject: "Great news — Offer letter received!",
    body: "Hi {name},\n\nWe're delighted to inform you that your offer letter has been received! Please find the details attached.\n\nNext steps:\n1. Review the offer carefully\n2. Confirm your acceptance\n3. Begin visa documentation\n\nLet's schedule a call to discuss further.\n\nBest regards,\n{counselor}",
  },
];

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (type: string): React.ReactNode => {
  if (type === "application/pdf")
    return <RiFilePdf2Line size={18} className="text-red-500" />;
  if (type.startsWith("image/"))
    return <RiImageLine size={18} className="text-blue-500" />;
  return <RiFileTextLine size={18} className="text-slate-400" />;
};

const getFileAccentColor = (type: string): string => {
  if (type === "application/pdf") return "border-red-200 bg-red-50";
  if (type.startsWith("image/")) return "border-blue-200 bg-blue-50";
  return "border-slate-200 bg-slate-50";
};

const UserAvatar: React.FC<{ name: string; size?: number }> = ({
  name,
  size = 32,
}) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");
  const hue = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  return (
    <div
      className="flex items-center justify-center font-bold shrink-0 select-none"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.35,
        background: `hsl(${hue},60%,92%)`,
        color: `hsl(${hue},50%,35%)`,
        fontSize: size * 0.35,
      }}
    >
      {initials}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// FILE ATTACHMENT CARD
// ═══════════════════════════════════════════════════════════════

interface FileCardProps {
  file: AttachedFile;
  onRemove: (id: string) => void;
}

const FileCard: React.FC<FileCardProps> = ({ file, onRemove }) => {
  const [showPreview, setShowPreview] = useState(false);
  const isImage = file.type.startsWith("image/");

  return (
    <>
      <div
        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all duration-150 group ${getFileAccentColor(file.type)}`}
      >
        {/* Thumbnail / Icon */}
        {isImage && file.preview ? (
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-slate-200 cursor-pointer bg-transparent p-0 outline-none hover:ring-2 hover:ring-blue-300 transition-all"
          >
            <img
              src={file.preview}
              alt={file.name}
              className="w-full h-full object-cover"
            />
          </button>
        ) : (
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-white border border-slate-200">
            {getFileIcon(file.type)}
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-700 truncate leading-tight">
            {file.name}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {formatFileSize(file.size)}
            {file.type === "application/pdf" && " · PDF"}
            {isImage && " · Image"}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          {isImage && file.preview && (
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 border-none bg-transparent cursor-pointer outline-none transition-colors"
            >
              <RiEyeLine size={13} />
            </button>
          )}
          <button
            type="button"
            onClick={() => onRemove(file.id)}
            className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 border-none bg-transparent cursor-pointer outline-none transition-colors"
          >
            <RiDeleteBinLine size={13} />
          </button>
        </div>
      </div>

      {/* Image Preview Overlay */}
      {showPreview && isImage && file.preview && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="relative max-w-lg max-h-[80vh] rounded-2xl overflow-hidden bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={file.preview}
              alt={file.name}
              className="max-w-full max-h-[70vh] object-contain"
            />
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-100">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-700 truncate">
                  {file.name}
                </p>
                <p className="text-[10px] text-slate-400">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 outline-none transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

const SendEmailModal: React.FC<Props> = ({ lead, onClose, onEmailSent }) => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // react-hook-form for CustomDatePicker
  const {
    control,
    formState: { errors },
    watch,
    reset: resetForm,
  } = useForm<EmailFormValues>({
    defaultValues: {
      followUpDate: null,
    },
  });

  const followUpDate = watch("followUpDate");

  // ── File handling ──

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);

      for (const file of fileArray) {
        // Validate type
        if (!ALLOWED_TYPES.includes(file.type)) {
          message.error(
            `"${file.name}" is not supported. Only PDF and image files are allowed.`,
          );
          continue;
        }

        // Validate size
        if (file.size > MAX_FILE_SIZE) {
          message.error(`"${file.name}" exceeds 10MB limit.`);
          continue;
        }

        // Check duplicates
        if (
          attachments.some((a) => a.name === file.name && a.size === file.size)
        ) {
          message.warning(`"${file.name}" is already attached.`);
          continue;
        }

        // Create preview for images
        const isImage = file.type.startsWith("image/");
        const newFile: AttachedFile = {
          id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          preview: null,
        };

        if (isImage) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setAttachments((prev) =>
              prev.map((a) =>
                a.id === newFile.id
                  ? { ...a, preview: e.target?.result as string }
                  : a,
              ),
            );
          };
          reader.readAsDataURL(file);
        }

        setAttachments((prev) => [...prev, newFile]);
      }
    },
    [attachments],
  );

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleRemoveFile = (id: string) => {
    setAttachments((prev) => {
      const file = prev.find((a) => a.id === id);
      if (file?.preview) URL.revokeObjectURL(file.preview);
      return prev.filter((a) => a.id !== id);
    });
  };

  // ── Drag & Drop ──

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // ── Templates ──

  const applyTemplate = (tpl: QuickTemplate) => {
    if (!lead) return;
    setSubject(
      tpl.subject
        .replace("{name}", lead.name)
        .replace("{country}", lead.country),
    );
    setBody(
      tpl.body
        .replace(/{name}/g, lead.name)
        .replace(/{counselor}/g, lead.counselor)
        .replace(/{country}/g, lead.country),
    );
    setActiveTemplate(tpl.label);
  };

  // ── Send ──

  const handleSend = () => {
    if (!lead) return;
    if (!subject.trim() || !body.trim()) {
      message.warning("Please fill in subject and message.");
      return;
    }

    setSending(true);
    setTimeout(() => {
      const payload: EmailPayload = {
        to:
          lead.email ||
          `${lead.name.toLowerCase().replace(" ", ".")}@email.com`,
        subject,
        body,
        attachments,
        followUpDate: followUpDate
          ? (followUpDate as Dayjs).format("YYYY-MM-DD")
          : null,
      };
      onEmailSent?.(payload);

      setSending(false);
      setSent(true);
      setTimeout(() => {
        setSent(false);
        onClose();
        setSubject("");
        setBody("");
        setAttachments([]);
        setShowFollowUp(false);
        setActiveTemplate(null);
        resetForm();
      }, 1500);
    }, 1200);
  };

  if (!lead) return null;

  const totalAttachmentSize = attachments.reduce((s, a) => s + a.size, 0);

  return (
    <CustomModal open={!!lead} onClose={onClose}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.png,.jpg,.jpeg,.webp,.gif"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <RiMailLine size={17} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-[14px] font-bold text-slate-800">
              Compose Email
            </h2>
            <p className="text-xs text-slate-400">to {lead.name}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 border-none bg-transparent cursor-pointer outline-none transition-colors"
        >
          <RiCloseLine size={17} />
        </button>
      </div>

      {/* ── Recipient ── */}
      <div className="px-5 py-3 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
        <UserAvatar name={lead.name} size={32} />
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-700">{lead.name}</p>
          <p className="text-xs text-slate-400 truncate">
            {lead.email ||
              `${lead.name.toLowerCase().replace(" ", ".")}@email.com`}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1 text-xs text-slate-400 shrink-0">
          <RiUserLine size={11} /> {lead.counselor}
        </div>
      </div>

      {/* ── Quick Templates ── */}
      <div className="px-5 py-3 border-b border-slate-50">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          Quick Templates
        </p>
        <div className="flex gap-2 flex-wrap">
          {QUICK_TEMPLATES.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => applyTemplate(t)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-all outline-none ${
                activeTemplate === t.label
                  ? "bg-blue-50 text-blue-600 border-blue-200 shadow-sm shadow-blue-100"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
              }`}
            >
              <span className="text-sm">{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Form (scrollable area) ── */}
      <div
        className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4"
        style={{
          maxHeight: "45vh",
          scrollbarWidth: "thin",
          scrollbarColor: "#e2e8f0 transparent",
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drag overlay */}
        {isDragging && (
          <div className="absolute inset-0 z-10 bg-blue-50/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-blue-300 pointer-events-none">
            <RiDragDropLine size={36} className="text-blue-400 mb-2" />
            <p className="text-sm font-bold text-blue-600">Drop files here</p>
            <p className="text-xs text-blue-400 mt-0.5">
              PDF and images accepted
            </p>
          </div>
        )}

        {/* Subject */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600">
            Subject <span className="text-rose-400">*</span>
          </label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject"
            size="middle"
            className="!rounded-xl"
          />
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600">
            Message <span className="text-rose-400">*</span>
          </label>
          <Input.TextArea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Type your message here…"
            rows={6}
            className="!rounded-xl !resize-none"
            style={{ fontSize: 13 }}
          />
        </div>

        {/* ── Attachments ── */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <RiAttachment2 size={12} /> Attachments
              {attachments.length > 0 && (
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">
                  {attachments.length}
                </span>
              )}
            </label>
            {attachments.length > 0 && (
              <span className="text-[10px] text-slate-400">
                {formatFileSize(totalAttachmentSize)} total
              </span>
            )}
          </div>

          {/* File list */}
          {attachments.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {attachments.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  onRemove={handleRemoveFile}
                />
              ))}
            </div>
          )}

          {/* Upload area */}
          <button
            type="button"
            onClick={handleFileSelect}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 bg-slate-50/50 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/50 cursor-pointer transition-all outline-none group"
          >
            <RiAddLine
              size={14}
              className="group-hover:text-blue-500 transition-colors"
            />
            <span className="text-xs font-semibold">Add PDF or Image</span>
          </button>

          {/* File type hints */}
          <div className="flex items-center gap-3 px-1">
            <span className="flex items-center gap-1 text-[10px] text-slate-400">
              <RiFilePdf2Line size={10} className="text-red-400" />
              PDF
            </span>
            <span className="flex items-center gap-1 text-[10px] text-slate-400">
              <RiImageLine size={10} className="text-blue-400" />
              PNG, JPG, WebP
            </span>
            <span className="text-[10px] text-slate-300 ml-auto">
              Max 10MB per file
            </span>
          </div>
        </div>

        {/* ── Follow-up Date (collapsible) ── */}
        <div className="rounded-xl border border-slate-100 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowFollowUp(!showFollowUp)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border-none cursor-pointer transition-colors outline-none"
          >
            <span className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <RiCalendarLine size={13} className="text-amber-500" />
              Schedule Follow-up
              {followUpDate && (
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                  {(followUpDate as Dayjs).format("MMM D")}
                </span>
              )}
            </span>
            {showFollowUp ? (
              <RiArrowUpSLine size={15} className="text-slate-400" />
            ) : (
              <RiArrowDownSLine size={15} className="text-slate-400" />
            )}
          </button>

          {showFollowUp && (
            <div className="px-3.5 py-3 border-t border-slate-100 bg-white space-y-2.5">
              <CustomDatePicker
                name="followUpDate"
                label="Follow-up Date & Time"
                placeholder="When to follow up after sending?"
                control={control}
                errors={errors}
              />
              <div className="flex items-start gap-1.5 text-[10px] text-slate-400 leading-relaxed">
                <RiInformationLine
                  size={12}
                  className="text-slate-300 shrink-0 mt-0.5"
                />
                <span>
                  A follow-up reminder will be auto-created for{" "}
                  <strong className="text-slate-500">{lead.counselor}</strong>{" "}
                  on the selected date.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/80">
        <button
          type="button"
          onClick={handleFileSelect}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-600 border-none bg-transparent cursor-pointer outline-none transition-colors"
        >
          <RiAttachment2 size={14} />
          Attach file
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              setSubject("");
              setBody("");
              setAttachments([]);
              setShowFollowUp(false);
              setActiveTemplate(null);
              resetForm();
            }}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-semibold cursor-pointer hover:bg-slate-50 outline-none transition-colors"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={sending || sent}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-white text-xs font-bold border-none outline-none transition-all duration-150"
            style={{
              background: sent ? "#059669" : sending ? "#94a3b8" : "#2563eb",
              cursor: sending || sent ? "not-allowed" : "pointer",
              boxShadow:
                !sending && !sent ? "0 2px 8px rgba(37,99,235,0.2)" : "none",
            }}
          >
            {sent ? (
              <>
                <RiCheckLine size={13} /> Sent!
              </>
            ) : sending ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full inline-block border-2 border-white/30 border-t-white animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <RiSendPlaneLine size={13} /> Send Email
                {attachments.length > 0 && (
                  <span className="text-[10px] opacity-70 ml-0.5">
                    ({attachments.length} file
                    {attachments.length > 1 ? "s" : ""})
                  </span>
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default SendEmailModal;
