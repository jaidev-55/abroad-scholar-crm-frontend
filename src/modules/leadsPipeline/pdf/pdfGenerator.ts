import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportableLead {
  name: string;
  phone: string;
  email: string;
  country: string;
  source: string;
  status: string;
  priority: string;
  counselor: string;
  followUp?: string | null;
  ieltsScore?: string | null;
  createdAt: string;
  notes: { text: string }[];
}

interface ExportField {
  key: string;
  label: string;
}

export interface PdfOptions {
  title?: string;
  subtitle?: string;
  orientation?: "portrait" | "landscape";
  brandColor?: [number, number, number]; // RGB
}

/**
 * Generates a polished, branded PDF of lead data and triggers download.
 */
export const generateLeadsPDF = (
  leads: ExportableLead[],
  fields: ExportField[],
  filename: string,
  options: PdfOptions = {},
) => {
  const {
    title = "Leads Export Report",
    subtitle = "Abroad Scholar CRM",
    orientation = "landscape",
    brandColor = [37, 99, 235], // blue-600
  } = options;

  const doc = new jsPDF({ orientation, unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // ── Header band ─────────────────────────────────────────────
  doc.setFillColor(...brandColor);
  doc.rect(0, 0, pageWidth, 60, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(title, 40, 32);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(subtitle, 40, 48);

  // Right-side metadata
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  doc.text(`Generated: ${dateStr}`, pageWidth - 40, 32, { align: "right" });
  doc.text(`Total Records: ${leads.length}`, pageWidth - 40, 48, {
    align: "right",
  });

  // ── Table ───────────────────────────────────────────────────
  const headers = fields.map((f) => f.label);
  const rows = leads.map((lead) =>
    fields.map((f) => {
      if (f.key === "notesText") {
        return lead.notes?.[lead.notes.length - 1]?.text ?? "—";
      }
      const val = (lead as unknown as Record<string, unknown>)[f.key];
      return val == null || val === "" ? "—" : String(val);
    }),
  );

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 80,
    margin: { left: 40, right: 40 },
    styles: {
      fontSize: 8,
      cellPadding: 6,
      overflow: "linebreak",
      textColor: [51, 65, 85], // slate-700
    },
    headStyles: {
      fillColor: brandColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // slate-50
    },
    didDrawPage: (data) => {
      // Footer
      const pageNum = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text(
        `Page ${data.pageNumber} of ${pageNum}`,
        pageWidth / 2,
        pageHeight - 20,
        { align: "center" },
      );
      doc.text("Confidential — Abroad Scholar CRM", 40, pageHeight - 20);
    },
  });

  doc.save(`${filename}.pdf`);
};
