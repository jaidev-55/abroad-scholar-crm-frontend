import type { Dayjs } from "dayjs";
import type { ComponentType } from "react";
import type { IconBaseProps } from "react-icons";
export type CallStatus = "idle" | "calling" | "connected" | "logging" | "done";
export type CallOutcome =
  | "interested"
  | "not_interested"
  | "callback"
  | "no_answer"
  | "voicemail"
  | "converted";
export type CallRating = 1 | 2 | 3 | 4 | 5;

export interface CallLogEntry {
  id: string;
  date: string;
  duration: number;
  outcome: CallOutcome;
  notes: string;
  rating: CallRating | null;
  author: string;
  muted: boolean;
  speakerOn: boolean;
  followUpDate: string | null;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  country: string;
  counselor: string;
}

export interface CallModalProps {
  lead: Lead | null;
  onClose: () => void;
  onCallLogged?: (log: CallLogEntry) => void;
}

export interface CallLogFormValues {
  outcome: CallOutcome | "";
  notes: string;
  rating: CallRating | null;
  followUpDate: Dayjs | null;
}

export interface OutcomeConfig {
  label: string;
  Icon: ComponentType<IconBaseProps>;
  color: string;
  bg: string;
  border: string;
  badgeCls: string;
  ringCls: string;
  description: string;
  showFollowUp: boolean;
}
