import React from "react";
import {
  HiOutlineAcademicCap,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineChatAlt2,
} from "react-icons/hi";
import { TASKS, type Task } from "../utils/constants";

const taskIcon = (type: Task["type"]) => {
  switch (type) {
    case "call":
      return <HiOutlinePhone className="h-4 w-4" />;
    case "email":
      return <HiOutlineMail className="h-4 w-4" />;
    case "meeting":
      return <HiOutlineChatAlt2 className="h-4 w-4" />;
  }
};

const TodaysTasks: React.FC = () => (
  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h3 className="text-sm font-bold text-slate-900">Today's Tasks</h3>
        <p className="text-xs text-slate-500">
          {TASKS.length} pending activities
        </p>
      </div>
      <HiOutlineAcademicCap className="h-4 w-4 text-violet-500" />
    </div>
    <div className="space-y-2">
      {TASKS.map((t) => (
        <div
          key={t.id}
          className="group flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-2.5 transition hover:border-blue-200 hover:bg-blue-50/30"
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${t.urgent ? "bg-rose-100 text-rose-600" : "bg-blue-100 text-blue-600"}`}
          >
            {taskIcon(t.type)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-xs font-semibold text-slate-800">
                {t.title}
              </p>
              {t.urgent && (
                <span className="rounded-full bg-rose-100 px-1.5 text-[9px] font-bold text-rose-600">
                  URGENT
                </span>
              )}
            </div>
            <p className="truncate text-[10px] text-slate-500">{t.lead}</p>
          </div>
          <span className="text-[10px] font-semibold text-slate-400">
            {t.time}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default TodaysTasks;
