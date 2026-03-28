import { useState, useRef, useEffect, useCallback } from "react";
import { Table, Tag, Progress } from "antd";
import type { ColumnsType } from "antd/es/table";
import * as echarts from "echarts";
import {
  FiUsers,
  FiFileText,
  FiAward,
  FiGlobe,
  FiCheckCircle,
  FiDollarSign,
  FiTrendingUp,
  FiArrowUpRight,
  FiArrowDownRight,
  FiBarChart2,
  FiTarget,
  FiBookOpen,
  FiMapPin,
  FiCalendar,
  FiFilter,
} from "react-icons/fi";

// ════════════════════════════════════════════════
// REUSABLE ECHART WRAPPER
// ════════════════════════════════════════════════
const EChart = ({
  option,
  style,
}: {
  option: Record<string, unknown>;
  style?: React.CSSProperties;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);

  const initChart = useCallback(() => {
    if (!chartRef.current) return;

    // Dispose existing instance before re-init
    if (instanceRef.current) {
      instanceRef.current.dispose();
    }

    instanceRef.current = echarts.init(chartRef.current);
    instanceRef.current.setOption(option);
  }, [option]);

  useEffect(() => {
    initChart();

    const handleResize = () => {
      instanceRef.current?.resize();
    };

    window.addEventListener("resize", handleResize);

    // ResizeObserver for container-level resizing (sidebar toggle etc.)
    const observer = new ResizeObserver(() => {
      instanceRef.current?.resize();
    });

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      instanceRef.current?.dispose();
      instanceRef.current = null;
    };
  }, [initChart]);

  return <div ref={chartRef} style={style} />;
};

// ════════════════════════════════════════════════
// DUMMY DATA
// ════════════════════════════════════════════════

