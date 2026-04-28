import type { LeadCategory } from "../api/leads";
export interface SheetUrlForm {
  sheetUrl: string;
}

export interface ImportedRow {
  rowIndex: number;
  raw: Record<string, string>;
  mapped: {
    fullName?: string;
    phone?: string;
    email?: string;
    country?: string;
    source?: string;
    priority?: string;
    counselorName?: string;
    followUpDate?: string;
    ieltsScore?: string;
    notes?: string;
    leadCategory?: LeadCategory;
  };
  errors: string[];
  valid: boolean;
  skipReason?: string;
}

export interface ImportResult {
  success: number;
  failed: number;
}
