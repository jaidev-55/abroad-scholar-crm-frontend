import { useState } from "react";
import { Button, message } from "antd";
import {
  FiMail,
  FiArrowLeft,
  FiShield,
  FiCheckCircle,
  FiLock,
  FiHash,
} from "react-icons/fi";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import CustomInput from "../../components/common/CustomInput";

const API_BASE = "http://localhost:3000";

type Step = "email" | "otp" | "success";

interface EmailFormValues {
  email: string;
}

interface ResetFormValues {
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

const ForgotPasswordPage = () => {
  const [step, setStep] = useState<Step>("success");
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const navigate = useNavigate();

  const { handleSubmit: handleEmailSubmit, control: emailControl } =
    useForm<EmailFormValues>();

  const {
    handleSubmit: handleResetSubmit,
    control: resetControl,
    watch,
  } = useForm<ResetFormValues>();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  // Step 1: Send OTP to email
  const onSendOtp = async (data: EmailFormValues) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to send OTP");
      }

      setUserEmail(data.email);
      setStep("otp");
      message.success("OTP sent to your email!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & reset password
  const onResetPassword = async (data: ResetFormValues) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          otp: data.otp,
          newPassword: data.newPassword,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to reset password");
      }

      setStep("success");
      message.success("Password reset successfully!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to resend OTP");
      }

      message.success("OTP resent successfully!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* LEFT FORM PANEL */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center p-5 py-12 border-r border-gray-100">
        <div className="w-full max-w-[420px] mx-auto">
          {/* Back to login */}
          <button
            onClick={() => navigate("/login")}
            className="inline-flex items-center gap-1.5 text-sm text-[#8a95b0] hover:text-blue-500 font-medium transition-colors duration-200 mb-8 bg-transparent border-none cursor-pointer p-0"
          >
            <FiArrowLeft size={15} />
            Back to Sign In
          </button>

          {/* STEP 1: EMAIL */}
          {step === "email" && (
            <>
              <div className="text-center mb-8">
                <div className="flex justify-center mb-6">
                  <img
                    src="/logo.webp"
                    alt="AbroadScolar Logo"
                    className="h-14 object-contain"
                  />
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
                  No worries — enter your staff email and we'll send you an OTP
                  to reset your password.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 mb-10">
                <FiShield size={14} className="text-blue-500" />
                <span className="text-xs font-semibold text-blue-800">
                  A 6-digit OTP will be sent to your email
                </span>
              </div>

              <form
                onSubmit={handleEmailSubmit(onSendOtp)}
                className="space-y-5"
              >
                <CustomInput
                  name="email"
                  label="Staff Email"
                  placeholder="you@abroadscolar.com"
                  control={emailControl}
                  size="large"
                  type="email"
                  icon={<FiMail size={14} className="text-[#b4bcd4]" />}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  }}
                />

                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  size="large"
                >
                  {!loading && "Send OTP"}
                </Button>
              </form>
            </>
          )}

          {/*  STEP 2: OTP + NEW PASSWORD */}
          {step === "otp" && (
            <>
              <div className="text-center mb-8">
                <div className="flex justify-center mb-6">
                  <img
                    src="/logo.webp"
                    alt="AbroadScolar Logo"
                    className="h-14 object-contain"
                  />
                </div>

                <h2 className="text-2xl font-extrabold text-[#1a2540] leading-tight mb-2">
                  Enter OTP & new password 🔑
                </h2>

                <p className="text-sm text-[#8a95b0]">
                  We've sent a 6-digit code to{" "}
                  <span className="font-semibold text-[#1a2540]">
                    {userEmail}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-10">
                <span className="text-base">⏱️</span>
                <span className="text-xs font-semibold text-amber-800">
                  OTP expires in 10 minutes.{" "}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-blue-500 hover:text-blue-700 underline bg-transparent border-none cursor-pointer p-0 text-xs font-semibold"
                  >
                    Resend OTP
                  </button>
                </span>
              </div>

              <form
                onSubmit={handleResetSubmit(onResetPassword)}
                className="space-y-5"
              >
                <CustomInput
                  name="otp"
                  label="OTP Code"
                  placeholder="Enter 6-digit OTP"
                  control={resetControl}
                  size="large"
                  type="text"
                  icon={<FiHash size={14} className="text-[#b4bcd4]" />}
                  rules={{
                    required: "OTP is required",
                    pattern: {
                      value: /^\d{6}$/,
                      message: "Enter a valid 6-digit OTP",
                    },
                  }}
                />

                <CustomInput
                  name="newPassword"
                  label="New Password"
                  placeholder="Enter new password"
                  control={resetControl}
                  size="large"
                  type="password"
                  icon={<FiLock size={14} className="text-[#b4bcd4]" />}
                  rules={{
                    required: "New password is required",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 characters required",
                    },
                  }}
                />

                <CustomInput
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="Re-enter new password"
                  control={resetControl}
                  size="large"
                  type="password"
                  icon={<FiLock size={14} className="text-[#b4bcd4]" />}
                  rules={{
                    required: "Please confirm your password",
                    validate: (value: string) =>
                      value === watch("newPassword") ||
                      "Passwords do not match",
                  }}
                />

                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  size="large"
                >
                  {!loading && "Reset Password"}
                </Button>

                <Button
                  block
                  size="large"
                  onClick={() => {
                    setStep("email");
                    setUserEmail("");
                  }}
                >
                  Use a different email
                </Button>
              </form>
            </>
          )}

          {/*  STEP 3: SUCCESS */}
          {step === "success" && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <img
                  src="/logo.webp"
                  alt="AbroadScolar Logo"
                  className="h-14 object-contain"
                />
              </div>

              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                  <FiCheckCircle size={28} className="text-green-500" />
                </div>
              </div>

              <h2 className="text-2xl font-extrabold text-[#1a2540] leading-tight mb-2">
                Password reset successful! 🎉
              </h2>

              <p className="text-sm text-[#8a95b0] mb-8">
                Your password has been updated. You can now sign in with your
                new password.
              </p>

              <Button
                type="primary"
                block
                size="large"
                onClick={() => navigate("/login")}
              >
                Back to Sign In
              </Button>
            </div>
          )}

          {/* Footer */}
          <div className="mt-7 pt-5 border-t border-[#f0f3fa]">
            <p className="text-center text-[11px] text-gray-500">
              © {new Date().getFullYear()} AbroadScolar Internal Portal.
              Confidential.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT CONTENT PANEL */}
      <div
        className="hidden lg:flex flex-col justify-center items-center w-[60%] px-12 xl:px-16 py-12 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(150deg,#f0f7ff 0%,#e6f2ff 55%,#f4f9ff 100%)",
        }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle,#1677ff12 1.5px,transparent 1.5px)",
            backgroundSize: "26px 26px",
          }}
        />
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 380,
            height: 380,
            background: "radial-gradient(circle,#1677ff18 0%,transparent 70%)",
            top: -110,
            right: -90,
          }}
        />
        <div
          className="absolute pointer-events-none rounded-full bottom-0 right-0"
          style={{
            width: 260,
            height: 260,
            background: "rgba(147,197,253,0.35)",
            filter: "blur(65px)",
          }}
        />
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 180,
            height: 180,
            background: "rgba(125,211,252,0.25)",
            filter: "blur(55px)",
            top: "38%",
            left: -30,
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-md text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-white/80 border border-blue-100 flex items-center justify-center shadow-sm">
              <FiShield size={36} className="text-blue-500" />
            </div>
          </div>

          <h1 className="text-3xl xl:text-4xl font-extrabold text-[#1a2540] leading-tight mb-4">
            We've got your <br />
            <span className="text-blue-500">back, always.</span>
          </h1>

          <p className="text-sm text-[#6b7898] leading-relaxed mb-8">
            Resetting your password is quick and secure. You'll be back to
            coaching your students in no time.
          </p>

          {/* Steps */}
          <div className="flex flex-col gap-4 text-left">
            {[
              {
                step: "1",
                title: "Enter your email",
                desc: "Use the staff email linked to your account.",
                active: step === "email",
              },
              {
                step: "2",
                title: "Verify OTP & set password",
                desc: "Enter the 6-digit code and choose a new password.",
                active: step === "otp",
              },
              {
                step: "3",
                title: "You're all set!",
                desc: "Sign in with your new password and get back to work.",
                active: step === "success",
              },
            ].map(({ step: stepNum, title, desc, active }) => (
              <div
                key={stepNum}
                className={`flex items-start gap-3 rounded-xl p-3.5 backdrop-blur-sm border transition-all duration-300 ${
                  active
                    ? "bg-blue-50/90 border-blue-300 shadow-sm"
                    : "bg-white/80 border-blue-100"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 ${
                    active
                      ? "bg-blue-500 border-blue-500"
                      : "bg-blue-50 border-blue-100"
                  }`}
                >
                  <span
                    className={`text-sm font-bold transition-all duration-300 ${
                      active ? "text-white" : "text-blue-500"
                    }`}
                  >
                    {stepNum}
                  </span>
                </div>
                <div>
                  <p
                    className={`text-[13px] font-semibold leading-snug transition-all duration-300 ${
                      active ? "text-blue-700" : "text-[#1a2540]"
                    }`}
                  >
                    {title}
                  </p>
                  <p className="text-[11.5px] text-[#8a95b0] mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
