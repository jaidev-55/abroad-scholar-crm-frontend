import axiosInstance from "../utils/axiosInstance";

// ─── Types ───────────────────────────────────────────
export interface WebhookConfig {
  id: string;
  platform: string;
  formId: string;
  formName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWebhookConfigPayload {
  platform: string;
  formId: string;
  formName: string;
}

export interface SyncResult {
  synced: number;
  skipped: number;
  total: number;
}

// ─── API Calls ───────────────────────────────────────
export const fetchConfigs = async (): Promise<WebhookConfig[]> =>
  (await axiosInstance.get<WebhookConfig[]>("/webhooks/config")).data;

export const addConfig = async (
  data: CreateWebhookConfigPayload,
): Promise<WebhookConfig> =>
  (await axiosInstance.post<WebhookConfig>("/webhooks/config", data)).data;

export const toggleConfig = async (id: string): Promise<WebhookConfig> =>
  (await axiosInstance.patch<WebhookConfig>(`/webhooks/config/${id}/toggle`))
    .data;

export const deleteConfig = async (id: string): Promise<WebhookConfig> =>
  (await axiosInstance.delete<WebhookConfig>(`/webhooks/config/${id}`)).data;

export const syncFormLeads = async (id: string): Promise<SyncResult> =>
  (await axiosInstance.post<SyncResult>(`/webhooks/config/${id}/sync`)).data;
