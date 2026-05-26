import type { SyncLogResponse } from "../types/Index";
import { mockStats, mockLogs, mockFormHealth, mockVolume } from "../utils/Syncloghelpers";


export const getSyncLog = async (): Promise<SyncLogResponse> => {
  await new Promise((res) => setTimeout(res, 400));
  return {
    stats: mockStats,
    logs: mockLogs,
    formHealth: mockFormHealth,
    volume: mockVolume,
  };
};
