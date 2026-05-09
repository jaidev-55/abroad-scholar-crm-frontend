import type { Dayjs } from "dayjs";
import type { IconType } from "react-icons";
import type { LeadCategory } from "../modules/leadsPipeline/api/leads";
import type { PipelineStatus } from "../modules/leadsPipeline/types/lead";

export interface FormValues {
  name: string;
  phone: string;
  email: string;
  stage: string;
  source: string;
  counselor: string;
  country: string;
  priority: string;
  followUp: Dayjs | null;
  ieltsScore: string;
  notes: string;
}

export type Priority = "Hot" | "Warm" | "Cold";

export interface Stage {
  id: string;
  label: string;
  color: string;
  bg: string;
  icon: IconType;
  borderColor: string;
  twText: string;
  twBg: string;
  twBorder: string;
}
export interface Note {
  id: string;
  text: string;
  createdAt: string;
  author: string;
}

export type DateRangeValue = [Dayjs | null, Dayjs | null] | null;

// Leads Pipeline
export type LeadStatus = "NEW" | "IN_PROGRESS" | "CONVERTED" | "LOST";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  stage: string;
  status: LeadStatus;
  source: string;
  counselor: string;
  country: string;
  priority: Priority;
  ieltsScore?: string | null;
  followUp?: string | null;
  createdAt: string;
  updatedAt?: string;
  notes: Note[];
  isOverdue?: boolean;
  category?: LeadCategory | null;
  pipelineStatus?: PipelineStatus | null;
}
