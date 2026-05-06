import React from "react";
import { Table, Tooltip } from "antd";
import type { TableColumnsType } from "antd";
import {
  RiCalendarLine,
  RiErrorWarningLine,
  RiStickyNoteLine,
  RiTeamLine,
  RiGlobalLine,
  RiPhoneLine,
  RiMailLine,
  RiDeleteBinLine,
  RiCloseCircleLine,
  RiLoader4Line,
  RiBookOpenLine,
  RiBuilding2Line,
} from "react-icons/ri";
import type {
  ApiLead,
  LeadPriority,
  LeadStatus as ApiLeadStatus,
} from "../../../modules/leadsPipeline/api/leads";
import { PRIORITY_ORDER } from "../utils/constants";
import { Avatar, PriBadge, SrcBadge, StatusBadge } from "./Allleadsatoms";

interface Props {
  data: ApiLead[];
  isLoading: boolean;
  isError: boolean;
  isAdmin: boolean;
  today: string;
  hasFilters: boolean;
  selected: string[];
  onSelectChange: (keys: string[]) => void;
  onRowClick: (lead: ApiLead) => void;
  onDeleteClick: (id: string, name: string, e: React.MouseEvent) => void;
  onClearFilters: () => void;
  onRefetch: () => void;
}

const AllLeadsTable: React.FC<Props> = ({
  data,
  isLoading,
  isError,
  today,
  isAdmin,
  hasFilters,
  selected,
  onSelectChange,
  onRowClick,
  onDeleteClick,
  onClearFilters,
  onRefetch,
}) => {
  const CATEGORY_CONFIG = {
    ACADEMIC: {
      icon: <RiBookOpenLine size={10} />,
      label: "Academic",
      cls: "bg-violet-50 text-violet-700 border-violet-200",
    },
    ADMISSION: {
      icon: <RiBuilding2Line size={10} />,
      label: "Admission",
      cls: "bg-blue-50 text-blue-700 border-blue-200",
    },
  } as const;

  const CategoryBadge: React.FC<{ category?: string | null }> = ({
    category,
  }) => {
    if (!category) return <span className="text-[11px] text-slate-300">—</span>;
    const cfg = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
    if (!cfg) return <span className="text-[11px] text-slate-300">—</span>;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${cfg.cls}`}
      >
        {cfg.icon} {cfg.label}
      </span>
    );
  };
  const baseColumns: TableColumnsType<ApiLead> = [
    {
      title: (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Student
        </span>
      ),
      dataIndex: "fullName",
      key: "name",
      width: 180,
      ellipsis: true,
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
      render: (name: string, rec: ApiLead) => (
        <Tooltip title={`${name} · ${rec.country ?? ""}`} mouseEnterDelay={0.5}>
          <div className="flex items-center gap-2.5 py-0.5 w-full overflow-hidden group/row">
            <Avatar name={name} size={34} />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold text-slate-900 truncate leading-tight">
                {name}
              </div>
              <div className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                <RiGlobalLine size={9} /> {rec.country}
              </div>
            </div>
            {/* Delete button — only visible on row hover, only for admin */}
            {isAdmin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteClick(rec.id, rec.fullName, e);
                }}
                className="opacity-0 group-hover/row:opacity-100 w-6 h-6 flex items-center justify-center rounded-md hover:bg-red-50 text-slate-300 hover:text-red-500 border-none cursor-pointer transition-all shrink-0"
              >
                <RiDeleteBinLine size={13} />
              </button>
            )}
            {rec.status === "LOST" && (
              <Tooltip title="Lost">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              </Tooltip>
            )}
          </div>
        </Tooltip>
      ),
    },
    {
      title: (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Contact
        </span>
      ),
      key: "contact",
      width: 150,
      align: "center",
      render: (_: unknown, rec: ApiLead) => (
        <div className="flex flex-col gap-0.5">
          <a
            href={`tel:${rec.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-slate-600 hover:text-blue-600 flex items-center gap-1 no-underline transition-colors"
          >
            <RiPhoneLine size={11} className="text-slate-400 shrink-0" />
            {rec.phone}
          </a>
          {rec.email && (
            <a
              href={`mailto:${rec.email}`}
              onClick={(e) => e.stopPropagation()}
              className="text-[11px] text-slate-400 hover:text-blue-600 flex items-center gap-1 no-underline transition-colors truncate max-w-[200px]"
            >
              <RiMailLine size={11} className="shrink-0" />
              {rec.email}
            </a>
          )}
        </div>
      ),
    },
    {
      title: (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Status
        </span>
      ),
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (s: ApiLeadStatus) => (
        <div className="flex justify-center">
          <StatusBadge s={s} />
        </div>
      ),
    },
    {
      title: (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Source
        </span>
      ),
      dataIndex: "source",
      key: "source",
      width: 120,
      align: "center",
      render: (src: string) => <SrcBadge src={src} />,
    },
    {
      title: (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Category
        </span>
      ),
      dataIndex: "category",
      key: "category",
      width: 110,
      align: "center" as const,
      render: (_: unknown, rec: ApiLead) => (
        <div className="flex justify-center">
          <CategoryBadge category={rec.category} />
        </div>
      ),
    },
    {
      title: (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Priority
        </span>
      ),
      dataIndex: "priority",
      key: "priority",
      width: 90,
      align: "center",
      sorter: (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority],
      render: (p: LeadPriority) => (
        <div className="flex justify-center">
          <PriBadge p={p} />
        </div>
      ),
    },
    {
      title: (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Counselor
        </span>
      ),
      key: "counselor",
      width: 130,
      align: "center",
      render: (_: unknown, rec: ApiLead) => {
        const name = rec.counselor?.name;
        return !name ? (
          <span className="text-[11px] text-slate-300">Unassigned</span>
        ) : (
          <div className="flex items-center justify-center gap-1.5">
            <Avatar name={name} size={22} />
            <span className="text-xs text-slate-600">{name.split(" ")[0]}</span>
          </div>
        );
      },
    },
    {
      title: (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          IELTS
        </span>
      ),
      dataIndex: "ieltsScore",
      key: "ielts",
      width: 70,
      align: "center",
      render: (v: number | null) =>
        v != null ? (
          <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-lg border border-violet-200">
            {v}
          </span>
        ) : (
          <span className="text-[11px] text-slate-300">—</span>
        ),
    },
    {
      title: (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Follow-up
        </span>
      ),
      dataIndex: "followUpDate",
      key: "followUp",
      width: 115,
      align: "center",
      sorter: (a, b) =>
        new Date(a.followUpDate ?? 0).getTime() -
        new Date(b.followUpDate ?? 0).getTime(),
      render: (date: string | null) => {
        if (!date) return <span className="text-[11px] text-slate-300">—</span>;
        const d = date.split("T")[0];
        const overdue = d < today;
        const isToday = d === today;
        return (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold border ${
              overdue
                ? "bg-red-50 text-red-600 border-red-200"
                : isToday
                  ? "bg-amber-50 text-amber-600 border-amber-200"
                  : "bg-slate-50 text-slate-500 border-slate-200"
            }`}
          >
            <RiCalendarLine size={10} />
            {new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
            {overdue && <RiErrorWarningLine size={10} className="ml-0.5" />}
          </span>
        );
      },
    },
    {
      title: (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Notes
        </span>
      ),
      key: "notes",
      width: 75,
      align: "center",
      render: (_: unknown, rec: ApiLead) => {
        const n = rec.notes?.length ?? 0;
        return (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] font-semibold ${
              n > 0
                ? "bg-blue-50 text-blue-600 border-blue-200"
                : "bg-slate-50 text-slate-400 border-slate-200"
            }`}
          >
            <RiStickyNoteLine size={11} />
            {n}
          </span>
        );
      },
    },
    {
      title: (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Created
        </span>
      ),
      dataIndex: "createdAt",
      defaultSortOrder: "descend",
      key: "createdAt",
      width: 95,
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (d: string) => (
        <span className="text-[11px] text-slate-400">
          {new Date(d).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "2-digit",
          })}
        </span>
      ),
    },
  ];

  const columns = isAdmin
    ? baseColumns
    : baseColumns.filter((col) => (col as { key?: string }).key !== "source");

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
      {isError && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <RiCloseCircleLine size={32} className="text-red-300" />
          <p className="text-sm font-semibold text-slate-500">
            Failed to load leads
          </p>
          <button
            onClick={onRefetch}
            className="text-[13px] text-blue-600 underline bg-transparent border-none cursor-pointer"
          >
            Try again
          </button>
        </div>
      )}

      {!isError && (
        <Table
          rowSelection={{
            selectedRowKeys: selected,
            onChange: (keys) => onSelectChange(keys as string[]),
            columnWidth: 44,
          }}
          dataSource={data}
          columns={columns}
          rowKey="id"
          className="[&_.ant-table-container]:!rounded-none [&_.ant-table-body]:!overflow-x-auto"
          scroll={{ x: true, y: 560 }}
          size="small"
          loading={{
            spinning: isLoading,
            indicator: (
              <RiLoader4Line size={24} className="animate-spin text-blue-500" />
            ),
          }}
          onRow={(rec) => ({
            onClick: () => onRowClick(rec),
            className: `cursor-pointer transition-colors ${
              rec.status === "LOST" ? "opacity-60" : ""
            }`,
          })}
          pagination={{
            pageSize: 15,
            showSizeChanger: true,
            pageSizeOptions: ["10", "15", "25", "50"],
            showTotal: (t: number, r: [number, number]) => (
              <span className="text-xs text-slate-400">
                {r[0]}–{r[1]} of <strong className="text-slate-600">{t}</strong>{" "}
                leads
              </span>
            ),
          }}
          locale={{
            emptyText: (
              <div className="py-16 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <RiTeamLine size={24} className="text-slate-300" />
                </div>
                <p className="text-sm font-semibold text-slate-400">
                  No leads found
                </p>
                {hasFilters && (
                  <button
                    onClick={onClearFilters}
                    className="text-[13px] text-blue-600 underline bg-transparent border-none cursor-pointer"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ),
          }}
        />
      )}
    </div>
  );
};

export default AllLeadsTable;
