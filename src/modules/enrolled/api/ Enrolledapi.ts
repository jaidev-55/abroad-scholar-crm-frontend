import axiosInstance from "../../../utils/axiosInstance";

export type EnrollmentStage =
  | "LEAD_CONVERTED"
  | "APPLICATION_SUBMITTED"
  | "OFFER_RECEIVED"
  | "FEE_PAID"
  | "CAS_I20_ISSUED"
  | "VISA_FILED"
  | "VISA_APPROVED"
  | "TRAVEL_DONE";

export type VisaStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "APPROVED"
  | "REJECTED";

export type FeeStatus = "PENDING" | "PARTIAL" | "PAID";

export type CommissionStatus = "PENDING" | "PARTIAL" | "PAID";

export type DocumentStatus = "PENDING" | "VERIFIED" | "REJECTED";

export type FeePaymentStatus = "PENDING" | "PAID" | "OVERDUE";

export type PreDepartureCategory =
  | "TRAVEL"
  | "ACCOMMODATION"
  | "FINANCE"
  | "DOCUMENTS"
  | "HEALTH"
  | "OTHER";

// ─── Core Interfaces ──────────────────────────────────────────

export interface EnrolledStudent {
  id: string;
  studentId: string;
  fullName: string;
  phone: string;
  email: string;
  source?: string;
  ieltsScore?: number;
  country: string;
  university: string;
  course: string;
  intakeDate: string;
  stage: EnrollmentStage;
  counselorId?: string;
  counselor?: { id: string; name: string; email?: string };
  totalFee: number;
  feePaid: number;
  feeStatus: FeeStatus;
  feeCurrency: string;
  visaStatus: VisaStatus;
  visaAppDate?: string;
  visaDecDate?: string;
  casRef?: string;
  travelDate?: string;
  travelReady: boolean;
  notes?: string;
  leadId?: string;
  risks: EnrollmentRisk[];
  // Relations (present on detail endpoint)
  feePayments?: FeePayment[];
  visaDetail?: VisaDetail;
  documents?: EnrollmentDocument[];
  preDeparture?: PreDepartureItem[];
  commission?: Commission | null;
  activities?: EnrollmentActivity[];
  // Derived fields from API
  feePercent?: number;
  riskCount?: number;
  daysToIntake?: number;
  checklistPercent?: number;
  commissionPending?: number;
  createdAt: string;
  updatedAt: string;
}

export interface EnrollmentRisk {
  id: string;
  type: string;
  message: string;
  isResolved: boolean;
  resolvedAt?: string;
  studentId: string;
  createdAt: string;
}

export interface EnrollmentActivity {
  id: string;
  type: string;
  message: string;
  studentId: string;
  userId?: string;
  user?: { id: string; name: string };
  meta?: Record<string, unknown>;
  createdAt: string;
}

// ─── Visa ─────────────────────────────────────────────────────

export interface VisaDetail {
  id: string;
  studentId: string;
  passportNumber?: string;
  passportExpiry?: string;
  visaType?: string;
  visaStatus?: VisaStatus;
  filingDate?: string;
  biometricDate?: string;
  interviewDate?: string;
  decisionDate?: string;
}

export interface UpdateVisaDetailPayload {
  passportNumber?: string;
  passportExpiry?: string;
  visaType?: string;
  visaStatus?: VisaStatus;
  filingDate?: string;
  biometricDate?: string;
  interviewDate?: string;
  decisionDate?: string;
  casRef?: string;
}

// ─── Fee Payments ─────────────────────────────────────────────

export interface FeePayment {
  id: string;
  studentId: string;
  type: string;
  amount: number;
  dueDate?: string;
  paidDate?: string;
  status: FeePaymentStatus;
  paymentMode?: string;
  notes?: string;
  createdAt: string;
}

export interface CreateFeePaymentPayload {
  type: string;
  amount: number;
  dueDate?: string;
  status?: FeePaymentStatus;
  paymentMode?: string;
  notes?: string;
}

export interface UpdateFeePaymentPayload {
  type?: string;
  amount?: number;
  dueDate?: string;
  paidDate?: string;
  status?: FeePaymentStatus;
  paymentMode?: string;
  notes?: string;
}

// ─── Documents ────────────────────────────────────────────────

