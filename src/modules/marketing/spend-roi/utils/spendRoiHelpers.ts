import type {
  SpendMetrics,
  SpendTrendPoint,
  PlatformBreakdown,
  CampaignRow,
} from "../types";

// ─── Currency formatter ───
export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

export const formatNumber = (value: number): string =>
  new Intl.NumberFormat("en-IN").format(value);

export const formatPercent = (value: number): string =>
  `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;

// ─── Mock metrics ───
export const mockMetrics: SpendMetrics = {
  totalSpend: 124500,
  totalLeads: 642,
  costPerLead: 194,
  conversions: 26,
  costPerConversion: 4788,
  roi: 3.2,
  spendChange: 12.5,
  leadsChange: 18.3,
  cplChange: -5.2,
  conversionsChange: 8.7,
};

// ─── Mock trend data (30 days) ───
export const mockTrend: SpendTrendPoint[] = Array.from(
  { length: 30 },
  (_, i) => {
    const date = new Date(2026, 3, 19 + i);
    const spend = Math.round(2500 + Math.random() * 4000);
    const leads = Math.round(8 + Math.random() * 25);
    return {
      date: date.toISOString().slice(0, 10),
      spend,
      leads,
      conversions: Math.round(Math.random() * 3),
      cpl: Math.round(spend / leads),
    };
  },
);

// ─── Mock platform breakdown ───
export const mockPlatforms: PlatformBreakdown[] = [
  {
    platform: "Meta Ads",
    spend: 98400,
    leads: 521,
    conversions: 22,
    cpl: 189,
    cpc: 32,
    conversionRate: 4.2,
  },
  {
    platform: "Google Ads",
    spend: 26100,
    leads: 121,
    conversions: 4,
    cpl: 216,
    cpc: 45,
    conversionRate: 3.3,
  },
];

// ─── Mock campaign table data ───
export const mockCampaigns: CampaignRow[] = [
  {
    id: "1",
    campaignName: "IELTS Coaching 9999/-",
    platform: "meta",
    formName: "IELTS Coaching 9999/-",
    status: "active",
    spend: 42300,
    impressions: 156000,
    clicks: 4200,
    ctr: 2.69,
    leads: 218,
    cpl: 194,
    conversions: 12,
    conversionRate: 5.5,
    costPerConversion: 3525,
    startDate: "2026-05-01",
    lastSync: "2026-05-18T12:30:00",
  },
  {
    id: "2",
    campaignName: "CBE Camp 05/05/2026",
    platform: "meta",
    formName: "CBE Camp 05/05/2026",
    status: "active",
    spend: 31200,
    impressions: 98000,
    clicks: 2800,
    ctr: 2.86,
    leads: 176,
    cpl: 177,
    conversions: 8,
    conversionRate: 4.5,
    costPerConversion: 3900,
    startDate: "2026-05-05",
    lastSync: "2026-05-18T12:28:00",
  },
  {
    id: "3",
    campaignName: "Vp_ads",
    platform: "meta",
    formName: "Vp_ads",
    status: "paused",
    spend: 24900,
    impressions: 78000,
    clicks: 1900,
    ctr: 2.44,
    leads: 127,
    cpl: 196,
    conversions: 2,
    conversionRate: 1.6,
    costPerConversion: 12450,
    startDate: "2026-04-16",
    lastSync: "2026-05-10T09:15:00",
  },
  {
    id: "4",
    campaignName: "UK Universities - May",
    platform: "google",
    formName: "UK Uni Lead Form",
    status: "active",
    spend: 18600,
    impressions: 52000,
    clicks: 1400,
    ctr: 2.69,
    leads: 82,
    cpl: 227,
    conversions: 3,
    conversionRate: 3.7,
    costPerConversion: 6200,
    startDate: "2026-05-01",
    lastSync: "2026-05-18T11:45:00",
  },
  {
    id: "5",
    campaignName: "Canada PR Pathway",
    platform: "google",
    formName: "Canada Leads",
    status: "completed",
    spend: 7500,
    impressions: 24000,
    clicks: 680,
    ctr: 2.83,
    leads: 39,
    cpl: 192,
    conversions: 1,
    conversionRate: 2.6,
    costPerConversion: 7500,
    startDate: "2026-04-10",
    lastSync: "2026-05-02T16:20:00",
  },
];
