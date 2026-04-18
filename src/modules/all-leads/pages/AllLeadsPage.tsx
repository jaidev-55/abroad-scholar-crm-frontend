import React, { useState, useMemo, useCallback } from "react";
import { Modal, message, Spin } from "antd";
import { Select } from "antd";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  RiUserLine,
  RiFireLine,
  RiTimeLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiUserSmileLine,
  RiCheckLine,
  RiRefreshLine,
  RiDeleteBin6Line,
} from "react-icons/ri";
import {
  getLeads,
  deleteLead,
  bulkDeleteLeads,
  type ApiLead,
  type LeadStatus as ApiLeadStatus,
  type LeadPriority,
} from "../../leadsPipeline/api/leads";
import { getUsers } from "../../../api/auth";
import { StatCard } from "../components/Allleadsatoms";
import { apiLeadToLocal } from "../utils/Allleadshelpers";
import AllLeadsTable from "../components/Allleadstable";
import ExportModal from "../../leadsPipeline/modals/ExportModal";
import DeleteConfirmModal from "../components/Deleteconfirmmodal";
import DetailDrawer from "../components/Detaildrawer";
import type { DateRangeValue } from "../../leadsPipeline/types/lead";
import FilterBar from "../components/FilterBar";

type BulkModalType = "assign" | null;

