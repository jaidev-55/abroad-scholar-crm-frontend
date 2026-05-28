export type IeltsStatus =
  | "NOT_STARTED"
  | "PREPARING"
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELLED";

export interface IeltsScore {
  listening: number | null;
  reading: number | null;
  writing: number | null;
  speaking: number | null;
  overall: number | null;
}

export interface IeltsTargetScore {
  listening: number;
  reading: number;
  writing: number;
  speaking: number;
  overall: number;
}

export interface IeltsRecord {
  id: string;
  studentId: string;
  studentName: string;
  country: string;
  counselor: string;
  status: IeltsStatus;
  examDate: string | null;
  examType: "Academic" | "General Training";
  targetScore: IeltsTargetScore;
  currentScore: IeltsScore | null;
  attempts: number;
  lastUpdated: string;
  notes: string;
  registrationId: string;
  preparationStartDate: string | null;
  university: string;
  requiredScore: number;
}

export interface IeltsFilters {
  search: string;
  status: string;
  counselor: string;
  country: string;
  examType: string;
}
export interface IeltsStatsData {
  totalStudents: number;
  preparing: number;
  scheduled: number;
  completed: number;
  avgOverallScore: number;
  targetMet: number;
  upcomingExams: number;
  notStarted: number;
}
