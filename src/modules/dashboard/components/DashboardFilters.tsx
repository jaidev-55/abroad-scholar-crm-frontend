import React from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { DatePicker } from "antd";
import { HiOutlineCalendar, HiOutlineFilter } from "react-icons/hi";
import CustomSelect from "../../../components/common/CustomSelect";
import type { DateRange } from "../utils/constants";
import { DATE_RANGES } from "../utils/constants";
import type { FieldValues } from "react-hook-form";
import type { Dayjs } from "dayjs";
import { getUsers } from "../../users/api/user";

const { RangePicker } = DatePicker;

interface FilterValues {
  counselor: string;
  source: string;
}

interface Props {
  range: DateRange;
  onRangeChange: (r: DateRange) => void;
  onCounselorChange: (v: string) => void;
  onSourceChange: (v: string) => void;
  onCustomDateChange?: (start: Dayjs | null, end: Dayjs | null) => void;
}

const DashboardFilters: React.FC<Props> = ({
  range,
  onRangeChange,
  onCounselorChange,
  onSourceChange,
  onCustomDateChange,
}) => {
  const {
    control,
    formState: { errors },
  } = useForm<FilterValues>({
    defaultValues: { counselor: "all", source: "all" },
  });

  // Fetch real counselors from API
  const { data: counselors = [], isLoading: loadingCounselors } = useQuery({
    queryKey: ["users", "COUNSELOR"],
    queryFn: () => getUsers("COUNSELOR"),
    staleTime: 5 * 60_000,
  });

  const counselorOptions = [
    { value: "all", label: "All Counselors" },
    ...counselors.map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between flex-wrap">
        {/* Date range pills + RangePicker */}
        <div className="flex items-center gap-2 flex-wrap">
          <HiOutlineCalendar className="h-4 w-4 text-slate-400 shrink-0" />

          <div className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
            {DATE_RANGES.map((r) => (
              <button
                key={r.id}
                onClick={() => onRangeChange(r.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  range === r.id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {range === "custom" && (
            <RangePicker
              style={{ borderRadius: 10, fontSize: 12 }}
              placeholder={["Start date", "End date"]}
              onChange={(dates) => {
                onCustomDateChange?.(dates?.[0] ?? null, dates?.[1] ?? null);
              }}
              allowClear
              size="middle"
            />
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 text-xs font-medium text-slate-500 shrink-0">
            <HiOutlineFilter className="h-4 w-4" /> Filters:
          </div>

          {/* Counselor dropdown — real data from /auth/users?role=COUNSELOR */}
          <div className="w-40">
            <CustomSelect
              name="counselor"
              label=""
              placeholder={loadingCounselors ? "Loading..." : "All Counselors"}
              control={
                control as unknown as import("react-hook-form").Control<FieldValues>
              }
              errors={
                errors as unknown as import("react-hook-form").FieldErrors<FieldValues>
              }
              options={counselorOptions}
              onChange={(v) => onCounselorChange(v ?? "all")}
            />
          </div>

          {/* Source dropdown */}
          <div className="w-36">
            <CustomSelect
              name="source"
              label=""
              placeholder="All Sources"
              control={
                control as unknown as import("react-hook-form").Control<FieldValues>
              }
              errors={
                errors as unknown as import("react-hook-form").FieldErrors<FieldValues>
              }
              options={[
                { value: "all", label: "All Sources" },
                { value: "INSTAGRAM", label: "Instagram" },
                { value: "FACEBOOK", label: "Facebook" },
                { value: "WEBSITE", label: "Website" },
                { value: "REFERRAL", label: "Referral" },
                { value: "WALK_IN", label: "Walk In" },
                { value: "GOOGLE_ADS", label: "Google Ads" },
                { value: "META_ADS", label: "Meta Ads" },
                { value: "GOOGLE_SHEET", label: "Google Sheet" },
              ]}
              onChange={(v) => onSourceChange(v ?? "all")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFilters;
