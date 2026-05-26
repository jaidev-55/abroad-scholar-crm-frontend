// ─── Sync log entry ───
export interface SyncLogEntry {
  id: string;
  leadName: string;
  leadPhone: string;
  formName: string;
  formId: string;
  platform: "meta" | "google";
  status: "success" | "failed" | "duplicate" | "partial";
  counselorAssigned: string;
  syncedAt: string;
  responseTime: number; // ms
  errorMessage?: string;
  leadId?: string;
  quality: "Hot" | "Warm" | "Cold" | null;
  country: string | null;
}

// ─── Sync stats ───
export interface SyncStats {
  totalSyncs: number;
  successCount: number;
  failedCount: number;
  duplicateCount: number;
  successRate: number;
  avgResponseTime: number;
  lastSyncAt: string;
  syncsTodayCount: number;
}

// ─── Sync health per form ───
export interface FormSyncHealth {
  formId: string;
  formName: string;
  platform: "meta" | "google";
  isActive: boolean;
  totalSyncs: number;
  successRate: number;
  lastSyncAt: string;
  avgResponseTime: number;
  failedLast24h: number;
}

// ─── Hourly sync volume ───
export interface SyncVolumePoint {
  hour: string;
  success: number;
  failed: number;
}

// ─── Filter state ───
export interface SyncLogFilters {
  period: "today" | "7days" | "30days" | "custom";
  status: string;
  form: string;
  search: string;
}

// ─── API response ───
export interface SyncLogResponse {
  stats: SyncStats;
  logs: SyncLogEntry[];
  formHealth: FormSyncHealth[];
  volume: SyncVolumePoint[];
}
