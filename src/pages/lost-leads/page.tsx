import React, { useState, useMemo, useCallback } from "react";
import { Table, Empty, Tooltip, Input, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useForm } from "react-hook-form";
import {
  RiUserLine,
  RiSearchLine,
  RiPhoneLine,
  RiCalendarLine,
  RiArrowRightLine,
  RiFireLine,
  RiFlashlightLine,
  RiSnowflakeLine,
  RiUserSmileLine,
  RiRefreshLine,
  RiDownloadLine,
  RiMailLine,
  RiCloseLine,
  RiCheckLine,
  RiTimeLine,
  RiMoneyDollarCircleLine,
  RiCloseCircleLine,
  RiMapPinLine,
  RiHistoryLine,
  RiWhatsappLine,
  RiVideoChatLine,
  RiArrowGoBackLine,
  RiCalendarCheckLine,
  RiSpeedLine,
  RiInformationLine,
  RiEyeLine,
  RiArrowUpSLine,
  RiArrowDownSLine,
} from "react-icons/ri";
import type { IconType } from "react-icons";
import CustomSelect from "../../components/common/CustomSelect";
import CustomModal from "../../components/common/CustomModal";

// ═══════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════

type FollowUpType = "call" | "whatsapp" | "email" | "meeting";
type PriorityLevel = "Hot" | "Warm" | "Cold";
type LostReasonValue =
  | "financial"
  | "direct_admission"
  | "another_consultancy"
  | "not_eligible"
  | "not_responding"
  | "deferred_intake"
  | "changed_country"
  | "family_decision"
  | "visa_rejection"
  | "other";

type ReactivationReasonValue =
  | "new_intake"
  | "improved_ielts"
  | "financial_ready"
  | "changed_mind"
  | "new_program"
  | "other";

type StageId = "new" | "contacted" | "ielts" | "applied" | "offer" | "enrolled";

interface FollowUpAttempt {
  id: string;
  date: string;
  type: FollowUpType;
  summary: string;
  by: string;
}

interface ReactivationAttempt {
  id: string;
  date: string;
  reason: ReactivationReasonValue;
  by: string;
  successful: boolean;
}

interface LostLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  country: string;
  stage: StageId;
  source: string;
  priority: PriorityLevel;
  counselor: string;
  lostDate: string;
  lostReason: LostReasonValue;
  lostNotes: string;
  attemptsMade: number;
  lastFollowUp: string;
  createdAt: string;
  followUpHistory: FollowUpAttempt[];
  reactivationAttempts: ReactivationAttempt[];
  reactivatedCount: number;
  ieltsScore: string;
  estimatedRevenue: number;
}

interface LostReasonOption {
  value: LostReasonValue;
  label: string;
  emoji: string;
}

interface ReactivationReasonOption {
  value: ReactivationReasonValue;
  label: string;
}

interface StageOption {
  id: StageId;
  label: string;
  color: string;
  twBg: string;
  twText: string;
  twBorder: string;
}

interface LeadStats {
  total: number;
  lostThisMonth: number;
  monthTrend: number;
  reactivated: number;
  recoveryRate: number;
  totalRevenueLost: number;
  avgAttempts: string;
  avgDaysSinceLost: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  topReasons: TopReasonStat[];
  highValueAtRisk: number;
  notResponding: number;
}

interface TopReasonStat {
  reason: LostReasonOption | undefined;
  count: number;
  color: string;
}

interface ReactivationFormValues {
  reason: ReactivationReasonValue | "";
  notes: string;
}

