/* eslint-disable @typescript-eslint/no-unused-vars */
import type { SpendRoiResponse } from "../types";
import {
  mockMetrics,
  mockTrend,
  mockPlatforms,
  mockCampaigns,
} from "../utils/spendRoiHelpers";



export const getSpendRoiData = async (
  _period?: string,
  _platform?: string,
): Promise<SpendRoiResponse> => {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 600));

  return {
    metrics: mockMetrics,
    trend: mockTrend,
    platforms: mockPlatforms,
    campaigns: mockCampaigns,
  };
};
