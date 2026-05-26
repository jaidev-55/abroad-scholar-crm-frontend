import { useForm } from "react-hook-form";
import {
  RiDownload2Line,
  RiDeleteBin7Line,
  RiShieldCheckLine,
  RiSaveLine,
  RiDatabase2Line,
} from "react-icons/ri";
import CustomSelect from "../../../components/common/CustomSelect";

interface DataSettings {
  exportFormat: string;
  autoBackup: string;
  retentionPeriod: string;
}

const DataSection: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useForm<DataSettings>({
    defaultValues: {
      exportFormat: "csv",
      autoBackup: "weekly",
      retentionPeriod: "12months",
    },
  });

  return (
    <div className="space-y-4">
      {/* Export preferences */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h3 className="text-sm font-bold text-slate-800 mb-1">
          Export Preferences
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          Default settings for data exports
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CustomSelect
            name="exportFormat"
            label="Default Format"
            control={control}
            errors={errors}
            options={[
              { value: "csv", label: "CSV (.csv)" },
              { value: "xlsx", label: "Excel (.xlsx)" },
              { value: "json", label: "JSON (.json)" },
            ]}
          />
          <CustomSelect
            name="autoBackup"
            label="Auto Backup"
            control={control}
            errors={errors}
            options={[
              { value: "daily", label: "Daily" },
              { value: "weekly", label: "Weekly" },
              { value: "monthly", label: "Monthly" },
              { value: "never", label: "Never" },
            ]}
          />
          <CustomSelect
            name="retentionPeriod"
            label="Sync Log Retention"
            control={control}
            errors={errors}
            options={[
              { value: "3months", label: "3 Months" },
              { value: "6months", label: "6 Months" },
              { value: "12months", label: "12 Months" },
              { value: "forever", label: "Keep Forever" },
            ]}
          />
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h3 className="text-sm font-bold text-slate-800 mb-1">Data Actions</h3>
        <p className="text-xs text-slate-400 mb-5">Manual data operations</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                <RiDownload2Line size={16} className="text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Export All Leads
                </p>
                <p className="text-[10px] text-slate-400">
                  Download all lead data as CSV
                </p>
              </div>
            </div>
            <button className="px-3 py-1.5 text-[11px] font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer">
              Export
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                <RiDatabase2Line size={16} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Create Backup
                </p>
                <p className="text-[10px] text-slate-400">
                  Manual full database backup
                </p>
              </div>
            </div>
            <button className="px-3 py-1.5 text-[11px] font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer">
              Backup Now
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                <RiDeleteBin7Line size={16} className="text-amber-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Clear Sync Logs
                </p>
                <p className="text-[10px] text-slate-400">
                  Remove sync logs older than retention period
                </p>
              </div>
            </div>
            <button className="px-3 py-1.5 text-[11px] font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer">
              Clear
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-red-100 rounded-xl hover:border-red-200 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                <RiShieldCheckLine size={16} className="text-red-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Delete All Data
                </p>
                <p className="text-[10px] text-red-400">
                  Permanently delete all leads and data
                </p>
              </div>
            </div>
            <button className="px-3 py-1.5 text-[11px] font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer">
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-5 py-2.5 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors cursor-pointer shadow-sm">
          <RiSaveLine size={14} />
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default DataSection;
