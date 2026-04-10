import { useState } from "react";
import type {
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import type { Lead, LeadStatus } from "../../types/lead";
import { STAGES } from "../../utils/constants";
import { STAGE_TO_STATUS } from "../../types/Transformlead";


interface UseDragHandlersParams {
  leads: Lead[];
  onMoveOptimistic: (leadId: string, status: LeadStatus) => void;
  onDropToLost: (lead: Lead) => void;
}

/**
 * Encapsulates all drag-and-drop state and event handlers.
 * Returns the values that PipelineBoard and the page both need.
 */
export function useDragHandlers({
  leads,
  onMoveOptimistic,
  onDropToLost,
}: UseDragHandlersParams) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overStageId, setOverStageId] = useState<string | null>(null);

  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id as string);
  };

  const handleDragOver = (e: DragOverEvent) => {
    const { over } = e;
    if (!over) return;

    const overId = over.id as string;
    // Dragging directly over a column droppable
    const stage = STAGES.find((s) => s.id === overId);
    if (stage) {
      setOverStageId(stage.id);
      return;
    }
    // Dragging over another card — highlight its column
    const lead = leads.find((l) => l.id === overId);
    if (lead) setOverStageId(lead.stage);
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

    // Special case: dragging to "lost" opens the reason modal
    if (newStage === "lost") {
      onDropToLost(movingLead);
      return;
    }

    onMoveOptimistic(active.id as string, newStatus);
  };

  return {
    activeId,
    overStageId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
