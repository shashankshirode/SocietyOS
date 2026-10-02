import { mockStore } from '../../../core/mockStore/mockStore';
import type {
  VisitorApprovalRequest,
  VisitorApprovalStatus,
  VisitorEscalationStatus,
  VisitorCategory,
  ApprovalSource,
  VisitorPass,
} from '../../../../shared/types/visitorPhase5';
import { unifiedVisitorStateMachine } from './unifiedVisitorStateMachine';
import { auditService, createAuditEntry } from '../../../core/audit';
import { createIdempotencyKey } from '../../../core/api/idempotency';

export interface WalkInApprovalRequestInput {
  readonly visitorName: string;
  readonly visitorPhone: string;
  readonly visitorCategory: VisitorCategory;
  readonly flatNumber: string;
  readonly unitId: string;
  readonly gateId: string;
  readonly gateName: string;
  readonly guardId: string;
  readonly guardName: string;
  readonly societyId: string;
  readonly purpose?: string;
  readonly vehicleRegistration?: string;
  readonly vehicleType?: string;
}

export interface ApprovalDecisionInput {
  readonly requestId: string;
  readonly action: 'APPROVE' | 'DENY';
  readonly residentId: string;
  readonly residentRole: 'OWNER' | 'TENANT' | 'CO_OWNER' | 'FAMILY_MEMBER';
  readonly denialReason?: string;
}

export interface EscalationInput {
  readonly requestId: string;
  readonly escalatedBy: string;
  readonly escalationReason: string;
  readonly escalationStatus: 'ESCALATED_TO_SECURITY' | 'ESCALATED_TO_SUPERVISOR' | 'ESCALATED_TO_COMMITTEE';
}

export interface WalkInApprovalResult {
  readonly success: boolean;
  readonly request?: VisitorApprovalRequest;
  readonly errorCode?: string;
  readonly errorMessage?: string;
  readonly passId?: string;
}

export class WalkInApprovalService {
  private static instance: WalkInApprovalService;

  static getInstance(): WalkInApprovalService {
    if (!WalkInApprovalService.instance) {
      WalkInApprovalService.instance = new WalkInApprovalService();
    }
    return WalkInApprovalService.instance;
  }

  async createWalkInApprovalRequest(
    input: WalkInApprovalRequestInput,
    idempotencyKey?: string
  ): Promise<WalkInApprovalResult> {
    const key = idempotencyKey || createIdempotencyKey(`walkin-${input.gateId}-${input.visitorPhone}-${Date.now()}`);

    const existingRequests = mockStore.getState().visitorApprovalRequests || [];
    const duplicate = existingRequests.find(r =>
      r.visitorPhone === input.visitorPhone &&
      r.flatNumber === input.flatNumber &&
      r.gateId === input.gateId &&
      r.status === 'PENDING' &&
      new Date(r.requestedAtIso) > new Date(Date.now() - 10 * 60 * 1000)
    );

    if (duplicate) {
      return { success: false, errorCode: 'DUPLICATE_REQUEST', errorMessage: 'A pending approval request already exists for this visitor' };
    }

    const residents = mockStore.getState().residents || [];
    const targetResidents = residents.filter(r =>
      r.flatNumber === input.flatNumber &&
      r.societyId === input.societyId &&
      r.status === 'ACTIVE'
    );

    if (targetResidents.length === 0) {
      return { success: false, errorCode: 'NO_ELIGIBLE_RESIDENT', errorMessage: 'No active residents found for this unit' };
    }

    const request: VisitorApprovalRequest = {
      requestId: `appr-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      visitorId: `person-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      visitorName: input.visitorName,
      visitorPhone: input.visitorPhone,
      visitorCategory: input.visitorCategory,
      flatNumber: input.flatNumber,
      unitId: input.unitId,
      gateId: input.gateId,
      gateName: input.gateName,
      guardId: input.guardId,
      guardName: input.guardName,
      requestType: 'WALK_IN',
      status: 'PENDING',
      requestedAtIso: new Date().toISOString(),
      expiresAtIso: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      respondedAtIso: undefined,
      respondedBy: undefined,
      respondedByRole: undefined,
      decision: undefined,
      denialReason: undefined,
      escalationStatus: 'NOT_ESCALATED',
      escalationReason: undefined,
      escalatedAtIso: undefined,
      escalatedBy: undefined,
      policyId: undefined,
      policyAction: undefined,
      autoDenyAfterTimeout: true,
      waitTimeoutMs: 10 * 60 * 1000,
      escalationTargets: ['security_supervisor', 'committee_chair'],
      alternateApproverRoles: ['OWNER', 'TENANT', 'CO_OWNER'],
      watchlistMatch: false,
      hasPreApproval: false,
      preApprovalExpired: false,
      dataVersion: 1,
      societyId: input.societyId,
      unitId: input.unitId,
    };

    mockStore.getState().visitorApprovalRequests = [...(mockStore.getState().visitorApprovalRequests || []), request];
    mockStore.notify();

    createAuditEntry({
      actorUserId: input.guardId,
      actorType: 'GUARD',
      societyId: input.societyId,
      action: 'CREATE_WALK_IN_APPROVAL_REQUEST',
      entityType: 'VisitorApprovalRequest',
      entityId: request.requestId,
      newState: { status: 'PENDING', visitorName: input.visitorName, flatNumber: input.flatNumber, requestType: 'WALK_IN' },
      idempotencyKey: key,
      source: 'GATE_DEVICE',
      outcome: 'SUCCESS',
    });

    return { success: true, request };
  }

