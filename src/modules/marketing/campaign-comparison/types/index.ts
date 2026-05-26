import type { Dayjs } from "dayjs";

// ─── Campaign data for comparison ───
export interface CampaignData {
  id: string;
  campaignName: string;
  platform: "meta" | "google";
  formName: string;
  status: "active" | "paused" | "completed";
  startDate: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  leads: number;
  cpl: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  conversions: number;
  conversionRate: number;
  costPerConversion: number;
  lostLeads: number;
  avgResponseTime: number;
  avgDaysToConversion: number;
}

// ─── Comparison metric for radar/bar ───
export interface ComparisonMetric {
  metric: string;
  key: string;
  unit: "currency" | "number" | "percent" | "days" | "minutes";
  higherIsBetter: boolean;
}

// ─── Daily trend per campaign ───
export interface CampaignTrendPoint {
  date: string;
  [campaignId: string]: number | string;
}

// ─── Filter state ───
export interface ComparisonFilters {
  period: "today" | "7days" | "30days" | "90days" | "custom";
  dateRange: [Dayjs | null, Dayjs | null] | null;
  selectedCampaigns: string[];
}

// ─── API response ───
export interface CampaignComparisonResponse {
  campaigns: CampaignData[];
  trend: CampaignTrendPoint[];
}
