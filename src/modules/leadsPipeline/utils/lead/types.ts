import type { Dayjs } from "dayjs";

export type StepKey = 1 | 2 | 3;

export interface FormValues {
  name: string;
  phone: string;
  email: string;
  country: string;
  source: string;
  stage: string;
  priority: "Hot" | "Warm" | "Cold";
  counselor: string;
  followUp: Dayjs | null;
  ieltsScore: string;
}
