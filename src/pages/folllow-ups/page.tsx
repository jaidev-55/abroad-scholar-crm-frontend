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
  message,
  Modal,
  Badge,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useForm } from "react-hook-form";
import CustomInput from "../../components/common/CustomInput";
import CustomSelect from "../../components/common/CustomSelect";
import CustomDatePicker from "../../components/common/CustomDatePicker";
import CustomModal from "../../components/common/CustomModal";
import {
  RiUserLine,
  RiSearchLine,
  RiPhoneLine,
  RiCalendarLine,
  RiArrowRightLine,
  RiFireLine,
  RiFlashlightLine,
  RiSnowflakeLine,
  RiRefreshLine,
  RiDownloadLine,
  RiMailLine,
  RiCloseLine,
  RiCheckLine,
  RiTimeLine,
  RiAlertLine,
  RiBarChartLine,
  RiCloseCircleLine,
  RiCheckboxCircleLine,
  RiWhatsappLine,
  RiVideoChatLine,
  RiAddLine,
  RiCalendarCheckLine,
  RiEyeLine,
  RiNotification3Line,
  RiCalendarTodoLine,
  RiArrowGoBackLine,
  RiCheckDoubleLine,
  RiCalendar2Line,
  RiListCheck2,
  RiFileListLine,
} from "react-icons/ri";

interface FollowUp {
  id: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  leadEmail: string;
  stage: string;
  counselor: string;
  type: "call" | "whatsapp" | "email" | "meeting";
  priority: "high" | "medium" | "low";
  dueDate: string;
  dueTime: string;
  status: "pending" | "completed" | "missed" | "rescheduled";
  notes: string;
  outcome?: string;
  completedAt?: string;
  createdAt: string;
  reminder: string;
  country: string;
}

const FOLLOW_UP_TYPES = [
  { value: "call", label: "📞 Call", icon: <RiPhoneLine size={13} /> },
  {
    value: "whatsapp",
    label: "💬 WhatsApp",
    icon: <RiWhatsappLine size={13} />,
  },
  { value: "email", label: "📧 Email", icon: <RiMailLine size={13} /> },
  {
    value: "meeting",
    label: "🤝 Meeting",
    icon: <RiVideoChatLine size={13} />,
  },
];

const PRIORITIES = [
  { value: "high", label: "🔴 High" },
  { value: "medium", label: "🟡 Medium" },
  { value: "low", label: "🟢 Low" },
];

const REMINDERS = [
  { value: "15min", label: "15 min before" },
  { value: "1hr", label: "1 hour before" },
  { value: "1day", label: "1 day before" },
  { value: "none", label: "No reminder" },
];

const STAGES = [
  { id: "new", label: "New Lead" },
  { id: "contacted", label: "Contacted" },
  { id: "ielts", label: "IELTS Planning" },
  { id: "applied", label: "Applied" },
  { id: "offer", label: "Offer Received" },
  { id: "enrolled", label: "Enrolled" },
];

const COUNSELORS = [
  "Priya Sharma",
  "Arjun Patel",
  "Sarah Khan",
  "Rohan Mehta",
  "Anita Desai",
];
const LEAD_NAMES = [
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
];
const COUNTRIES = [
  "🇬🇧 UK",
  "🇨🇦 Canada",
  "🇺🇸 USA",
  "🇦🇺 Australia",
  "🇩🇪 Germany",
  "🇮🇪 Ireland",
];

// ═══════════════════════════════════════════════════════════════
// MOCK DATA GENERATOR
// ═══════════════════════════════════════════════════════════════

