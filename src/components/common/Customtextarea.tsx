import { Input } from "antd";
import {
  Controller,
  type Control,
  type RegisterOptions,
  type FieldValues,
  type Path,
} from "react-hook-form";

const { TextArea } = Input;

interface CustomTextareaProps<T extends FieldValues = FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  hint?: string;
  rows?: number;
  rules?: RegisterOptions<T>;
  control?: Control<T>;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const CustomTextarea = <T extends FieldValues = FieldValues>({
  name,
  label,
  placeholder,
  hint,
  rows = 4,
  rules,
  control,
  onChange,
}: CustomTextareaProps<T>) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="block text-xs font-semibold text-gray-800">
        {label}
        {hint && (
          <span className="text-slate-300 font-normal ml-1">{hint}</span>
        )}
      </label>

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState: { error } }) => (
          <>
            <TextArea
              {...field}
              rows={rows}
              placeholder={placeholder}
              status={error ? "error" : ""}
              onChange={(e) => {
                field.onChange(e);
                onChange?.(e);
              }}
              style={{ fontFamily: "inherit", resize: "none" }}
            />
            {error && <p className="text-xs text-red-500">{error.message}</p>}
          </>
        )}
      />
    </div>
  );
};

export default CustomTextarea;
