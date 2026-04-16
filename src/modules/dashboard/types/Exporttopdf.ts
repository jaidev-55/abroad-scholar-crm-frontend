import type { jsPDF as JsPDFType } from "jspdf";

interface ExportOptions {
  target?: HTMLElement | string;
  filename?: string;
  orientation?: "portrait" | "landscape";
  scale?: number;
  withHeader?: boolean;
  title?: string;
  brand?: string;
}

interface JsPDFInternalWithPages {
  getNumberOfPages: () => number;
}

const BRAND = {
  primary: [37, 99, 235] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  faint: [148, 163, 184] as [number, number, number],
  divider: [226, 232, 240] as [number, number, number],
};

const resolveElement = (target: ExportOptions["target"]): HTMLElement => {
  if (target instanceof HTMLElement) return target;
  const sel = target ?? "#dashboard-root";
  const el = document.querySelector<HTMLElement>(sel);
  if (!el) throw new Error(`Export target not found: ${sel}`);
  return el;
};

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export const exportDashboardPDF = async (
  options: ExportOptions = {},
): Promise<void> => {
  const {
    target,
    filename,
    orientation = "portrait",
    scale = 2,
    withHeader = true,
    title = "Dashboard Report",
    brand = "Abroad Scholar CRM",
  } = options;

  const element = resolveElement(target);

  const { default: html2canvas } = await import("html2canvas");
  const { default: jsPDF } = await import("jspdf");

  // ── 1. Prepare the page so html2canvas captures everything ──────────
  // Save current scroll, then scroll to top so coordinates line up.
  const originalScrollX = window.scrollX;
  const originalScrollY = window.scrollY;
  window.scrollTo(0, 0);

  // Wait for fonts + an extra tick so charts (ECharts/Recharts) finish painting
  await document.fonts?.ready;
  await sleep(400);
  await new Promise<void>((r) => requestAnimationFrame(() => r()));

  // ── 2. Capture FULL element (not just viewport) ─────────────────────
  // Key trick: pass width/height matching the element's full scroll size,
  // and x/y = 0 relative to the element. html2canvas will paint everything.
  const fullWidth = element.scrollWidth;
  const fullHeight = element.scrollHeight;

  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: false,
    backgroundColor: "#ffffff",
    logging: false,
    width: fullWidth,
    height: fullHeight,
    windowWidth: fullWidth,
    windowHeight: fullHeight,
    scrollX: 0,
    scrollY: 0,
    onclone: (clonedDoc, clonedEl) => {
      // Disable animations in the clone for a stable snapshot
      const style = clonedDoc.createElement("style");
      style.innerHTML = `
        *, *::before, *::after {
          animation: none !important;
          transition: none !important;
          scroll-behavior: auto !important;
        }
      `;
      clonedDoc.head.appendChild(style);

      // Force the cloned element to its full size so nothing's clipped
      if (clonedEl instanceof HTMLElement) {
        clonedEl.style.height = "auto";
        clonedEl.style.maxHeight = "none";
        clonedEl.style.overflow = "visible";
      }
    },
  });

  // Restore original scroll position
  window.scrollTo(originalScrollX, originalScrollY);

  // ── 3. Build the PDF ─────────────────────────────────────────────────
  const doc: JsPDFType = new jsPDF({
    orientation,
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const marginX = 8;
  const headerH = withHeader ? 14 : 0;
  const footerH = 8;
  const contentTopY = headerH + 4; // 4mm gap below header
  const contentW = pageW - marginX * 2;
  const contentH = pageH - headerH - footerH - 6; // breathing room

  // Image dimensions on the page (scaled to page width)
  const imgW = contentW;
  const imgH = (canvas.height * imgW) / canvas.width;

  const now = new Date();
  const generatedDate = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const generatedTime = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const drawChrome = (pageNum: number, pageCount: number) => {
    if (withHeader) {
      doc.setFillColor(...BRAND.primary);
      doc.rect(0, 0, pageW, headerH, "F");

      doc.setTextColor(...BRAND.white);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(title, marginX, 9);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(219, 234, 254);
      doc.text(brand, marginX + doc.getTextWidth(title) + 4, 9);

      doc.setTextColor(...BRAND.white);
      doc.setFontSize(8.5);
      doc.text(`${generatedDate}  ·  ${generatedTime}`, pageW - marginX, 9, {
        align: "right",
      });
    }

    const footerY = pageH - 4;
    doc.setDrawColor(...BRAND.divider);
    doc.setLineWidth(0.2);
    doc.line(marginX, footerY - 2, pageW - marginX, footerY - 2);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...BRAND.faint);
    doc.text(`Confidential  ·  ${brand}`, marginX, footerY);
    doc.text(`Page ${pageNum} of ${pageCount}`, pageW - marginX, footerY, {
      align: "right",
    });
  };

  // ── 4. Render: single page or sliced multi-page ─────────────────────
  // Tolerance avoids edge-case where imgH is fractionally over contentH
  const fitsOnePage = imgH <= contentH + 0.5;

  if (fitsOnePage) {
    const imgData = canvas.toDataURL("image/jpeg", 0.92);
    doc.addImage(
      imgData,
      "JPEG",
      marginX,
      contentTopY,
      imgW,
      imgH,
      undefined,
      "FAST",
    );
    drawChrome(1, 1);
  } else {
    // How many source-canvas pixels fit into one PDF page's content area
    const pxPerMM = canvas.width / imgW;
    const sliceHpx = Math.floor(contentH * pxPerMM);
    const totalPages = Math.ceil(canvas.height / sliceHpx);

    for (let i = 0; i < totalPages; i++) {
      if (i > 0) doc.addPage();

      const yStart = i * sliceHpx;
      const thisSliceHpx = Math.min(sliceHpx, canvas.height - yStart);

      // Build a slice canvas
      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = thisSliceHpx;

      const ctx = sliceCanvas.getContext("2d");
      if (!ctx) throw new Error("Could not get 2D context for slice");

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
      ctx.drawImage(
        canvas,
        0,
        yStart,
        canvas.width,
        thisSliceHpx,
        0,
        0,
        canvas.width,
        thisSliceHpx,
      );

      const sliceData = sliceCanvas.toDataURL("image/jpeg", 0.92);
      const sliceMM = thisSliceHpx / pxPerMM;

      doc.addImage(
        sliceData,
        "JPEG",
        marginX,
        contentTopY,
        imgW,
        sliceMM,
        undefined,
        "FAST",
      );
    }

    // Apply header/footer to every page now that count is known
    const internal = doc.internal as unknown as JsPDFInternalWithPages;
    const pageCount = internal.getNumberOfPages();
    for (let p = 1; p <= pageCount; p++) {
      doc.setPage(p);
      drawChrome(p, pageCount);
    }
  }

  // ── 5. Save ──────────────────────────────────────────────────────────
  const finalName = filename ?? `dashboard_${now.toISOString().slice(0, 10)}`;
  doc.save(`${finalName}.pdf`);
};
