import type { LeadAttributionResponse } from "../types";
import { mockMetrics, mockLeads, mockSourceBreakdown, mockCampaignAttribution, mockFunnel } from "../utils/Leadattributionhelpers";


export const getLeadAttribution =
  async (): Promise<LeadAttributionResponse> => {
    await new Promise((res) => setTimeout(res, 500));

    return {
      metrics: mockMetrics,
      leads: mockLeads,
      sourceBreakdown: mockSourceBreakdown,
      campaignAttribution: mockCampaignAttribution,
      funnel: mockFunnel,
    };
  };
