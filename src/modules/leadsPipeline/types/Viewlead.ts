export interface CallMeta {
  duration?: number;
  outcome?: string;
  notes?: string;
  rating?: number;
  followUpDate?: string;
}

export interface EditMeta {
  field?: string;
  oldValue?: string;
  newValue?: string;
}

export interface StageChangeMeta {
  from?: string;
  to?: string;
}

export interface FollowUpMeta {
  date?: string;
}

export interface EmailMeta {
  subject?: string;
}

export type ActivityMeta = CallMeta &
  EditMeta &
  StageChangeMeta &
  FollowUpMeta &
  EmailMeta;

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
  meta?: ActivityMeta;
}
