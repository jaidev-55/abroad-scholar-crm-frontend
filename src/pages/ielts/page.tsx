import React, { useState, useMemo } from "react";
import {
  Table,
  Select,
  Tooltip,
  ConfigProvider,
  Tabs,
  Drawer,
  Empty,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  RiUserLine,
  RiPhoneLine,
  RiCalendarLine,
  RiRefreshLine,
  RiDownloadLine,
  RiMailLine,
  RiCloseLine,
  RiBarChartLine,
  RiCheckboxCircleLine,
  RiGroupLine,
  RiEyeLine,
  RiBookOpenLine,
  RiCalendarCheckLine,
  RiFileListLine,
  RiAwardLine,
  RiHistoryLine,
  RiShieldCheckLine,
  RiMapPinLine,
} from "react-icons/ri";

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface MockHistory {
  id: string;
  date: string;
  overall: number;
  listening: number;
  reading: number;
  writing: number;
  speaking: number;
}

interface IeltsStudent {
  id: string;
  name: string;
  phone: string;
  email: string;
  counselor: string;
  country: string;
  intake: string;
  currentStage: "planning" | "booked" | "appeared" | "qualified" | "retake";
  targetBand: number;
  mockScore: number | null;
  actualScore: number | null;
  testDate: string | null;
  testCenter: string;
  trfNumber: string;
  status: "preparing" | "booked" | "completed" | "retake_required";
  nextAction: "book_test" | "follow_up" | "apply" | "retake" | "none";
  retakeCount: number;
  mockHistory: MockHistory[];
  createdAt: string;
  lastActivity: string;
  listeningScore: number | null;
  readingScore: number | null;
  writingScore: number | null;
  speakingScore: number | null;
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

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
];
const INTAKES = ["Jan 2026", "May 2026", "Sep 2026", "Jan 2027"];
const TARGET_BANDS = [6.0, 6.5, 7.0, 7.5, 8.0];
const TEST_CENTERS = [
  "British Council Mumbai",
  "IDP Delhi",
  "British Council Chennai",
  "IDP Bangalore",
  "British Council Pune",
  "IDP Hyderabad",
];
const STUDENT_NAMES = [
  "Ravi Kumar",
  "Priyanka Das",
  "Sanjay Verma",
  "Neha Agarwal",
  "Amit Shah",
  "Kavita Rao",
  "Deepak Mishra",
  "Anitha Joseph",
  "Rajesh Pillai",
  "Sweta Bhatt",
  "Manav Chopra",
  "Ritu Saxena",
  "Gaurav Negi",
  "Sonal Deshmukh",
  "Vivek Tiwari",
  "Megha Kulkarni",
  "Abhishek Yadav",
  "Tanvi Joshi",
  "Suresh Menon",
  "Pallavi Singh",
  "Karan Bose",
  "Divya Nair",
  "Nikhil Reddy",
  "Pooja Malhotra",
  "Rahul Sinha",
  "Sneha Reddy",
  "Vikas Chauhan",
  "Anjali Patil",
  "Rohan Khanna",
  "Meera Iyer",
];

// ═══════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════

