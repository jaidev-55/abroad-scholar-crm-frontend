import React, { useMemo } from "react";
import {
  RiPhoneLine,
  RiMailLine,
  RiMapPinLine,
  RiBuilding2Line,
  RiGraduationCapLine,
  RiCalendarLine,
  RiUserSmileLine,
  RiMoneyDollarCircleLine,
  RiShieldCheckLine,
  RiAlertLine,
} from "react-icons/ri";
import type { EnrolledStudent } from "../Types";
import UserAvatar from "./UserAvatar";

const VISA_COLOR_MAP: Record<string, string> = {
  NOT_STARTED: "bg-slate-100 text-slate-600",
  IN_PROGRESS: "bg-blue-50 text-blue-600",
  APPROVED: "bg-emerald-50 text-emerald-600",
  REJECTED: "bg-red-50 text-red-600",
};

const formatLabel = (s: string) =>
  s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const StudentOverviewCard: React.FC<{
  student: EnrolledStudent | null;
}> = ({ student }) => {
  const daysToIntake = useMemo(() => {
    if (!student) return 0;
    if (student.daysToIntake != null) return student.daysToIntake;
    const now = new Date();
    return Math.ceil(
      (new Date(student.intakeDate).getTime() - now.getTime()) / 86_400_000,
    );
  }, [student]);

  if (!student) {
    return (
      <div className="overflow-hidden">
        <div className="bg-blue-500 px-6 py-5 h-24 animate-pulse" />
        <div className="grid grid-cols-4 gap-px bg-slate-100 h-14 animate-pulse" />
      </div>
    );
  }

  const feePercent =
    student.feePercent ??
    (student.totalFee > 0
      ? Math.round((student.feePaid / student.totalFee) * 100)
      : 0);

  const activeRisks = student.risks?.filter((r) => !r.isResolved) ?? [];

  const infoItems = [
    {
      icon: <RiMapPinLine size={14} />,
      label: "Country",
      value: student.country,
      color: "text-blue-600",
    },
    {
      icon: <RiBuilding2Line size={14} />,
      label: "University",
      value: student.university,
      color: "text-violet-600",
    },
    {
      icon: <RiGraduationCapLine size={14} />,
      label: "Course",
      value: student.course,
      color: "text-indigo-600",
    },
    {
      icon: <RiCalendarLine size={14} />,
      label: "Intake",
      value: new Date(student.intakeDate).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      color: "text-amber-600",
    },
    {
      icon: <RiUserSmileLine size={14} />,
      label: "Counselor",
      value: student.counselor?.name ?? "—",
      color: "text-teal-600",
    },
    {
      icon: <RiMoneyDollarCircleLine size={14} />,
      label: "Fee Status",
      value: (
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold">{feePercent}%</span>
          <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                feePercent >= 100
                  ? "bg-emerald-500"
                  : feePercent > 0
                    ? "bg-amber-500"
                    : "bg-slate-300"
              }`}
              style={{ width: `${Math.min(feePercent, 100)}%` }}
            />
          </div>
        </div>
      ),
      color: "text-emerald-600",
    },
    {
      icon: <RiShieldCheckLine size={14} />,
      label: "Visa",
      value: (
        <span
          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
            VISA_COLOR_MAP[student.visaStatus] ?? "bg-slate-100 text-slate-600"
          }`}
        >
          {formatLabel(student.visaStatus)}
        </span>
      ),
      color: "text-cyan-600",
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Header */}
      <div className="bg-blue-500 px-6 py-5 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <UserAvatar name={student.fullName} size="xl" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-extrabold text-white leading-tight">
                {student.fullName}
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-white/20 text-[11px] font-bold text-white/90 border border-white/25">
                {student.studentId}
              </span>
              {/* Stage badge */}
              <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-semibold text-white/80 border border-white/20">
                {formatLabel(student.stage)}
              </span>
            </div>
            <p className="text-sm text-white/70 mt-0.5 flex items-center gap-1.5 flex-wrap">
              <RiPhoneLine size={13} /> {student.phone}
              <span className="text-white/30 mx-1">•</span>
              <RiMailLine size={13} /> {student.email}
            </p>
          </div>

          {/* Intake countdown */}
          <div className="text-right shrink-0 hidden sm:block">
            <div className="text-[10px] uppercase tracking-wider text-white/50 font-semibold mb-0.5">
              Intake Countdown
            </div>
            <div className="text-3xl font-extrabold text-white leading-none">
              {daysToIntake > 0 ? daysToIntake : 0}
            </div>
            <div className="text-[11px] text-white/60 font-medium">
              {daysToIntake < 0 ? "days ago" : "days to go"}
            </div>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 divide-x divide-slate-100">
        {infoItems.map((item, idx) => (
          <div key={idx} className="px-4 py-3 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`${item.color} opacity-70`}>{item.icon}</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate">
                {item.label}
              </span>
            </div>
            <div className="text-[13px] font-semibold text-slate-800 truncate">
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Risk Alerts */}
      {activeRisks.length > 0 && (
        <div className="flex items-center gap-2 px-5 py-2.5 bg-red-50/60 border-t border-red-100 flex-wrap">
          <RiAlertLine size={14} className="text-red-500 shrink-0" />
          <span className="text-[11px] font-semibold text-red-600">
            Alerts:
          </span>
          <div className="flex gap-1.5 flex-wrap">
            {activeRisks.map((risk) => (
              <span
                key={risk.id}
                className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-red-100 text-red-700 border border-red-200"
              >
                {risk.message}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentOverviewCard;