  async getPendingApprovalsForUnit(unitId: string): Promise<VisitorApprovalRequest[]> {
    const requests = mockStore.getState().visitorApprovalRequests || [];
    return requests.filter(r => r.unitId === unitId && r.status === 'PENDING');
  }

  async getPendingApprovalsForGuard(guardId: string): Promise<VisitorApprovalRequest[]> {
    const requests = mockStore.getState().visitorApprovalRequests || [];
    return requests.filter(r => r.guardId === guardId && r.status === 'PENDING');
  }

  async respondToApproval(
    input: ApprovalDecisionInput
  ): Promise<WalkInApprovalResult> {
    const requests = mockStore.getState().visitorApprovalRequests || [];
    const index = requests.findIndex(r => r.requestId === input.requestId);

    if (index === -1) {
      return { success: false, errorCode: 'REQUEST_NOT_FOUND', errorMessage: 'Approval request not found' };
    }

    const request = requests[index];

    if (request.status !== 'PENDING') {
      return { success: false, errorCode: 'REQUEST_ALREADY_PROCESSED', errorMessage: 'Request already processed' };
    }

    const residents = mockStore.getState().residents || [];
    const resident = residents.find(r =>
      r.id === input.residentId &&
      r.flatNumber === request.flatNumber &&
      r.societyId === request.societyId
    );

    if (!resident) {
      return { success: false, errorCode: 'RESIDENT_NOT_AUTHORIZED', errorMessage: 'Resident not authorized for this unit' };
    }

    if (!unifiedVisitorStateMachine.canTransitionVisitorApprovalStatus(request.status, input.action === 'APPROVE' ? 'APPROVED' : 'DENIED')) {
      return { success: false, errorCode: 'INVALID_TRANSITION', errorMessage: 'Invalid approval transition' };
    }

    const now = new Date().toISOString();
    const updatedRequest: VisitorApprovalRequest = {
      ...request,
      status: input.action === 'APPROVE' ? 'APPROVED' : 'DENIED',
      respondedAtIso: now,
      respondedBy: input.residentId,
      respondedByRole: input.residentRole,
      decision: input.action === 'APPROVE' ? 'APPROVE' : 'DENY',
      denialReason: input.action === 'DENY' ? input.denialReason : undefined,
      dataVersion: request.dataVersion + 1,
    };

    mockStore.getState().visitorApprovalRequests[index] = updatedRequest;
    mockStore.notify();

    let passId: string | undefined;

    if (input.action === 'APPROVE') {
      const visitors = mockStore.getState().visitors || [];
      const existingVisitor = visitors.find(v => v.visitorPhone === request.visitorPhone && v.flatNumber === request.flatNumber && v.status === 'WAITING_APPROVAL');

      if (existingVisitor) {
        visitors[visitors.indexOf(existingVisitor)] = {
          ...existingVisitor,
          status: 'APPROVED',
          approvalSource: 'RESIDENT',
          approvedAtIso: now,
          approvedBy: input.residentId,
          dataVersion: existingVisitor.dataVersion + 1,
        };
        passId = existingVisitor.passId;
      } else {
        const passIdNew = `pass-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const personId = `person-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const qrCredential = `SOC-OS:PASS:${passIdNew}:${request.visitorName.toUpperCase()}:${request.flatNumber}`;
        const otpCredential = this.generateOtp(passIdNew);

        const newPass: any = {
          passId: passIdNew,
          personId: `person-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          visitorName: request.visitorName,
          visitorPhone: request.visitorPhone,
          visitorCategory: request.visitorCategory,
          purpose: 'Walk-in visit',
          unitId: request.unitId,
          flatNumber: request.flatNumber,
          societyId: request.societyId,
          status: 'APPROVED',
          approvalSource: 'RESIDENT',
          createdByUserId: input.residentId,
          createdByDisplayName: resident.name,
          createdAt: now,
          updatedAt: now,
          expectedEntryAt: new Date().toISOString(),
          expectedExitAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
          qrCredential,
          otpCredential,
          credentialExpiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
          isRecurring: false,
          dataVersion: 1,
          watchlistWarning: false,
          societyId: request.societyId,
          unitId: request.unitId,
        };

        mockStore.getState().visitors = [...(mockStore.getState().visitors || []), newPass];
        passId = passIdNew;
      }

      mockStore.notify();

      createAuditEntry({
        actorUserId: input.residentId,
        actorType: 'RESIDENT',
        societyId: request.societyId,
        action: 'VISITOR_APPROVED',
        entityType: 'VisitorApprovalRequest',
        entityId: request.requestId,
        newState: { status: 'APPROVED', passId },
        idempotencyKey: createIdempotencyKey(`approve-${request.requestId}`),
        source: 'MOBILE',
        outcome: 'SUCCESS',
      });
    } else {
      createAuditEntry({
        actorUserId: input.residentId,
        actorType: 'RESIDENT',
        societyId: request.societyId,
        action: 'VISITOR_DENIED',
        entityType: 'VisitorApprovalRequest',
        entityId: request.requestId,
        newState: { status: 'DENIED', denialReason: input.denialReason },
        idempotencyKey: createIdempotencyKey(`deny-${request.requestId}`),
        source: 'MOBILE',
        outcome: 'SUCCESS',
      });
    }

    return { success: true, request: updatedRequest, passId };
  }

  async escalateRequest(input: EscalationInput): Promise<WalkInApprovalResult> {
    const requests = mockStore.getState().visitorApprovalRequests || [];
    const index = requests.findIndex(r => r.requestId === input.requestId);

    if (index === -1) {
      return { success: false, errorCode: 'REQUEST_NOT_FOUND', errorMessage: 'Approval request not found' };
    }

    const request = requests[index];

    if (!unifiedVisitorStateMachine.canTransitionVisitorEscalationStatus(request.escalationStatus, input.escalationStatus)) {
      return { success: false, errorCode: 'INVALID_ESCALATION', errorMessage: `Invalid escalation transition from ${request.escalationStatus} to ${input.escalationStatus}` };
    }

    const now = new Date().toISOString();
    const updatedRequest: VisitorApprovalRequest = {
      ...request,
      escalationStatus: input.escalationStatus,
      escalationReason: input.escalationReason,
      escalatedAtIso: now,
      escalatedBy: input.escalatedBy,
      status: 'ESCALATED',
      dataVersion: request.dataVersion + 1,
    };

    mockStore.getState().visitorApprovalRequests[index] = updatedRequest;
    mockStore.notify();

    createAuditEntry({
      actorUserId: input.escalatedBy,
      actorType: 'RESIDENT',
      societyId: request.societyId,
      action: 'VISITOR_APPROVAL_ESCALATED',
      entityType: 'VisitorApprovalRequest',
      entityId: request.requestId,
      previousState: { escalationStatus: request.escalationStatus },
      newState: { escalationStatus: input.escalationStatus, escalationReason: input.escalationReason },
      idempotencyKey: createIdempotencyKey(`escalate-${request.requestId}`),
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return { success: true, request: updatedRequest };
  }

  async handlePolicyTimeout(requestId: string): Promise<void> {
    const requests = mockStore.getState().visitorApprovalRequests || [];
    const index = requests.findIndex(r => r.requestId === requestId);

    if (index === -1 || requests[index].status !== 'PENDING') {
      return;
    }

    const request = requests[index];

    if (request.autoDenyAfterTimeout) {
      const now = new Date().toISOString();
      const updatedRequest: VisitorApprovalRequest = {
        ...request,
        status: 'DENIED',
        respondedAtIso: now,
        respondedBy: 'SYSTEM_POLICY',
        respondedByRole: 'SYSTEM',
        decision: 'DENY',
        denialReason: 'Approval request timed out',
        dataVersion: request.dataVersion + 1,
      };

      mockStore.getState().visitorApprovalRequests[index] = updatedRequest;
      mockStore.notify();

      createAuditEntry({
        actorUserId: 'SYSTEM_POLICY',
        actorType: 'SYSTEM_POLICY',
        societyId: request.societyId,
        action: 'VISITOR_AUTO_DENIED_TIMEOUT',
        entityType: 'VisitorApprovalRequest',
        entityId: request.requestId,
        newState: { status: 'DENIED', denialReason: 'Approval request timed out' },
        idempotencyKey: `timeout-${request.requestId}`,
        source: 'SYSTEM',
        outcome: 'SUCCESS',
      });
    }
  }

  private generateOtp(requestId: string): string {
    let hash = 17;
    for (const char of requestId) {
      hash = (hash * 31 + char.charCodeAt(0)) % 900000;
    }
    return String(100000 + hash).slice(-6);
  }
}

export const walkInApprovalService = WalkInApprovalService.getInstance();