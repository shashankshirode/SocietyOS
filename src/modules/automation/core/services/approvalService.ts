import { AutomationApproval, AutomationApprovalStatus } from '../types';

interface ApprovalRequest {
  id: string;
  executionId: string;
  actionId: string;
  approverRoles: string[];
  requiredApprovals: number;
  currentApprovals: number;
  status: AutomationApprovalStatus;
  requestedAt: string;
  expiresAt: string;
  decidedAt?: string;
  decidedBy?: string;
  rejectionReason?: string;
}

const approvalStore: Map<string, ApprovalRequest> = new Map();

function generateId(): string {
  return `appr_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function getNow(): string {
  return new Date().toISOString();
}

function toAutomationApproval(approval: ApprovalRequest): AutomationApproval {
  return {
    id: approval.id,
    executionId: approval.executionId,
    actionId: approval.actionId,
    approverRoles: approval.approverRoles,
    requiredApprovals: approval.requiredApprovals,
    currentApprovals: approval.currentApprovals,
    status: approval.status,
    requestedAt: approval.requestedAt,
    expiresAt: approval.expiresAt,
    ...(approval.decidedAt ? { decidedAt: approval.decidedAt } : {}),
    ...(approval.decidedBy ? { decidedBy: approval.decidedBy } : {}),
    ...(approval.rejectionReason ? { rejectionReason: approval.rejectionReason } : {}),
  };
}

export const approvalService = {
  createApproval(
    executionId: string,
    actionId: string,
    approverRoles: string[],
    requiredApprovals: number,
    timeoutMinutes: number
  ): AutomationApproval {
    const now = getNow();
    const approval: ApprovalRequest = {
      id: generateId(),
      executionId,
      actionId,
      approverRoles,
      requiredApprovals,
      currentApprovals: 0,
      status: 'PENDING',
      requestedAt: now,
      expiresAt: new Date(Date.now() + timeoutMinutes * 60 * 1000).toISOString(),
    };
    approvalStore.set(approval.id, approval);

    return toAutomationApproval(approval);
  },

  getApproval(approvalId: string): AutomationApproval | undefined {
    const approval = approvalStore.get(approvalId);
    if (!approval) return undefined;
    return toAutomationApproval(approval);
  },

  getApprovalsByExecution(executionId: string): AutomationApproval[] {
    return Array.from(approvalStore.values())
      .filter(a => a.executionId === executionId)
      .map(toAutomationApproval);
  },

  getPendingApprovalsForUser(userId: string, userRoles: string[]): AutomationApproval[] {
    return Array.from(approvalStore.values())
      .filter(a => a.status === 'PENDING' && a.approverRoles.some(r => userRoles.includes(r)))
      .map(toAutomationApproval);
  },

  approve(approvalId: string, approverId: string, approverRole: string): AutomationApproval | null {
    const approval = approvalStore.get(approvalId);
    if (!approval) return null;
    if (approval.status !== 'PENDING') return this.getApproval(approvalId)!;

    if (!approval.approverRoles.includes(approverRole)) {
      throw new Error('UNAUTHORIZED_APPROVER');
    }

    approval.currentApprovals += 1;
    if (approval.currentApprovals >= approval.requiredApprovals) {
      approval.status = 'APPROVED';
      approval.decidedAt = getNow();
      approval.decidedBy = approverId;
    }

    approvalStore.set(approvalId, approval);
    return this.getApproval(approvalId)!;
  },

  reject(approvalId: string, approverId: string, approverRole: string, reason: string): AutomationApproval | null {
    const approval = approvalStore.get(approvalId);
    if (!approval) return null;
    if (approval.status !== 'PENDING') return this.getApproval(approvalId)!;

    if (!approval.approverRoles.includes(approverRole)) {
      throw new Error('UNAUTHORIZED_APPROVER');
    }

    approval.status = 'REJECTED';
    approval.decidedAt = getNow();
    approval.decidedBy = approverId;
    approval.rejectionReason = reason;

    approvalStore.set(approvalId, approval);
    return this.getApproval(approvalId)!;
  },

  checkExpired(): AutomationApproval[] {
    const now = new Date();
    const expired: AutomationApproval[] = [];

    approvalStore.forEach((approval, id) => {
      if (approval.status === 'PENDING' && new Date(approval.expiresAt) <= now) {
        approval.status = 'EXPIRED';
        approval.decidedAt = getNow();
        approval.decidedBy = 'SYSTEM_TIMEOUT';
        approval.rejectionReason = 'Approval timeout expired';
        approvalStore.set(id, approval);
        expired.push(this.getApproval(id)!);
      }
    });

    return expired;
  },

  getAllPending(): AutomationApproval[] {
    return Array.from(approvalStore.values())
      .filter(a => a.status === 'PENDING')
      .map(toAutomationApproval);
  },

  getAllApprovals(): AutomationApproval[] {
    return Array.from(approvalStore.values()).map(toAutomationApproval);
  },

  cancelApproval(approvalId: string): boolean {
    const approval = approvalStore.get(approvalId);
    if (!approval || approval.status !== 'PENDING') return false;
    approvalStore.delete(approvalId);
    return true;
  },

  cleanup(): void {
    const now = new Date();
    const toDelete: string[] = [];
    approvalStore.forEach((approval, id) => {
      if (new Date(approval.expiresAt) < new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)) {
        toDelete.push(id);
      }
    });
    toDelete.forEach(id => approvalStore.delete(id));
  },
};