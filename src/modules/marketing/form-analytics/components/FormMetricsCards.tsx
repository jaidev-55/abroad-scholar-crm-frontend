import {
  RiFileList3Line,
  RiUserLine,
  RiLoopLeftLine,
  RiExchangeLine,
  RiTimeLine,
  RiLayoutGridLine,
} from "react-icons/ri";
import type { FormMetrics } from "../types";
import type { IconType } from "react-icons";

interface CardDef {
  key: keyof FormMetrics;
  label: string;
  icon: IconType;
  twIconBg: string;
  twIconText: string;
  twBarBg: string;
  suffix?: string;
}

const cards: CardDef[] = [
  {
    key: "totalSubmissions",
    label: "TOTAL SUBMISSIONS",
    icon: RiFileList3Line,
    twIconBg: "bg-blue-50",
    twIconText: "text-blue-500",
    twBarBg: "bg-blue-500",
  },
  {
    key: "uniqueLeads",
    label: "UNIQUE LEADS",
    icon: RiUserLine,
    twIconBg: "bg-emerald-50",
    twIconText: "text-emerald-500",
    twBarBg: "bg-emerald-500",
  },
  {
    key: "syncRate",
    label: "SYNC RATE",
    icon: RiLoopLeftLine,
    twIconBg: "bg-violet-50",
    twIconText: "text-violet-500",
    twBarBg: "bg-violet-500",
    suffix: "%",
  },
  {
    key: "conversionRate",
    label: "CONVERSION RATE",
    icon: RiExchangeLine,
    twIconBg: "bg-amber-50",
    twIconText: "text-amber-500",
    twBarBg: "bg-amber-500",
    suffix: "%",
  },
  {
    key: "avgResponseTime",
    label: "AVG RESPONSE",
    icon: RiTimeLine,
    twIconBg: "bg-rose-50",
    twIconText: "text-rose-500",
    twBarBg: "bg-rose-500",
    suffix: " min",
  },
  {
    key: "activeForms",
    label: "ACTIVE FORMS",
    icon: RiLayoutGridLine,
    twIconBg: "bg-cyan-50",
    twIconText: "text-cyan-500",
    twBarBg: "bg-cyan-500",
  },
];

interface Props {
  metrics: FormMetrics;
  loading?: boolean;
}

const FormMetricsCards: React.FC<Props> = ({ metrics, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-100 p-4 h-[88px] animate-pulse"
          >
            <div className="h-2.5 bg-slate-100 rounded w-20 mb-3" />
            <div className="h-5 bg-slate-100 rounded w-12" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        const val = metrics[c.key];
        return (
          <div
            key={c.key}
            className="group bg-white rounded-2xl border border-slate-100 p-4 relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50 cursor-default"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 whitespace-nowrap">
                  {c.label}
                </p>
                <p className="text-2xl font-extrabold text-slate-900 leading-none tracking-tight">
                  {typeof val === "number" && val >= 1000
                    ? val.toLocaleString()
                    : val}
                  {c.suffix ?? ""}
                </p>
              </div>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${c.twIconBg}`}
              >
                <Icon size={17} className={c.twIconText} />
              </div>
            </div>
            <div
              className={`absolute bottom-0 left-0 right-0 h-[3px] ${c.twBarBg} opacity-60`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default FormMetricsCards;
