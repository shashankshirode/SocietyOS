import type {
  CorrectionRequest,
  CorrectionRequestInput,
  ApproveCorrectionInput,
  RejectCorrectionInput,
  AttendanceDay,
  AttendanceStatus,
} from '../../../shared/types/attendance.types';
import type { StaffOperationsActor } from '../data/staffAttendanceActor.types';
import {
  assertSocietyContext,
  canRequestAttendanceCorrection,
  canApproveAttendanceCorrection,
} from '../data/staffAttendanceActor';
import { generateOperationId } from '../../../core/api/idempotency';

export class AttendanceCorrectionService {
  private requests = new Map<string, CorrectionRequest>();
  private auditLogs: { action: string; entityId: string; actorId: string; timestamp: string; details?: string }[] = [];

  constructor(initialRequests?: CorrectionRequest[]) {
    if (initialRequests) {
      for (const r of initialRequests) {
        this.requests.set(r.id, { ...r });
      }
    }
  }

  public requestCorrection(
    actor: StaffOperationsActor,
    societyId: string,
    input: CorrectionRequestInput & { staffName: string; staffCode: string }
  ): CorrectionRequest {
    assertSocietyContext(actor, societyId);
    if (!canRequestAttendanceCorrection(actor)) {
      throw new Error('ACCESS_DENIED: Actor not authorized to request attendance correction');
    }

    const requestId = `cr-${generateOperationId('cr')}`;
    const requestNumber = `CR-${Date.now().toString(36).toUpperCase()}`;
    const nowIso = new Date().toISOString();

    const request: CorrectionRequest = {
      id: requestId,
      requestNumber,
      staffId: input.staffId,
      staffName: input.staffName,
      staffCode: input.staffCode,
      attendanceDate: input.attendanceDate,
      correctionType: input.correctionType,
      ...(input.existingValue ? { existingValue: input.existingValue } : {}),
      requestedCorrection: input.requestedCorrection,
      reason: input.reason,
      requestedBy: actor.displayName ?? actor.userId,
      requestedByRole: actor.role,
      status: 'PENDING',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    this.requests.set(requestId, request);

    this.auditLogs.push({
      action: 'ATTENDANCE_CORRECTION_REQUESTED',
      entityId: requestId,
      actorId: actor.userId,
      timestamp: nowIso,
      details: `Correction requested for ${input.staffName} on ${input.attendanceDate}`,
    });

    return request;
  }

  public approveCorrection(
    actor: StaffOperationsActor,
    societyId: string,
    correctionRequestId: string,
    input: ApproveCorrectionInput,
    currentDay: AttendanceDay,
    isPeriodLocked: boolean
  ): { updatedRequest: CorrectionRequest; updatedDay: AttendanceDay } {
    assertSocietyContext(actor, societyId);
    const request = this.requests.get(correctionRequestId);
    if (!request) {
      throw new Error('CORRECTION_NOT_FOUND: Correction request not found');
    }
    if (request.status !== 'PENDING' && request.status !== 'UNDER_REVIEW') {
      throw new Error('CORRECTION_ALREADY_DECIDED: Correction has already been decided');
    }

    if (!canApproveAttendanceCorrection(actor, request.requestedBy)) {
      throw new Error('CORRECTION_SELF_APPROVAL_NOT_ALLOWED: Approver cannot approve their own correction request');
    }

    if (isPeriodLocked) {
      throw new Error('ATTENDANCE_PERIOD_LOCKED: Cannot approve correction directly on a locked vendor verification period without controlled unlock');
    }

    const nowIso = new Date().toISOString();
    const updatedRequest: CorrectionRequest = {
      ...request,
      status: 'APPROVED',
      reviewedBy: actor.displayName ?? actor.userId,
      reviewedAt: nowIso,
      ...(input.auditNote ? { auditNote: input.auditNote } : {}),
      updatedAt: nowIso,
    };
    this.requests.set(correctionRequestId, updatedRequest);

    const targetStatus: AttendanceStatus = request.requestedCorrection as AttendanceStatus;
    const updatedDay: AttendanceDay = {
      ...currentDay,
      status: targetStatus,
      correctionApplied: true,
      notes: `Corrected via ${request.requestNumber}: ${request.reason}`,
    };

    this.auditLogs.push({
      action: 'ATTENDANCE_CORRECTION_APPROVED',
      entityId: correctionRequestId,
      actorId: actor.userId,
      timestamp: nowIso,
      details: `Approved correction ${request.requestNumber}. Status updated to ${targetStatus}`,
    });

    return { updatedRequest, updatedDay };
  }

  public rejectCorrection(
    actor: StaffOperationsActor,
    societyId: string,
    correctionRequestId: string,
    input: RejectCorrectionInput
  ): CorrectionRequest {
    assertSocietyContext(actor, societyId);
    const request = this.requests.get(correctionRequestId);
    if (!request) {
      throw new Error('CORRECTION_NOT_FOUND: Correction request not found');
    }
    if (request.status !== 'PENDING' && request.status !== 'UNDER_REVIEW') {
      throw new Error('CORRECTION_ALREADY_DECIDED: Correction has already been decided');
    }

    const nowIso = new Date().toISOString();
    const updated: CorrectionRequest = {
      ...request,
      status: 'REJECTED',
      reviewedBy: actor.displayName ?? actor.userId,
      reviewedAt: nowIso,
      rejectionReason: input.rejectionReason,
      updatedAt: nowIso,
    };
    this.requests.set(correctionRequestId, updated);

    this.auditLogs.push({
      action: 'ATTENDANCE_CORRECTION_REJECTED',
      entityId: correctionRequestId,
      actorId: actor.userId,
      timestamp: nowIso,
      details: `Rejected correction ${request.requestNumber}: ${input.rejectionReason}`,
    });

    return updated;
  }

  public getRequest(requestId: string): CorrectionRequest | undefined {
    return this.requests.get(requestId);
  }

  public getAuditLogs() {
    return [...this.auditLogs];
  }
}
