"use client";

import React, { useState } from "react";
import { Table, Tag, Tooltip, Switch, Popconfirm, Empty, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  RiAddLine,
  RiDeleteBinLine,
  RiGlobalLine,
  RiShieldCheckLine,
  RiInformationLine,
  RiMetaLine,
  RiGoogleLine,
  RiCloseLine,
  RiLinkM,
  RiFileListLine,
  RiCheckLine,
  RiRefreshLine,
  RiSignalTowerLine,
  RiPlugLine,
} from "react-icons/ri";

import CustomInput from "../../components/common/CustomInput";
import CustomSelect from "../../components/common/CustomSelect";
import CustomModal from "../../components/common/CustomModal";
import StatCard from "../../components/common/StatsCard";
import {
  fetchConfigs,
  addConfig,
  toggleConfig,
  deleteConfig,
} from "../../api/webhook";
import type {
  WebhookConfig,
  CreateWebhookConfigPayload,
} from "../../api/webhook";

// ─── Platform Config ─────────────────────────────────
const platformConfig: Record<
  string,
  {
    icon: React.ElementType;
    color: string;
    bg: string;
    border: string;
    tag: string;
    label: string;
  }
> = {
  META: {
    icon: RiMetaLine,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    tag: "blue",
    label: "Meta Ads",
  },
  GOOGLE: {
    icon: RiGoogleLine,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    tag: "green",
    label: "Google Ads",
  },
};

