import React, { useRef, useState } from "react";
import { message, Spin } from "antd";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  RiAddLine,
  RiArrowLeftLine,
  RiAttachmentLine,
  RiCheckLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiFileTextLine,
  RiMailLine,
} from "react-icons/ri";

import {
  createEmailTemplate,
  deleteEmailTemplate,
  getEmailTemplates,
} from "../api/emailtemplate";
import CustomInput from "../../../components/common/CustomInput";
import CustomTextarea from "../../../components/common/Customtextarea";

interface TemplateForm {
  name: string;
  subject: string;
  content: string;
}

interface Props {
  onBack: () => void;
}

const EmailTemplateManager: React.FC<Props> = ({ onBack }) => {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [showForm, setShowForm] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<TemplateForm>({
    mode: "onChange",
    defaultValues: { name: "", subject: "", content: "" },
  });

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["email-templates"],
    queryFn: getEmailTemplates,
  });

  const { mutate: create, isPending: creating } = useMutation({
    mutationFn: (data: TemplateForm) =>
      createEmailTemplate({
        name: data.name,
        subject: data.subject,
        content: data.content,
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

  // ── Helpers ───────────────────────────────────────────────────────────────
  const resetForm = () => {
    setShowForm(false);
    setAttachment(null);
    reset();
  };

  const onSubmit = (data: TemplateForm) => create(data);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      message.error("Only PDF files allowed");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      message.error("Max file size is 10 MB");
      return;
    }
    setAttachment(file);
    e.target.value = "";
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col max-h-[95vh]">
      {/* ── Header ── */}
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

      {/* ── Body ── */}
      <div className="px-6 py-5 flex flex-col gap-3 overflow-y-auto flex-1">
        {/* ── Create form ── */}
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
            <div className="p-4 flex flex-col gap-4 bg-white">
              <CustomInput
                name="name"
                label="Template Name"
                placeholder="e.g. Follow-up, Welcome, Document Request"
                control={control}
                rules={{ required: "Template name is required" }}
              />

              <CustomInput
                name="subject"
                label="Subject Line"
                placeholder="Email subject your leads will see"
                control={control}
                rules={{ required: "Subject is required" }}
              />

              <CustomTextarea
                name="content"
                label="Content"
                hint={`— use {{name}} for lead name`}
                placeholder={"Dear {{name}},\n\nThank you for your interest..."}
                rows={4}
                control={control}
                rules={{ required: "Content is required" }}
              />

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

              {/* Hidden file input */}
              <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Form footer */}
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
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
                onClick={handleSubmit(onSubmit)}
                disabled={!isValid || creating}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold border-none outline-none transition-all ${
                  isValid && !creating
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
