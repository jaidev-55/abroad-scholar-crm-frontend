import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StatsBar } from "./components/StatsBar";
import { LostLeadDrawer } from "./components/LostLeadDrawer";
import { ReactivationModal } from "./components/ReactivationModal";
import {
  getLostLeads,
  getLostLeadsStats,
  reactivateLead,
} from "./api/lost-leads";
import type {
  LostLead,
  LostLeadsQuery,
  ReactivateLeadPayload,
  LostReason,
  LeadPriority,
} from "./types";
import { getUsers } from "../../api/auth";
import LostLeadsFilters from "./components/LostLeadsFilters";
import LostLeadsTable from "./components/LostLeadsTable";

const LostLeadsPage = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [reasonFilter, setReasonFilter] = useState("");
  const [counselorFilter, setCounselorFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [page, setPage] = useState(1);

  const [selectedLead, setSelectedLead] = useState<LostLead | null>(null);
  const [reactivateLeadModal, setReactivateLeadModal] =
    useState<LostLead | null>(null);

  const query: LostLeadsQuery = {
    page,
    limit: 20,
    ...(search.trim() && { search: search.trim() }),
    ...(reasonFilter && { lostReason: reasonFilter as LostReason }), // ✅ was: as any
    ...(counselorFilter && { counselorId: counselorFilter }),
    ...(countryFilter && { country: countryFilter }),
    ...(priorityFilter && { priority: priorityFilter as LeadPriority }), // ✅ was: as any
  };

  const { data: leadsData, isLoading: leadsLoading } = useQuery({
    queryKey: ["lost-leads", query],
    queryFn: () => getLostLeads(query),
    staleTime: 30_000,
  });

  const { data: counselorUsers = [] } = useQuery({
    queryKey: ["counselors"],
    queryFn: () => getUsers("COUNSELOR"),
    staleTime: 5 * 60 * 1000,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["lost-leads-stats"],
    queryFn: getLostLeadsStats,
    staleTime: 30_000,
  });

  const { mutate: handleReactivate, isPending: isReactivating } = useMutation({
    mutationFn: ({
      leadId,
      payload,
    }: {
      leadId: string;
      payload: ReactivateLeadPayload;
    }) => reactivateLead(leadId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lost-leads"] });
      queryClient.invalidateQueries({ queryKey: ["lost-leads-stats"] });
      queryClient.invalidateQueries({ queryKey: ["lost-leads-countries"] });
      setReactivateLeadModal(null);
    },
  });

  const handleExportCSV = useCallback(() => {
    const leads = leadsData?.data ?? [];
    if (!leads.length) return;

    const headers = [
      "Name",
      "Phone",
      "Email",
      "Country",
      "Priority",
      "Lost Reason",
      "Counselor",
      "Call Attempts",
      "Lost Date",
    ];

    const rows = leads.map((l: LostLead): (string | number)[] => [
      l.fullName,
      l.phone,
      l.email ?? "",
      l.country ?? "",
      l.priority,
      l.lostReason ?? "",
      l.counselor?.name ?? "Unassigned",
      l._count.callLogs,
      new Date(l.updatedAt).toISOString().split("T")[0],
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((r: (string | number)[]) =>
        r
          .map((v: string | number) => `"${String(v).replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lost-leads.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [leadsData]);

  const clearFilters = () => {
    setSearch("");
    setReasonFilter("");
    setCounselorFilter("");
    setCountryFilter("");
    setPriorityFilter("");
    setPage(1);
  };

  const hasFilters = !!(
    search ||
    reasonFilter ||
    counselorFilter ||
    countryFilter ||
    priorityFilter
  );
  const leads = leadsData?.data ?? [];

  return (
    <div className="flex flex-col gap-4 w-full p-3 overflow-hidden min-w-0">
      <div className="min-w-0">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Lost Leads
        </h2>
        <p className="text-sm text-slate-400 mt-0.5">
          Analyze, track & recover lost opportunities
        </p>
      </div>

      <StatsBar stats={stats} isLoading={statsLoading} />

      <LostLeadsFilters
        search={search}
        setSearch={(val: string) => {
          setSearch(val);
          setPage(1);
        }}
        reasonFilter={reasonFilter}
        setReasonFilter={(val: string) => {
          setReasonFilter(val);
          setPage(1);
        }}
        counselorFilter={counselorFilter}
        setCounselorFilter={(val: string) => {
          setCounselorFilter(val);
          setPage(1);
        }}
        countryFilter={countryFilter}
        setCountryFilter={(val: string) => {
          setCountryFilter(val);
          setPage(1);
        }}
        priorityFilter={priorityFilter}
        setPriorityFilter={(val: string) => {
          setPriorityFilter(val);
          setPage(1);
        }}
        hasFilters={hasFilters}
        clearFilters={clearFilters}
        total={leadsData?.meta?.total ?? 0}
        filtered={leads.length}
        counselors={counselorUsers}
        onExport={handleExportCSV}
      />

      <LostLeadsTable
        data={leads}
        isLoading={leadsLoading}
        onView={(lead) => setSelectedLead(lead)}
        onReactivate={(lead) => setReactivateLeadModal(lead)}
      />

      <LostLeadDrawer
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onReactivate={(lead) => {
          setSelectedLead(null);
          setReactivateLeadModal(lead);
        }}
      />

      <ReactivationModal
        lead={reactivateLeadModal}
        onClose={() => setReactivateLeadModal(null)}
        onReactivate={handleReactivate}
        isReactivating={isReactivating}
      />
    </div>
  );
};

export default LostLeadsPage;