// ─── Component ───────────────────────────────────────
const AdIntegrationPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateWebhookConfigPayload>({
    defaultValues: { platform: "", formId: "", formName: "" },
  });

  // ─── Queries ─────────────────────────────────────
  const { data: configs = [], isLoading } = useQuery({
    queryKey: ["webhook-configs"],
    queryFn: fetchConfigs,
  });

  const addMutation = useMutation({
    mutationFn: addConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhook-configs"] });
      setIsModalOpen(false);
      reset();
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleConfig,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["webhook-configs"] }),
  });

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const GOOGLE_TOKEN = import.meta.env.VITE_GOOGLE_WEBHOOK_TOKEN;

  const deleteMutation = useMutation({
    mutationFn: deleteConfig,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["webhook-configs"] }),
  });

  // ─── Derived Stats ──────────────────────────────
  const totalForms = configs.length;
  const activeForms = configs.filter((c) => c.isActive).length;
  const metaForms = configs.filter((c) => c.platform === "META").length;
  const googleForms = configs.filter((c) => c.platform === "GOOGLE").length;

  // ─── Table Columns ──────────────────────────────
  const columns: ColumnsType<WebhookConfig> = [
    {
      title: "Platform",
      dataIndex: "platform",
      key: "platform",
      width: 200,
      render: (platform: string) => {
        const config = platformConfig[platform];
        if (!config) return platform;
        const Icon = config.icon;
        return (
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}
            >
              <Icon size={16} className={config.color} />
            </div>
            <Tag
              color={config.tag}
              className="m-0 font-medium text-xs rounded-md"
            >
              {config.label}
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
      title: "Form Name",
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
      title: "Form ID",
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
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 120,
      align: "center",
      render: (isActive: boolean, record: WebhookConfig) => (
        <div className="flex items-center justify-center gap-2">
          <Switch
            checked={isActive}
            onChange={() => toggleMutation.mutate(record.id)}
            loading={toggleMutation.isPending}
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
      title: "Added On",
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
      title: "Action",
      key: "actions",
      width: 60,
      align: "center",
      render: (_: unknown, record: WebhookConfig) => (
        <div className="flex justify-center">
          <Popconfirm
            title="Remove this form?"
            description="Leads from this form will no longer sync to CRM."
            onConfirm={() => deleteMutation.mutate(record.id)}
            okText="Remove"
            cancelText="Cancel"
            okButtonProps={{
              danger: true,
              loading: deleteMutation.isPending,
            }}
          >
            <button className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all cursor-pointer">
              <RiDeleteBinLine size={16} />
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  // ─── Submit Handler ─────────────────────────────
  const onSubmit = (data: CreateWebhookConfigPayload) => {
    addMutation.mutate(data);
  };

  return (
    <div className="p-5 mx-auto space-y-6">
      {/* ─── Header ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-800">Ad Integration</h1>
          </div>
          <p className="text-sm text-slate-500">
            Connect your Meta & Google ad forms to auto-capture leads into your
            CRM pipeline.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-blue-200 hover:shadow-md hover:shadow-blue-200 cursor-pointer shrink-0"
        >
          <RiAddLine size={18} />
          Connect Ad Form
        </button>
      </div>

      {/* ─── Stats ───────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Total Forms"
          value={totalForms}
          icon={RiFileListLine}
          twIconBg="bg-slate-100"
          twIconText="text-slate-600"
          twBarBg="bg-slate-400"
        />
        <StatCard
          label="Active"
          value={activeForms}
          icon={RiSignalTowerLine}
          twIconBg="bg-emerald-50"
          twIconText="text-emerald-600"
          twBarBg="bg-emerald-400"
        />
        <StatCard
          label="Meta Forms"
          value={metaForms}
          icon={RiMetaLine}
          twIconBg="bg-blue-50"
          twIconText="text-blue-600"
          twBarBg="bg-blue-400"
        />
        <StatCard
          label="Google Forms"
          value={googleForms}
          icon={RiGoogleLine}
          twIconBg="bg-amber-50"
          twIconText="text-amber-600"
          twBarBg="bg-amber-400"
        />
      </div>

      {/* ─── How it Works ────────────────────────── */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-100 p-5">
        <div className="flex items-center gap-2 mb-3">
          <RiInformationLine size={16} className="text-blue-600" />
          <h3 className="text-sm font-bold text-slate-700">How it works</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              step: "1",
              icon: RiAddLine,
              title: "Add your Form ID",
              desc: "Get the Form ID from Meta/Google Ads Manager and add it here.",
            },
            {
              step: "2",
              icon: RiSignalTowerLine,
              title: "Webhook auto-syncs",
              desc: "When someone fills your ad form, the lead is auto-created in CRM.",
            },
            {
              step: "3",
              icon: RiCheckLine,
              title: "Round-robin assigned",
              desc: "Each lead is auto-assigned to the next counselor in rotation.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-start gap-3 bg-white/60 rounded-xl p-3.5 border border-white"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {item.step}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  {item.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Table ───────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <RiShieldCheckLine size={16} className="text-slate-400" />
            <h2 className="text-sm font-bold text-slate-700">
              Connected Ad Forms
            </h2>
            <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full font-medium">
              {totalForms} total
            </span>
          </div>
          <button
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["webhook-configs"] })
            }
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
          >
            <RiRefreshLine size={14} />
            Refresh
          </button>
        </div>

        <Table
          columns={columns}
          dataSource={configs}
          rowKey="id"
          loading={isLoading}
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
                      onClick={() => setIsModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      <RiAddLine size={14} />
                      Connect Ad Form
                    </button>
                  </div>
                }
              />
            ),
          }}
          className="ad-integration-table"
          size="middle"
        />
      </div>

      {/* ─── Webhook URLs Info ────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <RiGlobalLine size={16} className="text-slate-400" />
          <h3 className="text-sm font-bold text-slate-700">
            Webhook Endpoints
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              platform: "META",
              label: "Meta Webhook URL",
              url: `${API_BASE}/webhooks/meta`,
            },
            {
              platform: "GOOGLE",
              label: "Google Webhook URL",
              url: `${API_BASE}/webhooks/google?token=${GOOGLE_TOKEN}`,
            },
          ].map((item) => {
            const config = platformConfig[item.platform];
            const Icon = config.icon;
            return (
              <div
                key={item.platform}
                className={`flex items-start gap-3 p-3.5 rounded-xl border ${config.border} ${config.bg}`}
              >
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
                  <Icon size={16} className={config.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-600 mb-1">
                    {item.label}
                  </p>
                  <Tooltip title="Click to copy">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(item.url);
                        message.success("Webhook URL copied!");
                      }}
                      className="w-full text-left cursor-pointer"
                    >
                      <code className="text-xs text-slate-500 bg-white/80 px-2 py-1 rounded-md border border-slate-200/50 block truncate">
                        {item.url}
                      </code>
                    </button>
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Add Form Modal ──────────────────────── */}
      <CustomModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <RiAddLine size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Connect Ad Form
              </h3>
              <p className="text-xs text-slate-500">
                Add a Meta or Google ad form to auto-capture leads.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsModalOpen(false);
              reset();
            }}
            className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <RiCloseLine size={18} className="text-slate-400" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <CustomSelect
            name="platform"
            label="Ad Platform"
            placeholder="Select platform"
            control={control}
            errors={errors}
            rules={{ required: "Please select a platform" }}
            icon={<RiGlobalLine size={14} />}
            options={[
              {
                value: "META",
                label: (
                  <span className="flex items-center gap-2">
                    <RiMetaLine size={14} className="text-blue-600" />
                    Meta Ads (Facebook / Instagram)
                  </span>
                ),
              },
              {
                value: "GOOGLE",
                label: (
                  <span className="flex items-center gap-2">
                    <RiGoogleLine size={14} className="text-emerald-600" />
                    Google Ads (Lead Form Extensions)
                  </span>
                ),
              },
            ]}
          />

          <CustomInput
            name="formId"
            label="Form ID"
            placeholder="e.g. 123456789012345"
            control={control}
            rules={{
              required: "Form ID is required",
              minLength: {
                value: 3,
                message: "Form ID must be at least 3 characters",
              },
            }}
            icon={<RiLinkM size={14} className="text-slate-400" />}
          />

          <CustomInput
            name="formName"
            label="Form Name"
            placeholder="e.g. UK Student Intake 2026"
            control={control}
            rules={{ required: "Form name is required" }}
            icon={<RiFileListLine size={14} className="text-slate-400" />}
          />

          {/* Help text */}
          <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
            <RiInformationLine
              size={14}
              className="text-amber-500 shrink-0 mt-0.5"
            />
            <p className="text-xs text-amber-700 leading-relaxed">
              You can find the Form ID in your{" "}
              <strong>Meta Ads Manager → Lead Forms</strong> or{" "}
              <strong>Google Ads → Lead Form Extensions</strong>. Only leads
              from active forms will be synced to your CRM.
            </p>
          </div>

          {/* Error Display */}
          {addMutation.isError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-100">
              <RiCloseLine size={14} className="text-red-500 shrink-0" />
              <p className="text-xs text-red-600">
                {(addMutation.error as any)?.response?.data?.message ||
                  "Failed to add form. Please try again."}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                reset();
              }}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addMutation.isPending}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
            >
              {addMutation.isPending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <RiCheckLine size={16} />
                  Connect Form
                </>
              )}
            </button>
          </div>
        </form>
      </CustomModal>
    </div>
  );
};

export default AdIntegrationPage;
