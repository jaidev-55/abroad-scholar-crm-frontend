import type {
  AttributionMetrics,
  AttributedLead,
  SourceBreakdown,
  CampaignAttribution,
  FunnelStage,
} from "../types";

// ─── Formatters ───
export const formatNumber = (v: number): string =>
  new Intl.NumberFormat("en-IN").format(v);

export const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const formatDateTime = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// ─── Mock metrics ───
export const mockMetrics: AttributionMetrics = {
  totalAttributedLeads: 642,
  metaLeads: 521,
  googleLeads: 0,
  organicLeads: 98,
  attributionRate: 81.2,
  avgTimeToConversion: 12.4,
};

// ─── Mock source breakdown ───
export const mockSourceBreakdown: SourceBreakdown[] = [
  {
    source: "META_ADS",
    leads: 521,
    conversions: 22,
    conversionRate: 4.2,
    color: "#3b82f6",
  },
  {
    source: "WEBSITE",
    leads: 98,
    conversions: 3,
    conversionRate: 3.1,
    color: "#10b981",
  },
  {
    source: "REFERRAL",
    leads: 15,
    conversions: 1,
    conversionRate: 6.7,
    color: "#8b5cf6",
  },
  {
    source: "MANUAL",
    leads: 8,
    conversions: 0,
    conversionRate: 0,
    color: "#94a3b8",
  },
];

// ─── Mock campaign attribution ───
export const mockCampaignAttribution: CampaignAttribution[] = [
  {
    campaignName: "IELTS Coaching 9999/-",
    platform: "meta",
    totalLeads: 218,
    newLeads: 140,
    inProgressLeads: 48,
    convertedLeads: 12,
    lostLeads: 18,
    conversionRate: 5.5,
    avgDaysToConversion: 9.2,
  },
  {
    campaignName: "CBE Camp 05/05/2026",
    platform: "meta",
    totalLeads: 176,
    newLeads: 118,
    inProgressLeads: 36,
    convertedLeads: 8,
    lostLeads: 14,
    conversionRate: 4.5,
    avgDaysToConversion: 11.8,
  },
  {
    campaignName: "Vp_ads",
    platform: "meta",
    totalLeads: 127,
    newLeads: 68,
    inProgressLeads: 15,
    convertedLeads: 2,
    lostLeads: 42,
    conversionRate: 1.6,
    avgDaysToConversion: 18.5,
  },
  {
    campaignName: "Website Organic",
    platform: "meta",
    totalLeads: 98,
    newLeads: 72,
    inProgressLeads: 18,
    convertedLeads: 3,
    lostLeads: 5,
    conversionRate: 3.1,
    avgDaysToConversion: 14.2,
  },
];

// ─── Mock funnel ───
export const mockFunnel: FunnelStage[] = [
  {
    stage: "Lead Captured",
    count: 642,
    percentage: 100,
    dropoff: 0,
    color: "#3b82f6",
  },
  {
    stage: "Contacted",
    count: 498,
    percentage: 77.6,
    dropoff: 22.4,
    color: "#8b5cf6",
  },
  {
    stage: "In Progress",
    count: 156,
    percentage: 24.3,
    dropoff: 53.3,
    color: "#f59e0b",
  },
  {
    stage: "Converted",
    count: 26,
    percentage: 4.0,
    dropoff: 20.3,
    color: "#10b981",
  },
];

// ─── Mock leads ───
const leadNames = [
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
  "Swathi N",
  "Ganesh B",
  "Harini S",
  "Rajesh P",
  "Swetha R",
  "Manoj V",
];

const sources: Array<"META_ADS" | "WEBSITE" | "REFERRAL" | "MANUAL"> = [
  "META_ADS",
  "META_ADS",
  "META_ADS",
  "META_ADS",
  "WEBSITE",
  "META_ADS",
  "META_ADS",
  "REFERRAL",
  "META_ADS",
  "WEBSITE",
  "META_ADS",
  "META_ADS",
  "WEBSITE",
  "MANUAL",
  "META_ADS",
  "META_ADS",
  "WEBSITE",
  "META_ADS",
  "REFERRAL",
  "META_ADS",
  "META_ADS",
  "WEBSITE",
  "META_ADS",
  "MANUAL",
  "META_ADS",
  "META_ADS",
  "WEBSITE",
  "META_ADS",
  "META_ADS",
  "META_ADS",
];

