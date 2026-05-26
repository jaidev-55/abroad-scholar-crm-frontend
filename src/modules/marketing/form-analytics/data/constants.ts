import type {
  FormMetrics,
  FormPerformanceRow,
  SubmissionTrendPoint,
  PlatformSplit,
  FieldDropoff,
  HourlyHeatmapCell,
  TopCampaign,
  FormSubmission,
  AdForm,
} from "../types";

// ── Summary metrics ───────────────────────────────
export const mockMetrics: FormMetrics = {
  totalSubmissions: 1247,
  uniqueLeads: 983,
  syncRate: 94.2,
  conversionRate: 31.6,
  avgResponseTime: 18,
  activeForms: 7,
};

// ── Connected forms ───────────────────────────────
export const mockForms: AdForm[] = [
  {
    id: "f1",
    name: "IELTS Masterclass – Meta Lead",
    platform: "meta",
    formId: "948372615",
    campaignName: "IELTS Masterclass May",
    status: "active",
    createdAt: "2026-04-12",
    lastSyncAt: "2026-05-18T09:32:00Z",
  },
  {
    id: "f2",
    name: "UK Uni Fair – Google Lead",
    platform: "google",
    formId: "CL-884721",
    campaignName: "UK University Fair",
    status: "active",
    createdAt: "2026-04-20",
    lastSyncAt: "2026-05-18T09:30:00Z",
  },
  {
    id: "f3",
    name: "Free Consultation – Meta",
    platform: "meta",
    formId: "948372888",
    campaignName: "Free Counselling Session",
    status: "active",
    createdAt: "2026-04-25",
    lastSyncAt: "2026-05-18T08:15:00Z",
  },
  {
    id: "f4",
    name: "Canada PR Webinar – Google",
    platform: "google",
    formId: "CL-993311",
    campaignName: "Canada PR Webinar",
    status: "active",
    createdAt: "2026-05-01",
    lastSyncAt: "2026-05-18T09:00:00Z",
  },
  {
    id: "f5",
    name: "Australia Study Guide – Meta",
    platform: "meta",
    formId: "948373001",
    campaignName: "Australia Study Abroad",
    status: "paused",
    createdAt: "2026-03-10",
    lastSyncAt: "2026-05-10T12:00:00Z",
  },
  {
    id: "f6",
    name: "Scholarship Alert – Google",
    platform: "google",
    formId: "CL-112233",
    campaignName: "Scholarship Finder",
    status: "active",
    createdAt: "2026-05-05",
    lastSyncAt: "2026-05-18T09:31:00Z",
  },
  {
    id: "f7",
    name: "Germany Intake 2026 – Meta",
    platform: "meta",
    formId: "948373222",
    campaignName: "Germany Oct Intake",
    status: "active",
    createdAt: "2026-05-08",
    lastSyncAt: "2026-05-18T09:28:00Z",
  },
];

