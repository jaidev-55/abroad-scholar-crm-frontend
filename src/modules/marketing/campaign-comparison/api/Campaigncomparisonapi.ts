import type { CampaignComparisonResponse } from "../types";
import { mockCampaigns, mockTrend } from "../utils/campaignComparisonHelpers";

export const getCampaignComparison =
  async (): Promise<CampaignComparisonResponse> => {
    await new Promise((res) => setTimeout(res, 500));
    return {
      campaigns: mockCampaigns,
      trend: mockTrend(),
    };
  };
