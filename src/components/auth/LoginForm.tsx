import { Button } from "antd";
import { FiMail, FiLock } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import CustomInput from "../../components/common/CustomInput";
import { REGEX } from "../../utils/regex";

export interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormProps {
  loading: boolean;
  onSubmit: (data: LoginFormValues) => void;
}

const MOTIVATIONS = [
  "You changed 3 students' lives last week 🎯",
  "Your batch average is up 0.5 bands this month 📈",
  "2 students got their dream university offer today 🎓",
];

const LoginForm = ({ loading, onSubmit }: LoginFormProps) => {
  const { handleSubmit, control } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "" },
  });

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <>
      {/* Intro Section */}
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
            {today} — Staff Login
          </span>
        </div>

        <h2 className="text-2xl font-extrabold text-[#1a2540] leading-tight mb-2">
          Good to see you! 👋
        </h2>
        <p className="text-sm text-[#8a95b0]">
          Sign in to access your dashboard, student pipeline & today's tasks.
        </p>
      </div>

      {/* Motivation ticker */}
      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-10">
        <span className="text-base">⚡</span>
        <span className="text-xs font-semibold text-amber-800">
          {MOTIVATIONS[new Date().getDay() % MOTIVATIONS.length]}
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
            pattern: {
              value: REGEX.EMAIL,
              message: "Enter a valid email",
            },
          }}
        />

        <CustomInput
          name="password"
          label="Password"
          type="password"
          size="large"
          placeholder="Enter your password"
          control={control}
          icon={<FiLock size={14} className="text-[#b4bcd4]" />}
          rules={{
            required: "Password is required",
            minLength: { value: 6, message: "Minimum 6 characters required" },
          }}
        />

        <div className="flex items-center justify-end">
          <Link
            to="/ForgotPasswordPage"
            className="text-[12.5px] text-blue-500 font-semibold hover:text-blue-700 transition-colors duration-200 no-underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
          size="large"
        >
          {!loading && "Sign In to My Dashboard"}
        </Button>
      </form>

      <p className="text-center text-[13px] text-[#8a95b0] mt-5 pl-2">
        New team member?{" "}
        <Link
          to="/register"
          className="text-[12.5px] text-blue-500 font-semibold hover:text-blue-700 transition-colors duration-200 no-underline"
        >
          Request portal access
        </Link>
      </p>
    </>
  );
};

export default LoginForm;
