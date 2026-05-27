import type { CampaignData, CampaignTrendPoint } from "../types";

// ─── Formatters ───
export const formatCurrency = (v: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(v);

export const formatNumber = (v: number): string =>
  new Intl.NumberFormat("en-IN").format(v);

export const formatValue = (
  v: number,
  unit: "currency" | "number" | "percent" | "days" | "minutes",
): string => {
  switch (unit) {
    case "currency":
      return formatCurrency(v);
    case "percent":
      return `${v.toFixed(1)}%`;
    case "days":
      return `${v.toFixed(1)}d`;
    case "minutes":
      return `${v}m`;
    default:
      return formatNumber(v);
  }
};

// ─── Mock campaigns ───
export const mockCampaigns: CampaignData[] = [
  {
    id: "1",
    campaignName: "IELTS Coaching 9999/-",
    platform: "meta",
    formName: "IELTS Coaching 9999/-",
    status: "active",
    startDate: "2026-05-01",
    spend: 42300,
    impressions: 156000,
    clicks: 4200,
    ctr: 2.69,
    leads: 218,
    cpl: 194,
    hotLeads: 45,
    warmLeads: 112,
    coldLeads: 61,
    conversions: 12,
    conversionRate: 5.5,
    costPerConversion: 3525,
    lostLeads: 18,
    avgResponseTime: 23,
    avgDaysToConversion: 9.2,
  },
  {
    id: "2",
    campaignName: "CBE Camp 05/05/2026",
    platform: "meta",
    formName: "CBE Camp 05/05/2026",
    status: "active",
    startDate: "2026-05-05",
    spend: 31200,
    impressions: 98000,
    clicks: 2800,
    ctr: 2.86,
    leads: 176,
    cpl: 177,
    hotLeads: 38,
    warmLeads: 89,
    coldLeads: 49,
    conversions: 8,
    conversionRate: 4.5,
    costPerConversion: 3900,
    lostLeads: 14,
    avgResponseTime: 35,
    avgDaysToConversion: 11.8,
  },
  {
    id: "3",
    campaignName: "Vp_ads",
    platform: "meta",
    formName: "Vp_ads",
    status: "paused",
    startDate: "2026-04-16",
    spend: 24900,
    impressions: 78000,
    clicks: 1900,
    ctr: 2.44,
    leads: 127,
    cpl: 196,
    hotLeads: 15,
    warmLeads: 52,
    coldLeads: 60,
    conversions: 2,
    conversionRate: 1.6,
    costPerConversion: 12450,
    lostLeads: 42,
    avgResponseTime: 68,
    avgDaysToConversion: 18.5,
  },
  {
    id: "4",
    campaignName: "UK Universities - May",
    platform: "google",
    formName: "UK Uni Lead Form",
    status: "active",
    startDate: "2026-05-01",
    spend: 18600,
    impressions: 52000,
    clicks: 1400,
    ctr: 2.69,
    leads: 82,
    cpl: 227,
    hotLeads: 18,
    warmLeads: 38,
    coldLeads: 26,
    conversions: 3,
    conversionRate: 3.7,
    costPerConversion: 6200,
    lostLeads: 8,
    avgResponseTime: 42,
    avgDaysToConversion: 14.2,
  },
  {
    id: "5",
    campaignName: "Canada PR Pathway",
    platform: "google",
    formName: "Canada Leads",
    status: "completed",
    startDate: "2026-04-10",
    spend: 7500,
    impressions: 24000,
    clicks: 680,
    ctr: 2.83,
    leads: 39,
    cpl: 192,
    hotLeads: 8,
    warmLeads: 18,
    coldLeads: 13,
    conversions: 1,
    conversionRate: 2.6,
    costPerConversion: 7500,
    lostLeads: 5,
    avgResponseTime: 55,
    avgDaysToConversion: 16.0,
  },
];

// ─── Mock daily trend for leads ───
export const mockTrend = (): CampaignTrendPoint[] =>
  Array.from({ length: 30 }, (_, i) => {
    const date = new Date(2026, 3, 19 + i);
    return {
      date: date.toISOString().slice(0, 10),
      "1": Math.max(0, Math.round(8 + (Math.random() - 0.4) * 6)),
      "2": Math.max(0, Math.round(6 + (Math.random() - 0.4) * 5)),
      "3": Math.max(0, Math.round(4 + (Math.random() - 0.5) * 4)),
      "4": Math.max(0, Math.round(3 + (Math.random() - 0.4) * 3)),
      "5": Math.max(0, Math.round(1.5 + (Math.random() - 0.5) * 2)),
    };
  });
