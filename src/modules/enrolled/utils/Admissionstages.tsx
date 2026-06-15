import {
  RiCheckLine,
  RiFileTextLine,
  RiAwardLine,
  RiMoneyDollarCircleLine,
  RiFileShield2Line,
  RiPassportLine,
  RiShieldCheckLine,
  RiFlightTakeoffLine,
  RiBuilding2Line,
  RiUserLine,
  RiFileList3Line,
} from "react-icons/ri";
import type { AdmissionStage } from "../Types";

export const COUNTRY_STAGES: Record<string, AdmissionStage[]> = {
  // ─── United Kingdom ────────────────────────────────────────
  "🇬🇧 UK": [
    {
      key: "converted",
      label: "Lead Converted",
      icon: <RiCheckLine size={14} />,
    },
    {
      key: "submitted",
      label: "Application Submitted",
      icon: <RiFileTextLine size={14} />,
    },
    { key: "offer", label: "Offer Received", icon: <RiAwardLine size={14} /> },
    {
      key: "fee_paid",
      label: "Fee Paid",
      icon: <RiMoneyDollarCircleLine size={14} />,
    },
    {
      key: "cas_issued",
      label: "CAS Issued",
      icon: <RiFileShield2Line size={14} />,
    },
    {
      key: "visa_filed",
      label: "Visa Filed",
      icon: <RiPassportLine size={14} />,
    },
    {
      key: "visa_approved",
      label: "Visa Approved",
      icon: <RiShieldCheckLine size={14} />,
    },
    {
      key: "travel_done",
      label: "Travel Done",
      icon: <RiFlightTakeoffLine size={14} />,
    },
  ],

  // ─── United States ─────────────────────────────────────────
  "🇺🇸 USA": [
    {
      key: "converted",
      label: "Lead Converted",
      icon: <RiCheckLine size={14} />,
    },
    {
      key: "submitted",
      label: "Application Submitted",
      icon: <RiFileTextLine size={14} />,
    },
    {
      key: "offer",
      label: "Admission Letter",
      icon: <RiAwardLine size={14} />,
    },
    {
      key: "i20_issued",
      label: "I-20 Issued",
      icon: <RiFileShield2Line size={14} />,
    },
    {
      key: "sevis_paid",
      label: "SEVIS Fee Paid",
      icon: <RiMoneyDollarCircleLine size={14} />,
    },
    {
      key: "visa_interview",
      label: "Visa Interview",
      icon: <RiUserLine size={14} />,
    },
    {
      key: "visa_approved",
      label: "Visa Approved",
      icon: <RiShieldCheckLine size={14} />,
    },
    {
      key: "travel_done",
      label: "Travel Done",
      icon: <RiFlightTakeoffLine size={14} />,
    },
  ],

  // ─── Canada ────────────────────────────────────────────────
  "🇨🇦 Canada": [
    {
      key: "converted",
      label: "Lead Converted",
      icon: <RiCheckLine size={14} />,
    },
    {
      key: "submitted",
      label: "Application Submitted",
      icon: <RiFileTextLine size={14} />,
    },
    { key: "offer", label: "LOA Received", icon: <RiAwardLine size={14} /> },
    {
      key: "fee_paid",
      label: "Tuition Paid",
      icon: <RiMoneyDollarCircleLine size={14} />,
    },
    {
      key: "caq_received",
      label: "CAQ Received",
      icon: <RiFileList3Line size={14} />,
    },
    {
      key: "study_permit",
      label: "Study Permit Filed",
      icon: <RiPassportLine size={14} />,
    },
    {
      key: "permit_approved",
      label: "Permit Approved",
      icon: <RiShieldCheckLine size={14} />,
    },
    {
      key: "travel_done",
      label: "Travel Done",
      icon: <RiFlightTakeoffLine size={14} />,
    },
  ],

  // ─── Australia ─────────────────────────────────────────────
  "🇦🇺 Australia": [
    {
      key: "converted",
      label: "Lead Converted",
      icon: <RiCheckLine size={14} />,
    },
    {
      key: "submitted",
      label: "Application Submitted",
      icon: <RiFileTextLine size={14} />,
    },
    { key: "offer", label: "Offer Letter", icon: <RiAwardLine size={14} /> },
    {
      key: "coe_issued",
      label: "CoE Issued",
      icon: <RiFileShield2Line size={14} />,
    },
    {
      key: "fee_paid",
      label: "Fee Paid",
      icon: <RiMoneyDollarCircleLine size={14} />,
    },
    {
      key: "oshc",
      label: "OSHC Purchased",
      icon: <RiShieldCheckLine size={14} />,
    },
    {
      key: "visa_filed",
      label: "Visa Lodged",
      icon: <RiPassportLine size={14} />,
    },
    {
      key: "visa_granted",
      label: "Visa Granted",
      icon: <RiShieldCheckLine size={14} />,
    },
    {
      key: "travel_done",
      label: "Travel Done",
      icon: <RiFlightTakeoffLine size={14} />,
    },
  ],

  // ─── Germany ───────────────────────────────────────────────
  "🇩🇪 Germany": [
    {
      key: "converted",
      label: "Lead Converted",
      icon: <RiCheckLine size={14} />,
    },
    {
      key: "uni_assist",
      label: "uni-assist Submitted",
      icon: <RiBuilding2Line size={14} />,
    },
    {
      key: "offer",
      label: "Admission Letter",
      icon: <RiAwardLine size={14} />,
    },
    {
      key: "blocked_account",
      label: "Blocked Account",
      icon: <RiMoneyDollarCircleLine size={14} />,
    },
    {
      key: "aps_cleared",
      label: "APS Cleared",
      icon: <RiFileShield2Line size={14} />,
    },
    {
      key: "visa_filed",
      label: "Visa Filed",
      icon: <RiPassportLine size={14} />,
    },
    {
      key: "visa_approved",
      label: "Visa Approved",
      icon: <RiShieldCheckLine size={14} />,
    },
    {
      key: "travel_done",
      label: "Travel Done",
      icon: <RiFlightTakeoffLine size={14} />,
    },
  ],

  // ─── Ireland ───────────────────────────────────────────────
  "🇮🇪 Ireland": [
    {
      key: "converted",
      label: "Lead Converted",
      icon: <RiCheckLine size={14} />,
    },
    {
      key: "submitted",
      label: "Application Submitted",
      icon: <RiFileTextLine size={14} />,
    },
    { key: "offer", label: "Offer Received", icon: <RiAwardLine size={14} /> },
    {
      key: "fee_paid",
      label: "Fee Paid",
      icon: <RiMoneyDollarCircleLine size={14} />,
    },
    {
      key: "visa_filed",
      label: "Visa Filed",
      icon: <RiPassportLine size={14} />,
    },
    {
      key: "visa_approved",
      label: "Visa Approved",
      icon: <RiShieldCheckLine size={14} />,
    },
    {
      key: "gnib",
      label: "GNIB/IRP Registered",
      icon: <RiFileList3Line size={14} />,
    },
    {
      key: "travel_done",
      label: "Travel Done",
      icon: <RiFlightTakeoffLine size={14} />,
    },
  ],

  // ─── New Zealand ───────────────────────────────────────────
  "🇳🇿 New Zealand": [
    {
      key: "converted",
      label: "Lead Converted",
      icon: <RiCheckLine size={14} />,
    },
    {
      key: "submitted",
      label: "Application Submitted",
      icon: <RiFileTextLine size={14} />,
    },
    { key: "offer", label: "Offer of Place", icon: <RiAwardLine size={14} /> },
    {
      key: "fee_paid",
      label: "Fee Paid",
      icon: <RiMoneyDollarCircleLine size={14} />,
    },
    {
      key: "visa_filed",
      label: "Student Visa Filed",
      icon: <RiPassportLine size={14} />,
    },
    {
      key: "visa_approved",
      label: "Visa Approved",
      icon: <RiShieldCheckLine size={14} />,
    },
    {
      key: "travel_done",
      label: "Travel Done",
      icon: <RiFlightTakeoffLine size={14} />,
    },
  ],
};

