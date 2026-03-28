import { Select } from "antd";
import { Controller } from "react-hook-form";
import type {
  Control,
  FieldValues,
  RegisterOptions,
  FieldErrors,
} from "react-hook-form";
import type { ReactNode } from "react";

interface CustomSelectProps {
  name: string;
  label: string;
  placeholder?: string;
  options: { value: string; label: ReactNode }[];
  rules?: RegisterOptions<FieldValues>;
  required?: boolean;
  control: Control;
  errors: FieldErrors<FieldValues>;
}

const CustomSelect = ({
  name,
  label,
  placeholder,
  options,
  rules,
  required,
  control,
  errors,
}: CustomSelectProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-600">
        {label}
        {required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <>
            <Select
              {...field}
              value={field.value || undefined}
              placeholder={placeholder}
              size="middle"
              className="w-full"
              status={errors?.[name] ? "error" : undefined}
              options={options}
            />

            {errors?.[name] && (
              <p className="text-xs text-red-500">
                {errors[name]?.message as string}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
};

export default CustomSelect;