export interface EnrollmentDocument {
  id: string;
  studentId: string;
  name: string;
  fileUrl: string;
  fileType: string;
  status: DocumentStatus;
  expiryDate?: string;
  notes?: string;
  uploadedAt: string;
}

export interface UploadDocumentPayload {
  name: string;
  fileUrl: string;
  fileType: string;
  expiryDate?: string;
  notes?: string;
}

export interface UpdateDocumentPayload {
  name?: string;
  status?: DocumentStatus;
  expiryDate?: string;
  notes?: string;
}

// ─── Pre-Departure ────────────────────────────────────────────

export interface PreDepartureItem {
  id: string;
  studentId: string;
  taskName: string;
  category: PreDepartureCategory;
  isCompleted: boolean;
  completedAt?: string;
  attachmentUrl?: string;
  notes?: string;
  createdAt: string;
}

export interface PreDepartureResponse {
  items: PreDepartureItem[];
  total: number;
  completed: number;
  percent: number;
}

export interface CreatePreDeparturePayload {
  taskName: string;
  category: PreDepartureCategory;
  notes?: string;
}

export interface UpdatePreDeparturePayload {
  taskName?: string;
  category?: PreDepartureCategory;
  isCompleted?: boolean;
  attachmentUrl?: string;
  notes?: string;
}

// ─── Commission ───────────────────────────────────────────────

export interface CommissionPayment {
  id: string;
  commissionId: string;
  amount: number;
  notes?: string;
  createdAt: string;
}

export interface Commission {
  id: string;
  studentId: string;
  universityRate: number;
  subAgentRate: number;
  expectedAmount: number;
  receivedAmount: number;
  status: CommissionStatus;
  agreementUrl?: string;
  notes?: string;
  payments: CommissionPayment[];
  pendingAmount: number;
}

export interface CreateCommissionPayload {
  universityRate: number;
  subAgentRate?: number;
  expectedAmount: number;
  receivedAmount?: number;
  notes?: string;
}

export interface UpdateCommissionPayload {
  universityRate?: number;
  subAgentRate?: number;
  expectedAmount?: number;
  status?: CommissionStatus;
  agreementUrl?: string;
  notes?: string;
}

export interface RecordCommissionPaymentPayload {
  amount: number;
  notes?: string;
}

// ─── Stats & Filters ──────────────────────────────────────────

export interface EnrolledStats {
  totalEnrolled: number;
  visaApproved: number;
  visaInProgress: number;
  visaNotStarted: number;
  feePaid: number;
  feePending: number;
  travelReady: number;
  atRisk: number;
}

export interface EnrolledFilterOptions {
  countries: string[];
  counselors: { id: string; name: string }[];
  visaStatuses: VisaStatus[];
  stages: EnrollmentStage[];
  feeStatuses: FeeStatus[];
}

