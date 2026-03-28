import React, { useState, useMemo } from "react";
import {
  Table,
  Select,
  Tooltip,
  ConfigProvider,
  Tabs,
  Empty,
  message,
  Badge,
  Checkbox,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useForm } from "react-hook-form";
import CustomInput from "../../components/common/CustomInput";
import CustomSelect from "../../components/common/CustomSelect";
import CustomDatePicker from "../../components/common/CustomDatePicker";
import CustomModal from "../../components/common/CustomModal";
import {
  RiUserLine,
  RiCalendarLine,
  RiFireLine,
  RiFlashlightLine,
  RiSnowflakeLine,
  RiRefreshLine,
  RiDownloadLine,
  RiCloseLine,
  RiCheckLine,
  RiTimeLine,
  RiAlertLine,
  RiCheckboxCircleLine,
  RiAddLine,
  RiDeleteBinLine,
  RiEditLine,
  RiCheckDoubleLine,
  RiFileListLine,
  RiBookOpenLine,
  RiPassportLine,
  RiGroupLine,
  RiListCheck2,
  RiCalendar2Line,
  RiCalendarTodoLine,
} from "react-icons/ri";

interface Task {
  id: string;
  title: string;
  description: string;
  relatedLead: string;
  relatedLeadId: string;
  module: "lead" | "ielts" | "application" | "visa" | "general";
  priority: "high" | "medium" | "low";
  dueDate: string;
  dueTime: string;
  assignedTo: string;
  status: "pending" | "completed";
  completedAt?: string;
  createdAt: string;
  createdBy: string;
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
const MODULES: {
  value: Task["module"];
  label: string;
  icon: React.ReactNode;
  cls: string;
}[] = [
  {
    value: "lead",
    label: "Lead",
    icon: <RiGroupLine size={11} />,
    cls: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    value: "ielts",
    label: "IELTS",
    icon: <RiBookOpenLine size={11} />,
    cls: "bg-violet-50 text-violet-700 border-violet-200",
  },
  {
    value: "application",
    label: "Application",
    icon: <RiFileListLine size={11} />,
    cls: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    value: "visa",
    label: "Visa",
    icon: <RiPassportLine size={11} />,
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    value: "general",
    label: "General",
    icon: <RiCalendarLine size={11} />,
    cls: "bg-slate-50 text-slate-600 border-slate-200",
  },
];
const PRIORITIES = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
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
];
const TASK_TITLES = [
  "Follow up on document submission",
  "Schedule IELTS mock test",
  "Review application essay",
  "Send university shortlist",
  "Confirm visa appointment",
  "Discuss scholarship options",
  "Upload SOP for review",
  "Book IELTS exam slot",
  "Submit offer acceptance",
  "Collect financial documents",
  "Prepare interview notes",
  "Send pre-departure checklist",
  "Follow up on IELTS score",
  "Update application status",
  "Coordinate with university",
  "Verify eligibility requirements",
  "Process tuition deposit",
  "Arrange accommodation info",
  "Complete CAS application",
  "Schedule counseling session",
];

// ═══════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════

const generateTasks = (): Task[] => {
  const now = new Date();
  return Array.from({ length: 40 }, (_, i) => {
    const dayOffset = Math.floor(Math.random() * 14) - 4;
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + dayOffset);
    const hr = 9 + Math.floor(Math.random() * 9);
    const min = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
    const isOverdue = dayOffset < 0;
    const isCompleted = Math.random() > (isOverdue ? 0.45 : 0.72);

    return {
      id: `task-${i + 1}`,
      title: TASK_TITLES[i % TASK_TITLES.length],
      description:
        "Task details and context for the counselor to review before taking action.",
      relatedLead: LEAD_NAMES[i % LEAD_NAMES.length],
      relatedLeadId: `lead-${(i % LEAD_NAMES.length) + 1}`,
      module: (["lead", "ielts", "application", "visa", "general"] as const)[
        i % 5
      ],
      priority: (["high", "medium", "low"] as const)[i % 3],
      dueDate: dueDate.toISOString().split("T")[0],
      dueTime: `${String(hr).padStart(2, "0")}:${String(min).padStart(2, "0")}`,
      assignedTo: COUNSELORS[i % COUNSELORS.length],
      status: isCompleted ? "completed" : "pending",
      completedAt: isCompleted
        ? new Date(
            Date.now() - Math.floor(Math.random() * 48) * 3600000,
          ).toISOString()
        : undefined,
      createdAt: new Date(
        Date.now() - (dayOffset + 5) * 86400000,
      ).toISOString(),
      createdBy: "Admin",
    };
  }).sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  );
};

