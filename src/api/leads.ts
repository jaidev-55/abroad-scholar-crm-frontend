import axiosInstance from "../utils/axiosInstance";

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
// All fields are optional — send only what changed
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
