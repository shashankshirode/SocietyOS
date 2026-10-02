import {
  AutomationExecution,
  AutomationExecutionStatus,
  AutomationActionAttempt,
  AutomationActionStatus,
  AutomationConditionEvaluation,
  AutomationSuppressionReason,
  AutomationSuppression,
  CreateAutomationExecutionCommand,
  ApproveAutomationExecutionCommand,
  RejectAutomationExecutionCommand,
  RetryAutomationExecutionCommand,
} from '../types';
import { ruleService } from './ruleService';
import { conditionEngine } from './conditionEngine';
import { actionDispatcher } from './actionDispatcher';
import { triggerRegistry } from './triggerRegistry';
import { suppressionService } from './suppressionService';
import { approvalService } from './approvalService';
import { retryService } from './retryService';
import { v4 as uuidv4 } from 'uuid';

const executions: Map<string, AutomationExecution> = new Map();
const executionsByCorrelation: Map<string, Set<string>> = new Map();

function generateId(): string {
  return uuidv4();
}

function getNow(): string {
  return new Date().toISOString();
}

function getCausalChain(triggerEventPayload: Record<string, unknown>, correlationId: string): string[] {
  const chain = [correlationId];
  if (triggerEventPayload.causalChain) {
    chain.push(...(triggerEventPayload.causalChain as string[]));
  }
  return chain;
}

function checkLoopProtection(causalChain: string[], maxDepth = 10): { allowed: boolean; depth: number } {
  const uniqueEvents = new Set(causalChain);
  return {
    allowed: uniqueEvents.size <= maxDepth,
    depth: uniqueEvents.size,
  };
}

