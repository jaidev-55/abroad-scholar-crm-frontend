import { useState, useEffect, useRef } from "react";
import { Button, message } from "antd";
import {
  FiMail,
  FiLock,
  FiUser,
  FiArrowLeft,
  FiCheckCircle,
  FiStar,
  FiShield,
  FiArrowRight,
} from "react-icons/fi";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import CustomInput from "../../components/common/CustomInput";

// Update this to match your project's API base URL / axios instance
const API_BASE = "http://localhost:3000";

type Step = "register" | "otp" | "success";

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30;

const RegisterPage = () => {
  const [step, setStep] = useState<Step>("register");
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  // OTP state
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const navigate = useNavigate();

  const { handleSubmit, control, watch } = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  // Resend cooldown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Auto-focus first OTP input when step changes
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  // ─── Step 1: Register ───
  const onRegister = async (data: RegisterFormValues) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: "ADMIN",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Registration failed");
      }

      setUserEmail(data.email);
      setUserName(data.name.split(" ")[0]);
      setStep("otp");
      setResendTimer(RESEND_COOLDOWN);
      message.success("OTP sent to your email!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 2: Verify OTP ───
  const onVerifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== OTP_LENGTH) {
      message.error("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          otp: otpValue,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "OTP verification failed");
      }

      setStep("success");
      message.success("Account verified successfully!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      message.error(errorMessage);
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } finally {
      setLoading(false);
    }
  };

  // ─── Resend OTP ───
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to resend OTP");
      }

      setResendTimer(RESEND_COOLDOWN);
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
      message.success("OTP resent successfully!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ─── OTP Input Handlers ───
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // only digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // only last char
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (
      newOtp.every((d) => d !== "") &&
      newOtp.join("").length === OTP_LENGTH
    ) {
      setTimeout(() => onVerifyOtp(), 200);
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
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);

    // Focus last filled or next empty
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();

    if (pasted.length === OTP_LENGTH) {
      setTimeout(() => onVerifyOtp(), 200);
    }
  };

  // ─── Password strength indicator ───
  const password = watch("password", "");
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

  const strength = getPasswordStrength(password);

  return (
    <div className="flex min-h-screen w-full">
      {/* ════════════ LEFT FORM PANEL ════════════ */}
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

          {/* ───────── STEP 1: REGISTER FORM ───────── */}
          {step === "register" && (
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
                    {today} — New Registration
                  </span>
                </div>

                <h2 className="text-2xl font-extrabold text-[#1a2540] leading-tight mb-2">
                  Join the team! 🚀
                </h2>

                <p className="text-sm text-[#8a95b0]">
                  Create your staff account to access the AbroadScolar portal.
                </p>
              </div>

              {/* Welcome banner */}
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 mb-8">
                <span className="text-base">🎓</span>
                <span className="text-xs font-semibold text-emerald-800">
                  Every great counsellor's journey starts with this step
                </span>
              </div>

              <form onSubmit={handleSubmit(onRegister)} className="space-y-4">
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
                  placeholder="you@abroadscolar.com"
                  control={control}
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
                      minLength: {
                        value: 6,
                        message: "Minimum 6 characters required",
                      },
                    }}
                  />
                  {/* Password strength bar */}
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

              {/* Sign in link */}
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
          )}

          {/* ───────── STEP 2: OTP VERIFICATION ───────── */}
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

                <div className="flex justify-center mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                    <FiMail size={24} className="text-blue-500" />
                  </div>
                </div>

                <h2 className="text-2xl font-extrabold text-[#1a2540] leading-tight mb-2">
                  Verify your email ✉️
                </h2>

                <p className="text-sm text-[#8a95b0]">
                  We've sent a 6-digit code to
                </p>
                <p className="text-sm font-semibold text-[#1a2540] mt-1">
                  {userEmail}
                </p>
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
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={index === 0 ? handleOtpPaste : undefined}
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all duration-200 bg-white text-[#1a2540]"
                    style={{
                      borderColor: digit ? "#3b82f6" : "#e5e7eb",
                      boxShadow: digit
                        ? "0 0 0 3px rgba(59,130,246,0.1)"
                        : "none",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3b82f6";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(59,130,246,0.1)";
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
                    className="text-xs font-semibold text-blue-500 hover:text-blue-700 bg-transparent border-none cursor-pointer p-0 transition-colors duration-200"
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
                  loading={loading}
                  onClick={onVerifyOtp}
                  disabled={otp.join("").length !== OTP_LENGTH}
                >
                  {!loading && "Verify & Continue"}
                </Button>

                <Button
                  block
                  size="large"
                  onClick={() => {
                    setStep("register");
                    setOtp(Array(OTP_LENGTH).fill(""));
                  }}
                >
                  Use a different email
                </Button>
              </div>
            </>
          )}

          {/* ───────── STEP 3: SUCCESS ───────── */}
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
                Welcome aboard, {userName}! 🎉
              </h2>

              <p className="text-sm text-[#8a95b0] mb-3">
                Your account has been created and verified successfully.
              </p>

              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 mb-8">
                <span className="text-base">🚀</span>
                <span className="text-xs font-semibold text-emerald-800">
                  You're all set to start changing students' lives!
                </span>
              </div>

              <Button
                type="primary"
                block
                size="large"
                onClick={() => navigate("/login")}
              >
                <span className="flex items-center justify-center gap-2">
                  Sign In to My Dashboard
                  <FiArrowRight size={15} />
                </span>
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

      {/* ════════════ RIGHT CONTENT PANEL ════════════ */}
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
          {/* Top badge */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-white/75 border border-blue-100 rounded-full px-4 py-2 shadow-sm text-xs font-semibold text-[#3d5a9e] tracking-wide">
              <FiStar size={13} className="text-yellow-400" />
              Trusted by 50+ counsellors across India
            </div>
          </div>

          <h1 className="text-3xl xl:text-4xl font-extrabold text-[#1a2540] leading-tight mb-4">
            Start your journey <br />
            <span className="text-blue-500">with AbroadScolar.</span>
          </h1>

          <p className="text-sm text-[#6b7898] leading-relaxed mb-8">
            Join a team that's placed thousands of students in their dream
            universities worldwide.
          </p>

          {/* Step progress — highlights current step */}
          <div className="flex flex-col gap-4 text-left">
            {[
              {
                num: "1",
                title: "Create your account",
                desc: "Fill in your details — it only takes a minute.",
                active: step === "register",
                done: step === "otp" || step === "success",
              },
              {
                num: "2",
                title: "Verify your email",
                desc: "Enter the 6-digit OTP sent to your inbox.",
                active: step === "otp",
                done: step === "success",
              },
              {
                num: "3",
                title: "You're in!",
                desc: "Access your dashboard, pipeline & today's tasks.",
                active: step === "success",
                done: false,
              },
            ].map(({ num, title, desc, active, done }) => (
              <div
                key={num}
                className={`flex items-start gap-3 rounded-xl p-3.5 backdrop-blur-sm border transition-all duration-300 ${
                  active
                    ? "bg-blue-50/90 border-blue-300 shadow-sm"
                    : "bg-white/80 border-blue-100"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 ${
                    done
                      ? "bg-green-500 border-green-500"
                      : active
                        ? "bg-blue-500 border-blue-500"
                        : "bg-blue-50 border-blue-100"
                  }`}
                >
                  {done ? (
                    <FiCheckCircle size={16} className="text-white" />
                  ) : (
                    <span
                      className={`text-sm font-bold transition-all duration-300 ${
                        active ? "text-white" : "text-blue-500"
                      }`}
                    >
                      {num}
                    </span>
                  )}
                </div>
                <div>
                  <p
                    className={`text-[13px] font-semibold leading-snug transition-all duration-300 ${
                      active
                        ? "text-blue-700"
                        : done
                          ? "text-green-700"
                          : "text-[#1a2540]"
                    }`}
                  >
                    {title}
                  </p>
                  <p className="text-[11.5px] text-[#8a95b0] mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Security footer */}
          <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-[#8a95b0]">
            <FiShield size={12} />
            <span>Your data is encrypted and secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
