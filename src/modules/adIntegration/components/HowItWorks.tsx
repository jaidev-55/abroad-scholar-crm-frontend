import React from "react";
import {
  RiInformationLine,
  RiAddLine,
  RiSignalTowerLine,
  RiCheckLine,
} from "react-icons/ri";

const STEPS = [
  {
    step: "1",
    icon: RiAddLine,
    title: "Add your Form ID",
    desc: "Get the Form ID from Meta/Google Ads Manager and add it here.",
  },
  {
    step: "2",
    icon: RiSignalTowerLine,
    title: "Webhook auto-syncs",
    desc: "When someone fills your ad form, the lead is auto-created in CRM.",
  },
  {
    step: "3",
    icon: RiCheckLine,
    title: "Round-robin assigned",
    desc: "Each lead is auto-assigned to the next counselor in rotation.",
  },
];

const HowItWorks: React.FC = () => (
  <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-100 p-5">
    <div className="flex items-center gap-2 mb-3">
      <RiInformationLine size={16} className="text-blue-600" />
      <h3 className="text-sm font-bold text-slate-700">How it works</h3>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {STEPS.map((item) => (
        <div
          key={item.step}
          className="flex items-start gap-3 bg-white/60 rounded-xl p-3.5 border border-white"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
            {item.step}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">{item.title}</p>
            <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default HowItWorks;
