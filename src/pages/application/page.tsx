import { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Input,
  Select,
  Button,
  Badge,
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
  FiAward,
  FiTrendingUp,
  FiSearch,
  FiPlus,
  FiMoreVertical,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiAlertTriangle,
  FiUpload,
  FiX,
  FiUser,
  FiMail,
  FiBookOpen,
  FiArrowRight,
  FiRefreshCw,
  FiDownload,
  FiChevronRight,
} from "react-icons/fi";

import CustomModal from "../../components/common/CustomModal";
import CustomInput from "../../components/common/CustomInput";
import CustomSelect from "../../components/common/CustomSelect";

type OfferStatus =
  | "Draft"
  | "Documents Pending"
  | "Submitted"
  | "Offer Received"
  | "Conditional Offer"
  | "Unconditional Offer"
  | "Rejected"
  | "Accepted";

type NextAction =
  | "Upload Documents"
  | "Accept Offer"
  | "Pay Deposit"
  | "Follow-up with University"
  | "Reapply"
  | "Awaiting Response";

interface Document {
  name: string;
  status: "Uploaded" | "Pending" | "Rejected" | "Not Required";
}

interface Application {
  key: string;
  student: string;
  email: string;
  country: string;
  countryFlag: string;
  university: string;
  course: string;
  counselor: string;
  intake: string;
  appliedDate: string;
  offerStatus: OfferStatus;
  scholarship: string;
  nextAction: NextAction;
  offerExpiry: string | null;
  documents: Document[];
  processingDays: number;
}

interface AddApplicationFormValues {
  student: string;
  email: string;
  country: string;
  university: string;
  course: string;
  counselor: string;
  intake: string;
}

const DUMMY_APPLICATIONS: Application[] = [
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
    appliedDate: "2026-02-15",
    offerStatus: "Submitted",
    scholarship: "—",
    nextAction: "Follow-up with University",
    offerExpiry: null,
    documents: [
      { name: "Passport", status: "Uploaded" },
      { name: "SOP", status: "Uploaded" },
      { name: "LOR", status: "Uploaded" },
      { name: "CV", status: "Uploaded" },
      { name: "Transcripts", status: "Uploaded" },
      { name: "IELTS", status: "Uploaded" },
    ],
    processingDays: 22,
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
    appliedDate: "2026-01-20",
    offerStatus: "Unconditional Offer",
    scholarship: "£3,000",
    nextAction: "Accept Offer",
    offerExpiry: "2026-03-16",
    documents: [
      { name: "Passport", status: "Uploaded" },
      { name: "SOP", status: "Uploaded" },
      { name: "LOR", status: "Uploaded" },
      { name: "CV", status: "Uploaded" },
      { name: "Transcripts", status: "Uploaded" },
      { name: "IELTS", status: "Uploaded" },
    ],
    processingDays: 18,
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
    appliedDate: "2026-01-05",
    offerStatus: "Rejected",
    scholarship: "—",
    nextAction: "Reapply",
    offerExpiry: null,
    documents: [
      { name: "Passport", status: "Uploaded" },
      { name: "SOP", status: "Uploaded" },
      { name: "LOR", status: "Pending" },
      { name: "CV", status: "Uploaded" },
      { name: "Transcripts", status: "Rejected" },
      { name: "IELTS", status: "Uploaded" },
    ],
    processingDays: 35,
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
    appliedDate: "2026-02-28",
    offerStatus: "Documents Pending",
    scholarship: "—",
    nextAction: "Upload Documents",
    offerExpiry: null,
    documents: [
      { name: "Passport", status: "Uploaded" },
      { name: "SOP", status: "Pending" },
      { name: "LOR", status: "Pending" },
      { name: "CV", status: "Uploaded" },
      { name: "Transcripts", status: "Pending" },
      { name: "IELTS", status: "Uploaded" },
    ],
    processingDays: 9,
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
    appliedDate: "2026-03-01",
    offerStatus: "Conditional Offer",
    scholarship: "£2,000",
    nextAction: "Pay Deposit",
    offerExpiry: "2026-03-20",
    documents: [
      { name: "Passport", status: "Uploaded" },
      { name: "SOP", status: "Uploaded" },
      { name: "LOR", status: "Uploaded" },
      { name: "CV", status: "Uploaded" },
      { name: "Transcripts", status: "Uploaded" },
      { name: "IELTS", status: "Pending" },
    ],
    processingDays: 8,
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
    appliedDate: "2025-12-10",
    offerStatus: "Accepted",
    scholarship: "AUD 5,000",
    nextAction: "Awaiting Response",
    offerExpiry: null,
    documents: [
      { name: "Passport", status: "Uploaded" },
      { name: "SOP", status: "Uploaded" },
      { name: "LOR", status: "Uploaded" },
      { name: "CV", status: "Uploaded" },
      { name: "Transcripts", status: "Uploaded" },
      { name: "IELTS", status: "Uploaded" },
    ],
    processingDays: 28,
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
    appliedDate: "2026-02-20",
    offerStatus: "Offer Received",
    scholarship: "—",
    nextAction: "Accept Offer",
    offerExpiry: "2026-03-12",
    documents: [
      { name: "Passport", status: "Uploaded" },
      { name: "SOP", status: "Uploaded" },
      { name: "LOR", status: "Uploaded" },
      { name: "CV", status: "Uploaded" },
      { name: "Transcripts", status: "Uploaded" },
      { name: "IELTS", status: "Uploaded" },
    ],
    processingDays: 17,
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
    appliedDate: "2026-03-05",
    offerStatus: "Draft",
    scholarship: "—",
    nextAction: "Upload Documents",
    offerExpiry: null,
    documents: [
      { name: "Passport", status: "Uploaded" },
      { name: "SOP", status: "Pending" },
      { name: "LOR", status: "Pending" },
      { name: "CV", status: "Pending" },
      { name: "Transcripts", status: "Pending" },
      { name: "IELTS", status: "Not Required" },
    ],
    processingDays: 4,
  },
];

