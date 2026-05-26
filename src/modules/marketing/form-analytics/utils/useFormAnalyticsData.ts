import { useState, useEffect } from "react";
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
  mockForms,
} from "../data/constants";

export const useFormAnalyticsData = (filters: FormAnalyticsFilters) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const id = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(id);
  }, [
    filters.platform,
    filters.formId,
    filters.granularity,
    filters.dateRange,
  ]);

  const byPlatform = <T extends { platform: string }>(list: T[]) =>
    filters.platform === "all"
      ? list
      : list.filter((r) => r.platform === filters.platform);

  return {
    isLoading,
    metrics: mockMetrics,
    formPerformance: byPlatform(mockFormPerformance),
    submissionTrend: mockSubmissionTrend,
    platformSplit: mockPlatformSplit,
    fieldDropoff: mockFieldDropoff,
    heatmap: mockHeatmap,
    topCampaigns: byPlatform(mockTopCampaigns),
    recentSubmissions: byPlatform(mockRecentSubmissions),
    forms: mockForms,
  };
};
