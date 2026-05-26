import React, { useState, useMemo, useCallback } from "react";
import { message } from "antd";
import { RiAddLine, RiDownloadLine, RiRefreshLine } from "react-icons/ri";
import AddEditIeltsModal from "../components/Addeditieltsmodal";
import IeltsDetailDrawer from "../components/Ieltsdetaildrawer";
import IeltsFilterBar from "../components/Ieltsfilterbar";
import IeltsStats from "../components/Ieltsstats";
import IeltsTable from "../components/Ieltstable";
import UpdateScoreModal from "../components/Updatescoremodal";
import type { IeltsRecord, IeltsFilters } from "../Types";
import { DUMMY_IELTS_RECORDS } from "../utils/Dummydata";
import { calculateStats } from "../utils/Helpers";

const IeltsPage: React.FC = () => {
  const [records] = useState<IeltsRecord[]>(DUMMY_IELTS_RECORDS);
  const [loading, setLoading] = useState(false);

  // ── Filters ──
  const [filters, setFilters] = useState<IeltsFilters>({
    search: "",
    status: "",
    counselor: "",
    country: "",
    examType: "",
  });

  // ── Modals ──
  const [detailRecord, setDetailRecord] = useState<IeltsRecord | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [scoreRecord, setScoreRecord] = useState<IeltsRecord | null>(null);
  const [scoreOpen, setScoreOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<IeltsRecord | null>(null);
  const [addEditOpen, setAddEditOpen] = useState(false);

  // ── Derived ──
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (
        filters.search &&
        !r.studentName.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      if (filters.status && r.status !== filters.status) return false;
      if (filters.counselor && r.counselor !== filters.counselor) return false;
      if (filters.country && r.country !== filters.country) return false;
      if (filters.examType && r.examType !== filters.examType) return false;
      return true;
    });
  }, [records, filters]);

  const stats = useMemo(() => calculateStats(records), [records]);

  const counselorOptions = useMemo(() => {
    const unique = [...new Set(records.map((r) => r.counselor))].filter(
      Boolean,
    );
    return unique.map((c) => ({ value: c, label: c }));
  }, [records]);

  // ── Handlers ──
  const handleFilterChange = useCallback(
    (key: keyof IeltsFilters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleView = useCallback((record: IeltsRecord) => {
    setDetailRecord(record);
    setDetailOpen(true);
  }, []);

  const handleEdit = useCallback((record: IeltsRecord) => {
    setEditRecord(record);
    setAddEditOpen(true);
  }, []);

  const handleUpdateScore = useCallback((record: IeltsRecord) => {
    setScoreRecord(record);
    setScoreOpen(true);
  }, []);

  const handleAddNew = useCallback(() => {
    setEditRecord(null);
    setAddEditOpen(true);
  }, []);

  const handleExport = useCallback(() => {
    message.success("Exporting IELTS data...");
    // TODO: implement CSV/Excel export
  }, []);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    // TODO: refetch from API
    setTimeout(() => setLoading(false), 800);
  }, []);

  return (
    <div className="min-h-screen">
      <div className=" mx-auto p-3 space-y-5">
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
              onClick={handleRefresh}
              className="h-9 px-3 rounded-xl border border-slate-200 text-slate-500 text-sm font-medium flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
            >
              <RiRefreshLine
                size={15}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="h-9 px-3 rounded-xl border border-slate-200 text-slate-500 text-sm font-medium flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
            >
              <RiDownloadLine size={15} />
              Export
            </button>
            <button
              onClick={handleAddNew}
              className="h-9 px-4 rounded-xl bg-blue-500 text-white text-sm font-semibold flex items-center gap-1.5 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
            >
              <RiAddLine size={16} />
              Add Student
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <IeltsStats stats={stats} />

        {/* ── Filters ── */}
        <IeltsFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          counselorOptions={counselorOptions}
          totalCount={records.length}
          filteredCount={filteredRecords.length}
        />

        {/* ── Table ── */}
        <IeltsTable
          data={filteredRecords}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onUpdateScore={handleUpdateScore}
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
            onSubmit={(data) => {
              console.log("Score update:", data);
              message.success("Scores updated successfully!");
              setScoreOpen(false);
              // TODO: call API
            }}
          />
        )}

        {/* ── Add / Edit Modal ── */}
        {addEditOpen && (
          <AddEditIeltsModal
            open={addEditOpen}
            record={editRecord}
            onClose={() => setAddEditOpen(false)}
            onSubmit={(data) => {
              console.log("Form data:", data);
              message.success(
                editRecord
                  ? "Record updated!"
                  : "Student added to IELTS tracking!",
              );
              setAddEditOpen(false);
              // TODO: call API
            }}
            counselorOptions={counselorOptions}
            studentOptions={[]} // TODO: populate from leads API
          />
        )}
      </div>
    </div>
  );
};

export default IeltsPage;
