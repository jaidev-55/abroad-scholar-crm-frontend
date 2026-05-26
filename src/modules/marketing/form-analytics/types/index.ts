import type { Dayjs } from "dayjs";

/* ── Enums / Literals ─────────────────────────────── */

export type Platform = "meta" | "google";
export type FormStatus = "active" | "paused" | "archived";
export type TimeGranularity = "daily" | "weekly" | "monthly";

/* ── Core entities ────────────────────────────────── */

export interface AdForm {
  id: string;
  name: string;
  platform: Platform;
  formId: string;
  campaignName: string;
  status: FormStatus;
  createdAt: string;
  lastSyncAt: string;
}

export interface FormSubmission {
  id: string;
  formId: string;
  formName: string;
  platform: Platform;
  submittedAt: string;
  leadName: string;
  leadEmail: string;
  leadPhone?: string;
  syncedToCrm: boolean;
  assignedCounselor?: string;
  convertedToLead: boolean;
}

/* ── Metrics ──────────────────────────────────────── */

export interface FormMetrics {
  totalSubmissions: number;
  uniqueLeads: number;
  syncRate: number; // 0–100
  conversionRate: number; // 0–100
  avgResponseTime: number; // minutes
  activeForms: number;
}

export interface FormPerformanceRow {
  formId: string;
  formName: string;
  platform: Platform;
  campaignName: string;
  submissions: number;
  uniqueLeads: number;
  syncRate: number;
  conversionRate: number;
  avgResponseTime: number;
  cost: number;
  costPerLead: number;
  status: FormStatus;
}

/* ── Chart data shapes ────────────────────────────── */

export interface SubmissionTrendPoint {
  date: string;
  submissions: number;
  synced: number;
  converted: number;
}

export interface PlatformSplit {
  platform: Platform;
  submissions: number;
  percentage: number;
}

export interface FieldDropoff {
  fieldName: string;
  started: number;
  completed: number;
  dropoffRate: number;
}

export interface HourlyHeatmapCell {
  day: number; // 0=Sun … 6=Sat
  hour: number; // 0–23
  value: number;
}

export interface TopCampaign {
  campaignName: string;
  platform: Platform;
  submissions: number;
  conversionRate: number;
}

/* ── Filter state ─────────────────────────────────── */

export interface FormAnalyticsFilters {
  dateRange: [Dayjs, Dayjs] | null;
  platform: Platform | "all";
  formId: string | "all";
  granularity: TimeGranularity;
}