const ALL_TASKS = generateTasks();

// ═══════════════════════════════════════════════════════════════
// SHARED COMPONENTS
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

const PriorityBadge: React.FC<{ priority: Task["priority"] }> = ({
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

const ModuleBadge: React.FC<{ module: Task["module"] }> = ({ module }) => {
  const m = MODULES.find((x) => x.value === module);
  if (!m) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${m.cls}`}
    >
      {m.icon} {m.label}
    </span>
  );
};

const StatusBadge: React.FC<{ status: Task["status"]; dueDate?: string }> = ({
  status,
  dueDate,
}) => {
  if (status === "completed")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">
        <RiCheckDoubleLine size={11} /> Done
      </span>
    );
  const isOverdue =
    dueDate &&
    new Date(dueDate) < new Date(new Date().toISOString().split("T")[0]);
  if (isOverdue)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border bg-red-50 text-red-700 border-red-200">
        <RiAlertLine size={11} /> Overdue
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border bg-amber-50 text-amber-700 border-amber-200">
      <RiTimeLine size={11} /> Pending
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════
// CREATE / EDIT TASK MODAL (uses custom components)
// ═══════════════════════════════════════════════════════════════

const TaskModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editTask?: Task | null;
}> = ({ open, onClose, onSubmit, editTask }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: editTask?.title || "",
      description: editTask?.description || "",
      relatedLead: editTask?.relatedLead || "",
      module: editTask?.module || "",
      priority: editTask?.priority || "",
      dueDate: null as any,
      assignedTo: editTask?.assignedTo || "",
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
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 px-6 py-4 relative overflow-hidden">
        <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/[0.05]" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              {editTask ? (
                <RiEditLine size={18} className="text-white" />
              ) : (
                <RiAddLine size={18} className="text-white" />
              )}
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-white">
                {editTask ? "Edit Task" : "Create Task"}
              </h3>
              <p className="text-[11px] text-white/50">
                {editTask
                  ? "Update task details"
                  : "Add a new task to the board"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 border-none rounded-lg p-1.5 cursor-pointer flex text-white transition-colors"
          >
            <RiCloseLine size={16} />
          </button>
        </div>
      </div>

      {/* Form — single column layout */}
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="p-5 flex flex-col gap-4 max-h-[60vh] overflow-y-auto"
        style={{ scrollbarWidth: "thin" }}
      >
        <CustomInput
          name="title"
          label="Task Title"
          placeholder="e.g. Follow up on document submission"
          icon={<RiFileListLine size={14} className="text-slate-400" />}
          control={control}
          rules={{ required: "Title is required" }}
        />
        <CustomInput
          name="description"
          label="Description"
          placeholder="Add details about this task..."
          icon={<RiFileListLine size={14} className="text-slate-400" />}
          control={control}
        />
        <CustomSelect
          name="relatedLead"
          label="Related Lead"
          placeholder="Select lead"
          control={control}
          errors={errors}
          options={LEAD_NAMES.map((n) => ({ value: n, label: n }))}
        />
        <div className="grid grid-cols-2 gap-4">
          <CustomSelect
            name="module"
            label="Module"
            placeholder="Select module"
            required
            control={control}
            errors={errors}
            rules={{ required: "Module is required" }}
            options={MODULES.map((m) => ({ value: m.value, label: m.label }))}
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
            rules={{ required: "Due date is required" }}
          />
          <CustomSelect
            name="assignedTo"
            label="Assign To"
            placeholder="Select counselor"
            required
            control={control}
            errors={errors}
            rules={{ required: "Assignment is required" }}
            options={COUNSELORS.map((c) => ({ value: c, label: c }))}
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
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
            className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-[13px] font-bold border-none cursor-pointer transition-all ${!loading ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                Saving...
              </>
            ) : (
              <>
                {editTask ? <RiCheckLine size={14} /> : <RiAddLine size={14} />}{" "}
                {editTask ? "Update" : "Create Task"}
              </>
            )}
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(ALL_TASKS);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [assignedFilter, setAssignedFilter] = useState("");
  const [activeTab, setActiveTab] = useState("today");
  const [showCreate, setShowCreate] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const todayStr = new Date().toISOString().split("T")[0];

  // Categorize
  const categorized = useMemo(() => {
    const today: Task[] = [];
    const overdue: Task[] = [];
    const upcoming: Task[] = [];
    const completed: Task[] = [];
    const now = new Date(todayStr);
    const next7 = new Date(now);
    next7.setDate(next7.getDate() + 7);

    tasks.forEach((t) => {
      if (t.status === "completed") {
        completed.push(t);
        return;
      }
      const d = new Date(t.dueDate);
      if (t.dueDate === todayStr) today.push(t);
      else if (d < now) overdue.push(t);
      else if (d <= next7) upcoming.push(t);
    });
    overdue.sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    );
    return { today, overdue, upcoming, completed };
  }, [tasks, todayStr]);

  // Stats
  const stats = useMemo(
    () => ({
      total: tasks.length,
      dueToday: categorized.today.length,
      overdue: categorized.overdue.length,
      completedToday: tasks.filter(
        (t) =>
          t.status === "completed" &&
          t.completedAt &&
          t.completedAt.startsWith(todayStr),
      ).length,
      highPriority: tasks.filter(
        (t) => t.priority === "high" && t.status === "pending",
      ).length,
      myTasks: tasks.filter((t) => t.status === "pending").length,
    }),
    [tasks, categorized, todayStr],
  );

  // Filtered for "all" tab
  const filteredAll = useMemo(() => {
    return tasks.filter((t) => {
      if (
        search &&
        !t.title.toLowerCase().includes(search.toLowerCase()) &&
        !t.relatedLead.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (priorityFilter && t.priority !== priorityFilter) return false;
      if (moduleFilter && t.module !== moduleFilter) return false;
      if (assignedFilter && t.assignedTo !== assignedFilter) return false;
      return true;
    });
  }, [tasks, search, priorityFilter, moduleFilter, assignedFilter]);

  const getTabData = (): Task[] => {
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

  const handleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: "completed" as const,
              completedAt: new Date().toISOString(),
            }
          : t,
      ),
    );
    message.success({ content: "Task completed!", duration: 2 });
  };

  const handleBulkComplete = () => {
    if (selectedIds.length === 0) return;
    setTasks((prev) =>
      prev.map((t) =>
        selectedIds.includes(t.id)
          ? {
              ...t,
              status: "completed" as const,
              completedAt: new Date().toISOString(),
            }
          : t,
      ),
    );
    message.success({
      content: `${selectedIds.length} tasks completed!`,
      duration: 2,
    });
    setSelectedIds([]);
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    message.success({ content: "Task deleted", duration: 2 });
  };

  const handleCreate = (data: any) => {
    const newTask: Task = {
      id: `task-new-${Date.now()}`,
      title: data.title,
      description: data.description || "",
      relatedLead: data.relatedLead || "",
      relatedLeadId: "",
      module: data.module,
      priority: data.priority,
      dueDate: data.dueDate ? data.dueDate.format("YYYY-MM-DD") : todayStr,
      dueTime: data.dueDate ? data.dueDate.format("HH:mm") : "10:00",
      assignedTo: data.assignedTo,
      status: "pending",
      createdAt: new Date().toISOString(),
      createdBy: "Admin",
    };
    setTasks((prev) => [newTask, ...prev]);
    message.success({ content: "Task created!", duration: 2 });
  };

  const handleExport = () => {
    const data = getTabData();
    const headers = [
      "Task",
      "Related",
      "Module",
      "Priority",
      "Due Date",
      "Assigned",
      "Status",
    ];
    const rows = data.map((t) => [
      t.title,
      t.relatedLead,
      t.module,
      t.priority,
      t.dueDate,
      t.assignedTo,
      t.status,
    ]);
    const csv = [
      headers.join(","),
      ...rows.map((r) => r.map((c) => `"${c}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks.csv";
    a.click();
    URL.revokeObjectURL(url);
    message.success({ content: "Exported!", duration: 2 });
  };

  const hasFilters = !!(
    search ||
    priorityFilter ||
    moduleFilter ||
    assignedFilter
  );
  const clearFilters = () => {
    setSearch("");
    setPriorityFilter("");
    setModuleFilter("");
    setAssignedFilter("");
  };

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  // Table columns
  const columns: ColumnsType<Task> = [
    {
      title: () => (
        <Checkbox
          checked={
            selectedIds.length > 0 &&
            selectedIds.length ===
              getTabData().filter((t) => t.status === "pending").length
          }
          indeterminate={
            selectedIds.length > 0 &&
            selectedIds.length <
              getTabData().filter((t) => t.status === "pending").length
          }
          onChange={(e) => {
            if (e.target.checked)
              setSelectedIds(
                getTabData()
                  .filter((t) => t.status === "pending")
                  .map((t) => t.id),
              );
            else setSelectedIds([]);
          }}
        />
      ),
      key: "select",
      width: 40,
      render: (_: unknown, record: Task) =>
        record.status === "pending" ? (
          <Checkbox
            checked={selectedIds.includes(record.id)}
            onChange={() => toggleSelect(record.id)}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <RiCheckDoubleLine size={14} className="text-emerald-400" />
        ),
    },
    {
      title: "Task",
      dataIndex: "title",
      key: "title",
      width: 220,
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (title: string, record) => (
        <div className="min-w-0">
          <div
            className={`text-[13px] font-semibold truncate ${record.status === "completed" ? "text-slate-400 line-through" : "text-slate-900"}`}
          >
            {title}
          </div>
          {record.description && (
            <div className="text-[10px] text-slate-400 truncate mt-0.5">
              {record.description}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Related",
      dataIndex: "relatedLead",
      key: "related",
      width: 140,
      render: (name: string) =>
        name ? (
          <div className="flex items-center gap-2">
            <UserAvatar name={name} size="sm" />
            <span className="text-[12px] font-medium text-slate-600 truncate">
              {name}
            </span>
          </div>
        ) : (
          <span className="text-xs text-slate-300">—</span>
        ),
    },
    {
      title: "Module",
      dataIndex: "module",
      key: "module",
      width: 110,
      render: (m: Task["module"]) => <ModuleBadge module={m} />,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: 100,
      render: (p: Task["priority"]) => <PriorityBadge priority={p} />,
    },
    {
      title: "Due",
      key: "due",
      width: 100,
      sorter: (a, b) =>
        new Date(`${a.dueDate}T${a.dueTime}`).getTime() -
        new Date(`${b.dueDate}T${b.dueTime}`).getTime(),
      render: (_: unknown, record: Task) => {
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
              {isOd && " · overdue"}
            </p>
          </div>
        );
      },
    },
    {
      title: "Assigned",
      dataIndex: "assignedTo",
      key: "assigned",
      width: 120,
      render: (c: string) => (
        <div className="flex items-center gap-1.5">
          <UserAvatar name={c} size="sm" />
          <span className="text-[12px] text-slate-600 truncate">
            {c.split(" ")[0]}
          </span>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: 100,
      render: (_: unknown, record: Task) => (
        <StatusBadge status={record.status} dueDate={record.dueDate} />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      fixed: "right" as const,
      render: (_: unknown, record: Task) => (
        <div className="flex items-center gap-1">
          {record.status === "pending" && (
            <Tooltip title="Complete">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleComplete(record.id);
                }}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition-colors"
              >
                <RiCheckLine size={11} /> Done
              </button>
            </Tooltip>
          )}
          <Tooltip title="Edit">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditTask(record);
              }}
              className="p-1 rounded-lg bg-transparent border-none cursor-pointer text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex"
            >
              <RiEditLine size={13} />
            </button>
          </Tooltip>
          <Tooltip title="Delete">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(record.id);
              }}
              className="p-1 rounded-lg bg-transparent border-none cursor-pointer text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors flex"
            >
              <RiDeleteBinLine size={13} />
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
            Tasks
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Manage, assign & track all team tasks
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkComplete}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition-all"
            >
              <RiCheckDoubleLine size={15} /> Complete ({selectedIds.length})
            </button>
          )}
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-bold bg-blue-600 text-white border-none cursor-pointer hover:bg-blue-700 shadow-sm shadow-blue-200 transition-all"
          >
            <RiAddLine size={15} /> Create Task
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-semibold bg-white text-slate-600 border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all"
          >
            <RiDownloadLine size={15} /> Export
          </button>
        </div>
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
              label="Total Tasks"
              value={stats.total}
              icon={<RiFileListLine size={17} />}
              bg="bg-blue-50"
              tc="text-blue-500"
              barBg="bg-blue-500"
            />
            <StatCard
              label="Due Today"
              value={stats.dueToday}
              icon={<RiCalendarTodoLine size={17} />}
              bg="bg-indigo-50"
              tc="text-indigo-500"
              barBg="bg-indigo-500"
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
              label="Completed Today"
              value={stats.completedToday}
              icon={<RiCheckboxCircleLine size={17} />}
              bg="bg-emerald-50"
              tc="text-emerald-500"
              barBg="bg-emerald-500"
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
              label="Pending Tasks"
              value={stats.myTasks}
              icon={<RiUserLine size={17} />}
              bg="bg-cyan-50"
              tc="text-cyan-500"
              barBg="bg-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={(k) => {
          setActiveTab(k);
          setSelectedIds([]);
        }}
        items={tabItems}
        className="task-tabs"
        style={{ marginBottom: -12 }}
      />

      {/* Filters — "all" tab only */}
      {activeTab === "all" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-4 min-w-0 overflow-hidden">
          <div className="flex flex-wrap gap-2 items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search task or lead..."
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-[13px] text-slate-700 bg-slate-50 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all w-[180px] placeholder:text-slate-400"
            />
            <Select
              value={priorityFilter || undefined}
              onChange={(v) => setPriorityFilter(v || "")}
              placeholder="Priority"
              allowClear
              style={{ width: 120 }}
              options={PRIORITIES}
            />
            <Select
              value={moduleFilter || undefined}
              onChange={(v) => setModuleFilter(v || "")}
              placeholder="Module"
              allowClear
              style={{ width: 130 }}
              options={MODULES.map((m) => ({ value: m.value, label: m.label }))}
            />
            <Select
              value={assignedFilter || undefined}
              onChange={(v) => setAssignedFilter(v || "")}
              placeholder="Assigned To"
              allowClear
              style={{ width: 140 }}
              options={COUNSELORS.map((c) => ({ value: c, label: c }))}
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
              {filteredAll.length} tasks
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
              cellPaddingBlock: 11,
              cellPaddingInline: 10,
              fontSize: 13,
            },
          },
        }}
      >
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden min-w-0">
          <Table<Task>
            dataSource={getTabData()}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (t, r) => `${r[0]}–${r[1]} of ${t}`,
              style: { padding: "12px 16px", margin: 0 },
            }}
            scroll={{ x: 1100 }}
            size="middle"
            locale={{
              emptyText: (
                <Empty
                  description={`No ${activeTab} tasks`}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
            rowClassName={(record) => {
              if (
                record.status === "pending" &&
                new Date(record.dueDate) < new Date(todayStr)
              )
                return "!bg-red-50/40";
              if (record.status === "completed") return "opacity-60";
              return "";
            }}
          />
        </div>
      </ConfigProvider>

      {/* Modals */}
      <TaskModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
      />
      <TaskModal
        open={!!editTask}
        onClose={() => setEditTask(null)}
        onSubmit={handleCreate}
        editTask={editTask}
      />

      <style>{`
        .task-tabs .ant-tabs-nav { padding: 0; margin: 0; }
        .task-tabs .ant-tabs-tab { padding: 10px 12px; font-size: 13px; font-weight: 600; }
        .task-tabs .ant-tabs-nav::before { border-bottom: 1px solid #F1F5F9; }
      `}</style>
    </div>
  );
};

export default TasksPage;