export interface EnrolledQuery {
  search?: string;
  country?: string;
  counselorId?: string;
  visaStatus?: VisaStatus;
  stage?: EnrollmentStage;
  feeStatus?: FeeStatus;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface EnrolledResponse {
  data: EnrolledStudent[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ─── Create / Update Student ──────────────────────────────────

export interface CreateEnrolledStudentPayload {
  fullName: string;
  phone: string;
  email: string;
  source?: string;
  ieltsScore?: number;
  country: string;
  university: string;
  course: string;
  intakeDate: string;
  counselorId?: string;
  totalFee?: number;
  feePaid?: number;
  feeStatus?: FeeStatus;
  feeCurrency?: string;
  visaStatus?: VisaStatus;
  visaAppDate?: string;
  casRef?: string;
  notes?: string;
  leadId?: string;
}

export interface UpdateEnrolledStudentPayload {
  fullName?: string;
  phone?: string;
  email?: string;
  source?: string;
  ieltsScore?: number;
  country?: string;
  university?: string;
  course?: string;
  intakeDate?: string;
  counselorId?: string;
  stage?: EnrollmentStage;
  totalFee?: number;
  feePaid?: number;
  feeCurrency?: string;
  visaStatus?: VisaStatus;
  visaAppDate?: string;
  visaDecDate?: string;
  casRef?: string;
  travelDate?: string;
  travelReady?: boolean;
  notes?: string;
}

// ─── API Functions ────────────────────────────────────────────

// Stats
export const getEnrolledStats = async (): Promise<EnrolledStats> => {
  const { data } = await axiosInstance.get("/enrolled/stats");
  return data;
};

// Filter options
export const getEnrolledFilterOptions =
  async (): Promise<EnrolledFilterOptions> => {
    const { data } = await axiosInstance.get("/enrolled/filters");
    return data;
  };

// List all with filters, search, pagination
export const getEnrolledList = async (
  query: EnrolledQuery = {},
): Promise<EnrolledResponse> => {
  const { data } = await axiosInstance.get("/enrolled", { params: query });
  return data;
};

// Get single student (full detail with all relations)
export const getEnrolledById = async (id: string): Promise<EnrolledStudent> => {
  const { data } = await axiosInstance.get(`/enrolled/${id}`);
  return data;
};

// ── CREATE (direct — no lead) ─────────────────────────────────
export const createEnrolledStudent = async (
  payload: CreateEnrolledStudentPayload,
): Promise<EnrolledStudent> => {
  const { data } = await axiosInstance.post("/enrolled", payload);
  return data;
};

// ── ENROLL FROM LEAD ──────────────────────────────────────────
export const enrollFromLead = async (
  leadId: string,
  payload: Partial<CreateEnrolledStudentPayload>,
): Promise<EnrolledStudent> => {
  const { data } = await axiosInstance.post(
    `/enrolled/from-lead/${leadId}`,
    payload,
  );
  return data;
};

// ── UPDATE ────────────────────────────────────────────────────
export const updateEnrolledStudent = async (
  id: string,
  payload: UpdateEnrolledStudentPayload,
): Promise<EnrolledStudent> => {
  const { data } = await axiosInstance.put(`/enrolled/${id}`, payload);
  return data;
};

// ── UPDATE STAGE ONLY ─────────────────────────────────────────
export const updateEnrolledStage = async (
  id: string,
  stage: EnrollmentStage,
  note?: string,
): Promise<EnrolledStudent> => {
  const { data } = await axiosInstance.patch(`/enrolled/${id}/stage`, {
    stage,
    note,
  });
  return data;
};

// ── ADD NOTE ──────────────────────────────────────────────────
export const addEnrolledNote = async (
  id: string,
  message: string,
): Promise<EnrollmentActivity> => {
  const { data } = await axiosInstance.post(`/enrolled/${id}/notes`, {
    message,
  });
  return data;
};

// ── ACTIVITY TIMELINE ─────────────────────────────────────────
export const getEnrolledActivities = async (
  id: string,
  limit = 50,
): Promise<EnrollmentActivity[]> => {
  const { data } = await axiosInstance.get(`/enrolled/${id}/activities`, {
    params: { limit },
  });
  return data;
};

// ── RESOLVE RISK ──────────────────────────────────────────────
export const resolveEnrolledRisk = async (
  riskId: string,
): Promise<EnrollmentRisk> => {
  const { data } = await axiosInstance.patch(
    `/enrolled/risks/${riskId}/resolve`,
  );
  return data;
};

// ── DELETE ────────────────────────────────────────────────────
export const deleteEnrolledStudent = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/enrolled/${id}`);
};

// ── EXPORT ────────────────────────────────────────────────────
export const exportEnrolledStudents = async (): Promise<EnrolledStudent[]> => {
  const { data } = await axiosInstance.get("/enrolled/export");
  return data;
};

// ─── Visa API ─────────────────────────────────────────────────

export const getVisaDetail = async (
  studentId: string,
): Promise<VisaDetail | null> => {
  const { data } = await axiosInstance.get(`/enrolled/${studentId}/visa`);
  return data;
};

export const upsertVisaDetail = async (
  studentId: string,
  payload: UpdateVisaDetailPayload,
): Promise<VisaDetail> => {
  const { data } = await axiosInstance.put(
    `/enrolled/${studentId}/visa`,
    payload,
  );
  return data;
};

// ─── Fee Payments API ─────────────────────────────────────────

export const getFeePayments = async (
  studentId: string,
): Promise<FeePayment[]> => {
  const { data } = await axiosInstance.get(`/enrolled/${studentId}/fees`);
  return data;
};

export const createFeePayment = async (
  studentId: string,
  payload: CreateFeePaymentPayload,
): Promise<FeePayment> => {
  const { data } = await axiosInstance.post(
    `/enrolled/${studentId}/fees`,
    payload,
  );
  return data;
};

export const updateFeePayment = async (
  studentId: string,
  feeId: string,
  payload: UpdateFeePaymentPayload,
): Promise<FeePayment> => {
  const { data } = await axiosInstance.put(
    `/enrolled/${studentId}/fees/${feeId}`,
    payload,
  );
  return data;
};

export const deleteFeePayment = async (
  studentId: string,
  feeId: string,
): Promise<void> => {
  await axiosInstance.delete(`/enrolled/${studentId}/fees/${feeId}`);
};

// ─── Documents API ────────────────────────────────────────────

export const getDocuments = async (
  studentId: string,
): Promise<EnrollmentDocument[]> => {
  const { data } = await axiosInstance.get(`/enrolled/${studentId}/documents`);
  return data;
};

export const createDocument = async (
  studentId: string,
  payload: UploadDocumentPayload,
): Promise<EnrollmentDocument> => {
  const { data } = await axiosInstance.post(
    `/enrolled/${studentId}/documents`,
    payload,
  );
  return data;
};

export const updateDocument = async (
  studentId: string,
  docId: string,
  payload: UpdateDocumentPayload,
): Promise<EnrollmentDocument> => {
  const { data } = await axiosInstance.put(
    `/enrolled/${studentId}/documents/${docId}`,
    payload,
  );
  return data;
};

export const deleteDocument = async (
  studentId: string,
  docId: string,
): Promise<void> => {
  await axiosInstance.delete(`/enrolled/${studentId}/documents/${docId}`);
};

// ─── Pre-Departure API ────────────────────────────────────────

export const getPreDeparture = async (
  studentId: string,
): Promise<PreDepartureResponse> => {
  const { data } = await axiosInstance.get(
    `/enrolled/${studentId}/pre-departure`,
  );
  return data;
};

export const createPreDepartureItem = async (
  studentId: string,
  payload: CreatePreDeparturePayload,
): Promise<PreDepartureItem> => {
  const { data } = await axiosInstance.post(
    `/enrolled/${studentId}/pre-departure`,
    payload,
  );
  return data;
};

export const updatePreDepartureItem = async (
  studentId: string,
  itemId: string,
  payload: UpdatePreDeparturePayload,
): Promise<PreDepartureItem> => {
  const { data } = await axiosInstance.patch(
    `/enrolled/${studentId}/pre-departure/${itemId}`,
    payload,
  );
  return data;
};

export const togglePreDepartureItem = async (
  studentId: string,
  itemId: string,
): Promise<PreDepartureItem> => {
  const { data } = await axiosInstance.patch(
    `/enrolled/${studentId}/pre-departure/${itemId}/toggle`,
  );
  return data;
};

export const deletePreDepartureItem = async (
  studentId: string,
  itemId: string,
): Promise<void> => {
  await axiosInstance.delete(`/enrolled/${studentId}/pre-departure/${itemId}`);
};

// ─── Commission API ───────────────────────────────────────────

export const getCommission = async (
  studentId: string,
): Promise<Commission | null> => {
  const { data } = await axiosInstance.get(`/enrolled/${studentId}/commission`);
  return data;
};

export const createCommission = async (
  studentId: string,
  payload: CreateCommissionPayload,
): Promise<Commission> => {
  const { data } = await axiosInstance.post(
    `/enrolled/${studentId}/commission`,
    payload,
  );
  return data;
};

export const updateCommission = async (
  studentId: string,
  payload: UpdateCommissionPayload,
): Promise<Commission> => {
  const { data } = await axiosInstance.put(
    `/enrolled/${studentId}/commission`,
    payload,
  );
  return data;
};

export const recordCommissionPayment = async (
  studentId: string,
  payload: RecordCommissionPaymentPayload,
): Promise<{
  payment: CommissionPayment;
  receivedAmount: number;
  pendingAmount: number;
  status: CommissionStatus;
}> => {
  const { data } = await axiosInstance.post(
    `/enrolled/${studentId}/commission/payment`,
    payload,
  );
  return data;
};
