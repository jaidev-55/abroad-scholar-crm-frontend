// ─── Alert rule definition ───
export interface AlertRule {
  id: string;
  name: string;
  description: string;
  type: "budget" | "performance" | "sync" | "quality" | "response";
  condition: AlertCondition;
  action: AlertAction;
  isActive: boolean;
  createdAt: string;
  lastTriggered: string | null;
  triggerCount: number;
}

export interface AlertCondition {
  metric: string;
  operator: "gt" | "lt" | "eq" | "gte" | "lte";
  value: number;
  unit: string;
  timeWindow?: string; // e.g. "24h", "7d"
}

export interface AlertAction {
  type: "notification" | "email" | "pause_campaign" | "assign_counselor";
  target?: string; // email or user id
}

// ─── Alert log entry (triggered alerts) ───
export interface AlertLog {
  id: string;
  ruleId: string;
  ruleName: string;
  type: "budget" | "performance" | "sync" | "quality" | "response";
  message: string;
  severity: "critical" | "warning" | "info";
  triggeredAt: string;
  isRead: boolean;
  campaignName?: string;
  currentValue: string;
  thresholdValue: string;
}

// ─── Alert stats ───
export interface AlertStats {
  totalRules: number;
  activeRules: number;
  triggeredToday: number;
  criticalAlerts: number;
  warningAlerts: number;
  infoAlerts: number;
}

// ─── Preset rule templates ───
export interface RuleTemplate {
  id: string;
  name: string;
  description: string;
  type: "budget" | "performance" | "sync" | "quality" | "response";
  icon: string;
  defaultCondition: AlertCondition;
  defaultAction: AlertAction;
}

// ─── API response ───
export interface AlertsResponse {
  stats: AlertStats;
  rules: AlertRule[];
  logs: AlertLog[];
  templates: RuleTemplate[];
}
