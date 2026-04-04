import type { Lead } from "../../../types/lead";
import { STAGES } from "../constants";

export const getStagelabel = (id: string) =>
  STAGES.find((s) => s.id === id)?.label ?? id;

export const exportToCSV = (leads: Lead[], filename = "leads_export") => {
  const headers = [
    "Name",
    "Phone",
    "Email",
    "Stage",
    "Source",
    "Counselor",
    "Country",
    "Priority",
    "Follow-up Date",
    "Created At",
    "IELTS Score",
    "Notes Count",
  ];
  const rows = leads.map((l) => [
    l.name,
    l.phone,
    l.email ?? "",
    getStagelabel(l.stage),
    l.source,
    l.counselor,
    l.country,
    l.priority,
    l.followUp,
    l.createdAt,
    l.ieltsScore ?? "",
    l.notes.length,
  ]);
  const escape = (v: unknown) => {
    const s = String(v ?? "");
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const exportToPDF = (leads: Lead[], _filename = "leads_export") => {
  const pc = (p: string) =>
    p === "Hot" ? "#ef4444" : p === "Warm" ? "#f59e0b" : "#3b82f6";
  const rows = leads
    .map(
      (l, i) =>
        `<tr style="background:${i % 2 === 0 ? "#fff" : "#f8fafc"}"><td>${i + 1}</td><td><strong>${l.name}</strong></td><td>${l.phone}</td><td>${l.email ?? "—"}</td><td><span style="background:#eff6ff;color:#2563eb;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:600">${getStagelabel(l.stage)}</span></td><td>${l.source}</td><td>${l.counselor}</td><td>${l.country}</td><td><span style="color:${pc(l.priority)};font-weight:700">${l.priority}</span></td><td>${l.followUp}</td><td>${l.ieltsScore ?? "—"}</td><td style="text-align:center">${l.notes.length}</td></tr>`,
    )
    .join("");
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;font-size:12px;color:#1e293b}.hdr{background:linear-gradient(135deg,#1e40af,#3b82f6);color:white;padding:28px 32px 24px}.hdr h1{font-size:22px;font-weight:800}.hdr p{opacity:0.8;font-size:13px;margin-top:4px}.meta{display:flex;gap:16px;margin-top:16px;flex-wrap:wrap}.mi{background:rgba(255,255,255,.15);border-radius:8px;padding:8px 14px}.mi .v{font-size:20px;font-weight:800}.mi .l{font-size:10px;opacity:.75;text-transform:uppercase;letter-spacing:.5px}.c{padding:24px 32px}table{width:100%;border-collapse:collapse}th{background:#1e293b;color:white;padding:10px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}td{padding:9px 10px;border-bottom:1px solid #e2e8f0;font-size:11px}.ft{margin-top:24px;padding-top:16px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;color:#94a3b8;font-size:10px}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body><div class="hdr"><h1>Lead Pipeline Report</h1><p>Abroad Scholar CRM · Exported ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p><div class="meta"><div class="mi"><div class="v">${leads.length}</div><div class="l">Total Leads</div></div><div class="mi"><div class="v">${leads.filter((l) => l.priority === "Hot").length}</div><div class="l">Hot Leads</div></div><div class="mi"><div class="v">${leads.filter((l) => l.stage === "converted").length}</div><div class="l">Converted</div></div><div class="mi"><div class="v">${[...new Set(leads.map((l) => l.counselor))].length}</div><div class="l">Counselors</div></div></div></div><div class="c"><table><thead><tr><th>#</th><th>Name</th><th>Phone</th><th>Email</th><th>Stage</th><th>Source</th><th>Counselor</th><th>Country</th><th>Priority</th><th>Follow-up</th><th>IELTS</th><th>Notes</th></tr></thead><tbody>${rows}</tbody></table><div class="ft"><span>Abroad Scholar CRM · Confidential</span><span>Generated on ${new Date().toISOString()}</span></div></div></body></html>`;
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 500);
};
