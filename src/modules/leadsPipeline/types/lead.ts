import type { Dayjs } from "dayjs";

// ─── API raw shapes ───────────────────────────────────────────────────────────
export type LeadStatus = "NEW" | "IN_PROGRESS" | "CONVERTED" | "LOST";
export type LeadPriorityRaw =
  | "HIGH"
  | "MEDIUM"
  | "LOW"
  | "HOT"
  | "WARM"
  | "COLD";
export type LeadStage = "new" | "progress" | "applied" | "converted" | "lost";
export type LeadCategory = "ACADEMIC" | "ADMISSION"; // ← new

// Single consistent priority type — transformLead always produces Hot/Warm/Cold
export type LeadPriority = "Hot" | "Warm" | "Cold";

export interface ApiNote {
  id: string;
  content: string;
  createdAt: string;
}

export interface ApiCounselor {
  id: string;
  name: string;
}

export interface ApiLead {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  country: string;
  source: string;
  status: LeadStatus;
  priority: LeadPriorityRaw;
  counselor?: ApiCounselor;
  followUpDate?: string;
  ieltsScore?: number;
  notes?: ApiNote[];
  createdAt: string;
  updatedAt: string;
  category?: LeadCategory | null; // ← new
}

// ─── Local app shape ──────────────────────────────────────────────────────────
export interface Note {
  id: string;
  text: string;
  createdAt: string;
  author: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  country: string;
  source: string;
  status: LeadStatus;
  stage: LeadStage;
  priority: LeadPriority;
  counselor: string;
  followUp: string;
  ieltsScore?: string;
  notes: Note[];
  createdAt: string;
  updatedAt: string;
  category?: LeadCategory | null;
}

// ─── Stage config shape ───────────────────────────────────────────────────────
export interface Stage {
  id: string;
  label: string;
  color: string;
  bg: string;
  twText: string;
  twBg: string;
  twBorder: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

// ─── Filter state ─────────────────────────────────────────────────────────────
export type DateRangeValue = [Dayjs | null, Dayjs | null] | null;

export interface LeadFilters {
  search: string;
  sourceFilter: string;
  counselorFilter: string;
  countryFilter: string;
  priorityFilter: string;
  dateRange: DateRangeValue;
}

// ─── Stats ────────────────────────────────────────────────────────────────────
export interface PipelineStats {
  total: number;
  newToday: number;
  followUpsDue: number;
  converted: number;
  lost: number;
}

// ─── Action handlers ──────────────────────────────────────────────────────────
export interface LeadActionHandlers {
  onMarkLost: (lead: Lead) => void;
  onMoveTo: (leadId: string, stageId: string) => void;
  onViewNotes: (lead: Lead) => void;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onCall: (lead: Lead) => void;
  onEmail: (lead: Lead) => void;
}

// ─── Form values ──────────────────────────────────────────────────────────────
export interface EditFormValues {
  name: string;
  phone: string;
  email: string;
  stage: string;
  source: string;
  counselor: string;
  country: string;
  priority: LeadPriority;
  followUp: Dayjs | null;
  ieltsScore: string;
  category: string;
}

// ─── Activity ─────────────────────────────────────────────────────────────────
export type ActivityType =
  | "created"
  | "stage_change"
  | "note_added"
  | "call"
  | "email"
  | "edit"
  | "followup_set"
  | "overdue";

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  author: string;
  timestamp: string;
  meta?: Record<string, string | number | undefined>;
}

export type TabKey = "notes" | "details" | "activity";
