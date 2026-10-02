import {
  AutomationRule,
  AutomationRuleStatus,
  AutomationRuleVersion,
  CreateAutomationRuleCommand,
  UpdateAutomationRuleCommand,
  ActivateAutomationRuleCommand,
  PauseAutomationRuleCommand,
  DisableAutomationRuleCommand,
} from '../types/rule.types';
import { AutomationTriggerType, AutomationActionType, AutomationActionRisk } from '../types/rule.types';
import { v4 as uuidv4 } from 'uuid';

interface RuleStorage {
  rules: Map<string, AutomationRule>;
  versions: Map<string, AutomationRuleVersion[]>;
  subscriptions: Map<string, Set<string>>;
}

const storage: RuleStorage = {
  rules: new Map(),
  versions: new Map(),
  subscriptions: new Map(),
};

function generateId(): string {
  return uuidv4();
}

function getNow(): string {
  return new Date().toISOString();
}

function validateRuleSchema(rule: CreateAutomationRuleCommand | UpdateAutomationRuleCommand): string[] {
  const errors: string[] = [];

  if (!rule.name || rule.name.trim().length === 0) {
    errors.push('Rule name is required');
  }

  if (!rule.trigger) {
    errors.push('Trigger is required');
  } else {
    const validTriggerTypes: AutomationTriggerType[] = [
      'DOMAIN_EVENT', 'SCHEDULE', 'THRESHOLD', 'STATE_DURATION', 'MANUAL_TEST'
    ];
    if (!validTriggerTypes.includes(rule.trigger.type)) {
      errors.push(`Invalid trigger type: ${rule.trigger.type}`);
    }
  }

  if (!rule.conditions || !Array.isArray(rule.conditions)) {
    errors.push('Conditions must be an array');
  } else {
    rule.conditions.forEach((c, i) => {
      if (!c.id || !c.field || !c.operator) {
        errors.push(`Condition ${i} missing required fields (id, field, operator)`);
      }
    });
  }

  if (!rule.actions || !Array.isArray(rule.actions)) {
    errors.push('Actions must be an array');
  } else {
    rule.actions.forEach((a, i) => {
      if (!a.id || !a.type || !a.risk || !a.config) {
        errors.push(`Action ${i} missing required fields (id, type, risk, config)`);
      }
      const validActionTypes: AutomationActionType[] = [
        'SEND_NOTIFICATION', 'CREATE_NOTICE_DRAFT', 'CREATE_HELPDESK_ESCALATION',
        'CREATE_WORK_ORDER_REQUEST', 'CREATE_APPROVAL_REQUEST', 'REQUEST_HARDWARE_COMMAND',
        'REQUEST_AI_ANALYSIS', 'AI_DRAFT', 'HUMAN_APPROVAL_REQUEST'
      ];
      if (!validActionTypes.includes(a.type)) {
        errors.push(`Action ${i} has invalid type: ${a.type}`);
      }
      const validRisks: AutomationActionRisk[] = ['LOW', 'MODERATE', 'HIGH', 'PROHIBITED_AUTO'];
      if (!validRisks.includes(a.risk)) {
        errors.push(`Action ${i} has invalid risk: ${a.risk}`);
      }
    });
  }

  if (rule.cooldown) {
    if (typeof rule.cooldown.enabled !== 'boolean') {
      errors.push('Cooldown.enabled must be boolean');
    }
    if (rule.cooldown.enabled && (!rule.cooldown.windowMinutes || rule.cooldown.windowMinutes < 1)) {
      errors.push('Cooldown window must be at least 1 minute');
    }
  }

  return errors;
}

