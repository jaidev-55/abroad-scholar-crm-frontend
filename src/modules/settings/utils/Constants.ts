import type { SettingsTab } from "../types";

export const SETTINGS_TABS: {
  key: SettingsTab;
  label: string;
  icon: string;
}[] = [
  { key: "general", label: "General", icon: "settings" },
  { key: "pipeline", label: "Pipeline & Leads", icon: "pipeline" },
  { key: "assignment", label: "Assignment Rules", icon: "assignment" },
  { key: "notifications", label: "Notifications", icon: "notification" },
  { key: "webhooks", label: "Webhooks & API", icon: "webhook" },
  { key: "email", label: "Email Templates", icon: "email" },
  { key: "data", label: "Data & Export", icon: "data" },
  { key: "audit", label: "Audit Log", icon: "audit" },
];

export const TIMEZONE_OPTIONS = [
  { value: "Asia/Kolkata", label: "IST (Asia/Kolkata)" },
  { value: "Asia/Dubai", label: "GST (Asia/Dubai)" },
  { value: "Europe/London", label: "GMT (Europe/London)" },
  { value: "America/New_York", label: "EST (America/New_York)" },
  { value: "America/Los_Angeles", label: "PST (America/Los_Angeles)" },
  { value: "Australia/Sydney", label: "AEST (Australia/Sydney)" },
];

export const CURRENCY_OPTIONS = [
  { value: "INR", label: "₹ INR (Indian Rupee)" },
  { value: "USD", label: "$ USD (US Dollar)" },
  { value: "GBP", label: "£ GBP (British Pound)" },
  { value: "AUD", label: "A$ AUD (Australian Dollar)" },
  { value: "CAD", label: "C$ CAD (Canadian Dollar)" },
  { value: "EUR", label: "€ EUR (Euro)" },
];

export const DATE_FORMAT_OPTIONS = [
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
  { value: "DD MMM YYYY", label: "DD MMM YYYY" },
];

export const AUDIT_CATEGORY_CONFIG: Record<
  string,
  { bg: string; text: string }
> = {
  lead: { bg: "bg-blue-50", text: "text-blue-600" },
  user: { bg: "bg-purple-50", text: "text-purple-600" },
  settings: { bg: "bg-amber-50", text: "text-amber-600" },
  marketing: { bg: "bg-emerald-50", text: "text-emerald-600" },
};
