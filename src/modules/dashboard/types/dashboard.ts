export const LeadSource = {
  INSTAGRAM: "INSTAGRAM",
  WEBSITE: "WEBSITE",
  WALK_IN: "WALK_IN",
  GOOGLE_ADS: "GOOGLE_ADS",
  META_ADS: "META_ADS",
  REFERRAL: "REFERRAL",
  GOOGLE_SHEET: "GOOGLE_SHEET",
} as const;
export type LeadSource = (typeof LeadSource)[keyof typeof LeadSource];

export const LeadStatus = {
  NEW: "NEW",
  IN_PROGRESS: "IN_PROGRESS",
  CONVERTED: "CONVERTED",
  LOST: "LOST",
} as const;
export type LeadStatus = (typeof LeadStatus)[keyof typeof LeadStatus];

export const LeadPriority = {
  HOT: "HOT",
  WARM: "WARM",
  COLD: "COLD",
} as const;
export type LeadPriority = (typeof LeadPriority)[keyof typeof LeadPriority];

export const UserRole = {
  ADMIN: "ADMIN",
  COUNSELOR: "COUNSELOR",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const ActivityType = {
  NOTE: "NOTE",
  CALL: "CALL",
  EMAIL: "EMAIL",
  STATUS_CHANGE: "STATUS_CHANGE",
  EDIT: "EDIT",
} as const;
export type ActivityType = (typeof ActivityType)[keyof typeof ActivityType];

export const LostReason = {
  NO_RESPONSE: "NO_RESPONSE",
  NOT_INTERESTED: "NOT_INTERESTED",
  FINANCIAL_ISSUE: "FINANCIAL_ISSUE",
  CHOSE_OTHER_CONSULTANT: "CHOSE_OTHER_CONSULTANT",
  NOT_ELIGIBLE: "NOT_ELIGIBLE",
  DUPLICATE_LEAD: "DUPLICATE_LEAD",
  VISA_REJECTED: "VISA_REJECTED",
  OTHER: "OTHER",
} as const;
export type LostReason = (typeof LostReason)[keyof typeof LostReason];

// ─── Core Models ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  country: string | null;
  ieltsScore: number | null;
  status: LeadStatus;
  source: LeadSource;
  priority: LeadPriority;
  counselorId: string | null;
  counselor: Pick<User, "id" | "name"> | null;
  followUpDate: string | null;
  lostReason: LostReason | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeadNote {
  id: string;
  content: string;
  leadId: string;
  createdAt: string;
}

export interface LeadActivity {
  id: string;
  type: ActivityType;
  message: string;
  meta: Record<string, unknown> | null;
  leadId: string;
  userId: string | null;
  user: Pick<User, "id" | "name"> | null;
  createdAt: string;
}
