import { Switch } from "antd";
import { RiNotification3Line, RiMailLine, RiSaveLine } from "react-icons/ri";
import type { NotificationPreference } from "../types";

interface Props {
  notifications: NotificationPreference[];
}

const CATEGORY_LABELS: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  leads: { label: "Lead Activity", bg: "bg-blue-50", text: "text-blue-600" },
  team: { label: "Team", bg: "bg-purple-50", text: "text-purple-600" },
  marketing: {
    label: "Marketing",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  system: { label: "System", bg: "bg-slate-100", text: "text-slate-600" },
};

const NotificationsSection: React.FC<Props> = ({ notifications }) => {
  const grouped = notifications.reduce(
    (acc, n) => {
      if (!acc[n.category]) acc[n.category] = [];
      acc[n.category].push(n);
      return acc;
    },
    {} as Record<string, NotificationPreference[]>,
  );

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([category, items]) => {
        const catCfg = CATEGORY_LABELS[category];
        return (
          <div
            key={category}
            className="bg-white rounded-2xl border border-slate-100 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${catCfg?.bg} ${catCfg?.text}`}
              >
                {catCfg?.label}
              </span>
            </div>

            {/* Header row */}
            <div className="flex items-center gap-4 px-3 mb-2">
              <span className="flex-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Event
              </span>
              <div className="flex items-center gap-1 w-16 justify-center">
                <RiNotification3Line size={11} className="text-slate-400" />
                <span className="text-[10px] text-slate-400">In-App</span>
              </div>
              <div className="flex items-center gap-1 w-16 justify-center">
                <RiMailLine size={11} className="text-slate-400" />
                <span className="text-[10px] text-slate-400">Email</span>
              </div>
            </div>

            {/* Notification rows */}
            <div className="space-y-1">
              {items.map((n) => (
                <div
                  key={n.id}
                  className="flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800">
                      {n.event}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {n.description}
                    </p>
                  </div>
                  <div className="w-16 flex justify-center">
                    <Switch size="small" checked={n.inApp} />
                  </div>
                  <div className="w-16 flex justify-center">
                    <Switch size="small" checked={n.email} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-5 py-2.5 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors cursor-pointer shadow-sm">
          <RiSaveLine size={14} />
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default NotificationsSection;
