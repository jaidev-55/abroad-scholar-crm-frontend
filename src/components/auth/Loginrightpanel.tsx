import { FiStar, FiTarget, FiTrendingUp, FiUsers, FiZap } from "react-icons/fi";

const FEATURES = [
  {
    icon: FiTarget,
    label: "Your Daily Target Board",
    desc: "See your counselling KPIs, follow-up tasks and batch goals for today — all in one glance.",
    bgClass: "bg-blue-50",
    borderClass: "border-blue-100",
    iconColor: "#3b82f6",
  },
  {
    icon: FiTrendingUp,
    label: "Track Your Performance",
    desc: "Monitor your IELTS batch results, student band improvements and placement closures month-on-month.",
    bgClass: "bg-indigo-50",
    borderClass: "border-indigo-100",
    iconColor: "#6366f1",
  },
  {
    icon: FiUsers,
    label: "Smart Lead Pipeline",
    desc: "Track students from New Lead → IELTS → Applied → Offer → Visa → Enrolled — never lose a follow-up.",
    bgClass: "bg-sky-50",
    borderClass: "border-sky-100",
    iconColor: "#0ea5e9",
  },
  {
    icon: FiZap,
    label: "Quick Actions",
    desc: "Log a session, update a student's progress, or schedule a mock test in seconds — no paperwork.",
    bgClass: "bg-blue-50",
    borderClass: "border-blue-100",
    iconColor: "#3b82f6",
  },
];

const STATS = [
  { value: "94%", label: "Avg. Batch Completion" },
  { value: "7.5", label: "Avg. Band Score" },
  { value: "30+", label: "Colleges in Network" },
  { value: "98%", label: "Visa Success Rate" },
];

const LoginRightPanel = () => {
  return (
    <div
      className="hidden lg:flex flex-col justify-center w-[60%] px-12 xl:px-16 py-12 relative overflow-hidden"
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
      {/* Accent circle */}
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
      {/* Blobs */}
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

      {/* Top badge */}
      <div className="relative z-10 my-10">
        <div className="inline-flex items-center gap-2 bg-white/75 border border-blue-100 rounded-full px-4 py-2 shadow-sm text-xs font-semibold text-[#3d5a9e] tracking-wide">
          <FiStar size={13} className="text-yellow-400" />
          Your work is shaping students' futures — every session matters
        </div>
      </div>

      {/* Middle section */}
      <div className="relative z-10 flex flex-col gap-6">
        {/* Headline */}
        <div>
          <h1 className="text-3xl xl:text-4xl font-extrabold text-[#1a2540] leading-tight mb-3">
            Your coaching. <br />
            <span className="text-blue-500">Their dream university.</span>
          </h1>
          <p className="text-sm text-[#6b7898] leading-relaxed max-w-md">
            Everything you need to coach smarter, track faster and place more
            students — built for the AbroadScholar team.
          </p>
        </div>

        {/* Feature cards */}
        <div className="flex flex-col gap-6">
          {FEATURES.map(
            ({ icon: Icon, label, desc, bgClass, borderClass, iconColor }) => (
              <div
                key={label}
                className={`flex items-start gap-3 rounded-xl p-3.5 bg-white/80 backdrop-blur-sm border ${borderClass} hover:translate-x-1 hover:shadow-md transition-all duration-200`}
              >
                <div
                  className={`w-9 h-9 rounded-lg ${bgClass} border ${borderClass} flex items-center justify-center shrink-0 mt-0.5`}
                >
                  <Icon size={16} style={{ color: iconColor }} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#1a2540] leading-snug">
                    {label}
                  </p>
                  <p className="text-[11.5px] text-[#8a95b0] mt-0.5">{desc}</p>
                </div>
              </div>
            ),
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-3">
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              className="bg-white border border-blue-100 rounded-xl p-3 text-center shadow-sm"
            >
              <p className="text-lg font-extrabold text-blue-500">{value}</p>
              <p className="text-[10.5px] font-medium leading-tight mt-0.5">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginRightPanel;
