import axiosInstance from "../../../utils/axiosInstance";
import type { LeadPriority, LeadSource, LeadStatus } from "../types/dashboard";

export type DatePreset = "today" | "7days" | "30days" | "90days" | "custom";

export interface BaseQuery {
  preset?: DatePreset;
  from?: string;
  to?: string;
}

//  Dashboard Stats

export interface StatsQuery extends BaseQuery {
  counselorId?: string;
  source?: LeadSource;
}

export interface StatCard {
  value: number;
  change: number;
}

export interface DashboardStatsResponse {
  period: { preset: string; from: string; to: string };
  stats: {
    totalLeads: StatCard;
    hotLeads: StatCard;
    followUpsDue: StatCard;
    converted: StatCard;
    lostLeads: StatCard;
  };
}

export const getDashboardStats = async (
  query: StatsQuery = {},
): Promise<DashboardStatsResponse> => {
  const { data } = await axiosInstance.get("/dashboard/stats", {
    params: query,
  });
  return data;
};

//  Leads Trend

export interface LeadsTrendQuery extends BaseQuery {
  groupBy?: "day" | "week";
  counselorId?: string;
  source?: LeadSource;
}

export interface TrendDataPoint {
  date: string;
  newLeads: number;
  converted: number;
}

export interface LeadsTrendResponse {
  period: { preset: string; from: string; to: string; groupBy: string };
  data: TrendDataPoint[];
}

export const getLeadsTrend = async (
  query: LeadsTrendQuery = {},
): Promise<LeadsTrendResponse> => {
  const { data } = await axiosInstance.get("/dashboard/leads-trend", {
    params: query,
  });
  return data;
};

// Lead Sources

export interface LeadSourcesQuery extends BaseQuery {
  counselorId?: string;
}

export interface LeadSourceItem {
  source: LeadSource;
  count: number;
  percentage: number;
  color: string;
}

export interface LeadSourcesResponse {
  period: { preset: string; from: string; to: string };
  total: number;
  sources: LeadSourceItem[];
}

export const getLeadSources = async (
  query: LeadSourcesQuery = {},
): Promise<LeadSourcesResponse> => {
  const { data } = await axiosInstance.get("/dashboard/lead-sources", {
    params: query,
  });
  return data;
};

// Pipeline Funnel

export interface PipelineQuery extends BaseQuery {
  counselorId?: string;
  source?: LeadSource;
}

export interface PipelineStage {
  status: LeadStatus;
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export interface PipelineResponse {
  period: { preset: string; from: string; to: string };
  total: number;
  conversionRate: number;
  stages: PipelineStage[];
}

export const getPipeline = async (
  query: PipelineQuery = {},
): Promise<PipelineResponse> => {
  const { data } = await axiosInstance.get("/dashboard/pipeline", {
    params: query,
  });
  return data;
};

// Top Counselors

export interface TopCounselorsQuery extends BaseQuery {
  source?: LeadSource;
  limit?: number;
}

export interface CounselorItem {
  id: string;
  name: string;
  email: string;
  initials: string;
  totalLeads: number;
  converted: number;
  conversionRate: number;
}

export interface TopCounselorsResponse {
  period: { preset: string; from: string; to: string };
  counselors: CounselorItem[];
}

export const getTopCounselors = async (
  query: TopCounselorsQuery = {},
): Promise<TopCounselorsResponse> => {
  const { data } = await axiosInstance.get("/dashboard/top-counselors", {
    params: query,
  });
  return data;
};

// Recent Leads

export interface RecentLeadsQuery extends BaseQuery {
  counselorId?: string;
  source?: LeadSource;
  status?: LeadStatus;
  priority?: LeadPriority;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface RecentLeadItem {
  id: string;
  fullName: string;
  initials: string;
  phone: string;
  email: string | null;
  country: string | null;
  ieltsScore: number | null;
  source: LeadSource;
  priority: LeadPriority;
  status: LeadStatus;
  followUpDate: string | null;
  createdAt: string;
  counselor: { id: string; name: string } | null;
}

export interface RecentLeadsMeta {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface RecentLeadsResponse {
  period: { preset: string; from: string; to: string };
  meta: RecentLeadsMeta;
  data: RecentLeadItem[];
}

export const getRecentLeads = async (
  query: RecentLeadsQuery = {},
): Promise<RecentLeadsResponse> => {
  const { data } = await axiosInstance.get("/dashboard/recent-leads", {
    params: query,
  });
  return data;
};



