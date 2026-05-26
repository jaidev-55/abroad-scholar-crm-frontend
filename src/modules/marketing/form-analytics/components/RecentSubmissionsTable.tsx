import { Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { RiCheckLine, RiCloseLine, RiTimeLine } from "react-icons/ri";
import { FaMeta } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import type { FormSubmission } from "../types";

interface Props {
  data: FormSubmission[];
  loading?: boolean;
}

const formatRelativeTime = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const columns: ColumnsType<FormSubmission> = [
  {
    title: "Lead",
    key: "lead",
    width: 180,
    render: (_, r) => (
      <div>
        <div className="text-xs font-semibold text-slate-800">{r.leadName}</div>
        <div className="text-[10px] text-slate-400 truncate">{r.leadEmail}</div>
      </div>
    ),
  },
  {
    title: "Form",
    dataIndex: "formName",
    key: "formName",
    width: 200,
    render: (name: string, r) => (
      <div className="flex items-center gap-1.5">
        {r.platform === "meta" ? (
          <FaMeta size={12} className="text-[#1877F2] shrink-0" />
        ) : (
          <FcGoogle size={12} className="shrink-0" />
        )}
        <span className="text-xs text-slate-600 truncate">{name}</span>
      </div>
    ),
  },
  {
    title: "Submitted",
    dataIndex: "submittedAt",
    key: "submittedAt",
    width: 100,
    sorter: (a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    defaultSortOrder: "ascend",
    render: (v: string) => (
      <Tooltip title={new Date(v).toLocaleString()}>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <RiTimeLine size={12} />
          {formatRelativeTime(v)}
        </div>
      </Tooltip>
    ),
  },
  {
    title: "Synced",
    dataIndex: "syncedToCrm",
    key: "syncedToCrm",
    width: 80,
    filters: [
      { text: "Synced", value: true },
      { text: "Not Synced", value: false },
    ],
    onFilter: (v, r) => r.syncedToCrm === v,
    render: (v: boolean) =>
      v ? (
        <Tag
          color="green"
          className="!m-0 !text-[10px] !px-1.5 !leading-4 flex items-center gap-0.5 w-fit"
        >
          <RiCheckLine size={11} /> Yes
        </Tag>
      ) : (
        <Tag
          color="red"
          className="!m-0 !text-[10px] !px-1.5 !leading-4 flex items-center gap-0.5 w-fit"
        >
          <RiCloseLine size={11} /> No
        </Tag>
      ),
  },
  {
    title: "Counselor",
    dataIndex: "assignedCounselor",
    key: "assignedCounselor",
    width: 110,
    render: (v?: string) =>
      v ? (
        <span className="text-xs text-slate-600">{v}</span>
      ) : (
        <span className="text-xs text-slate-300 italic">Unassigned</span>
      ),
  },
  {
    title: "Converted",
    dataIndex: "convertedToLead",
    key: "convertedToLead",
    width: 90,
    render: (v: boolean) => (
      <span
        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
          v ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"
        }`}
      >
        {v ? "Converted" : "Pending"}
      </span>
    ),
  },
];

const RecentSubmissionsTable: React.FC<Props> = ({ data, loading }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className="mb-3">
        <h3 className="text-sm font-bold text-slate-800">Recent Submissions</h3>
        <p className="text-[11px] text-slate-400">
          Latest form submissions across all campaigns
        </p>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        size="small"
        pagination={{ pageSize: 8, size: "small", showSizeChanger: false }}
        scroll={{ x: 800 }}
      />
    </div>
  );
};

export default RecentSubmissionsTable;
