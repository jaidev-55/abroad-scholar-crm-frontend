import React, { useState, useMemo, useCallback } from "react";
import {
  Table,
  Input,
  Select,
  DatePicker,
  Tooltip,
  Modal,
  ConfigProvider,
  message,
  Spin,
} from "antd";
import type { TableColumnsType } from "antd";
import type { Dayjs } from "dayjs";

import { useQuery } from "@tanstack/react-query";
import {
  RiSearchLine,
  RiDownloadLine,
  RiUserLine,
  RiFireLine,
  RiTimeLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
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
  RiCheckLine,
  RiRefreshLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiFilterOffLine,
  RiLoader4Line,
  RiGlobalLine,
} from "react-icons/ri";
import {
  getLeads,
  type ApiLead,
  type LeadStatus as ApiLeadStatus,
  type LeadPriority,
} from "../../api/leads";
import { getUsers } from "../../api/auth";
import ExportModal from "../../components/leadspipeline/export/ExportModal";
import type { Lead } from "../../types/lead";

const { RangePicker } = DatePicker;

// ─── Types ────────────────────────────────────────────
type Priority = "Hot" | "Warm" | "Cold";
type DateRangeValue = [Dayjs, Dayjs] | null;
type BulkModalType = "assign" | null;

// ─── Map API → local ──────────────────────────────────
const STATUS_LABEL: Record<ApiLeadStatus, string> = {
  NEW: "New",
  IN_PROGRESS: "In Progress",
  CONVERTED: "Converted",
  LOST: "Lost",
};

const STATUS_CLS: Record<ApiLeadStatus, string> = {
  NEW: "bg-blue-50 text-blue-600 border-blue-200",
  IN_PROGRESS: "bg-violet-50 text-violet-600 border-violet-200",
  CONVERTED: "bg-emerald-50 text-emerald-600 border-emerald-200",
  LOST: "bg-red-50 text-red-500 border-red-200",
};

const STATUS_DOT_CLS: Record<ApiLeadStatus, string> = {
  NEW: "bg-blue-400",
  IN_PROGRESS: "bg-violet-400",
  CONVERTED: "bg-emerald-400",
  LOST: "bg-red-400",
};

const PRIORITY_MAP: Record<
  LeadPriority,
  { label: Priority; cls: string; icon: React.ReactNode }
> = {
  HOT: {
    label: "Hot",
    cls: "text-red-600 bg-red-50 border-red-200",
    icon: <RiFireLine size={10} />,
  },
  WARM: {
    label: "Warm",
    cls: "text-amber-600 bg-amber-50 border-amber-200",
    icon: <RiFlashlightLine size={10} />,
  },
  COLD: {
    label: "Cold",
    cls: "text-blue-600 bg-blue-50 border-blue-200",
    icon: <RiSnowflakeLine size={10} />,
  },
};

const PRIORITY_ORDER: Record<LeadPriority, number> = {
  HOT: 0,
  WARM: 1,
  COLD: 2,
};

// ─── Source style map ─────────────────────────────────
const SOURCE_STYLE_MAP: Record<string, string> = {
  INSTAGRAM: "bg-pink-50 text-pink-700 border-pink-200",
  WEBSITE: "bg-blue-50 text-blue-700 border-blue-200",
  WALK_IN: "bg-amber-50 text-amber-700 border-amber-200",
  GOOGLE_ADS: "bg-yellow-50 text-yellow-700 border-yellow-200",
  META_ADS: "bg-indigo-50 text-indigo-700 border-indigo-200",
  REFERRAL: "bg-emerald-50 text-emerald-700 border-emerald-200",
  FACEBOOK: "bg-blue-50 text-blue-700 border-blue-200",
  EDUCATION_FAIR: "bg-violet-50 text-violet-700 border-violet-200",
};

const DEFAULT_SOURCE_STYLE = "bg-slate-50 text-slate-600 border-slate-200";

// ─── Helpers ──────────────────────────────────────────
const formatSourceLabel = (src: string): string =>
  src.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const getInitials = (name: string): string =>
  (name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const getHue = (name: string): number =>
  name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

// ─── Components ───────────────────────────────────────
interface AvatarProps {
  name: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ name, size = 32 }) => {
  const ini = getInitials(name);
  const hue = getHue(name);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        background: `hsl(${hue}, 55%, 90%)`,
        color: `hsl(${hue}, 45%, 32%)`,
        fontSize: size * 0.36,
        fontWeight: 700,
      }}
      className="flex items-center justify-center shrink-0 select-none"
    >
      {ini}
    </div>
  );
};