// ── Form performance table ────────────────────────
export const mockFormPerformance: FormPerformanceRow[] = [
  {
    formId: "f1",
    formName: "IELTS Masterclass – Meta Lead",
    platform: "meta",
    campaignName: "IELTS Masterclass May",
    submissions: 342,
    uniqueLeads: 298,
    syncRate: 96.5,
    conversionRate: 38.2,
    avgResponseTime: 12,
    cost: 4200,
    costPerLead: 14,
    status: "active",
  },
  {
    formId: "f2",
    formName: "UK Uni Fair – Google Lead",
    platform: "google",
    campaignName: "UK University Fair",
    submissions: 281,
    uniqueLeads: 210,
    syncRate: 93.2,
    conversionRate: 29.5,
    avgResponseTime: 22,
    cost: 5100,
    costPerLead: 24,
    status: "active",
  },
  {
    formId: "f3",
    formName: "Free Consultation – Meta",
    platform: "meta",
    campaignName: "Free Counselling Session",
    submissions: 198,
    uniqueLeads: 165,
    syncRate: 95.0,
    conversionRate: 42.1,
    avgResponseTime: 8,
    cost: 2800,
    costPerLead: 17,
    status: "active",
  },
  {
    formId: "f4",
    formName: "Canada PR Webinar – Google",
    platform: "google",
    campaignName: "Canada PR Webinar",
    submissions: 156,
    uniqueLeads: 132,
    syncRate: 91.8,
    conversionRate: 25.0,
    avgResponseTime: 30,
    cost: 3400,
    costPerLead: 26,
    status: "active",
  },
  {
    formId: "f5",
    formName: "Australia Study Guide – Meta",
    platform: "meta",
    campaignName: "Australia Study Abroad",
    submissions: 88,
    uniqueLeads: 61,
    syncRate: 89.7,
    conversionRate: 18.0,
    avgResponseTime: 45,
    cost: 1900,
    costPerLead: 31,
    status: "paused",
  },
  {
    formId: "f6",
    formName: "Scholarship Alert – Google",
    platform: "google",
    campaignName: "Scholarship Finder",
    submissions: 112,
    uniqueLeads: 78,
    syncRate: 97.3,
    conversionRate: 35.9,
    avgResponseTime: 15,
    cost: 1600,
    costPerLead: 21,
    status: "active",
  },
  {
    formId: "f7",
    formName: "Germany Intake 2026 – Meta",
    platform: "meta",
    campaignName: "Germany Oct Intake",
    submissions: 70,
    uniqueLeads: 39,
    syncRate: 94.3,
    conversionRate: 22.0,
    avgResponseTime: 20,
    cost: 1100,
    costPerLead: 28,
    status: "active",
  },
];

// ── Submission trend (30 days) — fully static ─────
export const mockSubmissionTrend: SubmissionTrendPoint[] = [
  { date: "2026-04-19", submissions: 28, synced: 25, converted: 8 },
  { date: "2026-04-20", submissions: 35, synced: 32, converted: 10 },
  { date: "2026-04-21", submissions: 42, synced: 38, converted: 14 },
  { date: "2026-04-22", submissions: 38, synced: 35, converted: 12 },
  { date: "2026-04-23", submissions: 45, synced: 41, converted: 16 },
  { date: "2026-04-24", submissions: 50, synced: 46, converted: 18 },
  { date: "2026-04-25", submissions: 40, synced: 36, converted: 13 },
  { date: "2026-04-26", submissions: 32, synced: 29, converted: 9 },
  { date: "2026-04-27", submissions: 30, synced: 27, converted: 8 },
  { date: "2026-04-28", submissions: 48, synced: 44, converted: 17 },
  { date: "2026-04-29", submissions: 55, synced: 50, converted: 20 },
  { date: "2026-04-30", submissions: 60, synced: 55, converted: 22 },
  { date: "2026-05-01", submissions: 52, synced: 47, converted: 18 },
  { date: "2026-05-02", submissions: 46, synced: 42, converted: 15 },
  { date: "2026-05-03", submissions: 38, synced: 34, converted: 11 },
  { date: "2026-05-04", submissions: 33, synced: 30, converted: 10 },
  { date: "2026-05-05", submissions: 41, synced: 37, converted: 14 },
  { date: "2026-05-06", submissions: 47, synced: 43, converted: 16 },
  { date: "2026-05-07", submissions: 53, synced: 48, converted: 19 },
  { date: "2026-05-08", submissions: 58, synced: 53, converted: 21 },
  { date: "2026-05-09", submissions: 44, synced: 40, converted: 15 },
  { date: "2026-05-10", submissions: 36, synced: 33, converted: 11 },
  { date: "2026-05-11", submissions: 30, synced: 27, converted: 9 },
  { date: "2026-05-12", submissions: 39, synced: 36, converted: 13 },
  { date: "2026-05-13", submissions: 50, synced: 45, converted: 17 },
  { date: "2026-05-14", submissions: 56, synced: 51, converted: 20 },
  { date: "2026-05-15", submissions: 62, synced: 57, converted: 23 },
  { date: "2026-05-16", submissions: 48, synced: 44, converted: 16 },
  { date: "2026-05-17", submissions: 40, synced: 36, converted: 12 },
  { date: "2026-05-18", submissions: 35, synced: 32, converted: 10 },
];

// ── Platform split ────────────────────────────────
export const mockPlatformSplit: PlatformSplit[] = [
  { platform: "meta", submissions: 698, percentage: 56 },
  { platform: "google", submissions: 549, percentage: 44 },
];

