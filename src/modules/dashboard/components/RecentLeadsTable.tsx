import React from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { HiOutlineGlobeAlt, HiOutlineUserGroup } from "react-icons/hi";
import type { RecentLead } from "../utils/constants";
import { statusBadge, priorityBadge } from "../utils/constants";

interface Props {
  leads: RecentLead[];
}

const columns: ColumnsType<RecentLead> = [
  {
    title: "Student",
    key: "name",
    render: (_, l) => (
      <div className="flex items-center gap-2.5">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${l.avatarBg} text-xs font-bold ${l.avatarText}`}
        >
          {l.initials}
        </div>
        <div>
          <div className="font-semibold text-slate-800">{l.name}</div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <span>{l.flag}</span>
            <HiOutlineGlobeAlt className="h-3 w-3" />
            {l.country}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Source",
    dataIndex: "source",
    key: "source",
    filters: [
      { text: "Instagram", value: "Instagram" },
      { text: "Facebook", value: "Facebook" },
      { text: "Website", value: "Website" },
      { text: "Referral", value: "Referral" },
    ],
    onFilter: (value, r) => r.source === value,
    render: (v, l) => (
      <span
        className={`rounded-md px-2 py-1 text-xs font-semibold ${l.sourceColor}`}
      >
        {v}
      </span>
    ),
  },
  {
    title: "Counselor",
    dataIndex: "counselor",
    key: "counselor",
    filters: [
      { text: "Ganesh", value: "Ganesh" },
      { text: "Meera", value: "Meera" },
      { text: "Arjun", value: "Arjun" },
    ],
    onFilter: (value, r) => r.counselor === value,
    render: (v) => (
      <div className="flex items-center gap-1 text-xs text-slate-600">
        <HiOutlineUserGroup className="h-3.5 w-3.5 text-slate-400" /> {v}
      </div>
    ),
  },
  {
    title: "IELTS",
    dataIndex: "ielts",
    key: "ielts",
    sorter: (a, b) => a.ielts - b.ielts,
    render: (v) => (
      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
        {v}
      </span>
    ),
  },
  {
    title: "Priority",
    dataIndex: "priority",
    key: "priority",
    filters: [
      { text: "🔥 Hot", value: "Hot" },
      { text: "Warm", value: "Warm" },
      { text: "Cold", value: "Cold" },
    ],
    onFilter: (value, r) => r.priority === value,
    render: (v) => (
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${priorityBadge(v)}`}
      >
        {v === "Hot" ? "🔥 " : ""}
        {v}
      </span>
    ),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    filters: [
      { text: "New", value: "New" },
      { text: "In Progress", value: "In Progress" },
      { text: "Converted", value: "Converted" },
      { text: "Lost", value: "Lost" },
    ],
    onFilter: (value, r) => r.status === value,
    render: (v) => (
      <span
        className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${statusBadge(v)}`}
      >
        {v}
      </span>
    ),
  },
  {
    title: "Created",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (v) => <span className="text-xs text-slate-500">{v}</span>,
  },
];

const RecentLeadsTable: React.FC<Props> = ({ leads }) => (
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
      dataSource={leads.map((l) => ({ ...l, key: l.id }))}
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

export default RecentLeadsTable;
