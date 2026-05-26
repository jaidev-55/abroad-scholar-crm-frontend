import {
  RiMetaLine,
  RiGoogleLine,
  RiFileCopyLine,
  RiRefreshLine,
  RiEyeLine,
  RiEyeOffLine,
  RiAddLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
} from "react-icons/ri";
import { useState } from "react";
import type { WebhookConfig } from "../types";

interface Props {
  webhooks: WebhookConfig[];
}

const WebhooksSection: React.FC<Props> = ({ webhooks }) => {
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const toggleSecret = (id: string) => {
    setShowSecrets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Webhook Endpoints
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure incoming webhook URLs for lead capture
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer">
            <RiAddLine size={13} />
            Add Webhook
          </button>
        </div>

        <div className="space-y-3">
          {webhooks.map((wh) => (
            <div
              key={wh.id}
              className={`border rounded-xl p-5 transition-colors ${wh.isActive ? "border-slate-200" : "border-slate-100 bg-slate-50/50 opacity-70"}`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${wh.platform === "meta" ? "bg-blue-50" : "bg-red-50"}`}
                  >
                    {wh.platform === "meta" ? (
                      <RiMetaLine size={20} className="text-blue-600" />
                    ) : (
                      <RiGoogleLine size={20} className="text-red-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 capitalize">
                      {wh.platform} Webhook
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {wh.isActive ? (
                        <RiCheckboxCircleLine
                          size={11}
                          className="text-emerald-500"
                        />
                      ) : (
                        <RiCloseCircleLine
                          size={11}
                          className="text-slate-400"
                        />
                      )}
                      <span
                        className={`text-[10px] font-medium ${wh.isActive ? "text-emerald-600" : "text-slate-400"}`}
                      >
                        {wh.isActive ? "Active" : "Inactive"}
                      </span>
                      {wh.lastPing && (
                        <span className="text-[10px] text-slate-400">
                          · Last ping:{" "}
                          {new Date(wh.lastPing).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200">
                  <RiRefreshLine size={12} />
                  Test
                </button>
              </div>

              {/* URL */}
              <div className="mb-3">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">
                  Webhook URL
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                    <code className="text-[11px] text-slate-600 break-all">
                      {wh.webhookUrl}
                    </code>
                  </div>
                  <button
                    onClick={() => copyToClipboard(wh.webhookUrl)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Copy URL"
                  >
                    <RiFileCopyLine size={14} className="text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Secret */}
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">
                  Secret Key
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                    <code className="text-[11px] text-slate-600">
                      {showSecrets[wh.id] ? wh.secret : "••••••••••••••••"}
                    </code>
                  </div>
                  <button
                    onClick={() => toggleSecret(wh.id)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    {showSecrets[wh.id] ? (
                      <RiEyeOffLine size={14} className="text-slate-400" />
                    ) : (
                      <RiEyeLine size={14} className="text-slate-400" />
                    )}
                  </button>
                  <button
                    onClick={() => copyToClipboard(wh.secret)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    <RiFileCopyLine size={14} className="text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebhooksSection;
