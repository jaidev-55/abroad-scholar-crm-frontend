import type { ComponentType } from "react";
import type { IconBaseProps } from "react-icons";
import {
  RiAddLine,
  RiArrowRightLine,
  RiStickyNoteLine,
  RiPhoneFill,
  RiMailFill,
  RiPencilLine,
  RiCalendarLine,
  RiAlertLine,
  RiFireLine,
  RiFlashlightLine,
  RiSnowflakeLine,
} from "react-icons/ri";

import type { ActivityType } from "../types/Activity";
import { ACTIVITY_STYLE, PRIORITY_STYLE } from "./viewLeadConstants";

// Store icon component + size — rendered at call site, no ReactNode here
export type IconConfig = { Icon: ComponentType<IconBaseProps>; size: number };

export type ActivityConfigEntry = {
  Icon: ComponentType<IconBaseProps>;
  iconSize: number;
  color: string;
  bg: string;
  border: string;
  label: string;
};

// eslint-disable-next-line react-refresh/only-export-components
export const ACTIVITY_CONFIG: Record<ActivityType, ActivityConfigEntry> = {
  created: { ...ACTIVITY_STYLE.created, Icon: RiAddLine, iconSize: 12 },
  stage_change: {
    ...ACTIVITY_STYLE.stage_change,
    Icon: RiArrowRightLine,
    iconSize: 12,
  },
  note_added: {
    ...ACTIVITY_STYLE.note_added,
    Icon: RiStickyNoteLine,
    iconSize: 12,
  },
  call: { ...ACTIVITY_STYLE.call, Icon: RiPhoneFill, iconSize: 12 },
  email: { ...ACTIVITY_STYLE.email, Icon: RiMailFill, iconSize: 12 },
  edit: { ...ACTIVITY_STYLE.edit, Icon: RiPencilLine, iconSize: 12 },
  followup_set: {
    ...ACTIVITY_STYLE.followup_set,
    Icon: RiCalendarLine,
    iconSize: 12,
  },
  overdue: { ...ACTIVITY_STYLE.overdue, Icon: RiAlertLine, iconSize: 12 },
};

export type PriorityConfigEntry = {
  Icon: ComponentType<IconBaseProps>;
  iconSize: number;
  color: string;
  bg: string;
  border: string;
};

// eslint-disable-next-line react-refresh/only-export-components
export const PRIORITY_CONFIG: Record<string, PriorityConfigEntry> = {
  Hot: { ...PRIORITY_STYLE.Hot, Icon: RiFireLine, iconSize: 12 },
  Warm: { ...PRIORITY_STYLE.Warm, Icon: RiFlashlightLine, iconSize: 12 },
  Cold: { ...PRIORITY_STYLE.Cold, Icon: RiSnowflakeLine, iconSize: 12 },
};

export const TABS = [
  { key: "notes", label: "Notes", Icon: RiStickyNoteLine, iconSize: 13 },
  { key: "details", label: "Details", Icon: RiPencilLine, iconSize: 13 },
  { key: "activity", label: "Activity", Icon: RiArrowRightLine, iconSize: 13 },
] as const;

// eslint-disable-next-line react-refresh/only-export-components
export const FILTER_TYPES: {
  key: ActivityType | "all";
  label: string;
  Icon: ComponentType<IconBaseProps> | null;
  iconSize: number;
}[] = [
  { key: "all", label: "All", Icon: null, iconSize: 10 },
  {
    key: "stage_change",
    label: "Stages",
    Icon: RiArrowRightLine,
    iconSize: 10,
  },
  { key: "note_added", label: "Notes", Icon: RiStickyNoteLine, iconSize: 10 },
  { key: "call", label: "Calls", Icon: RiPhoneFill, iconSize: 10 },
  { key: "email", label: "Emails", Icon: RiMailFill, iconSize: 10 },
  { key: "edit", label: "Edits", Icon: RiPencilLine, iconSize: 10 },
];
