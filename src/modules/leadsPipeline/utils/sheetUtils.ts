export const extractSheetId = (url: string): string | null =>
  url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)?.[1] ?? null;

export const extractGid = (url: string): string | null =>
  url.match(/[?&]gid=(\d+)/)?.[1] ?? url.match(/#gid=(\d+)/)?.[1] ?? null;

export const buildExportUrl = (sheetId: string, gid: string | null): string => {
  const base = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
  return gid ? `${base}&gid=${gid}` : base;
};

export const fetchGoogleSheetCSV = async (
  sheetId: string,
  gid: string | null,
): Promise<string> => {
  const res = await fetch(buildExportUrl(sheetId, gid));
  if (!res.ok) {
    if (res.status === 403)
      throw new Error(
        "Access denied — share the sheet publicly with View access.",
      );
    throw new Error(`Could not fetch sheet (HTTP ${res.status}).`);
  }
  const text = await res.text();
  if (text.trim().startsWith("<!") || text.trim().startsWith("<html"))
    throw new Error(
      "Sheet returned an error page. Make sure it is shared publicly.",
    );
  return text;
};
