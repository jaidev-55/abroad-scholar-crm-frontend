import { RiAddLine } from "react-icons/ri";
import KanbanCard from "./KanbanCard";
import { Tooltip } from "antd";
import type { Lead, Stage } from "../../../types/lead.types";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

const KanbanColumn: React.FC<{
  stage: Stage;
  leads: Lead[];
  isOver?: boolean;
  onMarkLost: (l: Lead) => void;
  onMoveTo: (id: string, s: string) => void;
  onViewNotes: (l: Lead) => void;
  onView: (l: Lead) => void;
  onEdit: (l: Lead) => void;
  onCall: (l: Lead) => void;
  onEmail: (l: Lead) => void;
  onAddToStage: (stageId: string) => void;
}> = ({
  stage,
  leads,
  isOver,
  onMarkLost,
  onMoveTo,
  onViewNotes,
  onView,
  onEdit,
  onCall,
  onEmail,
  onAddToStage,
}) => {
  const Icon = stage.icon;
  const { setNodeRef } = useDroppable({
    id: stage.id,
  });
  return (
    <div
      ref={setNodeRef}
      className="flex flex-col h-full"
      style={{ width: 320, flexShrink: 0 }}
    >
      <div className="flex justify-between items-center px-0.5 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <Icon size={16} className={stage.twText} />
          <h3 className="text-[13px] font-bold text-slate-800 truncate">
            {stage.label}
          </h3>
          <span
            className={`inline-flex items-center justify-center min-w-[22px] h-[22px] rounded-lg text-[11px] font-bold px-1.5 border shrink-0 ${stage.twBg} ${stage.twText} ${stage.twBorder}`}
          >
            {leads.length}
          </span>
        </div>
        {/* Hide add button for "lost" stage */}
        {stage.id !== "lost" && (
          <Tooltip title={`Add lead to ${stage.label}`}>
            <button
              onClick={() => onAddToStage(stage.id)}
              className="group flex items-center gap-1 px-2 py-1.5 rounded-lg border-2 cursor-pointer transition-all duration-200 bg-transparent"
              style={{ borderColor: "transparent" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = stage.color;
                e.currentTarget.style.background = `${stage.bg}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "transparent";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <RiAddLine
                size={14}
                className="text-slate-400 group-hover:text-current transition-colors"
                style={{ color: "inherit" }}
              />
              <span
                className="text-[11px] font-bold overflow-hidden max-w-0 group-hover:max-w-[32px] transition-all duration-200 whitespace-nowrap opacity-0 group-hover:opacity-100"
                style={{ color: stage.color }}
              >
                Add
              </span>
            </button>
          </Tooltip>
        )}
      </div>
      <div className="mx-0.5 mb-2.5 h-[3px] bg-slate-100 rounded overflow-hidden">
        <div
          className="h-full rounded transition-all duration-500"
          style={{
            background: stage.color,
            width: `${Math.min(leads.length * 15, 100)}%`,
          }}
        />
      </div>
      <SortableContext
        items={leads.map((l) => l.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          className={`flex flex-col gap-2.5 overflow-y-auto flex-1 pb-4 rounded-xl transition-all duration-200 ${isOver ? "border-2 border-dashed p-2" : "border-2 border-transparent p-0"}`}
          style={{
            maxHeight: "calc(100vh - 380px)",
            minHeight: 80,
            borderColor: isOver ? stage.color : "transparent",
            background: isOver ? stage.bg : "transparent",
          }}
        >
          {/* Empty state for normal stages */}
          {leads.length === 0 && !isOver && stage.id !== "lost" && (
            <button
              onClick={() => onAddToStage(stage.id)}
              className="flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 cursor-pointer hover:text-blue-500 hover:border-blue-300 hover:bg-blue-50/50 transition-all bg-transparent group"
            >
              <RiAddLine
                size={22}
                className="opacity-40 mb-1.5 group-hover:opacity-80 transition-opacity"
              />
              <p className="text-xs font-medium">Add first lead</p>
            </button>
          )}
          {/* Empty state for lost stage */}
          {leads.length === 0 && !isOver && stage.id === "lost" && (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-slate-300 select-none">
              <p className="text-xs font-medium">No lost leads</p>
            </div>
          )}
          {leads.map((lead) => (
            <KanbanCard
              key={lead.id}
              lead={lead}
              onMarkLost={onMarkLost}
              onMoveTo={onMoveTo}
              onViewNotes={onViewNotes}
              onView={onView}
              onEdit={onEdit}
              onCall={onCall}
              onEmail={onEmail}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};
export default KanbanColumn;
