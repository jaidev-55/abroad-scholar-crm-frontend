import type React from "react";

export type {
  EnrolledStudent,
  EnrolledStats,
  EnrolledFilterOptions,
  EnrolledQuery,
  EnrollmentStage,
  VisaStatus,
  FeeStatus,
  CommissionStatus,
  DocumentStatus,
  FeePaymentStatus,
  PreDepartureCategory,
  EnrollmentRisk,
  EnrollmentActivity,
  VisaDetail,
  UpdateVisaDetailPayload,
  FeePayment,
  CreateFeePaymentPayload,
  UpdateFeePaymentPayload,
  EnrollmentDocument,
  UploadDocumentPayload,
  UpdateDocumentPayload,
  PreDepartureItem,
  PreDepartureResponse,
  CreatePreDeparturePayload,
  UpdatePreDeparturePayload,
  Commission,
  CommissionPayment,
  CreateCommissionPayload,
  UpdateCommissionPayload,
  RecordCommissionPaymentPayload,
  CreateEnrolledStudentPayload,
  UpdateEnrolledStudentPayload,
  EnrolledResponse,
} from "../api/ Enrolledapi";

// ─── UI-only filter state ─────────────────────────────────────
// Used by FilterBar and EnrolledStudentsPage

export interface EnrolledFilters {
  search: string;
  country: string;
  counselorId: string;
  visaStatus: string;
  stage: string;
  feeStatus: string;
}

// ─── UI-only select option ────────────────────────────────────
// Generic shape for CustomSelect options

export interface SelectOption {
  value: string;
  label: string;
}

export interface StageHistoryEntry {
  id: string;
  fromStage: string;
  toStage: string;
  type: "advance" | "revert" | "jump";
  note: string;
  timestamp: string;
  by: string;
}

export interface AdmissionStage {
  key: string;
  label: string;
  icon: React.ReactNode;
}
