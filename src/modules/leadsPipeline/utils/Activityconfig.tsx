import {
  RiSparklingLine,
  RiArrowRightLine,
  RiStickyNoteLine,
  RiPhoneFill,
  RiMailFill,
  RiPencilLine,
  RiCalendarLine,
  RiAlertLine,
} from "react-icons/ri";
import type { ActivityConfig, ActivityType } from "../types/Activity";

export const ACTIVITY_CONFIG: Record<ActivityType, ActivityConfig> = {
  created: {
    icon: <RiSparklingLine size={11} />,
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
    label: "Created",
  },
  stage_change: {
    icon: <RiArrowRightLine size={11} />,
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    label: "Stage Changed",
  },
  note_added: {
    icon: <RiStickyNoteLine size={11} />,
    color: "#0891b2",
    bg: "#ecfeff",
    border: "#a5f3fc",
    label: "Note",
  },
  call: {
    icon: <RiPhoneFill size={11} />,
    color: "#059669",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    label: "Call",
  },
  email: {
    icon: <RiMailFill size={11} />,
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    label: "Email",
  },
  edit: {
    icon: <RiPencilLine size={11} />,
    color: "#475569",
    bg: "#f8fafc",
    border: "#e2e8f0",
    label: "Edit",
  },
  followup_set: {
    icon: <RiCalendarLine size={11} />,
    color: "#db2777",
    bg: "#fdf2f8",
    border: "#fbcfe8",
    label: "Follow-up",
  },
  overdue: {
    icon: <RiAlertLine size={11} />,
    color: "#ef4444",
    bg: "#fff5f5",
    border: "#fed7d7",
    label: "Overdue",
  },
};
