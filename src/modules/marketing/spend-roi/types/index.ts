import type { Dayjs } from "dayjs";

// ─── Stat card metrics ───
export interface SpendMetrics {
  totalSpend: number;
  totalLeads: number;
  costPerLead: number;
  conversions: number;
  costPerConversion: number;
  roi: number;
  spendChange: number;
  leadsChange: number;
  cplChange: number;
  conversionsChange: number;
}

// ─── Chart data ───
export interface SpendTrendPoint {
  date: string;
  spend: number;
  leads: number;
  conversions: number;
  cpl: number;
}

// ─── Platform breakdown ───
export interface PlatformBreakdown {
  platform: string;
  spend: number;
  leads: number;
  conversions: number;
  cpl: number;
  cpc: number;
  conversionRate: number;
}

// ─── Campaign row for table ───
export interface CampaignRow {
  id: string;
  campaignName: string;
  platform: "meta" | "google";
  formName: string;
  status: "active" | "paused" | "completed";
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  leads: number;
  cpl: number;
  conversions: number;
  conversionRate: number;
  costPerConversion: number;
  startDate: string;
  lastSync: string;
}

// ─── Filter state ───
export interface SpendFilters {
  dateRange: [Dayjs | null, Dayjs | null] | null;
  platform: string;
  campaign: string;
  period: "today" | "7days" | "30days" | "90days" | "custom";
}

// ─── API response wrapper ───
export interface SpendRoiResponse {
  metrics: SpendMetrics;
  trend: SpendTrendPoint[];
  platforms: PlatformBreakdown[];
  campaigns: CampaignRow[];
}
