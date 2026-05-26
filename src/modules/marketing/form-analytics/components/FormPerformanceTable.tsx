import { Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { RiExternalLinkLine } from "react-icons/ri";
import { FaMeta } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import type { FormPerformanceRow, FormStatus } from "../types";

interface Props {
  data: FormPerformanceRow[];
  loading?: boolean;
}

const statusConfig: Record<FormStatus, { color: string; label: string }> = {
  active: { color: "green", label: "Active" },
  paused: { color: "orange", label: "Paused" },
  archived: { color: "default", label: "Archived" },
};

const columns: ColumnsType<FormPerformanceRow> = [
  {
    title: "Form",
    dataIndex: "formName",
    key: "formName",
    fixed: "left",
    width: 240,
    render: (name: string, row) => (
      <div className="flex items-center gap-2">
        {row.platform === "meta" ? (
          <FaMeta size={14} className="text-[#1877F2] shrink-0" />
        ) : (
          <FcGoogle size={14} className="shrink-0" />
        )}
        <div className="min-w-0">
          <div className="text-xs font-semibold text-slate-800 truncate">
            {name}
          </div>
          <div className="text-[10px] text-slate-400 truncate">
            {row.campaignName}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 90,
    render: (status: FormStatus) => {
      const cfg = statusConfig[status];
      return (
        <Tag color={cfg.color} className="text-[10px] !m-0 !px-2">
          {cfg.label}
        </Tag>
      );
    },
    filters: [
      { text: "Active", value: "active" },
      { text: "Paused", value: "paused" },
    ],
    onFilter: (v, r) => r.status === v,
  },
  {
    title: "Submissions",
    dataIndex: "submissions",
    key: "submissions",
    width: 100,
    sorter: (a, b) => a.submissions - b.submissions,
    render: (v: number) => (
      <span className="text-xs font-bold text-slate-800">
        {v.toLocaleString()}
      </span>
    ),
  },
  {
    title: "Unique Leads",
    dataIndex: "uniqueLeads",
    key: "uniqueLeads",
    width: 110,
    sorter: (a, b) => a.uniqueLeads - b.uniqueLeads,
    render: (v: number) => (
      <span className="text-xs text-slate-700">{v.toLocaleString()}</span>
    ),
  },
  {
    title: "Sync Rate",
    dataIndex: "syncRate",
    key: "syncRate",
    width: 120,
    sorter: (a, b) => a.syncRate - b.syncRate,
    render: (v: number) => (
      <div className="flex items-center gap-1.5">
        <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${v}%`,
              backgroundColor:
                v >= 95 ? "#10b981" : v >= 90 ? "#f59e0b" : "#ef4444",
            }}
          />
        </div>
        <span className="text-[11px] text-slate-600">{v}%</span>
      </div>
    ),
  },
  {
    title: "Conv. Rate",
    dataIndex: "conversionRate",
    key: "conversionRate",
    width: 100,
    sorter: (a, b) => a.conversionRate - b.conversionRate,
    render: (v: number) => (
      <span
        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          v >= 35
            ? "bg-emerald-50 text-emerald-600"
            : v >= 25
              ? "bg-blue-50 text-blue-600"
              : "bg-amber-50 text-amber-600"
        }`}
      >
        {v}%
      </span>
    ),
  },
  {
    title: "Avg. Response",
    dataIndex: "avgResponseTime",
    key: "avgResponseTime",
    width: 110,
    sorter: (a, b) => a.avgResponseTime - b.avgResponseTime,
    render: (v: number) => (
      <Tooltip title="Average time before first counselor contact">
        <span
          className={`text-xs font-medium ${
            v <= 15
              ? "text-emerald-600"
              : v <= 30
                ? "text-amber-600"
                : "text-rose-500"
          }`}
        >
          {v} min
        </span>
      </Tooltip>
    ),
  },
  {
    title: "Cost / Lead",
    dataIndex: "costPerLead",
    key: "costPerLead",
    width: 100,
    sorter: (a, b) => a.costPerLead - b.costPerLead,
    render: (v: number) => (
      <span className="text-xs text-slate-700 font-medium">
        ₹{v.toFixed(0)}
      </span>
    ),
  },
  {
    title: "",
    key: "action",
    width: 40,
    render: () => (
      <button className="text-slate-300 hover:text-blue-500 transition-colors">
        <RiExternalLinkLine size={14} />
      </button>
    ),
  },
];

const FormPerformanceTable: React.FC<Props> = ({ data, loading }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className="mb-3">
        <h3 className="text-sm font-bold text-slate-800">Form Performance</h3>
        <p className="text-[11px] text-slate-400">
          Detailed breakdown by ad form
        </p>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="formId"
        loading={loading}
        size="small"
        pagination={{ pageSize: 10, size: "small", showSizeChanger: false }}
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

export default FormPerformanceTable;
