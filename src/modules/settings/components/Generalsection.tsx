import { useForm } from "react-hook-form";
import { RiImageAddLine, RiSaveLine } from "react-icons/ri";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";
import type { GeneralSettings } from "../types";
import {
  TIMEZONE_OPTIONS,
  CURRENCY_OPTIONS,
  DATE_FORMAT_OPTIONS,
} from "../utils/Constants";

interface Props {
  data: GeneralSettings;
}

const GeneralSection: React.FC<Props> = ({ data }) => {
  const {
    control,
    formState: { errors },
  } = useForm<GeneralSettings>({
    defaultValues: data,
  });

  return (
    <div className="space-y-6">
      {/* Company info */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h3 className="text-sm font-bold text-slate-800 mb-1">
          Company Information
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          Basic details about your organization
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            name="companyName"
            label="Company Name"
            placeholder="Your company name"
            control={control}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-800">
              Company Logo
            </label>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors">
                <RiImageAddLine size={20} className="text-slate-400" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500">Upload PNG or SVG</p>
                <p className="text-[10px] text-slate-400">
                  Max 2MB, 200x200px recommended
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Regional */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h3 className="text-sm font-bold text-slate-800 mb-1">
          Regional Preferences
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          Timezone, currency, and date formatting
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CustomSelect
            name="timezone"
            label="Timezone"
            control={control}
            errors={errors}
            options={TIMEZONE_OPTIONS}
          />
          <CustomSelect
            name="currency"
            label="Currency"
            control={control}
            errors={errors}
            options={CURRENCY_OPTIONS}
          />
          <CustomSelect
            name="dateFormat"
            label="Date Format"
            control={control}
            errors={errors}
            options={DATE_FORMAT_OPTIONS}
          />
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-5 py-2.5 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors cursor-pointer shadow-sm">
          <RiSaveLine size={14} />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default GeneralSection;