const generateStudents = (): IeltsStudent[] =>
  STUDENT_NAMES.map((name, i) => {
    const stages: IeltsStudent["currentStage"][] = [
      "planning",
      "booked",
      "appeared",
      "qualified",
      "retake",
    ];
    const stage = stages[i % 5];
    const targetBand = TARGET_BANDS[i % TARGET_BANDS.length];
    const mockBase = 4.5 + Math.random() * 3;
    const mockScore = parseFloat(mockBase.toFixed(1));

    let actualScore: number | null = null;
    let status: IeltsStudent["status"] = "preparing";
    let nextAction: IeltsStudent["nextAction"] = "book_test";
    let testDate: string | null = null;

    if (stage === "booked") {
      status = "booked";
      nextAction = "follow_up";
      testDate = new Date(
        Date.now() + (3 + Math.floor(Math.random() * 20)) * 86400000,
      )
        .toISOString()
        .split("T")[0];
    } else if (stage === "appeared" || stage === "qualified") {
      const actual = 4.5 + Math.random() * 4;
      actualScore = parseFloat(actual.toFixed(1));
      testDate = new Date(
        Date.now() - Math.floor(Math.random() * 30) * 86400000,
      )
        .toISOString()
        .split("T")[0];
      if (actualScore >= targetBand) {
        status = "completed";
        nextAction = "apply";
      } else {
        status = "retake_required";
        nextAction = "retake";
      }
    } else if (stage === "retake") {
      actualScore = parseFloat((4 + Math.random() * 2.5).toFixed(1));
      status = "retake_required";
      nextAction = "retake";
      testDate = new Date(
        Date.now() + (7 + Math.floor(Math.random() * 14)) * 86400000,
      )
        .toISOString()
        .split("T")[0];
    }

    const mockHistory: MockHistory[] = Array.from(
      { length: 2 + Math.floor(Math.random() * 3) },
      (_, j) => {
        const base = 4 + Math.random() * 3.5;
        return {
          id: `mock-${i}-${j}`,
          date: new Date(Date.now() - (30 + j * 15) * 86400000)
            .toISOString()
            .split("T")[0],
          overall: parseFloat(base.toFixed(1)),
          listening: parseFloat((base + (Math.random() - 0.5)).toFixed(1)),
          reading: parseFloat((base + (Math.random() - 0.5)).toFixed(1)),
          writing: parseFloat((base - 0.5 + Math.random()).toFixed(1)),
          speaking: parseFloat((base + (Math.random() - 0.3)).toFixed(1)),
        };
      },
    );

    const bScore = actualScore || mockScore;

    return {
      id: `ielts-${i + 1}`,
      name,
      phone: `+91 ${9000000000 + Math.floor(Math.random() * 999999999)}`,
      email: `${name.toLowerCase().replace(" ", ".")}@email.com`,
      counselor: COUNSELORS[i % COUNSELORS.length],
      country: COUNTRIES[i % COUNTRIES.length],
      intake: INTAKES[i % INTAKES.length],
      currentStage: stage,
      targetBand,
      mockScore,
      actualScore,
      testDate,
      testCenter: TEST_CENTERS[i % TEST_CENTERS.length],
      trfNumber: actualScore
        ? `TRF${2024}${String(i + 1).padStart(5, "0")}`
        : "",
      status,
      nextAction,
      retakeCount: stage === "retake" ? 1 + Math.floor(Math.random() * 2) : 0,
      mockHistory,
      createdAt: new Date(
        Date.now() - (60 + Math.floor(Math.random() * 90)) * 86400000,
      ).toISOString(),
      lastActivity: new Date(
        Date.now() - Math.floor(Math.random() * 7) * 86400000,
      ).toISOString(),
      listeningScore: actualScore
        ? parseFloat((bScore + (Math.random() - 0.3)).toFixed(1))
        : null,
      readingScore: actualScore
        ? parseFloat((bScore + (Math.random() - 0.5)).toFixed(1))
        : null,
      writingScore: actualScore
        ? parseFloat((bScore - 0.3 + Math.random() * 0.5).toFixed(1))
        : null,
      speakingScore: actualScore
        ? parseFloat((bScore + (Math.random() - 0.2)).toFixed(1))
        : null,
    };
  });

const ALL_STUDENTS = generateStudents();

// ═══════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════

const UserAvatar: React.FC<{ name: string; size?: "sm" | "md" | "lg" }> = ({
  name,
  size = "md",
}) => {
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("");
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-violet-100 text-violet-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-cyan-100 text-cyan-700",
    "bg-pink-100 text-pink-700",
    "bg-teal-100 text-teal-700",
  ];
  const sizeMap = {
    sm: "w-7 h-7 text-[10px] rounded-lg",
    md: "w-8 h-8 text-xs rounded-xl",
    lg: "w-11 h-11 text-sm rounded-2xl",
  };
  const idx =
    (name || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0) %
    colors.length;
  return (
    <div
      className={`flex items-center justify-center font-bold shrink-0 select-none ${sizeMap[size]} ${initials ? colors[idx] : "bg-slate-100 text-slate-400"}`}
    >
      {initials || <RiUserLine className="w-1/2 h-1/2" />}
    </div>
  );
};

