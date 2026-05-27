import type { SettingsResponse } from "../types";
import { mockSettings } from "../utils/Settingshelpers";


export const getSettings = async (): Promise<SettingsResponse> => {
  await new Promise((res) => setTimeout(res, 400));
  return mockSettings;
};
