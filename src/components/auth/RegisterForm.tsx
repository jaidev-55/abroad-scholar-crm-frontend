import { Button } from "antd";
import {
  FiMail,
  FiLock,
  FiUser,
  FiArrowRight,
  // FiBriefcase,
  FiShield,
} from "react-icons/fi";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import CustomInput from "../../components/common/CustomInput";
import { REGEX } from "../../utils/regex";
import CustomSelect from "../common/CustomSelect";

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "ADMIN" | "COUNSELOR";
}

interface RegisterFormProps {
  loading: boolean;
  onSubmit: (data: RegisterFormValues) => void;
}

const ROLE_OPTIONS = [
  {
    value: "ADMIN",
    label: (
      <span className="flex items-center gap-2">
        <FiShield /> Admin
      </span>
    ),
  },
  {
    value: "COUNSELOR",
    label: (
      <span className="flex items-center gap-2">
        <FiUser /> Counselor
      </span>
    ),
  },
  // {
  //   value: "MANAGER",
  //   label: (
  //     <span className="flex items-center gap-2">
  //       <FiBriefcase /> Manager
  //     </span>
  //   ),
  // },
];

const getPasswordStrength = (pw: string) => {
  if (!pw) return { label: "", color: "", width: "0%", score: 0 };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1)
    return { label: "Weak", color: "#ef4444", width: "20%", score };
  if (score <= 2)
    return { label: "Fair", color: "#f59e0b", width: "40%", score };
  if (score <= 3)
    return { label: "Good", color: "#3b82f6", width: "65%", score };
  return { label: "Strong", color: "#22c55e", width: "100%", score };
};

const RegisterForm = ({ loading, onSubmit }: RegisterFormProps) => {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "COUNSELOR",
    },
  });

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const password = watch("password", "");
  const strength = getPasswordStrength(password);

  return (
    <>
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <img
            src="/logo.webp"
            alt="AbroadScholar Logo"
            className="h-14 object-contain"
          />
        </div>

        <div className="mb-5 flex justify-center">
          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-full px-4 py-1.5 text-xs font-semibold text-blue-600">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            {today} — New Registration
          </span>
        </div>

        <h2 className="text-2xl font-extrabold text-[#1a2540] leading-tight mb-2">
          Join the team! 🚀
        </h2>
        <p className="text-sm text-[#8a95b0]">
          Create your staff account to access the AbroadScholar portal.
        </p>
      </div>

      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 mb-8">
        <span className="text-base">🎓</span>
        <span className="text-xs font-semibold text-emerald-800">
          Every great counsellor's journey starts with this step
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <CustomInput
          name="name"
          label="Full Name"
          placeholder="e.g. Priya Sharma"
          control={control}
          size="large"
          type="text"
          icon={<FiUser size={14} className="text-[#b4bcd4]" />}
          rules={{
            required: "Name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
            },
          }}
        />

        <CustomInput
          name="email"
          label="Staff Email"
          placeholder="you@abroadscholar.com"
          control={control}
          size="large"
          type="email"
          icon={<FiMail size={14} className="text-[#b4bcd4]" />}
          rules={{
            required: "Email is required",
            pattern: { value: REGEX.EMAIL, message: "Enter a valid email" },
          }}
        />

        <CustomSelect
          name="role"
          label="Role"
          placeholder="Select your role"
          size="large"
          options={ROLE_OPTIONS}
          control={control}
          errors={errors}
          required
          rules={{ required: "Please select a role" }}
        />

        <div>
          <CustomInput
            name="password"
            label="Password"
            placeholder="Create a strong password"
            control={control}
            size="large"
            type="password"
            icon={<FiLock size={14} className="text-[#b4bcd4]" />}
            rules={{
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters required" },
            }}
          />
          {password && (
            <div className="mt-2">
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: strength.width,
                    backgroundColor: strength.color,
                  }}
                />
              </div>
              <p
                className="text-[11px] font-semibold mt-1 transition-colors duration-300"
                style={{ color: strength.color }}
              >
                {strength.label}
              </p>
            </div>
          )}
        </div>

        <CustomInput
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Re-enter your password"
          control={control}
          size="large"
          type="password"
          icon={<FiLock size={14} className="text-[#b4bcd4]" />}
          rules={{
            required: "Please confirm your password",
            validate: (value: string) =>
              value === watch("password") || "Passwords do not match",
          }}
        />

        <div className="pt-1">
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            size="large"
          >
            {!loading && (
              <span className="flex items-center justify-center gap-2">
                Create Account
                <FiArrowRight size={15} />
              </span>
            )}
          </Button>
        </div>
      </form>

      <p className="text-center text-[13px] text-[#8a95b0] mt-5">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-blue-500 font-semibold hover:text-blue-700 transition-colors duration-200 no-underline"
        >
          Sign in
        </Link>
      </p>
    </>
  );
};

export default RegisterForm;
