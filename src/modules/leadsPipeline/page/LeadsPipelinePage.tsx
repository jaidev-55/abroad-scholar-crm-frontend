import { useEffect, useMemo, useState } from "react";
import { message, Spin } from "antd";
import {
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PipelineHeader from "../components/PipelineHeader";
import PipelineStats from "../components/PipelineStats";
import PipelineBoard from "../components/PipelineBoard";
import FilterBar from "../components/FilterBar";
import ViewLeadDrawer from "../drawers/ViewLeadDrawer";
import EditLeadDrawer from "../drawers/EditLeadDrawer";
import LeadNotesDrawer from "../drawers/LeadNotesDrawer";
import LeadModal from "../modals/LeadModal";
import LostLeadModal from "../modals/LostLeadModal";
import ExportModal from "../modals/ExportModal";
import GoogleSheetsImportModal from "../modals/GoogleSheetsImportModal";
import SendEmailModal from "../modals/SendEmailModal";

import type { Lead, Note, DateRangeValue } from "../types/lead";
import {
  getLeads,
  updateLead,
  markLeadAsLost,
  type ApiLead,
  type LeadStatus,
  type PipelineStatusApi,
} from "../api/leads";
import { getUsers } from "../../../api/auth";
import { STAGES } from "../utils/constants";
import { todayString } from "../utils/dateUtils";
import { apiLeadToLocal } from "../types/Transformlead";
import CallModal from "../modals/call/CallModal";
import { getIsAdmin } from "../../../utils/getStoredUser";
import { useSearchParams } from "react-router-dom";

const STAGE_TO_STATUS: Record<string, LeadStatus> = {
  new: "NEW",
  progress: "IN_PROGRESS",
  applied: "IN_PROGRESS",
  converted: "CONVERTED",
  lost: "LOST",
};

const LeadsPipelinePage = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [counselorFilter, setCounselorFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [pipelineStatusFilter, setPipelineStatusFilter] = useState<
    PipelineStatusApi | ""
  >(""); // ← new
  const [dateRange, setDateRange] = useState<DateRangeValue>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addModalDefaultStage, setAddModalDefaultStage] = useState<string>();
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [lostModalLead, setLostModalLead] = useState<Lead | null>(null);
  const [notesDrawerLead, setNotesDrawerLead] = useState<Lead | null>(null);
  const [viewDrawerLead, setViewDrawerLead] = useState<Lead | null>(null);
  const [editDrawerLead, setEditDrawerLead] = useState<Lead | null>(null);
  const [callModalLead, setCallModalLead] = useState<Lead | null>(null);
  const [emailModalLead, setEmailModalLead] = useState<Lead | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewDrawerInitialTab, setViewDrawerInitialTab] = useState<
    "notes" | "details" | "activity"
  >("notes");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overStageId, setOverStageId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );
  const isAdmin = getIsAdmin();

  const queryKey = [
    "leads",
    search,
    sourceFilter,
    counselorFilter,
    countryFilter,
    priorityFilter,
    pipelineStatusFilter, // ← new
    dateRange?.[0]?.format("YYYY-MM-DD") ?? null,
    dateRange?.[1]?.format("YYYY-MM-DD") ?? null,
  ] as const;

  const {
    data: rawLeads = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () =>
      getLeads({
        search: search || undefined,
        source: sourceFilter || undefined,
        country: countryFilter || undefined,
        priority: priorityFilter ? priorityFilter.toUpperCase() : undefined,
        pipelineStatus:
          (pipelineStatusFilter as PipelineStatusApi) || undefined, // ← new
        followUpFrom: dateRange?.[0]?.format("YYYY-MM-DD"),
        followUpTo: dateRange?.[1]?.format("YYYY-MM-DD"),
      }),
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const leads: Lead[] = useMemo(() => rawLeads.map(apiLeadToLocal), [rawLeads]);

  // counselor + category filtered client-side (no API param needed)
  const filteredLeads = useMemo(() => {
    let list = leads;
    if (counselorFilter)
      list = list.filter((l) => l.counselor === counselorFilter);
    if (categoryFilter)
      list = list.filter((l) => l.category === categoryFilter);
    return list;
  }, [leads, counselorFilter, categoryFilter]);

  const stats = useMemo(() => {
    const today = todayString();
    return {
      total: filteredLeads.length,
      newToday: filteredLeads.filter((l) => l.createdAt === today).length,
      followUpsDue: filteredLeads.filter(
        (l) => l.followUp && l.followUp <= today,
      ).length,
      converted: filteredLeads.filter((l) => l.stage === "converted").length,
      lost: filteredLeads.filter((l) => l.stage === "lost").length,
      academic: filteredLeads.filter((l) => l.category === "ACADEMIC").length,
      admission: filteredLeads.filter((l) => l.category === "ADMISSION").length,
    };
  }, [filteredLeads]);

  const { data: counselorUsers = [] } = useQuery({
    queryKey: ["counselors"],
    queryFn: () => getUsers("COUNSELOR"),
    staleTime: 5 * 60 * 1000,
  });

  const { mutate: moveLeadMutation } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeadStatus }) =>
      updateLead(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      message.success("Lead moved successfully!");
    },
    onError: (error: unknown) => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      const e = error as { response?: { data?: { message?: string } } };
      message.error(e?.response?.data?.message || "Failed to move lead.");
    },
  });

  const { mutate: markLostMutation } = useMutation({
    mutationFn: ({
      id,
      reason,
      notes,
    }: {
      id: string;
      reason: string;
      notes: string;
    }) =>
      markLeadAsLost(id, {
        lostReason: reason,
        additionalNotes: notes || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      message.success("Lead marked as lost.");
    },
    onError: (error: unknown) => {
      const e = error as { response?: { data?: { message?: string } } };
      message.error(
        e?.response?.data?.message || "Failed to mark lead as lost.",
      );
    },
  });

  const { mutate: addNoteMutation } = useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) =>
      updateLead(id, { notes: [{ content: text }] }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: () => {
      message.error("Failed to save note. Please try again.");
    },
  });

  const handleDragStart = (e: DragStartEvent) =>
    setActiveId(e.active.id as string);

  const handleDragOver = (e: DragOverEvent) => {
    const { over } = e;
    if (!over) return;
    const overId = over.id as string;
    const stage = STAGES.find((s) => s.id === overId);
    if (stage) {
      setOverStageId(stage.id);
    } else {
      const lead = leads.find((l) => l.id === overId);
      if (lead) setOverStageId(lead.stage);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveId(null);
    setOverStageId(null);
    if (!over) return;

    const overId = over.id as string;
    const stage = STAGES.find((s) => s.id === overId);
    const leadOver = leads.find((l) => l.id === overId);
    const newStage = stage?.id ?? leadOver?.stage;
    if (!newStage) return;

    const movingLead = leads.find((l) => l.id === active.id);
    if (!movingLead || movingLead.stage === newStage) return;

    const newStatus = STAGE_TO_STATUS[newStage];
    if (!newStatus) return;

    if (newStage === "lost") {
      setLostModalLead(movingLead);
      return;
    }

    queryClient.setQueryData<ApiLead[]>(
      queryKey,
      (old) =>
        old?.map((l) =>
          l.id === active.id
            ? { ...l, status: newStatus, updatedAt: new Date().toISOString() }
            : l,
        ) ?? [],
    );
    moveLeadMutation({ id: active.id as string, status: newStatus });
  };

  useEffect(() => {
    if (isLoading || leads.length === 0) return;
    const leadId = searchParams.get("leadId");
    if (!leadId) return;

    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    setTimeout(() => {
      setViewDrawerInitialTab("details");
      setViewDrawerLead(lead);
      searchParams.delete("leadId");
      setSearchParams(searchParams, { replace: true });
    }, 100);
  }, [leads, isLoading, searchParams]);

  const handleAddNote = (leadId: string, text: string) => {
    if (notesDrawerLead?.id === leadId) {
      const optimisticNote: Note = {
        id: `note-optimistic-${Date.now()}`,
        text,
        createdAt: new Date().toISOString(),
        author: notesDrawerLead.counselor || "Admin",
      };
      setNotesDrawerLead((prev) =>
        prev ? { ...prev, notes: [...prev.notes, optimisticNote] } : prev,
      );
    }
    addNoteMutation({ id: leadId, text });
  };

  const handleSaveLost = (leadId: string, reason: string, notes: string) =>
    markLostMutation({ id: leadId, reason, notes });

  const handleSaveLead = () => {
    queryClient.invalidateQueries({ queryKey: ["leads"] });
    setAddModalOpen(false);
    setAddModalDefaultStage(undefined);
  };

  const clearFilters = () => {
    setSearch("");
    setSourceFilter("");
    setCounselorFilter("");
    setCountryFilter("");
    setPriorityFilter("");
    setCategoryFilter("");
    setPipelineStatusFilter(""); // ← new
    setDateRange(null);
  };

  const hasFilters = !!(
    search ||
    sourceFilter ||
    counselorFilter ||
    countryFilter ||
    priorityFilter ||
    categoryFilter ||
    pipelineStatusFilter || // ← new
    dateRange
  );

  const handleMoveTo = (leadId: string, stageId: string) => {
    const newStatus = STAGE_TO_STATUS[stageId];
    if (!newStatus) return;
    queryClient.setQueryData<ApiLead[]>(
      queryKey,
      (old) =>
        old?.map((l) =>
          l.id === leadId
            ? { ...l, status: newStatus, updatedAt: new Date().toISOString() }
            : l,
        ) ?? [],
    );
    moveLeadMutation({ id: leadId, status: newStatus });
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full py-32 text-slate-400">
        <p className="text-sm">
          Failed to load leads. Please refresh and try again.
        </p>
      </div>
    );
  }

  return (
    <>
      {isRefreshing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <Spin size="large" />
            <p className="text-sm font-semibold text-slate-600">
              Refreshing leads...
            </p>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-4 p-3 w-full overflow-hidden">
        <PipelineHeader
          onAddLead={() => {
            setAddModalDefaultStage(undefined);
            setAddModalOpen(true);
          }}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          onImport={() => setImportModalOpen(true)}
        />

        <PipelineStats stats={stats} />

        <FilterBar
          filteredCount={filteredLeads.length}
          totalCount={leads.length}
          isAdmin={isAdmin}
          clearFilters={clearFilters}
          hasFilters={hasFilters}
          counselorUsers={counselorUsers}
          onExport={() => setExportModalOpen(true)}
          onSearchChange={setSearch}
          onSourceChange={setSourceFilter}
          onCounselorChange={setCounselorFilter}
          onCountryChange={setCountryFilter}
          onPriorityChange={setPriorityFilter}
          onCategoryChange={setCategoryFilter}
          onPipelineStatusChange={(v) =>
            setPipelineStatusFilter(v as PipelineStatusApi | "")
          } // ← new
          onDateRangeChange={(v: DateRangeValue) => setDateRange(v)}
        />

        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-start justify-center pt-24 bg-white/60 rounded-2xl backdrop-blur-[2px]">
              <Spin size="large" tip="Loading leads…" />
            </div>
          )}
          <PipelineBoard
            leads={filteredLeads}
            dnd={{
              sensors,
              activeId,
              overStageId,
              handleDragStart,
              handleDragOver,
              handleDragEnd,
            }}
            actionHandlers={{
              onMarkLost: setLostModalLead,
              onMoveTo: handleMoveTo,
              onViewNotes: setNotesDrawerLead,
              onView: setViewDrawerLead,
              onEdit: setEditDrawerLead,
              onCall: setCallModalLead,
              onEmail: setEmailModalLead,
            }}
            onAddToStage={(stageId) => {
              setAddModalDefaultStage(stageId);
              setAddModalOpen(true);
            }}
          />
        </div>
      </div>

      <GoogleSheetsImportModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImportSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["leads"] });
          setImportModalOpen(false);
        }}
      />
      <LeadModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleSaveLead}
        defaultStage={addModalDefaultStage}
      />
      {exportModalOpen && (
        <ExportModal
          leads={filteredLeads}
          allLeads={leads}
          onClose={() => setExportModalOpen(false)}
        />
      )}
      <LostLeadModal
        lead={lostModalLead}
        onClose={() => setLostModalLead(null)}
        onSave={handleSaveLost}
      />
      <CallModal lead={callModalLead} onClose={() => setCallModalLead(null)} />
      <SendEmailModal
        lead={emailModalLead}
        onClose={() => setEmailModalLead(null)}
      />

      <LeadNotesDrawer
        lead={notesDrawerLead}
        onClose={() => setNotesDrawerLead(null)}
        onAddNote={handleAddNote}
      />
      <ViewLeadDrawer
        key={`${viewDrawerLead?.id}-${viewDrawerInitialTab}`}
        lead={viewDrawerLead}
        initialTab={viewDrawerInitialTab}
        onClose={() => {
          setViewDrawerLead(null);
          setNotesDrawerLead(null);
          setViewDrawerInitialTab("notes");
        }}
      />
      <EditLeadDrawer
        lead={editDrawerLead}
        onClose={() => setEditDrawerLead(null)}
        onSave={() => {
          queryClient.invalidateQueries({ queryKey: ["leads"] });
          setEditDrawerLead(null);
        }}
      />
    </>
  );
};

export default LeadsPipelinePage;
