import { DatePicker } from "antd";
import { Controller } from "react-hook-form";
import type {
  Control,
  FieldValues,
  RegisterOptions,
  FieldErrors,
} from "react-hook-form";
import { RiCalendarLine } from "react-icons/ri";
import type { Dayjs } from "dayjs";

interface CustomDatePickerProps {
  name: string;
  label: string;
  placeholder?: string;
  format?: string;
  showTime?: boolean;
  required?: boolean;
  rules?: RegisterOptions<FieldValues>;
  control: Control;
  errors: FieldErrors<FieldValues>;
}

const CustomDatePicker = ({
  name,
  label,
  placeholder = "Pick a date",
  format = "MMM D, YYYY",
  showTime = false,
  required,
  rules,
  control,
  errors,
}: CustomDatePickerProps) => {
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
            <DatePicker
              {...field}
              value={field.value as Dayjs | null}
              onChange={(date) => field.onChange(date)}
              placeholder={placeholder}
              format={showTime ? "MMM D, YYYY h:mm A" : format}
              showTime={
                showTime ? { format: "h:mm A", use12Hours: true } : false
              }
              size="middle"
              className="w-full"
              status={errors?.[name] ? "error" : undefined}
              prefix={
                <RiCalendarLine size={14} className="text-slate-300 mr-1" />
              }
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

export default CustomDatePicker;
