import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";

import ForgotPasswordRightPanel from "../../components/auth/ForgotPasswordRightPanel";

import { forgotPassword, resetPassword } from "../../api/auth";
import type { ForgotPasswordFormValues, ForgotStep, ResetPasswordFormValues } from "../../types/auth";
import ForgotPasswordForm from "../../components/auth/forgot-password/ForgotPasswordForm";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState<ForgotStep>("email");
  const [submittedEmail, setSubmittedEmail] = useState("");

  // Step 1 — Send OTP
  const { mutate: sendOtp, isPending: isSendingOtp } = useMutation({
    mutationFn: forgotPassword,
  });

  // Step 2 — Reset password with OTP
  const { mutate: doReset, isPending: isResetting } = useMutation({
    mutationFn: resetPassword,
  });

  const onEmailSubmit = (data: ForgotPasswordFormValues) => {
    sendOtp(
      { email: data.email },
      {
        onSuccess: () => {
          setSubmittedEmail(data.email);
          setStep("reset");
          message.success("OTP sent! Check your inbox.");
        },
        onError: (err) => {
          message.error(
            err?.message || "Could not send OTP. Please try again.",
          );
        },
      },
    );
  };

  const onResetSubmit = (data: ResetPasswordFormValues) => {
    doReset(
      { otp: data.otp, newPassword: data.newPassword },
      {
        onSuccess: () => {
          setStep("success");
        },
        onError: (err) => {
          message.error(
            err?.message || "Invalid or expired OTP. Please try again.",
          );
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* LEFT FORM PANEL */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center p-5 py-12 border-r border-gray-100">
        <div className="w-full max-w-[420px] mx-auto">
          <ForgotPasswordForm
            step={step}
            loading={isSendingOtp || isResetting}
            submittedEmail={submittedEmail}
            onEmailSubmit={onEmailSubmit}
            onResetSubmit={onResetSubmit}
            onBack={() => setStep("email")}
          />

          {/* Footer */}
          <div className="mt-7 pt-5 border-t border-[#f0f3fa]">
            <p className="text-center text-[11px] text-gray-500">
              © {new Date().getFullYear()} AbroadScholar Internal Portal —
              Confidential • Developed by Jai
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT CONTENT PANEL */}
      <ForgotPasswordRightPanel />
    </div>
  );
};

export default ForgotPasswordPage;
