/* eslint-disable react-hooks/incompatible-library */
import { useMemo } from "react";
import { Table, Tag, Input, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useForm, Controller } from "react-hook-form";
import { RiSearchLine, RiFilter3Line, RiDownloadLine } from "react-icons/ri";
import type { AuditLogEntry } from "../types";
import { AUDIT_CATEGORY_CONFIG } from "../utils/Constants";

interface Props {
  logs: AuditLogEntry[];
  loading?: boolean;
}

interface FilterForm {
  search: string;
  category: string;
}

const AuditSection: React.FC<Props> = ({ logs, loading }) => {
  const { control, watch } = useForm<FilterForm>({
    defaultValues: { search: "", category: "all" },
  });

  const search = watch("search");
  const category = watch("category");

  const filtered = useMemo(
    () =>
      logs.filter((l) => {
        const matchesSearch =
          !search ||
          l.user.toLowerCase().includes(search.toLowerCase()) ||
          l.target.toLowerCase().includes(search.toLowerCase()) ||
          l.details.toLowerCase().includes(search.toLowerCase());
        const matchesCat = category === "all" || l.category === category;
        return matchesSearch && matchesCat;
      }),
    [logs, search, category],
  );

  const columns: ColumnsType<AuditLogEntry> = [
    {
      title: "Time",
      dataIndex: "timestamp",
      key: "timestamp",
      width: 140,
      sorter: (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      defaultSortOrder: "descend",
      render: (v: string) => (
        <span className="text-[11px] text-slate-500">
          {new Date(v).toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      width: 100,
      render: (v: string) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-[9px] font-bold text-blue-600">
            {v.charAt(0)}
          </div>
          <span className="text-[11px] font-semibold text-slate-800">{v}</span>
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 90,
      render: (v: string) => (
        <span className="text-[11px] font-medium text-slate-700">{v}</span>
      ),
    },
    {
      title: "Target",
      dataIndex: "target",
      key: "target",
      width: 160,
      render: (v: string) => (
        <span className="text-[11px] text-slate-600">{v}</span>
      ),
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      ellipsis: true,
      render: (v: string) => (
        <span className="text-[10px] text-slate-500">{v}</span>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 100,
      render: (cat: string) => {
        const cfg = AUDIT_CATEGORY_CONFIG[cat];
        return (
          <Tag
            className={`${cfg?.bg} ${cfg?.text} border-0 rounded-full text-[9px] font-semibold px-2 py-0 capitalize`}
          >
            {cat}
          </Tag>
        );
      },
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Audit Log</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Track all system changes and user actions
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Controller
            name="search"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Search logs..."
                prefix={<RiSearchLine size={13} className="text-slate-400" />}
                size="middle"
                allowClear
                className="w-44"
                style={{ borderRadius: 10, fontSize: 12 }}
              />
            )}
          />
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={[
                  { value: "all", label: "All Categories" },
                  { value: "lead", label: "Lead" },
                  { value: "user", label: "User" },
                  { value: "settings", label: "Settings" },
                  { value: "marketing", label: "Marketing" },
                ]}
                size="middle"
                className="w-36"
                suffixIcon={
                  <RiFilter3Line size={12} className="text-slate-400" />
                }
                style={{ borderRadius: 10, fontSize: 12 }}
              />
            )}
          />
          <button className="flex items-center gap-1.5 px-3 py-[5px] text-[11px] font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200">
            <RiDownloadLine size={12} />
            Export
          </button>
        </div>
      </div>

      <Table<AuditLogEntry>
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 15,
          size: "small",
          showTotal: (t) => (
            <span className="text-[10px] text-slate-400">{t} entries</span>
          ),
        }}
        size="small"
        rowClassName={() => "hover:bg-slate-50/50 transition-colors"}
      />
    </div>
  );
};

export default AuditSection;
