import type { Dayjs } from "dayjs";

// ─── Attribution stat metrics ───
export interface AttributionMetrics {
  totalAttributedLeads: number;
  metaLeads: number;
  googleLeads: number;
  organicLeads: number;
  attributionRate: number; // % of leads with known source
  avgTimeToConversion: number; // in days
}

// ─── Individual lead with attribution data ───
export interface AttributedLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: "META_ADS" | "GOOGLE_ADS" | "WEBSITE" | "REFERRAL" | "MANUAL";
  campaignName: string | null;
  formName: string | null;
  adSetName: string | null;
  pipelineStatus: "New" | "In Progress" | "Converted" | "Lost";
  quality: "Hot" | "Warm" | "Cold";
  counselor: string;
  country: string;
  category: string;
  createdAt: string;
  convertedAt: string | null;
  daysInPipeline: number;
  followUpDate: string | null;
  notes: number;
}

// ─── Source breakdown for pie/donut chart ───
export interface SourceBreakdown {
  source: string;
  leads: number;
  conversions: number;
  conversionRate: number;
  color: string;
}

// ─── Campaign attribution summary ───
export interface CampaignAttribution {
  campaignName: string;
  platform: "meta" | "google";
  totalLeads: number;
  newLeads: number;
  inProgressLeads: number;
  convertedLeads: number;
  lostLeads: number;
  conversionRate: number;
  avgDaysToConversion: number;
}

// ─── Funnel stage data ───
export interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
  dropoff: number;
  color: string;
}

// ─── Filter state ───
export interface AttributionFilters {
  period: "today" | "7days" | "30days" | "90days" | "custom";
  dateRange: [Dayjs | null, Dayjs | null] | null;
  source: string;
  campaign: string;
  pipelineStatus: string;
  counselor: string;
  quality: string;
}

// ─── API response ───
export interface LeadAttributionResponse {
  metrics: AttributionMetrics;
  leads: AttributedLead[];
  sourceBreakdown: SourceBreakdown[];
  campaignAttribution: CampaignAttribution[];
  funnel: FunnelStage[];
}
