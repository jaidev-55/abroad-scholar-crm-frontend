import { Tooltip, type MenuProps, Dropdown as AntDropdown } from "antd";

import {
  RiArrowRightLine,
  RiCalendarLine,
  RiCloseCircleLine,
  RiDragMove2Line,
  RiErrorWarningLine,
  RiEyeLine,
  RiGlobalLine,
  RiMailLine,
  RiMoreLine,
  RiPencilLine,
  RiPhoneLine,
  RiStickyNoteLine,
  RiUserSmileLine,
} from "react-icons/ri";
import type { Lead } from "../types/lead";
import { useSortable } from "@dnd-kit/sortable";
import { STAGES } from "../utils/constants";
import UserAvatar from "../../../components/common/UserAvatar";
import SourceBadge from "../../../components/common/badges/SourceBadge";
import PriorityBadge from "../../../components/common/badges/PriorityBadge";

const KanbanCard: React.FC<{
  lead: Lead;
  onMarkLost: (l: Lead) => void;
  onMoveTo: (leadId: string, stageId: string) => void;
  onViewNotes: (l: Lead) => void;
  onView: (l: Lead) => void;
  onEdit: (l: Lead) => void;
  onCall: (l: Lead) => void;
  onEmail: (l: Lead) => void;
  isDragging?: boolean;
}> = ({
  lead,
  onMarkLost,
  onMoveTo,
  onViewNotes,
  onView,
  onEdit,
  onCall,
  onEmail,
  isDragging = false,
}) => {
  const { attributes, listeners, setNodeRef } = useSortable({ id: lead.id });

  const isOverdue = lead.followUp
    ? new Date(lead.followUp) < new Date()
    : false;
  const isToday = lead.followUp
    ? lead.followUp === new Date().toISOString().split("T")[0]
    : false;
  const currentIndex = STAGES.findIndex((s) => s.id === lead.stage);
  const nextStage =
    currentIndex < STAGES.length - 1 ? STAGES[currentIndex + 1] : null;
  const priorityBarColor =
    lead.priority === "Hot"
      ? "bg-red-500"
      : lead.priority === "Warm"
        ? "bg-amber-500"
        : "bg-blue-500";
  const menuItems: MenuProps["items"] = [
    {
      key: "notes",
      icon: <RiStickyNoteLine size={14} />,
      label: `Notes (${lead.notes.length})`,
    },
    { key: "view", icon: <RiEyeLine size={14} />, label: "View Details" },
    { key: "edit", icon: <RiPencilLine size={14} />, label: "Edit Lead" },
    { key: "call", icon: <RiPhoneLine size={14} />, label: "Call Now" },
    { key: "email", icon: <RiMailLine size={14} />, label: "Send Email" },
    ...(nextStage
      ? [
          { type: "divider" as const },
          {
            key: "move",
            icon: <RiArrowRightLine size={14} />,
            label: `Move to ${nextStage.label}`,
            style: { color: "#2563EB" },
          },
        ]
      : []),
    { type: "divider" as const },
    {
      key: "lost",
      icon: <RiCloseCircleLine size={14} />,
      label: "Mark as Lost",
      danger: true,
    },
  ];
  const handleMenuClick: MenuProps["onClick"] = ({ key, domEvent }) => {
    domEvent.stopPropagation();
    if (key === "notes") onViewNotes(lead);
    if (key === "view") onView(lead);
    if (key === "edit") onEdit(lead);
    if (key === "call") onCall(lead);
    if (key === "email") onEmail(lead);
    if (key === "move" && nextStage) onMoveTo(lead.id, nextStage.id);
    if (key === "lost") onMarkLost(lead);
  };
  return (
    <div
      ref={setNodeRef}
      onClick={() => onView(lead)}
      className={`relative rounded-2xl p-4 transition-all duration-200 ${isDragging ? "bg-blue-50 border-2 border-dashed border-blue-400 shadow-xl" : "bg-white border border-slate-100 shadow-sm hover:shadow-md hover:shadow-blue-100/40 hover:border-blue-200"}`}
    >
      <div
        className={`absolute top-0 left-4 right-4 h-[3px] rounded-b ${priorityBarColor}`}
      />
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2.5 left-1/2 -translate-x-1/2 opacity-20 hover:opacity-50 cursor-grab p-1 transition-opacity"
      >
        <RiDragMove2Line size={12} />
      </div>
      <div className="flex justify-between items-start mb-3 mt-1.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <UserAvatar name={lead.name} />
          <div className="min-w-0">
            <h4 className="text-[13px] font-bold text-slate-900 leading-tight truncate">
              {lead.name}
            </h4>
            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
              <RiPhoneLine size={11} />
              {lead.phone}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {lead.notes.length > 0 && (
            <Tooltip
              title={`${lead.notes.length} note${lead.notes.length > 1 ? "s" : ""}`}
            >
              <button
                onClick={() => onViewNotes(lead)}
                className="bg-blue-50 border-none px-1.5 py-1 rounded-md cursor-pointer flex items-center gap-1 text-blue-600 hover:bg-blue-100 transition-colors"
              >
                <RiStickyNoteLine size={12} />
                <span className="text-[10px] font-bold">
                  {lead.notes.length}
                </span>
              </button>
            </Tooltip>
          )}
          <AntDropdown
            menu={{ items: menuItems, onClick: handleMenuClick }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <button
              className="bg-transparent border-none p-1 rounded-lg cursor-pointer flex text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <RiMoreLine size={16} />
            </button>
          </AntDropdown>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        <SourceBadge source={lead.source} />
        <PriorityBadge priority={lead.priority} />
      </div>
      <div className="flex flex-col gap-1.5 mb-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <RiGlobalLine size={12} className="text-slate-400 shrink-0" />
          <span className="truncate">{lead.country}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <RiUserSmileLine size={12} className="text-slate-400 shrink-0" />
          <span className="truncate">{lead.counselor}</span>
        </div>
      </div>
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border ${isOverdue ? "bg-red-50 text-red-600 border-red-200" : isToday ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-slate-50 text-slate-500 border-slate-200"}`}
      >
        <RiCalendarLine size={12} />
        <span className="truncate">
          {isOverdue ? "Overdue: " : isToday ? "Today: " : "Follow-up: "}
          {lead.followUp
            ? new Date(lead.followUp).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : "Not set"}
        </span>
        {isOverdue && (
          <RiErrorWarningLine size={12} className="ml-auto shrink-0" />
        )}
      </div>
    </div>
  );
};
export default KanbanCard;
