import type { ActivityMeta } from "./Viewlead";

//  Activity type union
export type ActivityType =
  | "created"
  | "stage_change"
  | "note_added"
  | "call"
  | "email"
  | "edit"
  | "followup_set"
  | "overdue";

//  Activity event shape
export interface ActivityEvent {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  author: string;
  timestamp: string;
  meta?: ActivityMeta;
}

export type ActivityConfig = {
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
  label: string;
};

//  Stage display map
export const STAGE_MAP: Record<
  string,
  { label: string; color: string; bg: string; border: string }
> = {
  new: { label: "New", color: "#3B82F6", bg: "#EFF6FF", border: "#BFDBFE" },
  progress: {
    label: "In Progress",
    color: "#8B5CF6",
    bg: "#F5F3FF",
    border: "#DDD6FE",
  },
  applied: {
    label: "Applied",
    color: "#F59E0B",
    bg: "#FFFBEB",
    border: "#FDE68A",
  },
  converted: {
    label: "Converted",
    color: "#10B981",
    bg: "#ECFDF5",
    border: "#A7F3D0",
  },
};

//  Priority display config
export const PRIORITY_CONFIG: Record<
  string,
  { icon: string; color: string; bg: string; border: string }
> = {
  Hot: { icon: "🔥", color: "#ef4444", bg: "#fff5f5", border: "#fed7d7" },
  Warm: { icon: "⚡", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
  Cold: { icon: "❄️", color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" },
};

//  API type → local ActivityType
export function mapApiType(type: string): ActivityType {
  const map: Record<string, ActivityType> = {
    EDIT: "edit",
    NOTE: "note_added",
    NOTE_ADDED: "note_added",
    STAGE_CHANGE: "stage_change",
    CALL: "call",
    EMAIL: "email",
    FOLLOWUP: "followup_set",
    FOLLOWUP_SET: "followup_set",
    CREATED: "created",
    OVERDUE: "overdue",
  };
  return map[type] ?? "edit";
}
