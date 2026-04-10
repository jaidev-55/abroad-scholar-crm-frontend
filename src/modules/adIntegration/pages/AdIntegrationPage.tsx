import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RiAddLine } from "react-icons/ri";
import AdStatsRow from "../components/AdStatsRow";
import HowItWorks from "../components/HowItWorks";
import AdFormsTable from "../components/AdFormsTable";
import WebhookEndpoints from "../components/WebhookEndpoints";
import ConnectFormModal from "../components/ConnectFormModal";
import {
  addConfig,
  deleteConfig,
  fetchConfigs,
  toggleConfig,
  type CreateWebhookConfigPayload,
} from "../../../api/webhook";

const API_BASE = import.meta.env.VITE_API_BASE_URL as string;
const GOOGLE_TOKEN = import.meta.env.VITE_GOOGLE_WEBHOOK_TOKEN as string;

const AdIntegrationPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: configs = [], isLoading } = useQuery({
    queryKey: ["webhook-configs"],
    queryFn: fetchConfigs,
  });

  const addMutation = useMutation({
    mutationFn: addConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhook-configs"] });
      setModalOpen(false);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleConfig,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["webhook-configs"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteConfig,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["webhook-configs"] }),
  });

  const handleSubmit = (data: CreateWebhookConfigPayload) =>
    addMutation.mutate(data);

  return (
    <div className="p-3 mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 tracking-tight leading-none mb-1">
            Ad Integration
          </h1>
          <p className="text-[13px] text-slate-400">
            Connect your Meta & Google ad forms to auto-capture leads into your
            CRM pipeline.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-blue-200 hover:shadow-md cursor-pointer shrink-0"
        >
          <RiAddLine size={18} /> Connect Ad Form
        </button>
      </div>

      <AdStatsRow configs={configs} />

      <HowItWorks />

      <AdFormsTable
        configs={configs}
        isLoading={isLoading}
        togglePending={toggleMutation.isPending}
        deletePending={deleteMutation.isPending}
        onToggle={(id) => toggleMutation.mutate(id)}
        onDelete={(id) => deleteMutation.mutate(id)}
        onRefresh={() =>
          queryClient.invalidateQueries({ queryKey: ["webhook-configs"] })
        }
        onAddNew={() => setModalOpen(true)}
      />

      <WebhookEndpoints apiBase={API_BASE} googleToken={GOOGLE_TOKEN} />

      <ConnectFormModal
        open={modalOpen}
        isPending={addMutation.isPending}
        isError={addMutation.isError}
        errorMessage={
          (addMutation.error as { response?: { data?: { message?: string } } })
            ?.response?.data?.message
        }
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default AdIntegrationPage;