const OVERVIEW_STATS = [
  {
    label: "Total Leads",
    value: "1,248",
    change: "+12.5%",
    trend: "up" as const,
    icon: FiUsers,
    color: "#3b82f6",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  {
    label: "Applications",
    value: "486",
    change: "+8.2%",
    trend: "up" as const,
    icon: FiFileText,
    color: "#6366f1",
    bg: "#f5f3ff",
    border: "#ddd6fe",
  },
  {
    label: "Offers",
    value: "312",
    change: "+15.3%",
    trend: "up" as const,
    icon: FiAward,
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fde68a",
  },
  {
    label: "Visas",
    value: "245",
    change: "+6.8%",
    trend: "up" as const,
    icon: FiGlobe,
    color: "#0ea5e9",
    bg: "#f0f9ff",
    border: "#bae6fd",
  },
  {
    label: "Enrollments",
    value: "198",
    change: "+22.1%",
    trend: "up" as const,
    icon: FiCheckCircle,
    color: "#059669",
    bg: "#ecfdf5",
    border: "#a7f3d0",
  },
  {
    label: "Revenue",
    value: "₹48.5L",
    change: "+18.4%",
    trend: "up" as const,
    icon: FiDollarSign,
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
  },
  {
    label: "Conversion Rate",
    value: "15.8%",
    change: "-2.1%",
    trend: "down" as const,
    icon: FiTrendingUp,
    color: "#ef4444",
    bg: "#fef2f2",
    border: "#fecaca",
  },
];

const FUNNEL_DATA = [
  { stage: "Leads Created", count: 1248, color: "#3b82f6" },
  { stage: "Contacted", count: 980, color: "#6366f1" },
  { stage: "IELTS Enrolled", count: 620, color: "#8b5cf6" },
  { stage: "Applied", count: 486, color: "#f59e0b" },
  { stage: "Offer Received", count: 312, color: "#0ea5e9" },
  { stage: "Visa Approved", count: 245, color: "#14b8a6" },
  { stage: "Enrolled", count: 198, color: "#059669" },
];

interface LeadSource {
  key: string;
  source: string;
  leads: number;
  applications: number;
  enrolled: number;
  conversionRate: number;
  color: string;
}

const LEAD_SOURCE_DATA: LeadSource[] = [
  {
    key: "1",
    source: "Website",
    leads: 480,
    applications: 210,
    enrolled: 95,
    conversionRate: 19.8,
    color: "#3b82f6",
  },
  {
    key: "2",
    source: "Facebook Ads",
    leads: 320,
    applications: 145,
    enrolled: 52,
    conversionRate: 16.3,
    color: "#6366f1",
  },
  {
    key: "3",
    source: "Instagram Ads",
    leads: 180,
    applications: 72,
    enrolled: 28,
    conversionRate: 15.6,
    color: "#ec4899",
  },
  {
    key: "4",
    source: "Referral",
    leads: 148,
    applications: 85,
    enrolled: 48,
    conversionRate: 32.4,
    color: "#059669",
  },
  {
    key: "5",
    source: "Walk-in",
    leads: 80,
    applications: 42,
    enrolled: 22,
    conversionRate: 27.5,
    color: "#f59e0b",
  },
  {
    key: "6",
    source: "Google Ads",
    leads: 40,
    applications: 18,
    enrolled: 8,
    conversionRate: 20.0,
    color: "#0ea5e9",
  },
];

interface CountryData {
  key: string;
  country: string;
  flag: string;
  leads: number;
  applications: number;
  enrolled: number;
  revenue: string;
}

const COUNTRY_DATA: CountryData[] = [
  {
    key: "1",
    country: "United Kingdom",
    flag: "🇬🇧",
    leads: 420,
    applications: 185,
    enrolled: 78,
    revenue: "₹18.2L",
  },
  {
    key: "2",
    country: "Canada",
    flag: "🇨🇦",
    leads: 350,
    applications: 152,
    enrolled: 62,
    revenue: "₹14.5L",
  },
  {
    key: "3",
    country: "Australia",
    flag: "🇦🇺",
    leads: 210,
    applications: 88,
    enrolled: 35,
    revenue: "₹8.8L",
  },
  {
    key: "4",
    country: "USA",
    flag: "🇺🇸",
    leads: 148,
    applications: 55,
    enrolled: 18,
    revenue: "₹5.2L",
  },
  {
    key: "5",
    country: "Germany",
    flag: "🇩🇪",
    leads: 80,
    applications: 32,
    enrolled: 12,
    revenue: "₹2.8L",
  },
  {
    key: "6",
    country: "Ireland",
    flag: "🇮🇪",
    leads: 40,
    applications: 18,
    enrolled: 8,
    revenue: "₹1.5L",
  },
];

const MONTHLY_DATA = {
  months: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
  leads: [85, 102, 78, 145, 168, 198],
  applications: [32, 41, 28, 58, 72, 86],
  enrollments: [12, 18, 14, 25, 32, 38],
  revenue: [2.8, 3.6, 2.4, 5.2, 6.8, 8.5],
};

const IELTS_DATA = [
  { stage: "Planning", students: 142, color: "#94a3b8" },
  { stage: "Booked", students: 98, color: "#3b82f6" },
  { stage: "Appeared", students: 82, color: "#6366f1" },
  { stage: "Qualified (6.5+)", students: 68, color: "#059669" },
];

const BAND_DISTRIBUTION = [
  { band: "5.0-5.5", count: 8, color: "#ef4444" },
  { band: "6.0", count: 14, color: "#f59e0b" },
  { band: "6.5", count: 22, color: "#3b82f6" },
  { band: "7.0", count: 18, color: "#6366f1" },
  { band: "7.5+", count: 12, color: "#059669" },
];

// ════════════════════════════════════════════════
// ECHARTS OPTIONS
// ════════════════════════════════════════════════

const funnelChartOption = {
  tooltip: {
    trigger: "item",
    formatter: "{b}: {c}",
  },
  series: [
    {
      type: "funnel",
      left: "15%",
      top: 20,
      bottom: 20,
      width: "70%",
      min: 0,
      max: 1248,
      minSize: "8%",
      maxSize: "100%",
      sort: "descending",
      gap: 4,
      label: {
        show: true,
        position: "inside",
        formatter: "{b}\n{c}",
        fontSize: 12,
        fontWeight: 600,
        color: "#fff",
        lineHeight: 18,
      },
      labelLine: { show: false },
      itemStyle: {
        borderColor: "#fff",
        borderWidth: 2,
        borderRadius: 4,
      },
      emphasis: {
        label: { fontSize: 13 },
      },
      data: FUNNEL_DATA.map((d) => ({
        value: d.count,
        name: d.stage,
        itemStyle: { color: d.color },
      })),
    },
  ],
};

const monthlyGrowthOption = {
  tooltip: {
    trigger: "axis",
    backgroundColor: "#fff",
    borderColor: "#e5e7eb",
    borderWidth: 1,
    textStyle: { color: "#1a2540", fontSize: 12 },
    axisPointer: {
      type: "shadow",
      shadowStyle: { color: "rgba(59,130,246,0.04)" },
    },
  },
  legend: {
    bottom: 0,
    itemWidth: 12,
    itemHeight: 12,
    textStyle: { color: "#8a95b0", fontSize: 11 },
    itemGap: 20,
  },
  grid: { left: 45, right: 20, top: 20, bottom: 45 },
  xAxis: {
    type: "category",
    data: MONTHLY_DATA.months,
    axisLine: { lineStyle: { color: "#f0f0f0" } },
    axisTick: { show: false },
    axisLabel: { color: "#8a95b0", fontSize: 11 },
  },
  yAxis: {
    type: "value",
    splitLine: { lineStyle: { color: "#f5f5f5", type: "dashed" } },
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: "#8a95b0", fontSize: 11 },
  },
  series: [
    {
      name: "Leads",
      type: "bar",
      data: MONTHLY_DATA.leads,
      itemStyle: { color: "#3b82f6", borderRadius: [4, 4, 0, 0] },
      barMaxWidth: 28,
    },
    {
      name: "Applications",
      type: "bar",
      data: MONTHLY_DATA.applications,
      itemStyle: { color: "#6366f1", borderRadius: [4, 4, 0, 0] },
      barMaxWidth: 28,
    },
    {
      name: "Enrollments",
      type: "bar",
      data: MONTHLY_DATA.enrollments,
      itemStyle: { color: "#059669", borderRadius: [4, 4, 0, 0] },
      barMaxWidth: 28,
    },
  ],
};

