import { Button } from "antd";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import type { ForgotPasswordFormValues } from "../../../types/auth";
import CustomInput from "../../common/CustomInput";
import { REGEX } from "../../../utils/regex";

interface EmailStepProps {
  loading: boolean;
  onSubmit: (data: ForgotPasswordFormValues) => void;
}

const EmailStep = ({ loading, onSubmit }: EmailStepProps) => {
  const { handleSubmit, control } = useForm<ForgotPasswordFormValues>({
    defaultValues: { email: "" },
  });

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <>
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <img
            src="/logo.webp"
            alt="AbroadScholar"
            className="h-14 object-contain"
          />
        </div>

        <div className="flex justify-start mb-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm text-[#8a95b0] hover:text-[#1a2540] transition-colors group no-underline"
          >
            <FiArrowLeft
              size={14}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            Back to Sign In
          </Link>
        </div>

        <div className="mb-5 flex justify-center">
          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-full px-4 py-1.5 text-xs font-semibold text-blue-600">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            {today} — Password Recovery
          </span>
        </div>

        <h2 className="text-2xl font-extrabold text-[#1a2540] leading-tight mb-2">
          Forgot your password? 🔐
        </h2>
        <p className="text-sm text-[#8a95b0]">
          Enter your staff email and we'll send a 6-digit OTP to reset your
          password.
        </p>
      </div>

      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-8">
        <BsStars size={14} className="text-amber-500 shrink-0" />
        <span className="text-xs font-semibold text-amber-800">
          OTP expires in 30 minutes for your security 🔒
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
            pattern: { value: REGEX.EMAIL, message: "Enter a valid email" },
          }}
        />

        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
          size="large"
        >
          {!loading && "Send OTP →"}
        </Button>
      </form>

      <p className="text-center text-[13px] text-[#8a95b0] mt-5">
        Remembered it?{" "}
        <Link
          to="/login"
          className="text-[12.5px] text-blue-500 font-semibold hover:text-blue-700 transition-colors no-underline"
        >
          Sign in
        </Link>
      </p>
    </>
  );
};

export default EmailStep;