const campaigns = [
  "IELTS Coaching 9999/-",
  "CBE Camp 05/05/2026",
  "Vp_ads",
  "IELTS Coaching 9999/-",
  null,
  "CBE Camp 05/05/2026",
  "IELTS Coaching 9999/-",
  null,
  "Vp_ads",
  null,
  "CBE Camp 05/05/2026",
  "IELTS Coaching 9999/-",
  null,
  null,
  "CBE Camp 05/05/2026",
  "Vp_ads",
  null,
  "IELTS Coaching 9999/-",
  null,
  "CBE Camp 05/05/2026",
  "IELTS Coaching 9999/-",
  null,
  "Vp_ads",
  null,
  "CBE Camp 05/05/2026",
  "IELTS Coaching 9999/-",
  null,
  "CBE Camp 05/05/2026",
  "IELTS Coaching 9999/-",
  "Vp_ads",
];

const formNames = campaigns.map((c) => c || null);

const statuses: Array<"New" | "In Progress" | "Converted" | "Lost"> = [
  "New",
  "In Progress",
  "New",
  "Converted",
  "New",
  "In Progress",
  "Converted",
  "New",
  "Lost",
  "New",
  "In Progress",
  "New",
  "New",
  "New",
  "Converted",
  "Lost",
  "In Progress",
  "New",
  "New",
  "In Progress",
  "Lost",
  "New",
  "New",
  "New",
  "Converted",
  "New",
  "In Progress",
  "New",
  "Lost",
  "New",
];

const qualities: Array<"Hot" | "Warm" | "Cold"> = [
  "Warm",
  "Warm",
  "Hot",
  "Hot",
  "Cold",
  "Warm",
  "Hot",
  "Cold",
  "Cold",
  "Warm",
  "Warm",
  "Cold",
  "Warm",
  "Cold",
  "Hot",
  "Cold",
  "Warm",
  "Warm",
  "Cold",
  "Hot",
  "Cold",
  "Warm",
  "Cold",
  "Cold",
  "Hot",
  "Warm",
  "Warm",
  "Hot",
  "Cold",
  "Warm",
];

const counselors = ["Oviya", "Jai", "Priya"];
const countries = [
  "UK",
  "Canada",
  "Australia",
  "USA",
  "Germany",
  "Coimbatore",
  "Chennai",
];
const categories = ["Admission", "IELTS", "Visa", "Admission", "IELTS"];

export const mockLeads: AttributedLead[] = leadNames.map((name, i) => ({
  id: `lead-${i + 1}`,
  name,
  phone: `+91${8000000000 + Math.floor(Math.random() * 999999999)}`,
  email: `${name
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .slice(0, 8)}@gmail.com`,
  source: sources[i],
  campaignName: campaigns[i],
  formName: formNames[i],
  adSetName: campaigns[i] ? `${campaigns[i]} - AdSet 1` : null,
  pipelineStatus: statuses[i],
  quality: qualities[i],
  counselor: counselors[i % 3],
  country: countries[i % 7],
  category: categories[i % 5],
  createdAt: new Date(2026, 4, 1 + Math.floor(i * 0.6)).toISOString(),
  convertedAt:
    statuses[i] === "Converted"
      ? new Date(2026, 4, 8 + Math.floor(i * 0.5)).toISOString()
      : null,
  daysInPipeline: Math.floor(3 + Math.random() * 15),
  followUpDate:
    statuses[i] === "New" || statuses[i] === "In Progress"
      ? new Date(2026, 4, 20 + (i % 5)).toISOString().slice(0, 10)
      : null,
  notes: Math.floor(Math.random() * 4),
}));
