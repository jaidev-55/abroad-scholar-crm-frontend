import type { ApiCallLog } from "../../api/leads";
import type { CallLogEntry, CallRating } from "./types";
import { API_TO_OUTCOME } from "./constants";

export function mapApiCallLog(a: ApiCallLog, fallback: string): CallLogEntry {
  const api = a.meta?.outcome;
  return {
    id: a.id,
    date: a.createdAt,
    duration: a.meta?.duration ?? 0,
    outcome: (api ? API_TO_OUTCOME[api] : undefined) ?? "no_answer",
    notes: a.meta?.notes ?? "",
    rating: (a.meta?.rating as CallRating) ?? null,
    author: a.user?.name ?? fallback,
    muted: false,
    speakerOn: false,
    followUpDate: a.meta?.followUpDate
      ? a.meta.followUpDate.split("T")[0]
      : null,
  };
}

export function formatDuration(s: number): string {
  if (!s) return "—";
  const m = Math.floor(s / 60),
    sec = s % 60;
  return m ? `${m}m ${String(sec).padStart(2, "0")}s` : `${sec}s`;
}

export function formatTimer(s: number): string {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export function timeAgo(iso: string): string {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (!d) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