function checkDependencies(rule: CreateAutomationRuleCommand | UpdateAutomationRuleCommand): string[] {
  const warnings: string[] = [];

  if (rule.trigger.type === 'DOMAIN_EVENT' && !rule.trigger.eventName) {
    warnings.push('Domain event trigger missing eventName');
  }
  if (rule.trigger.type === 'SCHEDULE' && !rule.trigger.scheduleCron) {
    warnings.push('Schedule trigger missing cronExpression');
  }
  if (rule.trigger.type === 'THRESHOLD' && (!rule.trigger.metricName || rule.trigger.thresholdValue === undefined)) {
    warnings.push('Threshold trigger missing metricName or thresholdValue');
  }

  rule.actions.forEach((action) => {
    if (action.type === 'SEND_NOTIFICATION' && !action.config.templateId) {
      warnings.push(`Action ${action.id}: SEND_NOTIFICATION requires templateId in config`);
    }
    if (action.type === 'REQUEST_HARDWARE_COMMAND' && !action.config.deviceId) {
      warnings.push(`Action ${action.id}: REQUEST_HARDWARE_COMMAND requires deviceId in config`);
    }
    if (action.type === 'REQUEST_AI_ANALYSIS' && !action.config.capability) {
      warnings.push(`Action ${action.id}: REQUEST_AI_ANALYSIS requires capability in config`);
    }
    if (action.type === 'CREATE_WORK_ORDER_REQUEST' && !action.config.category) {
      warnings.push(`Action ${action.id}: CREATE_WORK_ORDER_REQUEST requires category in config`);
    }
  });

  return warnings;
}

function detectLoops(rule: AutomationRule, allRules: AutomationRule[]): string[] {
  const warnings: string[] = [];

  const actionCreatesEvents = rule.actions.filter(a =>
    ['CREATE_NOTICE_DRAFT', 'CREATE_HELPDESK_ESCALATION', 'CREATE_WORK_ORDER_REQUEST',
     'CREATE_APPROVAL_REQUEST', 'REQUEST_HARDWARE_COMMAND'].includes(a.type)
  );

  if (actionCreatesEvents.length === 0) return warnings;

  const visited = new Set<string>();
  const stack = new Set<string>();

  function dfs(currentRuleId: string, depth: number): boolean {
    if (depth > 10) return true;
    if (visited.has(currentRuleId)) return false;
    if (stack.has(currentRuleId)) return true;

    stack.add(currentRuleId);
    const currentRule = allRules.find(r => r.id === currentRuleId);
    if (!currentRule) {
      stack.delete(currentRuleId);
      return false;
    }

    currentRule.actions.forEach(action => {
      if (['CREATE_NOTICE_DRAFT', 'CREATE_HELPDESK_ESCALATION', 'CREATE_WORK_ORDER_REQUEST',
           'CREATE_APPROVAL_REQUEST', 'REQUEST_HARDWARE_COMMAND'].includes(action.type)) {
        const potentialEvents = getPotentialEventsFromAction(action);
        allRules.forEach(r => {
          if (r.trigger.type === 'DOMAIN_EVENT' && potentialEvents.includes(r.trigger.eventName)) {
            if (dfs(r.id, depth + 1)) {
              warnings.push(`Potential loop detected: ${rule.id} -> ${r.id} via ${action.type} -> ${r.trigger.eventName}`);
            }
          }
        });
      }
    });

    stack.delete(currentRuleId);
    visited.add(currentRuleId);
    return false;
  }

  dfs(rule.id, 0);
  return warnings;
}

function getPotentialEventsFromAction(action: any): string[] {
  const eventMap: Record<string, string[]> = {
    'CREATE_NOTICE_DRAFT': ['NOTICE_CREATED', 'NOTICE_PUBLISHED'],
    'CREATE_HELPDESK_ESCALATION': ['COMPLAINT_ESCALATED', 'COMPLAINT_UPDATED'],
    'CREATE_WORK_ORDER_REQUEST': ['WORK_ORDER_CREATED', 'WORK_ORDER_UPDATED'],
    'CREATE_APPROVAL_REQUEST': ['APPROVAL_REQUESTED', 'APPROVAL_DECIDED'],
    'REQUEST_HARDWARE_COMMAND': ['HARDWARE_COMMAND_SENT', 'HARDWARE_COMMAND_COMPLETED'],
  };
  return eventMap[action.type] || [];
}

