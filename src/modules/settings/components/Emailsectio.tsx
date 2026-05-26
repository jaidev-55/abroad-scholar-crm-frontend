import { Switch, Tag } from "antd";
import { useForm } from "react-hook-form";
import { RiMailLine, RiEdit2Line, RiAddLine, RiSaveLine } from "react-icons/ri";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import type { EmailTemplate, SmtpConfig } from "../types";

interface Props {
  templates: EmailTemplate[];
  smtp: SmtpConfig;
}

const EmailSection: React.FC<Props> = ({ templates, smtp }) => {
  const {
    control,
    formState: { errors },
  } = useForm<SmtpConfig>({
    defaultValues: smtp,
  });

  return (
    <div className="space-y-4">
      {/* SMTP config */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h3 className="text-sm font-bold text-slate-800 mb-1">
          SMTP Configuration
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          Configure outgoing email server
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CustomInput
            name="host"
            label="SMTP Host"
            placeholder="smtp.gmail.com"
            control={control}
          />
          <CustomInput
            name="port"
            label="Port"
            placeholder="587"
            control={control}
          />
          <CustomSelect
            name="encryption"
            label="Encryption"
            control={control}
            errors={errors}
            options={[
              { value: "tls", label: "TLS" },
              { value: "ssl", label: "SSL" },
              { value: "none", label: "None" },
            ]}
          />
          <CustomInput
            name="username"
            label="Username"
            placeholder="your@email.com"
            control={control}
          />
          <CustomInput
            name="fromEmail"
            label="From Email"
            placeholder="crm@company.com"
            control={control}
          />
          <CustomInput
            name="fromName"
            label="From Name"
            placeholder="Company CRM"
            control={control}
          />
        </div>

        <div className="flex justify-end mt-4">
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors cursor-pointer shadow-sm">
            <RiSaveLine size={13} />
            Save SMTP
          </button>
        </div>
      </div>

      {/* Templates */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Email Templates
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage automated email templates
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer">
            <RiAddLine size={13} />
            New Template
          </button>
        </div>

        <div className="space-y-2">
          {templates.map((t) => (
            <div
              key={t.id}
              className={`flex items-center gap-4 p-4 border rounded-xl transition-colors ${t.isActive ? "border-slate-200" : "border-slate-100 opacity-60"}`}
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <RiMailLine size={16} className="text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="text-xs font-bold text-slate-800">{t.name}</h4>
                  <Tag
                    className={`border-0 rounded-full text-[9px] font-semibold px-2 py-0 ${t.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}
                  >
                    {t.isActive ? "Active" : "Inactive"}
                  </Tag>
                </div>
                <p className="text-[10px] text-slate-400">{t.description}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                  Subject: {t.subject}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-slate-400">
                  Edited{" "}
                  {new Date(t.lastEdited).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
                  <RiEdit2Line size={13} className="text-slate-400" />
                </button>
                <Switch size="small" checked={t.isActive} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmailSection;
