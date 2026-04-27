import { FiStar, FiShield, FiCheckCircle } from "react-icons/fi";

type Step = "register" | "otp" | "success";

interface AuthRightPanelProps {
  step: Step;
}

const steps = [
  {
    num: "1",
    key: "register" as Step,
    title: "Create your account",
    desc: "Fill in your details — it only takes a minute.",
  },
  {
    num: "2",
    key: "otp" as Step,
    title: "Verify your email",
    desc: "Enter the 6-digit OTP sent to your inbox.",
  },
  {
    num: "3",
    key: "success" as Step,
    title: "You're in!",
    desc: "Access your dashboard, pipeline & today's tasks.",
  },
];

const stepOrder: Step[] = ["register", "otp", "success"];

const AuthRightPanel = ({ step }: AuthRightPanelProps) => {
  const currentIndex = stepOrder.indexOf(step);

  return (
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
          <span className="text-blue-500">with AbroadScholar.</span>
        </h1>

        <p className="text-sm text-[#6b7898] leading-relaxed mb-8">
          Join a team that's placed thousands of students in their dream
          universities worldwide.
        </p>

        {/* Step progress */}
        <div className="flex flex-col gap-4 text-left">
          {steps.map(({ num, key, title, desc }) => {
            const stepIndex = stepOrder.indexOf(key);
            const active = step === key;
            const done = stepIndex < currentIndex;

            return (
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
            );
          })}
        </div>

        {/* Security footer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-[#8a95b0]">
          <FiShield size={12} />
          <span>Your data is encrypted and secure</span>
        </div>
      </div>
    </div>
  );
};

export default AuthRightPanel;
