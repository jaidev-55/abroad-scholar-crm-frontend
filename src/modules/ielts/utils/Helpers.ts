import type { IeltsScore, IeltsTargetScore, IeltsRecord } from "../Types";

export const roundToHalf = (n: number): number => Math.round(n * 2) / 2;

export const calcOverall = (
  l: number | null,
  r: number | null,
  w: number | null,
  s: number | null,
): number | null => {
  if (l === null || r === null || w === null || s === null) return null;
  return roundToHalf((l + r + w + s) / 4);
};

export const meetsTarget = (
  current: IeltsScore | null,
  target: IeltsTargetScore,
): boolean => {
  if (!current || current.overall === null) return false;
  return (
    (current.listening ?? 0) >= target.listening &&
    (current.reading ?? 0) >= target.reading &&
    (current.writing ?? 0) >= target.writing &&
    (current.speaking ?? 0) >= target.speaking &&
    (current.overall ?? 0) >= target.overall
  );
};

export const getScoreGap = (
  current: number | null,
  target: number,
): { gap: number; met: boolean } => {
  if (current === null) return { gap: target, met: false };
  const gap = roundToHalf(target - current);
  return { gap: Math.max(0, gap), met: current >= target };
};

export const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const daysUntilExam = (examDate: string | null): number | null => {
  if (!examDate) return null;
  const diff = Math.ceil(
    (new Date(examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  return diff;
};

export const calculateStats = (records: IeltsRecord[]) => {
  const completed = records.filter((r) => r.status === "Completed");
  const avgScore =
    completed.length > 0
      ? roundToHalf(
          completed.reduce(
            (sum, r) => sum + (r.currentScore?.overall ?? 0),
            0,
          ) / completed.length,
        )
      : 0;

  return {
    totalStudents: records.length,
    preparing: records.filter((r) => r.status === "Preparing").length,
    scheduled: records.filter((r) => r.status === "Scheduled").length,
    completed: completed.length,
    avgOverallScore: avgScore,
    targetMet: completed.filter((r) =>
      meetsTarget(r.currentScore, r.targetScore),
    ).length,
    upcomingExams: records.filter((r) => {
      const d = daysUntilExam(r.examDate);
      return d !== null && d >= 0 && d <= 30;
    }).length,
    notStarted: records.filter((r) => r.status === "Not Started").length,
  };
};
