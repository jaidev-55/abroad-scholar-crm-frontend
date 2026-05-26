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

interface CustomMultiSelectProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  options: { value: string; label: ReactNode }[];
  rules?: RegisterOptions<T>;
  required?: boolean;
  size?: "small" | "middle" | "large";
  control: Control<T>;
  errors: FieldErrors<T>;
  icon?: ReactNode;
  onChange?: (v: string[]) => void;
  maxCount?: number;
  className?: string;
}

const CustomMultiSelect = <T extends FieldValues>({
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
  maxCount,
  className,
}: CustomMultiSelectProps<T>) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className || ""}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-600">
          {label}
          {required && <span className="text-rose-400 ml-0.5">*</span>}
        </label>
      )}

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
                mode="multiple"
                value={field.value || []}
                placeholder={placeholder}
                className="w-full"
                size={size}
                maxCount={maxCount}
                onChange={(v) => {
                  field.onChange(v);
                  onChange?.(v);
                }}
                style={{ paddingLeft: icon ? 28 : undefined }}
                status={errors[name] ? "error" : undefined}
                options={options}
                showSearch
                filterOption={(input, option) =>
                  (option?.label as string)
                    ?.toString()
                    .toLowerCase()
                    .includes(input.toLowerCase()) ?? false
                }
                maxTagCount="responsive"
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

export default CustomMultiSelect;
