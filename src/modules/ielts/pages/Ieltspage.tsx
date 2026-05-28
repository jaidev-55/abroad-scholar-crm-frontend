import React, { useState, useCallback } from "react";
import { message } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RiAddLine, RiDownloadLine } from "react-icons/ri";
import AddEditIeltsModal from "../components/Addeditieltsmodal";
import IeltsDetailDrawer from "../components/Ieltsdetaildrawer";
import IeltsFilterBar from "../components/Ieltsfilterbar";
import IeltsStats from "../components/Ieltsstats";
import IeltsTable from "../components/Ieltstable";
import UpdateScoreModal from "../components/Updatescoremodal";
import type { IeltsRecord } from "../api/ielts";
import {
  getIeltsStats,
  getIeltsList,
  createIelts,
  updateIelts,
  updateIeltsScores,
  deleteIelts,
  type CreateIeltsPayload,
  type UpdateScoresPayload,
} from "../api/ielts";
import { getUsers } from "../../../api/auth";
import type { IeltsFilters } from "../Types";

const IeltsPage: React.FC = () => {
  const queryClient = useQueryClient();

  // ── Filters ──
  const [filters, setFilters] = useState<IeltsFilters>({
    search: "",
    status: "",
    counselor: "",
    country: "",
    examType: "",
  });
  const [page, setPage] = useState(1);

  // ── Modals ──
  const [detailRecord, setDetailRecord] = useState<IeltsRecord | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [scoreRecord, setScoreRecord] = useState<IeltsRecord | null>(null);
  const [scoreOpen, setScoreOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<IeltsRecord | null>(null);
  const [addEditOpen, setAddEditOpen] = useState(false);

  // ── Query params ──
  const query = {
    page,
    limit: 20,
    ...(filters.search && { search: filters.search }),
    ...(filters.status && { status: filters.status }),
    ...(filters.examType && { examType: filters.examType }),
    ...(filters.counselor && { counselorId: filters.counselor }),
  };

  // ── Queries ──
  const {
    data: listData,
    isLoading: listLoading,

    isFetching,
  } = useQuery({
    queryKey: ["ielts-list", query],
    queryFn: () => getIeltsList(query),
    staleTime: 30_000,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["ielts-stats"],
    queryFn: getIeltsStats,
    staleTime: 30_000,
  });

  const { data: counselorUsers = [] } = useQuery({
    queryKey: ["counselors"],
    queryFn: () => getUsers("COUNSELOR"),
    staleTime: 5 * 60 * 1000,
  });

  // ── Mutations ──
  const { mutate: handleCreate, isPending: isCreating } = useMutation({
    mutationFn: (payload: CreateIeltsPayload) => createIelts(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ielts-list"] });
      queryClient.invalidateQueries({ queryKey: ["ielts-stats"] });
      message.success("Student added to IELTS tracking!");
      setAddEditOpen(false);
    },
    onError: () => message.error("Failed to add student"),
  });

  const { mutate: handleUpdate, isPending: isUpdating } = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: CreateIeltsPayload;
    }) => updateIelts(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ielts-list"] });
      queryClient.invalidateQueries({ queryKey: ["ielts-stats"] });
      message.success("Record updated!");
      setAddEditOpen(false);
    },
    onError: () => message.error("Failed to update record"),
  });

  const { mutate: handleScoreUpdate, isPending: isUpdatingScore } = useMutation(
    {
      mutationFn: ({
        id,
        payload,
      }: {
        id: string;
        payload: UpdateScoresPayload;
      }) => updateIeltsScores(id, payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["ielts-list"] });
        queryClient.invalidateQueries({ queryKey: ["ielts-stats"] });
        message.success("Scores updated successfully!");
        setScoreOpen(false);
      },
      onError: () => message.error("Failed to update scores"),
    },
  );

  const { mutate: handleDelete } = useMutation({
    mutationFn: (id: string) => deleteIelts(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ielts-list"] });
      queryClient.invalidateQueries({ queryKey: ["ielts-stats"] });
      message.success("Record deleted");
    },
    onError: () => message.error("Failed to delete record"),
  });

  // ── Export CSV ──
  const handleExport = useCallback(() => {
    const records = listData?.data ?? [];
    if (!records.length) return message.warning("No data to export");

    const headers = [
      "Student",
      "Country",
      "Type",
      "Status",
      "Exam Date",
      "L",
      "R",
      "W",
      "S",
      "Overall",
      "Target",
      "Counselor",
      "Attempts",
    ];
    const rows = records.map((r) => [
      r.studentName,
      r.country ?? "",
      r.examType,
      r.status,
      r.examDate ? new Date(r.examDate).toLocaleDateString() : "",
      r.currentL ?? "",
      r.currentR ?? "",
      r.currentW ?? "",
      r.currentS ?? "",
      r.currentOA ?? "",
      r.requiredScore ?? "",
      r.counselor?.name ?? "Unassigned",
      r.attempts,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ielts-tracking.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [listData]);

  // ── Filter helpers ──
  const handleFilterChange = useCallback(
    (key: keyof IeltsFilters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setPage(1);
    },
    [],
  );

  const counselorOptions = counselorUsers.map(
    (c: { id: string; name: string }) => ({
      value: c.id,
      label: c.name,
    }),
  );

  const records = listData?.data ?? [];
  const isLoading = listLoading || isFetching;

  return (
    <div className="min-h-screen">
      <div className="mx-auto p-3 space-y-5">
        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              IELTS Tracking
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Monitor student IELTS preparation, scores & exam schedules
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              disabled={!records.length}
              className="h-9 px-3 rounded-xl border border-slate-200 text-slate-500 text-sm font-medium flex items-center gap-1.5 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <RiDownloadLine size={15} />
              Export
            </button>
            <button
              onClick={() => {
                setEditRecord(null);
                setAddEditOpen(true);
              }}
              className="h-9 px-4 rounded-xl bg-blue-500 text-white text-sm font-semibold flex items-center gap-1.5 hover:bg-blue-600 transition-colors shadow-l"
            >
              <RiAddLine size={16} />
              Add Student
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <IeltsStats stats={stats} isLoading={statsLoading} />

        {/* ── Filters ── */}
        <IeltsFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          counselorOptions={counselorOptions}
          totalCount={listData?.meta?.total ?? 0}
          filteredCount={records.length}
        />

        {/* ── Table ── */}
        <IeltsTable
          data={records}
          loading={isLoading}
          onView={(record) => {
            setDetailRecord(record);
            setDetailOpen(true);
          }}
          onEdit={(record) => {
            setEditRecord(record);
            setAddEditOpen(true);
          }}
          onUpdateScore={(record) => {
            setScoreRecord(record);
            setScoreOpen(true);
          }}
          onDelete={(record) => handleDelete(record.id)}
        />

        {/* ── Detail Drawer ── */}
        <IeltsDetailDrawer
          open={detailOpen}
          record={detailRecord}
          onClose={() => setDetailOpen(false)}
        />

        {/* ── Update Score Modal ── */}
        {scoreOpen && (
          <UpdateScoreModal
            open={scoreOpen}
            record={scoreRecord}
            onClose={() => setScoreOpen(false)}
            isLoading={isUpdatingScore}
            onSubmit={(payload: UpdateScoresPayload) => {
              if (!scoreRecord) return;
              handleScoreUpdate({ id: scoreRecord.id, payload });
            }}
          />
        )}

        {/* ── Add / Edit Modal ── */}
        {addEditOpen && (
          <AddEditIeltsModal
            open={addEditOpen}
            record={editRecord}
            onClose={() => setAddEditOpen(false)}
            isLoading={isCreating || isUpdating}
            onSubmit={(payload: CreateIeltsPayload) => {
              if (editRecord) {
                handleUpdate({ id: editRecord.id, payload });
              } else {
                handleCreate(payload);
              }
            }}
            counselorOptions={counselorOptions}
            studentOptions={[]}
          />
        )}
      </div>
    </div>
  );
};

export default IeltsPage;
