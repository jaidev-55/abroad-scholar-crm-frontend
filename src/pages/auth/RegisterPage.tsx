import { useState } from "react";
import { message } from "antd";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import OtpVerification from "../../components/auth/OtpVerification";
import SuccessStep from "../../components/auth/SuccessStep";
import AuthRightPanel from "../../components/auth/AuthRightPanel";
import type { RegisterFormValues } from "../../components/auth/RegisterForm";
import RegisterForm from "../../components/auth/RegisterForm";
import { registerUser } from "../../api/auth";

type Step = "register" | "otp" | "success";

const RegisterPage = () => {
  const [step, setStep] = useState<Step>("register");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({ mutationFn: registerUser });

  const onRegister = (data: RegisterFormValues) => {
    mutate(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      },
      {
        onSuccess: () => {
          setUserEmail(data.email);
          setUserName(data.name.split(" ")[0]);
          setStep("otp");
          message.success("OTP sent to your email!");
        },
        onError: (err) => {
          message.error(err?.message || "Registration failed");
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* LEFT FORM PANEL */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center p-5 py-12 border-r border-gray-100">
        <div className="w-full max-w-[420px] mx-auto">
          <button
            onClick={() => navigate("/login")}
            className="inline-flex items-center gap-1.5 text-sm text-[#8a95b0] hover:text-blue-500 font-medium transition-colors duration-200 mb-8 bg-transparent border-none cursor-pointer p-0"
          >
            <FiArrowLeft size={15} />
            Back to Sign In
          </button>

          {step === "register" && (
            <RegisterForm loading={isPending} onSubmit={onRegister} />
          )}

          {step === "otp" && (
            <OtpVerification
              userEmail={userEmail}
              onSuccess={() => setStep("success")}
              onBack={() => setStep("register")}
            />
          )}

          {step === "success" && <SuccessStep userName={userName} />}

          <div className="mt-7 pt-5 border-t border-[#f0f3fa]">
            <p className="text-center text-[11px] text-gray-500">
              © {new Date().getFullYear()} AbroadScholar Internal Portal.
              Confidential
            </p>
          </div>
        </div>
      </div>

      <AuthRightPanel step={step} />
    </div>
  );
};

export default RegisterPage;
