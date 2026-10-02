import { AutomationTrigger, AutomationTriggerType, TriggerSubscription, TriggerEvaluationResult } from '../types';
import { ruleService } from './ruleService';

interface TriggerEvaluator {
  evaluate(
    trigger: AutomationTrigger,
    eventPayload: Record<string, unknown>,
    eventId: string
  ): Promise<TriggerEvaluationResult>;
}

const evaluators: Map<AutomationTriggerType, TriggerEvaluator> = new Map();

function registerEvaluator(type: AutomationTriggerType, evaluator: TriggerEvaluator): void {
  evaluators.set(type, evaluator);
}

function getEvaluator(type: AutomationTriggerType): TriggerEvaluator | undefined {
  return evaluators.get(type);
}

const activeScheduledJobs: Map<string, NodeJS.Timeout> = new Map();

registerEvaluator('DOMAIN_EVENT', {
  async evaluate(trigger, eventPayload, eventId) {
    const ruleIds = ruleService.getSubscribedRuleIds('DOMAIN_EVENT', trigger.eventName || '');
    return {
      matched: ruleIds.length > 0,
      triggerEventId: eventId,
      triggerEventPayload: eventPayload,
      matchedRuleIds: ruleIds,
      evaluatedAt: new Date().toISOString(),
    };
  },
});

registerEvaluator('SCHEDULE', {
  async evaluate(trigger, eventPayload, eventId) {
    const cronKey = trigger.scheduleCron || '';
    const ruleIds = ruleService.getSubscribedRuleIds('SCHEDULE', cronKey);
    return {
      matched: ruleIds.length > 0,
      triggerEventId: eventId,
      triggerEventPayload: { ...eventPayload, cron: cronKey, scheduledAt: new Date().toISOString() },
      matchedRuleIds: ruleIds,
      evaluatedAt: new Date().toISOString(),
    };
  },
});

registerEvaluator('THRESHOLD', {
  async evaluate(trigger, eventPayload, eventId) {
    const metricKey = `threshold:${trigger.metricName}`;
    const ruleIds = ruleService.getSubscribedRuleIds('THRESHOLD', metricKey);
    return {
      matched: ruleIds.length > 0,
      triggerEventId: eventId,
      triggerEventPayload: { ...eventPayload, metricName: trigger.metricName },
      matchedRuleIds: ruleIds,
      evaluatedAt: new Date().toISOString(),
    };
  },
});

registerEvaluator('STATE_DURATION', {
  async evaluate(trigger, eventPayload, eventId) {
    const stateKey = `state:${trigger.entityType}:${trigger.targetState}`;
    const ruleIds = ruleService.getSubscribedRuleIds('STATE_DURATION', stateKey);
    return {
      matched: ruleIds.length > 0,
      triggerEventId: eventId,
      triggerEventPayload: { ...eventPayload, entityType: trigger.entityType, state: trigger.targetState },
      matchedRuleIds: ruleIds,
      evaluatedAt: new Date().toISOString(),
    };
  },
});

registerEvaluator('TIME_BEFORE', {
  async evaluate(trigger, eventPayload, eventId) {
    const timeKey = `timebefore:${trigger.referenceEventName}:${trigger.leadTimeMinutes}`;
    const ruleIds = ruleService.getSubscribedRuleIds('TIME_BEFORE', timeKey);
    return {
      matched: ruleIds.length > 0,
      triggerEventId: eventId,
      triggerEventPayload: { ...eventPayload, referenceEvent: trigger.referenceEventName },
      matchedRuleIds: ruleIds,
      evaluatedAt: new Date().toISOString(),
    };
  },
});

registerEvaluator('TIME_AFTER', {
  async evaluate(trigger, eventPayload, eventId) {
    const timeKey = `timeafter:${trigger.referenceEventName}:${trigger.lagTimeMinutes}`;
    const ruleIds = ruleService.getSubscribedRuleIds('TIME_AFTER', timeKey);
    return {
      matched: ruleIds.length > 0,
      triggerEventId: eventId,
      triggerEventPayload: { ...eventPayload, referenceEvent: trigger.referenceEventName },
      matchedRuleIds: ruleIds,
      evaluatedAt: new Date().toISOString(),
    };
  },
});

registerEvaluator('MANUAL_TEST', {
  async evaluate(trigger, eventPayload, eventId) {
    const ruleIds = ruleService.getSubscribedRuleIds('MANUAL_TEST', 'manual');
    return {
      matched: ruleIds.length > 0,
      triggerEventId: eventId,
      triggerEventPayload: { ...eventPayload, testPayload: trigger.manualTestPayload },
      matchedRuleIds: ruleIds,
      evaluatedAt: new Date().toISOString(),
    };
  },
});

