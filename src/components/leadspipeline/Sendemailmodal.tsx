import React, { useState, useRef, useEffect } from "react";
import { message, Spin } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  RiMailLine,
  RiCloseLine,
  RiSendPlaneLine,
  RiAttachmentLine,
  RiDeleteBinLine,
  RiFileTextLine,
  RiCalendarLine,
  RiBookOpenLine,
  RiAwardLine,
  RiMailCheckLine,
  RiAddLine,
  RiErrorWarningLine,
  RiSettings3Line,
} from "react-icons/ri";

import CustomModal from "../common/CustomModal";
import {
  getEmailTemplates,
  sendEmailToLead,
  sendCustomEmail,
  type EmailTemplate,
} from "../../api/emailtemplate";
import type { Lead } from "../../types/lead";
import EmailTemplateManager from "./EmailTemplateManager";

interface Props {
  lead: Lead | null;
  onClose: () => void;
}

const TEMPLATE_ICONS: Record<string, React.ReactNode> = {
  "Follow-up": <RiCalendarLine size={14} />,
  "Document Check": <RiFileTextLine size={14} />,
  "Interview Prep": <RiBookOpenLine size={14} />,
  "Offer Letter": <RiAwardLine size={14} />,
};

const UserAvatar: React.FC<{ name: string; size?: number }> = ({
  name,
  size = 36,
}) => {
  const safe = name || "?";
  const initials = safe
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const hue = safe.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
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

const SendEmailModal: React.FC<Props> = ({ lead, onClose }) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [showTemplateManager, setShowTemplateManager] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  );

  // Fetch templates
  const { data: templates = [], isLoading: templatesLoading } = useQuery({
    queryKey: ["email-templates"],
    queryFn: getEmailTemplates,
    enabled: !!lead,
  });

  // Send via template
  const { mutate: sendTemplateEmail, isPending: sendingTemplate } = useMutation(
    {
      mutationFn: () =>
        sendEmailToLead(lead!.id, { templateId: selectedTemplateId! }),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["lead-activity", lead?.id],
        });
        message.success("Email sent successfully!");
        onClose();
      },
      onError: (error: unknown) => {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        message.error(
          axiosError?.response?.data?.message || "Failed to send email.",
        );
      },
    },
  );

  // Send custom email
  const { mutate: sendCustom, isPending: sendingCustom } = useMutation({
    mutationFn: () =>
      sendCustomEmail(lead!.id, {
        subject,
        message: body,
        attachment: attachment || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lead-activity", lead?.id],
      });
      message.success("Email sent successfully!");
      onClose();
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      message.error(
        axiosError?.response?.data?.message || "Failed to send email.",
      );
    },
  });

  const sending = sendingTemplate || sendingCustom;

  // Reset form when lead changes
  useEffect(() => {
    if (!lead) return;
    queueMicrotask(() => {
      setSubject("");
      setBody("");
      setAttachment(null);
      setSelectedTemplateId(null);
    });
  }, [lead?.id]);

  if (!lead) return null;

  const isTemplateMode = !!selectedTemplateId;

  const applyTemplate = (template: EmailTemplate) => {
    if (selectedTemplateId === template.id) {
      // Deselect — switch to custom mode
      setSelectedTemplateId(null);
      setSubject("");
      setBody("");
      return;
    }
    setSelectedTemplateId(template.id);
    setSubject(template.subject);
    setBody(template.content.replace(/\{\{name\}\}/g, lead.name));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      message.error("Only PDF files are allowed");
      e.target.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      message.error("File size must be under 10MB");
      e.target.value = "";
      return;
    }
    setAttachment(file);
    e.target.value = "";
  };

  const handleSend = () => {
    if (!lead.email) {
      message.warning("This lead has no email address. Please add one first.");
      return;
    }

    if (isTemplateMode) {
      sendTemplateEmail();
    } else {
      if (!subject.trim()) {
        message.warning("Please enter a subject");
        return;
      }
      if (!body.trim()) {
        message.warning("Please enter a message");
        return;
      }
      sendCustom();
    }
  };

  const canSend =
    !sending &&
    !!lead.email &&
    (isTemplateMode ? true : !!(subject.trim() && body.trim()));

  return (
    <CustomModal open={!!lead} onClose={sending ? undefined : onClose}>
      {showTemplateManager ? (
        <EmailTemplateManager onBack={() => setShowTemplateManager(false)} />
      ) : (
        <div className="flex flex-col max-h-[85vh]">
          {/* ── HEADER ── */}
          <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-start justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                <RiMailLine size={20} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-slate-900">
                  Compose Email
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">to {lead.name}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={sending}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 border-none bg-transparent cursor-pointer outline-none transition-colors disabled:opacity-30"
            >
              <RiCloseLine size={17} />
            </button>
          </div>

          {/* ── BODY ── */}
          <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto flex-1">
            {/* Lead info */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <UserAvatar name={lead.name} size={36} />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-slate-800 truncate">
                  {lead.name}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {lead.email || "No email provided"}
                </p>
              </div>
              {lead.counselor && (
                <span className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0">
                  <RiMailCheckLine size={11} /> {lead.counselor}
                </span>
              )}
            </div>

            {/* No email warning */}
            {!lead.email && (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 rounded-xl border border-red-100">
                <RiErrorWarningLine
                  size={14}
                  className="text-red-500 shrink-0"
                />
                <span className="text-xs text-red-600 font-medium">
                  This lead has no email address. Please add one before sending.
                </span>
              </div>
            )}

            {/* Templates */}
            {!templatesLoading && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Use Template{" "}
                    <span className="text-slate-300 normal-case font-normal">
                      (or write custom below)
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowTemplateManager(true)}
                    className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-blue-500 border-none bg-transparent cursor-pointer outline-none transition-colors"
                  >
                    <RiSettings3Line size={11} /> Manage
                  </button>
                </div>
                {templates.length > 0 ? (
                  <div className="flex gap-2 flex-wrap">
                    {templates.map((t) => {
                      const isActive = selectedTemplateId === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => applyTemplate(t)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer outline-none transition-all ${
                            isActive
                              ? "bg-blue-50 text-blue-600 border-blue-200"
                              : "bg-white text-slate-500 border-slate-200 hover:border-blue-200 hover:text-blue-500"
                          }`}
                        >
                          {TEMPLATE_ICONS[t.name] || (
                            <RiFileTextLine size={14} />
                          )}{" "}
                          {t.name}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-300">
                    No templates yet — click Manage to create one
                  </p>
                )}
              </div>
            )}

            {/* Template mode indicator */}
            {isTemplateMode && (
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-xl border border-blue-100">
                <RiMailCheckLine size={13} className="text-blue-500" />
                <span className="text-xs text-blue-600 font-medium">
                  Sending with template — click template again to switch to
                  custom
                </span>
              </div>
            )}

            {/* Subject */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">
                Subject{" "}
                {!isTemplateMode && <span className="text-rose-400">*</span>}
                {isTemplateMode && (
                  <span className="text-slate-300 font-normal ml-1">
                    (from template)
                  </span>
                )}
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => !isTemplateMode && setSubject(e.target.value)}
                readOnly={isTemplateMode}
                placeholder={
                  isTemplateMode ? "From template" : "Email subject line"
                }
                className={`w-full px-3 py-2.5 rounded-xl border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-300 outline-none transition-colors ${
                  isTemplateMode
                    ? "bg-slate-50 cursor-default"
                    : "bg-white focus:border-blue-400"
                }`}
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">
                Message{" "}
                {!isTemplateMode && <span className="text-rose-400">*</span>}
                {isTemplateMode && (
                  <span className="text-slate-300 font-normal ml-1">
                    (from template)
                  </span>
                )}
              </label>
              <textarea
                value={body}
                onChange={(e) => !isTemplateMode && setBody(e.target.value)}
                readOnly={isTemplateMode}
                placeholder={
                  isTemplateMode ? "From template" : `Hi ${lead.name},\n\n`
                }
                rows={6}
                className={`w-full px-3 py-2.5 rounded-xl border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-300 outline-none resize-none leading-relaxed ${
                  isTemplateMode
                    ? "bg-slate-50 cursor-default"
                    : "bg-white focus:border-blue-400"
                }`}
                style={{ fontFamily: "inherit" }}
              />
            </div>

            {/* Attachments — only for custom mode */}
            {!isTemplateMode && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                  <RiAttachmentLine size={12} className="text-slate-400" />
                  Attachment
                  <span className="text-slate-300 font-normal">(PDF only)</span>
                </label>

                {attachment && (
                  <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <RiFileTextLine
                      size={16}
                      className="text-red-500 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 truncate">
                        {attachment.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {(attachment.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachment(null)}
                      className="p-1 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 border-none bg-transparent cursor-pointer outline-none transition-colors"
                    >
                      <RiDeleteBinLine size={13} />
                    </button>
                  </div>
                )}

                {!attachment && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 cursor-pointer hover:text-blue-500 hover:border-blue-300 hover:bg-blue-50/50 transition-all bg-transparent text-xs font-medium"
                  >
                    <RiAddLine size={14} /> Add PDF Attachment
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p className="text-[10px] text-slate-300">
                  <span className="text-red-400">PDF only</span> — Max 10MB
                </p>
              </div>
            )}
          </div>

          {/* ── FOOTER ── */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={() => {
                setSubject("");
                setBody("");
                setAttachment(null);
                setSelectedTemplateId(null);
              }}
              disabled={sending}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-semibold cursor-pointer hover:bg-slate-100 outline-none transition-colors disabled:opacity-50"
            >
              Discard
            </button>

            <button
              type="button"
              onClick={handleSend}
              disabled={!canSend}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-white text-xs font-bold border-none outline-none transition-all duration-150 ${
                canSend
                  ? "bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-md shadow-blue-600/20"
                  : "bg-slate-400 cursor-not-allowed"
              }`}
            >
              {sending ? (
                <>
                  <Spin size="small" /> Sending…
                </>
              ) : (
                <>
                  <RiSendPlaneLine size={13} /> Send Email
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </CustomModal>
  );
};

export default SendEmailModal;
