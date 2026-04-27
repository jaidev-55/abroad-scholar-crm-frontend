import { FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

const SuccessStep = () => (
  <>
    <div className="flex justify-center mb-6">
      <img
        src="/logo.webp"
        alt="AbroadScholar"
        className="h-14 object-contain"
      />
    </div>

    <div className="text-center">
      <div className="flex justify-center mb-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
            <FiCheckCircle size={42} className="text-green-500" />
          </div>
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>
        </div>
      </div>

      <h2 className="text-2xl font-extrabold text-[#1a2540] mb-2">
        Password reset! 🎉
      </h2>
      <p className="text-sm text-[#8a95b0] mb-6">
        Your password has been updated successfully. Sign in with your new
        password.
      </p>

      <div className="bg-[#f8faff] border border-[#edf0fb] rounded-xl p-4 text-left space-y-3 mb-6">
        <p className="text-[11px] font-semibold text-[#8a95b0] uppercase tracking-wider">
          What happened
        </p>
        {[
          "OTP verified successfully",
          "New password saved & encrypted",
          "All previous sessions invalidated",
        ].map((text, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold bg-green-500 text-white">
              ✓
            </div>
            <p className="text-sm text-green-600 font-medium">{text}</p>
          </div>
        ))}
      </div>

      <Link
        to="/login"
        className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3 rounded-lg transition-all no-underline"
      >
        Sign In to My Dashboard →
      </Link>
    </div>
  </>
);

export default SuccessStep;