function parseCronNextRun(cronExpression: string, timezone: string): Date {
  const now = new Date();
  const parts = cronExpression.split(' ');
  if (parts.length !== 5) return new Date(now.getTime() + 60000);

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
  const next = new Date(now);
  next.setSeconds(0);
  next.setMilliseconds(0);

  if (minute !== '*') next.setMinutes(parseInt(minute, 10));
  if (hour !== '*') next.setHours(parseInt(hour, 10));
  if (dayOfMonth !== '*') next.setDate(parseInt(dayOfMonth, 10));
  if (month !== '*') next.setMonth(parseInt(month, 10) - 1);
  if (dayOfWeek !== '*') next.setDay(parseInt(dayOfWeek, 10));

  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }

  return next;
}

export const triggerRegistry = {
  registerEvaluator,
  getEvaluator,

  async evaluateTrigger(
    trigger: AutomationTrigger,
    eventPayload: Record<string, unknown>,
    eventId: string
  ): Promise<TriggerEvaluationResult> {
    const evaluator = getEvaluator(trigger.type);
    if (!evaluator) {
      return {
        matched: false,
        triggerEventId: eventId,
        triggerEventPayload: eventPayload,
        matchedRuleIds: [],
        evaluatedAt: new Date().toISOString(),
      };
    }
    return evaluator.evaluate(trigger, eventPayload, eventId);
  },

  scheduleTrigger(trigger: AutomationTrigger, ruleId: string, ruleVersion: number): void {
    if (trigger.type !== 'SCHEDULE') return;
    if (!trigger.scheduleCron) return;

    const key = `schedule:${trigger.scheduleCron}`;
    const nextRun = parseCronNextRun(trigger.scheduleCron, trigger.scheduleTimezone || 'UTC');
    const delay = Math.max(0, nextRun.getTime() - Date.now());

    const timeoutId = setTimeout(() => {
      this.fireScheduledTrigger(trigger, ruleId, ruleVersion);
      this.rescheduleTrigger(trigger, ruleId, ruleVersion);
    }, delay);

    activeScheduledJobs.set(`${ruleId}:${ruleVersion}`, timeoutId);
  },

  rescheduleTrigger(trigger: AutomationTrigger, ruleId: string, ruleVersion: number): void {
    if (trigger.type !== 'SCHEDULE') return;
    if (!trigger.scheduleCron) return;

    const key = `schedule:${trigger.scheduleCron}`;
    const nextRun = parseCronNextRun(trigger.scheduleCron, trigger.scheduleTimezone || 'UTC');
    const delay = Math.max(0, nextRun.getTime() - Date.now());

    const timeoutId = setTimeout(() => {
      this.fireScheduledTrigger(trigger, ruleId, ruleVersion);
      this.rescheduleTrigger(trigger, ruleId, ruleVersion);
    }, delay);

    activeScheduledJobs.set(`${ruleId}:${ruleVersion}`, timeoutId);
  },

  async fireScheduledTrigger(trigger: AutomationTrigger, ruleId: string, ruleVersion: number): Promise<void> {
    const eventId = `scheduled_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const eventPayload = {
      cron: trigger.scheduleCron,
      scheduledAt: new Date().toISOString(),
      ruleId,
      ruleVersion,
    };

    const result = await this.evaluateTrigger(trigger, eventPayload, eventId);
    if (result.matched && result.matchedRuleIds.includes(ruleId)) {
      console.log('[TriggerRegistry] Firing scheduled trigger for rule:', ruleId);
    }
  },

  cancelScheduledTrigger(ruleId: string, ruleVersion: number): void {
    const key = `${ruleId}:${ruleVersion}`;
    const timeoutId = activeScheduledJobs.get(key);
    if (timeoutId) {
      clearTimeout(timeoutId);
      activeScheduledJobs.delete(key);
    }
  },

  cancelAllScheduledTriggers(): void {
    activeScheduledJobs.forEach(timeoutId => clearTimeout(timeoutId));
    activeScheduledJobs.clear();
  },

  getActiveScheduledJobs(): string[] {
    return Array.from(activeScheduledJobs.keys());
  },

  subscribeRule(ruleId: string, ruleVersion: number, trigger: AutomationTrigger): void {
    ruleService.registerTriggerSubscription({
      ...trigger,
      type: trigger.type,
      eventName: trigger.eventName,
      scheduleCron: trigger.scheduleCron,
      metricName: trigger.metricName,
    } as any);
  },

  unsubscribeRule(ruleId: string): void {
    ruleService.unregisterTriggerSubscription(ruleId);
  },

  getSubscribedRules(triggerType: AutomationTriggerType, identifier: string): string[] {
    return ruleService.getSubscribedRuleIds(triggerType, identifier);
  },

  registerDomainEventTrigger(eventName: string, eventPayload: Record<string, unknown>): string {
    const eventId = `event_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    console.log('[TriggerRegistry] Domain event:', eventName, eventId);
    return eventId;
  },
};