export const ruleService = {
  createRule(actorId: string, societyId: string, command: CreateAutomationRuleCommand): AutomationRule {
    const schemaErrors = validateRuleSchema(command);
    if (schemaErrors.length > 0) {
      throw new Error(`Schema validation failed: ${schemaErrors.join('; ')}`);
    }

    const depWarnings = checkDependencies(command);
    const now = getNow();

    const rule: AutomationRule = {
      id: generateId(),
      societyId,
      name: command.name.trim(),
      description: command.description?.trim(),
      version: 1,
      status: 'DRAFT',
      trigger: command.trigger,
      conditions: command.conditions,
      actions: command.actions,
      approvalPolicyId: command.approvalPolicyId,
      cooldown: command.cooldown,
      suppression: command.suppression,
      effectiveFrom: command.effectiveFrom,
      effectiveTo: command.effectiveTo,
      createdBy: actorId,
      createdAt: now,
      updatedAt: now,
      isLatestVersion: true,
    };

    storage.rules.set(rule.id, rule);
    storage.versions.set(rule.id, []);
    this.createVersion(rule, actorId, 'Initial version');

    return rule;
  },

  updateRule(actorId: string, ruleId: string, command: UpdateAutomationRuleCommand): AutomationRule {
    const rule = storage.rules.get(ruleId);
    if (!rule) throw new Error('RULE_NOT_FOUND');

    if (rule.status === 'ACTIVE') {
      throw new Error('CANNOT_EDIT_ACTIVE_RULE: Create a new version instead');
    }

    const mergedRule: AutomationRule = {
      ...rule,
      ...command,
      updatedBy: actorId,
      updatedAt: getNow(),
    };

    const schemaErrors = validateRuleSchema(mergedRule);
    if (schemaErrors.length > 0) {
      throw new Error(`Schema validation failed: ${schemaErrors.join('; ')}`);
    }

    const depWarnings = checkDependencies(mergedRule);
    const loopWarnings = detectLoops(mergedRule, Array.from(storage.rules.values()));
    if (loopWarnings.length > 0) {
      console.warn('[RuleService] Loop warnings:', loopWarnings);
    }

    storage.rules.set(ruleId, mergedRule);
    return mergedRule;
  },

  createVersion(rule: AutomationRule, actorId: string, changeSummary?: string): AutomationRuleVersion {
    const versions = storage.versions.get(rule.id) || [];
    const version: AutomationRuleVersion = {
      id: generateId(),
      ruleId: rule.id,
      version: rule.version,
      snapshot: { ...rule },
      createdBy: actorId,
      createdAt: getNow(),
      changeSummary,
    };
    versions.push(version);
    storage.versions.set(rule.id, versions);
    return version;
  },

  activateRule(actorId: string, command: ActivateAutomationRuleCommand): AutomationRule {
    const rule = storage.rules.get(command.ruleId);
    if (!rule) throw new Error('RULE_NOT_FOUND');

    if (rule.status !== 'DRAFT' && rule.status !== 'READY') {
      throw new Error(`INVALID_STATE: Cannot activate rule in ${rule.status} state`);
    }

    if (rule.version !== command.version) {
      throw new Error('VERSION_MISMATCH: Rule version has changed');
    }

    if (!rule.isLatestVersion) {
      throw new Error('STALE_VERSION: Not the latest version');
    }

    const schemaErrors = validateRuleSchema(rule);
    if (schemaErrors.length > 0) {
      throw new Error(`Schema validation failed: ${schemaErrors.join('; ')}`);
    }

    const depWarnings = checkDependencies(rule);
    const loopWarnings = detectLoops(rule, Array.from(storage.rules.values()));
    if (loopWarnings.length > 0) {
      throw new Error(`Loop detection failed: ${loopWarnings.join('; ')}`);
    }

    const allRules = Array.from(storage.rules.values());
    const conflicts = allRules.filter(r =>
      r.id !== rule.id &&
      r.status === 'ACTIVE' &&
      r.societyId === rule.societyId &&
      r.trigger.type === rule.trigger.type &&
      ((r.trigger.type === 'DOMAIN_EVENT' && r.trigger.eventName === rule.trigger.eventName) ||
       (r.trigger.type === 'SCHEDULE' && r.trigger.scheduleCron === rule.trigger.scheduleCron))
    );

    if (conflicts.length > 0) {
      console.warn('[RuleService] Active rule conflicts detected:', conflicts.map(c => c.id));
    }

    rule.status = 'ACTIVE';
    rule.activatedBy = actorId;
    rule.activatedAt = getNow();
    rule.updatedBy = actorId;
    rule.updatedAt = getNow();

    this.createVersion(rule, actorId, 'Activated');
    this.registerTriggerSubscription(rule);

    return rule;
  },

  pauseRule(actorId: string, command: PauseAutomationRuleCommand): AutomationRule {
    const rule = storage.rules.get(command.ruleId);
    if (!rule) throw new Error('RULE_NOT_FOUND');

    rule.status = 'PAUSED';
    rule.suppression = { enabled: true, reason: command.reason };
    rule.updatedBy = actorId;
    rule.updatedAt = getNow();

    this.createVersion(rule, actorId, `Paused: ${command.reason}`);
    this.unregisterTriggerSubscription(rule.id);

    return rule;
  },

  disableRule(actorId: string, command: DisableAutomationRuleCommand): AutomationRule {
    const rule = storage.rules.get(command.ruleId);
    if (!rule) throw new Error('RULE_NOT_FOUND');

    rule.status = 'DISABLED';
    rule.suppression = { enabled: true, reason: command.reason };
    rule.updatedBy = actorId;
    rule.updatedAt = getNow();

    this.createVersion(rule, actorId, `Disabled: ${command.reason}`);
    this.unregisterTriggerSubscription(rule.id);

    return rule;
  },

  getRule(ruleId: string): AutomationRule | undefined {
    return storage.rules.get(ruleId);
  },

  getRulesBySociety(societyId: string): AutomationRule[] {
    return Array.from(storage.rules.values()).filter(r => r.societyId === societyId);
  },

  getActiveRulesBySociety(societyId: string): AutomationRule[] {
    const now = new Date().toISOString();
    return Array.from(storage.rules.values()).filter(r =>
      r.societyId === societyId &&
      r.status === 'ACTIVE' &&
      (!r.effectiveFrom || r.effectiveFrom <= now) &&
      (!r.effectiveTo || r.effectiveTo >= now)
    );
  },

  getRuleVersions(ruleId: string): AutomationRuleVersion[] {
    return storage.versions.get(ruleId) || [];
  },

  getRuleVersion(ruleId: string, version: number): AutomationRuleVersion | undefined {
    const versions = storage.versions.get(ruleId) || [];
    return versions.find(v => v.version === version);
  },

  rollbackToVersion(actorId: string, ruleId: string, version: number): AutomationRule {
    const targetVersion = this.getRuleVersion(ruleId, version);
    if (!targetVersion) throw new Error('VERSION_NOT_FOUND');

    const currentRule = storage.rules.get(ruleId);
    if (!currentRule) throw new Error('RULE_NOT_FOUND');

    if (currentRule.status === 'ACTIVE') {
      throw new Error('CANNOT_ROLLBACK_ACTIVE_RULE: Disable first');
    }

    const restoredRule = {
      ...targetVersion.snapshot,
      id: currentRule.id,
      version: currentRule.version + 1,
      status: 'DRAFT',
      updatedBy: actorId,
      updatedAt: getNow(),
      parentRuleId: currentRule.parentRuleId,
      isLatestVersion: true,
    };

    storage.rules.set(ruleId, restoredRule);
    this.createVersion(restoredRule, actorId, `Rolled back to version ${version}`);

    return restoredRule;
  },

  registerTriggerSubscription(rule: AutomationRule): void {
    const key = `${rule.trigger.type}:${rule.trigger.eventName || rule.trigger.scheduleCron || rule.trigger.metricName || 'manual'}`;
    if (!storage.subscriptions.has(key)) {
      storage.subscriptions.set(key, new Set());
    }
    storage.subscriptions.get(key)!.add(rule.id);
  },

  unregisterTriggerSubscription(ruleId: string): void {
    storage.subscriptions.forEach((ruleIds, key) => {
      ruleIds.delete(ruleId);
    });
  },

  getSubscribedRuleIds(triggerType: AutomationTriggerType, identifier: string): string[] {
    const key = `${triggerType}:${identifier}`;
    return Array.from(storage.subscriptions.get(key) || []);
  },

  validateRule(rule: AutomationRule): { valid: boolean; errors: string[]; warnings: string[] } {
    const schemaErrors = validateRuleSchema(rule);
    const depWarnings = checkDependencies(rule);
    const loopWarnings = detectLoops(rule, Array.from(storage.rules.values()));
    return {
      valid: schemaErrors.length === 0,
      errors: schemaErrors,
      warnings: [...depWarnings, ...loopWarnings],
    };
  },

  dryRun(rule: AutomationRule, testPayload: Record<string, unknown>): {
    conditionEvaluations: Array<{
      conditionId: string;
      passed: boolean;
      actualValue: unknown;
    }>;
    wouldRunActions: Array<{
      actionId: string;
      actionType: string;
      suppressed: boolean;
      suppressionReason?: string;
    }>;
  } {
    const evaluations = rule.conditions.map(c => ({
      conditionId: c.id,
      passed: this.evaluateCondition(c, testPayload),
      actualValue: this.getFieldValue(testPayload, c.field),
    }));

    const allPassed = evaluations.every(e => e.passed);
    const wouldRunActions = rule.actions.map(a => ({
      actionId: a.id,
      actionType: a.type,
      suppressed: !allPassed,
      suppressionReason: !allPassed ? 'CONDITIONS_NOT_MET' : undefined,
    }));

    return { conditionEvaluations: evaluations, wouldRunActions };
  },

  evaluateCondition(condition: any, payload: Record<string, unknown>): boolean {
    const actualValue = this.getFieldValue(payload, condition.field);
    const expectedValue = condition.value;

    switch (condition.operator) {
      case 'EQUALS': return actualValue === expectedValue;
      case 'NOT_EQUALS': return actualValue !== expectedValue;
      case 'GREATER_THAN': return Number(actualValue) > Number(expectedValue);
      case 'GREATER_THAN_OR_EQUALS': return Number(actualValue) >= Number(expectedValue);
      case 'LESS_THAN': return Number(actualValue) < Number(expectedValue);
      case 'LESS_THAN_OR_EQUALS': return Number(actualValue) <= Number(expectedValue);
      case 'IN': return Array.isArray(expectedValue) && expectedValue.includes(actualValue);
      case 'NOT_IN': return Array.isArray(expectedValue) && !expectedValue.includes(actualValue);
      case 'EXISTS': return actualValue !== undefined && actualValue !== null;
      case 'NOT_EXISTS': return actualValue === undefined || actualValue === null;
      case 'CONTAINS': return String(actualValue).includes(String(expectedValue));
      case 'NOT_CONTAINS': return !String(actualValue).includes(String(expectedValue));
      default: return false;
    }
  },

  getFieldValue(obj: Record<string, unknown>, path: string): unknown {
    return path.split('.').reduce((current: any, key: string) => current?.[key], obj);
  },

  checkEffectiveDates(rule: AutomationRule): boolean {
    const now = new Date().toISOString();
    if (rule.effectiveFrom && rule.effectiveFrom > now) return false;
    if (rule.effectiveTo && rule.effectiveTo < now) return false;
    return true;
  },

  clearStorage(): void {
    storage.rules.clear();
    storage.versions.clear();
    storage.subscriptions.clear();
  },
};