import React from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type SensorDescriptor,
} from "@dnd-kit/core";

import { STAGES } from "../constants";
import KanbanColumn from "./KanbanColumn";
import KanbanCard from "./KanbanCard";
import type { Lead, Stage } from "../../../types/lead.types";

interface DnDHandlers {
  sensors: SensorDescriptor<any>[];
  activeId: string | null;
  overStageId: string | null;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragOver: (event: DragOverEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
}

interface Props {
  leads: Lead[];
  dnd: DnDHandlers;
  actionHandlers: {
    onMarkLost: (l: Lead) => void;
    onMoveTo: (id: string, s: string) => void;
    onViewNotes: (l: Lead) => void;
    onView: (l: Lead) => void;
    onEdit: (l: Lead) => void;
    onCall: (l: Lead) => void;
    onEmail: (l: Lead) => void;
  };
  onAddToStage: (stageId: string) => void;
}

const PipelineBoard: React.FC<Props> = ({
  leads,
  dnd,
  actionHandlers,
  onAddToStage,
}) => {
  const activeLead = dnd.activeId
    ? leads.find((l) => l.id === dnd.activeId)
    : null;

  return (
    <DndContext
      sensors={dnd.sensors}
      collisionDetection={closestCorners}
      onDragStart={dnd.handleDragStart}
      onDragOver={dnd.handleDragOver}
      onDragEnd={dnd.handleDragEnd}
    >
      <div className="w-full overflow-x-auto h-full flex-1 pb-2">
        <div className="flex gap-4 min-w-max h-full">
          {STAGES.map((stage: Stage) => (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              leads={leads.filter((l) => l.stage === stage.id)}
              isOver={dnd.overStageId === stage.id}
              onAddToStage={onAddToStage}
              {...actionHandlers}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeLead && (
          <div style={{ transform: "rotate(3deg)", opacity: 0.95 }}>
            <KanbanCard lead={activeLead} isDragging {...actionHandlers} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default PipelineBoard;