// ════════════════════════════════════════════════
// STATUS CONFIGS
// ════════════════════════════════════════════════

const OFFER_STATUS_CONFIG: Record<
  OfferStatus,
  { color: string; bg: string; border: string }
> = {
  Draft: { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb" },
  "Documents Pending": { color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
  Submitted: { color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" },
  "Offer Received": { color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd" },
  "Conditional Offer": { color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe" },
  "Unconditional Offer": { color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe" },
  Rejected: { color: "#ef4444", bg: "#fef2f2", border: "#fecaca" },
  Accepted: { color: "#059669", bg: "#ecfdf5", border: "#a7f3d0" },
};

const DOC_STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  Uploaded: { color: "#059669", bg: "#ecfdf5" },
  Pending: { color: "#f59e0b", bg: "#fffbeb" },
  Rejected: { color: "#ef4444", bg: "#fef2f2" },
  "Not Required": { color: "#6b7280", bg: "#f9fafb" },
};

const NEXT_ACTION_CONFIG: Record<
  NextAction,
  { color: string; bg: string; icon: React.ReactNode }
> = {
  "Upload Documents": {
    color: "#f59e0b",
    bg: "#fffbeb",
    icon: <FiUpload size={12} />,
  },
  "Accept Offer": {
    color: "#059669",
    bg: "#ecfdf5",
    icon: <FiCheckCircle size={12} />,
  },
  "Pay Deposit": {
    color: "#7c3aed",
    bg: "#f5f3ff",
    icon: <FiFileText size={12} />,
  },
  "Follow-up with University": {
    color: "#3b82f6",
    bg: "#eff6ff",
    icon: <FiRefreshCw size={12} />,
  },
  Reapply: {
    color: "#ef4444",
    bg: "#fef2f2",
    icon: <FiArrowRight size={12} />,
  },
  "Awaiting Response": {
    color: "#6b7280",
    bg: "#f9fafb",
    icon: <FiClock size={12} />,
  },
};

// Pipeline stages
const PIPELINE_STAGES: { label: string; color: string }[] = [
  { label: "Draft", color: "#6b7280" },
  { label: "Documents Pending", color: "#f59e0b" },
  { label: "Submitted", color: "#3b82f6" },
  { label: "Offer Received", color: "#0ea5e9" },
  { label: "Conditional Offer", color: "#8b5cf6" },
  { label: "Unconditional Offer", color: "#6366f1" },
  { label: "Accepted", color: "#059669" },
];

// ════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════

const getDaysUntilExpiry = (expiry: string | null): number | null => {
  if (!expiry) return null;
  const diff = new Date(expiry).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const getDocCompletionPercent = (docs: Document[]) => {
  const required = docs.filter((d) => d.status !== "Not Required");
  const uploaded = required.filter((d) => d.status === "Uploaded");
  return required.length > 0
    ? Math.round((uploaded.length / required.length) * 100)
    : 100;
};

// ════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════

const ApplicationPage = () => {
  const [applications] = useState<Application[]>(DUMMY_APPLICATIONS);
  const [filtered, setFiltered] = useState<Application[]>(DUMMY_APPLICATIONS);
  const [searchText, setSearchText] = useState("");
  const [countryFilter, setCountryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [counselorFilter, setCounselorFilter] = useState<string | null>(null);
  const [intakeFilter, setIntakeFilter] = useState<string | null>(null);

  // Modals
  const [addOpen, setAddOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [pipelineOpen, setPipelineOpen] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AddApplicationFormValues>({
    defaultValues: {
      student: "",
      email: "",
      country: "",
      university: "",
      course: "",
      counselor: "",
      intake: "",
    },
  });

  // ─── Filters ───
  useEffect(() => {
    let result = [...applications];
    if (searchText) {
      const q = searchText.toLowerCase();
      result = result.filter(
        (a) =>
          a.student.toLowerCase().includes(q) ||
          a.university.toLowerCase().includes(q) ||
          a.course.toLowerCase().includes(q),
      );
    }
    if (countryFilter)
      result = result.filter((a) => a.country === countryFilter);
    if (statusFilter)
      result = result.filter((a) => a.offerStatus === statusFilter);
    if (counselorFilter)
      result = result.filter((a) => a.counselor === counselorFilter);
    if (intakeFilter) result = result.filter((a) => a.intake === intakeFilter);
    setFiltered(result);
  }, [
    searchText,
    countryFilter,
    statusFilter,
    counselorFilter,
    intakeFilter,
    applications,
  ]);

  // ─── Stats ───
  const stats = [
    {
      label: "Total Applications",
      value: applications.length,
      icon: FiFileText,
      color: "#3b82f6",
      bg: "#eff6ff",
      border: "#bfdbfe",
    },
    {
      label: "In Progress",
      value: applications.filter((a) =>
        ["Draft", "Documents Pending", "Submitted"].includes(a.offerStatus),
      ).length,
      icon: FiClock,
      color: "#f59e0b",
      bg: "#fffbeb",
      border: "#fde68a",
    },
    {
      label: "Offers Received",
      value: applications.filter((a) =>
        ["Offer Received", "Conditional Offer", "Unconditional Offer"].includes(
          a.offerStatus,
        ),
      ).length,
      icon: FiAward,
      color: "#6366f1",
      bg: "#f5f3ff",
      border: "#ddd6fe",
    },
    {
      label: "Accepted",
      value: applications.filter((a) => a.offerStatus === "Accepted").length,
      icon: FiCheckCircle,
      color: "#059669",
      bg: "#ecfdf5",
      border: "#a7f3d0",
    },
    {
      label: "Rejected",
      value: applications.filter((a) => a.offerStatus === "Rejected").length,
      icon: FiXCircle,
      color: "#ef4444",
      bg: "#fef2f2",
      border: "#fecaca",
    },
    {
      label: "Avg Offer Time",
      value: `${Math.round(applications.reduce((s, a) => s + a.processingDays, 0) / applications.length)}d`,
      icon: FiTrendingUp,
      color: "#0ea5e9",
      bg: "#f0f9ff",
      border: "#bae6fd",
    },
  ];

  // Expiring offers
  const expiringOffers = applications.filter((a) => {
    const days = getDaysUntilExpiry(a.offerExpiry);
    return days !== null && days >= 0 && days <= 10;
  });

  // ─── Add application ───
  const onAddApplication = (data: AddApplicationFormValues) => {
    message.success(`Application for ${data.student} created!`);
    setAddOpen(false);
    reset();
  };

  // ─── Table columns ───
  const columns: ColumnsType<Application> = [
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
            <p className="text-[11px] text-[#8a95b0] m-0">{record.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      width: 120,
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
      width: 140,
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
      title: "Intake",
      dataIndex: "intake",
      key: "intake",
      width: 90,
      align: "center",
      render: (text: string) => (
        <Tag
          style={{
            color: "#3b82f6",
            backgroundColor: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 11,
          }}
        >
          {text}
        </Tag>
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
          <Tooltip title={`${pct}% documents uploaded`}>
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
      title: "Offer Status",
      dataIndex: "offerStatus",
      key: "offerStatus",
      width: 120,
      filters: Object.keys(OFFER_STATUS_CONFIG).map((s) => ({
        text: s,
        value: s,
      })),
      onFilter: (value, record) => record.offerStatus === value,
      render: (status: OfferStatus, record) => {
        const config = OFFER_STATUS_CONFIG[status];
        const days = getDaysUntilExpiry(record.offerExpiry);
        const isExpiring = days !== null && days >= 0 && days <= 7;
        return (
          <div className="flex items-center gap-1.5">
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
            {isExpiring && (
              <Tooltip title={`Offer expires in ${days} days!`}>
                <FiAlertTriangle
                  size={14}
                  className="text-amber-500 animate-pulse"
                />
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      title: "Scholarship",
      dataIndex: "scholarship",
      key: "scholarship",
      width: 100,
      align: "center",
      render: (val: string) =>
        val !== "—" ? (
          <span className="text-sm font-bold text-[#059669]">{val}</span>
        ) : (
          <span className="text-xs text-[#8a95b0]">—</span>
        ),
    },
    {
      title: "Next Action",
      dataIndex: "nextAction",
      key: "nextAction",
      width: 170,
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
                  setSelectedApp(record);
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
            Applications
          </h1>
          <p className="text-sm text-[#8a95b0] mt-1 m-0">
            Manage university applications, offers & documents
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
            New Application
          </Button>
        </div>
      </div>

      {/* ═══ 6️⃣ Offer Expiry Alerts ═══ */}
      {expiringOffers.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 mb-6 flex items-start gap-3">
          <FiAlertTriangle
            size={18}
            className="text-amber-500 shrink-0 mt-0.5"
          />
          <div>
            <p className="text-sm font-bold text-amber-800 m-0 mb-1">
              {expiringOffers.length} offer
              {expiringOffers.length > 1 ? "s" : ""} expiring soon
            </p>
            <div className="flex flex-wrap gap-2">
              {expiringOffers.map((a) => {
                const days = getDaysUntilExpiry(a.offerExpiry);
                return (
                  <span
                    key={a.key}
                    className="inline-flex items-center gap-1.5 bg-white border border-amber-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-amber-700 cursor-pointer hover:bg-amber-100 transition-colors"
                    onClick={() => {
                      setSelectedApp(a);
                      setDetailOpen(true);
                    }}
                  >
                    {a.student} — {a.university}
                    <Badge
                      count={`${days}d`}
                      style={{
                        backgroundColor: days! <= 3 ? "#ef4444" : "#f59e0b",
                        fontSize: 10,
                        height: 18,
                        lineHeight: "18px",
                      }}
                    />
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══ 1️⃣ Stats Cards ═══ */}
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

      {/* ═══ 2️⃣ Filters + 3️⃣ Table ═══ */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Filters */}
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
              options={[...new Set(applications.map((a) => a.country))].map(
                (c) => ({ label: c, value: c }),
              )}
            />
            <Select
              placeholder="Offer Status"
              allowClear
              value={statusFilter}
              onChange={(v) => setStatusFilter(v)}
              style={{ width: 170 }}
              options={Object.keys(OFFER_STATUS_CONFIG).map((s) => ({
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
              options={[...new Set(applications.map((a) => a.counselor))].map(
                (c) => ({ label: c, value: c }),
              )}
            />
            <Select
              placeholder="Intake"
              allowClear
              value={intakeFilter}
              onChange={(v) => setIntakeFilter(v)}
              style={{ width: 130 }}
              options={[...new Set(applications.map((a) => a.intake))].map(
                (i) => ({ label: i, value: i }),
              )}
            />
            <span className="text-xs text-[#8a95b0] ml-auto">
              <span className="font-semibold text-[#1a2540]">
                {filtered.length}
              </span>{" "}
              of {applications.length}
            </span>
          </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="key"
          scroll={{ x: 1400 }}
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

      {/* ═══ Add Application Modal ═══ */}
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
                New Application
              </h3>
              <p className="text-xs text-[#8a95b0] m-0 mt-0.5">
                Create a university application
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
          onSubmit={handleSubmit(onAddApplication)}
          className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto"
        >
          <div className="grid grid-cols-2 gap-4">
            <CustomInput<AddApplicationFormValues>
              name="student"
              label="Student Name"
              placeholder="Full name"
              control={control}
              size="large"
              type="text"
              icon={<FiUser size={14} className="text-[#b4bcd4]" />}
              rules={{ required: "Student name is required" }}
            />
            <CustomInput<AddApplicationFormValues>
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

          <CustomInput<AddApplicationFormValues>
            name="university"
            label="University"
            placeholder="University name"
            control={control}
            size="large"
            type="text"
            icon={<FiBookOpen size={14} className="text-[#b4bcd4]" />}
            rules={{ required: "University is required" }}
          />

          <CustomInput<AddApplicationFormValues>
            name="course"
            label="Course / Program"
            placeholder="e.g. MSc Data Science"
            control={control}
            size="large"
            type="text"
            icon={<FiBookOpen size={14} className="text-[#b4bcd4]" />}
            rules={{ required: "Course is required" }}
          />

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
                <FiPlus size={14} /> Create Application
              </span>
            </Button>
          </div>
        </form>
      </CustomModal>

      {/* ═══ 5️⃣ Application Detail Modal (Documents) ═══ */}
      <CustomModal
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedApp(null);
        }}
      >
        {selectedApp && (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                  <FiEye size={18} className="text-blue-500" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1a2540] m-0">
                    {selectedApp.student}
                  </h3>
                  <p className="text-xs text-[#8a95b0] m-0 mt-0.5">
                    {selectedApp.university} — {selectedApp.course}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setDetailOpen(false);
                  setSelectedApp(null);
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-transparent border border-transparent hover:bg-gray-100 cursor-pointer transition-all"
              >
                <FiX size={16} className="text-[#8a95b0]" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Status & Info */}
              <div className="grid grid-cols-3 gap-3">
                <div
                  className="rounded-lg p-3 text-center border"
                  style={{
                    backgroundColor:
                      OFFER_STATUS_CONFIG[selectedApp.offerStatus].bg,
                    borderColor:
                      OFFER_STATUS_CONFIG[selectedApp.offerStatus].border,
                  }}
                >
                  <p
                    className="text-sm font-bold m-0"
                    style={{
                      color: OFFER_STATUS_CONFIG[selectedApp.offerStatus].color,
                    }}
                  >
                    {selectedApp.offerStatus}
                  </p>
                  <p className="text-[10px] text-[#8a95b0] m-0 mt-0.5">
                    Offer Status
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
                  <p className="text-sm font-bold text-[#3b82f6] m-0">
                    {selectedApp.intake}
                  </p>
                  <p className="text-[10px] text-[#8a95b0] m-0 mt-0.5">
                    Intake
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                  <p className="text-sm font-bold text-[#1a2540] m-0">
                    {selectedApp.processingDays}d
                  </p>
                  <p className="text-[10px] text-[#8a95b0] m-0 mt-0.5">
                    Processing
                  </p>
                </div>
              </div>

              {/* Offer expiry warning */}
              {selectedApp.offerExpiry &&
                (() => {
                  const days = getDaysUntilExpiry(selectedApp.offerExpiry);
                  if (days !== null && days >= 0 && days <= 10) {
                    return (
                      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
                        <FiAlertTriangle size={14} className="text-amber-500" />
                        <span className="text-xs font-semibold text-amber-800">
                          Offer expires in {days} days (
                          {new Date(selectedApp.offerExpiry).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                          )
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
                    value: `${selectedApp.countryFlag} ${selectedApp.country}`,
                  },
                  { label: "Counselor", value: selectedApp.counselor },
                  {
                    label: "Applied",
                    value: new Date(selectedApp.appliedDate).toLocaleDateString(
                      "en-IN",
                      { day: "numeric", month: "short", year: "numeric" },
                    ),
                  },
                  { label: "Scholarship", value: selectedApp.scholarship },
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
                    Documents
                  </h4>
                  <span className="text-xs font-semibold text-[#8a95b0]">
                    {getDocCompletionPercent(selectedApp.documents)}% complete
                  </span>
                </div>
                <div className="space-y-2">
                  {selectedApp.documents.map((doc) => {
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

              {/* Next Action */}
              <div className="pt-2">
                <Button type="primary" block size="large">
                  <span className="flex items-center justify-center gap-2">
                    {NEXT_ACTION_CONFIG[selectedApp.nextAction].icon}
                    {selectedApp.nextAction}
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
                Application Pipeline
              </h3>
              <p className="text-xs text-[#8a95b0] m-0 mt-0.5">
                Overview of all application stages
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
            const count = applications.filter(
              (a) => a.offerStatus === stage.label,
            ).length;
            const maxCount = Math.max(
              ...PIPELINE_STAGES.map(
                (s) =>
                  applications.filter((a) => a.offerStatus === s.label).length,
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
                      width: `${pct || 2}%`,
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

          {/* Rejected separate */}
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md flex items-center justify-center bg-red-500 text-white text-[10px] font-bold">
                  ✕
                </div>
                <span className="text-sm font-semibold text-[#1a2540]">
                  Rejected
                </span>
              </div>
              <span className="text-sm font-bold text-red-500">
                {
                  applications.filter((a) => a.offerStatus === "Rejected")
                    .length
                }
              </span>
            </div>
            <div className="h-3 bg-gray-50 rounded-full overflow-hidden ml-8">
              <div
                className="h-full rounded-full bg-red-500"
                style={{
                  width: `${(applications.filter((a) => a.offerStatus === "Rejected").length / applications.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default ApplicationPage;
