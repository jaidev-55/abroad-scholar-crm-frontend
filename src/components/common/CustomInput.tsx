import { Input } from "antd";
import {
  Controller,
  type Control,
  type RegisterOptions,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { useState, type ReactNode } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface FormInputProps<T extends FieldValues = FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "password" | "email";
  icon?: ReactNode;
  rules?: RegisterOptions<T>;
  size?: "small" | "middle" | "large";
  control?: Control<T>;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomInput = <T extends FieldValues = FieldValues>({
  name,
  label,
  placeholder,
  type = "text",
  icon,
  rules,
  control,
  size = "middle",
  required,
  onChange,
}: FormInputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="block text-xs font-semibold text-gray-800">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}{" "}
      </label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState: { error } }) => (
          <>
            <Input
              {...field}
              prefix={icon}
              type={isPassword ? (showPassword ? "text" : "password") : type}
              placeholder={placeholder}
              size={size}
              status={error ? "error" : ""}
              onChange={(e) => {
                field.onChange(e);
                onChange?.(e);
              }}
              suffix={
                isPassword && (
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer flex items-center"
                  >
                    {showPassword ? (
                      <FiEyeOff size={14} />
                    ) : (
                      <FiEye size={14} />
                    )}
                  </span>
                )
              }
            />
            {error && <p className="text-xs text-red-500">{error.message}</p>}
          </>
        )}
      />
    </div>
  );
};

export default CustomInput;
