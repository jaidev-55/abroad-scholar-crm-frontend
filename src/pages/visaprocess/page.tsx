import { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Input,
  Select,
  Button,
  Tooltip,
  Progress,
  message,
  Dropdown,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import {
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiShield,
  FiTrendingUp,
  FiSearch,
  FiPlus,
  FiMoreVertical,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiAlertTriangle,
  FiX,
  FiUser,
  FiMail,
  FiBookOpen,
  FiCalendar,
  FiArrowRight,
  FiDownload,
  FiChevronRight,
  FiSend,
  FiCamera,
  FiActivity,
} from "react-icons/fi";

import CustomModal from "../../components/common/CustomModal";
import CustomInput from "../../components/common/CustomInput";
import CustomSelect from "../../components/common/CustomSelect";

// ════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════

type VisaStatus =
  | "Documents Preparing"
  | "Financial Documents"
  | "CAS Received"
  | "Visa Submitted"
  | "Biometrics Completed"
  | "Under Processing"
  | "Visa Approved"
  | "Visa Rejected";

type NextAction =
  | "Upload CAS"
  | "Upload Bank Statement"
  | "Book Biometrics"
  | "Submit Visa"
  | "Schedule Interview"
  | "Track Decision"
  | "Book Flight"
  | "Appeal / Reapply";

interface VisaDocument {
  name: string;
  status: "Uploaded" | "Pending" | "Rejected" | "Not Required";
}

interface VisaCase {
  key: string;
  student: string;
  email: string;
  country: string;
  countryFlag: string;
  university: string;
  course: string;
  counselor: string;
  intake: string;
  visaType: string;
  visaStatus: VisaStatus;
  biometrics: "Done" | "Pending" | "Scheduled" | "N/A";
  biometricsDate: string | null;
  interviewDate: string | null;
  decisionDate: string | null;
  nextAction: NextAction;
  documents: VisaDocument[];
  processingDays: number;
  casRequired: boolean;
  casReceived: boolean;
}

interface AddVisaCaseFormValues {
  student: string;
  email: string;
  country: string;
  university: string;
  course: string;
  counselor: string;
  intake: string;
  visaType: string;
}

// ════════════════════════════════════════════════
// DUMMY DATA
// ════════════════════════════════════════════════

const DUMMY_VISA_CASES: VisaCase[] = [
  {
    key: "1",
    student: "Ravi Kumar",
    email: "ravi@email.com",
    country: "United Kingdom",
    countryFlag: "🇬🇧",
    university: "Coventry University",
    course: "MSc Data Science",
    counselor: "Priya Sharma",
    intake: "Sep 2026",
    visaType: "Tier 4 Student",
    visaStatus: "Documents Preparing",
    biometrics: "Pending",
    biometricsDate: null,
    interviewDate: "2026-03-20",
    decisionDate: null,
    nextAction: "Upload Bank Statement",
    documents: [
      { name: "Passport", status: "Uploaded" },
      { name: "CAS Letter", status: "Pending" },
      { name: "Bank Statement", status: "Pending" },
      { name: "SOP", status: "Uploaded" },
      { name: "Offer Letter", status: "Uploaded" },
      { name: "IELTS", status: "Uploaded" },
      { name: "Medical", status: "Not Required" },
    ],
    processingDays: 5,
    casRequired: true,
    casReceived: false,
  },
  {
    key: "2",
    student: "Priyanka Das",
    email: "priyanka@email.com",
    country: "United Kingdom",
    countryFlag: "🇬🇧",
    university: "University of York",
    course: "MBA",
    counselor: "Ganesh Kumar",
    intake: "Jan 2027",
    visaType: "Tier 4 Student",
    visaStatus: "Visa Submitted",
    biometrics: "Done",
    biometricsDate: "2026-03-08",
    interviewDate: "2026-03-25",
    decisionDate: null,
    nextAction: "Track Decision",
    documents: [
      { name: "Passport", status: "Uploaded" },
      { name: "CAS Letter", status: "Uploaded" },
      { name: "Bank Statement", status: "Uploaded" },
      { name: "SOP", status: "Uploaded" },
      { name: "Offer Letter", status: "Uploaded" },
      { name: "IELTS", status: "Uploaded" },
      { name: "Medical", status: "Uploaded" },
    ],
    processingDays: 18,
    casRequired: true,
    casReceived: true,
  },
  {
    key: "3",
    student: "Amit Shah",
    email: "amit@email.com",
    country: "Australia",
    countryFlag: "🇦🇺",
    university: "Deakin University",
    course: "MSc IT",
    counselor: "Sneha Reddy",
    intake: "May 2026",
    visaType: "Subclass 500",
    visaStatus: "Visa Approved",
    biometrics: "Done",
    biometricsDate: "2026-02-10",
    interviewDate: null,
    decisionDate: "2026-03-05",
    nextAction: "Book Flight",
    documents: [
      { name: "Passport", status: "Uploaded" },
      { name: "CAS Letter", status: "Not Required" },
      { name: "Bank Statement", status: "Uploaded" },
      { name: "SOP", status: "Uploaded" },
      { name: "Offer Letter", status: "Uploaded" },
      { name: "IELTS", status: "Uploaded" },
      { name: "Medical", status: "Uploaded" },
    ],
    processingDays: 32,
    casRequired: false,
    casReceived: false,
  },
  {
    key: "4",
    student: "Sneha Iyer",
    email: "sneha@email.com",
    country: "Canada",
    countryFlag: "🇨🇦",
    university: "University of Toronto",
    course: "MSc Computer Science",
    counselor: "Priya Sharma",
    intake: "Sep 2026",
    visaType: "Study Permit",
    visaStatus: "Financial Documents",
    biometrics: "Pending",
    biometricsDate: null,
    interviewDate: null,
    decisionDate: null,
    nextAction: "Upload Bank Statement",
    documents: [
      { name: "Passport", status: "Uploaded" },
      { name: "CAS Letter", status: "Not Required" },
      { name: "Bank Statement", status: "Pending" },
      { name: "SOP", status: "Uploaded" },
      { name: "Offer Letter", status: "Uploaded" },
      { name: "IELTS", status: "Uploaded" },
      { name: "Medical", status: "Pending" },
    ],
    processingDays: 10,
    casRequired: false,
    casReceived: false,
  },
  {
    key: "5",
    student: "Vikram Singh",
    email: "vikram@email.com",
    country: "United Kingdom",
    countryFlag: "🇬🇧",
    university: "University of Leeds",
    course: "MSc Finance",
    counselor: "Ganesh Kumar",
    intake: "Jan 2027",
    visaType: "Tier 4 Student",
    visaStatus: "CAS Received",
    biometrics: "Pending",
    biometricsDate: null,
    interviewDate: null,
    decisionDate: null,
    nextAction: "Book Biometrics",
    documents: [
      { name: "Passport", status: "Uploaded" },
      { name: "CAS Letter", status: "Uploaded" },
      { name: "Bank Statement", status: "Uploaded" },
      { name: "SOP", status: "Uploaded" },
      { name: "Offer Letter", status: "Uploaded" },
      { name: "IELTS", status: "Uploaded" },
      { name: "Medical", status: "Pending" },
    ],
    processingDays: 14,
    casRequired: true,
    casReceived: true,
  },
  {
    key: "6",
    student: "Ananya Reddy",
    email: "ananya@email.com",
    country: "Australia",
    countryFlag: "🇦🇺",
    university: "Monash University",
    course: "MSc Business Analytics",
    counselor: "Sneha Reddy",
    intake: "May 2026",
    visaType: "Subclass 500",
    visaStatus: "Biometrics Completed",
    biometrics: "Done",
    biometricsDate: "2026-03-06",
    interviewDate: null,
    decisionDate: null,
    nextAction: "Submit Visa",
    documents: [
      { name: "Passport", status: "Uploaded" },
      { name: "CAS Letter", status: "Not Required" },
      { name: "Bank Statement", status: "Uploaded" },
      { name: "SOP", status: "Uploaded" },
      { name: "Offer Letter", status: "Uploaded" },
      { name: "IELTS", status: "Uploaded" },
      { name: "Medical", status: "Uploaded" },
    ],
    processingDays: 20,
    casRequired: false,
    casReceived: false,
  },
  {
    key: "7",
    student: "Karan Mehta",
    email: "karan@email.com",
    country: "Canada",
    countryFlag: "🇨🇦",
    university: "University of Waterloo",
    course: "MEng Software",
    counselor: "Priya Sharma",
    intake: "Sep 2026",
    visaType: "Study Permit",
    visaStatus: "Under Processing",
    biometrics: "Done",
    biometricsDate: "2026-02-28",
    interviewDate: null,
    decisionDate: null,
    nextAction: "Track Decision",
    documents: [
      { name: "Passport", status: "Uploaded" },
      { name: "CAS Letter", status: "Not Required" },
      { name: "Bank Statement", status: "Uploaded" },
      { name: "SOP", status: "Uploaded" },
      { name: "Offer Letter", status: "Uploaded" },
      { name: "IELTS", status: "Uploaded" },
      { name: "Medical", status: "Uploaded" },
    ],
    processingDays: 25,
    casRequired: false,
    casReceived: false,
  },
  {
    key: "8",
    student: "Divya Nair",
    email: "divya@email.com",
    country: "Germany",
    countryFlag: "🇩🇪",
    university: "TU Munich",
    course: "MSc Robotics",
    counselor: "Ganesh Kumar",
    intake: "Sep 2026",
    visaType: "National Visa",
    visaStatus: "Visa Rejected",
    biometrics: "Done",
    biometricsDate: "2026-02-15",
    interviewDate: null,
    decisionDate: "2026-03-07",
    nextAction: "Appeal / Reapply",
    documents: [
      { name: "Passport", status: "Uploaded" },
      { name: "CAS Letter", status: "Not Required" },
      { name: "Bank Statement", status: "Uploaded" },
      { name: "SOP", status: "Uploaded" },
      { name: "Offer Letter", status: "Uploaded" },
      { name: "IELTS", status: "Not Required" },
      { name: "Medical", status: "Uploaded" },
    ],
    processingDays: 38,
    casRequired: false,
    casReceived: false,
  },
];

// ════════════════════════════════════════════════
// STATUS CONFIGS
// ════════════════════════════════════════════════

const VISA_STATUS_CONFIG: Record<
  VisaStatus,
  { color: string; bg: string; border: string }
> = {
  "Documents Preparing": { color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
  "Financial Documents": { color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  "CAS Received": { color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe" },
  "Visa Submitted": { color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" },
  "Biometrics Completed": {
    color: "#0ea5e9",
    bg: "#f0f9ff",
    border: "#bae6fd",
  },
  "Under Processing": { color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe" },
  "Visa Approved": { color: "#059669", bg: "#ecfdf5", border: "#a7f3d0" },
  "Visa Rejected": { color: "#ef4444", bg: "#fef2f2", border: "#fecaca" },
};

const DOC_STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  Uploaded: { color: "#059669", bg: "#ecfdf5" },
  Pending: { color: "#f59e0b", bg: "#fffbeb" },
  Rejected: { color: "#ef4444", bg: "#fef2f2" },
  "Not Required": { color: "#6b7280", bg: "#f9fafb" },
};

const BIOMETRICS_CONFIG: Record<string, { color: string; bg: string }> = {
  Done: { color: "#059669", bg: "#ecfdf5" },
  Pending: { color: "#f59e0b", bg: "#fffbeb" },
  Scheduled: { color: "#3b82f6", bg: "#eff6ff" },
  "N/A": { color: "#6b7280", bg: "#f9fafb" },
};

const NEXT_ACTION_CONFIG: Record<
  NextAction,
  { color: string; bg: string; icon: React.ReactNode }
> = {
  "Upload CAS": {
    color: "#8b5cf6",
    bg: "#f5f3ff",
    icon: <FiFileText size={12} />,
  },
  "Upload Bank Statement": {
    color: "#f59e0b",
    bg: "#fffbeb",
    icon: <FiFileText size={12} />,
  },
  "Book Biometrics": {
    color: "#0ea5e9",
    bg: "#f0f9ff",
    icon: <FiCamera size={12} />,
  },
  "Submit Visa": {
    color: "#3b82f6",
    bg: "#eff6ff",
    icon: <FiSend size={12} />,
  },
  "Schedule Interview": {
    color: "#6366f1",
    bg: "#eef2ff",
    icon: <FiCalendar size={12} />,
  },
  "Track Decision": {
    color: "#6b7280",
    bg: "#f9fafb",
    icon: <FiActivity size={12} />,
  },
  "Book Flight": {
    color: "#059669",
    bg: "#ecfdf5",
    icon: <FiArrowRight size={12} />,
  },
  "Appeal / Reapply": {
    color: "#ef4444",
    bg: "#fef2f2",
    icon: <FiArrowRight size={12} />,
  },
};

const PIPELINE_STAGES: { label: string; color: string }[] = [
  { label: "Documents Preparing", color: "#f59e0b" },
  { label: "Financial Documents", color: "#d97706" },
  { label: "CAS Received", color: "#8b5cf6" },
  { label: "Visa Submitted", color: "#3b82f6" },
  { label: "Biometrics Completed", color: "#0ea5e9" },
  { label: "Under Processing", color: "#6366f1" },
  { label: "Visa Approved", color: "#059669" },
];

// ════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════

const getDocCompletionPercent = (docs: VisaDocument[]) => {
  const required = docs.filter((d) => d.status !== "Not Required");
  const uploaded = required.filter((d) => d.status === "Uploaded");
  return required.length > 0
    ? Math.round((uploaded.length / required.length) * 100)
    : 100;
};

const getDaysUntil = (date: string | null): number | null => {
  if (!date) return null;
  return Math.ceil(
    (new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
};

// ════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════

const VisaProcessingPage = () => {
  const [cases] = useState<VisaCase[]>(DUMMY_VISA_CASES);
  const [filtered, setFiltered] = useState<VisaCase[]>(DUMMY_VISA_CASES);
  const [searchText, setSearchText] = useState("");
  const [countryFilter, setCountryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [counselorFilter, setCounselorFilter] = useState<string | null>(null);
  const [intakeFilter, setIntakeFilter] = useState<string | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<VisaCase | null>(null);
  const [pipelineOpen, setPipelineOpen] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AddVisaCaseFormValues>({
    defaultValues: {
      student: "",
      email: "",
      country: "",
      university: "",
      course: "",
      counselor: "",
      intake: "",
      visaType: "",
    },
  });

  // ─── Filters ───
  useEffect(() => {
    let result = [...cases];
    if (searchText) {
      const q = searchText.toLowerCase();
      result = result.filter(
        (c) =>
          c.student.toLowerCase().includes(q) ||
          c.university.toLowerCase().includes(q),
      );
    }
    if (countryFilter)
      result = result.filter((c) => c.country === countryFilter);
    if (statusFilter)
      result = result.filter((c) => c.visaStatus === statusFilter);
    if (counselorFilter)
      result = result.filter((c) => c.counselor === counselorFilter);
    if (intakeFilter) result = result.filter((c) => c.intake === intakeFilter);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFiltered(result);
  }, [
    searchText,
    countryFilter,
    statusFilter,
    counselorFilter,
    intakeFilter,
    cases,
  ]);

  // ─── Stats ───
  const stats = [
    {
      label: "Total Visa Cases",
      value: cases.length,
      icon: FiShield,
      color: "#3b82f6",
      bg: "#eff6ff",
      border: "#bfdbfe",
    },
    {
      label: "Docs Preparing",
      value: cases.filter((c) =>
        ["Documents Preparing", "Financial Documents"].includes(c.visaStatus),
      ).length,
      icon: FiFileText,
      color: "#f59e0b",
      bg: "#fffbeb",
      border: "#fde68a",
    },
    {
      label: "Submitted",
      value: cases.filter((c) =>
        ["Visa Submitted", "Biometrics Completed", "Under Processing"].includes(
          c.visaStatus,
        ),
      ).length,
      icon: FiSend,
      color: "#6366f1",
      bg: "#f5f3ff",
      border: "#ddd6fe",
    },
    {
      label: "Approved",
      value: cases.filter((c) => c.visaStatus === "Visa Approved").length,
      icon: FiCheckCircle,
      color: "#059669",
      bg: "#ecfdf5",
      border: "#a7f3d0",
    },
    {
      label: "Rejected",
      value: cases.filter((c) => c.visaStatus === "Visa Rejected").length,
      icon: FiXCircle,
      color: "#ef4444",
      bg: "#fef2f2",
      border: "#fecaca",
    },
    {
      label: "Avg Processing",
      value: `${Math.round(cases.reduce((s, c) => s + c.processingDays, 0) / cases.length)}d`,
      icon: FiClock,
      color: "#0ea5e9",
      bg: "#f0f9ff",
      border: "#bae6fd",
    },
  ];

  // ─── Alerts ───
  const upcomingInterviews = cases.filter((c) => {
    const days = getDaysUntil(c.interviewDate);
    return days !== null && days >= 0 && days <= 14;
  });

  const casRequired = cases.filter((c) => c.casRequired && !c.casReceived);

  const onAddCase = (data: AddVisaCaseFormValues) => {
    message.success(`Visa case for ${data.student} created!`);
    setAddOpen(false);
    reset();
  };

  // ─── Table columns ───
  const columns: ColumnsType<VisaCase> = [
    {
      title: "Student",
      dataIndex: "student",
      key: "student",
      fixed: "left",
      width: 180,
      sorter: (a, b) => a.student.localeCompare(b.student),
      render: (name: string, record) => (
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{
              backgroundColor: [
                "#3b82f6",
                "#6366f1",
                "#8b5cf6",
                "#0ea5e9",
                "#059669",
                "#f59e0b",
              ][name.charCodeAt(0) % 6],
            }}
          >
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1a2540] m-0 leading-tight">
              {name}
            </p>
            <p className="text-[11px] text-[#8a95b0] m-0">{record.visaType}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      width: 140,
      render: (text: string, record) => (
        <span className="text-sm text-[#1a2540]">
          {record.countryFlag} {text}
        </span>
      ),
    },
    {
      title: "University",
      dataIndex: "university",
      key: "university",
      width: 180,
      render: (text: string, record) => (
        <div>
          <p className="text-sm font-medium text-[#1a2540] m-0">{text}</p>
          <p className="text-[11px] text-[#8a95b0] m-0">{record.course}</p>
        </div>
      ),
    },
    {
      title: "Counselor",
      dataIndex: "counselor",
      key: "counselor",
      width: 120,
      render: (text: string) => (
        <span className="text-sm text-[#1a2540]">{text}</span>
      ),
    },
    {
      title: "Docs",
      key: "docs",
      width: 70,
      align: "center",
      render: (_, record) => {
        const pct = getDocCompletionPercent(record.documents);
        return (
          <Tooltip title={`${pct}% documents ready`}>
            <Progress
              type="circle"
              percent={pct}
              size={32}
              strokeWidth={10}
              strokeColor={
                pct === 100 ? "#059669" : pct >= 50 ? "#3b82f6" : "#f59e0b"
              }
              format={() => (
                <span style={{ fontSize: 9, fontWeight: 700 }}>{pct}%</span>
              )}
            />
          </Tooltip>
        );
      },
    },
    {
      title: "Biometrics",
      dataIndex: "biometrics",
      key: "biometrics",
      width: 110,
      align: "center",
      render: (val: string) => {
        const config = BIOMETRICS_CONFIG[val];
        return (
          <span
            className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold"
            style={{ color: config.color, backgroundColor: config.bg }}
          >
            {val === "Done" && <FiCheckCircle size={11} />}
            {val}
          </span>
        );
      },
    },
    {
      title: "Visa Status",
      dataIndex: "visaStatus",
      key: "visaStatus",
      width: 170,
      filters: Object.keys(VISA_STATUS_CONFIG).map((s) => ({
        text: s,
        value: s,
      })),
      onFilter: (value, record) => record.visaStatus === value,
      render: (status: VisaStatus) => {
        const config = VISA_STATUS_CONFIG[status];
        return (
          <Tag
            style={{
              color: config.color,
              backgroundColor: config.bg,
              border: `1px solid ${config.border}`,
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 11,
              margin: 0,
            }}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Decision",
      dataIndex: "decisionDate",
      key: "decisionDate",
      width: 110,
      align: "center",
      render: (date: string | null) =>
        date ? (
          <span className="text-sm font-medium text-[#1a2540]">
            {new Date(date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })}
          </span>
        ) : (
          <span className="text-xs text-[#8a95b0]">Awaiting</span>
        ),
    },
    {
      title: "Next Action",
      dataIndex: "nextAction",
      key: "nextAction",
      width: 200,
      render: (action: NextAction) => {
        const config = NEXT_ACTION_CONFIG[action];
        return (
          <span
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold"
            style={{ color: config.color, backgroundColor: config.bg }}
          >
            {config.icon}
            {action}
          </span>
        );
      },
    },
    {
      title: "",
      key: "actions",
      width: 50,
      fixed: "right",
      render: (_, record) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                key: "view",
                label: (
                  <span className="flex items-center gap-2 text-sm">
                    <FiEye size={13} /> View Details
                  </span>
                ),
                onClick: () => {
                  setSelectedCase(record);
                  setDetailOpen(true);
                },
              },
              {
                key: "edit",
                label: (
                  <span className="flex items-center gap-2 text-sm">
                    <FiEdit2 size={13} /> Edit
                  </span>
                ),
              },
              { type: "divider" },
              {
                key: "delete",
                label: (
                  <span className="flex items-center gap-2 text-sm text-red-500">
                    <FiTrash2 size={13} /> Delete
                  </span>
                ),
              },
            ],
          }}
        >
          <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-transparent border border-transparent hover:bg-gray-50 hover:border-gray-200 cursor-pointer transition-all duration-200">
            <FiMoreVertical size={15} className="text-[#8a95b0]" />
          </button>
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="px-6 py-8">
      {/* ═══ Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1a2540] m-0">
            Visa Processing
          </h1>
          <p className="text-sm text-[#8a95b0] mt-1 m-0">
            Track visa applications, documents & embassy decisions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            icon={<FiDownload size={14} />}
            className="flex items-center justify-center"
          />
          <Button
            onClick={() => setPipelineOpen(true)}
            className="flex items-center gap-1.5"
          >
            <FiTrendingUp size={14} /> Pipeline
          </Button>
          <Button
            type="primary"
            icon={<FiPlus size={14} />}
            onClick={() => {
              reset();
              setAddOpen(true);
            }}
            className="flex items-center gap-1.5"
          >
            New Visa Case
          </Button>
        </div>
      </div>

      {/* ═══ 2️⃣ Alerts ═══ */}
      {(upcomingInterviews.length > 0 || casRequired.length > 0) && (
        <div className="space-y-3 mb-6">
          {upcomingInterviews.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 flex items-start gap-3">
              <FiCalendar size={18} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-blue-800 m-0 mb-1">
                  {upcomingInterviews.length} visa interview
                  {upcomingInterviews.length > 1 ? "s" : ""} scheduled
                </p>
                <div className="flex flex-wrap gap-2">
                  {upcomingInterviews.map((c) => (
                    <span
                      key={c.key}
                      className="inline-flex items-center gap-1.5 bg-white border border-blue-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-blue-700 cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() => {
                        setSelectedCase(c);
                        setDetailOpen(true);
                      }}
                    >
                      {c.student} —{" "}
                      {new Date(c.interviewDate!).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {casRequired.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-start gap-3">
              <FiAlertTriangle
                size={18}
                className="text-amber-500 shrink-0 mt-0.5"
              />
              <div>
                <p className="text-sm font-bold text-amber-800 m-0 mb-1">
                  CAS required for {casRequired.length} student
                  {casRequired.length > 1 ? "s" : ""}
                </p>
                <div className="flex flex-wrap gap-2">
                  {casRequired.map((c) => (
                    <span
                      key={c.key}
                      className="inline-flex items-center gap-1.5 bg-white border border-amber-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-amber-700"
                    >
                      {c.student} — {c.university}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ 1️⃣ Stats ═══ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {stats.map(({ label, value, icon: Icon, color, bg, border }) => (
          <div
            key={label}
            className="bg-white rounded-xl p-4 border transition-all duration-200 hover:shadow-md group"
            style={{ borderColor: border }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                style={{ backgroundColor: bg, color }}
              >
                <Icon size={17} />
              </div>
            </div>
            <p
              className="text-xl font-extrabold m-0 leading-none"
              style={{ color }}
            >
              {value}
            </p>
            <p className="text-[11px] font-medium text-[#8a95b0] m-0 mt-1.5">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* ═══ 3️⃣ Filters + 4️⃣ Table ═══ */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Search student, university..."
              prefix={<FiSearch size={14} className="text-[#b4bcd4]" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              style={{ width: 240 }}
            />
            <Select
              placeholder="Country"
              allowClear
              value={countryFilter}
              onChange={(v) => setCountryFilter(v)}
              style={{ width: 150 }}
              options={[...new Set(cases.map((c) => c.country))].map((c) => ({
                label: c,
                value: c,
              }))}
            />
            <Select
              placeholder="Visa Status"
              allowClear
              value={statusFilter}
              onChange={(v) => setStatusFilter(v)}
              style={{ width: 180 }}
              options={Object.keys(VISA_STATUS_CONFIG).map((s) => ({
                label: s,
                value: s,
              }))}
            />
            <Select
              placeholder="Counselor"
              allowClear
              value={counselorFilter}
              onChange={(v) => setCounselorFilter(v)}
              style={{ width: 150 }}
              options={[...new Set(cases.map((c) => c.counselor))].map((c) => ({
                label: c,
                value: c,
              }))}
            />
            <Select
              placeholder="Intake"
              allowClear
              value={intakeFilter}
              onChange={(v) => setIntakeFilter(v)}
              style={{ width: 130 }}
              options={[...new Set(cases.map((c) => c.intake))].map((i) => ({
                label: i,
                value: i,
              }))}
            />
            <span className="text-xs text-[#8a95b0] ml-auto">
              <span className="font-semibold text-[#1a2540]">
                {filtered.length}
              </span>{" "}
              of {cases.length}
            </span>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="key"
          scroll={{ x: 1500 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
            style: { padding: "12px 20px", margin: 0 },
          }}
          rowClassName={() =>
            "hover:bg-blue-50/30 transition-colors duration-150"
          }
        />
      </div>

      {/* ═══ Add Case Modal ═══ */}
      <CustomModal
        open={addOpen}
        onClose={() => {
          setAddOpen(false);
          reset();
        }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
              <FiPlus size={18} className="text-blue-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1a2540] m-0">
                New Visa Case
              </h3>
              <p className="text-xs text-[#8a95b0] m-0 mt-0.5">
                Create a visa processing case
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setAddOpen(false);
              reset();
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-transparent border border-transparent hover:bg-gray-100 cursor-pointer transition-all"
          >
            <FiX size={16} className="text-[#8a95b0]" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onAddCase)}
          className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto"
        >
          <div className="grid grid-cols-2 gap-4">
            <CustomInput<AddVisaCaseFormValues>
              name="student"
              label="Student Name"
              placeholder="Full name"
              control={control}
              size="large"
              type="text"
              icon={<FiUser size={14} className="text-[#b4bcd4]" />}
              rules={{ required: "Name is required" }}
            />
            <CustomInput<AddVisaCaseFormValues>
              name="email"
              label="Email"
              placeholder="student@email.com"
              control={control}
              size="large"
              type="email"
              icon={<FiMail size={14} className="text-[#b4bcd4]" />}
              rules={{ required: "Email is required" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <CustomSelect
              name="country"
              label="Country"
              placeholder="Select country"
              control={
                control as unknown as import("react-hook-form").Control<FieldValues>
              }
              errors={
                errors as unknown as import("react-hook-form").FieldErrors<FieldValues>
              }
              required
              rules={{ required: "Country is required" }}
              options={[
                { value: "United Kingdom", label: "🇬🇧 United Kingdom" },
                { value: "Canada", label: "🇨🇦 Canada" },
                { value: "Australia", label: "🇦🇺 Australia" },
                { value: "USA", label: "🇺🇸 USA" },
                { value: "Germany", label: "🇩🇪 Germany" },
              ]}
            />
            <CustomSelect
              name="visaType"
              label="Visa Type"
              placeholder="Select type"
              control={
                control as unknown as import("react-hook-form").Control<FieldValues>
              }
              errors={
                errors as unknown as import("react-hook-form").FieldErrors<FieldValues>
              }
              required
              rules={{ required: "Visa type is required" }}
              options={[
                { value: "Tier 4 Student", label: "Tier 4 Student (UK)" },
                { value: "Subclass 500", label: "Subclass 500 (AU)" },
                { value: "Study Permit", label: "Study Permit (CA)" },
                { value: "F-1 Visa", label: "F-1 Visa (US)" },
                { value: "National Visa", label: "National Visa (DE)" },
              ]}
            />
          </div>
          <CustomInput<AddVisaCaseFormValues>
            name="university"
            label="University"
            placeholder="University name"
            control={control}
            size="large"
            type="text"
            icon={<FiBookOpen size={14} className="text-[#b4bcd4]" />}
            rules={{ required: "University is required" }}
          />
          <CustomInput<AddVisaCaseFormValues>
            name="course"
            label="Course"
            placeholder="e.g. MSc Data Science"
            control={control}
            size="large"
            type="text"
            icon={<FiBookOpen size={14} className="text-[#b4bcd4]" />}
            rules={{ required: "Course is required" }}
          />
          <div className="grid grid-cols-2 gap-4">
            <CustomSelect
              name="counselor"
              label="Counselor"
              placeholder="Assign counselor"
              control={
                control as unknown as import("react-hook-form").Control<FieldValues>
              }
              errors={
                errors as unknown as import("react-hook-form").FieldErrors<FieldValues>
              }
              required
              rules={{ required: "Counselor is required" }}
              options={[
                { value: "Priya Sharma", label: "Priya Sharma" },
                { value: "Ganesh Kumar", label: "Ganesh Kumar" },
                { value: "Sneha Reddy", label: "Sneha Reddy" },
              ]}
            />
            <CustomSelect
              name="intake"
              label="Intake"
              placeholder="Select intake"
              control={
                control as unknown as import("react-hook-form").Control<FieldValues>
              }
              errors={
                errors as unknown as import("react-hook-form").FieldErrors<FieldValues>
              }
              required
              rules={{ required: "Intake is required" }}
              options={[
                { value: "Jan 2027", label: "Jan 2027" },
                { value: "May 2026", label: "May 2026" },
                { value: "Sep 2026", label: "Sep 2026" },
              ]}
            />
          </div>
          <div className="flex gap-3 pt-3">
            <Button
              block
              size="large"
              onClick={() => {
                setAddOpen(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button block size="large" type="primary" htmlType="submit">
              <span className="flex items-center justify-center gap-2">
                <FiPlus size={14} /> Create Case
              </span>
            </Button>
          </div>
        </form>
      </CustomModal>

      {/* ═══ Detail Modal (5️⃣ 6️⃣ 7️⃣) ═══ */}
      <CustomModal
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedCase(null);
        }}
      >
        {selectedCase && (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                  <FiShield size={18} className="text-blue-500" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1a2540] m-0">
                    {selectedCase.student}
                  </h3>
                  <p className="text-xs text-[#8a95b0] m-0 mt-0.5">
                    {selectedCase.university} — {selectedCase.visaType}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setDetailOpen(false);
                  setSelectedCase(null);
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-transparent border border-transparent hover:bg-gray-100 cursor-pointer transition-all"
              >
                <FiX size={16} className="text-[#8a95b0]" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Status cards */}
              <div className="grid grid-cols-3 gap-3">
                <div
                  className="rounded-lg p-3 text-center border"
                  style={{
                    backgroundColor:
                      VISA_STATUS_CONFIG[selectedCase.visaStatus].bg,
                    borderColor:
                      VISA_STATUS_CONFIG[selectedCase.visaStatus].border,
                  }}
                >
                  <p
                    className="text-sm font-bold m-0"
                    style={{
                      color: VISA_STATUS_CONFIG[selectedCase.visaStatus].color,
                    }}
                  >
                    {selectedCase.visaStatus}
                  </p>
                  <p className="text-[10px] text-[#8a95b0] m-0 mt-0.5">
                    Visa Status
                  </p>
                </div>
                <div
                  className="rounded-lg p-3 text-center border"
                  style={{
                    backgroundColor:
                      BIOMETRICS_CONFIG[selectedCase.biometrics].bg,
                  }}
                >
                  <p
                    className="text-sm font-bold m-0"
                    style={{
                      color: BIOMETRICS_CONFIG[selectedCase.biometrics].color,
                    }}
                  >
                    {selectedCase.biometrics}
                  </p>
                  <p className="text-[10px] text-[#8a95b0] m-0 mt-0.5">
                    Biometrics
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                  <p className="text-sm font-bold text-[#1a2540] m-0">
                    {selectedCase.processingDays}d
                  </p>
                  <p className="text-[10px] text-[#8a95b0] m-0 mt-0.5">
                    Processing
                  </p>
                </div>
              </div>

              {/* Interview alert */}
              {selectedCase.interviewDate &&
                (() => {
                  const days = getDaysUntil(selectedCase.interviewDate);
                  if (days !== null && days >= 0 && days <= 14) {
                    return (
                      <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5">
                        <FiCalendar size={14} className="text-blue-500" />
                        <span className="text-xs font-semibold text-blue-800">
                          Interview in {days} days —{" "}
                          {new Date(
                            selectedCase.interviewDate,
                          ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    );
                  }
                  return null;
                })()}

              {/* Info rows */}
              <div className="space-y-2">
                {[
                  {
                    label: "Country",
                    value: `${selectedCase.countryFlag} ${selectedCase.country}`,
                  },
                  { label: "Counselor", value: selectedCase.counselor },
                  { label: "Intake", value: selectedCase.intake },
                  { label: "Visa Type", value: selectedCase.visaType },
                  {
                    label: "Decision",
                    value: selectedCase.decisionDate
                      ? new Date(selectedCase.decisionDate).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" },
                        )
                      : "Awaiting",
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-2 border-b border-gray-50"
                  >
                    <span className="text-xs text-[#8a95b0] font-medium">
                      {label}
                    </span>
                    <span className="text-sm font-semibold text-[#1a2540]">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Documents */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-[#1a2540] m-0">
                    Document Checklist
                  </h4>
                  <span className="text-xs font-semibold text-[#8a95b0]">
                    {getDocCompletionPercent(selectedCase.documents)}% ready
                  </span>
                </div>
                <div className="space-y-2">
                  {selectedCase.documents.map((doc) => {
                    const config = DOC_STATUS_CONFIG[doc.status];
                    return (
                      <div
                        key={doc.name}
                        className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 border border-gray-100"
                      >
                        <div className="flex items-center gap-2">
                          <FiFileText size={14} className="text-[#8a95b0]" />
                          <span className="text-sm font-medium text-[#1a2540]">
                            {doc.name}
                          </span>
                        </div>
                        <span
                          className="text-xs font-semibold rounded-md px-2 py-0.5"
                          style={{
                            color: config.color,
                            backgroundColor: config.bg,
                          }}
                        >
                          {doc.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Next Action CTA */}
              <div className="pt-2">
                <Button type="primary" block size="large">
                  <span className="flex items-center justify-center gap-2">
                    {NEXT_ACTION_CONFIG[selectedCase.nextAction].icon}
                    {selectedCase.nextAction}
                  </span>
                </Button>
              </div>
            </div>
          </>
        )}
      </CustomModal>

      {/* ═══ 8️⃣ Pipeline Modal ═══ */}
      <CustomModal open={pipelineOpen} onClose={() => setPipelineOpen(false)}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
              <FiTrendingUp size={18} className="text-indigo-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1a2540] m-0">
                Visa Pipeline
              </h3>
              <p className="text-xs text-[#8a95b0] m-0 mt-0.5">
                Overview of all visa stages
              </p>
            </div>
          </div>
          <button
            onClick={() => setPipelineOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-transparent border border-transparent hover:bg-gray-100 cursor-pointer transition-all"
          >
            <FiX size={16} className="text-[#8a95b0]" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-3">
          {PIPELINE_STAGES.map((stage, index) => {
            const count = cases.filter(
              (c) => c.visaStatus === stage.label,
            ).length;
            const maxCount = Math.max(
              ...PIPELINE_STAGES.map(
                (s) => cases.filter((c) => c.visaStatus === s.label).length,
              ),
              1,
            );
            const pct = (count / maxCount) * 100;
            return (
              <div key={stage.label}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold"
                      style={{ backgroundColor: stage.color }}
                    >
                      {index + 1}
                    </div>
                    <span className="text-sm font-semibold text-[#1a2540]">
                      {stage.label}
                    </span>
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{ color: stage.color }}
                  >
                    {count}
                  </span>
                </div>
                <div className="h-3 bg-gray-50 rounded-full overflow-hidden ml-8">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct || 3}%`,
                      backgroundColor: stage.color,
                    }}
                  />
                </div>
                {index < PIPELINE_STAGES.length - 1 && (
                  <div className="flex justify-center my-1">
                    <FiChevronRight
                      size={14}
                      className="text-[#d1d5db] rotate-90"
                    />
                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md flex items-center justify-center bg-red-500 text-white text-[10px] font-bold">
                  ✕
                </div>
                <span className="text-sm font-semibold text-[#1a2540]">
                  Visa Rejected
                </span>
              </div>
              <span className="text-sm font-bold text-red-500">
                {cases.filter((c) => c.visaStatus === "Visa Rejected").length}
              </span>
            </div>
            <div className="h-3 bg-gray-50 rounded-full overflow-hidden ml-8">
              <div
                className="h-full rounded-full bg-red-500"
                style={{
                  width: `${(cases.filter((c) => c.visaStatus === "Visa Rejected").length / cases.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default VisaProcessingPage;
