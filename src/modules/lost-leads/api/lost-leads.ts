import axiosInstance from "../../../utils/axiosInstance";
import type { ReactivateLeadPayload } from "../types";

export const getLostLeads = async (query = {}) => {
  const { data } = await axiosInstance.get("/lost-leads", { params: query });
  return data;
};

export const getLostLeadsStats = async () => {
  const { data } = await axiosInstance.get("/lost-leads/stats");
  return data;
};

export const reactivateLead = async (
  leadId: string,
  payload: ReactivateLeadPayload,
) => {
  const { data } = await axiosInstance.post(
    `/lost-leads/${leadId}/reactivate`,
    payload,
  );
  return data;
};


