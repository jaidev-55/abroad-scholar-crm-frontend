// ─── Enums ────────────────────────────────────────────────────

import type { ReactNode } from "react";

export type LostReason =
  | "FINANCIAL_ISSUE"
  | "DIRECT_ADMISSION"
  | "ANOTHER_CONSULTANCY"
  | "NOT_ELIGIBLE"
  | "NOT_RESPONDING"
  | "DEFERRED_INTAKE"
  | "CHANGED_COUNTRY"
  | "FAMILY_DECISION"
  | "VISA_REJECTION"
  | "NO_RESPONSE"
  | "NOT_INTERESTED"
  | "CHOSE_OTHER_CONSULTANT"
  | "DUPLICATE_LEAD"
  | "VISA_REJECTED"
  | "OTHER";

export type LeadPriority = "HOT" | "WARM" | "COLD";

export type ReactivationReason =
  | "NEW_INFORMATION"
  | "FINANCIAL_RESOLVED"
  | "RECONNECTED"
  | "ELIGIBILITY_CHANGED"
  | "CHANGED_MIND"
  | "OTHER";

export type PipelineStatus =
  | "COUNSELLING_COMPLETED"
  | "FOLLOW_UP"
  | "ACTIVE_PIPELINE"
  | "DOCS_PENDING"
  | "NO_RESPONSE_1ST_CALL";

export interface LostReasonOption {
  value: LostReason;
  label: string;
  icon: ReactNode;
}

export interface ReactivationReasonOption {
  value: ReactivationReason;
  label: string;
}

export interface StageOption {
  id: PipelineStatus;
  label: string;
  color: string;
  twBg: string;
  twText: string;
  twBorder: string;
}

export interface LostLeadsQuery {
  search?: string;
  lostReason?: LostReason;
  counselorId?: string;
  country?: string;
  priority?: LeadPriority;
  page?: number;
  limit?: number;
}

export interface LostLead {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  country?: string;
  priority: LeadPriority;
  lostReason?: LostReason;
  pipelineStatus?: PipelineStatus;
  followUpDate?: string;
  counselorId?: string;
  counselor?: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    callLogs: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LostLeadsResponse {
  data: LostLead[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface LostLeadsStatsResponse {
  totalLost: number;
  lostThisMonth: number;
  lostLastMonth: number;
  reactivated: number;
  recoveryRate: number;
  topLostReasons: {
    reason: LostReason;
    count: number;
  }[];
}

export interface ReactivateLeadPayload {
  reason: ReactivationReason;
  notes?: string;
}

export interface ReactivateLeadResponse {
  id: string;
  status: string;
  followUpDate: string;
}