export const executionService = {
  async createExecution(command: CreateAutomationExecutionCommand): Promise<AutomationExecution | null> {
    const rule = ruleService.getRule(command.ruleId);
    if (!rule) {
      console.error('[ExecutionService] Rule not found:', command.ruleId);
      return null;
    }

    if (!ruleService.checkEffectiveDates(rule)) {
      console.log('[ExecutionService] Rule not in effective date range:', command.ruleId);
      return null;
    }

    if (rule.status !== 'ACTIVE') {
      console.log('[ExecutionService] Rule not active:', command.ruleId, rule.status);
      return null;
    }

    const loopCheck = checkLoopProtection(command.causalChain);
    if (!loopCheck.allowed) {
      console.warn('[ExecutionService] Loop detected, max depth exceeded:', command.correlationId);
      return null;
    }

    const existingExecutionIds = executionsByCorrelation.get(command.correlationId) || new Set();
    for (const existingId of existingExecutionIds) {
      const existing = executions.get(existingId);
      if (existing && existing.ruleId === command.ruleId && existing.ruleVersion === command.ruleVersion) {
        console.log('[ExecutionService] Duplicate execution suppressed:', command.correlationId);
        return null;
      }
    }

    const executionId = `exec_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const now = getNow();

    const conditionEvaluations = conditionEngine.evaluateConditions(rule.conditions, command.triggerEventPayload);
    const allConditionsPassed = conditionEngine.evaluateAllPassed(conditionEvaluations);

    const suppression = suppressionService.checkSuppression(rule, command.triggerEventPayload, command.triggerEventId);

    let initialStatus: AutomationExecutionStatus = 'TRIGGERED';
    let suppressions: AutomationSuppression[] = [];

    if (suppression.suppressed) {
      initialStatus = 'SUPPRESSED';
      suppressions.push({
        id: `supp_${Date.now()}`,
        executionId: '',
        reason: suppression.reason,
        detail: suppression.detail,
        suppressedAt: now,
        expiresAt: suppression.expiresAt,
      });
    } else if (!allConditionsPassed) {
      initialStatus = 'EVALUATING';
    } else {
      initialStatus = 'ACTIONABLE';
    }

    const actionAttempts = rule.actions.map(action => ({
      actionId: action.id,
      actionType: action.type,
      risk: action.risk,
      status: initialStatus === 'ACTIONABLE' ? 'PENDING' : 'SKIPPED' as AutomationActionStatus,
      config: action.config,
      idempotencyKey: `auto_${action.id}_${executionId}_${rule.societyId}`.replace(/[^a-zA-Z0-9_]/g, '_'),
      domainService: actionDispatcher.getDomainService(action.type),
      domainMethod: actionDispatcher.getDomainMethod(action.type),
      domainParams: action.config,
      retryCount: 0,
      dependsOnActionId: action.dependsOnActionId,
      requiresApproval: action.requiresApproval || false,
      approvalStatus: action.requiresApproval ? 'PENDING' : undefined,
    }));

    const approvals = rule.actions
      .filter(a => a.requiresApproval)
      .map(action => ({
        id: `appr_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        executionId: '',
        actionId: action.id,
        approverRoles: ['FACILITY_MANAGER', 'SUPER_ADMIN'],
        requiredApprovals: 1,
        currentApprovals: 0,
        status: 'PENDING' as const,
        requestedAt: now,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }));

    const execution: AutomationExecution = {
      id: executionId,
      societyId: rule.societyId,
      ruleId: rule.id,
      ruleVersion: rule.version,
      triggerType: rule.trigger.type,
      triggerEventId: command.triggerEventId,
      triggerEventPayload: command.triggerEventPayload,
      triggeredAt: now,
      status: initialStatus,
      conditionEvaluations,
      actionAttempts,
      approvals,
      suppressions,
      correlationId: command.correlationId,
      causalChain: getCausalChain(command.triggerEventPayload, command.correlationId),
      causalDepth: loopCheck.depth,
      startedAt: now,
      dryRun: command.dryRun || false,
    };

    execution.suppressions.forEach(s => s.executionId = executionId);
    execution.approvals.forEach(a => a.executionId = executionId);

    executions.set(executionId, execution);

    if (!executionsByCorrelation.has(command.correlationId)) {
      executionsByCorrelation.set(command.correlationId, new Set());
    }
    executionsByCorrelation.get(command.correlationId)!.add(executionId);

    if (initialStatus === 'ACTIONABLE') {
      this.processExecution(executionId);
    }

    return execution;
  },

  async processExecution(executionId: string): Promise<void> {
    const execution = executions.get(executionId);
    if (!execution) return;

    const rule = ruleService.getRule(execution.ruleId);
    if (!rule) return;

    execution.status = 'EXECUTING';

    const actionAttempts = [...execution.actionAttempts];

    for (let i = 0; i < actionAttempts.length; i++) {
      const attempt = actionAttempts[i];

      if (attempt.dependsOnActionId) {
        const dependency = actionAttempts.find(a => a.actionId === attempt.dependsOnActionId);
        if (dependency && dependency.status !== 'COMPLETED') {
          attempt.status = 'SKIPPED';
          continue;
        }
      }

      if (attempt.requiresApproval && attempt.approvalStatus !== 'APPROVED') {
        execution.status = 'WAITING_APPROVAL';
        executions.set(executionId, { ...execution, actionAttempts });
        return;
      }

      if (attempt.status === 'SKIPPED') continue;

      const result = await actionDispatcher.executeAction(
        rule.actions.find(a => a.id === attempt.actionId)!,
        {
          societyId: execution.societyId,
          actorId: 'SYSTEM_AUTOMATION',
          correlationId: execution.correlationId,
          executionId: execution.id,
        }
      );

      actionAttempts[i] = result;

      if (result.status === 'FAILED') {
        if (actionDispatcher.isRetryableError(result.error?.code || '')) {
          actionAttempts[i].status = 'RETRYING';
        }
      }
    }

    const hasFailures = actionAttempts.some(a => a.status === 'FAILED');
    const hasPending = actionAttempts.some(a => a.status === 'PENDING' || a.status === 'RETRYING');
    const hasWaitingApproval = actionAttempts.some(a => a.requiresApproval && a.approvalStatus === 'PENDING');

    if (hasWaitingApproval) {
      execution.status = 'WAITING_APPROVAL';
    } else if (hasPending) {
      execution.status = 'EXECUTING';
    } else if (hasFailures) {
      execution.status = 'PARTIAL';
    } else {
      execution.status = 'COMPLETED';
      execution.completedAt = getNow();
    }

    execution.actionAttempts = actionAttempts;
    executions.set(executionId, execution);
  },

  async approveExecution(command: ApproveAutomationExecutionCommand): Promise<AutomationExecution | null> {
    const execution = executions.get(command.executionId);
    if (!execution) return null;

    const approval = execution.approvals.find(a => a.actionId === command.actionId);
    if (!approval) return null;

    if (approval.status !== 'PENDING') return execution;

    approval.status = 'APPROVED';
    approval.decidedAt = getNow();
    approval.decidedBy = command.approverId;
    approval.currentApprovals = approval.requiredApprovals;

    const attempt = execution.actionAttempts.find(a => a.actionId === command.actionId);
    if (attempt) {
      attempt.approvalStatus = 'APPROVED';
      attempt.status = 'PENDING';
    }

    executions.set(execution.id, execution);
    await this.processExecution(execution.id);

    return executions.get(execution.id) || null;
  },

  async rejectExecution(command: RejectAutomationExecutionCommand): Promise<AutomationExecution | null> {
    const execution = executions.get(command.executionId);
    if (!execution) return null;

    const approval = execution.approvals.find(a => a.actionId === command.actionId);
    if (!approval) return null;

    if (approval.status !== 'PENDING') return execution;

    approval.status = 'REJECTED';
    approval.decidedAt = getNow();
    approval.decidedBy = command.approverId;
    approval.rejectionReason = command.reason;

    const attempt = execution.actionAttempts.find(a => a.actionId === command.actionId);
    if (attempt) {
      attempt.approvalStatus = 'REJECTED';
      attempt.status = 'FAILED';
      attempt.error = { code: 'REJECTED', message: command.reason };
      attempt.completedAt = getNow();
    }

    const hasOtherPending = execution.approvals.some(a => a.status === 'PENDING');
    const hasFailures = execution.actionAttempts.some(a => a.status === 'FAILED');

    if (!hasOtherPending) {
      if (hasFailures) {
        execution.status = 'PARTIAL';
      } else {
        execution.status = 'COMPLETED';
        execution.completedAt = getNow();
      }
    }

    executions.set(execution.id, execution);
    return execution;
  },

  async retryExecution(command: RetryAutomationExecutionCommand): Promise<AutomationExecution | null> {
    const execution = executions.get(command.executionId);
    if (!execution) return null;

    const attemptsToRetry = command.actionIds
      ? execution.actionAttempts.filter(a => command.actionIds!.includes(a.actionId))
      : execution.actionAttempts.filter(a => a.status === 'FAILED' || a.status === 'RETRYING');

    for (const attempt of attemptsToRetry) {
      if (actionDispatcher.isPermanentError(attempt.error?.code || '')) {
        continue;
      }

      const rule = ruleService.getRule(execution.ruleId);
      if (!rule) continue;

      const actionDef = rule.actions.find(a => a.id === attempt.actionId);
      if (!actionDef) continue;

      const result = await retryService.retryAction(attempt, {
        societyId: execution.societyId,
        actorId: 'SYSTEM_AUTOMATION',
        correlationId: execution.correlationId,
        executionId: execution.id,
      });

      const index = execution.actionAttempts.findIndex(a => a.actionId === attempt.actionId);
      if (index >= 0) {
        execution.actionAttempts[index] = result;
      }
    }

    const hasFailures = execution.actionAttempts.some(a => a.status === 'FAILED');
    const hasPending = execution.actionAttempts.some(a => a.status === 'PENDING' || a.status === 'RETRYING');

    if (hasPending) {
      execution.status = 'EXECUTING';
    } else if (hasFailures) {
      execution.status = 'PARTIAL';
    } else {
      execution.status = 'COMPLETED';
      execution.completedAt = getNow();
    }

    executions.set(execution.id, execution);
    return execution;
  },

  getExecution(executionId: string): AutomationExecution | undefined {
    return executions.get(executionId);
  },

  getExecutionsBySociety(societyId: string): AutomationExecution[] {
    return Array.from(executions.values()).filter(e => e.societyId === societyId);
  },

  getExecutionsByRule(ruleId: string): AutomationExecution[] {
    return Array.from(executions.values()).filter(e => e.ruleId === ruleId);
  },

  getExecutionsByCorrelation(correlationId: string): AutomationExecution[] {
    const ids = executionsByCorrelation.get(correlationId) || new Set();
    return Array.from(ids).map(id => executions.get(id)!).filter(Boolean);
  },

  getRecentExecutions(societyId: string, limit = 100): AutomationExecution[] {
    return Array.from(executions.values())
      .filter(e => e.societyId === societyId)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
      .slice(0, limit);
  },

  getExecutionStats(societyId: string): {
    total: number;
    completed: number;
    partial: number;
    failed: number;
    suppressed: number;
    waitingApproval: number;
  } {
    const societyExecutions = this.getExecutionsBySociety(societyId);
    return {
      total: societyExecutions.length,
      completed: societyExecutions.filter(e => e.status === 'COMPLETED').length,
      partial: societyExecutions.filter(e => e.status === 'PARTIAL').length,
      failed: societyExecutions.filter(e => e.status === 'FAILED').length,
      suppressed: societyExecutions.filter(e => e.status === 'SUPPRESSED').length,
      waitingApproval: societyExecutions.filter(e => e.status === 'WAITING_APPROVAL').length,
    };
  },

  clearExecutions(): void {
    executions.clear();
    executionsByCorrelation.clear();
  },
};