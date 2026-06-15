import {
  RiCheckLine,
  RiFileTextLine,
  RiAwardLine,
  RiMoneyDollarCircleLine,
  RiFileShield2Line,
  RiPassportLine,
  RiShieldCheckLine,
  RiFlightTakeoffLine,
} from "react-icons/ri";
import type { AdmissionStage } from "../Types";

// eslint-disable-next-line react-refresh/only-export-components
export const ADMISSION_STAGES: AdmissionStage[] = [
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

export const COUNSELORS = [
  "Priya Sharma",
  "Arjun Patel",
  "Sarah Khan",
  "Rohan Mehta",
  "Anita Desai",
] as const;

export const COUNTRIES = [
  "🇬🇧 UK",
  "🇨🇦 Canada",
  "🇺🇸 USA",
  "🇦🇺 Australia",
  "🇩🇪 Germany",
  "🇮🇪 Ireland",
  "🇳🇿 New Zealand",
] as const;
