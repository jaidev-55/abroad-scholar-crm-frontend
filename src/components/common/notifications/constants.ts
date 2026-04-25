import {
  RiCalendarCheckLine,
  RiUserAddLine,
  RiTimeLine,
  RiFireLine,
} from "react-icons/ri";
import type { Notif } from "./types";

// ─── Type Config ──────────────────────────────────────────────────────────────

export const TYPE_CFG = {
  followup: {
    icon: RiCalendarCheckLine,
    bg: "bg-amber-50",
    color: "text-amber-700",
    dot: "bg-amber-400",
    border: "border-amber-100",
    bar: "#f59e0b",
    pill: "bg-amber-50 text-amber-700",
    label: "Follow-up Due",
  },
  new_lead: {
    icon: RiUserAddLine,
    bg: "bg-blue-50",
    color: "text-blue-700",
    dot: "bg-blue-500",
    border: "border-blue-100",
    bar: "#3b82f6",
    pill: "bg-blue-50 text-blue-700",
    label: "New Lead",
  },
  overdue: {
    icon: RiTimeLine,
    bg: "bg-red-50",
    color: "text-red-700",
    dot: "bg-red-500",
    border: "border-red-100",
    bar: "#ef4444",
    pill: "bg-red-50 text-red-700",
    label: "Overdue",
  },
  hot: {
    icon: RiFireLine,
    bg: "bg-orange-50",
    color: "text-orange-700",
    dot: "bg-orange-400",
    border: "border-orange-100",
    bar: "#f97316",
    pill: "bg-orange-50 text-orange-700",
    label: "Hot Lead",
  },
} as const;

// ─── Demo Data ────────────────────────────────────────────────────────────────

export const DEMO_NOTIFICATIONS: Notif[] = [
  {
    id: "d1",
    type: "overdue",
    title: "Overdue: Aarav Mehta",
    subtitle: "Follow-up was due 3 days ago — UK visa",
    time: new Date(Date.now() - 3 * 86400000).toISOString(),
    read: false,
    priority: "high",
  },
  {
    id: "d2",
    type: "hot",
    title: "Hot lead: Priya Sharma",
    subtitle: "Needs immediate attention — Canada IELTS",
    time: new Date(Date.now() - 45 * 60000).toISOString(),
    read: false,
    priority: "high",
  },
  {
    id: "d3",
    type: "followup",
    title: "Follow-up today: Rohit Verma",
    subtitle: "Scheduled for today — Australia application",
    time: new Date(Date.now() - 2 * 3600000).toISOString(),
    read: false,
    priority: "medium",
  },
  {
    id: "d4",
    type: "new_lead",
    title: "New lead: Sneha Iyer",
    subtitle: "From Meta Ads — Germany inquiry",
    time: new Date(Date.now() - 20 * 60000).toISOString(),
    read: false,
    priority: "low",
  },
  {
    id: "d5",
    type: "new_lead",
    title: "New lead: Karan Malhotra",
    subtitle: "From Instagram — UK inquiry",
    time: new Date(Date.now() - 5 * 60000).toISOString(),
    read: true,
    priority: "low",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const timeAgo = (d: string): string => {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const day = Math.floor(h / 24);
  if (day > 0) return `${day}d ago`;
  if (h > 0) return `${h}h ago`;
  if (m > 0) return `${m}m ago`;
  return "Just now";
};
