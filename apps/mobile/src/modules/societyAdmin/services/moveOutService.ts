import { mockStore } from '../../../core/mockStore/mockStore';
import { DEFAULT_CLEARANCE_CHECKLIST_TEMPLATE } from '../../../shared/types/moveOut.types';
import type {
  MoveOutRequest,
  CreateMoveOutRequestInput,
  UpdateMoveOutRequestInput,
  MoveOutStatus,
  ClearanceChecklistItem,
  ClearanceCategory,
  ClearanceStatus,
  MoveOutClearanceResult,
  ClearanceSnapshot,
  OverrideClearanceInput,
  ApproveMoveOutInput,
  RejectMoveOutInput,
  ResubmitMoveOutInput,
  GenerateNocInput,
  RevokeAccessInput,
  CloseOccupancyInput,
  CancelMoveOutInput,
  MoveOutRequestFilters,
} from '../../../shared/types/moveOut.types';
import type { Absent } from '../../../shared/types/absence.types';
import { relationshipService } from '../../societySetup/services/relationshipService';

const withMockDelay = <T>(data: T, ms = 400): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function generateRequestNumber(): string {
  return `MO-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
}

function generateChecksum(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
}

function getDefaultChecklist(): ClearanceChecklistItem[] {
  return DEFAULT_CLEARANCE_CHECKLIST_TEMPLATE.map((item, index) => ({
    ...item,
    id: `clr-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 9)}`,
    status: 'NOT_STARTED' as ClearanceStatus,
  }));
}

async function evaluateClearance(moveOutRequestId: string): Promise<MoveOutClearanceResult> {
  const moveOutRequests = mockStore.getState().moveOutRequests;
  if (!moveOutRequests) throw new Error('Move-out request not found');
  const index = moveOutRequests.findIndex((r) => r.id === moveOutRequestId);
  if (index === -1) {
    throw new Error('Move-out request not found');
  }

  const request = moveOutRequests[index];
  if (!request) throw new Error('Move-out request not found');

  const checklist = request.checklist || [];

  const blockingItems = checklist.filter(
    (item) => item.priority === 'MANDATORY' && item.status === 'BLOCKED'
  );

  const overallStatus = blockingItems.length > 0 ? 'EXCEPTION' : 'READY';

  const snapshotId = generateId('snapshot');
  const now = new Date().toISOString();

  const snapshot: ClearanceSnapshot = {
    id: snapshotId,
    moveOutRequestId,
    generatedAt: now,
    generatedBy: 'system',
    clearanceItems: checklist,
    overallStatus,
    blockingItems,
    policyVersion: '1.0',
    checksum: generateChecksum(JSON.stringify(checklist)),
  };

  const snapshots = mockStore.getState().clearanceSnapshots;
  if (snapshots) {
    snapshots.push(snapshot);
  } else {
    mockStore.getState().clearanceSnapshots = [snapshot];
  }

  const updatedRequest: MoveOutRequest = {
    ...request,
    checklist,
    status: overallStatus === 'READY' ? 'READY' : 'EXCEPTION',
    clearanceSnapshotId: snapshotId,
    updatedAt: now,
  };
  moveOutRequests[index] = updatedRequest;
  mockStore.notify();

  return {
    moveOutRequestId,
    overallStatus,
    clearanceItems: checklist,
    blockingItems,
    evaluatedAt: now,
    snapshotId,
  };
}

export const moveOutService = {
  async createMoveOutRequest(input: CreateMoveOutRequestInput): Promise<MoveOutRequest> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const relationship = await relationshipService.getRelationshipById(input.occupancyRelationshipId);
          if (!relationship) {
            reject(new Error('Occupancy relationship not found'));
            return;
          }
          if (relationship.status !== 'ACTIVE') {
            reject(new Error('Occupancy relationship is not active'));
            return;
          }
          if (relationship.residentId !== input.residentId) {
            reject(new Error('Resident does not match occupancy relationship'));
            return;
          }
          if (relationship.unitId !== input.unitId) {
            reject(new Error('Unit does not match occupancy relationship'));
            return;
          }

          const moveOutRequests = mockStore.getState().moveOutRequests || [];
          const existingActive = moveOutRequests.find(
            (r) =>
              r.residentId === input.residentId &&
              r.unitId === input.unitId &&
              r.occupancyRelationshipId === input.occupancyRelationshipId &&
              ['REQUESTED', 'CLEARANCE_CHECK', 'EXCEPTION', 'READY', 'PENDING_APPROVAL', 'APPROVED', 'SCHEDULED', 'IN_PROGRESS'].includes(r.status)
          );
          if (existingActive) {
            reject(new Error('An active move-out request already exists for this occupancy'));
            return;
          }

          const checklist = getDefaultChecklist();
          const now = new Date().toISOString();

          const request: MoveOutRequest = {
            id: generateId('mo'),
            requestNumber: generateRequestNumber(),
            societyId: input.societyId,
            unitId: input.unitId,
            residentId: input.residentId,
            occupancyRelationshipId: input.occupancyRelationshipId,
            personType: input.personType,
            requestedBy: 'current-user',
            requestedAt: now,
            requestedExitDate: input.requestedExitDate,
            reason: input.reason,
            contactNumber: input.contactNumber || '',
            vehicleEntryRequired: input.vehicleEntryRequired,
            liftSlotRequired: input.liftSlotRequired,
            checklist,
            status: 'REQUESTED',
            createdAt: now,
            updatedAt: now,
            ...(input.newAddress ? { newAddress: input.newAddress } : {}),
            ...(input.moverName ? { moverName: input.moverName } : {}),
            ...(input.notes ? { notes: input.notes } : {}),
          };

          const requests = mockStore.getState().moveOutRequests;
          if (requests) {
            requests.push(request);
          } else {
            mockStore.getState().moveOutRequests = [request];
          }
          mockStore.notify();

          await evaluateClearance(request.id);

          resolve(request);
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  },

  async getMoveOutRequests(filters: MoveOutRequestFilters = {}): Promise<MoveOutRequest[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let requests = mockStore.getState().moveOutRequests || [];

        if (filters.societyId) {
          requests = requests.filter((r) => r.societyId === filters.societyId);
        }
        if (filters.status) {
          requests = requests.filter((r) => r.status === filters.status);
        }
        if (filters.unitId) {
          requests = requests.filter((r) => r.unitId === filters.unitId);
        }
        if (filters.residentId) {
          requests = requests.filter((r) => r.residentId === filters.residentId);
        }
        if (filters.dateFrom) {
          requests = requests.filter((r) => !!r.requestedAt && r.requestedAt >= filters.dateFrom!);
        }
        if (filters.dateTo) {
          requests = requests.filter((r) => !!r.requestedAt && r.requestedAt <= filters.dateTo!);
        }

        requests = requests.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

        resolve(requests);
      }, 300);
    });
  },

  async getMoveOutRequestById(id: string): Promise<MoveOutRequest | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const requests = mockStore.getState().moveOutRequests || [];
        const request = requests.find((r) => r.id === id) || null;
        resolve(request);
      }, 300);
    });
  },

  async updateMoveOutRequest(input: UpdateMoveOutRequestInput): Promise<MoveOutRequest> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const requests = mockStore.getState().moveOutRequests;
        if (!requests) {
          reject(new Error('Move-out request not found'));
          return;
        }
        const index = requests.findIndex((r) => r.id === input.id);
        if (index === -1) {
          reject(new Error('Move-out request not found'));
          return;
        }
        const current = requests[index];
        if (!current) {
          reject(new Error('Move-out request not found'));
          return;
        }

        const updated: MoveOutRequest = {
          ...current,
          ...input,
          updatedAt: new Date().toISOString(),
        };
        requests[index] = updated;
        mockStore.notify();
        resolve(updated);
      }, 400);
    });
  },

  async transitionStatus(
    id: string,
    newStatus: MoveOutStatus,
    additionalData?: Partial<MoveOutRequest>
  ): Promise<MoveOutRequest> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const requests = mockStore.getState().moveOutRequests;
        if (!requests) {
          reject(new Error('Move-out request not found'));
          return;
        }
        const index = requests.findIndex((r) => r.id === id);
        if (index === -1) {
          reject(new Error('Move-out request not found'));
          return;
        }

        const current = requests[index];
        if (!current) {
          reject(new Error('Move-out request not found'));
          return;
        }
        if (!canTransitionMoveOutStatus(current.status, newStatus)) {
          reject(new Error(`Invalid status transition from ${current.status} to ${newStatus}`));
          return;
        }

        const now = new Date().toISOString();
        const updated: MoveOutRequest = { ...current, status: newStatus, updatedAt: now, ...additionalData };
        requests[index] = updated;
        mockStore.notify();
        resolve(updated);
      }, 400);
    });
  },

  async evaluateClearance(moveOutRequestId: string): Promise<MoveOutClearanceResult> {
    return evaluateClearance(moveOutRequestId);
  },

  async updateClearanceItem(
    moveOutRequestId: string,
    clearanceItemId: string,
    updates: Partial<ClearanceChecklistItem>
  ): Promise<MoveOutRequest> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const requests = mockStore.getState().moveOutRequests;
        if (!requests) {
          reject(new Error('Move-out request not found'));
          return;
        }
        const index = requests.findIndex((r) => r.id === moveOutRequestId);
        if (index === -1) {
          reject(new Error('Move-out request not found'));
          return;
        }

        const request = requests[index];
        if (!request) {
          reject(new Error('Move-out request not found'));
          return;
        }
        const itemIndex = request.checklist.findIndex((item) => item.id === clearanceItemId);
        if (itemIndex === -1) {
          reject(new Error('Clearance item not found'));
          return;
        }

        const currentItem = request.checklist[itemIndex];
        if (!currentItem) {
          reject(new Error('Clearance item not found'));
          return;
        }
        const newStatus = updates.status;
        if (newStatus && !canTransitionClearanceStatus(currentItem.status, newStatus)) {
          reject(new Error(`Invalid clearance status transition from ${currentItem.status} to ${newStatus}`));
          return;
        }

        const updatedItem: ClearanceChecklistItem = {
          ...currentItem,
          ...updates,
          lastUpdated: new Date().toISOString(),
          ...(updates.status === 'CLEARED' ? { resolvedAt: new Date().toISOString(), resolvedBy: 'current-user' } : {}),
        };

        const updatedChecklist = [...request.checklist];
        updatedChecklist[itemIndex] = updatedItem;

        const updatedRequest: MoveOutRequest = { ...request, checklist: updatedChecklist, updatedAt: new Date().toISOString() };
        requests[index] = updatedRequest;
        mockStore.notify();
        resolve(updatedRequest);
      }, 400);
    });
  },

  async overrideClearance(input: OverrideClearanceInput): Promise<MoveOutRequest> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const requests = mockStore.getState().moveOutRequests;
        if (!requests) {
          reject(new Error('Move-out request not found'));
          return;
        }
        const index = requests.findIndex((r) => r.id === input.moveOutRequestId);
        if (index === -1) {
          reject(new Error('Move-out request not found'));
          return;
        }

        const request = requests[index];
        if (!request) {
          reject(new Error('Move-out request not found'));
          return;
        }
        const itemIndex = request.checklist.findIndex((item) => item.id === input.clearanceItemId);
        if (itemIndex === -1) {
          reject(new Error('Clearance item not found'));
          return;
        }
        const currentItem = request.checklist[itemIndex];
        if (!currentItem) {
          reject(new Error('Clearance item not found'));
          return;
        }

        const now = new Date().toISOString();
        const updatedItem: ClearanceChecklistItem = {
          ...currentItem,
          status: 'OVERRIDDEN' as ClearanceStatus,
          overrideReason: input.reason,
          ...(input.overriddenBy ? { overriddenBy: input.overriddenBy } : {}),
          overriddenAt: now,
          lastUpdated: now,
        };

        const updatedChecklist = [...request.checklist];
        updatedChecklist[itemIndex] = updatedItem;
        request.checklist = updatedChecklist;

        await evaluateClearance(input.moveOutRequestId);

        const currentRequests = mockStore.getState().moveOutRequests;
        const finalRequest = currentRequests ? currentRequests[index] : null;
        if (finalRequest) {
          resolve(finalRequest);
        } else {
          reject(new Error('Failed to retrieve updated request'));
        }
      }, 500);
    });
  },

  async approveMoveOut(input: ApproveMoveOutInput): Promise<MoveOutRequest> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const requests = mockStore.getState().moveOutRequests;
        if (!requests) {
          reject(new Error('Move-out request not found'));
          return;
        }
        const index = requests.findIndex((r) => r.id === input.moveOutRequestId);
        if (index === -1) {
          reject(new Error('Move-out request not found'));
          return;
        }

        const request = requests[index];
        if (!request) {
          reject(new Error('Move-out request not found'));
          return;
        }
        if (request.status !== 'READY') {
          reject(new Error('Move-out request must be in READY status for approval'));
          return;
        }

        const now = new Date().toISOString();
        const updated: MoveOutRequest = {
          ...request,
          status: 'APPROVED',
          approvalStatus: 'APPROVED',
          approvedAt: now,
          ...(input.approvedBy ? { approvedBy: input.approvedBy } : {}),
          updatedAt: now,
        };
        requests[index] = updated;
        mockStore.notify();
        resolve(updated);
      }, 500);
    });
  },

  async rejectMoveOut(input: RejectMoveOutInput): Promise<MoveOutRequest> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const requests = mockStore.getState().moveOutRequests;
        if (!requests) {
          reject(new Error('Move-out request not found'));
          return;
        }
        const index = requests.findIndex((r) => r.id === input.moveOutRequestId);
        if (index === -1) {
          reject(new Error('Move-out request not found'));
          return;
        }

        const request = requests[index];
        if (!request) {
          reject(new Error('Move-out request not found'));
          return;
        }
        if (!['PENDING_APPROVAL', 'READY'].includes(request.status)) {
          reject(new Error('Move-out request cannot be rejected in current status'));
          return;
        }

        const now = new Date().toISOString();
        const updated: MoveOutRequest = {
          ...request,
          status: 'REJECTED',
          approvalStatus: 'REJECTED',
          rejectionReason: input.reason,
          updatedAt: now,
        };
        requests[index] = updated;
        mockStore.notify();
        resolve(updated);
      }, 500);
    });
  },

  async resubmitMoveOut(input: ResubmitMoveOutInput): Promise<MoveOutRequest> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const requests = mockStore.getState().moveOutRequests;
        if (!requests) {
          reject(new Error('Move-out request not found'));
          return;
        }
        const index = requests.findIndex((r) => r.id === input.moveOutRequestId);
        if (index === -1) {
          reject(new Error('Move-out request not found'));
          return;
        }

        const request = requests[index];
        if (!request) {
          reject(new Error('Move-out request not found'));
          return;
        }
        if (request.status !== 'REJECTED') {
          reject(new Error('Only rejected requests can be resubmitted'));
          return;
        }

        const now = new Date().toISOString();
        const updated: MoveOutRequest = {
          ...request,
          status: 'RESUBMIT',
          updatedAt: now,
        };
        requests[index] = updated;
        mockStore.notify();
        resolve(updated);
      }, 500);
    });
  },

  async generateNoc(input: GenerateNocInput): Promise<MoveOutRequest> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const requests = mockStore.getState().moveOutRequests;
        if (!requests) {
          reject(new Error('Move-out request not found'));
          return;
        }
        const index = requests.findIndex((r) => r.id === input.moveOutRequestId);
        if (index === -1) {
          reject(new Error('Move-out request not found'));
          return;
        }

        const request = requests[index];
        if (!request) {
          reject(new Error('Move-out request not found'));
          return;
        }
        if (request.status !== 'APPROVED') {
          reject(new Error('Move-out request must be approved before NOC generation'));
          return;
        }

        const now = new Date().toISOString();
        const updated: MoveOutRequest = {
          ...request,
          nocStatus: 'GENERATING',
          updatedAt: now,
        };
        requests[index] = updated;
        mockStore.notify();

        setTimeout(() => {
          const finalUpdated: MoveOutRequest = {
            ...updated,
            nocStatus: 'GENERATED',
            nocId: generateId('noc'),
            updatedAt: new Date().toISOString(),
          };
          if (requests[index]) {
            requests[index] = finalUpdated;
          }
          mockStore.notify();
          resolve(finalUpdated);
        }, 1000);
      }, 500);
    });
  },

  async issueNoc(moveOutRequestId: string): Promise<MoveOutRequest> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const requests = mockStore.getState().moveOutRequests;
        if (!requests) {
          reject(new Error('Move-out request not found'));
          return;
        }
        const index = requests.findIndex((r) => r.id === moveOutRequestId);
        if (index === -1) {
          reject(new Error('Move-out request not found'));
          return;
        }

        const request = requests[index];
        if (!request) {
          reject(new Error('Move-out request not found'));
          return;
        }
        if (request.nocStatus !== 'GENERATED') {
          reject(new Error('NOC must be generated before issuance'));
          return;
        }

        const now = new Date().toISOString();
        const updated: MoveOutRequest = {
          ...request,
          nocStatus: 'ISSUED',
          updatedAt: now,
        };
        requests[index] = updated;
        mockStore.notify();
        resolve(updated);
      }, 500);
    });
  },

  async revokeAccess(input: RevokeAccessInput): Promise<MoveOutRequest> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const requests = mockStore.getState().moveOutRequests;
        if (!requests) {
          reject(new Error('Move-out request not found'));
          return;
        }
        const index = requests.findIndex((r) => r.id === input.moveOutRequestId);
        if (index === -1) {
          reject(new Error('Move-out request not found'));
          return;
        }

        const request = requests[index];
        if (!request) {
          reject(new Error('Move-out request not found'));
          return;
        }
        if (request.nocStatus !== 'ISSUED') {
          reject(new Error('NOC must be issued before access revocation'));
          return;
        }

        const now = new Date().toISOString();
        const updated: MoveOutRequest = {
          ...request,
          accessRevocationStatus: 'REVOKED',
          accessRevocationAt: now,
          updatedAt: now,
        };
        requests[index] = updated;
        mockStore.notify();
        resolve(updated);
      }, 500);
    });
  },

  async closeOccupancy(input: CloseOccupancyInput): Promise<MoveOutRequest> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const requests = mockStore.getState().moveOutRequests;
        if (!requests) {
          reject(new Error('Move-out request not found'));
          return;
        }
        const index = requests.findIndex((r) => r.id === input.moveOutRequestId);
        if (index === -1) {
          reject(new Error('Move-out request not found'));
          return;
        }

        const request = requests[index];
        if (!request) {
          reject(new Error('Move-out request not found'));
          return;
        }
        if (request.accessRevocationStatus !== 'REVOKED') {
          reject(new Error('Access must be revoked before occupancy closure'));
          return;
        }

        const now = new Date().toISOString();
        await relationshipService.endRelationship({
          id: request.occupancyRelationshipId || '',
          endDate: request.requestedExitDate || now,
          endedBy: input.closedBy || '',
          endReason: 'Move-out completed',
        });
        const updated: MoveOutRequest = {
          ...request,
          status: 'COMPLETED',
          occupancyClosureStatus: 'CLOSED',
          occupancyClosedAt: now,
          completedAt: now,
          updatedAt: now,
        };
        requests[index] = updated;
        mockStore.notify();
        resolve(updated);
      }, 500);
    });
  },

  async cancelMoveOut(input: CancelMoveOutInput): Promise<MoveOutRequest> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const requests = mockStore.getState().moveOutRequests;
        if (!requests) {
          reject(new Error('Move-out request not found'));
          return;
        }
        const index = requests.findIndex((r) => r.id === input.moveOutRequestId);
        if (index === -1) {
          reject(new Error('Move-out request not found'));
          return;
        }

        const request = requests[index];
        if (!request) {
          reject(new Error('Move-out request not found'));
          return;
        }
        if (!['SCHEDULED', 'READY', 'PENDING_APPROVAL'].includes(request.status)) {
          reject(new Error('Move-out request cannot be cancelled in current status'));
          return;
        }

        const now = new Date().toISOString();
        const updated: MoveOutRequest = {
          ...request,
          status: 'CANCELLED',
          updatedAt: now,
          notes: (request.notes || '') + `\nCancelled by ${input.cancelledBy}: ${input.reason}`,
        };
        requests[index] = updated;
        mockStore.notify();
        resolve(updated);
      }, 500);
    });
  },

  async getClearanceSnapshot(snapshotId: string): Promise<ClearanceSnapshot | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const snapshots = mockStore.getState().clearanceSnapshots || [];
        const snapshot = snapshots.find((s) => s.id === snapshotId) || null;
        resolve(snapshot);
      }, 300);
    });
  },
};

function canTransitionMoveOutStatus(from: MoveOutStatus, to: MoveOutStatus): boolean {
  const transitions: Record<MoveOutStatus, MoveOutStatus[]> = {
    DRAFT: ['REQUESTED'],
    REQUESTED: ['CLEARANCE_CHECK', 'PENDING_CLEARANCE'],
    CLEARANCE_CHECK: ['EXCEPTION', 'READY', 'CLEARED'],
    PENDING_CLEARANCE: ['CLEARANCE_CHECK', 'EXCEPTION', 'CLEARED'],
    CLEARED: ['READY', 'PENDING_APPROVAL'],
    EXCEPTION: ['CLEARANCE_CHECK', 'READY'],
    READY: ['PENDING_APPROVAL'],
    PENDING_APPROVAL: ['APPROVED', 'REJECTED'],
    APPROVED: ['SCHEDULED', 'NOC_GENERATED', 'SIGNED'],
    NOC_GENERATED: ['ISSUED', 'SIGNED'],
    SIGNED: ['ISSUED', 'SCHEDULED'],
    ISSUED: ['ACCESS_REVOKED', 'SCHEDULED'],
    ACCESS_REVOKED: ['OCCUPANCY_CLOSED'],
    OCCUPANCY_CLOSED: ['COMPLETED', 'ARCHIVED'],
    REJECTED: ['RESUBMIT'],
    RESUBMIT: ['CLEARANCE_CHECK', 'REQUESTED'],
    SCHEDULED: ['IN_PROGRESS', 'CANCELLED'],
    IN_PROGRESS: ['COMPLETED', 'FAILED'],
    COMPLETED: ['ARCHIVED'],
    CANCELLED: [],
    FAILED: ['IN_PROGRESS'],
    ARCHIVED: [],
  };
  return transitions[from]?.includes(to) ?? false;
}

function canTransitionClearanceStatus(from: ClearanceStatus, to: ClearanceStatus): boolean {
  const transitions: Record<ClearanceStatus, ClearanceStatus[]> = {
    NOT_STARTED: ['PENDING', 'IN_PROGRESS', 'CLEARED', 'BLOCKED', 'WAIVED', 'NOT_APPLICABLE'],
    PENDING: ['IN_PROGRESS', 'CLEARED', 'BLOCKED', 'WAIVED', 'NOT_APPLICABLE'],
    IN_PROGRESS: ['CLEARED', 'BLOCKED', 'WAIVED', 'NOT_APPLICABLE'],
    CLEARED: ['OVERRIDDEN'],
    BLOCKED: ['CLEARED', 'OVERRIDDEN', 'WAIVED'],
    OVERRIDDEN: ['CLEARED'],
    WAIVED: ['CLEARED'],
    NOT_APPLICABLE: [],
  };
  return transitions[from]?.includes(to) ?? false;
}

export default moveOutService;