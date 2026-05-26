import { useState } from "react";
import { Table, Input, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  RiSearchLine,
  RiMetaLine,
  RiGoogleLine,
  RiDownloadLine,
} from "react-icons/ri";
import type { CampaignRow } from "../types";
import { formatCurrency, formatNumber } from "../utils/spendRoiHelpers";
import { STATUS_COLORS } from "../data/constants";

interface Props {
  campaigns: CampaignRow[];
  loading?: boolean;
  onSelectCampaign?: (id: string) => void;
}

const CampaignTable: React.FC<Props> = ({
  campaigns,
  loading,
  onSelectCampaign,
}) => {
  const [search, setSearch] = useState("");

  const filtered = campaigns.filter((c) =>
    c.campaignName.toLowerCase().includes(search.toLowerCase()),
  );

  const columns: ColumnsType<CampaignRow> = [
    {
      title: "Campaign",
      dataIndex: "campaignName",
      key: "campaignName",
      fixed: "left",
      width: 220,
      sorter: (a, b) => a.campaignName.localeCompare(b.campaignName),
      render: (name: string, record) => (
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              record.platform === "meta" ? "bg-blue-50" : "bg-red-50"
            }`}
          >
            {record.platform === "meta" ? (
              <RiMetaLine size={14} className="text-blue-600" />
            ) : (
              <RiGoogleLine size={14} className="text-red-500" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">
              {name}
            </p>
            <p className="text-[10px] text-slate-400 capitalize">
              {record.platform} ads
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      filters: [
        { text: "Active", value: "active" },
        { text: "Paused", value: "paused" },
        { text: "Completed", value: "completed" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: string) => {
        const colors = STATUS_COLORS[status] || STATUS_COLORS.completed;
        return (
          <Tag
            className={`${colors.bg} ${colors.text} border-0 rounded-full text-[10px] font-semibold px-2.5 py-0.5 capitalize`}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Spend",
      dataIndex: "spend",
      key: "spend",
      width: 110,
      sorter: (a, b) => a.spend - b.spend,
      render: (v: number) => (
        <span className="text-xs font-bold text-slate-800">
          {formatCurrency(v)}
        </span>
      ),
    },
    {
      title: "Impressions",
      dataIndex: "impressions",
      key: "impressions",
      width: 110,
      sorter: (a, b) => a.impressions - b.impressions,
      render: (v: number) => (
        <span className="text-xs text-slate-600">{formatNumber(v)}</span>
      ),
    },
    {
      title: "Clicks",
      dataIndex: "clicks",
      key: "clicks",
      width: 90,
      sorter: (a, b) => a.clicks - b.clicks,
      render: (v: number) => (
        <span className="text-xs text-slate-600">{formatNumber(v)}</span>
      ),
    },
    {
      title: "CTR",
      dataIndex: "ctr",
      key: "ctr",
      width: 80,
      sorter: (a, b) => a.ctr - b.ctr,
      render: (v: number) => (
        <span className="text-xs text-slate-600">{v.toFixed(2)}%</span>
      ),
    },
    {
      title: "Leads",
      dataIndex: "leads",
      key: "leads",
      width: 80,
      sorter: (a, b) => a.leads - b.leads,
      render: (v: number) => (
        <span className="text-xs font-bold text-purple-600">{v}</span>
      ),
    },
    {
      title: "CPL",
      dataIndex: "cpl",
      key: "cpl",
      width: 90,
      sorter: (a, b) => a.cpl - b.cpl,
      render: (v: number) => (
        <span className="text-xs font-semibold text-amber-600">
          {formatCurrency(v)}
        </span>
      ),
    },
    {
      title: "Conv.",
      dataIndex: "conversions",
      key: "conversions",
      width: 70,
      sorter: (a, b) => a.conversions - b.conversions,
      render: (v: number) => (
        <span className="text-xs font-bold text-emerald-600">{v}</span>
      ),
    },
    {
      title: "Conv. Rate",
      dataIndex: "conversionRate",
      key: "conversionRate",
      width: 100,
      sorter: (a, b) => a.conversionRate - b.conversionRate,
      render: (v: number) => (
        <div className="flex items-center gap-2">
          <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full"
              style={{ width: `${Math.min(v * 10, 100)}%` }}
            />
          </div>
          <span className="text-xs text-slate-600">{v}%</span>
        </div>
      ),
    },
    {
      title: "Cost / Conv.",
      dataIndex: "costPerConversion",
      key: "costPerConversion",
      width: 120,
      sorter: (a, b) => a.costPerConversion - b.costPerConversion,
      render: (v: number) => (
        <span className="text-xs font-semibold text-rose-600">
          {formatCurrency(v)}
        </span>
      ),
    },
    ...(onSelectCampaign
      ? [
          {
            title: "",
            key: "action",
            width: 70,
            fixed: "right" as const,
            render: (_: unknown, record: CampaignRow) => (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCampaign(record.id);
                }}
                className="text-[11px] font-semibold text-blue-500 hover:text-blue-700 cursor-pointer px-2 py-1 rounded-md hover:bg-blue-50 transition-colors"
              >
                View
              </button>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Campaign Performance
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {filtered.length} campaign{filtered.length !== 1 ? "s" : ""} ·
            sorted by spend
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Input
            placeholder="Search campaigns..."
            prefix={<RiSearchLine size={14} className="text-slate-400" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48"
            size="middle"
            allowClear
            style={{ borderRadius: 10, fontSize: 12 }}
          />
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200">
            <RiDownloadLine size={13} />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <Table<CampaignRow>
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        loading={loading}
        onRow={(record) => ({
          onClick: () => onSelectCampaign?.(record.id),
          style: { cursor: onSelectCampaign ? "pointer" : "default" },
        })}
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          showTotal: (total) => (
            <span className="text-xs text-slate-400">
              {total} total campaigns
            </span>
          ),
        }}
        scroll={{ x: 1200 }}
        size="small"
        className="spend-roi-table"
        rowClassName={() => "hover:bg-slate-50/50 transition-colors"}
      />
    </div>
  );
};

export default CampaignTable;
