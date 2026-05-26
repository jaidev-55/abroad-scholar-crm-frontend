import React from "react";
import { Table, Empty, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  RiPhoneLine,
  RiArrowGoBackLine,
  RiEyeLine,
  RiFireLine,
  RiFlashlightLine,
  RiSnowflakeLine,
} from "react-icons/ri";
import { UserAvatar, PriorityBadge, LostReasonBadge } from "./Badges";
import { daysSince, formatDate } from "../utils";
import type { LostLead, LostReason } from "../types";

interface LostLeadsTableProps {
  data: LostLead[];
  isLoading?: boolean;
  onView: (lead: LostLead) => void;
  onReactivate: (lead: LostLead) => void;
}

const LostLeadsTable: React.FC<LostLeadsTableProps> = ({
  data,
  isLoading,
  onView,
  onReactivate,
}) => {
  const columns: ColumnsType<LostLead> = [
    {
      title: "Student",
      dataIndex: "fullName",
      key: "fullName",
      width: 150,
      fixed: "left",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
      render: (fullName: string, record: LostLead) => (
        <button
          onClick={() => onView(record)}
          className="flex items-center gap-2.5 bg-transparent border-none cursor-pointer p-0 text-left w-full group"
        >
          <UserAvatar name={fullName} size="md" />
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-slate-900 group-hover:text-red-600 transition-colors truncate">
              {fullName}
            </div>
            <div className="text-[11px] text-slate-400">{record.country}</div>
          </div>
        </button>
      ),
    },

    {
      title: "Lost Reason",
      dataIndex: "lostReason",
      key: "lostReason",
      width: 150,
      align: "center",
      onFilter: (val, r) => r.lostReason === val,
      render: (reason: LostReason) => <LostReasonBadge reasonValue={reason} />,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: 60,
      align: "center",
      filters: [
        {
          text: (
            <span className="flex items-center gap-1 text-red-600 font-semibold">
              <RiFireLine size={12} /> Hot
            </span>
          ),
          value: "HOT",
        },
        {
          text: (
            <span className="flex items-center gap-1 text-amber-600 font-semibold">
              <RiFlashlightLine size={12} /> Warm
            </span>
          ),
          value: "WARM",
        },
        {
          text: (
            <span className="flex items-center gap-1 text-blue-600 font-semibold">
              <RiSnowflakeLine size={12} /> Cold
            </span>
          ),
          value: "COLD",
        },
      ],
      onFilter: (val, r) => r.priority === val,
      render: (p: string) => <PriorityBadge priority={p} />,
    },
    {
      title: "Counselor",
      key: "counselor",
      width: 100,
      align: "center",
      render: (_: unknown, record: LostLead) => (
        <span className="text-[13px] text-slate-600">
          {record.counselor?.name ?? "Unassigned"}
        </span>
      ),
    },
    {
      title: "Lost Date",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 90,
      align: "center",
      sorter: (a, b) =>
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
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
      key: "attempts",
      width: 80,
      align: "center",
      sorter: (a, b) => a._count.callLogs - b._count.callLogs,
      render: (_: unknown, record: LostLead) => {
        const a = record._count.callLogs;
        return (
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
        );
      },
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
                onReactivate(record);
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
                onView(record);
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
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden min-w-0">
      <Table<LostLead>
        dataSource={data}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) =>
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
        onRow={(record) => ({
          onClick: () => onView(record),
          style: { cursor: "pointer" },
        })}
      />
    </div>
  );
};

export default LostLeadsTable;