// ── Field drop-off ────────────────────────────────
export const mockFieldDropoff: FieldDropoff[] = [
  { fieldName: "Full Name", started: 1247, completed: 1240, dropoffRate: 0.6 },
  {
    fieldName: "Email Address",
    started: 1240,
    completed: 1215,
    dropoffRate: 2.0,
  },
  {
    fieldName: "Phone Number",
    started: 1215,
    completed: 1120,
    dropoffRate: 7.8,
  },
  {
    fieldName: "Preferred Country",
    started: 1120,
    completed: 1058,
    dropoffRate: 5.5,
  },
  {
    fieldName: "IELTS Score",
    started: 1058,
    completed: 912,
    dropoffRate: 13.8,
  },
  {
    fieldName: "Intake Preference",
    started: 912,
    completed: 870,
    dropoffRate: 4.6,
  },
  { fieldName: "Submit", started: 870, completed: 832, dropoffRate: 4.4 },
];

// ── Heatmap (day × hour) — fully static ──────────
export const mockHeatmap: HourlyHeatmapCell[] = (() => {
  const cells: HourlyHeatmapCell[] = [];
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      let value = 1;
      if (h >= 9 && h <= 12) value = d >= 1 && d <= 5 ? 14 : 6;
      else if (h >= 13 && h <= 17) value = d >= 1 && d <= 5 ? 12 : 5;
      else if (h >= 18 && h <= 21) value = d >= 1 && d <= 5 ? 8 : 4;
      else if (h >= 6 && h <= 8) value = d >= 1 && d <= 5 ? 5 : 2;
      else value = 1;
      // Add some variation per cell
      const variation = ((d * 24 + h) * 7) % 5;
      cells.push({ day: d, hour: h, value: value + variation });
    }
  }
  return cells;
})();

// ── Top campaigns ─────────────────────────────────
export const mockTopCampaigns: TopCampaign[] = [
  {
    campaignName: "IELTS Masterclass May",
    platform: "meta",
    submissions: 342,
    conversionRate: 38.2,
  },
  {
    campaignName: "UK University Fair",
    platform: "google",
    submissions: 281,
    conversionRate: 29.5,
  },
  {
    campaignName: "Free Counselling Session",
    platform: "meta",
    submissions: 198,
    conversionRate: 42.1,
  },
  {
    campaignName: "Canada PR Webinar",
    platform: "google",
    submissions: 156,
    conversionRate: 25.0,
  },
  {
    campaignName: "Scholarship Finder",
    platform: "google",
    submissions: 112,
    conversionRate: 35.9,
  },
];

// ── Recent submissions — fully static ─────────────
const leadNames = [
  "Arjun Mehta",
  "Priya Sharma",
  "Rahul Nair",
  "Sneha Reddy",
  "Karthik V",
  "Ananya Das",
  "Vikram Singh",
  "Divya Iyer",
  "Rohan Patel",
  "Meera Krishnan",
  "Aditya Joshi",
  "Pooja Menon",
  "Suresh Kumar",
  "Lakshmi R",
  "Deepak Pandey",
  "Neha Gupta",
  "Amit Rao",
  "Swathi B",
  "Manoj T",
  "Kavitha S",
  "Ravi Shankar",
  "Isha Malhotra",
  "Naveen Raj",
  "Tanvi Desai",
  "Siddharth P",
];
const counselors = ["Ramya S", "Kiran M", "Anjali T", "Deepa R", "Sunil K"];

export const mockRecentSubmissions: FormSubmission[] = leadNames.map(
  (name, i) => {
    const form = mockForms[i % mockForms.length];
    const hoursAgo = i * 2 + 1;
    return {
      id: `sub-${1000 + i}`,
      formId: form.id,
      formName: form.name,
      platform: form.platform,
      submittedAt: new Date(Date.now() - hoursAgo * 3_600_000).toISOString(),
      leadName: name,
      leadEmail: `${name.toLowerCase().replace(/ /g, ".")}@gmail.com`,
      leadPhone: `+91 ${9800000000 + i * 1111111}`,
      syncedToCrm: i % 8 !== 3,
      assignedCounselor: counselors[i % counselors.length],
      convertedToLead: i % 3 === 0,
    };
  },
);
