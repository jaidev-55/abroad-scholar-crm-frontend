import React, { useMemo, useState } from "react";
import { message } from "antd";
import {
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";

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
import type { Note, DateRangeValue, Lead } from "../../types/lead.types";
import { LEADS_DATA } from "../../data/generateLeads";

const LeadsPipeline: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(LEADS_DATA);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [counselorFilter, setCounselorFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [dateRange, setDateRange] = useState<DateRangeValue>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addModalDefaultStage, setAddModalDefaultStage] = useState<string>();
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [lostModalLead, setLostModalLead] = useState<Lead | null>(null);
  const [notesDrawerLead, setNotesDrawerLead] = useState<Lead | null>(null);
  const [viewDrawerLead, setViewDrawerLead] = useState<Lead | null>(null);
  const [editDrawerLead, setEditDrawerLead] = useState<Lead | null>(null);
  const [callModalLead, setCallModalLead] = useState<Lead | null>(null);
  const [emailModalLead, setEmailModalLead] = useState<Lead | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overStageId, setOverStageId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  //  FILTER LOGIC

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (
        search &&
        !lead.name.toLowerCase().includes(search.toLowerCase()) &&
        !lead.phone.includes(search)
      )
        return false;

      if (sourceFilter && lead.source !== sourceFilter) return false;
      if (counselorFilter && lead.counselor !== counselorFilter) return false;
      if (countryFilter && lead.country !== countryFilter) return false;
      if (priorityFilter && lead.priority !== priorityFilter) return false;

      if (
        dateRange &&
        dateRange[0] &&
        lead.followUp &&
        lead.followUp < dateRange[0].format("YYYY-MM-DD")
      )
        return false;

      if (
        dateRange &&
        dateRange[1] &&
        lead.followUp &&
        lead.followUp > dateRange[1].format("YYYY-MM-DD")
      )
        return false;

      return true;
    });
  }, [
    leads,
    search,
    sourceFilter,
    counselorFilter,
    countryFilter,
    priorityFilter,
    dateRange,
  ]);

  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id as string);
  };

  const stats = useMemo(() => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    return {
      // Total number of leads
      total: leads.length,

      // Leads created today
      newToday: leads.filter((l) => l.createdAt === today).length,

      // Leads whose follow-up date is today or overdue
      followUpsDue: leads.filter((l) => l.followUp && l.followUp <= today)
        .length,

      // Leads successfully converted
      converted: leads.filter((l) => l.stage === "converted").length,

      // Leads marked as lost
      lost: leads.filter((l) => l.stage === "lost").length,
    };
  }, [leads]);

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

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    setActiveId(null);
    setOverStageId(null);

    if (!over) return;

    const overId = over.id as string;

    const stage = STAGES.find((s) => s.id === overId);
    const leadOver = leads.find((l) => l.id === overId);

    const newStage = stage?.id || leadOver?.stage;
    if (!newStage) return;

    setLeads((prev) =>
      prev.map((l) => (l.id === active.id ? { ...l, stage: newStage } : l)),
    );

    message.success("Lead moved successfully!");
  };

  const handleAddNote = (leadId: string, text: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      text,
      createdAt: new Date().toISOString(),
      author: "Priya Sharma",
    };

    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId ? { ...l, notes: [...l.notes, newNote] } : l,
      ),
    );
  };

  const handleSaveLost = (leadId: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
  };

  const handleSaveLead = (newLead: Lead) => {
    const withStage = addModalDefaultStage
      ? { ...newLead, stage: addModalDefaultStage }
      : newLead;

    setLeads((prev) => [withStage, ...prev]);
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

  const hasFilters =
    search ||
    sourceFilter ||
    counselorFilter ||
    countryFilter ||
    priorityFilter ||
    dateRange;

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
          hasFilters={!!hasFilters}
          onExport={() => setExportModalOpen(true)}
        />

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
            onMoveTo: () => {},
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
        lead={viewDrawerLead}
        onClose={() => setViewDrawerLead(null)}
        onOpenNotes={(lead) => {
          setViewDrawerLead(null);
          setNotesDrawerLead(lead);
        }}
      />

      <EditLeadDrawer
        lead={editDrawerLead}
        onClose={() => setEditDrawerLead(null)}
        onSave={function (): void {
          throw new Error("Function not implemented.");
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
