import axiosInstance from "../../../utils/axiosInstance";


export interface IeltsRecord {
  id: string;
  studentName: string;
  country?: string;
  examType: "ACADEMIC" | "GENERAL";
  status: "NOT_STARTED" | "PREPARING" | "SCHEDULED" | "COMPLETED" | "CANCELLED";
  examDate?: string;
  registrationId?: string;
  targetUniversity?: string;
  counselorId?: string;
  counselor?: { id: string; name: string };
  requiredScore?: number;
  targetL?: number;
  targetR?: number;
  targetW?: number;
  targetS?: number;
  targetOA?: number;
  currentL?: number;
  currentR?: number;
  currentW?: number;
  currentS?: number;
  currentOA?: number;
  notes?: string;
  attempts: number;
  scoreHistory: IeltsScoreHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface IeltsScoreHistory {
  id: string;
  trackingId: string;
  listening?: number;
  reading?: number;
  writing?: number;
  speaking?: number;
  overall?: number;
  testType: "OFFICIAL_EXAM" | "MOCK_TEST" | "PRACTICE";
  notes?: string;
  createdAt: string;
}

export interface IeltsStats {
  total: number;
  preparing: number;
  scheduled: number;
  completed: number;
  notStarted: number;
  upcomingExams: number;
  avgScore: number;
  targetMet: number;
}

export interface IeltsQuery {
  search?: string;
  status?: string;
  examType?: string;
  counselorId?: string;
  page?: number;
  limit?: number;
}

export interface IeltsResponse {
  data: IeltsRecord[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateIeltsPayload {
  studentName: string;
  country?: string;
  examType: "ACADEMIC" | "GENERAL";
  status?: string;
  examDate?: string;
  registrationId?: string;
  targetUniversity?: string;
  counselorId?: string;
  requiredScore?: number;
  targetL?: number;
  targetR?: number;
  targetW?: number;
  targetS?: number;
  targetOA?: number;
  notes?: string;
}

export interface UpdateScoresPayload {
  listening?: number;
  reading?: number;
  writing?: number;
  speaking?: number;
  testType?: "OFFICIAL_EXAM" | "MOCK_TEST" | "PRACTICE";
  notes?: string;
}

// ─── API Functions ────────────────────────────────────────────

export const getIeltsStats = async (): Promise<IeltsStats> => {
  const { data } = await axiosInstance.get("/ielts/stats");
  return data;
};

export const getIeltsList = async (
  query: IeltsQuery = {},
): Promise<IeltsResponse> => {
  const { data } = await axiosInstance.get("/ielts", { params: query });
  return data;
};

export const getIeltsById = async (id: string): Promise<IeltsRecord> => {
  const { data } = await axiosInstance.get(`/ielts/${id}`);
  return data;
};

export const createIelts = async (
  payload: CreateIeltsPayload,
): Promise<IeltsRecord> => {
  const { data } = await axiosInstance.post("/ielts", payload);
  return data;
};

export const updateIelts = async (
  id: string,
  payload: CreateIeltsPayload,
): Promise<IeltsRecord> => {
  const { data } = await axiosInstance.put(`/ielts/${id}`, payload);
  return data;
};

export const updateIeltsScores = async (
  id: string,
  payload: UpdateScoresPayload,
): Promise<IeltsRecord> => {
  const { data } = await axiosInstance.patch(`/ielts/${id}/scores`, payload);
  return data;
};

export const deleteIelts = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/ielts/${id}`);
};
