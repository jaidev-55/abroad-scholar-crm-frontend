import type {
  SyncStats,
  FormSyncHealth,
  SyncVolumePoint,
  SyncLogEntry,
} from "../types/Index";

// ─── Formatters ───
export const formatDateTime = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

export const formatMs = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
};

export const timeAgo = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

// ─── Mock stats ───
export const mockStats: SyncStats = {
  totalSyncs: 687,
  successCount: 642,
  failedCount: 18,
  duplicateCount: 24,
  successRate: 93.4,
  avgResponseTime: 1240,
  lastSyncAt: "2026-05-18T12:30:45",
  syncsTodayCount: 14,
};

// ─── Mock form health ───
export const mockFormHealth: FormSyncHealth[] = [
  {
    formId: "803558416133120",
    formName: "IELTS Coaching 9999/-",
    platform: "meta",
    isActive: true,
    totalSyncs: 224,
    successRate: 97.3,
    lastSyncAt: "2026-05-18T12:30:45",
    avgResponseTime: 980,
    failedLast24h: 0,
  },
  {
    formId: "2740378869253954",
    formName: "CBE Camp 05/05/2026",
    platform: "meta",
    isActive: true,
    totalSyncs: 182,
    successRate: 94.5,
    lastSyncAt: "2026-05-18T12:28:12",
    avgResponseTime: 1150,
    failedLast24h: 1,
  },
  {
    formId: "2749542405397728",
    formName: "Vp_ads",
    platform: "meta",
    isActive: false,
    totalSyncs: 134,
    successRate: 85.1,
    lastSyncAt: "2026-05-10T09:15:33",
    avgResponseTime: 1680,
    failedLast24h: 0,
  },
];

// ─── Mock sync volume (24h hourly) ───
export const mockVolume: SyncVolumePoint[] = Array.from(
  { length: 24 },
  (_, i) => {
    const hour = `${String(i).padStart(2, "0")}:00`;
    const isBusinessHour = i >= 8 && i <= 20;
    return {
      hour,
      success: isBusinessHour
        ? Math.round(3 + Math.random() * 8)
        : Math.round(Math.random() * 2),
      failed: isBusinessHour ? (Math.random() > 0.8 ? 1 : 0) : 0,
    };
  },
);

// ─── Mock log entries ───
const names = [
  "S.adhisda Sakthivel",
  "Kanav Bhagwandas",
  "Dt.Sowmiya",
  "Bala Ravi",
  "Meera Krishnan",
  "Arun Patel",
  "Sneha Reddy",
  "Vikram Singh",
  "Divya Sharma",
  "Rahul Nair",
  "Priya Menon",
  "Karthik Raja",
  "Ananya Das",
  "Suresh Kumar",
  "Lakshmi Iyer",
  "Deepak Joshi",
  "Nisha Gupta",
  "Arjun Verma",
  "Pooja Rao",
  "Sanjay Thakur",
  "Kavitha M",
  "Ravi Shankar",
  "Anjali Pillai",
  "Mohan K",
  "Swetha R",
  "Harini S",
  "Rajesh P",
  "Manoj V",
  "Ganesh B",
  "Swathi N",
];

const forms = [
  { name: "IELTS Coaching 9999/-", id: "803558416133120" },
  { name: "CBE Camp 05/05/2026", id: "2740378869253954" },
  { name: "Vp_ads", id: "2749542405397728" },
];

const counselors = ["Oviya", "Jai", "Priya"];
const statuses: Array<"success" | "failed" | "duplicate" | "partial"> = [
  "success",
  "success",
  "success",
  "success",
  "success",
  "success",
  "success",
  "success",
  "success",
  "success",
  "success",
  "failed",
  "success",
  "success",
  "duplicate",
  "success",
  "success",
  "success",
  "partial",
  "success",
  "success",
  "success",
  "failed",
  "success",
  "success",
  "duplicate",
  "success",
  "success",
  "success",
  "success",
];

const qualities: Array<"Hot" | "Warm" | "Cold" | null> = [
  "Warm",
  "Warm",
  "Hot",
  "Hot",
  "Cold",
  "Warm",
  "Hot",
  null,
  "Cold",
  "Warm",
  "Warm",
  null,
  "Cold",
  "Warm",
  null,
  "Hot",
  "Warm",
  "Cold",
  "Warm",
  "Hot",
  "Cold",
  "Warm",
  null,
  "Warm",
  "Hot",
  null,
  "Warm",
  "Cold",
  "Warm",
  "Hot",
];

const countries = [
  "UK",
  "Canada",
  "Australia",
  "USA",
  "Germany",
  "Coimbatore",
  "Chennai",
  null,
];

const errorMessages: Record<string, string> = {
  failed: "Webhook timeout: CRM endpoint did not respond within 30s",
  duplicate: "Lead with phone number already exists in pipeline",
  partial: "Lead created but counselor auto-assign failed",
};

export const mockLogs: SyncLogEntry[] = names.map((name, i) => {
  const form = forms[i % 3];
  const status = statuses[i];
  const baseTime = new Date(2026, 4, 18, 12, 30, 0);
  baseTime.setMinutes(baseTime.getMinutes() - i * 47);

  return {
    id: `sync-${i + 1}`,
    leadName: name,
    leadPhone: `+91${8000000000 + Math.floor(Math.random() * 999999999)}`,
    formName: form.name,
    formId: form.id,
    platform: "meta" as const,
    status,
    counselorAssigned: status === "failed" ? "—" : counselors[i % 3],
    syncedAt: baseTime.toISOString(),
    responseTime: Math.round(400 + Math.random() * 2000),
    errorMessage: status !== "success" ? errorMessages[status] : undefined,
    leadId: status !== "failed" ? `LEAD-${1000 + i}` : undefined,
    quality: status !== "failed" ? qualities[i] : null,
    country: countries[i % 8],
  };
});