interface CommTypeConfig {
  icon: React.ReactNode;
  twBg: string;
  twText: string;
  twBorder: string;
  label: string;
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const LOST_REASONS: LostReasonOption[] = [
  { value: "financial", label: "Financial Issue", emoji: "💰" },
  { value: "direct_admission", label: "Direct Admission", emoji: "🎓" },
  { value: "another_consultancy", label: "Another Consultancy", emoji: "🏢" },
  { value: "not_eligible", label: "Not Eligible", emoji: "❌" },
  { value: "not_responding", label: "Not Responding", emoji: "📵" },
  { value: "deferred_intake", label: "Deferred Intake", emoji: "🕒" },
  { value: "changed_country", label: "Changed Country", emoji: "🌍" },
  { value: "family_decision", label: "Family Decision", emoji: "👨‍👩‍👧" },
  { value: "visa_rejection", label: "Visa Rejection", emoji: "🚫" },
  { value: "other", label: "Other", emoji: "❓" },
];

const REACTIVATION_REASONS: ReactivationReasonOption[] = [
  { value: "new_intake", label: "New Intake Available" },
  { value: "improved_ielts", label: "Improved IELTS Score" },
  { value: "financial_ready", label: "Financially Ready Now" },
  { value: "changed_mind", label: "Changed Mind" },
  { value: "new_program", label: "New Program Interest" },
  { value: "other", label: "Other" },
];

const STAGES: StageOption[] = [
  {
    id: "new",
    label: "New Lead",
    color: "#3B82F6",
    twBg: "bg-blue-50",
    twText: "text-blue-700",
    twBorder: "border-blue-200",
  },
  {
    id: "contacted",
    label: "Contacted",
    color: "#0EA5E9",
    twBg: "bg-sky-50",
    twText: "text-sky-700",
    twBorder: "border-sky-200",
  },
  {
    id: "ielts",
    label: "IELTS Planning",
    color: "#8B5CF6",
    twBg: "bg-violet-50",
    twText: "text-violet-700",
    twBorder: "border-violet-200",
  },
  {
    id: "applied",
    label: "Applied",
    color: "#F59E0B",
    twBg: "bg-amber-50",
    twText: "text-amber-700",
    twBorder: "border-amber-200",
  },
  {
    id: "offer",
    label: "Offer Received",
    color: "#10B981",
    twBg: "bg-emerald-50",
    twText: "text-emerald-700",
    twBorder: "border-emerald-200",
  },
  {
    id: "enrolled",
    label: "Enrolled",
    color: "#059669",
    twBg: "bg-green-50",
    twText: "text-green-700",
    twBorder: "border-green-200",
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

// ═══════════════════════════════════════════════════════════════
// UTILITY HELPERS
// ═══════════════════════════════════════════════════════════════

const daysSince = (dateStr: string): number =>
  Math.ceil((Date.now() - new Date(dateStr).getTime()) / 86400000);

const formatDate = (
  dateStr: string,
  opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" },
): string => new Date(dateStr).toLocaleDateString("en-US", opts);

const getInitials = (name: string): string =>
  name
    ?.split(" ")
    .map((n) => n[0])
    .join("") || "?";

const AVATAR_COLORS: [string, string][] = [
  ["bg-indigo-100", "text-indigo-700"],
  ["bg-emerald-100", "text-emerald-700"],
  ["bg-amber-100", "text-amber-700"],
  ["bg-pink-100", "text-pink-700"],
  ["bg-sky-100", "text-sky-700"],
  ["bg-orange-100", "text-orange-700"],
  ["bg-violet-100", "text-violet-700"],
  ["bg-cyan-100", "text-cyan-700"],
  ["bg-rose-100", "text-rose-700"],
  ["bg-teal-100", "text-teal-700"],
];

const getAvatarClasses = (name: string): [string, string] => {
  const idx =
    (name || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0) %
    AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

const generateLostLeads = (): LostLead[] => {
  const names: string[] = [
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
    "Kiran Bose",
    "Nandini Iyer",
    "Vishal Reddy",
    "Pooja Gupta",
    "Arjun Nair",
  ];

  const followUpSummaries: string[] = [
    "Called but no answer, left voicemail",
    "Sent WhatsApp about new intake dates",
    "Emailed course comparison document",
    "Meeting scheduled but student didn't show",
    "Discussed financial concerns, shared scholarship info",
    "Followed up on document submission",
    "Reminded about application deadline",
    "Shared visa processing timeline",
  ];

  const lostNotesPool: string[] = [
    "Student mentioned budget constraints due to family situation",
    "Found another agency offering lower fees",
    "Decided to defer to next year intake",
    "Could not meet IELTS requirements after 2 attempts",
    "Family doesn't want student to go abroad",
    "Visa got rejected, student lost confidence",
    "Student stopped responding after initial meetings",
    "Got direct admission through university portal",
  ];

  const followUpTypes: FollowUpType[] = [
    "call",
    "whatsapp",
    "email",
    "meeting",
  ];

  return names.map((name, i): LostLead => {
    const lostDaysAgo = Math.floor(Math.random() * 90) + 1;
    const lostDate = new Date(Date.now() - lostDaysAgo * 86400000);
    const createdDaysAgo = lostDaysAgo + Math.floor(Math.random() * 60) + 10;
    const attempts = Math.floor(Math.random() * 8) + 1;
    const lastFollowUpDaysAgo =
      lostDaysAgo + Math.floor(Math.random() * 10) + 1;

    const followUpHistory: FollowUpAttempt[] = Array.from(
      { length: attempts },
      (_, j): FollowUpAttempt => ({
        id: `fu-${i}-${j}`,
        date: new Date(
          Date.now() - (lostDaysAgo + (attempts - j) * 3) * 86400000,
        ).toISOString(),
        type: followUpTypes[j % 4],
        summary: followUpSummaries[j % 8],
        by: COUNSELORS[i % COUNSELORS.length],
      }),
    );

    const reactivated = Math.random() > 0.85;

    return {
      id: `lost-${i + 1}`,
      name,
      phone: `+91 ${9000000000 + Math.floor(Math.random() * 999999999)}`,
      email: `${name.toLowerCase().replace(" ", ".")}@email.com`,
      country: COUNTRIES[i % COUNTRIES.length],
      stage: STAGES[Math.floor(Math.random() * STAGES.length)].id,
      source: SOURCES[i % SOURCES.length],
      priority: (["Hot", "Warm", "Cold"] as const)[i % 3],
      counselor: COUNSELORS[i % COUNSELORS.length],
      lostDate: lostDate.toISOString().split("T")[0],
      lostReason: LOST_REASONS[i % LOST_REASONS.length].value,
      lostNotes: lostNotesPool[i % 8],
      attemptsMade: attempts,
      lastFollowUp: new Date(Date.now() - lastFollowUpDaysAgo * 86400000)
        .toISOString()
        .split("T")[0],
      createdAt: new Date(Date.now() - createdDaysAgo * 86400000)
        .toISOString()
        .split("T")[0],
      followUpHistory,
      reactivationAttempts: reactivated
        ? [
            {
              id: `react-${i}`,
              date: new Date(
                Date.now() - Math.floor(Math.random() * 30) * 86400000,
              ).toISOString(),
              reason:
                REACTIVATION_REASONS[
                  Math.floor(Math.random() * REACTIVATION_REASONS.length)
                ].value,
              by: COUNSELORS[i % COUNSELORS.length],
              successful: false,
            },
          ]
        : [],
      reactivatedCount: reactivated ? 1 : 0,
      ieltsScore: `${(4.0 + Math.random() * 4).toFixed(1)}`,
      estimatedRevenue: 2000 + Math.floor(Math.random() * 5000),
    };
  });
};

const LOST_LEADS_DATA: LostLead[] = generateLostLeads();

// ═══════════════════════════════════════════════════════════════
// MICRO COMPONENTS
// ═══════════════════════════════════════════════════════════════

interface UserAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const UserAvatar: React.FC<UserAvatarProps> = ({ name, size = "md" }) => {
  const initials = getInitials(name);
  const [bgClass, textClass] = getAvatarClasses(name);
  const sizeMap: Record<string, string> = {
    sm: "w-7 h-7 text-[10px] rounded-lg",
    md: "w-8 h-8 text-xs rounded-xl",
    lg: "w-10 h-10 text-sm rounded-xl",
    xl: "w-12 h-12 text-base rounded-2xl",
  };

  return (
    <div
      className={`flex items-center justify-center font-bold shrink-0 select-none ${sizeMap[size]} ${bgClass} ${textClass}`}
    >
      {initials || <RiUserLine className="w-1/2 h-1/2" />}
    </div>
  );
};

interface PriorityBadgeProps {
  priority: PriorityLevel;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const cfg: Record<PriorityLevel, { cls: string; icon: React.ReactNode }> = {
    Hot: {
      cls: "text-red-600 bg-red-50 border-red-200",
      icon: <RiFireLine size={11} />,
    },
    Warm: {
      cls: "text-amber-600 bg-amber-50 border-amber-200",
      icon: <RiFlashlightLine size={11} />,
    },
    Cold: {
      cls: "text-blue-600 bg-blue-50 border-blue-200",
      icon: <RiSnowflakeLine size={11} />,
    },
  };
  const c = cfg[priority];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${c.cls}`}
    >
      {c.icon} {priority}
    </span>
  );
};

interface StageBadgeProps {
  stageId: StageId;
}

const StageBadge: React.FC<StageBadgeProps> = ({ stageId }) => {
  const stage = STAGES.find((s) => s.id === stageId);
  if (!stage) return null;
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-semibold border ${stage.twBg} ${stage.twText} ${stage.twBorder}`}
    >
      {stage.label}
    </span>
  );
};

interface LostReasonBadgeProps {
  reasonValue: LostReasonValue;
}

const LostReasonBadge: React.FC<LostReasonBadgeProps> = ({ reasonValue }) => {
  const reason = LOST_REASONS.find((r) => r.value === reasonValue);
  if (!reason) return <span className="text-xs text-slate-400">—</span>;
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
      <span>{reason.emoji}</span> {reason.label}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════
// ENHANCED STAT CARD (extends the provided StatCard component)
// ═══════════════════════════════════════════════════════════════

interface EnhancedStatCardProps {
  label: string;
  value: string | number;
  icon: IconType;
  twIconBg: string;
  twIconText: string;
  twBarBg: string;
  subtitle?: string;
  trend?: number;
  trendLabel?: string;
}

const EnhancedStatCard: React.FC<EnhancedStatCardProps> = ({
  label,
  value,
  icon: Icon,
  twIconBg,
  twIconText,
  twBarBg,
  subtitle,
  trend,
  trendLabel,
}) => {
  return (
    <div className="group bg-white rounded-2xl border border-slate-100 p-3 relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50 cursor-default w-full min-w-0">
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 whitespace-nowrap truncate">
            {label}
          </p>
          <p className="text-2xl font-extrabold text-slate-900 leading-none tracking-tight">
            {value}
          </p>
          {(subtitle || trend !== undefined) && (
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              {trend !== undefined && (
                <span
                  className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                    trend >= 0
                      ? "text-emerald-700 bg-emerald-50"
                      : "text-red-700 bg-red-50"
                  }`}
                >
                  {trend >= 0 ? (
                    <RiArrowUpSLine size={12} />
                  ) : (
                    <RiArrowDownSLine size={12} />
                  )}
                  {Math.abs(trend)}%
                </span>
              )}
              {(trendLabel || subtitle) && (
                <span className="text-[10px] text-slate-400 truncate">
                  {trendLabel || subtitle}
                </span>
              )}
            </div>
          )}
        </div>
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${twIconBg}`}
        >
          <Icon size={17} className={twIconText} />
        </div>
      </div>
      <div
        className={`absolute bottom-0 left-0 right-0 h-[3px] ${twBarBg} opacity-60`}
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MINI DONUT CHART
// ═══════════════════════════════════════════════════════════════

interface DonutSegment {
  value: number;
  color: string;
}

interface MiniDonutProps {
  data: DonutSegment[];
  size?: number;
}

const MiniDonut: React.FC<MiniDonutProps> = ({ data, size = 52 }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;
  const radius = 18;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      {data.map((d, i) => {
        const pct = total > 0 ? d.value / total : 0;
        const offset = cumulative * circumference;
        // eslint-disable-next-line react-hooks/immutability
        cumulative += pct;
        return (
          <circle
            key={i}
            cx={24}
            cy={24}
            r={radius}
            fill="none"
            stroke={d.color}
            strokeWidth={6}
            strokeDasharray={`${pct * circumference} ${circumference}`}
            strokeDashoffset={-offset}
            transform="rotate(-90 24 24)"
            className="transition-all duration-500"
          />
        );
      })}
      <text
        x={24}
        y={24}
        textAnchor="middle"
        dominantBaseline="central"
        className="text-[11px] font-extrabold fill-slate-800"
      >
        {total}
      </text>
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════
// REACTIVATION MODAL (uses CustomModal + useForm)
// ═══════════════════════════════════════════════════════════════

interface ReactivationModalProps {
  lead: LostLead | null;
  onClose: () => void;
  onReactivate: (leadId: string, reason: string, notes: string) => void;
}

const ReactivationModal: React.FC<ReactivationModalProps> = ({
  lead,
  onClose,
  onReactivate,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReactivationFormValues>({
    defaultValues: { reason: "", notes: "" },
  });

  const onSubmit = async (data: ReactivationFormValues) => {
    if (!lead || !data.reason) return;
    await new Promise((resolve) => setTimeout(resolve, 500));
    onReactivate(lead.id, data.reason, data.notes);
    reset();
    onClose();
  };

  if (!lead) return null;

  return (
    <CustomModal open={!!lead} onClose={onClose}>
      {/* Header */}
      <div className="flex items-center gap-3.5 px-6 py-5 border-b border-slate-100">
        <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
          <RiArrowGoBackLine size={22} className="text-emerald-600" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-bold text-slate-900 leading-tight">
            Reactivate Lead
          </h3>
          <p className="text-[13px] text-slate-400 mt-0.5 truncate">
            {lead.name} · Lost on{" "}
            {formatDate(lead.lostDate, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={onClose}
          className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <RiCloseLine size={20} />
        </button>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* Lead summary badges */}
        <div className="flex flex-wrap gap-2 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
          <PriorityBadge priority={lead.priority} />
          <span className="text-slate-200">·</span>
          <StageBadge stageId={lead.stage} />
          <span className="text-slate-200">·</span>
          <LostReasonBadge reasonValue={lead.lostReason} />
        </div>

        {/* Form Fields */}
        <CustomSelect
          name="reason"
          label="Reactivation Reason"
          placeholder="Why is this lead being reactivated?"
          required
          control={control}
          errors={errors}
          rules={{ required: "Reason is required" }}
          options={REACTIVATION_REASONS.map((r) => ({
            value: r.value,
            label: r.label,
          }))}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600">Notes</label>
          <Input.TextArea
            rows={3}
            placeholder="Add context about the reactivation..."
            className="!rounded-xl"
          />
        </div>

        {/* Info panel */}
        <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200">
          <p className="text-xs font-bold text-blue-700 mb-2 flex items-center gap-1.5">
            <RiInformationLine size={13} /> What happens on reactivation:
          </p>
          <div className="flex flex-col gap-1.5">
            {[
              "Status changes from Lost → Active in Lead Pipeline",
              "Auto-creates follow-up task for assigned counselor",
              "Reactivation attempt is logged in lead history",
              "Reactivated count is incremented for tracking",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-xs text-blue-700"
              >
                <RiCheckLine size={11} className="text-blue-500 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-[13px] font-semibold text-slate-500 bg-transparent border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-[13px] font-bold text-white bg-emerald-600 border-none cursor-pointer hover:bg-emerald-700 shadow-sm shadow-emerald-200 transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isSubmitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Reactivating...
              </>
            ) : (
              <>
                <RiArrowGoBackLine size={14} /> Reactivate Lead
              </>
            )}
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

// ═══════════════════════════════════════════════════════════════
// LOST LEAD DETAIL DRAWER
// ═══════════════════════════════════════════════════════════════

interface LostLeadDrawerProps {
  lead: LostLead | null;
  onClose: () => void;
  onReactivate: (lead: LostLead) => void;
}

const LostLeadDrawer: React.FC<LostLeadDrawerProps> = ({
  lead,
  onClose,
  onReactivate,
}) => {
  const [activeTab, setActiveTab] = useState<
    "history" | "reason" | "reactivation"
  >("history");

  if (!lead) return null;

  const daysLost = daysSince(lead.lostDate);

  const commTypeConfig: Record<FollowUpType, CommTypeConfig> = {
    call: {
      icon: <RiPhoneLine size={14} />,
      twBg: "bg-blue-50",
      twText: "text-blue-600",
      twBorder: "border-blue-200",
      label: "Call",
    },
    whatsapp: {
      icon: <RiWhatsappLine size={14} />,
      twBg: "bg-emerald-50",
      twText: "text-emerald-600",
      twBorder: "border-emerald-200",
      label: "WhatsApp",
    },
    email: {
      icon: <RiMailLine size={14} />,
      twBg: "bg-violet-50",
      twText: "text-violet-600",
      twBorder: "border-violet-200",
      label: "Email",
    },
    meeting: {
      icon: <RiVideoChatLine size={14} />,
      twBg: "bg-amber-50",
      twText: "text-amber-600",
      twBorder: "border-amber-200",
      label: "Meeting",
    },
  };

  const tabs: {
    key: typeof activeTab;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: "history",
      label: "Follow-ups",
      icon: <RiHistoryLine size={13} />,
    },
    {
      key: "reason",
      label: "Lost Details",
      icon: <RiCloseCircleLine size={13} />,
    },
    {
      key: "reactivation",
      label: "Reactivation",
      icon: <RiArrowGoBackLine size={13} />,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[999] animate-fadeIn"
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 w-[560px] max-w-[95vw] bg-slate-50 z-[1000] overflow-y-auto shadow-2xl animate-slideInRight">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-500 to-pink-500 px-6 py-5 relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/[0.07]" />
          <div className="flex justify-between items-start relative z-10">
            <div className="flex items-center gap-3">
              <UserAvatar name={lead.name} size="xl" />
              <div>
                <h2 className="text-[17px] font-bold text-white leading-tight">
                  {lead.name}
                </h2>
                <p className="text-xs text-white/70 flex items-center gap-1 mt-0.5">
                  <RiPhoneLine size={12} /> {lead.phone}
                </p>
                <p className="text-xs text-white/60 flex items-center gap-1 mt-0.5">
                  <RiMailLine size={12} /> {lead.email}
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
            {[
              { icon: <RiMapPinLine size={11} />, text: lead.country },
              { icon: <RiUserSmileLine size={11} />, text: lead.counselor },
              {
                icon: <RiCalendarLine size={11} />,
                text: `Lost ${daysLost}d ago`,
              },
            ].map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/20 text-white border border-white/30"
              >
                {tag.icon} {tag.text}
              </span>
            ))}
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 px-5 py-2 border-b border-slate-100 bg-white">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold transition-all cursor-pointer border-none ${
                activeTab === tab.key
                  ? "bg-indigo-50 text-indigo-600"
                  : "bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* ─── Follow-up History ─── */}
          {activeTab === "history" && (
            <div className="flex flex-col gap-2.5">
              {lead.followUpHistory.length === 0 ? (
                <div className="flex flex-col items-center py-10 text-slate-400">
                  <RiHistoryLine size={28} className="opacity-30 mb-2" />
                  <p className="text-sm font-medium text-slate-500">
                    No follow-up history
                  </p>
                </div>
              ) : (
                lead.followUpHistory.map((fu) => {
                  const cfg = commTypeConfig[fu.type];
                  return (
                    <div
                      key={fu.id}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-100"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${cfg.twBg} ${cfg.twText} ${cfg.twBorder}`}
                      >
                        {cfg.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className={`text-[11px] font-bold uppercase ${cfg.twText}`}
                          >
                            {cfg.label}
                          </span>
                          <span className="text-[10px] text-slate-400">·</span>
                          <span className="text-[10px] text-slate-400">
                            {formatDate(fu.date, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-[13px] text-slate-700 leading-relaxed">
                          {fu.summary}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          by {fu.by}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ─── Lost Details ─── */}
          {activeTab === "reason" && (
            <div className="flex flex-col gap-4">
              <div className="p-4 bg-red-50/60 rounded-xl border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <RiCloseCircleLine size={15} className="text-red-600" />
                  <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
                    Lost Reason
                  </span>
                </div>
                <LostReasonBadge reasonValue={lead.lostReason} />
                <p className="text-[13px] text-red-800 mt-3 leading-relaxed">
                  {lead.lostNotes}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    {
                      label: "Lost Date",
                      value: formatDate(lead.lostDate, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }),
                      icon: <RiCalendarLine size={12} />,
                    },
                    {
                      label: "Days Since Lost",
                      value: `${daysLost} days`,
                      icon: <RiTimeLine size={12} />,
                    },
                    {
                      label: "Stage When Lost",
                      value: lead.stage,
                      icon: <RiArrowRightLine size={12} />,
                      isBadge: true,
                    },
                    {
                      label: "Attempts Made",
                      value: String(lead.attemptsMade),
                      icon: <RiPhoneLine size={12} />,
                    },
                    {
                      label: "Last Follow-up",
                      value: formatDate(lead.lastFollowUp),
                      icon: <RiCalendarCheckLine size={12} />,
                    },
                    {
                      label: "Est. Revenue Lost",
                      value: `$${lead.estimatedRevenue.toLocaleString()}`,
                      icon: <RiMoneyDollarCircleLine size={12} />,
                    },
                  ] as const
                ).map((item, i) => (
                  <div
                    key={i}
                    className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div className="flex items-center gap-1 mb-0.5 text-slate-400">
                      {item.icon}
                      <span className="text-[10px] font-semibold uppercase tracking-wider">
                        {item.label}
                      </span>
                    </div>
                    <div className="text-[13px] font-bold text-slate-800">
                      {item.icon ? (
                        <StageBadge stageId={item.value as StageId} />
                      ) : (
                        item.value
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── Reactivation ─── */}
          {activeTab === "reactivation" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-3.5 bg-blue-50/60 rounded-xl border border-blue-200">
                <div>
                  <p className="text-xs font-bold text-blue-700">
                    Reactivation Attempts
                  </p>
                  <p className="text-2xl font-extrabold text-blue-800 mt-0.5">
                    {lead.reactivatedCount}
                  </p>
                </div>
                <button
                  onClick={() => onReactivate(lead)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold text-white bg-emerald-600 border-none cursor-pointer hover:bg-emerald-700 shadow-sm shadow-emerald-200 transition-all"
                >
                  <RiArrowGoBackLine size={14} /> Reactivate Now
                </button>
              </div>

              {lead.reactivationAttempts.length > 0 ? (
                lead.reactivationAttempts.map((ra) => (
                  <div
                    key={ra.id}
                    className="p-3 rounded-xl bg-white border border-slate-100"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center ${
                          ra.successful
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {ra.successful ? (
                          <RiCheckLine size={11} />
                        ) : (
                          <RiTimeLine size={11} />
                        )}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">
                        {ra.successful ? "Successful" : "Attempted"}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-auto">
                        {formatDate(ra.date, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Reason:{" "}
                      {REACTIVATION_REASONS.find((r) => r.value === ra.reason)
                        ?.label || ra.reason}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      by {ra.by}
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center py-8 text-slate-400">
                  <RiArrowGoBackLine size={28} className="opacity-30 mb-2" />
                  <p className="text-sm font-medium text-slate-500">
                    No reactivation attempts yet
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════
// TOP LOST REASONS CARD (inline mini chart)
// ═══════════════════════════════════════════════════════════════

interface TopReasonsCardProps {
  topReasons: TopReasonStat[];
}

const TopReasonsCard: React.FC<TopReasonsCardProps> = ({ topReasons }) => (
  <div className="group bg-white rounded-2xl border border-slate-100 p-4 relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50 cursor-default w-full min-w-0">
    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
      Top Lost Reasons
    </p>
    <div className="flex items-center gap-3">
      <MiniDonut
        data={topReasons.map((r) => ({ value: r.count, color: r.color }))}
        size={52}
      />
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        {topReasons.slice(0, 3).map((r, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-sm shrink-0"
              style={{ background: r.color }}
            />
            <span className="text-[11px] text-slate-700 font-semibold truncate">
              {r.reason?.emoji} {r.reason?.label}
            </span>
            <span className="text-[10px] text-slate-400 font-bold ml-auto shrink-0">
              {r.count}
            </span>
          </div>
        ))}
      </div>
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-500 via-amber-500 to-blue-500 opacity-50" />
  </div>
);

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════

const LostLeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<LostLead[]>(LOST_LEADS_DATA);
  const [search, setSearch] = useState<string>("");
  const [reasonFilter, setReasonFilter] = useState<string>("");
  const [counselorFilter, setCounselorFilter] = useState<string>("");
  const [countryFilter, setCountryFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [selectedLead, setSelectedLead] = useState<LostLead | null>(null);
  const [reactivateLead, setReactivateLead] = useState<LostLead | null>(null);

  // ─── Filtered & sorted data ───
  const filteredLeads = useMemo<LostLead[]>(() => {
    return leads.filter((l) => {
      if (
        search &&
        !l.name.toLowerCase().includes(search.toLowerCase()) &&
        !l.phone.includes(search) &&
        !l.email.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (reasonFilter && l.lostReason !== reasonFilter) return false;
      if (counselorFilter && l.counselor !== counselorFilter) return false;
      if (countryFilter && l.country !== countryFilter) return false;
      if (priorityFilter && l.priority !== priorityFilter) return false;
      return true;
    });
  }, [
    leads,
    search,
    reasonFilter,
    counselorFilter,
    countryFilter,
    priorityFilter,
  ]);

  // ─── Comprehensive stats ───
  const stats = useMemo<LeadStats>(() => {
    const today = new Date();
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();

    const lostThisMonth = leads.filter((l) => {
      const d = new Date(l.lostDate);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;

    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
    const lostLastMonth = leads.filter((l) => {
      const d = new Date(l.lostDate);
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
    }).length;

    const monthTrend =
      lostLastMonth > 0
        ? Math.round(((lostThisMonth - lostLastMonth) / lostLastMonth) * 100)
        : 0;

    const reactivated = leads.filter((l) => l.reactivatedCount > 0).length;
    const totalRevenueLost = leads.reduce(
      (sum, l) => sum + l.estimatedRevenue,
      0,
    );
    const avgAttempts =
      leads.length > 0
        ? (
            leads.reduce((s, l) => s + l.attemptsMade, 0) / leads.length
          ).toFixed(1)
        : "0";
    const avgDaysSinceLost =
      leads.length > 0
        ? Math.round(
            leads.reduce((s, l) => s + daysSince(l.lostDate), 0) / leads.length,
          )
        : 0;

    const hotLeads = leads.filter((l) => l.priority === "Hot").length;
    const warmLeads = leads.filter((l) => l.priority === "Warm").length;
    const coldLeads = leads.filter((l) => l.priority === "Cold").length;

    // Top reasons
    const reasonCounts: Record<string, number> = {};
    leads.forEach((l) => {
      reasonCounts[l.lostReason] = (reasonCounts[l.lostReason] || 0) + 1;
    });
    const reasonColors = ["#EF4444", "#F59E0B", "#3B82F6", "#8B5CF6"];
    const topReasons: TopReasonStat[] = Object.entries(reasonCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([key, count], idx) => ({
        reason: LOST_REASONS.find((r) => r.value === key),
        count,
        color: reasonColors[idx % reasonColors.length],
      }));

    const highValueAtRisk = leads.filter(
      (l) => l.estimatedRevenue >= 5000,
    ).length;
    const notResponding = leads.filter(
      (l) => l.lostReason === "not_responding",
    ).length;

    const recoveryRate =
      leads.length > 0 ? Math.round((reactivated / leads.length) * 100) : 0;

    return {
      total: leads.length,
      lostThisMonth,
      monthTrend,
      reactivated,
      recoveryRate,
      totalRevenueLost,
      avgAttempts,
      avgDaysSinceLost,
      hotLeads,
      warmLeads,
      coldLeads,
      topReasons,
      highValueAtRisk,
      notResponding,
    };
  }, [leads]);

  // ─── Handlers ───
  const handleReactivate = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (leadId: string, _reason: string, _notes: string) => {
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
    },
    [],
  );

  const handleExportCSV = useCallback(() => {
    const headers = [
      "Name",
      "Phone",
      "Email",
      "Country",
      "Stage",
      "Source",
      "Priority",
      "Counselor",
      "Lost Date",
      "Lost Reason",
      "Attempts",
      "Est. Revenue",
    ];
    const rows = filteredLeads.map((l) => [
      l.name,
      l.phone,
      l.email,
      l.country,
      l.stage,
      l.source,
      l.priority,
      l.counselor,
      l.lostDate,
      LOST_REASONS.find((r) => r.value === l.lostReason)?.label || l.lostReason,
      l.attemptsMade,
      l.estimatedRevenue,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lost_leads.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredLeads]);

  const clearFilters = (): void => {
    setSearch("");
    setReasonFilter("");
    setCounselorFilter("");
    setCountryFilter("");
    setPriorityFilter("");
  };

  const hasFilters: boolean = !!(
    search ||
    reasonFilter ||
    counselorFilter ||
    countryFilter ||
    priorityFilter
  );

  // ─── AntD Table Columns ───
  const columns: ColumnsType<LostLead> = [
    {
      title: "Student",
      dataIndex: "name",
      key: "name",
      width: 150,
      fixed: "left",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string, record: LostLead) => (
        <button
          onClick={() => setSelectedLead(record)}
          className="flex items-center gap-2.5 bg-transparent border-none cursor-pointer p-0 text-left w-full group"
        >
          <UserAvatar name={name} size="md" />
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-slate-900 group-hover:text-red-600 transition-colors truncate">
              {name}
            </div>
            <div className="text-[11px] text-slate-400">{record.country}</div>
          </div>
        </button>
      ),
    },
    {
      title: "Stage Lost",
      dataIndex: "stage",
      key: "stage",
      width: 100,
      align: "center",
      render: (stageId: StageId) => <StageBadge stageId={stageId} />,
    },
    {
      title: "Lost Reason",
      dataIndex: "lostReason",
      key: "lostReason",
      width: 150,
      align: "center",
      filters: LOST_REASONS.map((r) => ({
        text: `${r.emoji} ${r.label}`,
        value: r.value,
      })),
      onFilter: (val, r) => r.lostReason === val,
      render: (reason: LostReasonValue) => (
        <LostReasonBadge reasonValue={reason} />
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: 60,
      align: "center",
      filters: [
        { text: "🔥 Hot", value: "Hot" },
        { text: "⚡ Warm", value: "Warm" },
        { text: "❄️ Cold", value: "Cold" },
      ],
      onFilter: (val, r) => r.priority === val,
      render: (p: PriorityLevel) => <PriorityBadge priority={p} />,
    },
    {
      title: "Counselor",
      dataIndex: "counselor",
      key: "counselor",
      width: 100,
      align: "center",
      render: (c: string) => (
        <span className="text-[13px] text-slate-600">{c}</span>
      ),
    },
    {
      title: "Lost Date",
      dataIndex: "lostDate",
      key: "lostDate",
      width: 90,
      align: "center",
      sorter: (a, b) =>
        new Date(a.lostDate).getTime() - new Date(b.lostDate).getTime(),
      defaultSortOrder: "descend",
      render: (d: string) => {
        const days = daysSince(d);
        return (
          <div>
            <span className="text-xs font-medium text-slate-600">
              {formatDate(d)}
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">{days}d ago</p>
          </div>
        );
      },
    },
    {
      title: "Attempts",
      dataIndex: "attemptsMade",
      key: "attempts",
      width: 80,
      align: "center",
      sorter: (a, b) => a.attemptsMade - b.attemptsMade,
      render: (a: number) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${
            a >= 5
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : a >= 3
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          <RiPhoneLine size={10} /> {a}
        </span>
      ),
    },

    {
      title: "Action",
      key: "actions",
      width: 100,
      align: "center",
      render: (_: unknown, record: LostLead) => (
        <div className="flex w-full justify-center items-center gap-1.5">
          <Tooltip title="Reactivate">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setReactivateLead(record);
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition-colors"
            >
              <RiArrowGoBackLine size={12} /> Re-open
            </button>
          </Tooltip>
          <Tooltip title="View Details">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedLead(record);
              }}
              className="bg-transparent border-none p-1.5 rounded-lg cursor-pointer flex text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
            >
              <RiEyeLine size={14} />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full p-5 overflow-hidden min-w-0">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between gap-3 flex-wrap min-w-0">
        <div className="min-w-0">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Lost Leads
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Analyze, track & recover lost opportunities
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-semibold bg-white text-slate-600 border border-slate-200 cursor-pointer hover:bg-slate-50 hover:shadow-md transition-all shrink-0"
        >
          <RiDownloadLine size={15} /> Export CSV
        </button>
      </div>

      <div className="w-full min-w-0 overflow-hidden">
        <div
          className="overflow-x-auto pb-1"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#CBD5E1 transparent",
          }}
        >
          <div className="grid grid-cols-5 gap-3 min-w-[960px]">
            <EnhancedStatCard
              label="Total Lost"
              value={stats.total}
              icon={RiCloseCircleLine}
              twIconBg="bg-red-50"
              twIconText="text-red-500"
              twBarBg="bg-red-500"
              subtitle={`${stats.hotLeads} hot · ${stats.warmLeads} warm · ${stats.coldLeads} cold`}
            />
            <EnhancedStatCard
              label="Lost This Month"
              value={stats.lostThisMonth}
              icon={RiCalendarLine}
              twIconBg="bg-amber-50"
              twIconText="text-amber-500"
              twBarBg="bg-amber-500"
              trend={stats.monthTrend}
              trendLabel="vs last month"
            />

            <EnhancedStatCard
              label="Reactivated"
              value={stats.reactivated}
              icon={RiArrowGoBackLine}
              twIconBg="bg-emerald-50"
              twIconText="text-emerald-500"
              twBarBg="bg-emerald-500"
              subtitle={`${stats.recoveryRate}% recovery rate`}
            />

            <EnhancedStatCard
              label="Recovery Rate"
              value={`${stats.recoveryRate}%`}
              icon={RiSpeedLine}
              twIconBg="bg-cyan-50"
              twIconText="text-cyan-500"
              twBarBg="bg-cyan-500"
              subtitle={`${stats.reactivated} of ${stats.total} leads`}
            />

            <TopReasonsCard topReasons={stats.topReasons} />
          </div>
        </div>
      </div>

      {/* ═══ FILTERS ═══ */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 min-w-0 overflow-hidden">
        <div className="flex flex-wrap gap-2 items-center">
          <Input
            prefix={<RiSearchLine size={14} className="text-slate-400" />}
            placeholder="Search by name, phone or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ width: 220 }}
            className="!rounded-xl"
          />
          <Select
            value={reasonFilter || undefined}
            onChange={(v: string) => setReasonFilter(v || "")}
            placeholder="Lost Reason"
            allowClear
            style={{ width: 170 }}
            options={LOST_REASONS.map((r) => ({
              value: r.value,
              label: (
                <span className="flex items-center gap-1.5 text-xs font-semibold">
                  <span>{r.emoji}</span> {r.label}
                </span>
              ),
            }))}
          />
          <Select
            value={counselorFilter || undefined}
            onChange={(v: string) => setCounselorFilter(v || "")}
            placeholder="Counselor"
            allowClear
            style={{ width: 150 }}
            options={COUNSELORS.map((c) => ({
              value: c,
              label: c,
            }))}
          />
          <Select
            value={countryFilter || undefined}
            onChange={(v: string) => setCountryFilter(v || "")}
            placeholder="Country"
            allowClear
            style={{ width: 130 }}
            options={COUNTRIES.map((c) => ({
              value: c,
              label: c,
            }))}
          />
          <Select
            value={priorityFilter || undefined}
            onChange={(v: string) => setPriorityFilter(v || "")}
            placeholder="Priority"
            allowClear
            style={{ width: 120 }}
            options={[
              { value: "Hot", label: "🔥 Hot" },
              { value: "Warm", label: "⚡ Warm" },
              { value: "Cold", label: "❄️ Cold" },
            ]}
          />

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 cursor-pointer hover:bg-indigo-100 transition-colors"
            >
              <RiRefreshLine size={11} /> Clear
            </button>
          )}

          <span className="ml-auto text-xs font-medium text-slate-400 shrink-0">
            {filteredLeads.length} of {leads.length} lost leads
          </span>
        </div>
      </div>

      {/* ═══ TABLE (Ant Design) ═══ */}

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden min-w-0">
        <Table<LostLead>
          dataSource={filteredLeads}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total: number, range: [number, number]) =>
              `${range[0]}–${range[1]} of ${total} lost leads`,
            style: { padding: "12px 16px", margin: 0 },
          }}
          scroll={{ x: 1200 }}
          size="middle"
          locale={{
            emptyText: (
              <Empty
                description="No lost leads found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
          onRow={(record: LostLead) => ({
            onClick: () => setSelectedLead(record),
            style: { cursor: "pointer" },
          })}
        />
      </div>

      {/* ─── Drawer & Modal ─── */}
      <LostLeadDrawer
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onReactivate={(lead: LostLead) => {
          setSelectedLead(null);
          setReactivateLead(lead);
        }}
      />
      <ReactivationModal
        lead={reactivateLead}
        onClose={() => setReactivateLead(null)}
        onReactivate={handleReactivate}
      />
    </div>
  );
};

export default LostLeadsPage;
