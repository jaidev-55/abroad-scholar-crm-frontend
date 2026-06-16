import React, { useState, useCallback } from "react";
import { message } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RiAddLine, RiDownloadLine } from "react-icons/ri";
import FilterBar from "../components/Filterbar";
import StudentDetailDrawer from "../components/StudentDetailDrawer";
import EnrollStudentModal from "../components/EnrollStudentModal";
import StatsCards from "../components/Statscards";
import {
  getEnrolledStats,
  getEnrolledList,
  getEnrolledFilterOptions,
  updateEnrolledStage,
  deleteEnrolledStudent,
  exportEnrolledStudents,
  enrollFromLead,
  type EnrolledStudent,
  type EnrolledQuery,
  type EnrollmentStage,
  type CreateEnrolledStudentPayload,
} from "../api/ Enrolledapi";
import EnrolledStudentsTable from "../components/Enrolledstudentstable";

interface EnrolledFilters {
  search: string;
  country: string;
  counselorId: string;
  visaStatus: string;
  stage: string;
  feeStatus: string;
}

const EnrolledStudentsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<EnrolledFilters>({
    search: "",
    country: "",
    counselorId: "",
    visaStatus: "",
    stage: "",
    feeStatus: "",
  });
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [selectedStudent, setSelectedStudent] =
    useState<EnrolledStudent | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const [enrollOpen, setEnrollOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<EnrolledStudent | null>(null);

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    record: EnrolledStudent | null;
  }>({ open: false, record: null });

  // ── Build query params ────────────────────────────────────────
  const query: EnrolledQuery = {
    page,
    limit: 20,
    sortBy,
    sortOrder,
    ...(filters.search && { search: filters.search }),
    ...(filters.country && { country: filters.country }),
    ...(filters.counselorId && { counselorId: filters.counselorId }),
    ...(filters.visaStatus && {
      visaStatus: filters.visaStatus as EnrolledQuery["visaStatus"],
    }),
    ...(filters.stage && {
      stage: filters.stage as EnrollmentStage,
    }),
    ...(filters.feeStatus && {
      feeStatus: filters.feeStatus as EnrolledQuery["feeStatus"],
    }),
  };

  // ── Queries ───────────────────────────────────────────────────

  const {
    data: listData,
    isLoading: listLoading,
    isFetching,
  } = useQuery({
    queryKey: ["enrolled-list", query],
    queryFn: () => getEnrolledList(query),
    staleTime: 30_000,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["enrolled-stats"],
    queryFn: getEnrolledStats,
    staleTime: 30_000,
  });

  const { data: filterOptions } = useQuery({
    queryKey: ["enrolled-filter-options"],
    queryFn: getEnrolledFilterOptions,
    staleTime: 5 * 60 * 1000,
  });

  // ── Mutations ─────────────────────────────────────────────────

  const { mutate: handleStageChange } = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: EnrollmentStage }) =>
      updateEnrolledStage(id, stage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrolled-list"] });
      queryClient.invalidateQueries({ queryKey: ["enrolled-stats"] });
      message.success("Stage updated");
    },
    onError: () => message.error("Failed to update stage"),
  });

  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteEnrolledStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrolled-list"] });
      queryClient.invalidateQueries({ queryKey: ["enrolled-stats"] });
      message.success("Student deleted");
      setDeleteModal({ open: false, record: null });
      // Close drawer if the deleted student was open
      if (deleteModal.record?.id === selectedStudent?.id) {
        setDetailOpen(false);
        setSelectedStudent(null);
      }
    },
    onError: () => message.error("Failed to delete student"),
  });

  const { mutate: handleEnrollSubmit, isPending: isEnrolling } = useMutation({
    mutationFn: ({
      leadId,
      payload,
    }: {
      leadId: string;
      payload: Partial<CreateEnrolledStudentPayload>;
    }) => enrollFromLead(leadId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrolled-list"] });
      queryClient.invalidateQueries({ queryKey: ["enrolled-stats"] });
      message.success("Student enrolled successfully!");
      setEnrollOpen(false);
      setEditRecord(null);
    },
    onError: () => message.error("Failed to enroll student"),
  });

  // ── Export CSV ────────────────────────────────────────────────
  const handleExport = useCallback(async () => {
    try {
      const all = await exportEnrolledStudents();
      if (!all.length) return message.warning("No data to export");

      const headers = [
        "Student ID",
        "Name",
        "Phone",
        "Email",
        "Country",
        "University",
        "Course",
        "Intake Date",
        "Stage",
        "Visa Status",
        "Fee Status",
        "Total Fee",
        "Fee Paid",
        "Currency",
        "Counselor",
        "At Risk",
      ];

      const rows = all.map((s) => [
        s.studentId,
        s.fullName,
        s.phone,
        s.email,
        s.country,
        s.university,
        s.course,
        new Date(s.intakeDate).toLocaleDateString(),
        s.stage,
        s.visaStatus,
        s.feeStatus,
        s.totalFee,
        s.feePaid,
        s.feeCurrency,
        s.counselor?.name ?? "Unassigned",
        s.risks?.some((r) => !r.isResolved) ? "Yes" : "No",
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
      a.download = `enrolled-students-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      message.error("Export failed");
    }
  }, []);

  // ── Filter helpers ────────────────────────────────────────────
  const handleFilterChange = useCallback(
    (key: keyof EnrolledFilters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setPage(1);
    },
    [],
  );

  const handleSortChange = useCallback(
    (col: string) => {
      if (sortBy === col) {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortBy(col);
        setSortOrder("desc");
      }
      setPage(1);
    },
    [sortBy],
  );

  // ── Derived values ────────────────────────────────────────────
  const records = listData?.data ?? [];
  const isLoading = listLoading || isFetching;

  const counselorOptions = (filterOptions?.counselors ?? []).map((c) => ({
    value: c.id,
    label: c.name,
  }));

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      <div className="mx-auto p-3 space-y-5">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Enrolled Students
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Manage student enrollments, visa tracking & pre-departure
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
                setEnrollOpen(true);
              }}
              className="h-9 px-4 rounded-xl bg-blue-500 text-white text-sm font-semibold flex items-center gap-1.5 hover:bg-blue-600 transition-colors shadow-sm"
            >
              <RiAddLine size={16} />
              Enroll Student
            </button>
          </div>
        </div>

        {/* Stats */}
        <StatsCards stats={stats} isLoading={statsLoading} />

        {/* Filters */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          countries={filterOptions?.countries ?? []}
          counselorOptions={counselorOptions}
          visaStatuses={filterOptions?.visaStatuses ?? []}
          stages={filterOptions?.stages ?? []}
          feeStatuses={filterOptions?.feeStatuses ?? []}
          totalCount={listData?.meta?.total ?? 0}
          filteredCount={records.length}
        />

        {/* Table */}
        <EnrolledStudentsTable
          data={records}
          loading={isLoading}
          page={page}
          totalPages={listData?.meta?.totalPages ?? 1}
          total={listData?.meta?.total ?? 0}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onPageChange={setPage}
          onSortChange={handleSortChange}
          onView={(student) => {
            setSelectedStudent(student);
            setDetailOpen(true);
          }}
          onEdit={(student) => {
            setEditRecord(student);
            setEnrollOpen(true);
          }}
          onStageChange={(id, stage) => handleStageChange({ id, stage })}
          onDelete={(student) =>
            setDeleteModal({ open: true, record: student })
          }
        />

        {/* Student Detail Drawer */}
        <StudentDetailDrawer
          open={detailOpen}
          student={selectedStudent}
          onClose={() => {
            setDetailOpen(false);
            setSelectedStudent(null);
          }}
          onStudentUpdated={(updated) => {
            setSelectedStudent(updated);
            queryClient.invalidateQueries({ queryKey: ["enrolled-list"] });
            queryClient.invalidateQueries({ queryKey: ["enrolled-stats"] });
          }}
        />

        {/* Enroll / Edit Modal */}
        {enrollOpen && (
          <EnrollStudentModal
            open={enrollOpen}
            record={editRecord}
            onClose={() => {
              setEnrollOpen(false);
              setEditRecord(null);
            }}
            isLoading={isEnrolling}
            counselorOptions={counselorOptions}
            onSubmit={(leadId, payload) =>
              handleEnrollSubmit({ leadId, payload })
            }
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ["enrolled-list"] });
              queryClient.invalidateQueries({ queryKey: ["enrolled-stats"] });
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
              <h3 className="text-base font-semibold text-slate-900 mb-1">
                Delete Student
              </h3>
              <p className="text-sm text-slate-500 mb-5">
                Are you sure you want to delete{" "}
                <span className="font-medium text-slate-700">
                  {deleteModal.record?.fullName}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteModal({ open: false, record: null })}
                  className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (deleteModal.record) handleDelete(deleteModal.record.id);
                  }}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-60"
                >
                  {isDeleting ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrolledStudentsPage;
