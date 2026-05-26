import type { ComparisonMetric } from "../types";

export const CAMPAIGN_COLORS: string[] = [
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#f59e0b", // amber
  "#10b981", // emerald
  "#ef4444", // red
];

export const COMPARISON_METRICS: ComparisonMetric[] = [
  { metric: "Spend", key: "spend", unit: "currency", higherIsBetter: false },
  { metric: "Leads", key: "leads", unit: "number", higherIsBetter: true },
  {
    metric: "Cost / Lead",
    key: "cpl",
    unit: "currency",
    higherIsBetter: false,
  },
  {
    metric: "Hot Leads",
    key: "hotLeads",
    unit: "number",
    higherIsBetter: true,
  },
  {
    metric: "Conversions",
    key: "conversions",
    unit: "number",
    higherIsBetter: true,
  },
  {
    metric: "Conv. Rate",
    key: "conversionRate",
    unit: "percent",
    higherIsBetter: true,
  },
  {
    metric: "Cost / Conv.",
    key: "costPerConversion",
    unit: "currency",
    higherIsBetter: false,
  },
  {
    metric: "Lost Leads",
    key: "lostLeads",
    unit: "number",
    higherIsBetter: false,
  },
  { metric: "CTR", key: "ctr", unit: "percent", higherIsBetter: true },
  {
    metric: "Impressions",
    key: "impressions",
    unit: "number",
    higherIsBetter: true,
  },
  { metric: "Clicks", key: "clicks", unit: "number", higherIsBetter: true },
  {
    metric: "Avg Response",
    key: "avgResponseTime",
    unit: "minutes",
    higherIsBetter: false,
  },
  {
    metric: "Avg Days to Conv.",
    key: "avgDaysToConversion",
    unit: "days",
    higherIsBetter: false,
  },
];

export const PERIOD_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "7days", label: "7 Days" },
  { value: "30days", label: "30 Days" },
  { value: "90days", label: "90 Days" },
  { value: "custom", label: "Custom" },
] as const;
