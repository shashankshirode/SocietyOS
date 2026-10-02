export type AutomationRuleStatus =
  | 'DRAFT'
  | 'VALIDATING'
  | 'READY'
  | 'ACTIVE'
  | 'PAUSED'
  | 'DISABLED'
  | 'INVALID'
  | 'ARCHIVED';

export type AutomationTriggerType =
  | 'DOMAIN_EVENT'
  | 'SCHEDULE'
  | 'THRESHOLD'
  | 'STATE_DURATION'
  | 'MANUAL_TEST';

export type AutomationConditionOperator =
  | 'EQUALS'
  | 'NOT_EQUALS'
  | 'GREATER_THAN'
  | 'GREATER_THAN_OR_EQUALS'
  | 'LESS_THAN'
  | 'LESS_THAN_OR_EQUALS'
  | 'IN'
  | 'NOT_IN'
  | 'EXISTS'
  | 'NOT_EXISTS'
  | 'CONTAINS'
  | 'NOT_CONTAINS';

export type AutomationActionType =
  | 'SEND_NOTIFICATION'
  | 'CREATE_NOTICE_DRAFT'
  | 'CREATE_HELPDESK_ESCALATION'
  | 'CREATE_WORK_ORDER_REQUEST'
  | 'CREATE_APPROVAL_REQUEST'
  | 'REQUEST_HARDWARE_COMMAND'
  | 'REQUEST_AI_ANALYSIS'
  | 'AI_DRAFT'
  | 'HUMAN_APPROVAL_REQUEST';

export type AutomationActionRisk =
  | 'LOW'
  | 'MODERATE'
  | 'HIGH'
  | 'PROHIBITED_AUTO';

export type AutomationTrigger = {
  type: AutomationTriggerType;
  eventName?: string;
  scheduleCron?: string;
  scheduleTimezone?: string;
  thresholdMetric?: string;
  thresholdOperator?: AutomationConditionOperator;
  thresholdValue?: number;
  stateDurationMetric?: string;
  stateDurationSeconds?: number;
  manualTestPayload?: Record<string, unknown>;
};

export type AutomationCondition = {
  id: string;
  field: string;
  operator: AutomationConditionOperator;
  value: unknown;
  description?: string;
};

export type AutomationAction = {
  id: string;
  type: AutomationActionType;
  risk: AutomationActionRisk;
  config: Record<string, unknown>;
  dependsOnActionId?: string;
  requiresApproval?: boolean;
  approvalPolicyId?: string;
};

export type AutomationApprovalPolicy = {
  id: string;
  name: string;
  approverRoles: string[];
  requiredApprovals: number;
  timeoutMinutes: number;
  escalationRoles?: string[];
  autoRejectOnTimeout: boolean;
};

export type AutomationCooldown = {
  enabled: boolean;
  windowMinutes: number;
  dedupeKey?: string;
};

export type AutomationSuppression = {
  enabled: boolean;
  reason: string;
  until?: string;
};

export type AutomationRule = {
  id: string;
  societyId: string;
  name: string;
  description?: string;
  version: number;
  status: AutomationRuleStatus;
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  approvalPolicyId?: string;
  cooldown: AutomationCooldown;
  suppression: AutomationSuppression;
  effectiveFrom?: string;
  effectiveTo?: string;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt: string;
  activatedBy?: string;
  activatedAt?: string;
  parentRuleId?: string;
  isLatestVersion: boolean;
};

export type AutomationRuleVersion = {
  id: string;
  ruleId: string;
  version: number;
  snapshot: AutomationRule;
  createdBy: string;
  createdAt: string;
  changeSummary?: string;
};

export type CreateAutomationRuleCommand = {
  name: string;
  description?: string;
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  approvalPolicyId?: string;
  cooldown: AutomationCooldown;
  suppression: AutomationSuppression;
  effectiveFrom?: string;
  effectiveTo?: string;
};

export type UpdateAutomationRuleCommand = {
  name?: string;
  description?: string;
  trigger?: AutomationTrigger;
  conditions?: AutomationCondition[];
  actions?: AutomationAction[];
  approvalPolicyId?: string;
  cooldown?: AutomationCooldown;
  suppression?: AutomationSuppression;
  effectiveFrom?: string;
  effectiveTo?: string;
};

export type ActivateAutomationRuleCommand = {
  ruleId: string;
  version: number;
  approvalId?: string;
};

export type PauseAutomationRuleCommand = {
  ruleId: string;
  reason: string;
};

export type DisableAutomationRuleCommand = {
  ruleId: string;
  reason: string;
};