const AllLeadsPage: React.FC = () => {
  const queryClient = useQueryClient();

  // ── Filter state ──────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [sourceF, setSourceF] = useState<string>("");
  const [counselorF, setCounselorF] = useState<string>("");
  const [countryF, setCountryF] = useState<string>("");
  const [priorityF, setPriorityF] = useState<LeadPriority | "">("");
  const [statusF, setStatusF] = useState<ApiLeadStatus | "">("");
  const [dateRange, setDateRange] = useState<DateRangeValue>(null);

  // ── UI state ──────────────────────────────────────────────────────────────
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkModal, setBulkModal] = useState<BulkModalType>(null);
  const [bulkValue, setBulkValue] = useState<string | null>(null);
  const [detailLead, setDetailLead] = useState<ApiLead | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    mode: "single" | "bulk";
    id?: string;
    name?: string;
  }>({ open: false, mode: "single" });

  const today = new Date().toISOString().split("T")[0];

  // ── Data fetching ─────────────────────────────────────────────────────────
  const {
    data: rawLeads = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      "leads",
      sourceF,
      counselorF,
      countryF,
      priorityF,
      statusF,
      dateRange?.[0]?.format("YYYY-MM-DD"),
      dateRange?.[1]?.format("YYYY-MM-DD"),
    ],
    queryFn: () =>
      getLeads({
        source: sourceF || undefined,
        counselorId: counselorF || undefined,
        country: countryF || undefined,
        priority: priorityF || undefined,
        status: statusF || undefined,
        startDate: dateRange?.[0]?.format("YYYY-MM-DD"),
        endDate: dateRange?.[1]
          ? dateRange[1].add(1, "day").format("YYYY-MM-DD")
          : undefined,
      }),
    placeholderData: (prev) => prev,
  });

  const { data: counselorUsers = [] } = useQuery({
    queryKey: ["counselors"],
    queryFn: () => getUsers("COUNSELOR"),
    staleTime: 5 * 60 * 1000,
  });

  const singleDeleteMutation = useMutation({
    mutationFn: (id: string) => deleteLead(id),
    onSuccess: () => {
      message.success("Lead deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      setDeleteModal({ open: false, mode: "single" });
      if (detailLead?.id === deleteModal.id) setDetailLead(null);
    },
    onError: () => message.error("Failed to delete lead. Please try again."),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => bulkDeleteLeads(ids),
    onSuccess: (_, ids) => {
      message.success(`${ids.length} lead${ids.length > 1 ? "s" : ""} deleted`);
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      setSelected([]);
      setDeleteModal({ open: false, mode: "bulk" });
    },
    onError: () => message.error("Failed to delete leads. Please try again."),
  });

  const isDeleting =
    singleDeleteMutation.isPending || bulkDeleteMutation.isPending;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSingleDeleteClick = useCallback(
    (id: string, name: string, e?: React.MouseEvent) => {
      e?.stopPropagation();
      setDeleteModal({ open: true, mode: "single", id, name });
    },
    [],
  );

  const handleDeleteConfirm = useCallback(() => {
    if (deleteModal.mode === "single" && deleteModal.id)
      singleDeleteMutation.mutate(deleteModal.id);
    else if (deleteModal.mode === "bulk") bulkDeleteMutation.mutate(selected);
  }, [deleteModal, selected, singleDeleteMutation, bulkDeleteMutation]);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing || isLoading) return;
    setIsRefreshing(true);
    try {
      await refetch();
      message.success("Data refreshed");
    } catch {
      message.error("Failed to refresh");
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, isLoading, refetch]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setSourceF("");
    setCounselorF("");
    setCountryF("");
    setPriorityF("");
    setStatusF("");
    setDateRange(null);
  }, []);

  // ── Derived data ──────────────────────────────────────────────────────────
  const filtered = useMemo<ApiLead[]>(() => {
    if (!search.trim()) return rawLeads;
    const q = search.toLowerCase();
    return rawLeads.filter(
      (r) =>
        r.fullName.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        (r.email?.toLowerCase() ?? "").includes(q),
    );
  }, [rawLeads, search]);

  const stats = useMemo(
    () => ({
      total: rawLeads.length,
      hot: rawLeads.filter((r) => r.priority === "HOT").length,
      due: rawLeads.filter(
        (r) =>
          r.followUpDate &&
          r.followUpDate.split("T")[0] <= today &&
          r.status !== "LOST",
      ).length,
      conv: rawLeads.filter((r) => r.status === "CONVERTED").length,
      lost: rawLeads.filter((r) => r.status === "LOST").length,
    }),
    [rawLeads, today],
  );

  const hasFilters = !!(
    search ||
    sourceF ||
    counselorF ||
    countryF ||
    priorityF ||
    statusF ||
    dateRange
  );

  return (
    <>
      <div className="flex flex-col gap-5 p-3 w-full">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-[22px] font-bold text-slate-900 tracking-tight leading-none mb-1">
              All Leads
            </h1>
            <p className="text-[13px] text-slate-400">
              Manage, track and convert all student leads.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 cursor-pointer transition-all shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isRefreshing ? (
                <Spin size="small" />
              ) : (
                <RiRefreshLine size={15} />
              )}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-3">
          <StatCard
            label="Total Leads"
            value={stats.total}
            icon={RiUserLine}
            colorCls="bg-blue-50 text-blue-500"
            barCls="bg-gradient-to-r from-blue-400 to-blue-600"
            delta={12}
            loading={isLoading}
          />
          <StatCard
            label="Hot Leads"
            value={stats.hot}
            icon={RiFireLine}
            colorCls="bg-red-50 text-red-500"
            barCls="bg-gradient-to-r from-red-400 to-red-600"
            delta={5}
            loading={isLoading}
          />
          <StatCard
            label="Follow-ups Due"
            value={stats.due}
            icon={RiTimeLine}
            colorCls="bg-amber-50 text-amber-500"
            barCls="bg-gradient-to-r from-amber-400 to-amber-600"
            delta={-3}
            loading={isLoading}
          />
          <StatCard
            label="Converted"
            value={stats.conv}
            icon={RiCheckboxCircleLine}
            colorCls="bg-emerald-50 text-emerald-500"
            barCls="bg-gradient-to-r from-emerald-400 to-emerald-600"
            delta={8}
            loading={isLoading}
          />
          <StatCard
            label="Lost"
            value={stats.lost}
            icon={RiCloseCircleLine}
            colorCls="bg-slate-100 text-slate-500"
            barCls="bg-gradient-to-r from-slate-300 to-slate-500"
            delta={-2}
            loading={isLoading}
          />
        </div>

        <FilterBar
          filteredCount={filtered.length}
          dateFilterMode="created"
          totalCount={rawLeads.length}
          hasFilters={hasFilters}
          clearFilters={clearFilters}
          onStatusChange={(v) => setStatusF(v as ApiLeadStatus | "")}
          counselorUsers={counselorUsers}
          onExport={() => setExportModalOpen(true)}
          onSearchChange={setSearch}
          onSourceChange={setSourceF}
          onCounselorChange={setCounselorF}
          onCountryChange={setCountryF}
          onPriorityChange={(v) => setPriorityF(v as LeadPriority | "")}
          onDateRangeChange={setDateRange}
        />

        {/* Selection bar */}
        {selected.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-2xl text-[13px] font-semibold text-blue-700">
            <RiCheckLine size={14} />
            <span>
              {selected.length} lead{selected.length > 1 ? "s" : ""} selected
            </span>
            <span className="mx-1 text-blue-300">·</span>
            <button
              onClick={() => setBulkModal("assign")}
              className="underline underline-offset-2 bg-transparent border-none cursor-pointer text-blue-600 hover:text-blue-800 font-semibold text-[13px]"
            >
              Assign counselor
            </button>
            <span className="mx-1 text-blue-300">·</span>
            <button
              onClick={() => setDeleteModal({ open: true, mode: "bulk" })}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white text-[11px] font-bold border-none cursor-pointer transition-colors"
            >
              <RiDeleteBin6Line size={12} /> Delete {selected.length}
            </button>
            <button
              onClick={() => setSelected([])}
              className="ml-auto text-blue-500 hover:text-blue-700 bg-transparent border-none cursor-pointer text-xs font-medium"
            >
              ✕ Clear
            </button>
          </div>
        )}

        {/* Table */}
        <AllLeadsTable
          data={filtered}
          isLoading={isLoading}
          isError={isError}
          today={today}
          hasFilters={hasFilters}
          selected={selected}
          onSelectChange={setSelected}
          onRowClick={setDetailLead}
          onDeleteClick={handleSingleDeleteClick}
          onClearFilters={clearFilters}
          onRefetch={() => refetch()}
        />
      </div>

      {/* Bulk assign modal */}
      <Modal
        open={!!bulkModal}
        onCancel={() => {
          setBulkModal(null);
          setBulkValue(null);
        }}
        onOk={() => {
          message.success(`Assigned ${selected.length} leads`);
          setSelected([]);
          setBulkModal(null);
          setBulkValue(null);
        }}
        okText="Apply"
        okButtonProps={{ disabled: !bulkValue, type: "primary" }}
        title={
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <RiUserSmileLine size={16} className="text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                Assign Counselor
              </div>
              <div className="text-xs text-slate-400 font-normal">
                Apply to {selected.length} selected lead
                {selected.length > 1 ? "s" : ""}
              </div>
            </div>
          </div>
        }
        width={420}
      >
        <div className="pt-2">
          <label className="block text-xs font-semibold text-slate-600 mb-2">
            Select Counselor
          </label>
          <Select
            value={bulkValue}
            onChange={setBulkValue}
            placeholder="Choose counselor…"
            className="!w-full"
            size="large"
            options={counselorUsers.map((u) => ({
              value: u.name,
              label: u.name,
            }))}
          />
        </div>
      </Modal>

      <DeleteConfirmModal
        open={deleteModal.open}
        mode={deleteModal.mode}
        count={selected.length}
        leadName={deleteModal.name}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          if (!isDeleting) setDeleteModal({ open: false, mode: "single" });
        }}
        loading={isDeleting}
      />

      {exportModalOpen && (
        <ExportModal
          leads={filtered.map(apiLeadToLocal)}
          allLeads={rawLeads.map(apiLeadToLocal)}
          onClose={() => setExportModalOpen(false)}
        />
      )}

      {detailLead && (
        <DetailDrawer
          lead={detailLead}
          today={today}
          onClose={() => setDetailLead(null)}
          onDelete={handleSingleDeleteClick}
        />
      )}
    </>
  );
};

export default AllLeadsPage;
