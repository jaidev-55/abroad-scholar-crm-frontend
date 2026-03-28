import React, { useState, useMemo } from "react";
import {
  Table,
  Input,
  Select,
  DatePicker,
  Dropdown,
  Tooltip,
  Modal,
  ConfigProvider,
  Popconfirm,
  message,
  Drawer,
} from "antd";
import type { TableColumnsType } from "antd";
import type { Dayjs } from "dayjs";
import type { MenuProps } from "antd";
import {
  RiSearchLine,
  RiAddLine,
  RiDownloadLine,
  RiUserLine,
  RiFireLine,
  RiTimeLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiMoreLine,
  RiEyeLine,
  RiPencilLine,
  RiDeleteBinLine,
  RiPhoneLine,
  RiMailLine,
  RiArrowDownSLine,
  RiUserSmileLine,
  RiCalendarLine,
  RiErrorWarningLine,
  RiFlashlightLine,
  RiSnowflakeLine,
  RiStickyNoteLine,
  RiTeamLine,
  RiArrowRightLine,
  RiCheckLine,
  RiRefreshLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiFilterOffLine,
} from "react-icons/ri";

const { RangePicker } = DatePicker;

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type Priority = "Hot" | "Warm" | "Cold";
type LeadStatus = "Active" | "Lost";
type StageId =
  | "new"
  | "contacted"
  | "ielts"
  | "applied"
  | "offer"
  | "visa"
  | "enrolled";

interface Stage {
  id: StageId;
  label: string;
  color: string;
  bg: string;
  twText: string;
  twBg: string;
  twBorder: string;
  icon: string;
}

interface Lead {
  key: string;
  id: string;
  name: string;
  phone: string;
  email: string;
  stage: StageId;
  source: string;
  counselor: string;
  followUp: string;
  country: string;
  priority: Priority;
  status: LeadStatus;
  lostReason: string | null;
  createdAt: string;
  notesCount: number;
  ieltsScore: string | null;
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ComponentType<{ size?: number }>;
  colorCls: string;
  barCls: string;
  delta?: number;
}

interface AvatarProps {
  name: string;
  size?: number;
}

interface PriBadgeProps {
  p: Priority;
}

interface StagePillProps {
  sid: StageId;
}

interface SrcBadgeProps {
  src: string;
}

interface BulkBarProps {
  selected: string[];
  total: number;
  onClear: () => void;
  onAssign: () => void;
  onStage: () => void;
  onLost: () => void;
  onDelete: () => void;
  onExport: () => void;
}

type BulkModalType = "assign" | "stage" | null;
type DateRangeValue = [Dayjs, Dayjs] | null;

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const STAGES: Stage[] = [
  {
    id: "new",
    label: "New Lead",
    color: "#3B82F6",
    bg: "#EFF6FF",
    twText: "text-blue-600",
    twBg: "bg-blue-50",
    twBorder: "border-blue-200",
    icon: "⚡",
  },
  {
    id: "contacted",
    label: "Contacted",
    color: "#0EA5E9",
    bg: "#F0F9FF",
    twText: "text-sky-600",
    twBg: "bg-sky-50",
    twBorder: "border-sky-200",
    icon: "📞",
  },
  {
    id: "ielts",
    label: "IELTS Planning",
    color: "#8B5CF6",
    bg: "#F5F3FF",
    twText: "text-violet-600",
    twBg: "bg-violet-50",
    twBorder: "border-violet-200",
    icon: "📝",
  },
  {
    id: "applied",
    label: "Applied",
    color: "#F59E0B",
    bg: "#FFFBEB",
    twText: "text-amber-600",
    twBg: "bg-amber-50",
    twBorder: "border-amber-200",
    icon: "📄",
  },
  {
    id: "offer",
    label: "Offer Received",
    color: "#10B981",
    bg: "#ECFDF5",
    twText: "text-emerald-600",
    twBg: "bg-emerald-50",
    twBorder: "border-emerald-200",
    icon: "🎉",
  },
  {
    id: "visa",
    label: "Visa Filed",
    color: "#06B6D4",
    bg: "#ECFEFF",
    twText: "text-cyan-600",
    twBg: "bg-cyan-50",
    twBorder: "border-cyan-200",
    icon: "✈️",
  },
  {
    id: "enrolled",
    label: "Enrolled",
    color: "#22C55E",
    bg: "#F0FDF4",
    twText: "text-green-600",
    twBg: "bg-green-50",
    twBorder: "border-green-200",
    icon: "🎓",
  },
];

const SOURCES: string[] = [
  "Website",
  "Referral",
  "Facebook",
  "Instagram",
  "Walk-in",
  "Google Ads",
  "Education Fair",
];
const COUNSELORS: string[] = [
  "Priya Sharma",
  "Arjun Patel",
  "Sarah Khan",
  "Rohan Mehta",
  "Anita Desai",
];
const COUNTRIES: string[] = [
  "🇬🇧 UK",
  "🇨🇦 Canada",
  "🇺🇸 USA",
  "🇦🇺 Australia",
  "🇩🇪 Germany",
  "🇮🇪 Ireland",
  "🇳🇿 New Zealand",
];
const PRIORITIES: Priority[] = ["Hot", "Warm", "Cold"];
const LOST_REASONS: string[] = [
  "Budget constraints",
  "Chose another agency",
  "Decided not to study abroad",
  "Visa rejected",
  "Unresponsive",
  "Poor IELTS score",
  "Family issues",
  "Other",
];
const STATUSES: LeadStatus[] = ["Active", "Lost"];

