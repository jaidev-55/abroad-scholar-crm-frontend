import React from "react";
import { Table, ConfigProvider, Tooltip, Popover, Empty, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  RiArrowRightLine,
  RiAlertLine,
  RiCheckboxCircleLine,
  RiEditLine,
  RiDeleteBinLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiFileTextLine,
} from "react-icons/ri";
import type { EnrolledStudent, EnrollmentStage } from "../Types";
import UserAvatar from "./UserAvatar";

// ─── Props ────────────────────────────────────────────────────

interface EnrolledStudentsTableProps {
  data: EnrolledStudent[];
  loading: boolean;
  // Pagination (server-side)
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  // Sorting
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortChange: (col: string) => void;
  // Row actions
  onView: (student: EnrolledStudent) => void;
  onEdit: (student: EnrolledStudent) => void;
  onStageChange: (id: string, stage: EnrollmentStage) => void;
  onDelete: (student: EnrolledStudent) => void;
}

// ─── Badge maps ───────────────────────────────────────────────

const VISA_STYLES: Record<string, string> = {
  NOT_STARTED: "bg-slate-50 text-slate-600 border-slate-200",
  IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
};

const FEE_STYLES: Record<string, string> = {
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PARTIAL: "bg-amber-50 text-amber-700 border-amber-200",
  PENDING: "bg-slate-50 text-slate-600 border-slate-200",
};

const STAGE_ORDER: EnrollmentStage[] = [
  "LEAD_CONVERTED",
  "APPLICATION_SUBMITTED",
  "OFFER_RECEIVED",
  "FEE_PAID",
  "CAS_I20_ISSUED",
  "VISA_FILED",
  "VISA_APPROVED",
  "TRAVEL_DONE",
];

const formatLabel = (s: string) =>
  s
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

// ─── Component ────────────────────────────────────────────────

