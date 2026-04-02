import React from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import type {
  SensorDescriptor,
  SensorOptions,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import type { Lead } from "../../../types/lead.types";
import { STAGES } from "../constants";
import KanbanColumn from "./KanbanColumn";
import KanbanCard from "./KanbanCard";

interface PipelineBoardProps {
  leads: Lead[];
  dnd: {
    sensors: SensorDescriptor<SensorOptions>[];
    activeId: string | null;
    overStageId: string | null;
    handleDragStart: (e: DragStartEvent) => void;
    handleDragOver: (e: DragOverEvent) => void;
    handleDragEnd: (e: DragEndEvent) => void;
  };
  actionHandlers: {
    onMarkLost: (lead: Lead) => void;
    onMoveTo: (leadId: string, stageId: string) => void;
    onViewNotes: (lead: Lead) => void;
    onView: (lead: Lead) => void;
    onEdit: (lead: Lead) => void;
    onCall: (lead: Lead) => void;
    onEmail: (lead: Lead) => void;
  };
  onAddToStage: (stageId: string) => void;
}

const PipelineBoard: React.FC<PipelineBoardProps> = ({
  leads,
  dnd,
  actionHandlers,
  onAddToStage,
}) => {
  const {
    sensors,
    activeId,
    overStageId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = dnd;
  const activeLead = leads.find((l) => l.id === activeId) ?? null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-3 w-full overflow-x-auto pb-2">
        {STAGES.map((stage) => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            leads={leads.filter((l) => l.stage === stage.id)}
            isOver={overStageId === stage.id}
            onAddToStage={onAddToStage}
            onMarkLost={actionHandlers.onMarkLost}
            onMoveTo={actionHandlers.onMoveTo}
            onViewNotes={actionHandlers.onViewNotes}
            onView={actionHandlers.onView}
            onEdit={actionHandlers.onEdit}
            onCall={actionHandlers.onCall}
            onEmail={actionHandlers.onEmail}
          />
        ))}
      </div>
      <DragOverlay>
        {activeLead ? (
          <KanbanCard
            lead={activeLead}
            onMarkLost={actionHandlers.onMarkLost}
            onMoveTo={actionHandlers.onMoveTo}
            onViewNotes={actionHandlers.onViewNotes}
            onView={actionHandlers.onView}
            onEdit={actionHandlers.onEdit}
            onCall={actionHandlers.onCall}
            onEmail={actionHandlers.onEmail}
            isDragging
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default PipelineBoard;
