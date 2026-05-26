import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { RiAlarmWarningLine, RiAddLine } from "react-icons/ri";
import { getAlerts } from "../api/Alertsapi";
import AlertLogFeed from "../components/Alertlogfeed";
import AlertStatsCards from "../components/Alertstatscards";
import CreateRuleModal from "../components/Createrulemodal";
import RuleTemplatesGrid from "../components/Ruletemplatesgrid";
import type { AlertRule, RuleTemplate } from "../types/Index";
import ActiveRulesList from "../components/Activeruleslist";

const MarketingAlertsPage = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["marketing-alerts"],
    queryFn: getAlerts,
    staleTime: 2 * 60 * 1000,
  });

  const [rules, setRules] = useState<AlertRule[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editValues, setEditValues] = useState<any>(null);

  // Sync data from query
  const activeRules = rules.length > 0 ? rules : (data?.rules ?? []);
  const activeLogs = logs.length > 0 ? logs : (data?.logs ?? []);

  const handleToggle = useCallback(
    (ruleId: string, active: boolean) => {
      setRules((prev) => {
        const base = prev.length > 0 ? prev : (data?.rules ?? []);
        return base.map((r) =>
          r.id === ruleId ? { ...r, isActive: active } : r,
        );
      });
    },
    [data],
  );

  const handleDelete = useCallback(
    (ruleId: string) => {
      setRules((prev) => {
        const base = prev.length > 0 ? prev : (data?.rules ?? []);
        return base.filter((r) => r.id !== ruleId);
      });
    },
    [data],
  );

  const handleEdit = useCallback((rule: AlertRule) => {
    setEditValues({
      name: rule.name,
      metric: rule.condition.metric,
      operator: rule.condition.operator,
      value: rule.condition.value,
      action: rule.action.type,
    });
    setModalMode("edit");
    setModalOpen(true);
  }, []);

  const handleTemplateSelect = useCallback((template: RuleTemplate) => {
    setEditValues({
      name: template.name,
      metric: template.defaultCondition.metric,
      operator: template.defaultCondition.operator,
      value: template.defaultCondition.value,
      action: template.defaultAction.type,
    });
    setModalMode("create");
    setModalOpen(true);
  }, []);

  const handleCreateNew = useCallback(() => {
    setEditValues(null);
    setModalMode("create");
    setModalOpen(true);
  }, []);

  const handleMarkRead = useCallback(
    (logId: string) => {
      setLogs((prev) => {
        const base = prev.length > 0 ? prev : (data?.logs ?? []);
        return base.map((l) => (l.id === logId ? { ...l, isRead: true } : l));
      });
    },
    [data],
  );

  const handleSave = useCallback(
    (_rule: any) => {
      // In production, this would call the API
      refetch();
    },
    [refetch],
  );

  return (
    <div className="space-y-4 pb-4">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
            <RiAlarmWarningLine size={18} className="text-rose-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Alerts & Rules</h1>
            <p className="text-xs text-slate-400">
              Set up automated alerts for budget, performance, and sync
              monitoring
            </p>
          </div>
        </div>

        <button
          onClick={handleCreateNew}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors cursor-pointer shadow-sm"
        >
          <RiAddLine size={15} />
          Create Rule
        </button>
      </div>

      {/* Stats */}
      <AlertStatsCards stats={data?.stats ?? ({} as any)} loading={isLoading} />

      {/* Rules + Alert history (side by side) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ActiveRulesList
          rules={activeRules}
          loading={isLoading}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
        <AlertLogFeed
          logs={activeLogs}
          loading={isLoading}
          onMarkRead={handleMarkRead}
        />
      </div>

      {/* Quick templates */}
      <RuleTemplatesGrid
        templates={data?.templates ?? []}
        loading={isLoading}
        onSelect={handleTemplateSelect}
      />

      {/* Create/Edit modal */}
      <CreateRuleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialValues={editValues}
        mode={modalMode}
      />
    </div>
  );
};

export default MarketingAlertsPage;
