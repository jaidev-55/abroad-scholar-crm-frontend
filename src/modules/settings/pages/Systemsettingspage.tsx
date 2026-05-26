import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  RiSettings3Line,
  RiKanbanView,
  RiUserSettingsLine,
  RiNotification3Line,
  RiLink,
  RiMailLine,
  RiDatabase2Line,
  RiFileList3Line,
} from "react-icons/ri";
import { getSettings } from "../api/Settingsapi";
import AssignmentSection from "../components/Assignmentsection";
import AuditSection from "../components/Auditsection";
import DataSection from "../components/Datasection";
import EmailSection from "../components/Emailsectio";
import GeneralSection from "../components/Generalsection";
import NotificationsSection from "../components/Notificationssection";
import PipelineSection from "../components/Pipelinesection";
import WebhooksSection from "../components/Webhookssection";
import type { SettingsTab } from "../types";


const TABS: {
  key: SettingsTab;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}[] = [
  { key: "general", label: "General", icon: RiSettings3Line },
  { key: "pipeline", label: "Pipeline & Leads", icon: RiKanbanView },
  { key: "assignment", label: "Assignment Rules", icon: RiUserSettingsLine },
  { key: "notifications", label: "Notifications", icon: RiNotification3Line },
  { key: "webhooks", label: "Webhooks & API", icon: RiLink },
  { key: "email", label: "Email Templates", icon: RiMailLine },
  { key: "data", label: "Data & Export", icon: RiDatabase2Line },
  { key: "audit", label: "Audit Log", icon: RiFileList3Line },
];

const SystemSettingsPage = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  const { data, isLoading } = useQuery({
    queryKey: ["system-settings"],
    queryFn: getSettings,
    staleTime: 5 * 60 * 1000,
  });

  const renderContent = () => {
    if (isLoading || !data) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse"
            >
              <div className="h-5 w-40 bg-slate-200 rounded mb-4" />
              <div className="h-20 bg-slate-50 rounded-xl" />
            </div>
          ))}
        </div>
      );
    }

    switch (activeTab) {
      case "general":
        return <GeneralSection data={data.general} />;
      case "pipeline":
        return (
          <PipelineSection
            stages={data.pipelineStages}
            categories={data.categories}
            qualities={data.qualities}
            countries={data.countries}
          />
        );
      case "assignment":
        return <AssignmentSection rules={data.assignmentRules} />;
      case "notifications":
        return <NotificationsSection notifications={data.notifications} />;
      case "webhooks":
        return <WebhooksSection webhooks={data.webhooks} />;
      case "email":
        return (
          <EmailSection templates={data.emailTemplates} smtp={data.smtp} />
        );
      case "data":
        return <DataSection />;
      case "audit":
        return <AuditSection logs={data.auditLogs} loading={isLoading} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
          <RiSettings3Line size={18} className="text-slate-600" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900">System Settings</h1>
          <p className="text-xs text-slate-400">
            Configure your CRM preferences, pipeline, notifications, and
            integrations
          </p>
        </div>
      </div>

      {/* Layout: Sidebar tabs + Content */}
      <div className="flex gap-4">
        {/* Sidebar navigation */}
        <div className="hidden md:block w-56 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-100 p-2 sticky top-20">
            <nav className="space-y-0.5">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer text-left ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={isActive ? "text-blue-500" : "text-slate-400"}
                    />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Mobile tab bar */}
        <div className="md:hidden w-full">
          <div className="bg-white rounded-2xl border border-slate-100 p-1.5 mb-4 overflow-x-auto">
            <div className="flex gap-0.5 min-w-max">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <Icon size={13} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 min-w-0">{renderContent()}</div>
      </div>
    </div>
  );
};

export default SystemSettingsPage;
