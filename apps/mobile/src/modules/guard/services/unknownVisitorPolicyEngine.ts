import { mockStore } from '../../../core/mockStore/mockStore';
import { createIdempotencyKey } from '../../../core/api/idempotency';
import { auditService, createAuditEntry } from '../../../core/audit';
import type {
  VisitorApprovalRequest,
  VisitorApprovalStatus,
  VisitorEscalationStatus,
  VisitorType,
  ApprovalSource,
  UnknownVisitorPolicy,
  UnknownVisitorPolicyAction,
} from '../../../shared/types/visitorPhase8.types';
import type { Absent } from '../../../shared/types/absence.types';
import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../core/repositories/repository.types';

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export type { UnknownVisitorPolicy, UnknownVisitorPolicyAction };

export type UnknownVisitorContext = {
  visitorId?: string;
  visitorName: string;
  visitorPhone: string;
  visitorType: VisitorType;
  flatNumber: string;
  unitId: string;
  gateId: string;
  gateName: string;
  guardId: string;
  guardName: string;
  societyId: string;
  hasPreApproval: boolean;
  preApprovalExpired?: boolean;
  watchlistMatch?: boolean;
};

export type PolicyEvaluationResult = {
  action: UnknownVisitorPolicyAction;
  policyId: string;
  waitTimeoutMs: number;
  escalationTargets: ('SECURITY' | 'SUPERVISOR' | 'COMMITTEE')[];
  alternateApproverRoles: string[];
  notifyOnAttempt: boolean;
  autoDenyAfterTimeout: boolean;
  reason: string;
};

const DEFAULT_POLICY: Omit<UnknownVisitorPolicy, 'id' | 'societyId' | 'createdAt' | 'updatedAt' | 'createdBy'> = {
  visitorType: 'ALL',
  defaultAction: 'WAIT',
  waitTimeoutMinutes: 5,
  escalationTargets: ['SECURITY'],
  alternateApproverRoles: ['SECURITY_SUPERVISOR', 'SOCIETY_ADMIN'],
  notifyOnAttempt: true,
  autoDenyAfterTimeout: true,
};

