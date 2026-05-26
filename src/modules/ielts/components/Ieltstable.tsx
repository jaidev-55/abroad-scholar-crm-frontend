import React from "react";
import { Table, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { RiEyeLine, RiPencilLine, RiArrowUpLine } from "react-icons/ri";
import type { IeltsRecord } from "../Types";
import { daysUntilExam, formatDate, meetsTarget } from "../utils/Helpers";
import IeltsStatusTag from "./Ieltsstatustag";
import ScoreBadge from "./Scorebadge";


interface IeltsTableProps {
  data: IeltsRecord[];
  loading?: boolean;
  onView: (record: IeltsRecord) => void;
  onEdit: (record: IeltsRecord) => void;
  onUpdateScore: (record: IeltsRecord) => void;
}

const IeltsTable: React.FC<IeltsTableProps> = ({
  data,
  loading,
  onView,
  onEdit,
  onUpdateScore,
}) => {
  const columns: ColumnsType<IeltsRecord> = [
    {
      title: "Student",
      dataIndex: "studentName",
      key: "studentName",
      width: 160,
      sorter: (a, b) => a.studentName.localeCompare(b.studentName),
      render: (name: string, record) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0 uppercase">
            {name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-slate-800 leading-tight truncate">
              {name}
            </p>
            <p className="text-[10px] text-slate-400">{record.country}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      filters: [
        { text: "Not Started", value: "Not Started" },
        { text: "Preparing", value: "Preparing" },
        { text: "Scheduled", value: "Scheduled" },
        { text: "Completed", value: "Completed" },
        { text: "Cancelled", value: "Cancelled" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: IeltsRecord["status"]) => (
        <IeltsStatusTag status={status} />
      ),
    },
    {
      title: "Type",
      dataIndex: "examType",
      key: "examType",
      width: 90,
      render: (type: string) => (
        <span
          className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md whitespace-nowrap ${
            type === "Academic"
              ? "bg-violet-50 text-violet-600"
              : "bg-teal-50 text-teal-600"
          }`}
        >
          {type === "General Training" ? "General" : type}
        </span>
      ),
    },
    {
      title: "Exam Date",
      dataIndex: "examDate",
      key: "examDate",
      width: 100,
      sorter: (a, b) =>
        new Date(a.examDate ?? 0).getTime() -
        new Date(b.examDate ?? 0).getTime(),
      render: (date: string | null) => {
        const days = daysUntilExam(date);
        return (
          <div>
            <p className="text-[12px] text-slate-700 whitespace-nowrap">
              {formatDate(date)}
            </p>
            {days !== null && days >= 0 && (
              <p
                className={`text-[10px] font-semibold ${
                  days <= 7
                    ? "text-red-500"
                    : days <= 14
                      ? "text-amber-500"
                      : "text-slate-400"
                }`}
              >
                {days === 0 ? "Today!" : `${days}d away`}
              </p>
            )}
          </div>
        );
      },
    },
    {
      title: "L",
      key: "listening",
      width: 55,
      align: "center" as const,
      render: (_: unknown, record: IeltsRecord) => (
        <ScoreBadge
          score={record.currentScore?.listening ?? null}
          target={record.targetScore.listening}
          size="sm"
        />
      ),
    },
    {
      title: "R",
      key: "reading",
      width: 55,
      align: "center" as const,
      render: (_: unknown, record: IeltsRecord) => (
        <ScoreBadge
          score={record.currentScore?.reading ?? null}
          target={record.targetScore.reading}
          size="sm"
        />
      ),
    },
    {
      title: "W",
      key: "writing",
      width: 55,
      align: "center" as const,
      render: (_: unknown, record: IeltsRecord) => (
        <ScoreBadge
          score={record.currentScore?.writing ?? null}
          target={record.targetScore.writing}
          size="sm"
        />
      ),
    },
    {
      title: "S",
      key: "speaking",
      width: 55,
      align: "center" as const,
      render: (_: unknown, record: IeltsRecord) => (
        <ScoreBadge
          score={record.currentScore?.speaking ?? null}
          target={record.targetScore.speaking}
          size="sm"
        />
      ),
    },
    {
      title: "Overall",
      key: "overall",
      width: 80,
      align: "center" as const,
      sorter: (a, b) =>
        (a.currentScore?.overall ?? 0) - (b.currentScore?.overall ?? 0),
      render: (_: unknown, record: IeltsRecord) => (
        <ScoreBadge
          score={record.currentScore?.overall ?? null}
          target={record.targetScore.overall}
          size="md"
          showBand
        />
      ),
    },
    {
      title: "Target",
      key: "target",
      width: 55,
      align: "center" as const,
      render: (_: unknown, record: IeltsRecord) => (
        <span className="text-[12px] font-bold text-slate-500">
          {record.targetScore.overall.toFixed(1)}
        </span>
      ),
    },
    {
      title: "Gap",
      key: "gap",
      width: 60,
      align: "center" as const,
      render: (_: unknown, record: IeltsRecord) => {
        const met = meetsTarget(record.currentScore, record.targetScore);
        if (!record.currentScore)
          return <span className="text-[10px] text-slate-300">—</span>;
        return met ? (
          <span className="inline-flex items-center text-[9px] font-semibold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-full whitespace-nowrap">
            ✓ Met
          </span>
        ) : (
          <span className="inline-flex items-center text-[9px] font-semibold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-full whitespace-nowrap">
            ↑ Gap
          </span>
        );
      },
    },
    {
      title: "Counselor",
      dataIndex: "counselor",
      key: "counselor",
      width: 100,
      render: (name: string) => (
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-500 uppercase shrink-0">
            {name?.[0]}
          </div>
          <span className="text-[11px] text-slate-600 truncate">{name}</span>
        </div>
      ),
    },
    {
      title: "Att.",
      dataIndex: "attempts",
      key: "attempts",
      width: 45,
      align: "center" as const,
      render: (val: number) => (
        <span className="text-[12px] font-medium text-slate-600">{val}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 90,
      align: "center" as const,
      render: (_: unknown, record: IeltsRecord) => (
        <div className="flex items-center justify-center gap-0">
          <Tooltip title="View">
            <button
              onClick={() => onView(record)}
              className="p-1 rounded-md hover:bg-slate-100 transition-colors"
            >
              <RiEyeLine size={14} className="text-slate-400" />
            </button>
          </Tooltip>
          <Tooltip title="Edit">
            <button
              onClick={() => onEdit(record)}
              className="p-1 rounded-md hover:bg-slate-100 transition-colors"
            >
              <RiPencilLine size={14} className="text-slate-400" />
            </button>
          </Tooltip>
          <Tooltip title="Update Score">
            <button
              onClick={() => onUpdateScore(record)}
              className="p-1 rounded-md hover:bg-blue-50 transition-colors"
            >
              <RiArrowUpLine size={14} className="text-blue-400" />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        scroll={{ x: "max-content" }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => (
            <span className="text-[12px] text-slate-400">
              {range[0]}–{range[1]} of {total}
            </span>
          ),
        }}
        size="small"
      />
    </div>
  );
};

export default IeltsTable;