const revenueChartOption = {
  tooltip: {
    trigger: "axis",
    backgroundColor: "#fff",
    borderColor: "#e5e7eb",
    borderWidth: 1,
    textStyle: { color: "#1a2540", fontSize: 12 },
    formatter: (params: { name: string; value: number }[]) =>
      `${params[0].name}: <b>₹${params[0].value}L</b>`,
  },
  grid: { left: 45, right: 20, top: 20, bottom: 30 },
  xAxis: {
    type: "category",
    data: MONTHLY_DATA.months,
    axisLine: { lineStyle: { color: "#f0f0f0" } },
    axisTick: { show: false },
    axisLabel: { color: "#8a95b0", fontSize: 11 },
  },
  yAxis: {
    type: "value",
    splitLine: { lineStyle: { color: "#f5f5f5", type: "dashed" } },
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      color: "#8a95b0",
      fontSize: 11,
      formatter: (v: number) => `₹${v}L`,
    },
  },
  series: [
    {
      type: "line",
      data: MONTHLY_DATA.revenue,
      smooth: true,
      symbol: "circle",
      symbolSize: 8,
      lineStyle: { color: "#7c3aed", width: 3 },
      itemStyle: { color: "#7c3aed", borderColor: "#fff", borderWidth: 2 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(124,58,237,0.2)" },
          { offset: 1, color: "rgba(124,58,237,0.02)" },
        ]),
      },
    },
  ],
};

const bandChartOption = {
  tooltip: {
    trigger: "axis",
    backgroundColor: "#fff",
    borderColor: "#e5e7eb",
    borderWidth: 1,
    textStyle: { color: "#1a2540", fontSize: 12 },
    formatter: (params: { name: string; value: number }[]) =>
      `Band ${params[0].name}: <b>${params[0].value} students</b>`,
  },
  grid: { left: 40, right: 20, top: 25, bottom: 30 },
  xAxis: {
    type: "category",
    data: BAND_DISTRIBUTION.map((d) => d.band),
    axisLine: { lineStyle: { color: "#f0f0f0" } },
    axisTick: { show: false },
    axisLabel: { color: "#8a95b0", fontSize: 11, fontWeight: 600 },
  },
  yAxis: {
    type: "value",
    splitLine: { lineStyle: { color: "#f5f5f5", type: "dashed" } },
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: "#8a95b0", fontSize: 11 },
  },
  series: [
    {
      type: "bar",
      data: BAND_DISTRIBUTION.map((d) => ({
        value: d.count,
        itemStyle: { color: d.color, borderRadius: [6, 6, 0, 0] },
      })),
      barMaxWidth: 45,
      label: {
        show: true,
        position: "top",
        color: "#1a2540",
        fontSize: 12,
        fontWeight: 700,
      },
    },
  ],
};

