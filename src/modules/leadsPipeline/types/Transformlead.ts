import type { ApiLead, Lead, LeadStage, LeadStatus } from "../types/lead";

// ─── Status → Stage map ───────────────────────────────────────────────────────
const STATUS_TO_STAGE: Record<LeadStatus, LeadStage> = {
  NEW: "new",
  IN_PROGRESS: "progress",
  CONVERTED: "converted",
  LOST: "lost",
};

// ─── Stage → Status map ───────────────────────────────────────────────────────
export const STAGE_TO_STATUS: Record<string, LeadStatus> = {
  new: "NEW",
  progress: "IN_PROGRESS",
  applied: "IN_PROGRESS",
  converted: "CONVERTED",
  lost: "LOST",
};

// ─── Transform a single API lead → local Lead ─────────────────────────────────
export function apiLeadToLocal(a: ApiLead): Lead {
  return {
    id: a.id,
    name: a.fullName,
    phone: a.phone,
    email: a.email ?? "",
    country: a.country,
    source: a.source,
    status: a.status,
    stage: STATUS_TO_STAGE[a.status] ?? "new",
    priority: (a.priority.charAt(0) +
      a.priority.slice(1).toLowerCase()) as Lead["priority"],
    counselor: a.counselor?.name ?? "",
    followUp: a.followUpDate?.split("T")[0] ?? "",
    ieltsScore: a.ieltsScore != null ? String(a.ieltsScore) : undefined,
    category: a.category ?? null,
    notes: (a.notes ?? []).map((n) => ({
      id: n.id,
      text: n.content,
      createdAt: n.createdAt,
      author: a.counselor?.name ?? "Admin",
    })),
    createdAt: a.createdAt.split("T")[0],
    updatedAt: a.updatedAt,
  };
}
