import axiosInstance from "../../../utils/axiosInstance";

// ─── Shared enums ────────────────────────────────────
export type LeadStatus = "NEW" | "IN_PROGRESS" | "CONVERTED" | "LOST";
export type LeadPriority = "HOT" | "WARM" | "COLD";

// ─── Create ──────────────────────────────────────────
export interface CreateLeadPayload {
  fullName: string;
  phone: string;
  email?: string;
  country: string;
  source: string;
  status: string;
  priority: string;
  assignmentType: "AUTO" | "MANUAL";
  counselorId?: string;
  ieltsScore?: number;
  followUpDate?: string;
  notes?: string[];
}

export interface CreateLeadResponse {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  country: string;
  source: string;
  status: string;
  priority: string;
  ieltsScore?: number;
  followUpDate?: string;
  createdAt: string;
}

export const createLead = async (
  payload: CreateLeadPayload,
): Promise<CreateLeadResponse> =>
  (await axiosInstance.post<CreateLeadResponse>("/leads", payload)).data;

// ─── Update (PATCH) ───────────────────────────────────

export interface UpdateLeadPayload {
  fullName?: string;
  phone?: string;
  email?: string;
  country?: string;
  source?: string;
  status?: LeadStatus;
  priority?: LeadPriority;
  counselorId?: string;
  ieltsScore?: number;
  followUpDate?: string;
  lostReason?: string;
  notes?: Array<{ id?: string; content: string }>;
}

export const updateLead = async (
  id: string,
  payload: UpdateLeadPayload,
): Promise<ApiLead> =>
  (await axiosInstance.patch<ApiLead>(`/leads/${id}`, payload)).data;

// ─── Get list ─────────────────────────────────────────
export interface GetLeadsParams {
  search?: string;
  source?: string;
  counselorId?: string;
  country?: string;
  priority?: string;
  status?: string;
  lostReason?: string;
  followUpFrom?: string;
  followUpTo?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface ApiNote {
  id: string;
  content: string;
  leadId: string;
  createdAt: string;
}

export interface ApiLead {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  country: string;
  source: string;
  status: LeadStatus;
  priority: LeadPriority;
  ieltsScore?: number;
  followUpDate?: string;
  lostReason?: string | null;
  counselorId?: string;
  counselor?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  notes?: ApiNote[];
  createdAt: string;
  updatedAt: string;
}

export const getLeads = async (params?: GetLeadsParams): Promise<ApiLead[]> =>
  (await axiosInstance.get<ApiLead[]>("/leads", { params })).data;

// ─── Get single lead ──────────────────────────────────
export const getLeadById = async (id: string): Promise<ApiLead> =>
  (await axiosInstance.get<ApiLead>(`/leads/${id}`)).data;

// ─── Activity ─────────────────────────────────────────
export interface ApiActivityUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ApiActivity {
  id: string;
  type: string;
  message: string;
  meta: Record<string, string> | null;
  leadId: string;
  userId: string;
  createdAt: string;
  user?: ApiActivityUser;
}

export const getLeadActivity = async (leadId: string): Promise<ApiActivity[]> =>
  (await axiosInstance.get<ApiActivity[]>(`/leads/${leadId}/activity`)).data;

// ─── Mark Lost ────────────────────────────────────────
export interface MarkLostPayload {
  lostReason: string;
  additionalNotes?: string;
}

export const markLeadAsLost = async (
  id: string,
  payload: MarkLostPayload,
): Promise<ApiLead> =>
  (await axiosInstance.post<ApiLead>(`/leads/${id}/mark-lost`, payload)).data;

// ─── Log Call ─────────────────────────────────────────
export type CallOutcomeApi =
  | "INTERESTED"
  | "NOT_INTERESTED"
  | "SCHEDULE_CALLBACK"
  | "NO_ANSWER"
  | "VOICEMAIL"
  | "CONVERTED";

export interface LogCallPayload {
  outcome: CallOutcomeApi;
  notes?: string;
  duration: number;
  rating?: number | null;
  followUpDate?: string | null;
}

export interface LogCallResponse {
  id: string;
  outcome: CallOutcomeApi;
  notes?: string;
  duration: number;
  rating?: number | null;
  followUpDate?: string | null;
  leadId: string;
  userId: string;
  createdAt: string;
}

export const logCall = async (
  leadId: string,
  payload: LogCallPayload,
): Promise<LogCallResponse> =>
  (await axiosInstance.post<LogCallResponse>(`/leads/${leadId}/call`, payload))
    .data;

// ─── Get Call Logs ────────────────────────────────────
export interface CallLogSummary {
  totalCalls: number;
  avgDurationSeconds: number;
  conversions: number;
  outcomeCounts: Partial<Record<CallOutcomeApi, number>>;
}

export interface ApiCallLog {
  id: string;
  type: string;
  message: string;
  meta: {
    notes?: string;
    rating?: number;
    outcome?: CallOutcomeApi;
    duration?: number;
    followUpDate?: string | null;
  } | null;
  leadId: string;
  userId: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string; role: string } | null;
}

export interface GetCallLogsResponse {
  summary: CallLogSummary;
  calls: ApiCallLog[];
}

export const getCallLogs = async (
  leadId: string,
): Promise<GetCallLogsResponse> =>
  (await axiosInstance.get<GetCallLogsResponse>(`/leads/${leadId}/call-logs`))
    .data;

// ─── Delete single lead ───────────────────────────────
export const deleteLead = async (id: string): Promise<{ message: string }> =>
  (await axiosInstance.delete<{ message: string }>(`/leads/${id}`)).data;

// ─── Bulk delete leads ────────────────────────────────
export const bulkDeleteLeads = async (
  ids: string[],
): Promise<{ message: string }> =>
  (
    await axiosInstance.post<{ message: string }>("/leads/bulk-delete", {
      ids,
    })
  ).data;
