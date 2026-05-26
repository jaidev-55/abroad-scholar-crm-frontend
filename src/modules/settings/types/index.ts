// ─── General settings ───
export interface GeneralSettings {
  companyName: string;
  logoUrl: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  language: string;
}

// ─── Pipeline stage config ───
export interface PipelineStage {
  id: string;
  name: string;
  color: string;
  order: number;
  isDefault: boolean;
}

export interface LeadCategory {
  id: string;
  name: string;
  color: string;
}

export interface LeadQualityOption {
  id: string;
  name: string;
  color: string;
}

export interface CountryOption {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
}

// ─── Round robin config ───
export interface AssignmentRule {
  id: string;
  name: string;
  type: "round_robin" | "weighted" | "manual" | "rule_based";
  isActive: boolean;
  counselors: string[];
  conditions?: {
    field: string;
    operator: string;
    value: string;
  }[];
}

// ─── Notification preference ───
export interface NotificationPreference {
  id: string;
  event: string;
  description: string;
  inApp: boolean;
  email: boolean;
  category: "leads" | "team" | "marketing" | "system";
}

// ─── Webhook config ───
export interface WebhookConfig {
  id: string;
  platform: "meta" | "google" | "custom";
  webhookUrl: string;
  secret: string;
  isActive: boolean;
  lastPing: string | null;
}

// ─── Email template ───
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  description: string;
  isActive: boolean;
  lastEdited: string;
}

// ─── Audit log entry ───
export interface AuditLogEntry {
  id: string;
  user: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
  category: "lead" | "user" | "settings" | "marketing";
}

// ─── SMTP config ───
export interface SmtpConfig {
  host: string;
  port: number;
  username: string;
  encryption: "tls" | "ssl" | "none";
  fromEmail: string;
  fromName: string;
}

// ─── Settings tab ───
export type SettingsTab =
  | "general"
  | "pipeline"
  | "assignment"
  | "notifications"
  | "webhooks"
  | "email"
  | "data"
  | "audit";

// ─── Full settings response ───
export interface SettingsResponse {
  general: GeneralSettings;
  pipelineStages: PipelineStage[];
  categories: LeadCategory[];
  qualities: LeadQualityOption[];
  countries: CountryOption[];
  assignmentRules: AssignmentRule[];
  notifications: NotificationPreference[];
  webhooks: WebhookConfig[];
  emailTemplates: EmailTemplate[];
  smtp: SmtpConfig;
  auditLogs: AuditLogEntry[];
}
