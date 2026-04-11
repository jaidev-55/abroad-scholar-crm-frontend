export type DateRange = "today" | "7d" | "30d" | "90d" | "custom";
export type LeadStatus = "New" | "In Progress" | "Converted" | "Lost";
export type Priority = "Hot" | "Warm" | "Cold";

export interface StatCard {
  id: string;
  label: string;
  value: string;
  delta: number;
  icon: React.ReactNode;
  accent: string;
  iconBg: string;
  iconColor: string;
  spark: number[];
  sparkColor: string;
}

export interface RecentLead {
  id: string;
  name: string;
  initials: string;
  avatarBg: string;
  avatarText: string;
  source: string;
  sourceColor: string;
  counselor: string;
  country: string;
  flag: string;
  status: LeadStatus;
  priority: Priority;
  createdAt: string;
  ielts: number;
}

export interface Counselor {
  id: string;
  name: string;
  initials: string;
  color: string;
  leads: number;
  converted: number;
  rate: number;
}

export interface Task {
  id: string;
  title: string;
  lead: string;
  type: "call" | "email" | "meeting";
  time: string;
  urgent: boolean;
}

export const DATE_RANGES: { id: DateRange; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "7d", label: "7 Days" },
  { id: "30d", label: "30 Days" },
  { id: "90d", label: "90 Days" },
  { id: "custom", label: "Custom" },
];

export const RECENT_LEADS: RecentLead[] = [
  {
    id: "1",
    name: "Abroad Scholar",
    initials: "AS",
    avatarBg: "bg-amber-100",
    avatarText: "text-amber-700",
    source: "Instagram",
    sourceColor: "bg-pink-50 text-pink-600",
    counselor: "Ganesh",
    country: "Canada",
    flag: "🇨🇦",
    status: "New",
    priority: "Hot",
    createdAt: "Apr 11, 2026",
    ielts: 9,
  },
  {
    id: "2",
    name: "Priya Sharma",
    initials: "PS",
    avatarBg: "bg-violet-100",
    avatarText: "text-violet-700",
    source: "Facebook",
    sourceColor: "bg-blue-50 text-blue-600",
    counselor: "Ganesh",
    country: "Australia",
    flag: "🇦🇺",
    status: "In Progress",
    priority: "Hot",
    createdAt: "Apr 10, 2026",
    ielts: 8,
  },
  {
    id: "3",
    name: "Rahul Kumar",
    initials: "RK",
    avatarBg: "bg-emerald-100",
    avatarText: "text-emerald-700",
    source: "Website",
    sourceColor: "bg-emerald-50 text-emerald-600",
    counselor: "Meera",
    country: "UK",
    flag: "🇬🇧",
    status: "Converted",
    priority: "Warm",
    createdAt: "Apr 9, 2026",
    ielts: 7.5,
  },
  {
    id: "4",
    name: "Sneha Patel",
    initials: "SP",
    avatarBg: "bg-rose-100",
    avatarText: "text-rose-700",
    source: "Referral",
    sourceColor: "bg-amber-50 text-amber-600",
    counselor: "Arjun",
    country: "USA",
    flag: "🇺🇸",
    status: "In Progress",
    priority: "Hot",
    createdAt: "Apr 9, 2026",
    ielts: 8.5,
  },
  {
    id: "5",
    name: "Vikram Singh",
    initials: "VS",
    avatarBg: "bg-blue-100",
    avatarText: "text-blue-700",
    source: "Instagram",
    sourceColor: "bg-pink-50 text-pink-600",
    counselor: "Meera",
    country: "Germany",
    flag: "🇩🇪",
    status: "New",
    priority: "Warm",
    createdAt: "Apr 8, 2026",
    ielts: 7,
  },
  {
    id: "6",
    name: "Anjali Reddy",
    initials: "AR",
    avatarBg: "bg-cyan-100",
    avatarText: "text-cyan-700",
    source: "Website",
    sourceColor: "bg-emerald-50 text-emerald-600",
    counselor: "Ganesh",
    country: "Canada",
    flag: "🇨🇦",
    status: "Lost",
    priority: "Cold",
    createdAt: "Apr 7, 2026",
    ielts: 6.5,
  },
];

export const COUNSELORS: Counselor[] = [
  {
    id: "1",
    name: "Ganesh",
    initials: "G",
    color: "bg-blue-500",
    leads: 42,
    converted: 18,
    rate: 43,
  },
  {
    id: "2",
    name: "Meera",
    initials: "M",
    color: "bg-pink-500",
    leads: 38,
    converted: 15,
    rate: 39,
  },
  {
    id: "3",
    name: "Arjun",
    initials: "A",
    color: "bg-emerald-500",
    leads: 31,
    converted: 11,
    rate: 35,
  },
  {
    id: "4",
    name: "Divya",
    initials: "D",
    color: "bg-amber-500",
    leads: 24,
    converted: 7,
    rate: 29,
  },
];

export const TASKS: Task[] = [
  {
    id: "1",
    title: "Follow-up call",
    lead: "Priya Sharma",
    type: "call",
    time: "10:30 AM",
    urgent: true,
  },
  {
    id: "2",
    title: "Send brochure",
    lead: "Vikram Singh",
    type: "email",
    time: "12:00 PM",
    urgent: false,
  },
  {
    id: "3",
    title: "Discovery meeting",
    lead: "Sneha Patel",
    type: "meeting",
    time: "2:00 PM",
    urgent: true,
  },
  {
    id: "4",
    title: "IELTS counseling",
    lead: "Rahul Kumar",
    type: "call",
    time: "4:30 PM",
    urgent: false,
  },
];

export const statusBadge = (s: LeadStatus): string => {
  switch (s) {
    case "New":
      return "bg-blue-50 text-blue-600 border-blue-200";
    case "In Progress":
      return "bg-violet-50 text-violet-600 border-violet-200";
    case "Converted":
      return "bg-emerald-50 text-emerald-600 border-emerald-200";
    case "Lost":
      return "bg-rose-50 text-rose-600 border-rose-200";
  }
};

export const priorityBadge = (p: Priority): string => {
  switch (p) {
    case "Hot":
      return "bg-rose-50 text-rose-600";
    case "Warm":
      return "bg-amber-50 text-amber-600";
    case "Cold":
      return "bg-slate-100 text-slate-500";
  }
};