const ieltsPipelineOption = {
  tooltip: {
    trigger: "axis",
    backgroundColor: "#fff",
    borderColor: "#e5e7eb",
    borderWidth: 1,
    textStyle: { color: "#1a2540", fontSize: 12 },
    formatter: (params: { name: string; value: number }[]) =>
      `${params[0].name}: <b>${params[0].value} students</b>`,
  },
  grid: { left: 110, right: 50, top: 10, bottom: 10 },
  xAxis: { type: "value", show: false, max: 142 },
  yAxis: {
    type: "category",
    data: [...IELTS_DATA].reverse().map((d) => d.stage),
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: "#1a2540", fontSize: 12, fontWeight: 600 },
  },
  series: [
    {
      type: "bar",
      data: [...IELTS_DATA].reverse().map((d) => ({
        value: d.students,
        itemStyle: { color: d.color, borderRadius: [0, 6, 6, 0] },
      })),
      barMaxWidth: 24,
      label: {
        show: true,
        position: "right",
        color: "#1a2540",
        fontSize: 12,
        fontWeight: 700,
      },
    },
  ],
};

const sourceDonutOption = {
  tooltip: {
    trigger: "item",
    backgroundColor: "#fff",
    borderColor: "#e5e7eb",
    borderWidth: 1,
    textStyle: { color: "#1a2540", fontSize: 12 },
    formatter: "{b}: {c} ({d}%)",
  },
  legend: {
    bottom: 0,
    itemWidth: 10,
    itemHeight: 10,
    textStyle: { color: "#8a95b0", fontSize: 11 },
    itemGap: 14,
  },
  series: [
    {
      type: "pie",
      radius: ["45%", "72%"],
      center: ["50%", "42%"],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 6, borderColor: "#fff", borderWidth: 3 },
      label: { show: false },
      emphasis: {
        label: { show: true, fontSize: 13, fontWeight: 700, color: "#1a2540" },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0,0,0,0.1)",
        },
      },
      data: LEAD_SOURCE_DATA.map((d) => ({
        value: d.leads,
        name: d.source,
        itemStyle: { color: d.color },
      })),
    },
  ],
};

