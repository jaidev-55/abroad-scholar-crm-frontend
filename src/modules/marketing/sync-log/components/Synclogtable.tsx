import { useMemo } from "react";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useForm } from "react-hook-form";
import {
  RiSearchLine,
  RiDownloadLine,
  RiMetaLine,
  RiGoogleLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiFileCopyLine,
  RiAlertLine,
  RiExternalLinkLine,
  RiFilter3Line,
} from "react-icons/ri";
import CustomInput from "../../../../components/common/CustomInput";
import CustomSelect from "../../../../components/common/CustomSelect";
import { SYNC_STATUS_CONFIG } from "../types/Constants";
import type { SyncLogEntry } from "../types/Index";
import { formatMs, formatDateTime } from "../utils/Syncloghelpers";

interface Props {
  logs: SyncLogEntry[];
  loading?: boolean;
}

interface FilterForm {
  search: string;
  statusFilter: string;
  formFilter: string;
}

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "success":
      return <RiCheckboxCircleLine size={13} className="text-emerald-500" />;
    case "failed":
      return <RiCloseCircleLine size={13} className="text-red-500" />;
    case "duplicate":
      return <RiFileCopyLine size={13} className="text-amber-500" />;
    default:
      return <RiAlertLine size={13} className="text-blue-500" />;
  }
};

const SyncLogTable: React.FC<Props> = ({ logs, loading }) => {
  const {
    control,
    watch,
    formState: { errors },
  } = useForm<FilterForm>({
    defaultValues: {
      search: "",
      statusFilter: "all",
      formFilter: "all",
    },
  });

  const search = watch("search");
  const statusFilter = watch("statusFilter");
  const formFilter = watch("formFilter");

  const uniqueForms = useMemo(
    () => Array.from(new Set(logs.map((l) => l.formName))),
    [logs],
  );

  const filtered = useMemo(
    () =>
      logs.filter((l) => {
        const matchesSearch =
          !search ||
          l.leadName.toLowerCase().includes(search.toLowerCase()) ||
          l.leadPhone.includes(search);
        const matchesStatus =
          statusFilter === "all" || l.status === statusFilter;
        const matchesForm = formFilter === "all" || l.formName === formFilter;
        return matchesSearch && matchesStatus && matchesForm;
      }),
    [logs, search, statusFilter, formFilter],
  );

  const columns: ColumnsType<SyncLogEntry> = [
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 90,
      fixed: "left",
      render: (status: string) => {
        const cfg = SYNC_STATUS_CONFIG[status];
        return (
          <div className="flex items-center gap-1.5">
            <StatusIcon status={status} />
            <span className={`text-[10px] font-semibold ${cfg?.text}`}>
              {cfg?.label}
            </span>
          </div>
        );
      },
    },
    {
      title: "Lead",
      key: "lead",
      width: 160,
      render: (_, record) => (
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-slate-800 truncate">
            {record.leadName}
          </p>
          <p className="text-[10px] text-slate-400">{record.leadPhone}</p>
        </div>
      ),
    },
    {
      title: "Form",
      key: "form",
      width: 150,
      ellipsis: true,
      render: (_, record) => (
        <div className="flex items-center gap-1.5 min-w-0">
          {record.platform === "meta" ? (
            <RiMetaLine size={12} className="text-blue-600 shrink-0" />
          ) : (
            <RiGoogleLine size={12} className="text-red-500 shrink-0" />
          )}
          <span className="text-[11px] text-slate-600 truncate">
            {record.formName}
          </span>
        </div>
      ),
    },
    {
      title: "Counselor",
      dataIndex: "counselorAssigned",
      key: "counselor",
      width: 80,
      render: (v: string) => (
        <span
          className={`text-[11px] ${v === "—" ? "text-slate-300" : "text-slate-600"}`}
        >
          {v}
        </span>
      ),
    },
    {
      title: "Quality",
      dataIndex: "quality",
      key: "quality",
      width: 65,
      render: (q: string | null) =>
        q ? (
          <Tag
            className={`border-0 rounded-full text-[9px] font-semibold px-2 py-0 ${
              q === "Hot"
                ? "bg-rose-50 text-rose-600"
                : q === "Warm"
                  ? "bg-amber-50 text-amber-600"
                  : "bg-sky-50 text-sky-600"
            }`}
          >
            {q}
          </Tag>
        ) : (
          <span className="text-[10px] text-slate-300">—</span>
        ),
    },
    {
      title: "Response",
      dataIndex: "responseTime",
      key: "responseTime",
      width: 80,
      sorter: (a, b) => a.responseTime - b.responseTime,
      render: (ms: number) => {
        const color =
          ms > 2000
            ? "text-red-500"
            : ms > 1000
              ? "text-amber-500"
              : "text-emerald-500";
        return (
          <span className={`text-[11px] font-bold ${color}`}>
            {formatMs(ms)}
          </span>
        );
      },
    },
    {
      title: "Lead ID",
      dataIndex: "leadId",
      key: "leadId",
      width: 90,
      render: (v: string | undefined) =>
        v ? (
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono text-blue-600">{v}</span>
            <RiExternalLinkLine size={10} className="text-blue-400" />
          </div>
        ) : (
          <span className="text-[10px] text-slate-300">—</span>
        ),
    },
    {
      title: "Synced At",
      dataIndex: "syncedAt",
      key: "syncedAt",
      width: 130,
      sorter: (a, b) =>
        new Date(a.syncedAt).getTime() - new Date(b.syncedAt).getTime(),
      defaultSortOrder: "descend",
      render: (v: string) => (
        <span className="text-[10px] text-slate-500">{formatDateTime(v)}</span>
      ),
    },
    {
      title: "Error",
      dataIndex: "errorMessage",
      key: "error",
      width: 200,
      ellipsis: true,
      render: (v: string | undefined) =>
        v ? (
          <span className="text-[10px] text-red-500 leading-tight">{v}</span>
        ) : null,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Sync Activity Log
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {filtered.length} of {logs.length} entries
          </p>
        </div>

        <div className="flex items-center w-[50%] gap-5">
          <CustomInput
            name="search"
            placeholder="Search leads..."
            icon={<RiSearchLine size={13} className="text-slate-400" />}
            control={control}
            size="middle"
          />
          <CustomSelect
            name="statusFilter"
            control={control}
            errors={errors}
            size="middle"
            options={[
              { value: "all", label: "All Status" },
              { value: "success", label: "Success" },
              { value: "failed", label: "Failed" },
              { value: "duplicate", label: "Duplicate" },
              { value: "partial", label: "Partial" },
            ]}
            icon={<RiFilter3Line size={12} />}
          />
          <div className="w-[50%]">
            <CustomSelect
              name="formFilter"
              control={control}
              errors={errors}
              size="middle"
              options={[
                { value: "all", label: "All Forms" },
                ...uniqueForms.map((f) => ({ value: f, label: f })),
              ]}
            />
          </div>
          <div className=" ">
            <button className="flex items-center gap-1 px-3 py-[7px] text-[11px] font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200">
              <RiDownloadLine size={12} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <Table<SyncLogEntry>
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          size: "small",
          showTotal: (total) => (
            <span className="text-[10px] text-slate-400">{total} entries</span>
          ),
        }}
        scroll={{ x: 1100 }}
        size="small"
        rowClassName={(record) =>
          record.status === "failed"
            ? "bg-red-50/30 hover:bg-red-50/50"
            : record.status === "duplicate"
              ? "bg-amber-50/20 hover:bg-amber-50/40"
              : "hover:bg-slate-50/50"
        }
      />
    </div>
  );
};

export default SyncLogTable;
