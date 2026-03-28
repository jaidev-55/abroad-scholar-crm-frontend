import type { IconType } from "react-icons";

interface StatCardProps {
  label: string;
  value: number;
  icon: IconType;
  twIconBg: string;
  twIconText: string;
  twBarBg: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  twIconBg,
  twIconText,
  twBarBg,
}) => {
  return (
    <div className="group bg-white rounded-2xl border border-slate-100 p-4 relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50 cursor-default w-full">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 whitespace-nowrap">
            {label}
          </p>
          <p className="text-2xl font-extrabold text-slate-900 leading-none tracking-tight">
            {value}
          </p>
        </div>

        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${twIconBg}`}
        >
          <Icon size={17} className={twIconText} />
        </div>
      </div>

      <div
        className={`absolute bottom-0 left-0 right-0 h-[3px] ${twBarBg} opacity-60`}
      />
    </div>
  );
};

export default StatCard;