// ════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════
const PerformancePage = () => {
  const [period] = useState("This Quarter");
  const maxFunnel = FUNNEL_DATA[0].count;

  // ─── Lead Source Table ───
  const sourceColumns: ColumnsType<LeadSource> = [
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
      render: (text: string, record) => (
        <div className="flex items-center gap-2.5">
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: record.color }}
          />
          <span className="text-sm font-semibold text-[#1a2540]">{text}</span>
        </div>
      ),
    },
    {
      title: "Leads",
      dataIndex: "leads",
      key: "leads",
      align: "center",
      sorter: (a, b) => a.leads - b.leads,
      render: (val: number) => (
        <span className="text-sm font-bold text-[#1a2540]">{val}</span>
      ),
    },
    {
      title: "Applications",
      dataIndex: "applications",
      key: "applications",
      align: "center",
      sorter: (a, b) => a.applications - b.applications,
      render: (val: number) => (
        <span className="text-sm font-medium text-[#1a2540]">{val}</span>
      ),
    },
    {
      title: "Enrolled",
      dataIndex: "enrolled",
      key: "enrolled",
      align: "center",
      sorter: (a, b) => a.enrolled - b.enrolled,
      render: (val: number) => (
        <Tag
          style={{
            color: "#059669",
            backgroundColor: "#ecfdf5",
            border: "1px solid #a7f3d0",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 12,
          }}
        >
          {val}
        </Tag>
      ),
    },
    {
      title: "Conversion",
      dataIndex: "conversionRate",
      key: "conversionRate",
      align: "center",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.conversionRate - b.conversionRate,
      render: (val: number) => (
        <div className="flex items-center justify-center gap-1.5">
          <div className="w-16">
            <Progress
              percent={val}
              size="small"
              showInfo={false}
              strokeColor={
                val > 25 ? "#059669" : val > 15 ? "#3b82f6" : "#f59e0b"
              }
            />
          </div>
          <span className="text-xs font-bold text-[#1a2540] w-10 text-right">
            {val}%
          </span>
        </div>
      ),
    },
  ];

  // ─── Country Table ───
  const countryColumns: ColumnsType<CountryData> = [
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (text: string, record) => (
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{record.flag}</span>
          <span className="text-sm font-semibold text-[#1a2540]">{text}</span>
        </div>
      ),
    },
    {
      title: "Leads",
      dataIndex: "leads",
      key: "leads",
      align: "center",
      sorter: (a, b) => a.leads - b.leads,
      render: (val: number) => (
        <span className="text-sm font-bold text-[#1a2540]">{val}</span>
      ),
    },
    {
      title: "Applications",
      dataIndex: "applications",
      key: "applications",
      align: "center",
      sorter: (a, b) => a.applications - b.applications,
      render: (val: number) => (
        <span className="text-sm font-medium text-[#1a2540]">{val}</span>
      ),
    },
    {
      title: "Enrolled",
      dataIndex: "enrolled",
      key: "enrolled",
      align: "center",
      sorter: (a, b) => a.enrolled - b.enrolled,
      render: (val: number) => (
        <Tag
          style={{
            color: "#059669",
            backgroundColor: "#ecfdf5",
            border: "1px solid #a7f3d0",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 12,
          }}
        >
          {val}
        </Tag>
      ),
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      align: "center",
      render: (val: string) => (
        <span className="text-sm font-bold text-[#7c3aed]">{val}</span>
      ),
    },
  ];

  return (
    <div className="px-6 py-8">
      {/* ═══ Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1a2540] m-0">
            Performance Dashboard
          </h1>
          <p className="text-sm text-[#8a95b0] mt-1 m-0">
            Track leads, conversions, revenue & team performance
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-blue-600 self-start">
          <FiCalendar size={12} />
          {period}
        </span>
      </div>

      {/* ═══ 1️⃣ Overview Cards ═══ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 mb-6">
        {OVERVIEW_STATS.map(
          ({ label, value, change, trend, icon: Icon, color, bg, border }) => (
            <div
              key={label}
              className="bg-white rounded-xl p-4 border transition-all duration-200 hover:shadow-md group"
              style={{ borderColor: border }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                  style={{ backgroundColor: bg, color }}
                >
                  <Icon size={17} />
                </div>
                <span
                  className="inline-flex items-center gap-0.5 text-[11px] font-bold"
                  style={{ color: trend === "up" ? "#059669" : "#ef4444" }}
                >
                  {trend === "up" ? (
                    <FiArrowUpRight size={11} />
                  ) : (
                    <FiArrowDownRight size={11} />
                  )}
                  {change}
                </span>
              </div>
              <p
                className="text-xl font-extrabold m-0 leading-none"
                style={{ color }}
              >
                {value}
              </p>
              <p className="text-[11px] font-medium text-[#8a95b0] m-0 mt-1.5">
                {label}
              </p>
            </div>
          ),
        )}
      </div>

      {/* ═══ 2️⃣ Funnel Chart ═══ */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiFilter size={15} className="text-[#8a95b0]" />
            <h3 className="text-sm font-bold text-[#1a2540] m-0">
              Lead Conversion Funnel
            </h3>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#8a95b0]">
            <span>
              Overall:{" "}
              <span className="font-bold text-[#059669]">
                {(
                  (FUNNEL_DATA[FUNNEL_DATA.length - 1].count / maxFunnel) *
                  100
                ).toFixed(1)}
                %
              </span>
            </span>
            <span>
              Top drop:{" "}
              <span className="font-bold text-red-500">
                Contacted → IELTS ({(((980 - 620) / 980) * 100).toFixed(1)}%)
              </span>
            </span>
          </div>
        </div>
        <EChart
          option={funnelChartOption}
          style={{ height: 380, width: "100%" }}
        />
      </div>

      {/* ═══ 3️⃣ & 4️⃣ Source + Country ═══ */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Lead Source */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <FiTarget size={15} className="text-[#8a95b0]" />
            <h3 className="text-sm font-bold text-[#1a2540] m-0">
              Lead Source Performance
            </h3>
          </div>
          <div className="px-5 pt-4">
            <EChart
              option={sourceDonutOption}
              style={{ height: 220, width: "100%" }}
            />
          </div>
          <Table
            columns={sourceColumns}
            dataSource={LEAD_SOURCE_DATA}
            rowKey="key"
            pagination={false}
            size="small"
            rowClassName={() =>
              "hover:bg-blue-50/30 transition-colors duration-150"
            }
          />
        </div>

        {/* Country */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <FiMapPin size={15} className="text-[#8a95b0]" />
            <h3 className="text-sm font-bold text-[#1a2540] m-0">
              Country Performance
            </h3>
          </div>
          <Table
            columns={countryColumns}
            dataSource={COUNTRY_DATA}
            rowKey="key"
            pagination={false}
            size="small"
            rowClassName={() =>
              "hover:bg-blue-50/30 transition-colors duration-150"
            }
          />
        </div>
      </div>

      {/* ═══ 5️⃣ Monthly Growth ═══ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <FiBarChart2 size={15} className="text-[#8a95b0]" />
            <h3 className="text-sm font-bold text-[#1a2540] m-0">
              Monthly Growth
            </h3>
          </div>
          <div className="p-4">
            <EChart
              option={monthlyGrowthOption}
              style={{ height: 300, width: "100%" }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <FiDollarSign size={15} className="text-[#8a95b0]" />
            <h3 className="text-sm font-bold text-[#1a2540] m-0">
              Revenue Trend
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3 px-5 pt-4">
            <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-100">
              <p className="text-lg font-extrabold text-[#7c3aed] m-0">₹8.5L</p>
              <p className="text-[10px] text-[#8a95b0] m-0 mt-0.5 font-medium">
                This Month
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100">
              <p className="text-lg font-extrabold text-[#059669] m-0 flex items-center justify-center gap-1">
                <FiArrowUpRight size={14} /> 25%
              </p>
              <p className="text-[10px] text-[#8a95b0] m-0 mt-0.5 font-medium">
                vs Last Month
              </p>
            </div>
          </div>
          <div className="px-2 pb-2">
            <EChart
              option={revenueChartOption}
              style={{ height: 220, width: "100%" }}
            />
          </div>
        </div>
      </div>

      {/* ═══ 6️⃣ IELTS Analytics ═══ */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <FiBookOpen size={15} className="text-[#8a95b0]" />
            <h3 className="text-sm font-bold text-[#1a2540] m-0">
              IELTS Pipeline
            </h3>
          </div>
          <div className="p-4">
            <EChart
              option={ieltsPipelineOption}
              style={{ height: 180, width: "100%" }}
            />
          </div>
          <div className="grid grid-cols-3 gap-3 px-5 pb-5">
            {[
              {
                label: "Pass Rate",
                value: "82.9%",
                color: "#059669",
                bg: "#ecfdf5",
                border: "#a7f3d0",
              },
              {
                label: "Avg. Improvement",
                value: "+1.2",
                color: "#3b82f6",
                bg: "#eff6ff",
                border: "#bfdbfe",
              },
              {
                label: "Completion",
                value: "57.7%",
                color: "#6366f1",
                bg: "#f5f3ff",
                border: "#ddd6fe",
              },
            ].map(({ label, value, color, bg, border }) => (
              <div
                key={label}
                className="rounded-lg p-3 text-center border"
                style={{ backgroundColor: bg, borderColor: border }}
              >
                <p className="text-lg font-extrabold m-0" style={{ color }}>
                  {value}
                </p>
                <p className="text-[10px] text-[#8a95b0] m-0 mt-0.5 font-medium">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <FiBarChart2 size={15} className="text-[#8a95b0]" />
            <h3 className="text-sm font-bold text-[#1a2540] m-0">
              Band Score Distribution
            </h3>
          </div>
          <div className="p-4">
            <EChart
              option={bandChartOption}
              style={{ height: 220, width: "100%" }}
            />
          </div>
          <div className="px-5 pb-5">
            <div className="space-y-2.5 pt-3 border-t border-gray-100">
              {[
                { label: "Average Band Score", value: "6.8", color: "#3b82f6" },
                { label: "Highest Score", value: "8.5", color: "#059669" },
                {
                  label: "Qualified (6.5+)",
                  value: "52 / 74 students",
                  color: "#6366f1",
                },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-1.5"
                >
                  <span className="text-xs text-[#8a95b0] font-medium">
                    {label}
                  </span>
                  <span className="text-sm font-bold" style={{ color }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformancePage;
