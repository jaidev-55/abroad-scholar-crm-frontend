import { DatePicker } from "antd";
import { Controller } from "react-hook-form";
import type {
  Control,
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import type { Dayjs } from "dayjs";
import { RiCalendarLine } from "react-icons/ri";

const { RangePicker } = DatePicker;

type RangeValue = [Dayjs | null, Dayjs | null] | null;

interface SingleProps<T extends FieldValues> {
  mode?: "single";
  name: Path<T>;
  label?: string;
  placeholder?: string;
  control: Control<T>;
  errors?: FieldErrors<T>;
  rules?: RegisterOptions<T, Path<T>>;
  onChange?: (v: Dayjs | null) => void;
}

interface RangeProps<T extends FieldValues> {
  mode: "range";
  name: Path<T>;
  label?: string;
  placeholder?: [string, string];
  control: Control<T>;
  errors?: FieldErrors<T>;
  rules?: RegisterOptions<T, Path<T>>;
  onChange?: (v: RangeValue) => void;
}

type CustomDatePickerProps<T extends FieldValues> =
  | SingleProps<T>
  | RangeProps<T>;

// ── Shared label + error wrapper ─────────────────────

const sharedPickerStyle = (hasError: boolean) => ({
  borderRadius: "10px",
  borderColor: hasError ? "#ef4444" : "#e5e7eb",
  fontSize: "13px",
  height: "36px",
  width: "100%",
});

const CustomDatePicker = <T extends FieldValues>(
  props: CustomDatePickerProps<T>,
) => {
  const { name, label, control, errors, rules } = props;
  const hasError = !!errors?.[name];
  const isRange = props.mode === "range";

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold text-[#4a5578]">{label}</label>
      )}

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) =>
          isRange ? (
            <RangePicker
              value={field.value ?? null}
              onChange={(dates) => {
                field.onChange(dates);
                (props as RangeProps<T>).onChange?.(dates as RangeValue);
              }}
              placeholder={
                (props as RangeProps<T>).placeholder ?? [
                  "Start date",
                  "End date",
                ]
              }
              format="MMM D, YYYY"
              allowClear
              suffixIcon={
                <RiCalendarLine size={14} className="text-slate-400" />
              }
              status={hasError ? "error" : undefined}
              className="w-full"
              size="middle"
              style={sharedPickerStyle(hasError)}
              popupStyle={{ zIndex: 9999 }}
            />
          ) : (
            <DatePicker
              value={field.value ?? null}
              onChange={(date) => {
                field.onChange(date);
                (props as SingleProps<T>).onChange?.(date);
              }}
              placeholder={
                (props as SingleProps<T>).placeholder ?? "Pick a date"
              }
              format="MMM D, YYYY"
              allowClear
              suffixIcon={
                <RiCalendarLine size={14} className="text-slate-400" />
              }
              status={hasError ? "error" : undefined}
              size="middle"
              style={sharedPickerStyle(hasError)}
              popupStyle={{ zIndex: 9999 }}
            />
          )
        }
      />

      {hasError && (
        <p className="text-xs text-red-500 mt-0.5">
          {errors?.[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export default CustomDatePicker;