const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: React.ReactNode;
  bg: string;
  tc: string;
  barBg: string;
}> = ({ label, value, icon, bg, tc, barBg }) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-4 relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50 cursor-default min-w-0">
    <div className="flex justify-between items-start gap-2">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 truncate">
          {label}
        </p>
        <p className="text-2xl font-extrabold text-slate-900 leading-none tracking-tight">
          {value}
        </p>
      </div>
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${bg}`}
      >
        <span className={tc}>{icon}</span>
      </div>
    </div>
    <div
      className={`absolute bottom-0 left-0 right-0 h-[3px] ${barBg} opacity-60`}
    />
  </div>
);

const BandBadge: React.FC<{ score: number | null; target?: number }> = ({
  score,
  target,
}) => {
  if (score === null) return <span className="text-xs text-slate-300">—</span>;
  const met = target ? score >= target : false;
  const cls = met
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : score >= 6.0
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-red-50 text-red-700 border-red-200";
  return (
    <span
      className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[12px] font-bold border ${cls}`}
    >
      {score}
    </span>
  );
};

const StageBadge: React.FC<{ stage: IeltsStudent["currentStage"] }> = ({
  stage,
}) => {
  const cfg: Record<string, { cls: string; label: string }> = {
    planning: {
      cls: "bg-blue-50 text-blue-700 border-blue-200",
      label: "Planning",
    },
    booked: {
      cls: "bg-violet-50 text-violet-700 border-violet-200",
      label: "Booked",
    },
    appeared: {
      cls: "bg-amber-50 text-amber-700 border-amber-200",
      label: "Appeared",
    },
    qualified: {
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
      label: "Qualified",
    },
    retake: { cls: "bg-red-50 text-red-700 border-red-200", label: "Retake" },
  };
  const c = cfg[stage];
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-semibold border ${c.cls}`}
    >
      {c.label}
    </span>
  );
};

const StatusBadge: React.FC<{ status: IeltsStudent["status"] }> = ({
  status,
}) => {
  const cfg: Record<
    string,
    { cls: string; icon: React.ReactNode; label: string }
  > = {
    preparing: {
      cls: "text-blue-700 bg-blue-50 border-blue-200",
      icon: <RiBookOpenLine size={11} />,
      label: "Preparing",
    },
    booked: {
      cls: "text-violet-700 bg-violet-50 border-violet-200",
      icon: <RiCalendarCheckLine size={11} />,
      label: "Booked",
    },
    completed: {
      cls: "text-emerald-700 bg-emerald-50 border-emerald-200",
      icon: <RiCheckboxCircleLine size={11} />,
      label: "Completed",
    },
    retake_required: {
      cls: "text-red-700 bg-red-50 border-red-200",
      icon: <RiRefreshLine size={11} />,
      label: "Retake Req.",
    },
  };
  const c = cfg[status];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${c.cls}`}
    >
      {c.icon} {c.label}
    </span>
  );
};

