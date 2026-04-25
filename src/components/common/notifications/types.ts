export interface Notif {
  id: string;
  type: "followup" | "new_lead" | "overdue" | "hot";
  title: string;
  subtitle: string;
  time: string;
  read: boolean;
  leadId?: string;
  priority: "high" | "medium" | "low";
}
