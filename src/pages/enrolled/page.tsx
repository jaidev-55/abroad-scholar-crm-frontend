import React, { useState, useMemo } from "react";
import {
  Table,
  Input,
  Select,
  Tooltip,
  ConfigProvider,
  Tabs,
  Drawer,
  Empty,
  Popover,
} from "antd";
import type { ColumnsType } from "antd/es/table";

import {
  RiUserLine,
  RiSearchLine,
  RiPhoneLine,
  RiCalendarLine,
  RiGlobalLine,
  RiAddLine,
  RiArrowRightLine,
  RiErrorWarningLine,
  RiUserSmileLine,
  RiFileTextLine,
  RiRefreshLine,
  RiDownloadLine,
  RiEyeLine,
  RiMailLine,
  RiCloseLine,
  RiCheckLine,
  RiTimeLine,
  RiMoneyDollarCircleLine,
  RiShieldCheckLine,
  RiFlightTakeoffLine,
  RiFolder3Line,
  RiChat3Line,
  RiAlertLine,
  RiBarChartLine,
  RiBuilding2Line,
  RiPassportLine,
  RiWhatsappLine,
  RiVideoChatLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiUploadCloud2Line,
  RiMapPinLine,
  RiGraduationCapLine,
  RiHandCoinLine,
  RiPercentLine,
  RiExchangeDollarLine,
  RiFileShield2Line,
  RiHome4Line,
  RiSimCard2Line,
  RiBusLine,
  RiHospitalLine,
  RiExchangeFundsLine,
  RiGroupLine,
  RiLineChartLine,
  RiAwardLine,
  RiSpeedLine,
  RiHashtag,
  RiContractLine,
} from "react-icons/ri";
import EnrollStudentModal from "../../components/common/EnrollStudentModal";

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface Document {
  id: string;
  name: string;
  type: string;
  status: "uploaded" | "pending" | "expired" | "verified";
  uploadedAt: string | null;
  expiryDate: string | null;
}

interface Payment {
  id: string;
  type: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "overdue";
  dueDate: string;
  paidDate: string | null;
  mode: string;
}

interface Communication {
  id: string;
  type: "call" | "whatsapp" | "email" | "meeting";
  summary: string;
  date: string;
  by: string;
}

interface VisaInfo {
  type: string;
  filingDate: string | null;
  biometricDate: string | null;
  interviewDate: string | null;
  status:
    | "not_started"
    | "filed"
    | "biometric_done"
    | "interview_done"
    | "approved"
    | "rejected";
  passportNumber: string;
  passportExpiry: string;
}

interface PreDepartureItem {
  id: string;
  label: string;
  completed: boolean;
  icon: React.ReactNode;
}

interface CommissionInfo {
  universityRate: number;
  subAgentRate: number;
  expectedAmount: number;
  receivedAmount: number;
  paymentStatus: "pending" | "partial" | "received";
  agreementUploaded: boolean;
}

interface EnrolledStudent {
  id: string;
  name: string;
  studentId: string;
  phone: string;
  email: string;
  country: string;
  university: string;
  course: string;
  intake: string;
  intakeDate: string;
  counselor: string;
  feePaid: number;
  feeTotal: number;
  visaStatus:
    | "not_started"
    | "filed"
    | "biometric_done"
    | "interview_done"
    | "approved"
    | "rejected";
  travelStatus: "not_booked" | "booked" | "departed";
  admissionStage: number;
  documents: Document[];
  payments: Payment[];
  communications: Communication[];
  visa: VisaInfo;
  preDeparture: PreDepartureItem[];
  commission: CommissionInfo;
  risks: string[];
  ieltsScore: string;
  photo?: string;
}

// ═══════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════

