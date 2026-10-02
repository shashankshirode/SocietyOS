import { AutomationRule, AutomationConditionEvaluation, AutomationDryRunResult } from '../types';
import { ruleService } from './ruleService';
import { conditionEngine } from './conditionEngine';
import { suppressionService } from './suppressionService';

export const dryRunService = {
  simulate(
    ruleId: string,
    testPayload: Record<string, unknown>,
    triggerEventId: string = `test_${Date.now()}`
  ): AutomationDryRunResult | null {
    const rule = ruleService.getRule(ruleId);
    if (!rule) return null;

    const conditionEvaluations = conditionEngine.evaluateConditions(rule.conditions, testPayload);
    const allPassed = conditionEngine.evaluateAllPassed(conditionEvaluations);

    const suppression = suppressionService.checkSuppression(rule, testPayload, triggerEventId);

    const wouldRunActions = rule.actions.map(action => ({
      actionId: action.id,
      actionType: action.type,
      config: action.config,
      suppressed: !allPassed || suppression.suppressed,
      suppressionReason: !allPassed ? 'CONDITIONS_NOT_MET' : (suppression.suppressed ? suppression.reason : undefined),
    }));

    const suppressionReasons: string[] = [];
    if (suppression.suppressed) {
      suppressionReasons.push(suppression.reason);
    }
    if (!allPassed) {
      suppressionReasons.push('CONDITIONS_NOT_MET');
    }

    return {
      executionId: `dryrun_${Date.now()}`,
      ruleId: rule.id,
      ruleVersion: rule.version,
      wouldExecute: allPassed && !suppression.suppressed,
      conditionEvaluations,
      wouldRunActions,
      suppressionReasons,
      evaluatedAt: new Date().toISOString(),
    };
  },

  simulateMultiple(
    ruleIds: string[],
    testPayload: Record<string, unknown>
  ): Array<AutomationDryRunResult | null> {
    return ruleIds.map(id => this.simulate(id, testPayload));
  },

  simulateWithContext(
    ruleId: string,
    testPayload: Record<string, unknown>,
    context: {
      societyId: string;
      userId: string;
      userRoles: string[];
    }
  ): {
    result: AutomationDryRunResult | null;
    permissions: {
      canExecute: boolean;
      missingPermissions: string[];
    };
    featureFlags: {
      enabled: boolean;
      disabledFeatures: string[];
    };
  } {
    const rule = ruleService.getRule(ruleId);
    if (!rule) {
      return {
        result: null,
        permissions: { canExecute: false, missingPermissions: ['RULE_NOT_FOUND'] },
        featureFlags: { enabled: false, disabledFeatures: ['RULE_NOT_FOUND'] },
      };
    }

    const result = this.simulate(ruleId, testPayload);
    if (!result) {
      return {
        result: null,
        permissions: { canExecute: false, missingPermissions: ['SIMULATION_FAILED'] },
        featureFlags: { enabled: false, disabledFeatures: ['SIMULATION_FAILED'] },
      };
    }

    const missingPermissions: string[] = [];
    if (!context.userRoles.includes('SUPER_ADMIN') && !context.userRoles.includes('FACILITY_MANAGER')) {
      if (rule.actions.some(a => a.risk === 'HIGH' || a.risk === 'PROHIBITED_AUTO')) {
        missingPermissions.push('HIGH_RISK_ACTION_PERMISSION');
      }
    }

    const disabledFeatures: string[] = [];
    if (!result.wouldExecute) {
      if (result.suppressionReasons.includes('COOLDOWN_ACTIVE')) {
        disabledFeatures.push('COOLDOWN');
      }
    }

    return {
      result,
      permissions: {
        canExecute: missingPermissions.length === 0,
        missingPermissions,
      },
      featureFlags: {
        enabled: disabledFeatures.length === 0,
        disabledFeatures,
      },
    };
  },

  getSimulationPreview(
    ruleId: string,
    testPayload: Record<string, unknown>
  ): {
    rule: { id: string; name: string; version: number; status: string };
    conditions: Array<{
      id: string;
      field: string;
      operator: string;
      value: unknown;
      actualValue: unknown;
      passed: boolean;
    }>;
    actions: Array<{
      id: string;
      type: string;
      risk: string;
      config: Record<string, unknown>;
      wouldRun: boolean;
      suppressionReason?: string;
    }>;
    summary: {
      wouldExecute: boolean;
      conditionsPassed: number;
      conditionsTotal: number;
      actionsWouldRun: number;
      actionsTotal: number;
    };
  } | null {
    const result = this.simulate(ruleId, testPayload);
    if (!result) return null;

    const rule = ruleService.getRule(ruleId);
    if (!rule) return null;

    return {
      rule: { id: rule.id, name: rule.name, version: rule.version, status: rule.status },
      conditions: result.conditionEvaluations.map(e => ({
        id: e.conditionId,
        field: e.field,
        operator: e.operator,
        value: e.expectedValue,
        actualValue: e.actualValue,
        passed: e.passed,
      })),
      actions: result.wouldRunActions.map(a => ({
        id: a.actionId,
        type: a.actionType,
        risk: rule.actions.find(r => r.id === a.actionId)?.risk || 'UNKNOWN',
        config: a.config,
        wouldRun: !a.suppressed,
        suppressionReason: a.suppressionReason,
      })),
      summary: {
        wouldExecute: result.wouldExecute,
        conditionsPassed: result.conditionEvaluations.filter(e => e.passed).length,
        conditionsTotal: result.conditionEvaluations.length,
        actionsWouldRun: result.wouldRunActions.filter(a => !a.suppressed).length,
        actionsTotal: result.wouldRunActions.length,
      },
    };
  },
};