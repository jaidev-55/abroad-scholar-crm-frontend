import axiosInstance from "../../../utils/axiosInstance";

export type NotifItem = {
  id: string;
  type: "followup" | "new_lead" | "overdue" | "hot";
  title: string;
  subtitle: string;
  time: string;
  read: boolean;
  leadId?: string;
  priority: "high" | "medium" | "low";
};
export const getNotifications = async (): Promise<NotifItem[]> =>
  (await axiosInstance.get<NotifItem[]>("/notifications")).data;
