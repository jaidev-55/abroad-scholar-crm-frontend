import React from "react";
import { Tooltip, message } from "antd";
import { RiGlobalLine } from "react-icons/ri";
import { PLATFORM_CONFIG } from "../utils/constants";

interface Props {
  apiBase: string;
  googleToken: string;
}

const WebhookEndpoints: React.FC<Props> = ({ apiBase, googleToken }) => {
  const endpoints = [
    {
      platform: "META",
      label: "Meta Webhook URL",
      url: `${apiBase}/webhooks/meta`,
    },
    {
      platform: "GOOGLE",
      label: "Google Webhook URL",
      url: `${apiBase}/webhooks/google?token=${googleToken}`,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <RiGlobalLine size={16} className="text-slate-400" />
        <h3 className="text-sm font-bold text-slate-700">Webhook Endpoints</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {endpoints.map((item) => {
          const cfg = PLATFORM_CONFIG[item.platform];
          const Icon = cfg.icon;
          return (
            <div
              key={item.platform}
              className={`flex items-start gap-3 p-3.5 rounded-xl border ${cfg.border} ${cfg.bg}`}
            >
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
                <Icon size={16} className={cfg.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-600 mb-1">
                  {item.label}
                </p>
                <Tooltip title="Click to copy">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(item.url);
                      message.success("Webhook URL copied!");
                    }}
                    className="w-full text-left cursor-pointer"
                  >
                    <code className="text-xs text-slate-500 bg-white/80 px-2 py-1 rounded-md border border-slate-200/50 block truncate">
                      {item.url}
                    </code>
                  </button>
                </Tooltip>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WebhookEndpoints;
