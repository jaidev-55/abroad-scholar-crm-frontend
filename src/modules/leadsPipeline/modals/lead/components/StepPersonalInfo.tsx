import React from "react";
import { RiUserLine, RiPhoneLine, RiMailLine } from "react-icons/ri";
import type { Control, FieldErrors } from "react-hook-form";
import type { FormValues } from "../../../utils/lead/types";
import CustomInput from "../../../../../components/common/CustomInput";
import CustomSelect from "../../../../../components/common/CustomSelect";
import { COUNTRY_OPTIONS, SOURCE_OPTIONS } from "../../../utils/lead/constants";

interface Props {
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
}

const StepPersonalInfo: React.FC<Props> = ({ control, errors }) => (
  <div className="flex flex-col gap-4">
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-1 bg-blue-50">
      <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
        <RiUserLine size={15} className="text-blue-600" />
      </div>
      <div>
        <p className="text-[13px] font-bold text-blue-700">
          Personal Information
        </p>
        <p className="text-[11px] text-blue-500">
          Student's basic contact details
        </p>
      </div>
    </div>

    <CustomInput
      name="name"
      label="Full Name"
      placeholder="e.g. Aarav Mehta"
      icon={<RiUserLine size={13} className="text-slate-300" />}
      control={control}
      rules={{ required: "Name is required" }}
    />

    <div className="flex gap-3">
      <div className="flex-1">
        <CustomInput
          name="phone"
          label="Phone Number"
          placeholder="+91 9000000000"
          icon={<RiPhoneLine size={13} className="text-slate-300" />}
          control={control}
          rules={{ required: "Phone is required" }}
        />
      </div>
      <div className="flex-1">
        <CustomInput
          name="email"
          label="Email Address"
          type="email"
          placeholder="student@email.com"
          icon={<RiMailLine size={13} className="text-slate-300" />}
          control={control}
        />
      </div>
    </div>

    <div className="flex gap-3">
      <div className="flex-1">
        <CustomSelect
          name="country"
          label="Destination Country"
          placeholder="Select country"
          options={COUNTRY_OPTIONS}
          required
          control={control}
          errors={errors}
          rules={{ required: "Country is required" }}
        />
      </div>
      <div className="flex-1">
        <CustomSelect
          name="source"
          label="Lead Source"
          placeholder="How did they find us?"
          options={SOURCE_OPTIONS}
          required
          control={control}
          errors={errors}
          rules={{ required: "Source is required" }}
        />
      </div>
    </div>
  </div>
);

export default StepPersonalInfo;