const generateFollowUps = (): FollowUp[] => {
  const now = new Date();
  const items: FollowUp[] = [];

  for (let i = 0; i < 50; i++) {
    const dayOffset = Math.floor(Math.random() * 14) - 5; // -5 to +8 days
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + dayOffset);
    const dueHour = 9 + Math.floor(Math.random() * 9);
    const dueMin = [0, 15, 30, 45][Math.floor(Math.random() * 4)];

    const isOverdue = dayOffset < 0;
    const isToday = dayOffset === 0;
    const isCompleted = Math.random() > (isOverdue ? 0.4 : 0.7);
    const isMissed = isOverdue && !isCompleted && Math.random() > 0.5;

    let status: FollowUp["status"] = "pending";
    if (isCompleted) status = "completed";
    else if (isMissed) status = "missed";

    items.push({
      id: `fu-${i + 1}`,
      leadId: `lead-${i + 1}`,
      leadName: LEAD_NAMES[i % LEAD_NAMES.length],
      leadPhone: `+91 ${9000000000 + Math.floor(Math.random() * 999999999)}`,
      leadEmail: `${LEAD_NAMES[i % LEAD_NAMES.length].toLowerCase().replace(" ", ".")}@email.com`,
      stage: STAGES[Math.floor(Math.random() * STAGES.length)].id,
      counselor: COUNSELORS[i % COUNSELORS.length],
      type: (["call", "whatsapp", "email", "meeting"] as const)[i % 4],
      priority: (["high", "medium", "low"] as const)[i % 3],
      dueDate: dueDate.toISOString().split("T")[0],
      dueTime: `${String(dueHour).padStart(2, "0")}:${String(dueMin).padStart(2, "0")}`,
      status,
      notes: [
        "Discuss scholarship options and next steps",
        "Follow up on document submission",
        "Confirm IELTS exam date",
        "Remind about application deadline",
        "Share university comparison details",
        "Discuss visa process timeline",
        "Check financial readiness",
        "Schedule pre-departure briefing",
      ][i % 8],
      outcome: isCompleted
        ? [
            "Student confirmed enrollment",
            "Rescheduled to next week",
            "Documents received",
            "Applied successfully",
            "Student needs more time",
            "Moved to next stage",
          ][i % 6]
        : undefined,
      completedAt: isCompleted
        ? new Date(
            Date.now() - Math.floor(Math.random() * 48) * 3600000,
          ).toISOString()
        : undefined,
      createdAt: new Date(
        Date.now() - (dayOffset + 5) * 86400000,
      ).toISOString(),
      reminder: REMINDERS[i % REMINDERS.length].value,
      country: COUNTRIES[i % COUNTRIES.length],
    });
  }
  return items.sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  );
};

const ALL_FOLLOWUPS = generateFollowUps();

// ═══════════════════════════════════════════════════════════════
// SHARED UI COMPONENTS
// ═══════════════════════════════════════════════════════════════