const PriBadge: React.FC<{ p: LeadPriority }> = ({ p }) => {
  const { cls, icon, label } = PRIORITY_MAP[p];
  return (
    <span
      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold border ${cls}`}
    >
      {icon}
      {label}
    </span>
  );
};

const StatusBadge: React.FC<{ s: ApiLeadStatus }> = ({ s }) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_CLS[s]}`}
  >
    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT_CLS[s]}`} />
    {STATUS_LABEL[s]}
  </span>
);

const SrcBadge: React.FC<{ src: string }> = ({ src }) => {
  if (!src) return <span className="text-[11px] text-slate-300">—</span>;
  const style = SOURCE_STYLE_MAP[src] ?? DEFAULT_SOURCE_STYLE;
  return (
    <span
      className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${style}`}
    >
      {formatSourceLabel(src)}
    </span>
  );
};

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ size?: number }>;
  colorCls: string;
  barCls: string;
  delta?: number;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  colorCls,
  barCls,
  delta,
  loading,
}) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 relative overflow-hidden hover:shadow-md hover:shadow-slate-100 transition-all duration-200 cursor-default">
    <div
      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${colorCls}`}
    >
      <Icon size={20} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
        {label}
      </p>
      <div className="flex items-baseline gap-1.5 mt-0.5">
        {loading ? (
          <div className="h-7 w-10 bg-slate-100 animate-pulse rounded-lg" />
        ) : (
          <p className="text-2xl font-black text-slate-900 leading-none">
            {value}
          </p>
        )}
        {delta !== undefined && !loading && (
          <span
            className={`text-[10px] font-bold flex items-center gap-0.5 ${
              delta >= 0 ? "text-emerald-600" : "text-red-500"
            }`}
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
    <div className={`absolute bottom-0 left-0 right-0 h-[3px] ${barCls}`} />
  </div>
);

// ─── Detail Drawer ────────────────────────────────────
interface DetailDrawerProps {
  lead: ApiLead;
  today: string;
  onClose: () => void;
}

const DetailDrawer: React.FC<DetailDrawerProps> = ({
  lead,
  today,
  onClose,
}) => {
  const fu = lead.followUpDate?.split("T")[0] ?? null;
  const isOverdue = fu ? fu < today : false;
  const noteCount = lead.notes?.length ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="relative w-[460px] h-full bg-slate-50 flex flex-col shadow-2xl">
        {/* Hero header */}
        <div className="px-6 pt-6 pb-5 relative overflow-hidden bg-gradient-to-br from-blue-700 to-blue-500 shrink-0">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/[0.07]" />
          <div className="absolute -bottom-6 left-20 w-24 h-24 rounded-full bg-white/[0.05]" />

          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-3">
              <Avatar name={lead.fullName} size={50} />
              <div>
                <h2 className="text-lg font-black text-white leading-tight">
                  {lead.fullName}
                </h2>
                <p className="text-xs text-white/60 mt-0.5">
                  {lead.country ?? ""}
                  {lead.source ? ` · ${formatSourceLabel(lead.source)}` : ""}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white border-none cursor-pointer transition-colors"
              aria-label="Close drawer"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-2 mt-4 flex-wrap relative z-10">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/20 text-white border border-white/25">
              {STATUS_LABEL[lead.status]}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/20 text-white border border-white/25">
              {PRIORITY_MAP[lead.priority].label} Priority
            </span>
            {lead.counselor?.name && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/20 text-white border border-white/25">
                {lead.counselor.name}
              </span>
            )}
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
          {/* Contact Info */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              Contact Info
            </p>
            <div className="flex flex-col gap-2.5">
              <a
                href={`tel:${lead.phone}`}
                className="flex items-center gap-2.5 text-[13px] text-slate-700 hover:text-blue-600 no-underline transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <RiPhoneLine size={14} className="text-blue-500" />
                </div>
                {lead.phone}
              </a>
              {lead.email && (
                <a
                  href={`mailto:${lead.email}`}
                  className="flex items-center gap-2.5 text-[13px] text-slate-700 hover:text-blue-600 no-underline transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <RiMailLine size={14} className="text-blue-500" />
                  </div>
                  <span className="truncate">{lead.email}</span>
                </a>
              )}
            </div>
          </div>

          {/* Details grid */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              Lead Details
            </p>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { label: "Country", value: lead.country ?? "—" },
                  {
                    label: "Source",
                    value: lead.source ? formatSourceLabel(lead.source) : "—",
                  },
                  {
                    label: "Counselor",
                    value: lead.counselor?.name ?? "Unassigned",
                  },
                  {
                    label: "IELTS Score",
                    value:
                      lead.ieltsScore != null ? `Band ${lead.ieltsScore}` : "—",
                  },
                  {
                    label: "Notes",
                    value: `${noteCount} note${noteCount !== 1 ? "s" : ""}`,
                  },
                  {
                    label: "Created",
                    value: lead.createdAt
                      ? new Date(lead.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—",
                  },
                ] as const
              ).map(({ label, value }) => (
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

          {/* Follow-up */}
          {fu && (
            <div
              className={`rounded-2xl border p-4 shadow-sm ${
                isOverdue
                  ? "bg-red-50 border-red-200"
                  : "bg-white border-slate-100"
              }`}
            >
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Follow-up Date
              </p>
              <div
                className={`flex items-center gap-2 text-sm font-bold ${
                  isOverdue ? "text-red-600" : "text-slate-800"
                }`}
              >
                <RiCalendarLine size={16} />
                {new Date(fu).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "long",
                  day: "numeric",
                })}
                {isOverdue && (
                  <span className="text-[11px] font-semibold bg-red-100 text-red-600 px-2 py-0.5 rounded-full border border-red-200 ml-1">
                    Overdue
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Lost reason */}
          {lead.lostReason && (
            <div className="bg-red-50 rounded-2xl border border-red-200 p-4 shadow-sm">
              <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">
                Lost Reason
              </p>
              <p className="text-[13px] font-semibold text-red-700">
                {formatSourceLabel(lead.lostReason)}
              </p>
            </div>
          )}

          {/* Notes — scrollable */}
          {noteCount > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 shrink-0">
                Notes ({noteCount})
              </p>
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                {lead.notes!.map((note) => (
                  <div
                    key={note.id}
                    className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100"
                  >
                    <RiStickyNoteLine
                      size={13}
                      className="text-blue-400 mt-0.5 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {note.content}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {new Date(note.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────
const AllLeadsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [sourceF, setSourceF] = useState<string | null>(null);
  const [counselorF, setCounselorF] = useState<string | null>(null);
  const [countryF, setCountryF] = useState<string | null>(null);
  const [priorityF, setPriorityF] = useState<LeadPriority | null>(null);
  const [statusF, setStatusF] = useState<ApiLeadStatus | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeValue>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkModal, setBulkModal] = useState<BulkModalType>(null);
  const [bulkValue, setBulkValue] = useState<string | null>(null);
  const [detailLead, setDetailLead] = useState<ApiLead | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // ── Fetch leads ───────────────────────────────────
  const {
    data: rawLeads = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      "leads",
      sourceF,
      counselorF,
      countryF,
      priorityF,
      statusF,
      dateRange?.[0]?.format("YYYY-MM-DD"),
      dateRange?.[1]?.format("YYYY-MM-DD"),
    ],
    queryFn: () =>
      getLeads({
        source: sourceF ?? undefined,
        country: countryF ?? undefined,
        priority: priorityF ?? undefined,
        status: statusF ?? undefined,
        startDate: dateRange?.[0]?.format("YYYY-MM-DD"),
        endDate: dateRange?.[1]?.format("YYYY-MM-DD"),
      }),
    placeholderData: (prev) => prev,
  });

  // ── Fetch counselors for filter ───────────────────
  const { data: counselorUsers = [] } = useQuery({
    queryKey: ["counselors"],
    queryFn: () => getUsers("COUNSELOR"),
    staleTime: 5 * 60 * 1000,
  });

  // ── Refresh handler with spinner ──────────────────
  const handleRefresh = useCallback(async () => {
    if (isRefreshing || isLoading) return;
    setIsRefreshing(true);
    try {
      await refetch();
      message.success("Data refreshed");
    } catch {
      message.error("Failed to refresh");
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, isLoading, refetch]);

  // ── Client-side search filter ─────────────────────
  const filtered = useMemo<ApiLead[]>(() => {
    if (!search.trim()) return rawLeads;
    const q = search.toLowerCase();
    return rawLeads.filter(
      (r) =>
        r.fullName.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        (r.email?.toLowerCase() ?? "").includes(q),
    );
  }, [rawLeads, search]);

  // ── Unique filter values derived from data ────────
  const sources = useMemo(
    () => [...new Set(rawLeads.map((r) => r.source).filter(Boolean))],
    [rawLeads],
  );
  const countries = useMemo(
    () => [...new Set(rawLeads.map((r) => r.country).filter(Boolean))],
    [rawLeads],
  );

  // ── Stats ─────────────────────────────────────────
  const stats = useMemo(
    () => ({
      total: rawLeads.length,
      hot: rawLeads.filter((r) => r.priority === "HOT").length,
      due: rawLeads.filter(
        (r) =>
          r.followUpDate &&
          r.followUpDate.split("T")[0] <= today &&
          r.status !== "LOST",
      ).length,
      conv: rawLeads.filter((r) => r.status === "CONVERTED").length,
      lost: rawLeads.filter((r) => r.status === "LOST").length,
    }),
    [rawLeads, today],
  );

  const hasFilters = !!(
    search ||
    sourceF ||
    counselorF ||
    countryF ||
    priorityF ||
    statusF ||
    dateRange
  );

  const apiLeadToLocal = (a: ApiLead): Lead => ({
    id: a.id,
    name: a.fullName,
    phone: a.phone,
    email: a.email ?? "",
    country: a.country,
    source: a.source,
    status: a.status,
    stage:
      {
        NEW: "new",
        IN_PROGRESS: "progress",
        CONVERTED: "converted",
        LOST: "lost",
      }[a.status] ?? "new",
    priority: (a.priority.charAt(0) +
      a.priority.slice(1).toLowerCase()) as Lead["priority"],
    counselor: a.counselor?.name ?? "",
    followUp: a.followUpDate?.split("T")[0] ?? "",
    ieltsScore: a.ieltsScore != null ? String(a.ieltsScore) : undefined,
    notes: (a.notes ?? []).map((n) => ({
      id: n.id,
      text: n.content,
      createdAt: n.createdAt,
      author: a.counselor?.name ?? "Admin",
    })),
    createdAt: a.createdAt.split("T")[0],
    updatedAt: a.updatedAt,
  });

  const clearFilters = useCallback(() => {
    setSearch("");
    setSourceF(null);
    setCounselorF(null);
    setCountryF(null);
    setPriorityF(null);
    setStatusF(null);
    setDateRange(null);
  }, []);

  // ── Columns ───────────────────────────────────────
  const columns: TableColumnsType<ApiLead> = [
    {
      title: (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Student
        </span>
      ),
      dataIndex: "fullName",
      key: "name",
      width: 200,
      fixed: "left",
      sorter: (a: ApiLead, b: ApiLead) => a.fullName.localeCompare(b.fullName),
      render: (name: string, rec: ApiLead) => (
        <div className="flex items-center gap-2.5 py-0.5">
          <Avatar name={name} size={34} />
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-slate-900 truncate leading-tight">
              {name}
            </div>
            <div className="text-[11px] text-slate-400 truncate flex items-center gap-1">
              <RiGlobalLine size={9} /> {rec.country}
            </div>
          </div>
          {rec.status === "LOST" && (
            <Tooltip title="Lost">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 ml-auto" />
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Contact
        </span>
      ),
      key: "contact",
      width: 190,
      render: (_: unknown, rec: ApiLead) => (
        <div className="flex flex-col gap-0.5">
          <a
            href={`tel:${rec.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-slate-600 hover:text-blue-600 flex items-center gap-1 no-underline transition-colors"
          >
            <RiPhoneLine size={11} className="text-slate-400 shrink-0" />
            {rec.phone}
          </a>
          {rec.email && (
            <a
              href={`mailto:${rec.email}`}
              onClick={(e) => e.stopPropagation()}
              className="text-[11px] text-slate-400 hover:text-blue-600 flex items-center gap-1 no-underline transition-colors truncate max-w-[200px]"
            >
              <RiMailLine size={11} className="shrink-0" />
              {rec.email}
            </a>
          )}
        </div>
      ),
    },
    {
      title: (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Status
        </span>
      ),
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      sorter: (a: ApiLead, b: ApiLead) => a.status.localeCompare(b.status),
      render: (s: ApiLeadStatus) => (
        <div className="flex justify-center">
          <StatusBadge s={s} />
        </div>
      ),
    },
    {
      title: (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Source
        </span>
      ),
      dataIndex: "source",
      key: "source",
      width: 120,
      align: "center",
      render: (src: string) => <SrcBadge src={src} />,
    },
    {
      title: (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Priority
        </span>
      ),
      dataIndex: "priority",
      key: "priority",
      width: 90,
      align: "center",
      sorter: (a: ApiLead, b: ApiLead) =>
        PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority],
      render: (p: LeadPriority) => (
        <div className="flex justify-center">
          <PriBadge p={p} />
        </div>
      ),
    },
    {
      title: (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Counselor
        </span>
      ),
      key: "counselor",
      width: 130,
      align: "center",
      render: (_: unknown, rec: ApiLead) => {
        const name = rec.counselor?.name;
        return !name ? (
          <span className="text-[11px] text-slate-300">Unassigned</span>
        ) : (
          <div className="flex items-center justify-center gap-1.5">
            <Avatar name={name} size={22} />
            <span className="text-xs text-slate-600">{name.split(" ")[0]}</span>
          </div>
        );
      },
    },
    {
      title: (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          IELTS
        </span>
      ),
      dataIndex: "ieltsScore",
      key: "ielts",
      width: 70,
      align: "center",
      render: (v: number | null) =>
        v != null ? (
          <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-lg border border-violet-200">
            {v}
          </span>
        ) : (
          <span className="text-[11px] text-slate-300">—</span>
        ),
    },
    {
      title: (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Follow-up
        </span>
      ),
      dataIndex: "followUpDate",
      key: "followUp",
      width: 115,
      align: "center",
      sorter: (a: ApiLead, b: ApiLead) =>
        new Date(a.followUpDate ?? 0).getTime() -
        new Date(b.followUpDate ?? 0).getTime(),
      render: (date: string | null) => {
        if (!date) return <span className="text-[11px] text-slate-300">—</span>;
        const d = date.split("T")[0];
        const overdue = d < today;
        const isToday = d === today;
        return (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold border ${
              overdue
                ? "bg-red-50 text-red-600 border-red-200"
                : isToday
                  ? "bg-amber-50 text-amber-600 border-amber-200"
                  : "bg-slate-50 text-slate-500 border-slate-200"
            }`}
          >
            <RiCalendarLine size={10} />
            {new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
            {overdue && <RiErrorWarningLine size={10} className="ml-0.5" />}
          </span>
        );
      },
    },
    {
      title: (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Notes
        </span>
      ),
      key: "notes",
      width: 75,
      align: "center",
      render: (_: unknown, rec: ApiLead) => {
        const n = rec.notes?.length ?? 0;
        return (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] font-semibold ${
              n > 0
                ? "bg-blue-50 text-blue-600 border-blue-200"
                : "bg-slate-50 text-slate-400 border-slate-200"
            }`}
          >
            <RiStickyNoteLine size={11} />
            {n}
          </span>
        );
      },
    },
    {
      title: (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Created
        </span>
      ),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 95,
      sorter: (a: ApiLead, b: ApiLead) =>
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
  ];

  // ── RENDER ────────────────────────────────────────
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#2563EB",
          borderRadius: 10,
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
          Select: { borderRadius: 10 },
          Input: { borderRadius: 10 },
          Modal: { borderRadiusLG: 14 },
        },
      }}
    >
      <div className="flex flex-col gap-5 w-full p-5">
        {/* ── HEADER ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="text-[22px] font-black text-slate-900 tracking-tight leading-none">
                All Leads
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                {isLoading ? "…" : filtered.length}
              </span>
            </div>
            <p className="text-[13px] text-slate-400">
              Manage, track and convert all student leads.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip title="Refresh data">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing || isLoading}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 cursor-pointer transition-all shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Refresh data"
              >
                {isRefreshing ? (
                  <Spin size="small" />
                ) : (
                  <RiRefreshLine size={15} />
                )}
              </button>
            </Tooltip>
            <button
              onClick={() => setExportModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer transition-all shadow-sm"
            >
              <RiDownloadLine size={14} /> Export
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
            barCls="bg-gradient-to-r from-blue-400 to-blue-600"
            delta={12}
            loading={isLoading}
          />
          <StatCard
            label="Hot Leads"
            value={stats.hot}
            icon={RiFireLine}
            colorCls="bg-red-50 text-red-500"
            barCls="bg-gradient-to-r from-red-400 to-red-600"
            delta={5}
            loading={isLoading}
          />
          <StatCard
            label="Follow-ups Due"
            value={stats.due}
            icon={RiTimeLine}
            colorCls="bg-amber-50 text-amber-500"
            barCls="bg-gradient-to-r from-amber-400 to-amber-600"
            delta={-3}
            loading={isLoading}
          />
          <StatCard
            label="Converted"
            value={stats.conv}
            icon={RiCheckboxCircleLine}
            colorCls="bg-emerald-50 text-emerald-500"
            barCls="bg-gradient-to-r from-emerald-400 to-emerald-600"
            delta={8}
            loading={isLoading}
          />
          <StatCard
            label="Lost"
            value={stats.lost}
            icon={RiCloseCircleLine}
            colorCls="bg-slate-100 text-slate-500"
            barCls="bg-gradient-to-r from-slate-300 to-slate-500"
            delta={-2}
            loading={isLoading}
          />
        </div>

        {/* ── FILTERS ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters((v) => !v)}
                className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-700 hover:text-slate-900 bg-transparent border-none cursor-pointer transition-colors"
              >
                Filters
                <RiArrowDownSLine
                  size={14}
                  className={`transition-transform duration-200 text-slate-400 ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>
              {hasFilters && (
                <>
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 cursor-pointer transition-colors"
                  >
                    <RiFilterOffLine size={10} /> Clear All
                  </button>
                  <span className="text-[11px] text-slate-400">
                    {filtered.length} of {rawLeads.length} leads
                  </span>
                </>
              )}
            </div>
            <span className="text-xs text-slate-400">
              {isLoading ? "Loading…" : `${filtered.length} leads`}
            </span>
          </div>

          {showFilters && (
            <div className="px-4 py-3 flex flex-wrap gap-2 items-center bg-slate-50/50">
              <Input
                prefix={<RiSearchLine size={13} className="text-slate-400" />}
                placeholder="Search name, phone, email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                allowClear
                className="!w-[280px] !rounded-xl !text-[13px]"
              />
              <Select
                value={sourceF}
                onChange={setSourceF}
                placeholder="Source"
                allowClear
                className="!w-[150px]"
                options={sources.map((s) => ({
                  value: s,
                  label: formatSourceLabel(s),
                }))}
              />
              <Select
                value={counselorF}
                onChange={setCounselorF}
                placeholder="Counselor"
                allowClear
                className="!w-[145px]"
                options={counselorUsers.map((u) => ({
                  value: u.name,
                  label: u.name,
                }))}
              />
              <Select
                value={countryF}
                onChange={setCountryF}
                placeholder="Country"
                allowClear
                className="!w-[130px]"
                options={countries.map((c) => ({ value: c, label: c }))}
              />
              <Select
                value={priorityF}
                onChange={setPriorityF}
                placeholder="Priority"
                allowClear
                className="!w-[120px]"
                options={[
                  {
                    value: "HOT" as LeadPriority,
                    label: (
                      <span className="flex items-center gap-1.5">
                        <RiFireLine size={12} className="text-red-500" />
                        Hot
                      </span>
                    ),
                  },
                  {
                    value: "WARM" as LeadPriority,
                    label: (
                      <span className="flex items-center gap-1.5">
                        <RiFlashlightLine
                          size={12}
                          className="text-amber-500"
                        />
                        Warm
                      </span>
                    ),
                  },
                  {
                    value: "COLD" as LeadPriority,
                    label: (
                      <span className="flex items-center gap-1.5">
                        <RiSnowflakeLine size={12} className="text-blue-500" />
                        Cold
                      </span>
                    ),
                  },
                ]}
              />
              <Select
                value={statusF}
                onChange={setStatusF}
                placeholder="Status"
                allowClear
                className="!w-[130px]"
                options={[
                  { value: "NEW" as ApiLeadStatus, label: "New" },
                  {
                    value: "IN_PROGRESS" as ApiLeadStatus,
                    label: "In Progress",
                  },
                  { value: "CONVERTED" as ApiLeadStatus, label: "Converted" },
                  { value: "LOST" as ApiLeadStatus, label: "Lost" },
                ]}
              />
              <RangePicker
                value={dateRange}
                onChange={(val) => setDateRange(val as DateRangeValue)}
                className="!rounded-xl"
                format="MMM D"
                placeholder={["Created from", "Created to"]}
                style={{ width: 280 }}
              />
            </div>
          )}
        </div>

        {/* ── SELECTED BAR ── */}
        {selected.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-2xl text-[13px] font-semibold text-blue-700">
            <RiCheckLine size={14} />
            {selected.length} lead{selected.length > 1 ? "s" : ""} selected
            <span className="mx-1 text-blue-300">·</span>
            <button
              onClick={() => setBulkModal("assign")}
              className="underline underline-offset-2 bg-transparent border-none cursor-pointer text-blue-600 hover:text-blue-800 font-semibold text-[13px]"
            >
              Assign counselor
            </button>
            <button
              onClick={() => setSelected([])}
              className="ml-auto text-blue-500 hover:text-blue-700 bg-transparent border-none cursor-pointer text-xs font-medium"
            >
              ✕ Clear
            </button>
          </div>
        )}

        {/* ── TABLE ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden relative">
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/80 to-transparent z-10 rounded-r-2xl" />

          {isError && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <RiCloseCircleLine size={32} className="text-red-300" />
              <p className="text-sm font-semibold text-slate-500">
                Failed to load leads
              </p>
              <button
                onClick={() => refetch()}
                className="text-[13px] text-blue-600 underline bg-transparent border-none cursor-pointer"
              >
                Try again
              </button>
            </div>
          )}

          {!isError && (
            <Table
              rowSelection={{
                selectedRowKeys: selected,
                onChange: (keys) => setSelected(keys as string[]),
                columnWidth: 44,
              }}
              dataSource={filtered}
              columns={columns}
              rowKey="id"
              scroll={{ x: "max-content", y: 560 }}
              size="small"
              loading={{
                spinning: isLoading,
                indicator: (
                  <RiLoader4Line
                    size={24}
                    className="animate-spin text-blue-500"
                  />
                ),
              }}
              onRow={(rec: ApiLead) => ({
                onClick: () => setDetailLead(rec),
                className: `cursor-pointer transition-colors ${
                  rec.status === "LOST" ? "opacity-60" : ""
                }`,
              })}
              pagination={{
                pageSize: 15,
                showSizeChanger: true,
                pageSizeOptions: ["10", "15", "25", "50"],
                showTotal: (t: number, r: [number, number]) => (
                  <span className="text-xs text-slate-400">
                    {r[0]}–{r[1]} of{" "}
                    <strong className="text-slate-600">{t}</strong> leads
                  </span>
                ),
              }}
              locale={{
                emptyText: (
                  <div className="py-16 flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                      <RiTeamLine size={24} className="text-slate-300" />
                    </div>
                    <p className="text-sm font-semibold text-slate-400">
                      No leads found
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
          )}
        </div>
      </div>

      {/* ── BULK ASSIGN MODAL ── */}
      <Modal
        open={!!bulkModal}
        onCancel={() => {
          setBulkModal(null);
          setBulkValue(null);
        }}
        onOk={() => {
          message.success(`Assigned ${selected.length} leads`);
          setSelected([]);
          setBulkModal(null);
          setBulkValue(null);
        }}
        okText="Apply"
        okButtonProps={{ disabled: !bulkValue, type: "primary" }}
        title={
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <RiUserSmileLine size={16} className="text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                Assign Counselor
              </div>
              <div className="text-xs text-slate-400 font-normal">
                Apply to {selected.length} selected lead
                {selected.length > 1 ? "s" : ""}
              </div>
            </div>
          </div>
        }
        width={420}
      >
        <div className="pt-2">
          <label className="block text-xs font-semibold text-slate-600 mb-2">
            Select Counselor
          </label>
          <Select
            value={bulkValue}
            onChange={setBulkValue}
            placeholder="Choose counselor…"
            className="!w-full"
            size="large"
            options={counselorUsers.map((u) => ({
              value: u.name,
              label: u.name,
            }))}
          />
        </div>
      </Modal>

      {exportModalOpen && (
        <ExportModal
          leads={filtered.map(apiLeadToLocal)}
          allLeads={rawLeads.map(apiLeadToLocal)}
          onClose={() => setExportModalOpen(false)}
        />
      )}

      {/* ── DETAIL DRAWER ── */}
      {detailLead && (
        <DetailDrawer
          lead={detailLead}
          today={today}
          onClose={() => setDetailLead(null)}
        />
      )}
    </ConfigProvider>
  );
};

export default AllLeadsPage;