const genLeads = (): Lead[] => {
  const names = [
    "Aarav Mehta",
    "Sneha Reddy",
    "Kunal Joshi",
    "Ishita Gupta",
    "Rahul Nair",
    "Meera Iyer",
    "Vikram Singh",
    "Pooja Bhat",
    "Aryan Kapoor",
    "Diya Sharma",
    "Karthik Rajan",
    "Nisha Patel",
    "Aditya Rao",
    "Simran Kaur",
    "Varun Das",
    "Priya Nambiar",
    "Rohan Khanna",
    "Ananya Srinivasan",
    "Dev Malhotra",
    "Lakshmi Menon",
    "Siddharth Agarwal",
    "Kavya Nair",
    "Nikhil Choudhary",
    "Ritu Banerjee",
    "Amrit Singh",
    "Tanya Jain",
    "Harsh Vardhan",
    "Neha Kulkarni",
    "Pranav Desai",
    "Swati Mishra",
    "Akash Pandey",
    "Divya Krishnan",
    "Manish Tiwari",
    "Shruti Hegde",
    "Rajat Saxena",
  ];
  return names.map((name, i): Lead => {
    const stage = STAGES[i % STAGES.length].id;
    const daysOff = Math.floor(Math.random() * 14) - 7;
    const fu = new Date();
    fu.setDate(fu.getDate() + daysOff);
    return {
      key: `lead-${i + 1}`,
      id: `lead-${i + 1}`,
      name,
      phone: `+91 ${9000000000 + Math.floor(Math.random() * 999999999)}`,
      email: `${name.toLowerCase().replace(" ", ".")}@email.com`,
      stage: stage as StageId,
      source: SOURCES[i % SOURCES.length],
      counselor: COUNSELORS[i % COUNSELORS.length],
      followUp: fu.toISOString().split("T")[0],
      country: COUNTRIES[i % COUNTRIES.length],
      priority: PRIORITIES[i % PRIORITIES.length],
      status: i % 8 === 0 ? "Lost" : "Active",
      lostReason: i % 8 === 0 ? LOST_REASONS[i % LOST_REASONS.length] : null,
      createdAt: new Date(Date.now() - Math.random() * 30 * 86400000)
        .toISOString()
        .split("T")[0],
      notesCount: Math.floor(Math.random() * 4),
      ieltsScore:
        stage === "ielts" || stage === "applied"
          ? `${(5.5 + Math.random() * 2.5).toFixed(1)}`
          : null,
    };
  });
};

const INIT_DATA = genLeads();

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const Avatar: React.FC<AvatarProps> = ({ name, size = 32 }) => {
  const ini = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
  const hue = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        background: `hsl(${hue},55%,90%)`,
        color: `hsl(${hue},45%,32%)`,
        fontSize: size * 0.36,
        fontWeight: 700,
      }}
      className="flex items-center justify-center shrink-0 select-none font-mono"
    >
      {ini}
    </div>
  );
};

const PriBadge: React.FC<PriBadgeProps> = ({ p }) => {
  const cfg: Record<Priority, { cls: string; icon: React.ReactNode }> = {
    Hot: {
      cls: "text-red-600 bg-red-50 border-red-200",
      icon: <RiFireLine size={10} />,
    },
    Warm: {
      cls: "text-amber-600 bg-amber-50 border-amber-200",
      icon: <RiFlashlightLine size={10} />,
    },
    Cold: {
      cls: "text-blue-600 bg-blue-50 border-blue-200",
      icon: <RiSnowflakeLine size={10} />,
    },
  };
  const { cls, icon } = cfg[p];
  return (
    <span
      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold border ${cls}`}
    >
      {icon}
      {p}
    </span>
  );
};

const StagePill: React.FC<StagePillProps> = ({ sid }) => {
  const s = STAGES.find((x) => x.id === sid);
  if (!s) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${s.twBg} ${s.twText} ${s.twBorder}`}
    >
      <span className="text-[10px]">{s.icon}</span>
      {s.label}
    </span>
  );
};

