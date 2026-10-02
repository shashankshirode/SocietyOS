import { AutomationAction, AutomationActionType, AutomationActionAttempt, AutomationActionStatus } from '../types';

interface ActionHandler {
  execute(params: {
    actionId: string;
    config: Record<string, unknown>;
    idempotencyKey: string;
    societyId: string;
    actorId: string;
    correlationId: string;
  }): Promise<{ success: boolean; result?: Record<string, unknown>; error?: { code: string; message: string } }>;
}

const actionHandlers: Map<AutomationActionType, ActionHandler> = new Map();

function registerHandler(type: AutomationActionType, handler: ActionHandler): void {
  actionHandlers.set(type, handler);
}

function getHandler(type: AutomationActionType): ActionHandler | undefined {
  return actionHandlers.get(type);
}

function generateIdempotencyKey(actionId: string, correlationId: string, societyId: string): string {
  return `auto_${actionId}_${correlationId}_${societyId}`.replace(/[^a-zA-Z0-9_]/g, '_');
}

export const actionDispatcher = {
  registerHandler,
  getHandler,

  async executeAction(
    action: AutomationAction,
    context: {
      societyId: string;
      actorId: string;
      correlationId: string;
      executionId: string;
    }
  ): Promise<AutomationActionAttempt> {
    const handler = getHandler(action.type);
    const idempotencyKey = generateIdempotencyKey(action.id, context.correlationId, context.societyId);

    const attempt: AutomationActionAttempt = {
      actionId: action.id,
      actionType: action.type,
      risk: action.risk,
      status: 'EXECUTING',
      config: action.config,
      idempotencyKey,
      domainService: this.getDomainService(action.type),
      domainMethod: this.getDomainMethod(action.type),
      domainParams: action.config,
      retryCount: 0,
      dependsOnActionId: action.dependsOnActionId,
      requiresApproval: action.requiresApproval || false,
      approvalStatus: action.requiresApproval ? 'PENDING' : undefined,
    };

    if (!handler) {
      attempt.status = 'FAILED';
      attempt.error = { code: 'HANDLER_NOT_FOUND', message: `No handler registered for action type: ${action.type}` };
      attempt.completedAt = new Date().toISOString();
      return attempt;
    }

    if (action.requiresApproval) {
      attempt.status = 'PENDING';
      attempt.approvalStatus = 'PENDING';
      return attempt;
    }

    attempt.startedAt = new Date().toISOString();

    try {
      const result = await handler.execute({
        actionId: action.id,
        config: action.config,
        idempotencyKey,
        societyId: context.societyId,
        actorId: context.actorId,
        correlationId: context.correlationId,
      });

      if (result.success) {
        attempt.status = 'COMPLETED';
        attempt.result = result.result;
      } else {
        attempt.status = 'FAILED';
        attempt.error = result.error || { code: 'ACTION_FAILED', message: 'Action execution failed' };
      }
    } catch (error) {
      attempt.status = 'FAILED';
      attempt.error = {
        code: 'EXECUTION_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    attempt.completedAt = new Date().toISOString();
    return attempt;
  },

  async retryAction(
    attempt: AutomationActionAttempt,
    context: {
      societyId: string;
      actorId: string;
      correlationId: string;
      executionId: string;
    }
  ): Promise<AutomationActionAttempt> {
    attempt.retryCount += 1;
    attempt.status = 'RETRYING';
    attempt.startedAt = new Date().toISOString();

    const handler = getHandler(attempt.actionType);
    if (!handler) {
      attempt.status = 'FAILED';
      attempt.error = { code: 'HANDLER_NOT_FOUND', message: `No handler for ${attempt.actionType}` };
      attempt.completedAt = new Date().toISOString();
      return attempt;
    }

    try {
      const result = await handler.execute({
        actionId: attempt.actionId,
        config: attempt.config,
        idempotencyKey: attempt.idempotencyKey,
        societyId: context.societyId,
        actorId: context.actorId,
        correlationId: context.correlationId,
      });

      if (result.success) {
        attempt.status = 'COMPLETED';
        attempt.result = result.result;
      } else {
        attempt.status = 'FAILED';
        attempt.error = result.error || { code: 'RETRY_FAILED', message: 'Retry execution failed' };
      }
    } catch (error) {
      attempt.status = 'FAILED';
      attempt.error = {
        code: 'RETRY_ERROR',
        message: error instanceof Error ? error.message : 'Retry failed',
      };
    }

    attempt.completedAt = new Date().toISOString();
    return attempt;
  },

  getDomainService(actionType: AutomationActionType): string {
    const serviceMap: Record<AutomationActionType, string> = {
      'SEND_NOTIFICATION': 'NotificationEngine',
      'CREATE_NOTICE_DRAFT': 'NoticeService',
      'CREATE_HELPDESK_ESCALATION': 'HelpdeskService',
      'CREATE_WORK_ORDER_REQUEST': 'WorkOrderService',
      'CREATE_APPROVAL_REQUEST': 'ApprovalService',
      'REQUEST_HARDWARE_COMMAND': 'HardwareCommandService',
      'REQUEST_AI_ANALYSIS': 'AiOrchestrationService',
      'AI_DRAFT': 'AiOrchestrationService',
      'HUMAN_APPROVAL_REQUEST': 'ApprovalService',
    };
    return serviceMap[actionType] || 'UnknownService';
  },

  getDomainMethod(actionType: AutomationActionType): string {
    const methodMap: Record<AutomationActionType, string> = {
      'SEND_NOTIFICATION': 'sendNotification',
      'CREATE_NOTICE_DRAFT': 'createDraft',
      'CREATE_HELPDESK_ESCALATION': 'escalateComplaint',
      'CREATE_WORK_ORDER_REQUEST': 'createWorkOrder',
      'CREATE_APPROVAL_REQUEST': 'createApprovalRequest',
      'REQUEST_HARDWARE_COMMAND': 'issueCommand',
      'REQUEST_AI_ANALYSIS': 'requestAnalysis',
      'AI_DRAFT': 'generateDraft',
      'HUMAN_APPROVAL_REQUEST': 'requestApproval',
    };
    return methodMap[actionType] || 'execute';
  },

  isRetryableError(errorCode: string): boolean {
    const retryableCodes = [
      'TIMEOUT',
      'NETWORK_ERROR',
      'SERVICE_UNAVAILABLE',
      'RATE_LIMITED',
      'PROVIDER_TIMEOUT',
      'TEMPORARY_FAILURE',
    ];
    return retryableCodes.includes(errorCode);
  },

  isPermanentError(errorCode: string): boolean {
    const permanentCodes = [
      'VALIDATION_ERROR',
      'PERMISSION_DENIED',
      'NOT_FOUND',
      'INVALID_CONFIG',
      'SCHEMA_VIOLATION',
      'UNAUTHORIZED',
      'FORBIDDEN',
    ];
    return permanentCodes.includes(errorCode);
  },
};