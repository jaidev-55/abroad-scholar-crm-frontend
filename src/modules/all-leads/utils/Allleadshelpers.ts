
import type { Lead } from "../../../types/lead";
import type { ApiLead } from "../../leadsPipeline/api/leads";

export const formatSourceLabel = (src: string): string =>
  src.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const getInitials = (name: string): string =>
  (name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const getHue = (name: string): number =>
  name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

export const apiLeadToLocal = (a: ApiLead): Lead => ({
  id: a.id,
  name: a.fullName,
  phone: a.phone,
  email: a.email ?? "",
  country: a.country,
  source: a.source,
  status: a.status,
  stage: ({
    NEW: "new",
    IN_PROGRESS: "progress",
    CONVERTED: "converted",
    LOST: "lost",
  }[a.status] ?? "new") as Lead["stage"],
  priority: (a.priority.charAt(0) +
    a.priority.slice(1).toLowerCase()) as Lead["priority"],
  counselor: a.counselor?.name ?? "",
  followUp: a.followUpDate?.split("T")[0] ?? "",
  ieltsScore: a.ieltsScore != null ? String(a.ieltsScore) : undefined,
  notes: (a.notes ?? []).map((n) => ({
    id: n.id,
    text: n.content,
    createdAt: n.createdAt,
    author: a.counselor?.name ?? "Admin",
  })),
  createdAt: a.createdAt.split("T")[0],
  updatedAt: a.updatedAt,
});
