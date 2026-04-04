import { Select } from "antd";
import { Controller } from "react-hook-form";
import type {
  Control,
  FieldValues,
  RegisterOptions,
  FieldErrors,
  Path,
} from "react-hook-form";
import type { ReactNode } from "react";

interface CustomSelectProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  options: { value: string; label: ReactNode }[];
  rules?: RegisterOptions<T>;
  required?: boolean;
  size?: "small" | "middle" | "large";
  control: Control<T>;
  errors: FieldErrors<T>;
  icon?: ReactNode;
  onChange?: (v: string) => void;
}

const CustomSelect = <T extends FieldValues>({
  name,
  label,
  placeholder,
  options,
  rules,
  required,
  control,
  size = "middle",
  errors,
  icon,
  onChange,
}: CustomSelectProps<T>) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-600">
        {label}
        {required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-gray-400">
            {icon}
          </div>
        )}

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
                className="w-full"
                size={size}
                onChange={(v) => {
                  field.onChange(v);
                  if (v !== undefined) {
                    onChange?.(v);
                  }
                }}
                style={{ paddingLeft: icon ? 28 : undefined }}
                status={errors[name] ? "error" : undefined}
                options={options}
              />

              {errors[name] && (
                <p className="text-xs text-red-500">
                  {errors[name]?.message as string}
                </p>
              )}
            </>
          )}
        />
      </div>
    </div>
  );
};

export default CustomSelect;
