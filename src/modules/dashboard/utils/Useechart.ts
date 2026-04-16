import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import type { EChartsCoreOption } from "echarts";

export const useEChart = (option: EChartsCoreOption) => {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  // Init chart once on mount
  useEffect(() => {
    if (!ref.current) return;

    chartRef.current = echarts.init(ref.current);

    const handleResize = () => chartRef.current?.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, []);

  // Update option whenever data changes — this is the critical fix
  useEffect(() => {
    if (!chartRef.current || !option) return;
    chartRef.current.setOption(option, true); // true = notMerge, full refresh
  }, [option]);

  return ref;
};
