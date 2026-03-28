import { useEffect, useRef, useState } from "react";
import { Button, message } from "antd";
import { FiMail } from "react-icons/fi";
import { useMutation } from "@tanstack/react-query";
import { REGEX } from "../../utils/regex";
import { verifyOtp, resendOtp } from "../../api/auth";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30;

interface OtpVerificationProps {
  userEmail: string;
  onSuccess: () => void;
  onBack: () => void;
}

const OtpVerification = ({
  userEmail,
  onSuccess,
  onBack,
}: OtpVerificationProps) => {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { mutate: verifyMutate, isPending: verifying } = useMutation({
    mutationFn: verifyOtp,
  });

  const { mutate: resendMutate, isPending: resending } = useMutation({
    mutationFn: resendOtp,
  });

  const loading = verifying || resending;

  useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(
      () => setResendTimer((prev) => prev - 1),
      1000,
    );
    return () => clearInterval(interval);
  }, [resendTimer]);

  const onVerifyOtp = (otpOverride?: string[]) => {
    const otpValue = (otpOverride ?? otp).join("");
    if (otpValue.length !== OTP_LENGTH) {
      message.error("Please enter the complete 6-digit OTP");
      return;
    }

    verifyMutate(
      { email: userEmail, otp: otpValue },
      {
        onSuccess: () => {
          message.success("Account verified successfully!");
          onSuccess();
        },
        onError: (err) => {
          message.error(err?.message || "OTP verification failed");
          setOtp(Array(OTP_LENGTH).fill(""));
          setTimeout(() => inputRefs.current[0]?.focus(), 100);
        },
      },
    );
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;

    resendMutate(
      { email: userEmail },
      {
        onSuccess: () => {
          setResendTimer(RESEND_COOLDOWN);
          setOtp(Array(OTP_LENGTH).fill(""));
          setTimeout(() => inputRefs.current[0]?.focus(), 100);
          message.success("OTP resent successfully!");
        },
        onError: (err) => {
          message.error(err?.message || "Failed to resend OTP");
        },
      },
    );
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!REGEX.ONLY_DIGITS.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
    if (
      newOtp.every((d) => d !== "") &&
      newOtp.join("").length === OTP_LENGTH
    ) {
      setTimeout(() => onVerifyOtp(newOtp), 200);
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i];
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
    if (pasted.length === OTP_LENGTH)
      setTimeout(() => onVerifyOtp(newOtp), 200);
  };

  return (
    <>
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <img
            src="/logo.webp"
            alt="AbroadScolar Logo"
            className="h-14 object-contain"
          />
        </div>

        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center">
            <FiMail size={24} className="text-blue-500" />
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-[#1a2540] leading-tight mb-2">
          Verify your email ✉️
        </h2>
        <p className="text-sm text-[#8a95b0]">We've sent a 6-digit code to</p>
        <p className="text-sm font-semibold text-[#1a2540] mt-1">{userEmail}</p>
      </div>

      {/* OTP Input Grid */}
      <div className="flex justify-center gap-3 mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={loading}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(index, e)}
            onPaste={index === 0 ? handleOtpPaste : undefined}
            className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all duration-200 bg-white text-[#1a2540] disabled:opacity-60"
            style={{
              borderColor: digit ? "#3b82f6" : "#e5e7eb",
              boxShadow: digit ? "0 0 0 3px rgba(59,130,246,0.1)" : "none",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#3b82f6";
              e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)";
            }}
            onBlur={(e) => {
              if (!digit) {
                e.target.style.borderColor = "#e5e7eb";
                e.target.style.boxShadow = "none";
              }
            }}
          />
        ))}
      </div>

      {/* Timer & resend */}
      <div className="text-center mb-8">
        {resendTimer > 0 ? (
          <p className="text-xs text-[#8a95b0]">
            Resend OTP in{" "}
            <span className="font-bold text-[#1a2540]">
              0:{resendTimer.toString().padStart(2, "0")}
            </span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resending}
            className="text-xs font-semibold text-blue-500 hover:text-blue-700 bg-transparent border-none cursor-pointer p-0 transition-colors duration-200 disabled:opacity-50"
          >
            Didn't receive the code? Resend OTP
          </button>
        )}
      </div>

      <div className="space-y-3">
        <Button
          type="primary"
          block
          size="large"
          loading={verifying}
          onClick={() => onVerifyOtp()}
          disabled={otp.join("").length !== OTP_LENGTH}
        >
          {!verifying && "Verify & Continue"}
        </Button>

        <Button
          block
          size="large"
          disabled={loading}
          onClick={() => {
            setOtp(Array(OTP_LENGTH).fill(""));
            onBack();
          }}
        >
          Use a different email
        </Button>
      </div>
    </>
  );
};

export default OtpVerification;
