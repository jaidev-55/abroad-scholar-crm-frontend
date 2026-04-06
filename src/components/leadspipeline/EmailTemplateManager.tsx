import React, { useState, useRef } from "react";
import { message, Spin } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  RiAddLine,
  RiDeleteBinLine,
  RiFileTextLine,
  RiCloseLine,
  RiCheckLine,
  RiAttachmentLine,
  RiArrowLeftLine,
  RiMailLine,
} from "react-icons/ri";
import {
  getEmailTemplates,
  createEmailTemplate,
  deleteEmailTemplate,
} from "../../api/emailtemplate";

interface Props {
  onBack: () => void;
}

const EmailTemplateManager: React.FC<Props> = ({ onBack }) => {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["email-templates"],
    queryFn: getEmailTemplates,
  });

  const { mutate: create, isPending: creating } = useMutation({
    mutationFn: () =>
      createEmailTemplate({
        name,
        subject,
        content,
        attachment: attachment || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-templates"] });
      message.success("Template created!");
      resetForm();
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      message.error(
        axiosError?.response?.data?.message || "Failed to create template.",
      );
    },
  });

  const { mutate: remove } = useMutation({
    mutationFn: (id: string) => deleteEmailTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-templates"] });
      message.success("Template deleted.");
      setDeletingId(null);
    },
    onError: () => {
      message.error("Failed to delete template.");
      setDeletingId(null);
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setName("");
    setSubject("");
    setContent("");
    setAttachment(null);
  };

  const handleCreate = () => {
    if (!name.trim()) return message.warning("Template name is required");
    if (!subject.trim()) return message.warning("Subject is required");
    if (!content.trim()) return message.warning("Content is required");
    create();
  };

  const canCreate =
    name.trim() && subject.trim() && content.trim() && !creating;

  return (
    <div className="flex flex-col max-h-[95vh]">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 border-none bg-transparent cursor-pointer outline-none transition-colors"
        >
          <RiArrowLeftLine size={17} />
        </button>
        <div className="flex items-center gap-2.5 flex-1">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <RiMailLine size={16} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-slate-900">
              Email Templates
            </h2>
            <p className="text-[11px] text-slate-400">
              {templates.length} template{templates.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white border-none cursor-pointer outline-none hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
          >
            <RiAddLine size={13} /> New Template
          </button>
        )}
      </div>

      <div className="px-6 py-5 flex flex-col gap-3 overflow-y-auto flex-1">
        {/* Create form */}
        {showForm && (
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            {/* Form header */}
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <p className="text-xs font-bold text-slate-600">
                Create New Template
              </p>
              <button
                type="button"
                onClick={resetForm}
                disabled={creating}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 border-none bg-transparent cursor-pointer outline-none transition-colors disabled:opacity-50"
              >
                <RiCloseLine size={14} />
              </button>
            </div>

            {/* Form body */}
            <div className="p-4 flex flex-col gap-3 bg-white">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-500">
                  Template Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Follow-up, Welcome, Document Request"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-300 outline-none bg-white focus:border-blue-400 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-500">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject your leads will see"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-300 outline-none bg-white focus:border-blue-400 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-500">
                  Content{" "}
                  <span className="text-slate-300 font-normal">
                    — use {"{{name}}"} for lead name
                  </span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    "Dear {{name}},\n\nThank you for your interest..."
                  }
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-[13px] text-slate-700 placeholder:text-slate-300 outline-none resize-none bg-white focus:border-blue-400 leading-relaxed transition-colors"
                  style={{ fontFamily: "inherit" }}
                />
              </div>

              {/* Attachment */}
              {attachment ? (
                <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <RiFileTextLine size={14} className="text-red-500 shrink-0" />
                  <span className="text-xs text-slate-600 truncate flex-1">
                    {attachment.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {(attachment.size / 1024).toFixed(0)} KB
                  </span>
                  <button
                    type="button"
                    onClick={() => setAttachment(null)}
                    className="p-1 text-slate-300 hover:text-red-400 border-none bg-transparent cursor-pointer outline-none transition-colors"
                  >
                    <RiCloseLine size={13} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-2.5 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400 bg-transparent cursor-pointer hover:border-blue-300 hover:text-blue-500 transition-colors outline-none"
                >
                  <RiAttachmentLine size={12} /> Attach PDF brochure (optional)
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.type !== "application/pdf") {
                      message.error("Only PDF files allowed");
                      return;
                    }
                    if (file.size > 10 * 1024 * 1024) {
                      message.error("Max 10MB");
                      return;
                    }
                    setAttachment(file);
                  }
                  e.target.value = "";
                }}
                className="hidden"
              />
            </div>

            {/* Form footer */}
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 rounded-b-2xl">
              <button
                type="button"
                onClick={resetForm}
                disabled={creating}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-500 text-xs font-semibold cursor-pointer outline-none hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={!canCreate}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold border-none outline-none transition-all ${
                  canCreate
                    ? "bg-blue-600 text-white cursor-pointer hover:bg-blue-700 shadow-sm shadow-blue-600/20"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                {creating ? (
                  <>
                    <Spin size="small" /> Creating…
                  </>
                ) : (
                  <>
                    <RiCheckLine size={13} /> Create Template
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Template list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spin size="large" />
          </div>
        ) : templates.length === 0 && !showForm ? (
          <div className="flex flex-col items-center justify-center py-16 select-none">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-3">
              <RiMailLine size={24} className="text-blue-300" />
            </div>
            <p className="text-sm font-semibold text-slate-500">
              No templates yet
            </p>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Create reusable email templates for your leads
            </p>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white border-none cursor-pointer outline-none hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
            >
              <RiAddLine size={13} /> Create First Template
            </button>
          </div>
        ) : (
          templates.map((t) => (
            <div
              key={t.id}
              className="rounded-xl border border-slate-100 p-4 hover:border-blue-200 hover:shadow-sm transition-all bg-white group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                    <RiFileTextLine size={14} className="text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-slate-800">
                      {t.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">
                      {t.subject}
                    </p>
                    <p className="text-[11px] text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                      {t.content}
                    </p>
                    {t.attachment && (
                      <div className="flex items-center gap-1 mt-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-red-50 text-red-400 border border-red-100">
                          <RiAttachmentLine size={9} /> PDF
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDeletingId(t.id);
                    remove(t.id);
                  }}
                  disabled={deletingId === t.id}
                  className="p-2 rounded-xl text-slate-300 hover:text-red-400 hover:bg-red-50 border-none bg-transparent cursor-pointer outline-none transition-all shrink-0 disabled:opacity-50 opacity-0 group-hover:opacity-100"
                >
                  {deletingId === t.id ? (
                    <Spin size="small" />
                  ) : (
                    <RiDeleteBinLine size={14} />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmailTemplateManager;