// ─── Fallback (generic) ──────────────────────────────────────
export const DEFAULT_STAGES: AdmissionStage[] = [
  {
    key: "converted",
    label: "Lead Converted",
    icon: <RiCheckLine size={14} />,
  },
  {
    key: "submitted",
    label: "Application Submitted",
    icon: <RiFileTextLine size={14} />,
  },
  { key: "offer", label: "Offer Received", icon: <RiAwardLine size={14} /> },
  {
    key: "fee_paid",
    label: "Fee Paid",
    icon: <RiMoneyDollarCircleLine size={14} />,
  },
  {
    key: "cas_issued",
    label: "CAS/I-20 Issued",
    icon: <RiFileShield2Line size={14} />,
  },
  {
    key: "visa_filed",
    label: "Visa Filed",
    icon: <RiPassportLine size={14} />,
  },
  {
    key: "visa_approved",
    label: "Visa Approved",
    icon: <RiShieldCheckLine size={14} />,
  },
  {
    key: "travel_done",
    label: "Travel Done",
    icon: <RiFlightTakeoffLine size={14} />,
  },
];

// ─── Helper ──────────────────────────────────────────────────
export const getStagesForCountry = (country: string): AdmissionStage[] => {
  return COUNTRY_STAGES[country] || DEFAULT_STAGES;
};
