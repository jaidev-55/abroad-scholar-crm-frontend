import React from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { HiOutlineGlobeAlt, HiOutlineUserGroup } from "react-icons/hi";
import type { RecentLeadItem } from "../api/dashboard";
import {
  statusBadge,
  priorityBadge,
  type LeadStatus,
} from "../utils/constants";
import type { LeadPriority } from "../../leadsPipeline/types/lead";

// ─── Derived display helpers (replaces old mock fields) ───────────────────────

const AVATAR_COLORS = [
  { bg: "bg-blue-100", text: "text-blue-700" },
  { bg: "bg-pink-100", text: "text-pink-700" },
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-purple-100", text: "text-purple-700" },
];

const SOURCE_COLORS: Record<string, string> = {
  INSTAGRAM: "bg-pink-50 text-pink-600",
  FACEBOOK: "bg-blue-50 text-blue-600",
  WEBSITE: "bg-emerald-50 text-emerald-600",
  REFERRAL: "bg-amber-50 text-amber-600",
  WALK_IN: "bg-purple-50 text-purple-600",
  GOOGLE_ADS: "bg-red-50 text-red-600",
  META_ADS: "bg-cyan-50 text-cyan-600",
  GOOGLE_SHEET: "bg-slate-100 text-slate-600",
};

const SOURCE_LABEL: Record<string, string> = {
  INSTAGRAM: "Instagram",
  FACEBOOK: "Facebook",
  WEBSITE: "Website",
  REFERRAL: "Referral",
  WALK_IN: "Walk In",
  GOOGLE_ADS: "Google Ads",
  META_ADS: "Meta Ads",
  GOOGLE_SHEET: "Google Sheet",
};

// Enrich each lead with display-only fields so columns stay unchanged
type EnrichedLead = RecentLeadItem & {
  _avatarBg: string;
  _avatarText: string;
  _sourceColor: string;
  _sourceLabel: string;
  _counselorName: string;
};

const enrich = (lead: RecentLeadItem, index: number): EnrichedLead => {
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return {
    ...lead,
    _avatarBg: color.bg,
    _avatarText: color.text,
    _sourceColor: SOURCE_COLORS[lead.source] ?? "bg-slate-100 text-slate-600",
    _sourceLabel: SOURCE_LABEL[lead.source] ?? lead.source,
    _counselorName: lead.counselor?.name ?? "Unassigned",
  };
};

// ─── Columns (UI identical to original) ──────────────────────────────────────

const columns: ColumnsType<EnrichedLead> = [
  {
    title: "Student",
    key: "name",
    render: (_, l) => (
      <div className="flex items-center gap-2.5">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${l._avatarBg} text-xs font-bold ${l._avatarText}`}
        >
          {l.initials}
        </div>
        <div>
          <div className="font-semibold text-slate-800">{l.fullName}</div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <HiOutlineGlobeAlt className="h-3 w-3" />
            {l.country ?? "—"}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Source",
    dataIndex: "source",
    key: "source",
    filters: Object.entries(SOURCE_LABEL).map(([v, t]) => ({
      text: t,
      value: v,
    })),
    onFilter: (value, r) => r.source === value,
    render: (_, l) => (
      <span
        className={`rounded-md px-2 py-1 text-xs font-semibold ${l._sourceColor}`}
      >
        {l._sourceLabel}
      </span>
    ),
  },
  {
    title: "Counselor",
    key: "counselor",
    render: (_, l) => (
      <div className="flex items-center gap-1 text-xs text-slate-600">
        <HiOutlineUserGroup className="h-3.5 w-3.5 text-slate-400" />{" "}
        {l._counselorName}
      </div>
    ),
  },
  {
    title: "IELTS",
    dataIndex: "ieltsScore",
    key: "ieltsScore",
    sorter: (a, b) => (a.ieltsScore ?? 0) - (b.ieltsScore ?? 0),
    render: (v: number | null) => (
      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
        {v ?? "—"}
      </span>
    ),
  },
  {
    title: "Priority",
    dataIndex: "priority",
    key: "priority",
    filters: [
      { text: "🔥 Hot", value: "HOT" },
      { text: "Warm", value: "WARM" },
      { text: "Cold", value: "COLD" },
    ],
    onFilter: (value, r) => r.priority === value,
    render: (v: string) => (
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${priorityBadge(v as LeadPriority)}`}
      >
        {v === "HOT" ? "🔥 " : ""}
        {v.charAt(0) + v.slice(1).toLowerCase()}
      </span>
    ),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    filters: [
      { text: "New", value: "NEW" },
      { text: "In Progress", value: "IN_PROGRESS" },
      { text: "Converted", value: "CONVERTED" },
      { text: "Lost", value: "LOST" },
    ],
    onFilter: (value, r) => r.status === value,
    render: (v: string) => (
      <span
        className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${statusBadge(v as LeadStatus)}`}
      >
        {v === "IN_PROGRESS"
          ? "In Progress"
          : v.charAt(0) + v.slice(1).toLowerCase()}
      </span>
    ),
  },
  {
    title: "Created",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (v: string) => (
      <span className="text-xs text-slate-500">
        {new Date(v).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </span>
    ),
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  leads: RecentLeadItem[];
}

const RecentLeadsTable: React.FC<Props> = ({ leads }) => {
  const enriched = leads.map(enrich);
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Recent Leads</h3>
          <p className="text-xs text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">{leads.length}</span>{" "}
            leads
          </p>
        </div>
        <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">
          View all →
        </button>
      </div>
      <Table
        columns={columns}
        dataSource={enriched.map((l) => ({ ...l, key: l.id }))}
        size="small"
        pagination={{
          pageSize: 8,
          showSizeChanger: false,
          showTotal: (total) => `${total} leads`,
        }}
        locale={{ emptyText: "No leads match the selected filters" }}
      />
    </div>
  );
};

export default RecentLeadsTable;
