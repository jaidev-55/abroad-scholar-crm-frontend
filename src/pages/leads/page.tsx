import React, { useEffect, useMemo, useRef, useState } from "react";
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

import LeadModal from "../../components/leadspipeline/LeadModal";
import ViewLeadDrawer from "../../components/leadspipeline/drawers/ViewLeadDrawer";
import EditLeadDrawer from "../../components/leadspipeline/drawers/EditLeadDrawer";
import CallModal from "../../components/leadspipeline/Callmodal";
import SendEmailModal from "../../components/leadspipeline/Sendemailmodal";
import PipelineHeader from "../../components/leadspipeline/pipeline/PipelineHeader";
import PipelineStats from "../../components/leadspipeline/pipeline/PipelineStats";
import PipelineBoard from "../../components/leadspipeline/pipeline/PipelineBoard";
import FilterBar from "../../components/leadspipeline/filters/FilterBar";
import LostLeadModal from "../../components/leadspipeline/pipeline/LostLeadModal";
import LeadNotesDrawer from "../../components/leadspipeline/pipeline/LeadNotesDrawer";
import ExportModal from "../../components/leadspipeline/export/ExportModal";
import { STAGES } from "../../components/leadspipeline/constants";
import type { Note, DateRangeValue, Lead } from "../../types/lead";
import {
  getLeads,
  updateLead,
  markLeadAsLost,
  type ApiLead,
  type LeadStatus,
} from "../../api/leads";
import { getUsers } from "../../api/auth";

// ─── Helper: check if ISO date string is today ───────────────────────────────
const isTodayDate = (dateStr?: string): boolean => {
  if (!dateStr) return false;
  return new Date(dateStr).toDateString() === new Date().toDateString();
};

// ─── Transform API lead → local Lead ─────────────────────────────────────────
function apiLeadToLocal(a: ApiLead): Lead {
  const statusToStage: Record<string, string> = {
    NEW: "new",
    IN_PROGRESS: "progress",
    CONVERTED: "converted",
    LOST: "lost",
  };

  return {
    id: a.id,
    name: a.fullName,
    phone: a.phone,
    email: a.email ?? "",
    country: a.country,
    source: a.source,
    status: a.status,
    stage: statusToStage[a.status] ?? "new",
    priority: (a.priority.charAt(0) +
      a.priority.slice(1).toLowerCase()) as Lead["priority"],
    counselor: a.counselor?.name ?? "",
    followUp: a.followUpDate?.split("T")[0] ?? "",
    ieltsScore: a.ieltsScore != null ? String(a.ieltsScore) : undefined,
    notes: (a.notes ?? []).map((n) => ({
      id: n.id,
      text: n.content,
      createdAt: n.createdAt,
      author: a.counselor?.name ?? "Admin",
    })),
    createdAt: a.createdAt.split("T")[0],
    updatedAt: a.updatedAt,
  };
}

// ─── Map local stage id → API LeadStatus ─────────────────────────────────────
const STAGE_TO_STATUS: Record<string, LeadStatus> = {
  new: "NEW",
  progress: "IN_PROGRESS",
  applied: "IN_PROGRESS",
  converted: "CONVERTED",
  lost: "LOST",
};

