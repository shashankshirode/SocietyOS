export type AutomationTriggerType =
  | 'DOMAIN_EVENT'
  | 'SCHEDULE'
  | 'THRESHOLD'
  | 'STATE_DURATION'
  | 'MANUAL_TEST'
  | 'TIME_BEFORE'
  | 'TIME_AFTER';

export type DomainEventTrigger = {
  type: 'DOMAIN_EVENT';
  eventName: string;
  eventSchemaVersion: string;
  filterConditions?: Array<{
    field: string;
    operator: string;
    value: unknown;
  }>;
};

export type ScheduleTrigger = {
  type: 'SCHEDULE';
  cronExpression: string;
  timezone: string;
  startDate?: string;
  endDate?: string;
  jitterMinutes?: number;
};

export type ThresholdTrigger = {
  type: 'THRESHOLD';
  metricName: string;
  metricSource: string;
  operator: 'GREATER_THAN' | 'GREATER_THAN_OR_EQUALS' | 'LESS_THAN' | 'LESS_THAN_OR_EQUALS' | 'EQUALS';
  thresholdValue: number;
  evaluationWindowMinutes: number;
  aggregation?: 'AVG' | 'SUM' | 'MIN' | 'MAX' | 'LAST';
  filterTags?: Record<string, string>;
};

export type StateDurationTrigger = {
  type: 'STATE_DURATION';
  entityType: string;
  entityIdField: string;
  stateField: string;
  targetState: string;
  durationSeconds: number;
  checkIntervalSeconds: number;
};

export type TimeBeforeTrigger = {
  type: 'TIME_BEFORE';
  referenceEventName: string;
  referenceTimeField: string;
  leadTimeMinutes: number;
  filterConditions?: Array<{
    field: string;
    operator: string;
    value: unknown;
  }>;
};

export type TimeAfterTrigger = {
  type: 'TIME_AFTER';
  referenceEventName: string;
  referenceTimeField: string;
  lagTimeMinutes: number;
  filterConditions?: Array<{
    field: string;
    operator: string;
    value: unknown;
  }>;
};

export type ManualTestTrigger = {
  type: 'MANUAL_TEST';
  testPayload: Record<string, unknown>;
};

export type AutomationTrigger =
  | DomainEventTrigger
  | ScheduleTrigger
  | ThresholdTrigger
  | StateDurationTrigger
  | TimeBeforeTrigger
  | TimeAfterTrigger
  | ManualTestTrigger;

export type TriggerSubscription = {
  id: string;
  ruleId: string;
  ruleVersion: number;
  triggerType: AutomationTriggerType;
  eventName?: string;
  scheduleCron?: string;
  metricName?: string;
  entityType?: string;
  createdAt: string;
  active: boolean;
};

export type TriggerEvaluationResult = {
  matched: boolean;
  triggerEventId: string;
  triggerEventPayload: Record<string, unknown>;
  matchedRuleIds: string[];
  evaluatedAt: string;
};

export type ScheduledTriggerJob = {
  id: string;
  triggerType: 'SCHEDULE';
  cronExpression: string;
  timezone: string;
  nextRunAt: string;
  lastRunAt?: string;
  active: boolean;
  ruleIds: string[];
};

export type ThresholdTriggerEvaluation = {
  id: string;
  triggerId: string;
  metricName: string;
  currentValue: number;
  thresholdValue: number;
  operator: string;
  exceeded: boolean;
  evaluatedAt: string;
  triggeringEntities: Array<{
    entityId: string;
    entityType: string;
    value: number;
    tags: Record<string, string>;
  }>;
};