const SrcBadge: React.FC<SrcBadgeProps> = ({ src }) => {
  const map: Record<string, string> = {
    Website: "bg-blue-50 text-blue-700 border-blue-200",
    Referral: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Facebook: "bg-indigo-50 text-indigo-700 border-indigo-200",
    Instagram: "bg-pink-50 text-pink-700 border-pink-200",
    "Walk-in": "bg-amber-50 text-amber-700 border-amber-200",
    "Google Ads": "bg-yellow-50 text-yellow-700 border-yellow-200",
    "Education Fair": "bg-violet-50 text-violet-700 border-violet-200",
  };
  return (
    <span
      className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${map[src] || "bg-gray-50 text-gray-600 border-gray-200"}`}
    >
      {src}
    </span>
  );
};

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  colorCls,
  barCls,
  delta,
}) => (
  <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3 relative overflow-hidden hover:shadow-md hover:shadow-slate-100 transition-all duration-200 cursor-default">
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorCls}`}
    >
      <Icon size={18} />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">
        {label}
      </p>
      <div className="flex items-baseline gap-1.5">
        <p className="text-2xl font-black text-slate-900 leading-none">
          {value}
        </p>
        {delta !== undefined && (
          <span
            className={`text-[10px] font-bold flex items-center gap-0.5 ${delta >= 0 ? "text-emerald-600" : "text-red-500"}`}
          >
            {delta >= 0 ? (
              <RiArrowUpLine size={10} />
            ) : (
              <RiArrowDownLine size={10} />
            )}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
    </div>
    <div className={`absolute bottom-0 left-0 right-0 h-[2px] ${barCls}`} />
  </div>
);

// ─────────────────────────────────────────────
// BULK ACTION BAR
// ─────────────────────────────────────────────
const BulkBar: React.FC<BulkBarProps> = ({
  selected,
  onClear,
  onAssign,
  onStage,
  onLost,
  onDelete,
  onExport,
}) => {
  if (!selected.length) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-2xl shadow-2xl shadow-slate-900/40 border border-slate-700">
        <div className="flex items-center gap-2 pr-3 border-r border-slate-700">
          <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center">
            <RiCheckLine size={12} />
          </div>
          <span className="text-sm font-bold">{selected.length} selected</span>
          <button
            onClick={onClear}
            className="text-slate-400 hover:text-white text-xs bg-transparent border-none cursor-pointer ml-1 underline"
          >
            clear
          </button>
        </div>
        <button
          onClick={onAssign}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold border-none cursor-pointer transition-colors"
        >
          <RiUserSmileLine size={13} /> Assign
        </button>
        <button
          onClick={onStage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold border-none cursor-pointer transition-colors"
        >
          <RiArrowRightLine size={13} /> Change Stage
        </button>
        <button
          onClick={onLost}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-300 hover:text-red-200 text-xs font-semibold border-none cursor-pointer transition-colors"
        >
          <RiCloseCircleLine size={13} /> Mark Lost
        </button>
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold border-none cursor-pointer transition-colors"
        >
          <RiDownloadLine size={13} /> Export
        </button>
        <Popconfirm
          title={`Delete ${selected.length} leads?`}
          onConfirm={onDelete}
          okText="Delete"
          okButtonProps={{ danger: true }}
        >
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-300 hover:text-red-200 text-xs font-semibold border-none cursor-pointer transition-colors">
            <RiDeleteBinLine size={13} /> Delete
          </button>
        </Popconfirm>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
const AllLeadsPage: React.FC = () => {
  const [data, setData] = useState<Lead[]>(INIT_DATA);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [stageF, setStageF] = useState<StageId | null>(null);
  const [sourceF, setSourceF] = useState<string | null>(null);
  const [counselorF, setCounselorF] = useState<string | null>(null);
  const [countryF, setCountryF] = useState<string | null>(null);
  const [priorityF, setPriorityF] = useState<Priority | null>(null);
  const [statusF, setStatusF] = useState<LeadStatus | null>(null);
  const [lostReasonF, setLostReasonF] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeValue>(null);
  const [showFilters, setShowFilters] = useState<boolean>(true);
  const [detailLead, setDetailLead] = useState<Lead | null>(null);
  const [bulkModal, setBulkModal] = useState<BulkModalType>(null);
  const [bulkValue, setBulkValue] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];

  const filtered = useMemo<Lead[]>(
    () =>
      data.filter((r) => {
        if (search) {
          const q = search.toLowerCase();
          if (
            !r.name.toLowerCase().includes(q) &&
            !r.phone.includes(q) &&
            !r.email.toLowerCase().includes(q)
          )
            return false;
        }
        if (stageF && r.stage !== stageF) return false;
        if (sourceF && r.source !== sourceF) return false;
        if (counselorF && r.counselor !== counselorF) return false;
        if (countryF && r.country !== countryF) return false;
        if (priorityF && r.priority !== priorityF) return false;
        if (statusF && r.status !== statusF) return false;
        if (lostReasonF && r.lostReason !== lostReasonF) return false;
        if (dateRange?.[0] && r.followUp < dateRange[0].format("YYYY-MM-DD"))
          return false;
        if (dateRange?.[1] && r.followUp > dateRange[1].format("YYYY-MM-DD"))
          return false;
        return true;
      }),
    [
      data,
      search,
      stageF,
      sourceF,
      counselorF,
      countryF,
      priorityF,
      statusF,
      lostReasonF,
      dateRange,
    ],
  );

  const hasFilters = !!(
    search ||
    stageF ||
    sourceF ||
    counselorF ||
    countryF ||
    priorityF ||
    statusF ||
    lostReasonF ||
    dateRange
  );

  const clearFilters = (): void => {
    setSearch("");
    setStageF(null);
    setSourceF(null);
    setCounselorF(null);
    setCountryF(null);
    setPriorityF(null);
    setStatusF(null);
    setLostReasonF(null);
    setDateRange(null);
  };

  const stats = useMemo(
    () => ({
      total: data.length,
      hot: data.filter((r) => r.priority === "Hot").length,
      due: data.filter((r) => r.followUp <= today && r.status === "Active")
        .length,
      conv: data.filter((r) => r.stage === "enrolled").length,
      lost: data.filter((r) => r.status === "Lost").length,
    }),
    [data, today],
  );

  const handleBulkDelete = (): void => {
    setData((d) => d.filter((r) => !selected.includes(r.key)));
    message.success(`${selected.length} leads deleted`);
    setSelected([]);
  };
  const handleBulkLost = (): void => {
    setData((d) =>
      d.map((r) =>
        selected.includes(r.key) ? { ...r, status: "Lost" as LeadStatus } : r,
      ),
    );
    message.info(`${selected.length} leads marked as lost`);
    setSelected([]);
  };
  const handleBulkApply = (): void => {
    if (!bulkValue) return;
    if (bulkModal === "assign")
      setData((d) =>
        d.map((r) =>
          selected.includes(r.key) ? { ...r, counselor: bulkValue } : r,
        ),
      );
    if (bulkModal === "stage")
      setData((d) =>
        d.map((r) =>
          selected.includes(r.key) ? { ...r, stage: bulkValue as StageId } : r,
        ),
      );
    message.success(`Applied to ${selected.length} leads`);
    setSelected([]);
    setBulkModal(null);
    setBulkValue(null);
  };
  const handleDelete = (key: string): void => {
    setData((d) => d.filter((r) => r.key !== key));
    message.success("Lead deleted");
  };

  const rowSel = {
    selectedRowKeys: selected,
    onChange: (keys: React.Key[]) => setSelected(keys as string[]),
    columnWidth: 44,
  };

  const columns: TableColumnsType<Lead> = [
    {
      title: (
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          Student
        </span>
      ),
      dataIndex: "name",
      key: "name",
      width: 130,
      fixed: "left",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string, rec: Lead) => (
        <div className="flex items-center gap-2.5 py-0.5">
          <Avatar name={name} size={34} />
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-slate-900 truncate leading-tight">
              {name}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {rec.country}
            </div>
          </div>
          {rec.status === "Lost" && (
            <Tooltip title="Lost">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 ml-auto" />
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: (
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          Contact
        </span>
      ),
      key: "contact",
      width: 100,
      render: (_: unknown, rec: Lead) => (
        <div className="flex flex-col gap-0.5">
          <a
            href={`tel:${rec.phone}`}
            className="text-[12px] text-slate-600 hover:text-blue-600 flex items-center gap-1 no-underline transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <RiPhoneLine size={11} className="text-slate-400 shrink-0" />
            {rec.phone}
          </a>
          <a
            href={`mailto:${rec.email}`}
            className="text-[11px] text-slate-400 hover:text-blue-600 flex items-center gap-1 no-underline transition-colors truncate max-w-[200px]"
            onClick={(e) => e.stopPropagation()}
          >
            <RiMailLine size={11} className="shrink-0" />
            {rec.email}
          </a>
        </div>
      ),
    },
    {
      title: (
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          Stage
        </span>
      ),
      dataIndex: "stage",
      key: "stage",
      align: "center",
      width: 130,
      filters: STAGES.map((s) => ({ text: s.label, value: s.id })),
      onFilter: (v, r) => r.stage === v,
      render: (sid: StageId) => <StagePill sid={sid} />,
    },
    {
      title: (
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          Source
        </span>
      ),
      dataIndex: "source",
      key: "source",
      width: 100,
      align: "center",
      render: (src: string) => <SrcBadge src={src} />,
    },
    {
      title: (
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          Priority
        </span>
      ),
      dataIndex: "priority",
      key: "priority",
      width: 90,
      align: "center",
      sorter: (a, b) =>
        ["Hot", "Warm", "Cold"].indexOf(a.priority) -
        ["Hot", "Warm", "Cold"].indexOf(b.priority),
      render: (p: Priority) => (
        <div className="flex justify-center">
          <PriBadge p={p} />
        </div>
      ),
    },
    {
      title: (
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          Counselor
        </span>
      ),
      dataIndex: "counselor",
      key: "counselor",
      width: 120,
      align: "center",
      render: (c: string) => (
        <div className="flex items-center justify-center gap-1.5">
          <Avatar name={c} size={22} />
          <span className="text-[12px] text-slate-600">{c.split(" ")[0]}</span>
        </div>
      ),
    },
    {
      title: (
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          IELTS
        </span>
      ),
      dataIndex: "ieltsScore",
      key: "ielts",
      width: 60,
      align: "center",
      render: (v: string | null) =>
        v ? (
          <span className="text-[12px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-lg border border-violet-200">
            {v}
          </span>
        ) : (
          <span className="text-[11px] text-slate-300">—</span>
        ),
    },
    {
      title: (
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          Follow-up
        </span>
      ),
      dataIndex: "followUp",
      key: "followUp",
      width: 110,
      align: "center",
      sorter: (a, b) =>
        new Date(a.followUp).getTime() - new Date(b.followUp).getTime(),
      render: (date: string) => {
        const overdue = date < today;
        const isToday = date === today;

        return (
          <div className="flex justify-center">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold border ${
                overdue
                  ? "bg-red-50 text-red-600 border-red-200"
                  : isToday
                    ? "bg-amber-50 text-amber-600 border-amber-200"
                    : "bg-slate-50 text-slate-500 border-slate-200"
              }`}
            >
              <RiCalendarLine size={11} />
              {new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
              {overdue && <RiErrorWarningLine size={11} className="ml-0.5" />}
            </span>
          </div>
        );
      },
    },
    {
      title: (
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          Status
        </span>
      ),
      dataIndex: "status",
      key: "status",
      width: 90,
      align: "center",
      filters: [
        { text: "Active", value: "Active" },
        { text: "Lost", value: "Lost" },
      ],
      onFilter: (v, r) => r.status === v,
      render: (s: LeadStatus) => (
        <div className="flex justify-center">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              s === "Active"
                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                : "bg-red-50 text-red-500 border-red-200"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                s === "Active" ? "bg-emerald-400" : "bg-red-400"
              }`}
            />
            {s}
          </span>
        </div>
      ),
    },
    {
      title: (
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          Notes
        </span>
      ),
      dataIndex: "notesCount",
      key: "notes",
      width: 70,
      align: "center",
      render: (n: number) => (
        <div className="flex justify-center">
          <button
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] font-semibold cursor-pointer ${
              n > 0
                ? "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"
            } transition-colors`}
          >
            <RiStickyNoteLine size={11} />
            {n}
          </button>
        </div>
      ),
    },
    {
      title: (
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          Created
        </span>
      ),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 90,
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (d: string) => (
        <span className="text-[11px] text-slate-400">
          {new Date(d).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "2-digit",
          })}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 60,
      fixed: "right",
      render: (_: unknown, rec: Lead) => {
        const nextStage =
          STAGES[STAGES.findIndex((s) => s.id === rec.stage) + 1];
        const items: MenuProps["items"] = [
          {
            key: "view",
            label: (
              <span className="flex items-center gap-2 text-[13px]">
                <RiEyeLine size={14} />
                View Details
              </span>
            ),
          },
          {
            key: "edit",
            label: (
              <span className="flex items-center gap-2 text-[13px]">
                <RiPencilLine size={14} />
                Edit Lead
              </span>
            ),
          },
          {
            key: "call",
            label: (
              <span className="flex items-center gap-2 text-[13px]">
                <RiPhoneLine size={14} />
                Call Now
              </span>
            ),
          },
          {
            key: "email",
            label: (
              <span className="flex items-center gap-2 text-[13px]">
                <RiMailLine size={14} />
                Send Email
              </span>
            ),
          },
          ...(nextStage
            ? [
                { type: "divider" as const },
                {
                  key: "move",
                  label: (
                    <span className="flex items-center gap-2 text-[13px] text-blue-600">
                      <RiArrowRightLine size={14} />
                      Move to {nextStage.label}
                    </span>
                  ),
                },
              ]
            : []),
          { type: "divider" as const },
          {
            key: "lost",
            label: (
              <span className="flex items-center gap-2 text-[13px] text-red-500">
                <RiCloseCircleLine size={14} />
                Mark as Lost
              </span>
            ),
          },
          {
            key: "delete",
            label: (
              <span className="flex items-center gap-2 text-[13px] text-red-500">
                <RiDeleteBinLine size={14} />
                Delete Lead
              </span>
            ),
            danger: true,
          },
        ];
        const onMenuClick: MenuProps["onClick"] = ({ key }) => {
          if (key === "view") setDetailLead(rec);
          if (key === "move" && nextStage) {
            setData((d) =>
              d.map((r) =>
                r.key === rec.key ? { ...r, stage: nextStage.id } : r,
              ),
            );
            message.success(`Moved to ${nextStage.label}`);
          }
          if (key === "lost") {
            setData((d) =>
              d.map((r) =>
                r.key === rec.key ? { ...r, status: "Lost" as LeadStatus } : r,
              ),
            );
            message.info("Marked as lost");
          }
          if (key === "delete") handleDelete(rec.key);
        };
        return (
          <Dropdown
            menu={{ items, onClick: onMenuClick }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <button
              onClick={(e) => e.stopPropagation()}
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-transparent hover:bg-slate-100 border-none cursor-pointer text-slate-400 hover:text-slate-700 transition-colors"
            >
              <RiMoreLine size={15} />
            </button>
          </Dropdown>
        );
      },
    },
  ];

  // ── RENDER ────────────────────────────────────
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#2563EB",
          borderRadius: 8,
          fontFamily: "inherit",
          fontSize: 13,
        },
        components: {
          Table: {
            headerBg: "#F8FAFC",
            headerColor: "#64748B",
            borderColor: "#F1F5F9",
            rowHoverBg: "#F8FAFF",
            cellPaddingBlock: 11,
            cellPaddingInline: 14,
            headerSplitColor: "transparent",
            fontSize: 13,
            selectionColumnWidth: 44,
          },
          Select: { borderRadius: 8 },
          Input: { borderRadius: 8 },
          Button: { borderRadius: 8 },
          Modal: { borderRadiusLG: 12 },
        },
      }}
    >
      <div className="flex flex-col gap-4 w-full p-5">
        {/* ── PAGE HEADER ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2.5 mb-0.5">
              <h1 className="text-[22px] font-black text-slate-900 tracking-tight leading-none">
                All Leads
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[12px] font-bold border border-slate-200">
                {filtered.length}
              </span>
            </div>
            <p className="text-[13px] text-slate-400 ">
              Manage, track and convert all student leads across every stage.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer transition-all shadow-sm">
              <RiDownloadLine size={14} /> Export
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-[13px] font-bold cursor-pointer border-none shadow-sm shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-150">
              <RiAddLine size={15} /> Add Lead
            </button>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-5 gap-3">
          <StatCard
            label="Total Leads"
            value={stats.total}
            icon={RiUserLine}
            colorCls="bg-blue-50 text-blue-500"
            barCls="bg-blue-500"
            delta={12}
          />
          <StatCard
            label="Hot Leads"
            value={stats.hot}
            icon={RiFireLine}
            colorCls="bg-red-50 text-red-500"
            barCls="bg-red-500"
            delta={5}
          />
          <StatCard
            label="Follow-ups Due"
            value={stats.due}
            icon={RiTimeLine}
            colorCls="bg-amber-50 text-amber-500"
            barCls="bg-amber-500"
            delta={-3}
          />
          <StatCard
            label="Converted"
            value={stats.conv}
            icon={RiCheckboxCircleLine}
            colorCls="bg-emerald-50 text-emerald-500"
            barCls="bg-emerald-500"
            delta={8}
          />
          <StatCard
            label="Lost"
            value={stats.lost}
            icon={RiCloseCircleLine}
            colorCls="bg-slate-100 text-slate-500"
            barCls="bg-slate-400"
            delta={-2}
          />
        </div>

        {/* ── FILTERS ── */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters((v) => !v)}
                className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-700 hover:text-slate-900 bg-transparent border-none cursor-pointer transition-colors"
              >
                Filters
                <RiArrowDownSLine
                  size={14}
                  className={`transition-transform duration-200 text-slate-400 ${showFilters ? "rotate-180" : ""}`}
                />
              </button>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 cursor-pointer transition-colors"
                >
                  <RiFilterOffLine size={10} /> Clear All
                </button>
              )}
              {hasFilters && (
                <span className="text-[11px] text-slate-400">
                  {filtered.length} of {data.length} leads
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!hasFilters && (
                <span className="text-[12px] text-slate-400">
                  {filtered.length} leads
                </span>
              )}
              <Tooltip title="Refresh">
                <button className="w-7 h-7 rounded-lg bg-transparent border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">
                  <RiRefreshLine size={13} />
                </button>
              </Tooltip>
            </div>
          </div>

          {showFilters && (
            <div className="px-4 py-3 flex flex-wrap gap-2 items-center bg-slate-50/50">
              <Input
                prefix={<RiSearchLine size={13} className="text-slate-400" />}
                placeholder="Search name, phone, email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                allowClear
                style={{ width: 220 }}
                className="!rounded-lg !text-[13px]"
              />
              <Select
                value={stageF}
                onChange={setStageF}
                placeholder="Stage"
                allowClear
                style={{ width: 145 }}
                options={STAGES.map((s) => ({
                  value: s.id,
                  label: (
                    <span className="flex items-center gap-1.5 text-[12px]">
                      <span>{s.icon}</span>
                      {s.label}
                    </span>
                  ),
                }))}
              />
              <Select
                value={sourceF}
                onChange={setSourceF}
                placeholder="Source"
                allowClear
                style={{ width: 130 }}
                options={SOURCES.map((s) => ({ value: s, label: s }))}
              />
              <Select
                value={counselorF}
                onChange={setCounselorF}
                placeholder="Counselor"
                allowClear
                style={{ width: 145 }}
                options={COUNSELORS.map((c) => ({ value: c, label: c }))}
              />
              <Select
                value={countryF}
                onChange={setCountryF}
                placeholder="Country"
                allowClear
                style={{ width: 130 }}
                options={COUNTRIES.map((c) => ({ value: c, label: c }))}
              />
              <Select
                value={priorityF}
                onChange={setPriorityF}
                placeholder="Priority"
                allowClear
                style={{ width: 110 }}
                options={PRIORITIES.map((p) => ({ value: p, label: p }))}
              />
              <Select
                value={statusF}
                onChange={setStatusF}
                placeholder="Status"
                allowClear
                style={{ width: 105 }}
                options={STATUSES.map((s) => ({ value: s, label: s }))}
              />
              <Select
                value={lostReasonF}
                onChange={setLostReasonF}
                placeholder="Lost Reason"
                allowClear
                style={{ width: 155 }}
                options={LOST_REASONS.map((r) => ({ value: r, label: r }))}
              />
              <RangePicker
                value={dateRange}
                onChange={(val) => setDateRange(val as DateRangeValue)}
                className="!rounded-lg"
                format="MMM D"
                placeholder={["Follow-up from", "to"]}
                style={{ width: 230 }}
              />
            </div>
          )}
        </div>

        {/* ── SELECTED SUMMARY ── */}
        {selected.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-xl text-[13px] font-semibold text-blue-700">
            <RiCheckLine size={14} />
            {selected.length} lead{selected.length > 1 ? "s" : ""} selected
            <span className="mx-1 text-blue-300">·</span>
            <button
              onClick={() => setBulkModal("assign")}
              className="underline underline-offset-2 bg-transparent border-none cursor-pointer text-blue-600 hover:text-blue-800 font-semibold text-[13px]"
            >
              Assign counselor
            </button>
            <span className="text-blue-300">·</span>
            <button
              onClick={() => setBulkModal("stage")}
              className="underline underline-offset-2 bg-transparent border-none cursor-pointer text-blue-600 hover:text-blue-800 font-semibold text-[13px]"
            >
              Change stage
            </button>
            <span className="text-blue-300">·</span>
            <button
              onClick={handleBulkLost}
              className="underline underline-offset-2 bg-transparent border-none cursor-pointer text-red-600 hover:text-red-800 font-semibold text-[13px]"
            >
              Mark lost
            </button>
            <span className="text-blue-300">·</span>
            <Popconfirm
              title={`Delete ${selected.length} leads?`}
              onConfirm={handleBulkDelete}
              okText="Delete"
              okButtonProps={{ danger: true }}
            >
              <button className="underline underline-offset-2 bg-transparent border-none cursor-pointer text-red-600 hover:text-red-800 font-semibold text-[13px]">
                Delete
              </button>
            </Popconfirm>
            <button
              onClick={() => setSelected([])}
              className="ml-auto text-blue-500 hover:text-blue-700 bg-transparent border-none cursor-pointer text-[12px] font-medium"
            >
              ✕ Clear
            </button>
          </div>
        )}

        {/* ── TABLE — with scroll hint shadow ── */}
        <div
          className="bg-white rounded-xl border border-slate-100 shadow-sm leads-table-wrap relative"
          style={{ overflow: "hidden" }}
        >
          {/* Scroll hint gradient on right edge */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/80 to-transparent z-10 rounded-r-xl" />

          <Table
            rowSelection={rowSel}
            dataSource={filtered}
            columns={columns}
            rowKey="key"
            scroll={{ x: "max-content", y: 600 }}
            size="small"
            onRow={(rec) => ({
              onClick: () => setDetailLead(rec),
              className: `cursor-pointer transition-colors ${rec.status === "Lost" ? "opacity-60" : ""}`,
            })}
            pagination={{
              pageSize: 15,
              showSizeChanger: true,
              pageSizeOptions: ["10", "15", "25", "50"],
              showTotal: (t, r) => (
                <span className="text-[12px] text-slate-400">
                  {r[0]}–{r[1]} of{" "}
                  <strong className="text-slate-600">{t}</strong> leads
                </span>
              ),
              style: {
                padding: "10px 16px",
                borderTop: "1px solid #F1F5F9",
                margin: 0,
              },
            }}
            locale={{
              emptyText: (
                <div className="py-16 flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <RiTeamLine size={24} className="text-slate-300" />
                  </div>
                  <p className="text-[14px] font-semibold text-slate-400">
                    No leads match your filters
                  </p>
                  {hasFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-[13px] text-blue-600 underline bg-transparent border-none cursor-pointer"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ),
            }}
          />
        </div>
      </div>

      {/* ── BULK ACTION FLOATING BAR ── */}
      <BulkBar
        selected={selected}
        total={data.length}
        onClear={() => setSelected([])}
        onAssign={() => setBulkModal("assign")}
        onStage={() => setBulkModal("stage")}
        onLost={handleBulkLost}
        onDelete={handleBulkDelete}
        onExport={() => message.info("Exporting...")}
      />

      {/* ── BULK MODAL ── */}
      <Modal
        open={!!bulkModal}
        onCancel={() => {
          setBulkModal(null);
          setBulkValue(null);
        }}
        onOk={handleBulkApply}
        okText="Apply"
        okButtonProps={{ disabled: !bulkValue, type: "primary" }}
        title={
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              {bulkModal === "assign" ? (
                <RiUserSmileLine size={16} className="text-blue-600" />
              ) : (
                <RiArrowRightLine size={16} className="text-blue-600" />
              )}
            </div>
            <div>
              <div className="text-[14px] font-bold text-slate-900">
                {bulkModal === "assign" ? "Assign Counselor" : "Change Stage"}
              </div>
              <div className="text-[12px] text-slate-400 font-normal">
                Apply to {selected.length} selected lead
                {selected.length > 1 ? "s" : ""}
              </div>
            </div>
          </div>
        }
        width={420}
      >
        <div className="pt-2">
          <label className="block text-[12px] font-semibold text-slate-600 mb-2">
            {bulkModal === "assign" ? "Select Counselor" : "Select Stage"}
          </label>
          {bulkModal === "assign" ? (
            <Select
              value={bulkValue}
              onChange={setBulkValue}
              placeholder="Choose counselor…"
              style={{ width: "100%" }}
              size="large"
              options={COUNSELORS.map((c) => ({ value: c, label: c }))}
            />
          ) : (
            <Select
              value={bulkValue}
              onChange={setBulkValue}
              placeholder="Choose stage…"
              style={{ width: "100%" }}
              size="large"
              options={STAGES.map((s) => ({
                value: s.id,
                label: (
                  <span className="flex items-center gap-2">
                    {s.icon} {s.label}
                  </span>
                ),
              }))}
            />
          )}
        </div>
      </Modal>

      {/* ── LEAD DETAIL DRAWER ── */}
      <Drawer
        open={!!detailLead}
        onClose={() => setDetailLead(null)}
        width={440}
        title={null}
        styles={{
          body: { padding: 0, background: "#F8FAFC" },
          header: { display: "none" },
        }}
      >
        {detailLead &&
          (() => {
            const s = STAGES.find((x) => x.id === detailLead.stage);
            const fu = detailLead.followUp;
            const od = fu < today;
            return (
              <>
                <div
                  className="px-6 pt-6 pb-5 relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
                  }}
                >
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/[0.07]" />
                  <div className="absolute -bottom-6 left-20 w-24 h-24 rounded-full bg-white/[0.05]" />
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <Avatar name={detailLead.name} size={46} />
                      <div>
                        <h2 className="text-[18px] font-black text-white leading-tight">
                          {detailLead.name}
                        </h2>
                        <p className="text-[12px] text-white/60 mt-0.5">
                          {detailLead.country} · {detailLead.source}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setDetailLead(null)}
                      className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white border-none cursor-pointer transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex gap-2 mt-4 flex-wrap relative z-10">
                    {s && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/20 text-white border border-white/25">
                        {s.icon} {s.label}
                      </span>
                    )}
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/20 text-white border border-white/25">
                      <PriBadge p={detailLead.priority} />
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${detailLead.status === "Active" ? "bg-emerald-400/20 text-emerald-200 border-emerald-300/30" : "bg-red-400/20 text-red-200 border-red-300/30"}`}
                    >
                      {detailLead.status}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col gap-3">
                  <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                      Contact Info
                    </p>
                    <div className="flex flex-col gap-2">
                      <a
                        href={`tel:${detailLead.phone}`}
                        className="flex items-center gap-2.5 text-[13px] text-slate-700 hover:text-blue-600 no-underline transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                          <RiPhoneLine size={13} className="text-blue-500" />
                        </div>
                        {detailLead.phone}
                      </a>
                      <a
                        href={`mailto:${detailLead.email}`}
                        className="flex items-center gap-2.5 text-[13px] text-slate-700 hover:text-blue-600 no-underline transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                          <RiMailLine size={13} className="text-blue-500" />
                        </div>
                        {detailLead.email}
                      </a>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                      Lead Details
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Counselor", value: detailLead.counselor },
                        { label: "Source", value: detailLead.source },
                        { label: "Country", value: detailLead.country },
                        {
                          label: "IELTS Score",
                          value: detailLead.ieltsScore || "—",
                        },
                        {
                          label: "Created",
                          value: new Date(
                            detailLead.createdAt,
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }),
                        },
                        {
                          label: "Notes",
                          value: `${detailLead.notesCount} note${detailLead.notesCount !== 1 ? "s" : ""}`,
                        },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                            {label}
                          </p>
                          <p className="text-[13px] font-semibold text-slate-700">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    className={`rounded-xl border p-4 shadow-sm ${od ? "bg-red-50 border-red-200" : "bg-white border-slate-100"}`}
                  >
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Follow-up Date
                    </p>
                    <div
                      className={`flex items-center gap-2 text-[14px] font-bold ${od ? "text-red-600" : "text-slate-800"}`}
                    >
                      <RiCalendarLine size={16} />
                      {new Date(fu).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "long",
                        day: "numeric",
                      })}
                      {od && (
                        <span className="text-[11px] font-semibold bg-red-100 text-red-600 px-2 py-0.5 rounded-full border border-red-200 ml-1">
                          Overdue
                        </span>
                      )}
                    </div>
                  </div>
                  {detailLead.lostReason && (
                    <div className="bg-red-50 rounded-xl border border-red-200 p-4">
                      <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">
                        Lost Reason
                      </p>
                      <p className="text-[13px] font-semibold text-red-700">
                        {detailLead.lostReason}
                      </p>
                    </div>
                  )}
                  <div className="flex gap-2 mt-1">
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-600 text-white text-[13px] font-bold border-none cursor-pointer hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                      <RiPencilLine size={14} /> Edit Lead
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white text-slate-700 text-[13px] font-semibold border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                      <RiStickyNoteLine size={14} /> Add Note
                    </button>
                  </div>
                </div>
              </>
            );
          })()}
      </Drawer>
    </ConfigProvider>
  );
};

export default AllLeadsPage;
