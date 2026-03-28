import { Button } from "antd";
import { FiArrowLeft, FiLock } from "react-icons/fi";
import { TbPasswordMobilePhone } from "react-icons/tb";
import { useForm } from "react-hook-form";
import type { ResetPasswordFormValues } from "../../../types/auth";
import CustomInput from "../../common/CustomInput";

interface ResetStepProps {
  loading: boolean;
  submittedEmail: string;
  onSubmit: (data: ResetPasswordFormValues) => void;
  onBack: () => void;
}

const ResetStep = ({
  loading,
  submittedEmail,
  onSubmit,
  onBack,
}: ResetStepProps) => {
  const { handleSubmit, control, watch } = useForm<ResetPasswordFormValues>({
    defaultValues: { otp: "", newPassword: "", confirmPassword: "" },
  });

  const newPassword = watch("newPassword");

  return (
    <>
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <img
            src="/logo.webp"
            alt="AbroadScolar"
            className="h-14 object-contain"
          />
        </div>

        <div className="flex justify-start mb-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm text-[#8a95b0] hover:text-[#1a2540] transition-colors group bg-transparent border-none cursor-pointer p-0"
          >
            <FiArrowLeft
              size={14}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            Use a different email
          </button>
        </div>

        <div className="mb-5 flex justify-center">
          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-full px-4 py-1.5 text-xs font-semibold text-blue-600">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            OTP Sent — Check Your Inbox
          </span>
        </div>

        <h2 className="text-2xl font-extrabold text-[#1a2540] leading-tight mb-2">
          Enter your OTP 📬
        </h2>
        <p className="text-sm text-[#8a95b0]">
          We sent a 6-digit code to{" "}
          <span className="font-semibold text-blue-600">{submittedEmail}</span>
        </p>
      </div>

      <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 mb-8">
        <TbPasswordMobilePhone size={15} className="text-blue-500 shrink-0" />
        <span className="text-xs font-semibold text-blue-700">
          Enter the 6-digit OTP from your email, then set your new password
          below.
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <CustomInput
          name="otp"
          label="6-Digit OTP"
          placeholder="e.g. 123456"
          control={control}
          size="large"
          type="text"
          icon={<TbPasswordMobilePhone size={14} className="text-[#b4bcd4]" />}
          rules={{
            required: "OTP is required",
            pattern: {
              value: /^\d{6}$/,
              message: "OTP must be exactly 6 digits",
            },
          }}
        />

        <CustomInput
          name="newPassword"
          label="New Password"
          placeholder="Create a strong password"
          control={control}
          size="large"
          type="password"
          icon={<FiLock size={14} className="text-[#b4bcd4]" />}
          rules={{
            required: "New password is required",
            minLength: { value: 6, message: "Minimum 6 characters required" },
          }}
        />

        <CustomInput
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Re-enter your new password"
          control={control}
          size="large"
          type="password"
          icon={<FiLock size={14} className="text-[#b4bcd4]" />}
          rules={{
            required: "Please confirm your password",
            validate: (val) => val === newPassword || "Passwords do not match",
          }}
        />

        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
          size="large"
        >
          {!loading && "Reset Password →"}
        </Button>
      </form>
    </>
  );
};

export default ResetStep;