export const unknownVisitorPolicyEngine = {
  async getPolicy(societyId: string, visitorType?: VisitorType): Promise<UnknownVisitorPolicy | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const state = mockStore.getState();
        if (!state.unknownVisitorPolicies) {
          state.unknownVisitorPolicies = [];
        }
        let policy = state.unknownVisitorPolicies.find(p => p.societyId === societyId && (p.visitorType === visitorType || p.visitorType === 'ALL'));
        if (!policy) {
          policy = {
            id: generateId('policy'),
            societyId,
            ...DEFAULT_POLICY,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'SYSTEM',
          };
          state.unknownVisitorPolicies.push(policy);
        }
        resolve(policy);
      }, 200);
    });
  },

  async createOrUpdatePolicy(
    societyId: string,
    payload: Partial<UnknownVisitorPolicy> & { visitorType: VisitorType | 'ALL' },
    createdBy: string
  ): Promise<UnknownVisitorPolicy> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const state = mockStore.getState();
        if (!state.unknownVisitorPolicies) {
          state.unknownVisitorPolicies = [];
        }
        let policy = state.unknownVisitorPolicies.find(p => p.societyId === societyId && p.visitorType === payload.visitorType);
        const now = new Date().toISOString();
        
        if (policy) {
          policy = {
            ...policy,
            ...payload,
            updatedAt: now,
          };
        } else {
          policy = {
            id: generateId('policy'),
            societyId,
            ...DEFAULT_POLICY,
            ...payload,
            createdAt: now,
            updatedAt: now,
            createdBy,
          };
          state.unknownVisitorPolicies.push(policy);
        }
        
        mockStore.notify();
        resolve(policy);
      }, 400);
    });
  },

  async evaluatePolicy(context: UnknownVisitorContext): Promise<PolicyEvaluationResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const policies = mockStore.getState().unknownVisitorPolicies || [];
        const policy = policies.find(p => 
          p.societyId === context.societyId && 
          (p.visitorType === context.visitorType || p.visitorType === 'ALL')
        ) || {
          ...DEFAULT_POLICY,
          id: 'default',
          societyId: context.societyId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'SYSTEM',
        };

        let action = policy.defaultAction;
        let reason = `Default policy action: ${policy.defaultAction}`;

        if (context.watchlistMatch) {
          action = 'DENY';
          reason = 'Visitor matched watchlist - automatic denial per policy';
        } else if (context.preApprovalExpired) {
          action = 'ESCALATE';
          reason = 'Pre-approval expired - escalation required';
        } else if (!context.hasPreApproval) {
          action = policy.defaultAction;
          reason = `No pre-approval found - applying default policy: ${policy.defaultAction}`;
        }

        const waitMinutes = policy.waitTimeoutMinutes ?? 5;
        const waitTimeoutMs = waitMinutes * 60 * 1000;
        const escalationTargets = (policy.escalationTargets as ('SECURITY' | 'SUPERVISOR' | 'COMMITTEE')[]) ?? ['SECURITY'];
        const alternateApproverRoles = policy.alternateApproverRoles ?? ['SECURITY_SUPERVISOR', 'SOCIETY_ADMIN'];
        const notifyOnAttempt = policy.notifyOnAttempt ?? true;
        const autoDenyAfterTimeout = policy.autoDenyAfterTimeout ?? true;

        resolve({
          action,
          policyId: policy.id,
          waitTimeoutMs,
          escalationTargets,
          alternateApproverRoles,
          notifyOnAttempt,
          autoDenyAfterTimeout,
          reason,
        });
      }, 300);
    });
  },

  async handlePolicyTimeout(approvalRequestId: string): Promise<{
    request: VisitorApprovalRequest | null;
    actionTaken: 'AUTO_DENIED' | 'ESCALATED' | 'NONE';
  }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const requests = mockStore.getState().visitorApprovalRequests || [];
        const index = requests.findIndex(r => r.id === approvalRequestId);
        
        if (index === -1) {
          reject(new Error('Approval request not found'));
          return;
        }

        const request = requests[index];
        if (!request) {
          reject(new Error('Approval request not found'));
          return;
        }
        
        if (request.status !== 'PENDING') {
          resolve({ request: null, actionTaken: 'NONE' });
          return;
        }

        const policy = mockStore.getState().unknownVisitorPolicies?.find(
          p => p.societyId === request.societyId && (p.visitorType === request.visitorType || p.visitorType === 'ALL')
        ) || { ...DEFAULT_POLICY, autoDenyAfterTimeout: true };

        let actionTaken: 'AUTO_DENIED' | 'ESCALATED' | 'NONE' = 'NONE';
        const now = new Date().toISOString();
        const autoDeny = policy.autoDenyAfterTimeout ?? true;
        const targets = (policy.escalationTargets as ('SECURITY' | 'SUPERVISOR' | 'COMMITTEE')[]) ?? [];

        if (autoDeny) {
          requests[index] = {
            ...request,
            status: 'DENIED',
            respondedAtIso: now,
            respondedBy: 'SYSTEM_TIMEOUT',
            respondedByRole: 'SYSTEM',
            decision: 'DENY',
            denialReason: 'Resident did not respond within allowed time - auto-denied per policy',
            statusChangedAtIso: now,
          };
          actionTaken = 'AUTO_DENIED';
        } else if (targets.length > 0) {
          requests[index] = {
            ...request,
            status: 'ESCALATED',
            escalationStatus: targets[0] === 'SECURITY' ? 'ESCALATED_TO_SECURITY' : 
              targets[0] === 'SUPERVISOR' ? 'ESCALATED_TO_SUPERVISOR' : 'ESCALATED_TO_COMMITTEE',
            escalationReason: 'Resident did not respond within allowed time - escalated per policy',
            escalatedAtIso: now,
            escalatedBy: 'SYSTEM_TIMEOUT',
            statusChangedAtIso: now,
          };
          actionTaken = 'ESCALATED';
        }

        mockStore.getState().visitorApprovalRequests = requests;
        mockStore.notify();

        const updatedRequest = requests[index];

        createAuditEntry({
          actorUserId: 'SYSTEM_TIMEOUT',
          actorType: 'SYSTEM',
          societyId: request.societyId ?? '',
          action: actionTaken === 'AUTO_DENIED' ? 'VISITOR_AUTO_DENIED_TIMEOUT' : 'VISITOR_ESCALATED_TIMEOUT',
          entityType: 'VISITOR_APPROVAL_REQUEST',
          entityId: approvalRequestId,
          newState: { status: updatedRequest?.status, actionTaken },
          idempotencyKey: `timeout_${approvalRequestId}`,
          source: 'SYSTEM_JOB',
          outcome: 'SUCCESS',
        });

        resolve({ request: updatedRequest ?? null, actionTaken });
      }, 500);
    });
  },

  async getAllPolicies(societyId: string): Promise<UnknownVisitorPolicy[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const policies = mockStore.getState().unknownVisitorPolicies || [];
        const filtered = policies.filter(p => p.societyId === societyId);
        resolve(filtered);
      }, 200);
    });
  },

  async deletePolicy(policyId: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const policies = mockStore.getState().unknownVisitorPolicies || [];
        const index = policies.findIndex(p => p.id === policyId);
        if (index === -1) {
          resolve(false);
          return;
        }
        policies.splice(index, 1);
        mockStore.notify();
        resolve(true);
      }, 300);
    });
  },
};

export default unknownVisitorPolicyEngine;