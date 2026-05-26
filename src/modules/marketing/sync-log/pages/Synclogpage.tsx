import { useQuery } from "@tanstack/react-query";
import { RiFileListLine, RiRefreshLine } from "react-icons/ri";
import { getSyncLog } from "../api/Synclogapi";
import FormSyncHealthCards from "../components/Formsynchealthcards";
import SyncLogTable from "../components/Synclogtable";
import SyncStatsCards from "../components/Syncstatscards";
import SyncVolumeChart from "../components/Syncvolumechart";

const SyncLogPage = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["sync-log"],
    queryFn: getSyncLog,
    staleTime: 1 * 60 * 1000,
  });

  return (
    <div className="space-y-4 pb-4">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
            <RiFileListLine size={18} className="text-teal-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Sync Log</h1>
            <p className="text-xs text-slate-400">
              Monitor webhook activity, debug sync issues, and track lead intake
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-emerald-600">
              Listening
            </span>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200 disabled:opacity-50"
          >
            <RiRefreshLine
              size={13}
              className={isLoading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <SyncStatsCards stats={data?.stats ?? ({} as any)} loading={isLoading} />

      {/* Webhook health + Volume chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FormSyncHealthCards
          forms={data?.formHealth ?? []}
          loading={isLoading}
        />
        <SyncVolumeChart data={data?.volume ?? []} loading={isLoading} />
      </div>

      {/* Log table */}
      <SyncLogTable logs={data?.logs ?? []} loading={isLoading} />
    </div>
  );
};

export default SyncLogPage;
