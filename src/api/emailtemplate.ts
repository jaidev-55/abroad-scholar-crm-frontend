import axiosInstance from "../utils/axiosInstance";

// ─── Types ───────────────────────────────────────────
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  attachment?: string;
  createdAt: string;
}

// ─── Get all templates ───────────────────────────────
export const getEmailTemplates = async (): Promise<EmailTemplate[]> =>
  (await axiosInstance.get<EmailTemplate[]>("/email-templates")).data;

// ─── Get single template ─────────────────────────────
export const getEmailTemplate = async (id: string): Promise<EmailTemplate> =>
  (await axiosInstance.get<EmailTemplate>(`/email-templates/${id}`)).data;

// ─── Create template (multipart/form-data) ───────────
export interface CreateEmailTemplatePayload {
  name: string;
  subject: string;
  content: string;
  attachment?: File;
}

export const createEmailTemplate = async (
  payload: CreateEmailTemplatePayload,
): Promise<EmailTemplate> => {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("subject", payload.subject);
  formData.append("content", payload.content);
  if (payload.attachment) {
    formData.append("attachment", payload.attachment);
  }
  return (
    await axiosInstance.post<EmailTemplate>("/email-templates", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  ).data;
};

// ─── Delete template ─────────────────────────────────
export const deleteEmailTemplate = async (id: string): Promise<EmailTemplate> =>
  (await axiosInstance.delete<EmailTemplate>(`/email-templates/${id}`)).data;

// ─── Send email to lead ──────────────────────────────
export interface SendEmailPayload {
  subject: string;
  message: string;
  templateId?: string;
  attachment?: File;
}

export interface SendEmailResponse {
  success: boolean;
  message: string;
}

export const sendEmailToLead = async (
  leadId: string,
  payload: SendEmailPayload,
): Promise<SendEmailResponse> => {
  const formData = new FormData();
  formData.append("subject", payload.subject);
  formData.append("message", payload.message);
  if (payload.templateId) formData.append("templateId", payload.templateId);
  if (payload.attachment) formData.append("attachment", payload.attachment);
  return (
    await axiosInstance.post<SendEmailResponse>(
      `/leads/${leadId}/send-email`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    )
  ).data;
};