const EnrolledStudentsTable: React.FC<EnrolledStudentsTableProps> = ({
  data,
  loading,
  page,
  totalPages,
  total,
  onPageChange,
  onView,
  onEdit,
  onDelete,
}) => {
  const columns: ColumnsType<EnrolledStudent> = [
    // ── Student ──────────────────────────────────────────────
    {
      title: "Student",
      key: "fullName",
      width: 230,
      fixed: "left",
      render: (_: unknown, record: EnrolledStudent) => (
        <button
          onClick={() => onView(record)}
          className="flex items-center gap-2.5 bg-transparent border-none cursor-pointer p-0 text-left w-full group"
        >
          <UserAvatar name={record.fullName} size="md" />
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
              {record.fullName}
            </div>
            <div className="text-[11px] text-slate-400">
              {record.studentId} • {record.country}
            </div>
            {record.notes && (
              <Tooltip
                title={record.notes}
                placement="bottom"
                overlayStyle={{ maxWidth: 260 }}
                overlayInnerStyle={{
                  fontSize: 12,
                  padding: "8px 12px",
                  borderRadius: 10,
                }}
              >
                <span
                  className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-md text-[9px] font-medium bg-violet-50 text-violet-500 max-w-[170px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <RiFileTextLine size={9} className="shrink-0" />
                  <span className="truncate">{record.notes}</span>
                </span>
              </Tooltip>
            )}
          </div>
        </button>
      ),
    },

    // ── University / Course ───────────────────────────────────
    {
      title: "University",
      key: "university",
      width: 200,
      render: (_: unknown, r: EnrolledStudent) => (
        <div className="min-w-0">
          <div className="text-[13px] font-medium text-slate-800 truncate">
            {r.university}
          </div>
          <div className="text-[11px] text-slate-400 truncate">{r.course}</div>
        </div>
      ),
    },

    // ── Stage ─────────────────────────────────────────────────
    {
      title: "Stage",
      key: "stage",
      width: 190,
      render: (_: unknown, r: EnrolledStudent) => {
        const idx = STAGE_ORDER.indexOf(r.stage);
        const percent = Math.round(((idx + 1) / STAGE_ORDER.length) * 100);
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  percent === 100 ? "bg-emerald-500" : "bg-blue-500"
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="text-[11px] font-semibold text-slate-600 whitespace-nowrap">
              {formatLabel(r.stage)}
            </span>
          </div>
        );
      },
    },

    // ── Visa ──────────────────────────────────────────────────
    {
      title: "Visa",
      key: "visaStatus",
      width: 120,
      render: (_: unknown, r: EnrolledStudent) => (
        <span
          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
            VISA_STYLES[r.visaStatus] ??
            "bg-slate-50 text-slate-600 border-slate-200"
          }`}
        >
          {formatLabel(r.visaStatus)}
        </span>
      ),
    },

    // ── Fee ───────────────────────────────────────────────────
    {
      title: "Fee",
      key: "fee",
      width: 150,
      render: (_: unknown, r: EnrolledStudent) => {
        const pct =
          r.feePercent ??
          (r.totalFee > 0 ? Math.round((r.feePaid / r.totalFee) * 100) : 0);
        return (
          <div className="flex items-center gap-2">
            <div className="w-10 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  pct >= 100
                    ? "bg-emerald-500"
                    : pct > 0
                      ? "bg-amber-500"
                      : "bg-slate-300"
                }`}
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
            <span
              className={`text-[11px] font-semibold border px-1.5 py-0.5 rounded-md ${
                FEE_STYLES[r.feeStatus] ??
                "bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              {pct}%
            </span>
          </div>
        );
      },
    },

    // ── Counselor ─────────────────────────────────────────────
    {
      title: "Counselor",
      key: "counselor",
      width: 140,
      render: (_: unknown, r: EnrolledStudent) => (
        <span className="text-[13px] text-slate-600">
          {r.counselor?.name ?? "—"}
        </span>
      ),
    },

    // ── Intake ────────────────────────────────────────────────
    {
      title: "Intake",
      key: "intakeDate",
      width: 100,
      render: (_: unknown, r: EnrolledStudent) => (
        <div>
          <span className="text-xs font-medium text-slate-500">
            {new Date(r.intakeDate).toLocaleDateString("en-GB", {
              month: "short",
              year: "numeric",
            })}
          </span>
          {r.daysToIntake !== undefined && (
            <div
              className={`text-[10px] font-medium mt-0.5 ${
                r.daysToIntake < 0
                  ? "text-slate-400"
                  : r.daysToIntake <= 30
                    ? "text-red-500"
                    : r.daysToIntake <= 60
                      ? "text-amber-500"
                      : "text-slate-400"
              }`}
            >
              {r.daysToIntake < 0 ? "Past" : `${r.daysToIntake}d left`}
            </div>
          )}
        </div>
      ),
    },

    // ── Risks ─────────────────────────────────────────────────
    {
      title: "Risks",
      key: "risks",
      width: 80,
      render: (_: unknown, r: EnrolledStudent) => {
        const activeRisks = r.risks?.filter((risk) => !risk.isResolved) ?? [];
        return activeRisks.length > 0 ? (
          <Popover
            content={
              <div className="flex flex-col gap-1 max-w-[220px]">
                {activeRisks.map((risk) => (
                  <span
                    key={risk.id}
                    className="text-xs text-red-600 flex items-start gap-1"
                  >
                    <RiAlertLine size={11} className="mt-0.5 shrink-0" />
                    {risk.message}
                  </span>
                ))}
              </div>
            }
            title={
              <span className="text-xs font-bold text-red-700">
                Risk Alerts
              </span>
            }
          >
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-red-50 text-red-600 border border-red-200 cursor-pointer">
              <RiAlertLine size={11} /> {activeRisks.length}
            </span>
          </Popover>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
            <RiCheckboxCircleLine size={11} /> OK
          </span>
        );
      },
    },

    // ── Actions ───────────────────────────────────────────────
    {
      title: "",
      key: "actions",
      width: 90,
      fixed: "right",
      render: (_: unknown, record: EnrolledStudent) => (
        <div className="flex items-center gap-1">
          <Tooltip title="Edit">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(record);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <RiEditLine size={15} />
            </button>
          </Tooltip>
          <Tooltip title="Delete">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(record);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <RiDeleteBinLine size={15} />
            </button>
          </Tooltip>
          <Tooltip title="View Details">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(record);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <RiArrowRightLine size={15} />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: "#F8FAFC",
            headerColor: "#64748B",
            headerSplitColor: "transparent",
            rowHoverBg: "#F8FAFF",
            borderColor: "#F1F5F9",
            cellPaddingBlock: 14,
            cellPaddingInline: 16,
            fontSize: 13,
          },
        },
      }}
    >
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <Table<EnrolledStudent>
          dataSource={data}
          columns={columns}
          rowKey="id"
          loading={{
            spinning: loading,
            indicator: <Spin size="default" />,
          }}
          // Disable Ant Design's built-in pagination — we handle it ourselves
          pagination={false}
          scroll={{ x: 1300 }}
          size="middle"
          locale={{
            emptyText: (
              <Empty
                description="No enrolled students found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
          onRow={(record) => ({
            onClick: () => onView(record),
            style: { cursor: "pointer" },
          })}
        />

        {/* ── Server-side pagination footer ── */}
        {total > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-white">
            <span className="text-xs text-slate-400">
              Page {page} of {totalPages} &nbsp;·&nbsp; {total} students
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <RiArrowLeftSLine size={16} />
              </button>

              {/* Page number pills */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
                )
                .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                    acc.push("…");
                  }
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === "…" ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-1 text-xs text-slate-400"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => onPageChange(p as number)}
                      className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                        p === page
                          ? "bg-blue-500 text-white"
                          : "text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}

              <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <RiArrowRightSLine size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
};

export default EnrolledStudentsTable;