const LeadsPipeline: React.FC = () => {
  const queryClient = useQueryClient();

  // ── Filter state ──────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [counselorFilter, setCounselorFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [dateRange, setDateRange] = useState<DateRangeValue>(null);

  // ── Modal / drawer state ──────────────────────────────────────────────────
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addModalDefaultStage, setAddModalDefaultStage] = useState<string>();
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [lostModalLead, setLostModalLead] = useState<Lead | null>(null);
  const [notesDrawerLead, setNotesDrawerLead] = useState<Lead | null>(null);
  const [viewDrawerLead, setViewDrawerLead] = useState<Lead | null>(null);
  const [editDrawerLead, setEditDrawerLead] = useState<Lead | null>(null);
  const [callModalLead, setCallModalLead] = useState<Lead | null>(null);
  const [emailModalLead, setEmailModalLead] = useState<Lead | null>(null);
  const [viewDrawerInitialTab, setViewDrawerInitialTab] = useState<
    "notes" | "details" | "activity"
  >("notes");

  // ── DnD state ─────────────────────────────────────────────────────────────
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overStageId, setOverStageId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  // ── Build a stable query key from all active filters ─────────────────────
  const queryKey = [
    "leads",
    search,
    sourceFilter,
    counselorFilter,
    countryFilter,
    priorityFilter,
    dateRange?.[0]?.format("YYYY-MM-DD") ?? null,
    dateRange?.[1]?.format("YYYY-MM-DD") ?? null,
  ] as const;

  // ── Fetch leads from API ──────────────────────────────────────────────────
  const {
    data: rawLeads = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey,
    queryFn: () =>
      getLeads({
        search: search || undefined,
        source: sourceFilter || undefined,
        country: countryFilter || undefined,
        priority: priorityFilter ? priorityFilter.toUpperCase() : undefined,
        followUpFrom: dateRange?.[0]?.format("YYYY-MM-DD"),
        followUpTo: dateRange?.[1]?.format("YYYY-MM-DD"),
      }),
    placeholderData: (prev) => prev,
  });

  // Convert API shape → local shape once per fetch
  const leads: Lead[] = useMemo(() => rawLeads.map(apiLeadToLocal), [rawLeads]);

  // ── Counselor filter is client-side ───────────────────────────────────────
  const filteredLeads = useMemo(() => {
    if (!counselorFilter) return leads;
    return leads.filter((l) => l.counselor === counselorFilter);
  }, [leads, counselorFilter]);

  // ── Stats — converted & lost count today only ─────────────────────────────
  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return {
      total: leads.length,
      newToday: leads.filter((l) => l.createdAt === today).length,
      followUpsDue: leads.filter((l) => l.followUp && l.followUp <= today)
        .length,

      converted: leads.filter(
        (l) => l.stage === "converted" && isTodayDate(l.updatedAt),
      ).length,
      lost: leads.filter((l) => l.stage === "lost" && isTodayDate(l.updatedAt))
        .length,
    };
  }, [leads]);

  // ── Fetch counselors for filter ───────────────────
  const { data: counselorUsers = [] } = useQuery({
    queryKey: ["counselors"],
    queryFn: () => getUsers("COUNSELOR"),
    staleTime: 5 * 60 * 1000,
  });

  // ── Mutation: move lead (drag-and-drop) ───────────────────────────────────
  const { mutate: moveLeadMutation } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeadStatus }) =>
      updateLead(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      message.success("Lead moved successfully!");
    },
    onError: (error: unknown) => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      message.error(
        axiosError?.response?.data?.message ||
          "Failed to move lead. Please try again.",
      );
    },
  });

  // ── Mutation: mark lead as lost ───────────────────────────────────────────
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
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      message.error(
        axiosError?.response?.data?.message || "Failed to mark lead as lost.",
      );
    },
  });

  // ── Mutation: add a note ──────────────────────────────────────────────────
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

  // ── DnD handlers ──────────────────────────────────────────────────────────
  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id as string);
  };

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

  // ── Auto-open lead from email link ────────────────────────────────────────
  const autoOpenDone = useRef(false);

  useEffect(() => {
    if (isLoading || autoOpenDone.current) return;
    if (leads.length === 0) return;

    const params = new URLSearchParams(window.location.search);
    const leadId = params.get("leadId");

    autoOpenDone.current = true;

    if (!leadId) return;

    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    setTimeout(() => {
      setViewDrawerInitialTab("details");
      setViewDrawerLead(lead);
      window.history.replaceState({}, "", "/admin/leads-pipeline");
    }, 100);
  }, [leads, isLoading]);

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

    // If dragging to "lost", open reason modal
    if (newStage === "lost") {
      setLostModalLead(movingLead);
      return;
    }

    //  Optimistic update — include updatedAt: now so converted/lost stays visible today
    queryClient.setQueryData<ApiLead[]>(
      queryKey,
      (old) =>
        old?.map((l) =>
          l.id === active.id
            ? {
                ...l,
                status: newStatus,
                updatedAt: new Date().toISOString(),
              }
            : l,
        ) ?? [],
    );

    moveLeadMutation({ id: active.id as string, status: newStatus });
  };

  // ── Note handler ──────────────────────────────────────────────────────────
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

  // ── Lost lead handler ─────────────────────────────────────────────────────
  const handleSaveLost = (leadId: string, reason: string, notes: string) => {
    markLostMutation({ id: leadId, reason, notes });
  };

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
    setDateRange(null);
  };

  const hasFilters = !!(
    search ||
    sourceFilter ||
    counselorFilter ||
    countryFilter ||
    priorityFilter ||
    dateRange
  );

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
      <div className="flex flex-col gap-4 p-5 w-full overflow-hidden">
        <PipelineHeader
          onAddLead={() => {
            setAddModalDefaultStage(undefined);
            setAddModalOpen(true);
          }}
        />

        <PipelineStats stats={stats} />

        <FilterBar
          filteredCount={filteredLeads.length}
          totalCount={leads.length}
          clearFilters={clearFilters}
          hasFilters={hasFilters}
          counselorUsers={counselorUsers}
          onExport={() => setExportModalOpen(true)}
          onSearchChange={setSearch}
          onSourceChange={setSourceFilter}
          onCounselorChange={setCounselorFilter}
          onCountryChange={setCountryFilter}
          onPriorityChange={setPriorityFilter}
          onDateRangeChange={setDateRange}
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
              onMoveTo: (leadId: string, stageId: string) => {
                const newStatus = STAGE_TO_STATUS[stageId];
                if (!newStatus) return;

                queryClient.setQueryData<ApiLead[]>(
                  queryKey,
                  (old) =>
                    old?.map((l) =>
                      l.id === leadId
                        ? {
                            ...l,
                            status: newStatus,
                            updatedAt: new Date().toISOString(), // ✅
                          }
                        : l,
                    ) ?? [],
                );
                moveLeadMutation({ id: leadId, status: newStatus });
              },
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

      <CallModal lead={callModalLead} onClose={() => setCallModalLead(null)} />

      <SendEmailModal
        lead={emailModalLead}
        onClose={() => setEmailModalLead(null)}
      />
    </>
  );
};

export default LeadsPipeline;
