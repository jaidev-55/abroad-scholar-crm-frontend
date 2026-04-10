import { useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { fullDate, timeAgo } from "../../modules/leadsPipeline/utils/dateUtils";
import UserAvatar from "./UserAvatar";

export interface Note {
  id: string;
  text: string;
  createdAt: string;
  author: string;
}

interface NoteCardProps {
  note: Note;
  onDelete?: (id: string) => void;
}

// Single note card with hover-reveal delete button
const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className="bg-white rounded-xl border border-slate-100 p-4 transition-all duration-150 hover:border-slate-200 hover:shadow-sm group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start gap-2.5">
        <UserAvatar name={note.author} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-bold text-slate-700">{note.author}</p>
              <p
                className="text-[10px] text-slate-400 mt-0.5"
                title={fullDate(note.createdAt)}
              >
                {timeAgo(note.createdAt)}
              </p>
            </div>
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(note.id)}
                className="border-none bg-transparent cursor-pointer p-1 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 outline-none transition-all"
                style={{
                  opacity: showActions ? 1 : 0,
                  transition: "opacity 0.15s",
                }}
              >
                <RiDeleteBinLine size={13} />
              </button>
            )}
          </div>
          <p className="text-[13px] text-slate-600 leading-relaxed mt-2">
            {note.text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
