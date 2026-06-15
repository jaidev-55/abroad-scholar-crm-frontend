export interface Notif {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  time: string;
  priority: "high" | "medium" | "low";
  leadId?: string;
  studentId?: string;
  read: boolean;
}
