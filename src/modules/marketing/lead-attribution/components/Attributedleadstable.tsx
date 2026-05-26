import { useMemo } from "react";
import { Table, Tag, Input, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useForm, Controller } from "react-hook-form";
import {
  RiSearchLine,
  RiDownloadLine,
  RiMetaLine,
  RiGoogleLine,
  RiGlobalLine,
  RiUserLine,
  RiChat1Line,
  RiFilter3Line,
} from "react-icons/ri";
import type { AttributedLead } from "../types";
import {
  PIPELINE_CONFIG,
  QUALITY_CONFIG,
  SOURCE_CONFIG,
} from "../types/Constants";
import { formatDateTime } from "../utils/Leadattributionhelpers";

interface Props {
  leads: AttributedLead[];
  loading?: boolean;
}

interface FilterForm {
  search: string;
  sourceFilter: string;
  statusFilter: string;
}

const SourceIcon = ({ source }: { source: string }) => {
  switch (source) {
    case "META_ADS":
      return <RiMetaLine size={13} className="text-blue-600" />;
    case "GOOGLE_ADS":
      return <RiGoogleLine size={13} className="text-red-500" />;
    case "WEBSITE":
      return <RiGlobalLine size={13} className="text-emerald-500" />;
    default:
      return <RiUserLine size={13} className="text-slate-400" />;
  }
};

