import type { AlertsResponse } from "../types";
import {
  mockStats,
  mockRules,
  mockLogs,
  mockTemplates,
} from "../utils/alertsHelpers";

export const getAlerts = async (): Promise<AlertsResponse> => {
  await new Promise((res) => setTimeout(res, 400));
  return {
    stats: mockStats,
    rules: mockRules,
    logs: mockLogs,
    templates: mockTemplates,
  };
};
