import type { FormAnalyticsFilters } from "../types";
import {
  mockMetrics,
  mockFormPerformance,
  mockSubmissionTrend,
  mockPlatformSplit,
  mockFieldDropoff,
  mockHeatmap,
  mockTopCampaigns,
  mockRecentSubmissions,
} from "../data/constants";

// Replace with real API calls when backend is ready
const delay = <T>(data: T, ms = 400): Promise<T> =>
  new Promise((res) => setTimeout(() => res(data), ms));

export const fetchFormMetrics = (_f: FormAnalyticsFilters) =>
  delay(mockMetrics);

export const fetchFormPerformance = (_f: FormAnalyticsFilters) =>
  delay(mockFormPerformance);

export const fetchSubmissionTrend = (_f: FormAnalyticsFilters) =>
  delay(mockSubmissionTrend);

export const fetchPlatformSplit = (_f: FormAnalyticsFilters) =>
  delay(mockPlatformSplit);

export const fetchFieldDropoff = (_f: FormAnalyticsFilters) =>
  delay(mockFieldDropoff);

export const fetchHeatmap = (_f: FormAnalyticsFilters) => delay(mockHeatmap);

export const fetchTopCampaigns = (_f: FormAnalyticsFilters) =>
  delay(mockTopCampaigns);

export const fetchRecentSubmissions = (_f: FormAnalyticsFilters) =>
  delay(mockRecentSubmissions);
