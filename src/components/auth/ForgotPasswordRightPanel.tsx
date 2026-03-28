import {
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineInboxIn,
} from "react-icons/hi";
import { TbPasswordMobilePhone } from "react-icons/tb";
import { MdLockReset } from "react-icons/md";

const SECURITY_FEATURES = [
  {
    icon: <HiOutlineClock size={20} className="text-blue-500" />,
    iconBg: "bg-blue-100",
    cardBg: "bg-blue-50",
    cardBorder: "border-blue-100",
    title: "OTP expires in 30 minutes",
    desc: "Your one-time password is time-limited — no one else can use it, even if intercepted.",
  },
  {
    icon: <TbPasswordMobilePhone size={20} className="text-indigo-500" />,
    iconBg: "bg-indigo-100",
    cardBg: "bg-indigo-50",
    cardBorder: "border-indigo-100",
    title: "6-digit OTP via email",
    desc: "A secure code is sent only to your registered staff email — no SMS, no third-party.",
  },
  {
    icon: <HiOutlineInboxIn size={20} className="text-emerald-500" />,
    iconBg: "bg-emerald-100",
    cardBg: "bg-emerald-50",
    cardBorder: "border-emerald-100",
    title: "Sent only to verified staff email",
    desc: "Reset codes are delivered only to the email registered by your AbroadScolar admin.",
  },
  {
    icon: <MdLockReset size={20} className="text-amber-500" />,
    iconBg: "bg-amber-100",
    cardBg: "bg-amber-50",
    cardBorder: "border-amber-100",
    title: "Old password instantly invalidated",
    desc: "Once you reset, your previous password is revoked immediately across all sessions.",
  },
];

const STEPS = [
  { step: "1", label: "Enter your staff email address" },
  { step: "2", label: "Receive a 6-digit OTP in your inbox" },
  { step: "3", label: "Enter OTP & set your new password" },
];

const ForgotPasswordRightPanel = () => {
  return (
    <div className="hidden lg:flex flex-col justify-center w-1/2 px-16 py-12 bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-10 w-60 h-60 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto w-full">
        {/* Trust badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-600 mb-8">
          <HiOutlineShieldCheck className="text-blue-500" size={15} />
          Bank-grade security for your account
        </div>

        {/* Headline */}
        <h2 className="text-4xl font-extrabold text-[#1a2540] leading-tight mb-3">
          Your account is <span className="text-blue-600">safe with us.</span>
        </h2>
        <p className="text-[#8a95b0] text-base leading-relaxed mb-10">
          We take the security of your counsellor portal seriously. OTP resets
          are encrypted, time-limited, and tied only to your registered staff
          email.
        </p>

        {/* ── How it works — horizontal stepper ── */}
        <div className="mb-8">
          <p className="text-[11px] font-semibold text-[#8a95b0] uppercase tracking-widest text-center mb-6">
            How it works
          </p>

          {/* Stepper row */}
          <div className="flex items-start">
            {STEPS.map((item, i) => (
              <div key={item.step} className="flex-1 flex items-start">
                {/* Step + connector */}
                <div className="flex flex-col items-center w-full">
                  {/* Circle row with connector lines */}
                  <div className="flex items-center w-full">
                    {/* Left connector — hidden for first */}
                    <div
                      className={`flex-1 h-px ${i === 0 ? "opacity-0" : "bg-blue-200"}`}
                    />

                    {/* Circle */}
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-blue-200 shrink-0">
                      {item.step}
                    </div>

                    {/* Right connector — hidden for last */}
                    <div
                      className={`flex-1 h-px ${i === STEPS.length - 1 ? "opacity-0" : "bg-blue-200"}`}
                    />
                  </div>

                  {/* Label */}
                  <p className="text-center text-xs font-semibold text-[#1a2540] leading-snug mt-3 px-2">
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 mb-8" />

        {/* Feature cards */}
        <div className="space-y-3">
          {SECURITY_FEATURES.map((card, i) => (
            <div
              key={i}
              className={`flex items-start gap-4 ${card.cardBg} border ${card.cardBorder} rounded-2xl px-5 py-4`}
            >
              <div
                className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center shrink-0`}
              >
                {card.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a2540] mb-0.5">
                  {card.title}
                </p>
                <p className="text-xs text-[#8a95b0] leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="flex w-full text-center gap-2 mt-8 text-[11px] text-[#8a95b0]">
          <HiOutlineShieldCheck size={13} />© {new Date().getFullYear()}{" "}
          AbroadScolar Internal Portal — Confidential • Developed by Jai
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordRightPanel;