const UserAvatar: React.FC<{ name: string; size?: "sm" | "md" }> = ({
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
  subtitle?: string;
}> = ({ label, value, icon, bg, tc, barBg, subtitle }) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-4 relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50 cursor-default min-w-0">
    <div className="flex justify-between items-start gap-2">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 truncate">
          {label}
        </p>
        <p className="text-2xl font-extrabold text-slate-900 leading-none tracking-tight">
          {value}
        </p>
        {subtitle && (
          <p className="text-[10px] text-slate-400 mt-1 truncate">{subtitle}</p>
        )}
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

const TypeBadge: React.FC<{ type: FollowUp["type"] }> = ({ type }) => {
  const cfg = {
    call: {
      cls: "text-blue-600 bg-blue-50 border-blue-200",
      icon: <RiPhoneLine size={11} />,
      label: "Call",
    },
    whatsapp: {
      cls: "text-emerald-600 bg-emerald-50 border-emerald-200",
      icon: <RiWhatsappLine size={11} />,
      label: "WhatsApp",
    },
    email: {
      cls: "text-violet-600 bg-violet-50 border-violet-200",
      icon: <RiMailLine size={11} />,
      label: "Email",
    },
    meeting: {
      cls: "text-amber-600 bg-amber-50 border-amber-200",
      icon: <RiVideoChatLine size={11} />,
      label: "Meeting",
    },
  };
  const c = cfg[type];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${c.cls}`}
    >
      {c.icon} {c.label}
    </span>
  );
};

const PriorityBadge: React.FC<{ priority: FollowUp["priority"] }> = ({
  priority,
}) => {
  const cfg = {
    high: {
      cls: "text-red-600 bg-red-50 border-red-200",
      icon: <RiFireLine size={11} />,
    },
    medium: {
      cls: "text-amber-600 bg-amber-50 border-amber-200",
      icon: <RiFlashlightLine size={11} />,
    },
    low: {
      cls: "text-emerald-600 bg-emerald-50 border-emerald-200",
      icon: <RiSnowflakeLine size={11} />,
    },
  };
  const c = cfg[priority];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${c.cls}`}
    >
      {c.icon} {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
};

const StatusBadge: React.FC<{ status: FollowUp["status"] }> = ({ status }) => {
  const cfg = {
    pending: {
      cls: "text-amber-700 bg-amber-50 border-amber-200",
      icon: <RiTimeLine size={11} />,
      label: "Pending",
    },
    completed: {
      cls: "text-emerald-700 bg-emerald-50 border-emerald-200",
      icon: <RiCheckDoubleLine size={11} />,
      label: "Completed",
    },
    missed: {
      cls: "text-red-700 bg-red-50 border-red-200",
      icon: <RiCloseCircleLine size={11} />,
      label: "Missed",
    },
    rescheduled: {
      cls: "text-blue-700 bg-blue-50 border-blue-200",
      icon: <RiCalendarCheckLine size={11} />,
      label: "Rescheduled",
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

const StageBadge: React.FC<{ stageId: string }> = ({ stageId }) => {
  const stage = STAGES.find((s) => s.id === stageId);
  if (!stage) return null;
  const colorMap: Record<string, string> = {
    new: "bg-blue-50 text-blue-700 border-blue-200",
    contacted: "bg-sky-50 text-sky-700 border-sky-200",
    ielts: "bg-violet-50 text-violet-700 border-violet-200",
    applied: "bg-amber-50 text-amber-700 border-amber-200",
    offer: "bg-emerald-50 text-emerald-700 border-emerald-200",
    enrolled: "bg-green-50 text-green-700 border-green-200",
  };
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-semibold border ${colorMap[stageId] || "bg-slate-50 text-slate-600 border-slate-200"}`}
    >
      {stage.label}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════
// CREATE / RESCHEDULE FOLLOW-UP MODAL (uses custom components)
// ═══════════════════════════════════════════════════════════════

const CreateFollowUpModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editData?: FollowUp | null;
}> = ({ open, onClose, onSubmit, editData }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      leadName: editData?.leadName || "",
      type: editData?.type || "",
      dueDate: null as any,
      priority: editData?.priority || "",
      notes: editData?.notes || "",
      reminder: editData?.reminder || "1hr",
      counselor: editData?.counselor || "",
    },
  });

  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (data: any) => {
    setLoading(true);
    setTimeout(() => {
      onSubmit(data);
      setLoading(false);
      reset();
      onClose();
    }, 400);
  };

  return (
    <CustomModal open={open} onClose={onClose}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-500 px-6 py-4 relative overflow-hidden">
        <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/[0.07]" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              {editData ? (
                <RiCalendarCheckLine size={18} className="text-white" />
              ) : (
                <RiAddLine size={18} className="text-white" />
              )}
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-white">
                {editData ? "Reschedule Follow-up" : "Create Follow-up"}
              </h3>
              <p className="text-[11px] text-white/60">
                {editData
                  ? `Rescheduling for ${editData.leadName}`
                  : "Schedule a new follow-up task"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-white/15 hover:bg-white/25 border-none rounded-lg p-1.5 cursor-pointer flex text-white transition-colors"
          >
            <RiCloseLine size={16} />
          </button>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="p-5 flex flex-col gap-4 max-h-[60vh] overflow-y-auto"
        style={{ scrollbarWidth: "thin" }}
      >
        <div className="grid grid-cols-2 gap-4">
          <CustomInput
            name="leadName"
            label="Lead Name"
            placeholder="Select or enter lead"
            icon={<RiUserLine size={14} className="text-slate-400" />}
            control={control}
            rules={{ required: "Lead name is required" }}
          />
          <CustomSelect
            name="counselor"
            label="Counselor"
            placeholder="Assign counselor"
            required
            control={control}
            errors={errors}
            rules={{ required: "Counselor is required" }}
            options={COUNSELORS.map((c) => ({ value: c, label: c }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <CustomSelect
            name="type"
            label="Follow-up Type"
            placeholder="Select type"
            required
            control={control}
            errors={errors}
            rules={{ required: "Type is required" }}
            options={FOLLOW_UP_TYPES.map((t) => ({
              value: t.value,
              label: t.label,
            }))}
          />
          <CustomSelect
            name="priority"
            label="Priority"
            placeholder="Select priority"
            required
            control={control}
            errors={errors}
            rules={{ required: "Priority is required" }}
            options={PRIORITIES}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <CustomDatePicker
            name="dueDate"
            label="Due Date & Time"
            placeholder="Pick date & time"
            showTime
            required
            control={control}
            errors={errors}
            rules={{ required: "Date is required" }}
          />
          <CustomSelect
            name="reminder"
            label="Reminder"
            placeholder="Set reminder"
            control={control}
            errors={errors}
            options={REMINDERS}
          />
        </div>
        <CustomInput
          name="notes"
          label="Notes"
          placeholder="Add context or discussion points..."
          icon={<RiFileListLine size={14} className="text-slate-400" />}
          control={control}
        />

        {/* Submit */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-[13px] font-semibold text-slate-500 bg-transparent border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-[13px] font-bold border-none cursor-pointer transition-all ${
              !loading
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                Saving...
              </>
            ) : (
              <>
                {editData ? (
                  <RiCalendarCheckLine size={14} />
                ) : (
                  <RiAddLine size={14} />
                )}{" "}
                {editData ? "Reschedule" : "Create Follow-up"}
              </>
            )}
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

// ═══════════════════════════════════════════════════════════════
// COMPLETE FOLLOW-UP MODAL
// ═══════════════════════════════════════════════════════════════

const CompleteModal: React.FC<{
  followUp: FollowUp | null;
  onClose: () => void;
  onComplete: (id: string, outcome: string) => void;
}> = ({ followUp, onClose, onComplete }) => {
  const [outcome, setOutcome] = useState("");
  if (!followUp) return null;

  return (
    <Modal
      open={!!followUp}
      onCancel={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <RiCheckDoubleLine size={20} className="text-emerald-600" />
          </div>
          <div>
            <div className="text-base font-bold text-slate-900">
              Complete Follow-up
            </div>
            <div className="text-[13px] font-normal text-slate-400">
              {followUp.leadName} • {followUp.type}
            </div>
          </div>
        </div>
      }
      footer={null}
      width={480}
    >
      <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl mb-4 border border-slate-100">
        <TypeBadge type={followUp.type} />
        <PriorityBadge priority={followUp.priority} />
        <StageBadge stageId={followUp.stage} />
      </div>
      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
          Outcome Notes *
        </label>
        <Input.TextArea
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
          rows={3}
          placeholder="What was the outcome of this follow-up?"
          className="!rounded-xl"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-[13px] font-semibold text-slate-500 bg-transparent border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if (outcome.trim()) {
              onComplete(followUp.id, outcome);
              onClose();
              setOutcome("");
            }
          }}
          disabled={!outcome.trim()}
          className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-[13px] font-bold border-none cursor-pointer transition-all ${outcome.trim() ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-200" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
        >
          <RiCheckDoubleLine size={14} /> Mark Complete
        </button>
      </div>
    </Modal>
  );
};

// ═══════════════════════════════════════════════════════════════
// FOLLOW-UP DETAIL DRAWER
// ═══════════════════════════════════════════════════════════════

const FollowUpDrawer: React.FC<{
  followUp: FollowUp | null;
  onClose: () => void;
  onComplete: (fu: FollowUp) => void;
  onReschedule: (fu: FollowUp) => void;
}> = ({ followUp, onClose, onComplete, onReschedule }) => {
  if (!followUp) return null;
  const fu = followUp;
  const isOverdue =
    fu.status === "pending" &&
    new Date(`${fu.dueDate}T${fu.dueTime}`) < new Date();

  return (
    <Drawer
      open={!!followUp}
      onClose={onClose}
      width={480}
      title={null}
      styles={{
        body: { padding: 0, background: "#F8FAFC" },
        header: { display: "none" },
      }}
    >
      {/* Header */}
      <div
        className={`px-6 py-5 relative overflow-hidden ${isOverdue ? "bg-gradient-to-r from-red-600 via-rose-500 to-red-500" : fu.status === "completed" ? "bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500" : "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-500"}`}
      >
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/[0.07]" />
        <div className="flex justify-between items-start relative z-10">
          <div className="flex items-center gap-3">
            <UserAvatar name={fu.leadName} size="md" />
            <div>
              <h2 className="text-[17px] font-bold text-white leading-tight">
                {fu.leadName}
              </h2>
              <p className="text-xs text-white/70 flex items-center gap-1 mt-0.5">
                <RiPhoneLine size={12} /> {fu.leadPhone}
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
          <TypeBadge type={fu.type} />
          <PriorityBadge priority={fu.priority} />
          <StatusBadge status={fu.status} />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-4">
        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: "Due Date",
              value: new Date(fu.dueDate).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              }),
              icon: <RiCalendarLine size={12} />,
            },
            {
              label: "Due Time",
              value: fu.dueTime,
              icon: <RiTimeLine size={12} />,
            },
            {
              label: "Stage",
              value: <StageBadge stageId={fu.stage} />,
              icon: <RiArrowRightLine size={12} />,
            },
            {
              label: "Counselor",
              value: fu.counselor,
              icon: <RiUserLine size={12} />,
            },
            {
              label: "Country",
              value: fu.country,
              icon: <RiArrowRightLine size={12} />,
            },
            {
              label: "Reminder",
              value:
                REMINDERS.find((r) => r.value === fu.reminder)?.label || "None",
              icon: <RiNotification3Line size={12} />,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="px-3 py-2.5 rounded-xl bg-white border border-slate-100"
            >
              <div className="flex items-center gap-1 mb-0.5 text-slate-400">
                {item.icon}
                <span className="text-[10px] font-semibold uppercase tracking-wider">
                  {item.label}
                </span>
              </div>
              <div className="text-[13px] font-bold text-slate-800">
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <h4 className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1.5">
            <RiFileListLine size={12} /> Notes
          </h4>
          <p className="text-[13px] text-slate-700 leading-relaxed">
            {fu.notes || "No notes added."}
          </p>
        </div>

        {/* Outcome */}
        {fu.status === "completed" && fu.outcome && (
          <div className="bg-emerald-50/50 rounded-xl border border-emerald-200 p-4">
            <h4 className="text-xs font-bold text-emerald-700 mb-2 flex items-center gap-1.5">
              <RiCheckDoubleLine size={12} /> Outcome
            </h4>
            <p className="text-[13px] text-emerald-800 leading-relaxed">
              {fu.outcome}
            </p>
            {fu.completedAt && (
              <p className="text-[10px] text-emerald-600 mt-2">
                Completed{" "}
                {new Date(fu.completedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {(fu.status === "pending" || fu.status === "missed") && (
          <div className="flex gap-2">
            <button
              onClick={() => onComplete(fu)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-bold text-white bg-emerald-600 border-none cursor-pointer hover:bg-emerald-700 shadow-sm shadow-emerald-200 transition-all"
            >
              <RiCheckDoubleLine size={14} /> Complete
            </button>
            <button
              onClick={() => onReschedule(fu)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-bold text-blue-600 bg-blue-50 border border-blue-200 cursor-pointer hover:bg-blue-100 transition-all"
            >
              <RiCalendarCheckLine size={14} /> Reschedule
            </button>
          </div>
        )}
      </div>
    </Drawer>
  );
};

// ═══════════════════════════════════════════════════════════════
// CALENDAR VIEW
// ═══════════════════════════════════════════════════════════════

const CalendarView: React.FC<{
  followUps: FollowUp[];
  onSelect: (fu: FollowUp) => void;
}> = ({ followUps, onSelect }) => {
  const today = new Date();
  const [weekOffset, setWeekOffset] = useState(0);

  const weekDays = useMemo(() => {
    const start = new Date(today);
    start.setDate(start.getDate() - start.getDay() + 1 + weekOffset * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [weekOffset]);

  const getFollowUpsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return followUps.filter((fu) => fu.dueDate === dateStr);
  };

  const isToday = (date: Date) =>
    date.toISOString().split("T")[0] === today.toISOString().split("T")[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setWeekOffset((p) => p - 1)}
          className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors flex"
        >
          <RiArrowGoBackLine size={14} className="text-slate-500" />
        </button>
        <h3 className="text-sm font-bold text-slate-700">
          {weekDays[0].toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}{" "}
          –{" "}
          {weekDays[6].toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </h3>
        <button
          onClick={() => setWeekOffset((p) => p + 1)}
          className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors flex"
        >
          <RiArrowRightLine size={14} className="text-slate-500" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {weekDays.map((day) => {
          const fus = getFollowUpsForDate(day);
          const isTd = isToday(day);
          return (
            <div
              key={day.toISOString()}
              className={`rounded-xl p-2 min-h-[120px] border ${isTd ? "bg-blue-50/50 border-blue-200" : "bg-slate-50/50 border-slate-100"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">
                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                </span>
                <span
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold ${isTd ? "bg-blue-600 text-white" : "text-slate-600"}`}
                >
                  {day.getDate()}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                {fus.slice(0, 3).map((fu) => (
                  <button
                    key={fu.id}
                    onClick={() => onSelect(fu)}
                    className={`text-left w-full px-1.5 py-1 rounded-md text-[10px] font-semibold border-none cursor-pointer truncate ${
                      fu.status === "completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : fu.status === "missed"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {fu.dueTime} {fu.leadName.split(" ")[0]}
                  </button>
                ))}
                {fus.length > 3 && (
                  <span className="text-[9px] text-slate-400 font-semibold text-center">
                    +{fus.length - 3} more
                  </span>
                )}
                {fus.length === 0 && (
                  <span className="text-[9px] text-slate-300 text-center mt-2">
                    No tasks
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AllFollowupsPage: React.FC = () => {
  const [followUps, setFollowUps] = useState<FollowUp[]>(ALL_FOLLOWUPS);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [counselorFilter, setCounselorFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [selectedFU, setSelectedFU] = useState<FollowUp | null>(null);
  const [completeFU, setCompleteFU] = useState<FollowUp | null>(null);
  const [rescheduleFU, setRescheduleFU] = useState<FollowUp | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [activeTab, setActiveTab] = useState("today");

  const todayStr = new Date().toISOString().split("T")[0];

  // Categorize
  const categorized = useMemo(() => {
    const today: FollowUp[] = [];
    const overdue: FollowUp[] = [];
    const upcoming: FollowUp[] = [];
    const completed: FollowUp[] = [];
    const now = new Date();
    const next7 = new Date(now);
    next7.setDate(next7.getDate() + 7);

    followUps.forEach((fu) => {
      if (fu.status === "completed") {
        completed.push(fu);
        return;
      }
      const dueD = new Date(fu.dueDate);
      if (fu.dueDate === todayStr) today.push(fu);
      else if (dueD < now && fu.status !== "completed") overdue.push(fu);
      else if (dueD <= next7) upcoming.push(fu);
    });

    overdue.sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    );
    return { today, overdue, upcoming, completed };
  }, [followUps, todayStr]);

  // Stats
  const stats = useMemo(() => {
    const now = new Date();
    const next3 = new Date(now);
    next3.setDate(next3.getDate() + 3);
    return {
      dueToday: categorized.today.length,
      overdue: categorized.overdue.length,
      upcoming: followUps.filter((fu) => {
        const d = new Date(fu.dueDate);
        return d > now && d <= next3 && fu.status !== "completed";
      }).length,
      highPriority: followUps.filter(
        (fu) => fu.priority === "high" && fu.status === "pending",
      ).length,
      calls: followUps.filter(
        (fu) => fu.type === "call" && fu.status === "pending",
      ).length,
      whatsapp: followUps.filter(
        (fu) => fu.type === "whatsapp" && fu.status === "pending",
      ).length,
      completed: categorized.completed.length,
    };
  }, [followUps, categorized]);

  // Filter logic for the "all" tab
  const filteredAll = useMemo(() => {
    return followUps.filter((fu) => {
      if (
        search &&
        !fu.leadName.toLowerCase().includes(search.toLowerCase()) &&
        !fu.leadPhone.includes(search)
      )
        return false;
      if (typeFilter && fu.type !== typeFilter) return false;
      if (counselorFilter && fu.counselor !== counselorFilter) return false;
      if (priorityFilter && fu.priority !== priorityFilter) return false;
      return true;
    });
  }, [followUps, search, typeFilter, counselorFilter, priorityFilter]);

  // Get data for active tab
  const getTabData = (): FollowUp[] => {
    switch (activeTab) {
      case "today":
        return categorized.today;
      case "overdue":
        return categorized.overdue;
      case "upcoming":
        return categorized.upcoming;
      case "completed":
        return categorized.completed;
      default:
        return filteredAll;
    }
  };

  const handleComplete = (id: string, outcome: string) => {
    setFollowUps((prev) =>
      prev.map((fu) =>
        fu.id === id
          ? {
              ...fu,
              status: "completed" as const,
              outcome,
              completedAt: new Date().toISOString(),
            }
          : fu,
      ),
    );
    message.success({ content: "Follow-up completed!", duration: 2 });
  };

  const handleCreate = (data: any) => {
    const newFU: FollowUp = {
      id: `fu-new-${Date.now()}`,
      leadId: `lead-new-${Date.now()}`,
      leadName: data.leadName,
      leadPhone: "+91 9876543210",
      leadEmail: "",
      stage: "contacted",
      counselor: data.counselor,
      type: data.type,
      priority: data.priority,
      dueDate: data.dueDate ? data.dueDate.format("YYYY-MM-DD") : todayStr,
      dueTime: data.dueDate ? data.dueDate.format("HH:mm") : "10:00",
      status: "pending",
      notes: data.notes,
      createdAt: new Date().toISOString(),
      reminder: data.reminder,
      country: "🇬🇧 UK",
    };
    setFollowUps((prev) => [newFU, ...prev]);
    message.success({ content: "Follow-up created!", duration: 2 });
  };

  const handleExportCSV = () => {
    const data = getTabData();
    const headers = [
      "Lead",
      "Phone",
      "Type",
      "Priority",
      "Counselor",
      "Due Date",
      "Time",
      "Status",
      "Notes",
    ];
    const rows = data.map((fu) => [
      fu.leadName,
      fu.leadPhone,
      fu.type,
      fu.priority,
      fu.counselor,
      fu.dueDate,
      fu.dueTime,
      fu.status,
      fu.notes,
    ]);
    const csv = [
      headers.join(","),
      ...rows.map((r) => r.map((c) => `"${c}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "followups.csv";
    a.click();
    URL.revokeObjectURL(url);
    message.success({ content: "CSV exported!", duration: 2 });
  };

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("");
    setCounselorFilter("");
    setPriorityFilter("");
  };
  const hasFilters = !!(
    search ||
    typeFilter ||
    counselorFilter ||
    priorityFilter
  );

  // Table columns
  const columns: ColumnsType<FollowUp> = [
    {
      title: "Lead",
      dataIndex: "leadName",
      key: "lead",
      width: 180,
      fixed: "left" as const,
      sorter: (a, b) => a.leadName.localeCompare(b.leadName),
      render: (name: string, record) => (
        <button
          onClick={() => setSelectedFU(record)}
          className="flex items-center gap-2 bg-transparent border-none cursor-pointer p-0 text-left w-full group"
        >
          <UserAvatar name={name} size="md" />
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
              {name}
            </div>
            <div className="text-[11px] text-slate-400">{record.country}</div>
          </div>
        </button>
      ),
    },
    {
      title: "Phone",
      dataIndex: "leadPhone",
      key: "phone",
      width: 140,
      render: (p: string) => (
        <Tooltip title="Call">
          <span className="text-[12px] text-slate-500 flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors">
            <RiPhoneLine size={12} /> {p.replace("+91 ", "")}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Stage",
      dataIndex: "stage",
      key: "stage",
      width: 120,
      render: (s: string) => <StageBadge stageId={s} />,
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
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 110,
      render: (t: FollowUp["type"]) => <TypeBadge type={t} />,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: 100,
      render: (p: FollowUp["priority"]) => <PriorityBadge priority={p} />,
    },
    {
      title: "Due",
      key: "due",
      width: 110,
      sorter: (a, b) =>
        new Date(`${a.dueDate}T${a.dueTime}`).getTime() -
        new Date(`${b.dueDate}T${b.dueTime}`).getTime(),
      render: (_: unknown, record: FollowUp) => {
        const isOd =
          record.status === "pending" &&
          new Date(record.dueDate) < new Date(todayStr);
        return (
          <div>
            <span
              className={`text-xs font-medium ${isOd ? "text-red-600" : "text-slate-600"}`}
            >
              {new Date(record.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
            <p
              className={`text-[10px] ${isOd ? "text-red-500" : "text-slate-400"}`}
            >
              {record.dueTime}
              {isOd && " (overdue)"}
            </p>
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (s: FollowUp["status"]) => <StatusBadge status={s} />,
    },
    {
      title: "Action",
      key: "actions",
      width: 140,
      fixed: "right" as const,
      render: (_: unknown, record: FollowUp) => (
        <div className="flex items-center gap-1">
          {(record.status === "pending" || record.status === "missed") && (
            <>
              <Tooltip title="Complete">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCompleteFU(record);
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition-colors"
                >
                  <RiCheckLine size={11} /> Done
                </button>
              </Tooltip>
              <Tooltip title="Reschedule">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRescheduleFU(record);
                  }}
                  className="p-1 rounded-lg bg-transparent border-none cursor-pointer text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex"
                >
                  <RiCalendarCheckLine size={14} />
                </button>
              </Tooltip>
            </>
          )}
          <Tooltip title="View">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFU(record);
              }}
              className="p-1 rounded-lg bg-transparent border-none cursor-pointer text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors flex"
            >
              <RiEyeLine size={14} />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const tabItems = [
    {
      key: "today",
      label: (
        <span className="flex items-center gap-1.5">
          <RiCalendarTodoLine size={13} /> Today{" "}
          <Badge
            count={stats.dueToday}
            size="small"
            style={{ backgroundColor: "#3B82F6" }}
          />
        </span>
      ),
    },
    {
      key: "overdue",
      label: (
        <span className="flex items-center gap-1.5">
          <RiAlertLine size={13} /> Overdue{" "}
          <Badge
            count={stats.overdue}
            size="small"
            style={{ backgroundColor: "#EF4444" }}
          />
        </span>
      ),
    },
    {
      key: "upcoming",
      label: (
        <span className="flex items-center gap-1.5">
          <RiCalendar2Line size={13} /> Upcoming
        </span>
      ),
    },
    {
      key: "completed",
      label: (
        <span className="flex items-center gap-1.5">
          <RiCheckDoubleLine size={13} /> Completed
        </span>
      ),
    },
    {
      key: "all",
      label: (
        <span className="flex items-center gap-1.5">
          <RiListCheck2 size={13} /> All
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full p-5 overflow-hidden min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap min-w-0">
        <div className="min-w-0">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Follow-ups
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Track, schedule & complete all follow-up tasks
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <div className="flex items-center bg-slate-100 rounded-xl p-0.5">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-semibold border-none cursor-pointer transition-all ${viewMode === "list" ? "bg-white text-slate-800 shadow-sm" : "bg-transparent text-slate-500"}`}
            >
              <RiListCheck2 size={13} /> List
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-semibold border-none cursor-pointer transition-all ${viewMode === "calendar" ? "bg-white text-slate-800 shadow-sm" : "bg-transparent text-slate-500"}`}
            >
              <RiCalendar2Line size={13} /> Calendar
            </button>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-bold bg-blue-600 text-white border-none cursor-pointer hover:bg-blue-700 shadow-sm shadow-blue-200 transition-all"
          >
            <RiAddLine size={15} /> New Follow-up
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-semibold bg-white text-slate-600 border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all"
          >
            <RiDownloadLine size={15} /> Export
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="w-full min-w-0 overflow-hidden">
        <div
          className="overflow-x-auto pb-1"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#CBD5E1 transparent",
          }}
        >
          <div className="grid grid-cols-7 gap-3 min-w-[1050px]">
            <StatCard
              label="Due Today"
              value={stats.dueToday}
              icon={<RiNotification3Line size={17} />}
              bg="bg-blue-50"
              tc="text-blue-500"
              barBg="bg-blue-500"
            />
            <StatCard
              label="Overdue"
              value={stats.overdue}
              icon={<RiAlertLine size={17} />}
              bg="bg-red-50"
              tc="text-red-500"
              barBg="bg-red-500"
            />
            <StatCard
              label="Upcoming 3d"
              value={stats.upcoming}
              icon={<RiCalendarLine size={17} />}
              bg="bg-violet-50"
              tc="text-violet-500"
              barBg="bg-violet-500"
            />
            <StatCard
              label="High Priority"
              value={stats.highPriority}
              icon={<RiFireLine size={17} />}
              bg="bg-amber-50"
              tc="text-amber-500"
              barBg="bg-amber-500"
            />
            <StatCard
              label="Completed"
              value={stats.completed}
              icon={<RiCheckboxCircleLine size={17} />}
              bg="bg-emerald-50"
              tc="text-emerald-500"
              barBg="bg-emerald-500"
            />
            <StatCard
              label="Calls Due"
              value={stats.calls}
              icon={<RiPhoneLine size={17} />}
              bg="bg-cyan-50"
              tc="text-cyan-500"
              barBg="bg-cyan-500"
            />
            <StatCard
              label="WhatsApp Due"
              value={stats.whatsapp}
              icon={<RiWhatsappLine size={17} />}
              bg="bg-green-50"
              tc="text-green-500"
              barBg="bg-green-500"
            />
          </div>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === "calendar" && (
        <>
          <CalendarView
            followUps={followUps.filter((fu) => fu.status !== "completed")}
            onSelect={setSelectedFU}
          />
        </>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <>
          {/* Tabs */}
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className="followup-tabs"
            style={{ marginBottom: -12 }}
          />

          {/* Filters — only for "all" tab */}
          {activeTab === "all" && (
            <div className="bg-white rounded-2xl border border-slate-100 p-4 min-w-0 overflow-hidden">
              <div className="flex flex-wrap gap-2 items-center">
                <Input
                  prefix={<RiSearchLine size={14} className="text-slate-400" />}
                  placeholder="Search lead..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  allowClear
                  style={{ width: 190 }}
                  className="!rounded-xl"
                />
                <Select
                  value={typeFilter || undefined}
                  onChange={(v) => setTypeFilter(v || "")}
                  placeholder="Type"
                  allowClear
                  style={{ width: 130 }}
                  options={FOLLOW_UP_TYPES.map((t) => ({
                    value: t.value,
                    label: t.label,
                  }))}
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
                  value={priorityFilter || undefined}
                  onChange={(v) => setPriorityFilter(v || "")}
                  placeholder="Priority"
                  allowClear
                  style={{ width: 120 }}
                  options={PRIORITIES}
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
                  {filteredAll.length} follow-ups
                </span>
              </div>
            </div>
          )}

          {/* Table */}
          <ConfigProvider
            theme={{
              components: {
                Table: {
                  headerBg: "#F8FAFC",
                  headerColor: "#64748B",
                  headerSplitColor: "transparent",
                  rowHoverBg: activeTab === "overdue" ? "#FEF2F2" : "#F8FAFF",
                  borderColor: "#F1F5F9",
                  cellPaddingBlock: 12,
                  cellPaddingInline: 12,
                  fontSize: 13,
                },
              },
            }}
          >
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden min-w-0">
              <Table<FollowUp>
                dataSource={getTabData()}
                columns={columns}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (t, r) => `${r[0]}–${r[1]} of ${t}`,
                  style: { padding: "12px 16px", margin: 0 },
                }}
                scroll={{ x: 1250 }}
                size="middle"
                locale={{
                  emptyText: (
                    <Empty
                      description={`No ${activeTab} follow-ups`}
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  ),
                }}
                onRow={(record) => ({
                  onClick: () => setSelectedFU(record),
                  style: { cursor: "pointer" },
                })}
                rowClassName={(record) =>
                  record.status === "missed" ? "!bg-red-50/30" : ""
                }
              />
            </div>
          </ConfigProvider>
        </>
      )}

      {/* Modals & Drawers */}
      <FollowUpDrawer
        followUp={selectedFU}
        onClose={() => setSelectedFU(null)}
        onComplete={(fu) => {
          setSelectedFU(null);
          setCompleteFU(fu);
        }}
        onReschedule={(fu) => {
          setSelectedFU(null);
          setRescheduleFU(fu);
        }}
      />
      <CompleteModal
        followUp={completeFU}
        onClose={() => setCompleteFU(null)}
        onComplete={handleComplete}
      />
      <CreateFollowUpModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
      />
      <CreateFollowUpModal
        open={!!rescheduleFU}
        onClose={() => setRescheduleFU(null)}
        onSubmit={handleCreate}
        editData={rescheduleFU}
      />

      <style>{`
        .followup-tabs .ant-tabs-nav { padding: 0; margin: 0; }
        .followup-tabs .ant-tabs-tab { padding: 10px 12px; font-size: 13px; font-weight: 600; }
        .followup-tabs .ant-tabs-nav::before { border-bottom: 1px solid #F1F5F9; }
      `}</style>
    </div>
  );
};

export default AllFollowupsPage;