const ActionBadge: React.FC<{ action: IeltsStudent["nextAction"] }> = ({
  action,
}) => {
  const cfg: Record<string, { cls: string; label: string }> = {
    book_test: {
      cls: "bg-blue-50 text-blue-700 border-blue-200",
      label: "Book Test",
    },
    follow_up: {
      cls: "bg-violet-50 text-violet-700 border-violet-200",
      label: "Follow-up",
    },
    apply: {
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
      label: "Apply Now",
    },
    retake: {
      cls: "bg-red-50 text-red-700 border-red-200",
      label: "Schedule Retake",
    },
    none: { cls: "bg-slate-50 text-slate-500 border-slate-200", label: "—" },
  };
  const c = cfg[action];
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-semibold border ${c.cls}`}
    >
      {c.label}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════
// STUDENT IELTS PROFILE DRAWER
// ═══════════════════════════════════════════════════════════════

const StudentDrawer: React.FC<{
  student: IeltsStudent | null;
  onClose: () => void;
}> = ({ student, onClose }) => {
  if (!student) return null;
  const s = student;

  const tabItems = [
    {
      key: "overview",
      label: (
        <span className="flex items-center gap-1.5">
          <RiBarChartLine size={13} /> Overview
        </span>
      ),
      children: (
        <div className="p-4 flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-2.5">
            {[
              {
                label: "Target Band",
                value: s.targetBand,
                cls: "text-indigo-700",
                bg: "bg-indigo-50",
              },
              {
                label: "Mock Score",
                value: s.mockScore ?? "—",
                cls: "text-amber-700",
                bg: "bg-amber-50",
              },
              {
                label: "Actual Score",
                value: s.actualScore ?? "—",
                cls:
                  s.actualScore && s.actualScore >= s.targetBand
                    ? "text-emerald-700"
                    : "text-red-700",
                bg:
                  s.actualScore && s.actualScore >= s.targetBand
                    ? "bg-emerald-50"
                    : "bg-red-50",
              },
              {
                label: "Status",
                value: <StatusBadge status={s.status} />,
                cls: "",
                bg: "bg-white",
              },
              {
                label: "Next Action",
                value: <ActionBadge action={s.nextAction} />,
                cls: "",
                bg: "bg-white",
              },
              {
                label: "Retake Count",
                value: s.retakeCount,
                cls: "text-slate-700",
                bg: "bg-slate-50",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`${item.bg} rounded-xl p-3 border border-slate-100`}
              >
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  {item.label}
                </div>
                <div className={`text-lg font-extrabold ${item.cls}`}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
          {/* Band Breakdown */}
          {s.actualScore && (
            <div className="bg-white rounded-xl border border-slate-100 p-4">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Score Breakdown
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Listening", value: s.listeningScore },
                  { label: "Reading", value: s.readingScore },
                  { label: "Writing", value: s.writingScore },
                  { label: "Speaking", value: s.speakingScore },
                ].map((b) => (
                  <div
                    key={b.label}
                    className="text-center p-2 rounded-lg bg-slate-50 border border-slate-100"
                  >
                    <div className="text-[9px] font-semibold text-slate-400 uppercase">
                      {b.label}
                    </div>
                    <div className="mt-1">
                      <BandBadge score={b.value} target={s.targetBand} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Details */}
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              Test Details
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                {
                  label: "Test Date",
                  value: s.testDate
                    ? new Date(s.testDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Not booked",
                  icon: <RiCalendarLine size={12} />,
                },
                {
                  label: "Test Center",
                  value: s.testCenter || "—",
                  icon: <RiMapPinLine size={12} />,
                },
                {
                  label: "TRF Number",
                  value: s.trfNumber || "—",
                  icon: <RiFileListLine size={12} />,
                },
                {
                  label: "Intake",
                  value: s.intake,
                  icon: <RiCalendarCheckLine size={12} />,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-1 mb-0.5 text-slate-400">
                    {item.icon}
                    <span className="text-[10px] font-semibold uppercase tracking-wider">
                      {item.label}
                    </span>
                  </div>
                  <div className="text-[13px] font-bold text-slate-700">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "mocks",
      label: (
        <span className="flex items-center gap-1.5">
          <RiHistoryLine size={13} /> Mock History ({s.mockHistory.length})
        </span>
      ),
      children: (
        <div className="p-4 flex flex-col gap-3">
          {s.mockHistory.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-slate-400">
              <RiHistoryLine size={28} className="opacity-30 mb-2" />
              <p className="text-sm font-medium text-slate-500">
                No mock tests recorded
              </p>
            </div>
          ) : (
            s.mockHistory.map((mock, idx) => (
              <div
                key={mock.id}
                className="bg-white rounded-xl border border-slate-100 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-[11px] font-bold">
                      #{s.mockHistory.length - idx}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(mock.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <BandBadge score={mock.overall} target={s.targetBand} />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "L", value: mock.listening },
                    { label: "R", value: mock.reading },
                    { label: "W", value: mock.writing },
                    { label: "S", value: mock.speaking },
                  ].map((b) => (
                    <div
                      key={b.label}
                      className="text-center p-1.5 rounded-lg bg-slate-50"
                    >
                      <div className="text-[9px] font-semibold text-slate-400">
                        {b.label}
                      </div>
                      <div className="text-xs font-bold text-slate-700">
                        {b.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      ),
    },
  ];

  return (
    <Drawer
      open={!!student}
      onClose={onClose}
      width={520}
      title={null}
      styles={{
        body: { padding: 0, background: "#F8FAFC" },
        header: { display: "none" },
      }}
    >
      <div className="bg-gradient-to-r from-indigo-700 via-violet-600 to-purple-500 px-6 py-5 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/[0.05]" />
        <div className="flex justify-between items-start relative z-10">
          <div className="flex items-center gap-3">
            <UserAvatar name={s.name} size="lg" />
            <div>
              <h2 className="text-[17px] font-bold text-white leading-tight">
                {s.name}
              </h2>
              <p className="text-xs text-white/60 flex items-center gap-1 mt-0.5">
                <RiPhoneLine size={12} /> {s.phone}
              </p>
              <p className="text-xs text-white/50 flex items-center gap-1 mt-0.5">
                <RiMailLine size={12} /> {s.email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-white/15 hover:bg-white/25 border-none rounded-lg p-1.5 cursor-pointer flex text-white transition-colors"
          >
            <RiCloseLine size={18} />
          </button>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap relative z-10">
          <StageBadge stage={s.currentStage} />
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/15 text-white border border-white/20">
            {s.country}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/15 text-white border border-white/20">
            Target: {s.targetBand}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/15 text-white border border-white/20">
            {s.counselor}
          </span>
        </div>
      </div>
      <Tabs
        items={tabItems}
        defaultActiveKey="overview"
        className="ielts-drawer-tabs"
        style={{ margin: 0 }}
      />
    </Drawer>
  );
};

// ═══════════════════════════════════════════════════════════════
// FUNNEL + AT RISK + COUNSELOR METRICS
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════

const IeltsPage: React.FC = () => {
  const [students] = useState<IeltsStudent[]>(ALL_STUDENTS);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [counselorFilter, setCounselorFilter] = useState("");
  const [intakeFilter, setIntakeFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<IeltsStudent | null>(
    null,
  );

  const filtered = useMemo(() => {
    return students.filter((s) => {
      if (
        search &&
        !s.name.toLowerCase().includes(search.toLowerCase()) &&
        !s.phone.includes(search)
      )
        return false;
      if (stageFilter && s.currentStage !== stageFilter) return false;
      if (counselorFilter && s.counselor !== counselorFilter) return false;
      if (intakeFilter && s.intake !== intakeFilter) return false;
      if (countryFilter && s.country !== countryFilter) return false;
      return true;
    });
  }, [
    students,
    search,
    stageFilter,
    counselorFilter,
    intakeFilter,
    countryFilter,
  ]);

  const stats = useMemo(() => {
    const qualified = students.filter((s) => s.currentStage === "qualified");
    const scores = students
      .filter((s) => s.actualScore !== null)
      .map((s) => s.actualScore!);
    const avgBand =
      scores.length > 0
        ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
        : "—";
    return {
      total: students.length,
      planning: students.filter((s) => s.currentStage === "planning").length,
      booked: students.filter((s) => s.currentStage === "booked").length,
      completed: students.filter((s) => s.actualScore !== null).length,
      avgBand,
      readyToApply: qualified.length,
    };
  }, [students]);

  const handleExport = () => {
    const headers = [
      "Student",
      "Counselor",
      "Stage",
      "Target Band",
      "Mock Score",
      "Actual Score",
      "Test Date",
      "Status",
      "Country",
      "Intake",
    ];
    const rows = filtered.map((s) => [
      s.name,
      s.counselor,
      s.currentStage,
      s.targetBand,
      s.mockScore ?? "",
      s.actualScore ?? "",
      s.testDate ?? "",
      s.status,
      s.country,
      s.intake,
    ]);
    const csv = [
      headers.join(","),
      ...rows.map((r) => r.map((c) => `"${c}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ielts_students.csv";
    a.click();
    URL.revokeObjectURL(url);
    message.success({ content: "CSV exported!", duration: 2 });
  };

  const hasFilters = !!(
    search ||
    stageFilter ||
    counselorFilter ||
    intakeFilter ||
    countryFilter
  );
  const clearFilters = () => {
    setSearch("");
    setStageFilter("");
    setCounselorFilter("");
    setIntakeFilter("");
    setCountryFilter("");
  };

  const columns: ColumnsType<IeltsStudent> = [
    {
      title: "Student",
      dataIndex: "name",
      key: "name",
      width: 180,
      fixed: "left" as const,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string, record) => (
        <button
          onClick={() => setSelectedStudent(record)}
          className="flex items-center gap-2 bg-transparent border-none cursor-pointer p-0 text-left w-full group"
        >
          <UserAvatar name={name} size="md" />
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
              {name}
            </div>
            <div className="text-[10px] text-slate-400">{record.country}</div>
          </div>
        </button>
      ),
    },
    {
      title: "Counselor",
      dataIndex: "counselor",
      key: "counselor",
      width: 120,
      render: (c: string) => (
        <span className="text-[13px] text-slate-600 truncate">{c}</span>
      ),
    },
    {
      title: "Stage",
      dataIndex: "currentStage",
      key: "stage",
      width: 100,
      filters: [
        { text: "Planning", value: "planning" },
        { text: "Booked", value: "booked" },
        { text: "Appeared", value: "appeared" },
        { text: "Qualified", value: "qualified" },
        { text: "Retake", value: "retake" },
      ],
      onFilter: (v, r) => r.currentStage === v,
      render: (s: IeltsStudent["currentStage"]) => <StageBadge stage={s} />,
    },
    {
      title: "Target",
      dataIndex: "targetBand",
      key: "target",
      width: 70,
      render: (v: number) => (
        <span className="text-[13px] font-bold text-indigo-700">{v}</span>
      ),
    },
    {
      title: "Mock",
      dataIndex: "mockScore",
      key: "mock",
      width: 70,
      sorter: (a, b) => (a.mockScore ?? 0) - (b.mockScore ?? 0),
      render: (v: number | null, record) => (
        <BandBadge score={v} target={record.targetBand} />
      ),
    },
    {
      title: "Actual",
      dataIndex: "actualScore",
      key: "actual",
      width: 70,
      sorter: (a, b) => (a.actualScore ?? 0) - (b.actualScore ?? 0),
      render: (v: number | null, record) => (
        <BandBadge score={v} target={record.targetBand} />
      ),
    },
    {
      title: "Test Date",
      dataIndex: "testDate",
      key: "testDate",
      width: 100,
      sorter: (a, b) =>
        new Date(a.testDate || 0).getTime() -
        new Date(b.testDate || 0).getTime(),
      render: (d: string | null) => {
        if (!d)
          return <span className="text-xs text-slate-300">Not booked</span>;
        const isFuture = new Date(d) > new Date();
        const daysAway = Math.ceil(
          (new Date(d).getTime() - Date.now()) / 86400000,
        );
        return (
          <div>
            <span
              className={`text-xs font-medium ${isFuture && daysAway <= 7 ? "text-red-600" : "text-slate-600"}`}
            >
              {new Date(d).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
            {isFuture && (
              <p className="text-[10px] text-slate-400">{daysAway}d away</p>
            )}
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (s: IeltsStudent["status"]) => <StatusBadge status={s} />,
    },
    {
      title: "Next Action",
      dataIndex: "nextAction",
      key: "next",
      width: 120,
      render: (a: IeltsStudent["nextAction"]) => <ActionBadge action={a} />,
    },
    {
      title: "",
      key: "view",
      width: 40,
      fixed: "right" as const,
      render: (_: unknown, record: IeltsStudent) => (
        <Tooltip title="View Profile">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedStudent(record);
            }}
            className="bg-transparent border-none p-1.5 rounded-lg cursor-pointer flex text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <RiEyeLine size={15} />
          </button>
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full p-5 overflow-hidden min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap min-w-0">
        <div className="min-w-0">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            IELTS Management
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Track scores, manage test preparation & monitor readiness
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-semibold bg-white text-slate-600 border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all shrink-0"
        >
          <RiDownloadLine size={15} /> Export
        </button>
      </div>

      {/* KPI Cards */}
      <div className="w-full min-w-0 overflow-hidden">
        <div
          className="overflow-x-auto pb-1"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#CBD5E1 transparent",
          }}
        >
          <div className="grid grid-cols-6 gap-3 min-w-[900px]">
            <StatCard
              label="Total Students"
              value={stats.total}
              icon={<RiGroupLine size={17} />}
              bg="bg-blue-50"
              tc="text-blue-500"
              barBg="bg-blue-500"
            />
            <StatCard
              label="IELTS Planning"
              value={stats.planning}
              icon={<RiBookOpenLine size={17} />}
              bg="bg-indigo-50"
              tc="text-indigo-500"
              barBg="bg-indigo-500"
            />
            <StatCard
              label="Test Booked"
              value={stats.booked}
              icon={<RiCalendarCheckLine size={17} />}
              bg="bg-violet-50"
              tc="text-violet-500"
              barBg="bg-violet-500"
            />
            <StatCard
              label="Test Completed"
              value={stats.completed}
              icon={<RiCheckboxCircleLine size={17} />}
              bg="bg-emerald-50"
              tc="text-emerald-500"
              barBg="bg-emerald-500"
            />
            <StatCard
              label="Avg Band Score"
              value={stats.avgBand}
              icon={<RiAwardLine size={17} />}
              bg="bg-amber-50"
              tc="text-amber-500"
              barBg="bg-amber-500"
            />
            <StatCard
              label="Ready to Apply"
              value={stats.readyToApply}
              icon={<RiShieldCheckLine size={17} />}
              bg="bg-cyan-50"
              tc="text-cyan-500"
              barBg="bg-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 min-w-0 overflow-hidden">
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student..."
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-[13px] text-slate-700 bg-slate-50 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all w-[180px] placeholder:text-slate-400"
          />
          <Select
            value={stageFilter || undefined}
            onChange={(v) => setStageFilter(v || "")}
            placeholder="Stage"
            allowClear
            style={{ width: 120 }}
            options={[
              { value: "planning", label: "Planning" },
              { value: "booked", label: "Booked" },
              { value: "appeared", label: "Appeared" },
              { value: "qualified", label: "Qualified" },
              { value: "retake", label: "Retake" },
            ]}
          />
          <Select
            value={counselorFilter || undefined}
            onChange={(v) => setCounselorFilter(v || "")}
            placeholder="Counselor"
            allowClear
            style={{ width: 130 }}
            options={COUNSELORS.map((c) => ({ value: c, label: c }))}
          />
          <Select
            value={intakeFilter || undefined}
            onChange={(v) => setIntakeFilter(v || "")}
            placeholder="Intake"
            allowClear
            style={{ width: 120 }}
            options={INTAKES.map((i) => ({ value: i, label: i }))}
          />
          <Select
            value={countryFilter || undefined}
            onChange={(v) => setCountryFilter(v || "")}
            placeholder="Country"
            allowClear
            style={{ width: 120 }}
            options={COUNTRIES.map((c) => ({ value: c, label: c }))}
          />
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
            >
              <RiRefreshLine size={11} /> Clear
            </button>
          )}
          <span className="ml-auto text-xs font-medium text-slate-400 shrink-0">
            {filtered.length} of {students.length} students
          </span>
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
              rowHoverBg: "#F5F3FF",
              borderColor: "#F1F5F9",
              cellPaddingBlock: 12,
              cellPaddingInline: 12,
              fontSize: 13,
            },
          },
        }}
      >
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden min-w-0">
          <Table<IeltsStudent>
            dataSource={filtered}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (t, r) => `${r[0]}–${r[1]} of ${t}`,
              style: { padding: "12px 16px", margin: 0 },
            }}
            scroll={{ x: 1150 }}
            size="middle"
            locale={{
              emptyText: (
                <Empty
                  description="No IELTS students found"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
            onRow={(record) => ({
              onClick: () => setSelectedStudent(record),
              style: { cursor: "pointer" },
            })}
            rowClassName={(record) =>
              record.currentStage === "retake"
                ? "!bg-red-50/30"
                : record.currentStage === "qualified"
                  ? "!bg-emerald-50/20"
                  : ""
            }
          />
        </div>
      </ConfigProvider>

      {/* Drawer */}
      <StudentDrawer
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />

      <style>{`
        .ielts-drawer-tabs .ant-tabs-nav { padding: 0 16px; margin: 0; background: white; border-bottom: 1px solid #F1F5F9; }
        .ielts-drawer-tabs .ant-tabs-tab { padding: 12px 8px; font-size: 13px; font-weight: 600; }
        .ielts-drawer-tabs .ant-tabs-content-holder { background: #F8FAFC; }
      `}</style>
    </div>
  );
};

export default IeltsPage;
