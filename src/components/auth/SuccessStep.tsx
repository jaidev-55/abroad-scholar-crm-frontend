import { Button } from "antd";
import { FiCheckCircle, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface SuccessStepProps {
  userName: string;
}

const SuccessStep = ({ userName }: SuccessStepProps) => {
  const navigate = useNavigate();

  return (
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
  );
};

export default SuccessStep;
