import { mockStore } from '../../../core/mockStore/mockStore';
import type { VisitorApprovalRequest, VisitorApprovalStatus, VisitorEscalationStatus, VisitorType, } from '../../../shared/types/visitorPhase8.types';
import type { Absent } from '../../../shared/types/absence.types';
import { createIdempotencyKey } from '../../../core/api/idempotency';
import { auditService, createAuditEntry } from '../../../core/audit';
import { mockStore } from '../../../core/mockStore/mockStore';
import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../core/repositories/repository.types';
import { unknownVisitorPolicyEngine, type PolicyEvaluationResult } from './unknownVisitorPolicyEngine';
import { visitorNotificationService } from './visitorNotificationService';
import { visitorStateMachine } from './visitorStateMachine';
import { gateIdempotencyService } from './gateIdempotencyService';
import { format } from 'date-fns';
const withMockDelay = <T>(data: T, ms = 500): Promise<T> => new Promise((resolve) => setTimeout(() => resolve(data), ms));
function generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
export const visitorApprovalService = {
    async createApprovalRequest(visitorId: string, visitorName: string, visitorPhone: string, visitorType: string, flatNumber: string, unitId: string, gateId: string, gateName: string, guardId: string, guardName: string, requestType: 'WALK_IN' | 'PRE_APPROVAL_EXPIRED' | 'PASS_EXPIRED' | 'UNKNOWN_VISITOR' | 'EMERGENCY', societyId: string, expiresInMinutes = 10, hasPreApproval = false, preApprovalExpired = false, watchlistMatch = false, idempotencyKey?: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            setTimeout(async () => {
                try {
                    const key = idempotencyKey || `appr_${visitorId}_${gateId}_${Date.now()}`;
                    const idempotencyResult = await gateIdempotencyService.checkIdempotency(key, societyId);
                    if (idempotencyResult.exists && idempotencyResult.record?.status === 'COMPLETED') {
                        resolve(idempotencyResult.record.responsePayload);
                        return;
                    }
                    const now = new Date().toISOString();
                    let policyResult: PolicyEvaluationResult | null = null;
                    let finalExpiresInMinutes = expiresInMinutes;
                    if (requestType === 'UNKNOWN_VISITOR' || requestType === 'WALK_IN') {
                        policyResult = await unknownVisitorPolicyEngine.evaluatePolicy({
                            visitorId,
                            visitorName,
                            visitorPhone,
                            visitorType: visitorType as any,
                            flatNumber,
                            unitId,
                            gateId,
                            gateName,
                            guardId,
                            guardName,
                            societyId,
                            hasPreApproval,
                            preApprovalExpired,
                            watchlistMatch,
                        });
                        finalExpiresInMinutes = Math.ceil(policyResult.waitTimeoutMs / 60000);
                        if (policyResult.action === 'DENY') {
                            const deniedRequest = {
                                id: generateId('appr'),
                                visitorId,
                                visitorName,
                                visitorPhone,
                                visitorType: visitorType,
                                flatNumber,
                                unitId,
                                gateId,
                                gateName,
                                guardId,
                                guardName,
                                requestType,
                                status: 'DENIED',
                                requestedAtIso: now,
                                respondedAtIso: now,
                                respondedBy: 'SYSTEM_POLICY',
                                respondedByRole: 'SYSTEM',
                                decision: 'DENY',
                                denialReason: policyResult.reason,
                                escalationReason: undefined,
                                escalationStatus: 'NOT_ESCALATED',
                                escalatedAtIso: undefined,
                                escalatedBy: undefined,
                                expiresAtIso: now,
                                metadata: { policyId: policyResult.policyId, policyAction: policyResult.action },
                                societyId,
                            };
                            mockStore.getState().visitorApprovalRequests?.push(deniedRequest);
                            mockStore.notify();
                            await gateIdempotencyService.completeIdempotency(key, societyId, deniedRequest.id, deniedRequest);
                            createAuditEntry({
                                actorUserId: 'SYSTEM_POLICY',
                                actorType: 'SYSTEM',
                                societyId,
                                action: 'VISITOR_AUTO_DENIED_POLICY',
                                entityType: 'VISITOR_APPROVAL_REQUEST',
                                entityId: deniedRequest.id,
                                newState: { status: 'DENIED', reason: policyResult.reason },
                                idempotencyKey: `appr_${deniedRequest.id}`,
                                source: 'GATE_DEVICE',
                                outcome: 'SUCCESS',
                            });
                            resolve(deniedRequest);
                            return;
                        }
                    }
                    const expiresAtIso = new Date(Date.now() + finalExpiresInMinutes * 60 * 1000).toISOString();
                    const request = {
                        id: generateId('appr'),
                        visitorId,
                        visitorName,
                        visitorPhone,
                        visitorType: visitorType,
                        flatNumber,
                        unitId,
                        gateId,
                        gateName,
                        guardId,
                        guardName,
                        requestType,
                        status: 'PENDING',
                        requestedAtIso: now,
                        respondedAtIso: undefined,
                        respondedBy: undefined,
                        respondedByRole: undefined,
                        decision: undefined,
                        denialReason: undefined,
                        escalationReason: undefined,
                        escalationStatus: 'NOT_ESCALATED',
                        escalatedAtIso: undefined,
                        escalatedBy: undefined,
                        expiresAtIso,
                        metadata: policyResult ? {
                            policyId: policyResult.policyId,
                            policyAction: policyResult.action,
                            waitTimeoutMs: policyResult.waitTimeoutMs,
                            escalationTargets: policyResult.escalationTargets,
                            alternateApproverRoles: policyResult.alternateApproverRoles,
                            autoDenyAfterTimeout: policyResult.autoDenyAfterTimeout,
                        } : {},
                        societyId,
                    };
                    mockStore.getState().visitorApprovalRequests?.push(request);
                    mockStore.notify();
                    await gateIdempotencyService.completeIdempotency(key, societyId, request.id, request);
                    createAuditEntry({
                        actorUserId: guardId,
                        actorType: 'GUARD',
                        societyId,
                        action: 'CREATE_VISITOR_APPROVAL_REQUEST',
                        entityType: 'VISITOR_APPROVAL_REQUEST',
                        entityId: request.id,
                        newState: { status: 'PENDING', visitorName, flatNumber, requestType, policyAction: policyResult?.action },
                        idempotencyKey: `appr_${request.id}`,
                        source: 'GATE_DEVICE',
                        outcome: 'SUCCESS',
                    });
                    if (policyResult?.autoDenyAfterTimeout) {
                        setTimeout(() => {
                            void unknownVisitorPolicyEngine.handlePolicyTimeout(request.id);
                        }, policyResult.waitTimeoutMs);
                    }
                    const residentUserIds = mockStore.getState().residents
                        ?.filter(r => r.flatNumber === flatNumber)
                        .map(r => r.id) || [];
                    if (residentUserIds.length > 0) {
                        await visitorNotificationService.sendApprovalRequested(request, residentUserIds, societyId);
                    }
                    resolve(request);
                }
                catch (error) {
                    reject(error);
                }
            }, 500);
        });
    },
    async getApprovalRequest(requestId: string): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const requests = mockStore.getState().visitorApprovalRequests || [];
                const request = requests.find((r) => r.id === requestId);
                resolve(request);
            }, 300);
        });
    },
    async getPendingApprovalsForUnit(unitId: string): Promise<any[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const requests = mockStore.getState().visitorApprovalRequests || [];
                const filtered = requests.filter((r) => r.unitId === unitId && r.status === 'PENDING');
                resolve(filtered);
            }, 300);
        });
    },
    async getPendingApprovalsForGuard(guardId: string): Promise<any[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const requests = mockStore.getState().visitorApprovalRequests || [];
                const filtered = requests.filter((r) => r.guardId === guardId && r.status === 'PENDING');
                resolve(filtered);
            }, 300);
        });
    },
    async respondToApproval(requestId: string, action: 'APPROVE' | 'DENY', residentId: string, residentRole: string, denialReason?: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            setTimeout(async () => {
                try {
                    const requests = mockStore.getState().visitorApprovalRequests || [];
                    const index = requests.findIndex((r) => r.id === requestId);
                    if (index === -1) {
                        reject(new Error('Approval request not found'));
                        return;
                    }
                    const request = requests[index];
                    if (request.status !== 'PENDING') {
                        reject(new Error('Request already processed'));
                        return;
                    }
                    const now = new Date().toISOString();
                    const updated = {
                        ...requests[index],
                        status: action === 'APPROVE' ? 'APPROVED' : 'DENIED',
                        respondedAtIso: now,
                        respondedBy: residentId,
                        respondedByRole: residentRole,
                        decision: action === 'APPROVE' ? 'APPROVE' : 'DENY',
                        denialReason: action === 'DENY' ? denialReason : undefined,
                        statusChangedAtIso: now,
                    };
                    mockStore.getState().visitorApprovalRequests[index] = updated;
                    mockStore.notify();
                    if (action === 'APPROVE') {
                        const visitors = mockStore.getState().visitors || [];
                        const visitorIndex = visitors.findIndex((v) => v.id === requests[index].visitorId);
                        if (visitorIndex !== -1) {
                            const visitor = visitors[visitorIndex];
                            if (visitorStateMachine.canTransitionVisitorStatus(visitor.status as any, 'APPROVED')) {
                                const visitorsUpdated = mockStore.getState().visitors?.map((v) => v.id === requests[index].visitorId
                                    ? { ...v, status: 'APPROVED', approvalStatus: 'APPROVED', approvalSource: 'RESIDENT', approvedAtIso: new Date().toISOString(), approvedBy: residentId }
                                    : v);
                                mockStore.getState().visitors = visitorsUpdated;
                                mockStore.notify();
                                const residentUserIds = mockStore.getState().residents
                                    ?.filter(r => r.flatNumber === visitor.flatNumber)
                                    .map(r => r.id) || [];
                                if (residentUserIds.length > 0) {
                                    await visitorNotificationService.sendVisitorApproved(request, residentUserIds, request.societyId);
                                }
                            }
                        }
                    }
                    else if (action === 'DENY') {
                        const residentUserIds = mockStore.getState().residents
                            ?.filter(r => r.flatNumber === request.flatNumber)
                            .map(r => r.id) || [];
                        if (residentUserIds.length > 0) {
                            await visitorNotificationService.sendVisitorDenied(request, denialReason || '', residentUserIds, request.societyId);
                        }
                    }
                    createAuditEntry({
                        actorUserId: residentId,
                        actorType: 'RESIDENT',
                        societyId: requests[index].societyId,
                        action: action === 'APPROVE' ? 'VISITOR_APPROVED' : 'VISITOR_DENIED',
                        entityType: 'VISITOR_APPROVAL_REQUEST',
                        entityId: requestId,
                        newState: { status: action === 'APPROVE' ? 'APPROVED' : 'DENIED', denialReason },
                        idempotencyKey: `appr_${requestId}`,
                        source: 'MOBILE',
                        outcome: 'SUCCESS',
                    });
                    resolve(updated);
                }
                catch (error) {
                    reject(error);
                }
            }, 500);
        });
    },
    async escalateRequest(requestId: string, escalatedBy: string, escalationReason: string, escalationStatus: 'ESCALATED_TO_SECURITY' | 'ESCALATED_TO_SUPERVISOR' | 'ESCALATED_TO_COMMITTEE'): Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const requests = mockStore.getState().visitorApprovalRequests || [];
                const index = requests.findIndex((r) => r.id === requestId);
                if (index === -1) {
                    reject(new Error('Approval request not found'));
                    return;
                }
                const request = requests[index];
                if (!visitorStateMachine.canTransitionVisitorEscalationStatus(request.escalationStatus as any, escalationStatus)) {
                    reject(new Error(`Invalid escalation transition from ${request.escalationStatus} to ${escalationStatus}`));
                    return;
                }
                const now = new Date().toISOString();
                const updated = {
                    ...requests[index],
                    escalationStatus: escalationStatus,
                    escalationReason,
                    escalatedAtIso: now,
                    escalatedBy,
                    status: 'ESCALATED',
                    statusChangedAtIso: now,
                };
                mockStore.getState().visitorApprovalRequests[index] = updated;
                mockStore.notify();
                createAuditEntry({
                    actorUserId: escalatedBy,
                    actorType: 'RESIDENT',
                    societyId: requests[index].societyId,
                    action: 'VISITOR_APPROVAL_ESCALATED',
                    entityType: 'VISITOR_APPROVAL_REQUEST',
                    entityId: requestId,
                    previousState: { escalationStatus: request.escalationStatus },
                    newState: { escalationStatus, escalationReason },
                    idempotencyKey: `escalate_${requestId}`,
                    source: 'MOBILE',
                    outcome: 'SUCCESS',
                });
                resolve(updated);
            }, 400);
        });
    },
    async getPendingApprovalsForUnit(unitId: string): Promise<any[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const requests = mockStore.getState().visitorApprovalRequests || [];
                const filtered = requests.filter((r) => r.unitId === unitId && r.status === 'PENDING');
                resolve(filtered);
            }, 300);
        });
    },
    async getPendingApprovalsForGuard(guardId: string): Promise<any[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const requests = mockStore.getState().visitorApprovalRequests || [];
                const filtered = requests.filter((r) => r.guardId === guardId && r.status === 'PENDING');
                resolve(filtered);
            }, 300);
        });
    },
    async getApprovalHistory(visitorId: string): Promise<any[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const requests = mockStore.getState().visitorApprovalRequests || [];
                const filtered = requests.filter((r) => r.visitorId === visitorId);
                resolve(filtered.sort((a, b) => new Date(b.requestedAtIso).getTime() - new Date(a.requestedAtIso).getTime()));
            }, 300);
        });
    },
    async getApprovalStats(societyId: string): Promise<{
        pending: number;
        approved: number;
        denied: number;
        escalated: number;
        total: number;
    }> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const requests = mockStore.getState().visitorApprovalRequests || [];
                const filtered = requests.filter((r) => r.societyId === societyId);
                resolve({
                    pending: filtered.filter((r) => r.status === 'PENDING').length,
                    approved: filtered.filter((r) => r.status === 'APPROVED').length,
                    denied: filtered.filter((r) => r.status === 'DENIED').length,
                    escalated: filtered.filter((r) => r.status === 'ESCALATED').length,
                    total: filtered.length,
                });
            }, 300);
        });
    },
};


