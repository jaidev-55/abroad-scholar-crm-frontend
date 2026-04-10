import type { ApiActivity } from "../api/leads";
import type { ActivityEvent } from "../types/Activity";
import type { ActivityMeta, ActivityType } from "../types/Viewlead";

// ─── Map API type string → local ActivityType ─────────────────────────────────
export function mapApiType(type: string): ActivityType {
  const map: Record<string, ActivityType> = {
    EDIT: "edit",
    NOTE: "note_added",
    NOTE_ADDED: "note_added",
    STAGE_CHANGE: "stage_change",
    CALL: "call",
    EMAIL: "email",
    FOLLOWUP: "followup_set",
    FOLLOWUP_SET: "followup_set",
    CREATED: "created",
    OVERDUE: "overdue",
  };
  return map[type] ?? "edit";
}

// ─── Transform raw API activity → local ActivityEvent ─────────────────────────
export function mapApiActivity(a: ApiActivity): ActivityEvent {
  const raw = a.meta ?? {};
  const meta: ActivityMeta = {
    duration: raw.duration ? Number(raw.duration) : undefined,
    rating: raw.rating ? Number(raw.rating) : undefined,
    outcome: raw.outcome,
    notes: raw.notes,
    followUpDate: raw.followUpDate,
    field: raw.field,
    oldValue: raw.oldValue,
    newValue: raw.newValue,
    from: raw.from,
    to: raw.to,
    date: raw.date,
    subject: raw.subject,
  };
  return {
    id: a.id,
    type: mapApiType(a.type),
    title: a.message || "Activity",
    author: a.user?.name || "System",
    timestamp: a.createdAt,
    meta,
  };
}

// ─── Group events by calendar date ────────────────────────────────────────────
export function groupByDate(
  events: ActivityEvent[],
): { dateLabel: string; events: ActivityEvent[] }[] {
  const groups: Record<string, ActivityEvent[]> = {};
  for (const e of events) {
    const key = new Date(e.timestamp).toDateString();
    if (!groups[key]) groups[key] = [];
    groups[key].push(e);
  }
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  return Object.entries(groups).map(([key, evts]) => ({
    dateLabel:
      key === today
        ? "Today"
        : key === yesterday
          ? "Yesterday"
          : new Date(key).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
    events: evts,
  }));
}

// ─── Format call duration: 90 → "1m 30s" ─────────────────────────────────────
export function formatDuration(seconds: number): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

// ─── Format outcome string: "not_interested" → "Not Interested" ──────────────
export function formatOutcome(outcome: string): string {
  return outcome
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Short datetime for follow-up labels ──────────────────────────────────────
export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}
