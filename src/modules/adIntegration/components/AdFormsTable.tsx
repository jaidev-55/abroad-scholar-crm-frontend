import React from "react";
import { Table, Tag, Tooltip, Switch, Popconfirm, Empty, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  RiDeleteBinLine,
  RiFileListLine,
  RiLinkM,
  RiShieldCheckLine,
  RiRefreshLine,
  RiAddLine,
  RiPlugLine,
} from "react-icons/ri";
import type { WebhookConfig } from "../../../api/webhook";
import { PLATFORM_CONFIG } from "../utils/constants";

interface Props {
  configs: WebhookConfig[];
  isLoading: boolean;
  togglePending: boolean;
  deletePending: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
  onAddNew: () => void;
}

const AdFormsTable: React.FC<Props> = ({
  configs,
  isLoading,
  togglePending,
  deletePending,
  onToggle,
  onDelete,
  onRefresh,
  onAddNew,
}) => {
  const columns: ColumnsType<WebhookConfig> = [
    {
      title: (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Platform
        </span>
      ),
      dataIndex: "platform",
      key: "platform",
      width: 200,
      render: (platform: string) => {
        const cfg = PLATFORM_CONFIG[platform];
        if (!cfg) return platform;
        const Icon = cfg.icon;
        return (
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center`}
            >
              <Icon size={16} className={cfg.color} />
            </div>
            <Tag color={cfg.tag} className="m-0 font-medium text-xs rounded-md">
              {cfg.label}
            </Tag>
          </div>
        );
      },
      filters: [
        { text: "Meta Ads", value: "META" },
        { text: "Google Ads", value: "GOOGLE" },
      ],
      onFilter: (value, record) => record.platform === value,
    },
    {
      title: (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Form Name
        </span>
      ),
      dataIndex: "formName",
      key: "formName",
      width: 200,
      align: "center",
      render: (name: string) => (
        <div className="flex items-center justify-center gap-2">
          <RiFileListLine size={14} className="text-slate-400 shrink-0" />
          <span className="font-medium text-slate-700 text-sm">{name}</span>
        </div>
      ),
    },
    {
      title: (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Form ID
        </span>
      ),
      dataIndex: "formId",
      key: "formId",
      width: 200,
      align: "center",
      render: (id: string) => (
        <Tooltip title="Click to copy" placement="top">
          <div className="flex justify-center">
            <button
              onClick={() => {
                navigator.clipboard.writeText(id);
                message.success("Form ID copied!");
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-md border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer group"
            >
              <RiLinkM
                size={12}
                className="text-slate-400 group-hover:text-blue-500 transition-colors"
              />
              <code className="text-xs text-slate-600 font-mono">
                {id.length > 20 ? `${id.slice(0, 20)}...` : id}
              </code>
            </button>
          </div>
        </Tooltip>
      ),
    },
    {
      title: (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Status
        </span>
      ),
      dataIndex: "isActive",
      key: "isActive",
      width: 120,
      align: "center",
      render: (isActive: boolean, record: WebhookConfig) => (
        <div className="flex items-center justify-center gap-2">
          <Switch
            checked={isActive}
            onChange={() => onToggle(record.id)}
            loading={togglePending}
            size="small"
            className={isActive ? "bg-emerald-500" : ""}
          />
          <span
            className={`text-xs font-medium ${isActive ? "text-emerald-600" : "text-slate-400"}`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>
      ),
      filters: [
        { text: "Active", value: true },
        { text: "Inactive", value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
    },
    {
      title: (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Added On
        </span>
      ),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 140,
      align: "center",
      render: (date: string) => (
        <span className="text-xs text-slate-500">
          {new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Action
        </span>
      ),
      key: "actions",
      width: 80,
      align: "center",
      render: (_: unknown, record: WebhookConfig) => (
        <div className="flex justify-center">
          <Popconfirm
            title="Remove this form?"
            description="Leads from this form will no longer sync to CRM."
            onConfirm={() => onDelete(record.id)}
            okText="Remove"
            cancelText="Cancel"
            okButtonProps={{ danger: true, loading: deletePending }}
          >
            <button className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all cursor-pointer">
              <RiDeleteBinLine size={16} />
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <RiShieldCheckLine size={16} className="text-slate-400" />
          <h2 className="text-sm font-bold text-slate-700">
            Connected Ad Forms
          </h2>
          <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full font-medium">
            {configs.length} total
          </span>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
        >
          <RiRefreshLine size={14} /> Refresh
        </button>
      </div>

      <Table
        columns={columns}
        dataSource={configs}
        rowKey="id"
        loading={isLoading}
        size="middle"
        pagination={
          configs.length > 10
            ? {
                pageSize: 10,
                showSizeChanger: false,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} forms`,
                className: "px-4",
              }
            : false
        }
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="text-center py-6">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <RiPlugLine size={24} className="text-slate-300" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600 mb-1">
                    No ad forms connected
                  </p>
                  <p className="text-xs text-slate-400 mb-4">
                    Connect your first Meta or Google ad form to start
                    auto-capturing leads.
                  </p>
                  <button
                    onClick={onAddNew}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <RiAddLine size={14} /> Connect Ad Form
                  </button>
                </div>
              }
            />
          ),
        }}
      />
    </div>
  );
};

export default AdFormsTable;
