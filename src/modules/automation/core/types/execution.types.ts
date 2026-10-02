import type { AutomationActionType, AutomationActionRisk, AutomationTriggerType } from './rule.types';

export type AutomationExecutionStatus =
  | 'TRIGGERED'
  | 'EVALUATING'
  | 'SUPPRESSED'
  | 'ACTIONABLE'
  | 'WAITING_APPROVAL'
  | 'EXECUTING'
  | 'COMPLETED'
  | 'PARTIAL'
  | 'FAILED'
  | 'CANCELLED'
  | 'DEAD_LETTERED';

export type AutomationActionStatus =
  | 'PENDING'
  | 'EXECUTING'
  | 'COMPLETED'
  | 'FAILED'
  | 'SKIPPED'
  | 'RETRYING';

export type AutomationApprovalStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXPIRED';

export type AutomationSuppressionReason =
  | 'COOLDOWN_ACTIVE'
  | 'DEDUPE_WINDOW'
  | 'RULE_PAUSED'
  | 'RULE_DISABLED'
  | 'FEATURE_DISABLED'
  | 'APPROVAL_REQUIRED'
  | 'LOOP_DETECTED'
  | 'RATE_LIMITED'
  | 'MANUAL_SUPPRESSION';

export type AutomationConditionEvaluation = {
  conditionId: string;
  field: string;
  operator: string;
  expectedValue: unknown;
  actualValue: unknown;
  passed: boolean;
  evaluatedAt: string;
};

export type AutomationActionAttempt = {
  actionId: string;
  actionType: AutomationActionType;
  risk: AutomationActionRisk;
  status: AutomationActionStatus;
  config: Record<string, unknown>;
  idempotencyKey: string;
  domainService: string;
  domainMethod: string;
  domainParams: Record<string, unknown>;
  result?: Record<string, unknown>;
  error?: { code: string; message: string };
  startedAt?: string;
  completedAt?: string;
  retryCount: number;
  dependsOnActionId?: string;
  requiresApproval?: boolean;
  approvalStatus?: AutomationApprovalStatus;
  approvalId?: string;
};

export type AutomationApproval = {
  id: string;
  executionId: string;
  actionId: string;
  approverRoles: string[];
  requiredApprovals: number;
  currentApprovals: number;
  status: AutomationApprovalStatus;
  requestedAt: string;
  decidedAt?: string;
  decidedBy?: string;
  rejectionReason?: string;
  expiresAt: string;
};

export type AutomationSuppression = {
  id: string;
  executionId: string;
  reason: AutomationSuppressionReason;
  detail: string;
  suppressedAt: string;
  expiresAt?: string;
};

export type AutomationExecution = {
  id: string;
  societyId: string;
  ruleId: string;
  ruleVersion: number;
  triggerType: AutomationTriggerType;
  triggerEventId: string;
  triggerEventPayload: Record<string, unknown>;
  triggeredAt: string;
  status: AutomationExecutionStatus;
  conditionEvaluations: AutomationConditionEvaluation[];
  actionAttempts: AutomationActionAttempt[];
  approvals: AutomationApproval[];
  suppressions: AutomationSuppression[];
  correlationId: string;
  causalChain: string[];
  causalDepth: number;
  startedAt: string;
  completedAt?: string;
  error?: { code: string; message: string };
  retryCount: number;
  parentExecutionId?: string;
  dryRun: boolean;
};

export type AutomationDeadLetter = {
  id: string;
  executionId: string;
  actionId: string;
  reason: string;
  error: { code: string; message: string };
  failedAt: string;
  retryCount: number;
  status: 'PENDING' | 'RETRIED' | 'REPLAYED' | 'DISCARDED' | 'RESOLVED';
  retriedAt?: string;
  retriedBy?: string;
  resolution?: string;
};

export type AutomationDryRunResult = {
  executionId: string;
  ruleId: string;
  ruleVersion: number;
  wouldExecute: boolean;
  conditionEvaluations: AutomationConditionEvaluation[];
  wouldRunActions: Array<{
    actionId: string;
    actionType: AutomationActionType;
    config: Record<string, unknown>;
    suppressionReason?: string;
  }>;
  suppressionReasons: string[];
  evaluatedAt: string;
};

export type CreateAutomationExecutionCommand = {
  ruleId: string;
  ruleVersion: number;
  triggerType: AutomationTriggerType;
  triggerEventId: string;
  triggerEventPayload: Record<string, unknown>;
  correlationId: string;
  causalChain: string[];
  causalDepth: number;
  dryRun?: boolean;
};

export type ApproveAutomationExecutionCommand = {
  executionId: string;
  actionId: string;
  approverId: string;
  approverRole: string;
};

export type RejectAutomationExecutionCommand = {
  executionId: string;
  actionId: string;
  approverId: string;
  approverRole: string;
  reason: string;
};

export type RetryAutomationExecutionCommand = {
  executionId: string;
  actionIds?: string[];
  retryAllFailed?: boolean;
};

export type ReplayAutomationExecutionCommand = {
  executionId: string;
  newTriggerEventId?: string;
  newTriggerEventPayload?: Record<string, unknown>;
};