const ADMISSION_STAGES = [
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

const generateStudents = (): EnrolledStudent[] => {
  const students = [
    {
      name: "Aarav Mehta",
      country: "🇬🇧 UK",
      university: "University of Manchester",
      course: "MSc Data Science",
      counselor: "Priya Sharma",
    },
    {
      name: "Sneha Reddy",
      country: "🇨🇦 Canada",
      university: "University of Toronto",
      course: "MBA",
      counselor: "Arjun Patel",
    },
    {
      name: "Kunal Joshi",
      country: "🇺🇸 USA",
      university: "Boston University",
      course: "MS Computer Science",
      counselor: "Sarah Khan",
    },
    {
      name: "Ishita Gupta",
      country: "🇦🇺 Australia",
      university: "University of Melbourne",
      course: "MPhil Psychology",
      counselor: "Rohan Mehta",
    },
    {
      name: "Rahul Nair",
      country: "🇩🇪 Germany",
      university: "TU Munich",
      course: "MS Engineering",
      counselor: "Anita Desai",
    },
    {
      name: "Meera Iyer",
      country: "🇬🇧 UK",
      university: "UCL London",
      course: "MSc Finance",
      counselor: "Priya Sharma",
    },
    {
      name: "Vikram Singh",
      country: "🇮🇪 Ireland",
      university: "Trinity College Dublin",
      course: "MSc AI",
      counselor: "Arjun Patel",
    },
    {
      name: "Pooja Bhat",
      country: "🇨🇦 Canada",
      university: "McGill University",
      course: "MA Education",
      counselor: "Sarah Khan",
    },
    {
      name: "Aryan Kapoor",
      country: "🇺🇸 USA",
      university: "Columbia University",
      course: "MS Statistics",
      counselor: "Rohan Mehta",
    },
    {
      name: "Diya Sharma",
      country: "🇦🇺 Australia",
      university: "UNSW Sydney",
      course: "MBA International Business",
      counselor: "Anita Desai",
    },
    {
      name: "Karthik Rajan",
      country: "🇬🇧 UK",
      university: "Imperial College London",
      course: "MSc Machine Learning",
      counselor: "Priya Sharma",
    },
    {
      name: "Nisha Patel",
      country: "🇳🇿 New Zealand",
      university: "University of Auckland",
      course: "PGDip Marketing",
      counselor: "Arjun Patel",
    },
  ];

  return students.map((s, i) => {
    const stage = Math.min(Math.floor(Math.random() * 8), 7);
    const feeTotal = 15000 + Math.floor(Math.random() * 25000);
    const feePaid = stage >= 3 ? feeTotal : stage >= 2 ? feeTotal * 0.3 : 0;
    const intakeDate = new Date(2026, 8, 1 + Math.floor(Math.random() * 30));
    const visaStatuses: VisaInfo["status"][] = [
      "not_started",
      "filed",
      "biometric_done",
      "interview_done",
      "approved",
      "rejected",
    ];
    const visaIdx =
      stage >= 7 ? 4 : stage >= 6 ? 4 : stage >= 5 ? Math.min(stage - 4, 3) : 0;

    const docTypes = [
      { name: "Passport", type: "passport" },
      { name: "Offer Letter", type: "offer_letter" },
      { name: "CAS / I-20", type: "cas" },
      { name: "Fee Receipt", type: "fee_receipt" },
      { name: "SOP", type: "sop" },
      { name: "LOR", type: "lor" },
      { name: "Bank Statement", type: "bank_statement" },
      { name: "Visa Copy", type: "visa_copy" },
      { name: "Air Ticket", type: "air_ticket" },
    ];

    const riskPool = [
      "Visa rejection history",
      "Financial risk",
      "Low IELTS score",
      "Missing documents",
      "Payment overdue",
      "Passport expiring soon",
    ];

    return {
      id: `STU-${1000 + i}`,
      name: s.name,
      studentId: `STU-${1000 + i}`,
      phone: `+91 ${9000000000 + Math.floor(Math.random() * 999999999)}`,
      email: `${s.name.toLowerCase().replace(" ", ".")}@email.com`,
      country: s.country,
      university: s.university,
      course: s.course,
      intake: "Sep 2026",
      intakeDate: intakeDate.toISOString().split("T")[0],
      counselor: s.counselor,
      feePaid,
      feeTotal,
      visaStatus: visaStatuses[visaIdx],
      travelStatus:
        stage >= 7
          ? ("departed" as const)
          : stage >= 6
            ? ("booked" as const)
            : ("not_booked" as const),
      admissionStage: stage,
      ieltsScore: `${(5.5 + Math.random() * 2.5).toFixed(1)}`,
      documents: docTypes.map((d, di) => ({
        id: `doc-${i}-${di}`,
        name: d.name,
        type: d.type,
        status: (di <= stage + 1
          ? di <= stage
            ? "verified"
            : "uploaded"
          : "pending") as Document["status"],
        uploadedAt:
          di <= stage
            ? new Date(Date.now() - Math.random() * 30 * 86400000)
                .toISOString()
                .split("T")[0]
            : null,
        expiryDate:
          d.type === "passport"
            ? new Date(Date.now() + 365 * 86400000 * (1 + Math.random()))
                .toISOString()
                .split("T")[0]
            : null,
      })),
      payments: [
        {
          id: `pay-${i}-1`,
          type: "Tuition Fee",
          amount: feeTotal,
          currency: "USD",
          status:
            feePaid >= feeTotal ? ("paid" as const) : ("pending" as const),
          dueDate: new Date(Date.now() + 30 * 86400000)
            .toISOString()
            .split("T")[0],
          paidDate:
            feePaid >= feeTotal
              ? new Date(Date.now() - 10 * 86400000).toISOString().split("T")[0]
              : null,
          mode: "Bank Transfer",
        },
        {
          id: `pay-${i}-2`,
          type: "Initial Deposit",
          amount: Math.round(feeTotal * 0.15),
          currency: "USD",
          status:
            stage >= 2
              ? ("paid" as const)
              : stage >= 1
                ? ("pending" as const)
                : ("overdue" as const),
          dueDate: new Date(Date.now() - 5 * 86400000)
            .toISOString()
            .split("T")[0],
          paidDate:
            stage >= 2
              ? new Date(Date.now() - 20 * 86400000).toISOString().split("T")[0]
              : null,
          mode: "Online Payment",
        },
      ],
      communications: [
        {
          id: `comm-${i}-1`,
          type: "call" as const,
          summary: "Discussed admission progress and next steps",
          date: new Date(Date.now() - 2 * 86400000).toISOString(),
          by: s.counselor,
        },
        {
          id: `comm-${i}-2`,
          type: "whatsapp" as const,
          summary: "Sent document checklist and deadlines",
          date: new Date(Date.now() - 5 * 86400000).toISOString(),
          by: s.counselor,
        },
        {
          id: `comm-${i}-3`,
          type: "email" as const,
          summary: "Offer letter forwarded with acceptance instructions",
          date: new Date(Date.now() - 8 * 86400000).toISOString(),
          by: s.counselor,
        },
      ],
      visa: {
        type: s.country.includes("UK")
          ? "Tier 4"
          : s.country.includes("US")
            ? "F-1"
            : s.country.includes("Canada")
              ? "Study Permit"
              : "Student Visa",
        filingDate:
          stage >= 5
            ? new Date(Date.now() - 20 * 86400000).toISOString().split("T")[0]
            : null,
        biometricDate:
          stage >= 5
            ? new Date(Date.now() - 15 * 86400000).toISOString().split("T")[0]
            : null,
        interviewDate:
          stage >= 6
            ? new Date(Date.now() - 10 * 86400000).toISOString().split("T")[0]
            : null,
        status: visaStatuses[visaIdx],
        passportNumber: `P${Math.floor(Math.random() * 9000000 + 1000000)}`,
        passportExpiry: new Date(
          Date.now() + 365 * 86400000 * (1 + Math.random()),
        )
          .toISOString()
          .split("T")[0],
      },
      preDeparture: [
        {
          id: "pd-1",
          label: "Accommodation Booked",
          completed: stage >= 6,
          icon: <RiHome4Line size={14} />,
        },
        {
          id: "pd-2",
          label: "Forex Arranged",
          completed: stage >= 7,
          icon: <RiExchangeFundsLine size={14} />,
        },
        {
          id: "pd-3",
          label: "Insurance Purchased",
          completed: stage >= 6,
          icon: <RiHospitalLine size={14} />,
        },
        {
          id: "pd-4",
          label: "SIM Card Arranged",
          completed: stage >= 7,
          icon: <RiSimCard2Line size={14} />,
        },
        {
          id: "pd-5",
          label: "Airport Pickup Arranged",
          completed: stage >= 7,
          icon: <RiBusLine size={14} />,
        },
        {
          id: "pd-6",
          label: "Pre-departure Session",
          completed: stage >= 5,
          icon: <RiGroupLine size={14} />,
        },
      ],
      commission: {
        universityRate: 10 + Math.floor(Math.random() * 10),
        subAgentRate: Math.floor(Math.random() * 5),
        expectedAmount: Math.round(feeTotal * (0.1 + Math.random() * 0.1)),
        receivedAmount: stage >= 4 ? Math.round(feeTotal * 0.08) : 0,
        paymentStatus:
          stage >= 6
            ? ("received" as const)
            : stage >= 4
              ? ("partial" as const)
              : ("pending" as const),
        agreementUploaded: stage >= 2,
      },
      risks: riskPool.filter(() => Math.random() > 0.7),
    };
  });
};

const STUDENTS_DATA = generateStudents();
const COUNSELORS = [
  "Priya Sharma",
  "Arjun Patel",
  "Sarah Khan",
  "Rohan Mehta",
  "Anita Desai",
];
const COUNTRIES = [
  "🇬🇧 UK",
  "🇨🇦 Canada",
  "🇺🇸 USA",
  "🇦🇺 Australia",
  "🇩🇪 Germany",
  "🇮🇪 Ireland",
  "🇳🇿 New Zealand",
];

// ═══════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════

const UserAvatar: React.FC<{
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
}> = ({ name, size = "md" }) => {
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("");
  const colorMap = [
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-violet-100 text-violet-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-cyan-100 text-cyan-700",
    "bg-pink-100 text-pink-700",
    "bg-teal-100 text-teal-700",
    "bg-indigo-100 text-indigo-700",
    "bg-orange-100 text-orange-700",
  ];
  const sizeMap = {
    sm: "w-7 h-7 text-[10px] rounded-lg",
    md: "w-8 h-8 text-xs rounded-xl",
    lg: "w-10 h-10 text-sm rounded-xl",
    xl: "w-12 h-12 text-base rounded-2xl",
  };
  const idx =
    (name || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0) %
    colorMap.length;
  return (
    <div
      className={`flex items-center justify-center font-bold shrink-0 select-none ${sizeMap[size]} ${initials ? colorMap[idx] : "bg-slate-100 text-slate-400"}`}
    >
      {initials || <RiUserLine className="w-1/2 h-1/2" />}
    </div>
  );
};

const StudentOverviewCard: React.FC<{ student: EnrolledStudent }> = ({
  student,
}) => {
  const daysToIntake = Math.ceil(
    // eslint-disable-next-line react-hooks/purity
    (new Date(student.intakeDate).getTime() - Date.now()) / 86400000,
  );
  const feePercent = Math.round((student.feePaid / student.feeTotal) * 100);

  const visaColorMap: Record<string, string> = {
    not_started: "bg-slate-100 text-slate-600",
    filed: "bg-blue-50 text-blue-600",
    biometric_done: "bg-violet-50 text-violet-600",
    interview_done: "bg-amber-50 text-amber-600",
    approved: "bg-emerald-50 text-emerald-600",
    rejected: "bg-red-50 text-red-600",
  };
  const visaLabelMap: Record<string, string> = {
    not_started: "Not Started",
    filed: "Filed",
    biometric_done: "Biometric Done",
    interview_done: "Interview Done",
    approved: "Approved",
    rejected: "Rejected",
  };
  const travelLabelMap: Record<string, string> = {
    not_booked: "Not Booked",
    booked: "Booked",
    departed: "Departed",
  };
  const travelColorMap: Record<string, string> = {
    not_booked: "bg-slate-100 text-slate-600",
    booked: "bg-blue-50 text-blue-600",
    departed: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className=" overflow-hidden">
      {/* Header gradient */}
      <div className="bg-blue-500 px-6 py-5 relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/[0.07]" />
        <div className="absolute bottom-0 left-1/3 w-32 h-16 rounded-full bg-white/[0.04]" />
        <div className="flex items-center gap-4 relative z-10">
          <UserAvatar name={student.name} size="xl" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-extrabold text-white leading-tight">
                {student.name}
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-white/20 text-[11px] font-bold text-white/90 border border-white/25">
                {student.studentId}
              </span>
            </div>
            <p className="text-sm text-white/70 mt-0.5 flex items-center gap-1.5">
              <RiPhoneLine size={13} /> {student.phone}
              <span className="text-white/30 mx-1">•</span>
              <RiMailLine size={13} /> {student.email}
            </p>
          </div>
          <div className="text-right shrink-0 hidden sm:block">
            <div className="text-[10px] uppercase tracking-wider text-white/50 font-semibold mb-0.5">
              Intake Countdown
            </div>
            <div className="text-3xl font-extrabold text-white leading-none">
              {daysToIntake > 0 ? daysToIntake : 0}
            </div>
            <div className="text-[11px] text-white/60 font-medium">
              days to go
            </div>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 divide-x divide-slate-100">
        {[
          {
            icon: <RiMapPinLine size={14} />,
            label: "Country",
            value: student.country,
            color: "text-blue-600",
          },
          {
            icon: <RiBuilding2Line size={14} />,
            label: "University",
            value: student.university,
            color: "text-violet-600",
          },
          {
            icon: <RiGraduationCapLine size={14} />,
            label: "Course",
            value: student.course,
            color: "text-indigo-600",
          },
          {
            icon: <RiCalendarLine size={14} />,
            label: "Intake",
            value: student.intake,
            color: "text-amber-600",
          },
          {
            icon: <RiUserSmileLine size={14} />,
            label: "Counselor",
            value: student.counselor,
            color: "text-teal-600",
          },
          {
            icon: <RiMoneyDollarCircleLine size={14} />,
            label: "Fee Status",
            value: (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold">{feePercent}%</span>
                <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${feePercent >= 100 ? "bg-emerald-500" : feePercent > 0 ? "bg-amber-500" : "bg-slate-300"}`}
                    style={{ width: `${feePercent}%` }}
                  />
                </div>
              </div>
            ),
            color: "text-emerald-600",
          },
          {
            icon: <RiShieldCheckLine size={14} />,
            label: "Visa",
            value: (
              <span
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${visaColorMap[student.visaStatus]}`}
              >
                {visaLabelMap[student.visaStatus]}
              </span>
            ),
            color: "text-cyan-600",
          },
        ].map((item, idx) => (
          <div key={idx} className="px-4 py-3 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`${item.color} opacity-70`}>{item.icon}</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate">
                {item.label}
              </span>
            </div>
            <div className="text-[13px] font-semibold text-slate-800 truncate">
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Risk Alerts Strip */}
      {student.risks.length > 0 && (
        <div className="flex items-center gap-2 px-5 py-2.5 bg-red-50/60 border-t border-red-100">
          <RiAlertLine size={14} className="text-red-500 shrink-0" />
          <span className="text-[11px] font-semibold text-red-600">
            Alerts:
          </span>
          <div className="flex gap-1.5 flex-wrap">
            {student.risks.map((risk, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-red-100 text-red-700 border border-red-200"
              >
                {risk}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 2️⃣ ADMISSION TIMELINE TRACKER
// ═══════════════════════════════════════════════════════════════

const AdmissionTimeline: React.FC<{
  currentStage: number;
  onStageClick?: (stage: number) => void;
}> = ({ currentStage, onStageClick }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
          <RiTimeLine size={16} className="text-indigo-600" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">Admission Progress</h3>
        <span className="ml-auto text-[11px] font-semibold text-slate-400">
          {currentStage + 1} of {ADMISSION_STAGES.length} completed
        </span>
      </div>
      <div className="relative">
        {/* Progress line background */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-slate-100 rounded-full" />
        <div
          className="absolute top-5 left-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700"
          style={{
            width: `${(currentStage / (ADMISSION_STAGES.length - 1)) * 100}%`,
          }}
        />
        {/* Stage dots */}
        <div className="relative flex justify-between">
          {ADMISSION_STAGES.map((stage, idx) => {
            const isCompleted = idx <= currentStage;
            const isCurrent = idx === currentStage;
            return (
              <Tooltip title={stage.label} key={stage.key}>
                <button
                  onClick={() => onStageClick?.(idx)}
                  className={`flex flex-col items-center gap-2 bg-transparent border-none cursor-pointer transition-all group relative ${
                    isCompleted ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isCurrent
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110"
                        : isCompleted
                          ? "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200"
                          : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                    }`}
                  >
                    {isCompleted && !isCurrent ? (
                      <RiCheckLine size={16} />
                    ) : (
                      stage.icon
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-semibold text-center leading-tight max-w-[72px] ${
                      isCurrent
                        ? "text-blue-600"
                        : isCompleted
                          ? "text-slate-700"
                          : "text-slate-400"
                    }`}
                  >
                    {stage.label}
                  </span>
                </button>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 3️⃣ FEE & PAYMENT TRACKING
// ═══════════════════════════════════════════════════════════════

const FeePaymentSection: React.FC<{ student: EnrolledStudent }> = ({
  student,
}) => {
  const outstanding = student.feeTotal - student.feePaid;
  const profitMargin = student.commission.expectedAmount;

  const paymentColumns: ColumnsType<Payment> = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 160,
      render: (t: string) => (
        <span className="text-[13px] font-semibold text-slate-800">{t}</span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 120,
      render: (a: number, r: Payment) => (
        <span className="text-[13px] font-bold text-slate-900">
          {r.currency} {a.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      width: 120,
      render: (d: string) => {
        const overdue = new Date(d) < new Date();
        return (
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium ${overdue ? "text-red-600" : "text-slate-600"}`}
          >
            <RiCalendarLine size={12} />
            {new Date(d).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
            {overdue && <RiErrorWarningLine size={12} />}
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (s: string) => {
        const m: Record<string, string> = {
          paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
          pending: "bg-amber-50 text-amber-700 border-amber-200",
          overdue: "bg-red-50 text-red-700 border-red-200",
        };
        return (
          <span
            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${m[s]}`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </span>
        );
      },
    },
    {
      title: "Mode",
      dataIndex: "mode",
      key: "mode",
      width: 130,
      render: (m: string) => (
        <span className="text-xs text-slate-500">{m}</span>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="flex items-center gap-2 px-5 pt-5 pb-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
          <RiMoneyDollarCircleLine size={16} className="text-emerald-600" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">
          Fee & Payment Tracking
        </h3>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-5 pb-4">
        {[
          {
            label: "Total Fee",
            value: `$${student.feeTotal.toLocaleString()}`,
            bg: "bg-blue-50",
            tc: "text-blue-700",
            icon: <RiMoneyDollarCircleLine size={14} />,
          },
          {
            label: "Paid",
            value: `$${student.feePaid.toLocaleString()}`,
            bg: "bg-emerald-50",
            tc: "text-emerald-700",
            icon: <RiCheckboxCircleLine size={14} />,
          },
          {
            label: "Outstanding",
            value: `$${outstanding.toLocaleString()}`,
            bg: outstanding > 0 ? "bg-red-50" : "bg-slate-50",
            tc: outstanding > 0 ? "text-red-700" : "text-slate-600",
            icon: <RiErrorWarningLine size={14} />,
          },
          {
            label: "Commission Expected",
            value: `$${profitMargin.toLocaleString()}`,
            bg: "bg-violet-50",
            tc: "text-violet-700",
            icon: <RiHandCoinLine size={14} />,
          },
        ].map((card, i) => (
          <div
            key={i}
            className={`${card.bg} rounded-xl p-3 border border-slate-100`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`${card.tc} opacity-70`}>{card.icon}</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {card.label}
              </span>
            </div>
            <div className={`text-lg font-extrabold ${card.tc}`}>
              {card.value}
            </div>
          </div>
        ))}
      </div>
      {/* Payments Table */}
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#F8FAFC",
              headerColor: "#64748B",
              headerSplitColor: "transparent",
              borderColor: "#F1F5F9",
              cellPaddingBlock: 12,
              cellPaddingInline: 16,
              fontSize: 13,
            },
          },
        }}
      >
        <Table<Payment>
          dataSource={student.payments}
          columns={paymentColumns}
          rowKey="id"
          pagination={false}
          size="middle"
        />
      </ConfigProvider>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 4️⃣ VISA PROCESSING SECTION
// ═══════════════════════════════════════════════════════════════

const VisaSection: React.FC<{ student: EnrolledStudent }> = ({ student }) => {
  const visa = student.visa;
  const statusSteps = [
    {
      key: "filed",
      label: "Visa Filed",
      date: visa.filingDate,
      icon: <RiFileTextLine size={14} />,
    },
    {
      key: "biometric",
      label: "Biometric Done",
      date: visa.biometricDate,
      icon: <RiUserLine size={14} />,
    },
    {
      key: "interview",
      label: "Interview Done",
      date: visa.interviewDate,
      icon: <RiChat3Line size={14} />,
    },
    {
      key: "result",
      label: visa.status === "rejected" ? "Rejected" : "Approved",
      date:
        visa.status === "approved" || visa.status === "rejected"
          ? "Completed"
          : null,
      icon:
        visa.status === "rejected" ? (
          <RiCloseCircleLine size={14} />
        ) : (
          <RiShieldCheckLine size={14} />
        ),
    },
  ];

  const passportDaysToExpiry = Math.ceil(
    (new Date(visa.passportExpiry).getTime() - Date.now()) / 86400000,
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-cyan-50 flex items-center justify-center">
          <RiPassportLine size={16} className="text-cyan-600" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">Visa Processing</h3>
        <span
          className={`ml-auto px-2.5 py-0.5 rounded-lg text-[11px] font-bold ${
            visa.status === "approved"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : visa.status === "rejected"
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-blue-50 text-blue-700 border border-blue-200"
          }`}
        >
          {visa.type}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          {
            label: "Passport No.",
            value: visa.passportNumber,
            icon: <RiHashtag size={12} />,
          },
          {
            label: "Passport Expiry",
            value: new Date(visa.passportExpiry).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            icon: <RiCalendarLine size={12} />,
            alert: passportDaysToExpiry < 365,
          },
          {
            label: "Filing Date",
            value: visa.filingDate
              ? new Date(visa.filingDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "Not filed",
            icon: <RiFileTextLine size={12} />,
          },
          {
            label: "Status",
            value: visa.status
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase()),
            icon: <RiShieldCheckLine size={12} />,
          },
        ].map((item, i) => (
          <div
            key={i}
            className={`px-3 py-2.5 rounded-xl border ${item.alert ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-100"}`}
          >
            <div className="flex items-center gap-1 mb-0.5">
              <span
                className={`${item.alert ? "text-red-500" : "text-slate-400"}`}
              >
                {item.icon}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {item.label}
              </span>
              {item.alert && (
                <RiAlertLine size={11} className="text-red-500 ml-auto" />
              )}
            </div>
            <div
              className={`text-[13px] font-bold ${item.alert ? "text-red-700" : "text-slate-800"}`}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Visa Timeline */}
      <div className="flex items-center justify-between gap-1">
        {statusSteps.map((step, idx) => {
          const isDone = !!step.date;
          const isLast = idx === statusSteps.length - 1;
          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isDone
                      ? step.key === "result" && visa.status === "rejected"
                        ? "bg-red-100 text-red-600"
                        : "bg-emerald-100 text-emerald-600"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {isDone && step.key !== "result" ? (
                    <RiCheckLine size={15} />
                  ) : (
                    step.icon
                  )}
                </div>
                <span
                  className={`text-[10px] font-semibold text-center ${isDone ? "text-slate-700" : "text-slate-400"}`}
                >
                  {step.label}
                </span>
                {step.date && step.date !== "Completed" && (
                  <span className="text-[9px] text-slate-400">
                    {new Date(step.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>
              {!isLast && (
                <div
                  className={`h-0.5 flex-1 rounded-full mt-[-20px] ${isDone ? "bg-emerald-300" : "bg-slate-200"}`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 5️⃣ DOCUMENT MANAGEMENT
// ═══════════════════════════════════════════════════════════════

const DocumentSection: React.FC<{ documents: Document[] }> = ({
  documents,
}) => {
  const uploadedCount = documents.filter(
    (d) => d.status === "uploaded" || d.status === "verified",
  ).length;
  const docColumns: ColumnsType<Document> = [
    {
      title: "Document",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (name: string) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <RiFileTextLine size={14} className="text-blue-500" />
          </div>
          <span className="text-[13px] font-semibold text-slate-800">
            {name}
          </span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (s: string) => {
        const m: Record<
          string,
          { cls: string; label: string; icon: React.ReactNode }
        > = {
          verified: {
            cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
            label: "Verified",
            icon: <RiCheckboxCircleLine size={11} />,
          },
          uploaded: {
            cls: "bg-blue-50 text-blue-700 border-blue-200",
            label: "Uploaded",
            icon: <RiUploadCloud2Line size={11} />,
          },
          pending: {
            cls: "bg-amber-50 text-amber-700 border-amber-200",
            label: "Pending",
            icon: <RiTimeLine size={11} />,
          },
          expired: {
            cls: "bg-red-50 text-red-700 border-red-200",
            label: "Expired",
            icon: <RiErrorWarningLine size={11} />,
          },
        };
        const cfg = m[s] || m.pending;
        return (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${cfg.cls}`}
          >
            {cfg.icon} {cfg.label}
          </span>
        );
      },
    },
    {
      title: "Uploaded",
      dataIndex: "uploadedAt",
      key: "uploadedAt",
      width: 120,
      render: (d: string | null) =>
        d ? (
          <span className="text-xs text-slate-500">
            {new Date(d).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        ),
    },
    {
      title: "Expiry",
      dataIndex: "expiryDate",
      key: "expiryDate",
      width: 120,
      render: (d: string | null) => {
        if (!d) return <span className="text-xs text-slate-400">—</span>;
        const daysLeft = Math.ceil(
          (new Date(d).getTime() - Date.now()) / 86400000,
        );
        return (
          <span
            className={`text-xs font-medium ${daysLeft < 180 ? "text-red-600" : "text-slate-500"}`}
          >
            {new Date(d).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
            {daysLeft < 180 && (
              <RiAlertLine size={11} className="inline ml-1" />
            )}
          </span>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_: unknown, record: Document) => (
        <div className="flex gap-1.5">
          {record.status === "pending" ? (
            <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-600 text-white border-none cursor-pointer hover:bg-blue-700 transition-colors">
              <RiUploadCloud2Line size={12} /> Upload
            </button>
          ) : (
            <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-50 text-slate-600 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
              <RiEyeLine size={12} /> View
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="flex items-center gap-2 px-5 pt-5 pb-3">
        <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
          <RiFolder3Line size={16} className="text-amber-600" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">Documents</h3>
        <span className="ml-auto text-[11px] font-semibold text-slate-400">
          {uploadedCount}/{documents.length} uploaded
        </span>
      </div>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#F8FAFC",
              headerColor: "#64748B",
              headerSplitColor: "transparent",
              borderColor: "#F1F5F9",
              cellPaddingBlock: 10,
              cellPaddingInline: 16,
              fontSize: 13,
            },
          },
        }}
      >
        <Table<Document>
          dataSource={documents}
          columns={docColumns}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </ConfigProvider>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 6️⃣ PRE-DEPARTURE CHECKLIST
// ═══════════════════════════════════════════════════════════════

const PreDepartureChecklist: React.FC<{
  items: PreDepartureItem[];
  onToggle?: (id: string) => void;
}> = ({ items, onToggle }) => {
  const completedCount = items.filter((i) => i.completed).length;
  const percent = Math.round((completedCount / items.length) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center">
          <RiFlightTakeoffLine size={16} className="text-orange-600" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">
          Pre-Departure Checklist
        </h3>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500">
            {percent}%
          </span>
          <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${percent === 100 ? "bg-emerald-500" : "bg-orange-500"}`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onToggle?.(item.id)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer bg-transparent text-left ${
              item.completed
                ? "border-emerald-200 bg-emerald-50/50"
                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                item.completed
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {item.completed ? <RiCheckLine size={13} /> : item.icon}
            </div>
            <span
              className={`text-[13px] font-medium ${item.completed ? "text-emerald-700 line-through" : "text-slate-700"}`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 7️⃣ COMMUNICATION LOG
// ═══════════════════════════════════════════════════════════════

const CommunicationLog: React.FC<{ communications: Communication[] }> = ({
  communications,
}) => {
  const typeConfig: Record<string, { icon: React.ReactNode; cls: string }> = {
    call: { icon: <RiPhoneLine size={14} />, cls: "bg-blue-50 text-blue-600" },
    whatsapp: {
      icon: <RiWhatsappLine size={14} />,
      cls: "bg-emerald-50 text-emerald-600",
    },
    email: {
      icon: <RiMailLine size={14} />,
      cls: "bg-violet-50 text-violet-600",
    },
    meeting: {
      icon: <RiVideoChatLine size={14} />,
      cls: "bg-amber-50 text-amber-600",
    },
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
          <RiChat3Line size={16} className="text-violet-600" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">Communication Log</h3>
        <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-blue-50 text-blue-600 border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors">
          <RiAddLine size={12} /> Log Activity
        </button>
      </div>
      <div className="flex flex-col gap-2.5">
        {communications.map((comm) => {
          const cfg = typeConfig[comm.type] || typeConfig.call;
          return (
            <div
              key={comm.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cfg.cls}`}
              >
                {cfg.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">
                    {comm.type}
                  </span>
                  <span className="text-[10px] text-slate-400">•</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(comm.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-[13px] text-slate-700 leading-relaxed">
                  {comm.summary}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">by {comm.by}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 8️⃣ COMMISSION & PARTNER TRACKING
// ═══════════════════════════════════════════════════════════════

const CommissionSection: React.FC<{ student: EnrolledStudent }> = ({
  student,
}) => {
  const c = student.commission;
  const statusClr: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    partial: "bg-blue-50 text-blue-700 border-blue-200",
    received: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center">
          <RiHandCoinLine size={16} className="text-rose-600" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">
          Commission & Partner
        </h3>
        <span
          className={`ml-auto px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${statusClr[c.paymentStatus]}`}
        >
          {c.paymentStatus.charAt(0).toUpperCase() + c.paymentStatus.slice(1)}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          {
            label: "University Rate",
            value: `${c.universityRate}%`,
            icon: <RiPercentLine size={13} />,
            bg: "bg-blue-50",
            tc: "text-blue-700",
          },
          {
            label: "Sub-Agent Rate",
            value: `${c.subAgentRate}%`,
            icon: <RiExchangeDollarLine size={13} />,
            bg: "bg-violet-50",
            tc: "text-violet-700",
          },
          {
            label: "Expected",
            value: `$${c.expectedAmount.toLocaleString()}`,
            icon: <RiMoneyDollarCircleLine size={13} />,
            bg: "bg-amber-50",
            tc: "text-amber-700",
          },
          {
            label: "Received",
            value: `$${c.receivedAmount.toLocaleString()}`,
            icon: <RiCheckboxCircleLine size={13} />,
            bg: "bg-emerald-50",
            tc: "text-emerald-700",
          },
          {
            label: "Pending",
            value: `$${(c.expectedAmount - c.receivedAmount).toLocaleString()}`,
            icon: <RiTimeLine size={13} />,
            bg: "bg-red-50",
            tc: "text-red-700",
          },
          {
            label: "Agreement",
            value: c.agreementUploaded ? "Uploaded" : "Missing",
            icon: <RiContractLine size={13} />,
            bg: c.agreementUploaded ? "bg-emerald-50" : "bg-red-50",
            tc: c.agreementUploaded ? "text-emerald-700" : "text-red-700",
          },
        ].map((item, i) => (
          <div
            key={i}
            className={`${item.bg} rounded-xl p-3 border border-slate-100`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`${item.tc} opacity-70`}>{item.icon}</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {item.label}
              </span>
            </div>
            <div className={`text-base font-extrabold ${item.tc}`}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// 🔟 REPORTING DASHBOARD STATS
// ═══════════════════════════════════════════════════════════════

const ReportingDashboard: React.FC<{ students: EnrolledStudent[] }> = ({
  students,
}) => {
  const byCountry = useMemo(() => {
    const map: Record<string, number> = {};
    students.forEach((s) => {
      map[s.country] = (map[s.country] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [students]);

  const byCounselor = useMemo(() => {
    const map: Record<string, number> = {};
    students.forEach((s) => {
      map[s.counselor] = (map[s.counselor] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [students]);

  const visaApproved = students.filter(
    (s) => s.visaStatus === "approved",
  ).length;
  const visaRate =
    students.length > 0
      ? Math.round((visaApproved / students.length) * 100)
      : 0;
  const totalCommission = students.reduce(
    (sum, s) => sum + s.commission.receivedAmount,
    0,
  );
  const avgStage =
    students.length > 0
      ? (
          students.reduce((sum, s) => sum + s.admissionStage, 0) /
          students.length
        ).toFixed(1)
      : "0";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
          <RiBarChartLine size={16} className="text-indigo-600" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">
          Enrollment Analytics
        </h3>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
        {[
          {
            label: "Total Enrolled",
            value: students.length,
            icon: <RiGroupLine size={15} />,
            bg: "bg-blue-50",
            tc: "text-blue-700",
          },
          {
            label: "Visa Approved",
            value: visaApproved,
            icon: <RiShieldCheckLine size={15} />,
            bg: "bg-emerald-50",
            tc: "text-emerald-700",
          },
          {
            label: "Visa Success Rate",
            value: `${visaRate}%`,
            icon: <RiSpeedLine size={15} />,
            bg: "bg-cyan-50",
            tc: "text-cyan-700",
          },
          {
            label: "Commission Earned",
            value: `$${totalCommission.toLocaleString()}`,
            icon: <RiHandCoinLine size={15} />,
            bg: "bg-amber-50",
            tc: "text-amber-700",
          },
          {
            label: "Avg. Stage",
            value: avgStage,
            icon: <RiLineChartLine size={15} />,
            bg: "bg-violet-50",
            tc: "text-violet-700",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={`${stat.bg} rounded-xl p-3.5 border border-slate-100`}
          >
            <div className={`${stat.tc} opacity-70 mb-1.5`}>{stat.icon}</div>
            <div
              className={`text-xl font-extrabold ${stat.tc} leading-none mb-0.5`}
            >
              {stat.value}
            </div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* By Country & Counselor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h4 className="text-xs font-bold text-slate-600 mb-3 flex items-center gap-1.5">
            <RiGlobalLine size={13} /> By Country
          </h4>
          <div className="flex flex-col gap-2">
            {byCountry.map(([country, count]) => (
              <div key={country} className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-700 w-24 truncate">
                  {country}
                </span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${(count / students.length) * 100}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-600 w-6 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-600 mb-3 flex items-center gap-1.5">
            <RiUserSmileLine size={13} /> By Counselor
          </h4>
          <div className="flex flex-col gap-2">
            {byCounselor.map(([counselor, count]) => (
              <div key={counselor} className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-700 w-24 truncate">
                  {counselor}
                </span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-500 rounded-full transition-all"
                    style={{ width: `${(count / students.length) * 100}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-600 w-6 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// STUDENT DETAIL DRAWER
// ═══════════════════════════════════════════════════════════════

const StudentDetailDrawer: React.FC<{
  student: EnrolledStudent | null;
  onClose: () => void;
  onTogglePreDeparture: (studentId: string, itemId: string) => void;
}> = ({ student, onClose, onTogglePreDeparture }) => {
  if (!student) return null;

  const tabItems = [
    {
      key: "overview",
      label: (
        <span className="flex items-center gap-1.5">
          <RiUserLine size={13} /> Overview
        </span>
      ),
      children: (
        <div className="flex flex-col gap-4 p-4">
          <AdmissionTimeline currentStage={student.admissionStage} />
          <FeePaymentSection student={student} />
        </div>
      ),
    },
    {
      key: "visa",
      label: (
        <span className="flex items-center gap-1.5">
          <RiPassportLine size={13} /> Visa
        </span>
      ),
      children: (
        <div className="p-4">
          <VisaSection student={student} />
        </div>
      ),
    },
    {
      key: "documents",
      label: (
        <span className="flex items-center gap-1.5">
          <RiFolder3Line size={13} /> Documents
        </span>
      ),
      children: (
        <div className="p-4">
          <DocumentSection documents={student.documents} />
        </div>
      ),
    },
    {
      key: "predeparture",
      label: (
        <span className="flex items-center gap-1.5">
          <RiFlightTakeoffLine size={13} /> Pre-Departure
        </span>
      ),
      children: (
        <div className="p-4">
          <PreDepartureChecklist
            items={student.preDeparture}
            onToggle={(itemId) => onTogglePreDeparture(student.id, itemId)}
          />
        </div>
      ),
    },
    {
      key: "comms",
      label: (
        <span className="flex items-center gap-1.5">
          <RiChat3Line size={13} /> Comms
        </span>
      ),
      children: (
        <div className="p-4">
          <CommunicationLog communications={student.communications} />
        </div>
      ),
    },
    {
      key: "commission",
      label: (
        <span className="flex items-center gap-1.5">
          <RiHandCoinLine size={13} /> Commission
        </span>
      ),
      children: (
        <div className="p-4">
          <CommissionSection student={student} />
        </div>
      ),
    },
  ];

  return (
    <Drawer
      open={!!student}
      onClose={onClose}
      width={900}
      title={null}
      styles={{
        body: { padding: 0, background: "#F8FAFC" },
        header: { display: "none" },
      }}
    >
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/20 hover:bg-white/30 border-none rounded-lg p-1.5 cursor-pointer flex text-white transition-colors backdrop-blur-sm"
        >
          <RiCloseLine size={18} />
        </button>
        <StudentOverviewCard student={student} />
      </div>
      <Tabs
        items={tabItems}
        defaultActiveKey="overview"
        className="enrolled-detail-tabs"
        style={{ margin: 0 }}
      />
    </Drawer>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN STUDENTS TABLE
// ═══════════════════════════════════════════════════════════════

const EnrolledStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<EnrolledStudent[]>(STUDENTS_DATA);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [counselorFilter, setCounselorFilter] = useState("");
  const [visaFilter, setVisaFilter] = useState("");
  const [selectedStudent, setSelectedStudent] =
    useState<EnrolledStudent | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (
        search &&
        !s.name.toLowerCase().includes(search.toLowerCase()) &&
        !s.studentId.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (countryFilter && s.country !== countryFilter) return false;
      if (counselorFilter && s.counselor !== counselorFilter) return false;
      if (visaFilter && s.visaStatus !== visaFilter) return false;
      return true;
    });
  }, [students, search, countryFilter, counselorFilter, visaFilter]);

  const handleTogglePreDeparture = (studentId: string, itemId: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              preDeparture: s.preDeparture.map((pd) =>
                pd.id === itemId ? { ...pd, completed: !pd.completed } : pd,
              ),
            }
          : s,
      ),
    );
    setSelectedStudent((prev) =>
      prev && prev.id === studentId
        ? {
            ...prev,
            preDeparture: prev.preDeparture.map((pd) =>
              pd.id === itemId ? { ...pd, completed: !pd.completed } : pd,
            ),
          }
        : prev,
    );
  };

  const columns: ColumnsType<EnrolledStudent> = [
    {
      title: "Student",
      dataIndex: "name",
      key: "name",
      width: 220,
      fixed: "left" as const,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string, record) => (
        <button
          onClick={() => setSelectedStudent(record)}
          className="flex items-center gap-2.5 bg-transparent border-none cursor-pointer p-0 text-left w-full group"
        >
          <UserAvatar name={name} size="md" />
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
              {name}
            </div>
            <div className="text-[11px] text-slate-400">
              {record.studentId} • {record.country}
            </div>
          </div>
        </button>
      ),
    },
    {
      title: "University",
      dataIndex: "university",
      key: "university",
      width: 200,
      render: (u: string, r) => (
        <div className="min-w-0">
          <div className="text-[13px] font-medium text-slate-800 truncate">
            {u}
          </div>
          <div className="text-[11px] text-slate-400 truncate">{r.course}</div>
        </div>
      ),
    },
    {
      title: "Stage",
      dataIndex: "admissionStage",
      key: "stage",
      width: 180,
      sorter: (a, b) => a.admissionStage - b.admissionStage,
      render: (stage: number) => {
        const s = ADMISSION_STAGES[stage];
        const percent = Math.round(
          ((stage + 1) / ADMISSION_STAGES.length) * 100,
        );
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${percent === 100 ? "bg-emerald-500" : "bg-blue-500"}`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="text-[11px] font-semibold text-slate-600 whitespace-nowrap">
              {s?.label}
            </span>
          </div>
        );
      },
    },
    {
      title: "Visa",
      dataIndex: "visaStatus",
      key: "visa",
      width: 120,
      filters: [
        { text: "Not Started", value: "not_started" },
        { text: "Filed", value: "filed" },
        { text: "Approved", value: "approved" },
        { text: "Rejected", value: "rejected" },
      ],
      onFilter: (val, r) => r.visaStatus === val,
      render: (s: string) => {
        const m: Record<string, string> = {
          not_started: "bg-slate-50 text-slate-600 border-slate-200",
          filed: "bg-blue-50 text-blue-700 border-blue-200",
          biometric_done: "bg-violet-50 text-violet-700 border-violet-200",
          interview_done: "bg-amber-50 text-amber-700 border-amber-200",
          approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
          rejected: "bg-red-50 text-red-700 border-red-200",
        };
        return (
          <span
            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${m[s]}`}
          >
            {s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </span>
        );
      },
    },
    {
      title: "Fee",
      key: "fee",
      width: 130,
      render: (_: unknown, r: EnrolledStudent) => {
        const pct = Math.round((r.feePaid / r.feeTotal) * 100);
        return (
          <div className="flex items-center gap-2">
            <div className="w-10 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${pct >= 100 ? "bg-emerald-500" : pct > 0 ? "bg-amber-500" : "bg-slate-300"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-[11px] font-semibold text-slate-600">
              {pct}%
            </span>
          </div>
        );
      },
    },
    {
      title: "Counselor",
      dataIndex: "counselor",
      key: "counselor",
      width: 140,
      render: (c: string) => (
        <span className="text-[13px] text-slate-600">{c}</span>
      ),
    },
    {
      title: "Intake",
      dataIndex: "intake",
      key: "intake",
      width: 100,
      render: (i: string) => (
        <span className="text-xs font-medium text-slate-500">{i}</span>
      ),
    },
    {
      title: "Risks",
      key: "risks",
      width: 80,
      render: (_: unknown, r: EnrolledStudent) =>
        r.risks.length > 0 ? (
          <Popover
            content={
              <div className="flex flex-col gap-1 max-w-[200px]">
                {r.risks.map((risk, i) => (
                  <span
                    key={i}
                    className="text-xs text-red-600 flex items-center gap-1"
                  >
                    <RiAlertLine size={11} /> {risk}
                  </span>
                ))}
              </div>
            }
            title={
              <span className="text-xs font-bold text-red-700">
                Risk Alerts
              </span>
            }
          >
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-red-50 text-red-600 border border-red-200 cursor-pointer">
              <RiAlertLine size={11} /> {r.risks.length}
            </span>
          </Popover>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
            <RiCheckboxCircleLine size={11} /> OK
          </span>
        ),
    },
    {
      title: "",
      key: "actions",
      width: 50,
      fixed: "right" as const,
      render: (_: unknown, record: EnrolledStudent) => (
        <Tooltip title="View Details">
          <button
            onClick={() => setSelectedStudent(record)}
            className="bg-transparent border-none p-1.5 rounded-lg cursor-pointer flex text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <RiArrowRightLine size={16} />
          </button>
        </Tooltip>
      ),
    },
  ];

  const clearFilters = () => {
    setSearch("");
    setCountryFilter("");
    setCounselorFilter("");
    setVisaFilter("");
  };
  const hasFilters = !!(
    search ||
    countryFilter ||
    counselorFilter ||
    visaFilter
  );

  const handleEnrollStudent = (newStudent: Partial<EnrolledStudent>) => {
    const fullStudent: EnrolledStudent = {
      id: newStudent.id || `STU-${Date.now()}`,
      name: newStudent.name || "",
      studentId: newStudent.studentId || `STU-${Date.now()}`,
      phone: newStudent.phone || "",
      email: newStudent.email || "",
      country: newStudent.country || "",
      university: newStudent.university || "",
      course: newStudent.course || "",
      intake: newStudent.intake || "Sep 2026",
      intakeDate:
        newStudent.intakeDate || new Date().toISOString().split("T")[0],
      counselor: newStudent.counselor || "",
      feePaid: newStudent.feePaid || 0,
      feeTotal: newStudent.feeTotal || 0,
      visaStatus: "not_started",
      travelStatus: "not_booked",
      admissionStage: 0,
      ieltsScore: newStudent.ieltsScore || "0.0",
      documents: [
        {
          id: `doc-new-0`,
          name: "Passport",
          type: "passport",
          status: "pending",
          uploadedAt: null,
          expiryDate: null,
        },
        {
          id: `doc-new-1`,
          name: "Offer Letter",
          type: "offer_letter",
          status: "pending",
          uploadedAt: null,
          expiryDate: null,
        },
        {
          id: `doc-new-2`,
          name: "CAS / I-20",
          type: "cas",
          status: "pending",
          uploadedAt: null,
          expiryDate: null,
        },
        {
          id: `doc-new-3`,
          name: "Fee Receipt",
          type: "fee_receipt",
          status: "pending",
          uploadedAt: null,
          expiryDate: null,
        },
        {
          id: `doc-new-4`,
          name: "SOP",
          type: "sop",
          status: "pending",
          uploadedAt: null,
          expiryDate: null,
        },
        {
          id: `doc-new-5`,
          name: "LOR",
          type: "lor",
          status: "pending",
          uploadedAt: null,
          expiryDate: null,
        },
        {
          id: `doc-new-6`,
          name: "Bank Statement",
          type: "bank_statement",
          status: "pending",
          uploadedAt: null,
          expiryDate: null,
        },
        {
          id: `doc-new-7`,
          name: "Visa Copy",
          type: "visa_copy",
          status: "pending",
          uploadedAt: null,
          expiryDate: null,
        },
        {
          id: `doc-new-8`,
          name: "Air Ticket",
          type: "air_ticket",
          status: "pending",
          uploadedAt: null,
          expiryDate: null,
        },
      ],
      payments: [],
      communications: [],
      visa: newStudent.visa || {
        type: "Student Visa",
        filingDate: null,
        biometricDate: null,
        interviewDate: null,
        status: "not_started",
        passportNumber: "",
        passportExpiry: "",
      },
      preDeparture: [
        {
          id: "pd-1",
          label: "Accommodation Booked",
          completed: false,
          icon: null,
        },
        { id: "pd-2", label: "Forex Arranged", completed: false, icon: null },
        {
          id: "pd-3",
          label: "Insurance Purchased",
          completed: false,
          icon: null,
        },
        {
          id: "pd-4",
          label: "SIM Card Arranged",
          completed: false,
          icon: null,
        },
        {
          id: "pd-5",
          label: "Airport Pickup Arranged",
          completed: false,
          icon: null,
        },
        {
          id: "pd-6",
          label: "Pre-departure Session",
          completed: false,
          icon: null,
        },
      ],
      commission: newStudent.commission || {
        universityRate: 10,
        subAgentRate: 0,
        expectedAmount: 0,
        receivedAmount: 0,
        paymentStatus: "pending",
        agreementUploaded: false,
      },
      risks: [],
    };

    setStudents((prev) => [fullStudent, ...prev]);
  };

  return (
    <div className="flex flex-col gap-4 w-full p-5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Enrolled Students
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Manage enrolled students — track admissions, visas, fees &
            pre-departure
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-semibold border cursor-pointer transition-all ${
              showAnalytics
                ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <RiBarChartLine size={15} /> Analytics
          </button>
          <button
            onClick={() => setShowEnrollModal(true)}
            className="flex items-center gap-1.5 bg-blue-600 text-white border-none rounded-xl px-4 py-2 text-[13px] font-bold cursor-pointer shadow-sm shadow-blue-200 hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
          >
            <RiAddLine size={16} /> Enroll Student
          </button>
        </div>
      </div>

      {/* Analytics Panel */}
      {showAnalytics && <ReportingDashboard students={students} />}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4">
        <div className="flex flex-wrap gap-2 items-center">
          <Input
            prefix={<RiSearchLine size={14} className="text-slate-400" />}
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ width: 220 }}
            className="!rounded-xl"
          />
          <Select
            value={countryFilter || undefined}
            onChange={(v) => setCountryFilter(v || "")}
            placeholder="Country"
            allowClear
            style={{ width: 130 }}
            options={COUNTRIES.map((c) => ({ value: c, label: c }))}
          />
          <Select
            value={counselorFilter || undefined}
            onChange={(v) => setCounselorFilter(v || "")}
            placeholder="Counselor"
            allowClear
            style={{ width: 150 }}
            options={COUNSELORS.map((c) => ({ value: c, label: c }))}
          />
          <Select
            value={visaFilter || undefined}
            onChange={(v) => setVisaFilter(v || "")}
            placeholder="Visa Status"
            allowClear
            style={{ width: 140 }}
            options={[
              { value: "not_started", label: "Not Started" },
              { value: "filed", label: "Filed" },
              { value: "approved", label: "Approved" },
              { value: "rejected", label: "Rejected" },
            ]}
          />
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
            >
              <RiRefreshLine size={11} /> Clear
            </button>
          )}
          <span className="ml-auto text-xs font-medium text-slate-400">
            {filteredStudents.length} of {students.length} students
          </span>
          <Tooltip title="Export CSV">
            <button className="bg-transparent border-none p-1.5 rounded-lg cursor-pointer text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors flex">
              <RiDownloadLine size={15} />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Table */}
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#F8FAFC",
              headerColor: "#64748B",
              headerSplitColor: "transparent",
              rowHoverBg: "#F8FAFF",
              borderColor: "#F1F5F9",
              cellPaddingBlock: 14,
              cellPaddingInline: 16,
              fontSize: 13,
            },
          },
        }}
      >
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <Table<EnrolledStudent>
            dataSource={filteredStudents}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}–${range[1]} of ${total} students`,
              style: { padding: "12px 16px", margin: 0 },
            }}
            scroll={{ x: 1300 }}
            size="middle"
            locale={{
              emptyText: (
                <Empty
                  description="No enrolled students found"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
            onRow={(record) => ({
              onClick: () => setSelectedStudent(record),
              style: { cursor: "pointer" },
            })}
          />
        </div>
      </ConfigProvider>

      {/* Detail Drawer */}
      <StudentDetailDrawer
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onTogglePreDeparture={handleTogglePreDeparture}
      />

      {/* Custom Tab Styles */}
      <style>{`
        .enrolled-detail-tabs .ant-tabs-nav { padding: 0 16px; margin: 0; background: white; border-bottom: 1px solid #F1F5F9; }
        .enrolled-detail-tabs .ant-tabs-tab { padding: 12px 8px; font-size: 13px; font-weight: 600; }
        .enrolled-detail-tabs .ant-tabs-content-holder { background: #F8FAFC; }
      `}</style>

      <EnrollStudentModal
        open={showEnrollModal}
        onClose={() => setShowEnrollModal(false)}
        onSubmit={handleEnrollStudent}
      />
    </div>
  );
};

export default EnrolledStudentsPage;