const AttributedLeadsTable: React.FC<Props> = ({ leads, loading }) => {
  const { control, watch } = useForm<FilterForm>({
    defaultValues: {
      search: "",
      sourceFilter: "all",
      statusFilter: "all",
    },
  });

  const search = watch("search");
  const sourceFilter = watch("sourceFilter");
  const statusFilter = watch("statusFilter");

  const filtered = useMemo(
    () =>
      leads.filter((l) => {
        const matchesSearch =
          !search ||
          l.name.toLowerCase().includes(search.toLowerCase()) ||
          l.phone.includes(search) ||
          (l.campaignName || "").toLowerCase().includes(search.toLowerCase());
        const matchesSource =
          sourceFilter === "all" || l.source === sourceFilter;
        const matchesStatus =
          statusFilter === "all" || l.pipelineStatus === statusFilter;
        return matchesSearch && matchesSource && matchesStatus;
      }),
    [leads, search, sourceFilter, statusFilter],
  );

  const columns: ColumnsType<AttributedLead> = [
    {
      title: "Lead",
      key: "lead",
      fixed: "left",
      width: 170,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-600 shrink-0">
            {record.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-slate-800 truncate max-w-[110px]">
              {record.name}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {record.phone}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
      width: 100,
      render: (source: string) => {
        const cfg = SOURCE_CONFIG[source];
        return (
          <div className="flex items-center gap-1.5">
            <SourceIcon source={source} />
            <span
              className={`text-[10px] font-semibold ${cfg?.text || "text-slate-500"}`}
            >
              {cfg?.label || source}
            </span>
          </div>
        );
      },
    },
    {
      title: "Campaign / Form",
      key: "campaign",
      width: 150,
      ellipsis: true,
      render: (_, record) => (
        <div className="min-w-0">
          {record.campaignName ? (
            <>
              <p className="text-[11px] font-semibold text-slate-700 truncate">
                {record.campaignName}
              </p>
              {record.formName && (
                <p className="text-[10px] text-slate-400 truncate">
                  {record.formName}
                </p>
              )}
            </>
          ) : (
            <span className="text-[10px] text-slate-400 italic">
              No campaign
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "pipelineStatus",
      key: "pipelineStatus",
      width: 90,
      filters: [
        { text: "New", value: "New" },
        { text: "In Progress", value: "In Progress" },
        { text: "Converted", value: "Converted" },
        { text: "Lost", value: "Lost" },
      ],
      onFilter: (value, record) => record.pipelineStatus === value,
      render: (status: string) => {
        const cfg = PIPELINE_CONFIG[status];
        return (
          <Tag
            className={`${cfg?.bg || "bg-slate-100"} ${cfg?.text || "text-slate-500"} border-0 rounded-full text-[10px] font-semibold px-2 py-0.5`}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Quality",
      dataIndex: "quality",
      key: "quality",
      width: 70,
      filters: [
        { text: "Hot", value: "Hot" },
        { text: "Warm", value: "Warm" },
        { text: "Cold", value: "Cold" },
      ],
      onFilter: (value, record) => record.quality === value,
      render: (quality: string) => {
        const cfg = QUALITY_CONFIG[quality];
        return (
          <Tag
            className={`${cfg?.bg || "bg-slate-100"} ${cfg?.text || "text-slate-500"} border-0 rounded-full text-[10px] font-semibold px-2 py-0.5`}
          >
            {quality}
          </Tag>
        );
      },
    },
    {
      title: "Counselor",
      dataIndex: "counselor",
      key: "counselor",
      width: 80,
      render: (v: string) => (
        <span className="text-[11px] text-slate-600">{v}</span>
      ),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      width: 85,
      render: (v: string) => (
        <span className="text-[11px] text-slate-600">{v}</span>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 80,
      render: (v: string) => (
        <Tag className="bg-purple-50 text-purple-600 border-0 rounded-full text-[10px] font-semibold px-2 py-0.5">
          {v}
        </Tag>
      ),
    },
    {
      title: "Days",
      dataIndex: "daysInPipeline",
      key: "daysInPipeline",
      width: 55,
      sorter: (a, b) => a.daysInPipeline - b.daysInPipeline,
      render: (v: number) => {
        const color =
          v > 14
            ? "text-red-500"
            : v > 7
              ? "text-amber-500"
              : "text-emerald-500";
        return <span className={`text-[11px] font-bold ${color}`}>{v}d</span>;
      },
    },
    {
      title: "Captured",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 110,
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (v: string) => (
        <span className="text-[10px] text-slate-500">{formatDateTime(v)}</span>
      ),
    },
    {
      title: "",
      dataIndex: "notes",
      key: "notes",
      width: 40,
      render: (v: number) =>
        v > 0 ? (
          <div className="flex items-center gap-0.5">
            <RiChat1Line size={11} className="text-slate-400" />
            <span className="text-[10px] text-slate-500">{v}</span>
          </div>
        ) : null,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Attributed Leads</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {filtered.length} of {leads.length} leads
          </p>
        </div>

        {/* Inline filters using Controller — no labels */}
        <div className="flex items-center gap-2 flex-wrap">
          <Controller
            name="search"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Search leads..."
                prefix={<RiSearchLine size={13} className="text-slate-400" />}
                size="middle"
                allowClear
                className="w-44"
                style={{ borderRadius: 10, fontSize: 12 }}
              />
            )}
          />
          <Controller
            name="sourceFilter"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={[
                  { value: "all", label: "All Sources" },
                  { value: "META_ADS", label: "Meta Ads" },
                  { value: "GOOGLE_ADS", label: "Google Ads" },
                  { value: "WEBSITE", label: "Website" },
                  { value: "REFERRAL", label: "Referral" },
                  { value: "MANUAL", label: "Manual" },
                ]}
                size="middle"
                className="w-32"
                suffixIcon={
                  <RiFilter3Line size={12} className="text-slate-400" />
                }
                style={{ borderRadius: 10, fontSize: 12 }}
              />
            )}
          />
          <Controller
            name="statusFilter"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={[
                  { value: "all", label: "All Statuses" },
                  { value: "New", label: "New" },
                  { value: "In Progress", label: "In Progress" },
                  { value: "Converted", label: "Converted" },
                  { value: "Lost", label: "Lost" },
                ]}
                size="middle"
                className="w-32"
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

      {/* Table */}
      <Table<AttributedLead>
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 15,
          showSizeChanger: true,
          pageSizeOptions: ["10", "15", "25", "50"],
          size: "small",
          showTotal: (total) => (
            <span className="text-[10px] text-slate-400">{total} leads</span>
          ),
        }}
        scroll={{ x: 1100 }}
        size="small"
        className="attribution-table"
        rowClassName={() => "hover:bg-slate-50/50 transition-colors"}
      />
    </div>
  );
};

export default AttributedLeadsTable;
