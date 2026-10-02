import type { ResidentScopedEntity } from './residentScope.types';
import type { JsonObject } from '../../core/api/api.types';

export type VisitorCategory =
  | 'GUEST'
  | 'DELIVERY'
  | 'CAB'
  | 'VENDOR'
  | 'SERVICE_PROVIDER'
  | 'DOMESTIC_HELP'
  | 'REPAIR_TECHNICIAN'
  | 'MATERIAL_MOVEMENT'
  | 'SCHOOL_TRANSPORT'
  | 'RECURRING_VISITOR'
  | 'EMERGENCY'
  | 'OTHER';

export type VisitorStatus =
  | 'DRAFT'
  | 'EXPECTED'
  | 'WAITING_APPROVAL'
  | 'APPROVED'
  | 'PRESENTED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'COMPLETED'
  | 'REVOKED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'REJECTED'
  | 'DENIED'
  | 'ESCALATED'
  | 'EMERGENCY_BYPASS';

export type VisitorPassStatus = VisitorStatus;

export type VisitorInvitationStatus =
  | 'DRAFT'
  | 'SENT'
  | 'ACCEPTED'
  | 'EXPIRED'
  | 'REVOKED'
  | 'USED';

export type VisitorApprovalStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'DENIED'
  | 'ESCALATED'
  | 'EXPIRED'
  | 'CANCELLED';

export type VisitorEscalationStatus =
  | 'NOT_ESCALATED'
  | 'ESCALATED_TO_SECURITY'
  | 'ESCALATED_TO_SUPERVISOR'
  | 'ESCALATED_TO_COMMITTEE'
  | 'RESOLVED';

export type EntrySource = 'QR' | 'OTP' | 'MANUAL' | 'OFFLINE' | 'EMERGENCY_BYPASS';

export type ApprovalSource =
  | 'RESIDENT'
  | 'PRE_APPROVED'
  | 'GUARD'
  | 'SUPERVISOR'
  | 'SYSTEM_POLICY'
  | 'COMMITTEE';

export type OfflineSyncStatus =
  | 'PENDING_SYNC'
  | 'SYNCING'
  | 'SYNCED'
  | 'FAILED'
  | 'CONFLICT';

export type EmergencySeverity =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL';

export type WatchlistAction =
  | 'BLOCK'
  | 'ESCALATE'
  | 'MANUAL_REVIEW'
  | 'ALLOW_WITH_WARNING';

export interface VisitorPerson {
  readonly personId: string;
  readonly name: string;
  readonly phone: string;
  readonly email?: string;
  readonly photoUrl?: string;
  readonly idDocumentType?: string;
  readonly idDocumentNumber?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface VisitorPass extends ResidentScopedEntity {
  readonly passId: string;
  readonly personId: string;
  readonly visitorName: string;
  readonly visitorPhone: string;
  readonly visitorCategory: VisitorCategory;
  readonly purpose: string;
  readonly unitId: string;
  readonly flatNumber: string;
  readonly societyId: string;
  readonly gateId?: string;
  readonly status: VisitorPassStatus;
  readonly approvalSource: ApprovalSource;
  readonly createdByUserId: string;
  readonly createdByDisplayName: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly expectedEntryAt: string;
  readonly expectedExitAt: string;
  readonly actualEntryAt?: string;
  readonly actualExitAt?: string;
  readonly entryGateId?: string;
  readonly entryGateName?: string;
  readonly exitGateId?: string;
  readonly exitGateName?: string;
  readonly vehicleRegistration?: string;
  readonly vehicleType?: 'CAR' | 'BIKE' | 'OTHER';
  readonly qrCredential?: string;
  readonly otpCredential?: string;
  readonly credentialExpiresAt?: string;
  readonly isRecurring: boolean;
  readonly recurringPattern?: RecurringPattern;
  readonly dataVersion: number;
  readonly watchlistWarning?: boolean;
}

export interface RecurringPattern {
  readonly frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
  readonly daysOfWeek?: readonly number[];
  readonly startDate: string;
  readonly endDate?: string;
  readonly timeWindow: {
    readonly start: string;
    readonly end: string;
  };
  readonly exceptions?: readonly string[];
}

export interface VisitorInvitation extends ResidentScopedEntity {
  readonly invitationId: string;
  readonly passId: string;
  readonly personId: string;
  readonly status: VisitorInvitationStatus;
  readonly sentAt: string;
  readonly expiresAt: string;
  readonly acceptedAt?: string;
  readonly revokedAt?: string;
  readonly deliveredVia: 'SMS' | 'EMAIL' | 'APP_PUSH' | 'WHATSAPP' | 'LINK';
}

export interface VisitorApprovalRequest extends ResidentScopedEntity {
  readonly requestId: string;
  readonly passId?: string;
  readonly personId?: string;
  readonly visitorName: string;
  readonly visitorPhone: string;
  readonly visitorCategory: VisitorCategory;
  readonly flatNumber: string;
  readonly unitId: string;
  readonly gateId: string;
  readonly gateName: string;
  readonly guardId: string;
  readonly guardName: string;
  readonly requestType: 'WALK_IN' | 'PRE_APPROVAL_EXPIRED' | 'PASS_EXPIRED' | 'UNKNOWN_VISITOR' | 'EMERGENCY';
  readonly status: VisitorApprovalStatus;
  readonly requestedAt: string;
  readonly expiresAt: string;
  readonly respondedAt?: string;
  readonly respondedBy?: string;
  readonly respondedByRole?: 'RESIDENT' | 'SYSTEM_POLICY' | 'GUARD' | 'SUPERVISOR';
  readonly decision?: 'APPROVE' | 'DENY';
  readonly denialReason?: string;
  readonly escalationStatus: VisitorEscalationStatus;
  readonly escalationReason?: string;
  readonly escalatedAt?: string;
  readonly escalatedBy?: string;
  readonly policyId?: string;
  readonly policyAction?: 'ALLOW' | 'DENY' | 'WAIT_FOR_APPROVAL';
  readonly autoDenyAfterTimeout?: boolean;
  readonly waitTimeoutMs?: number;
  readonly escalationTargets?: readonly string[];
  readonly alternateApproverRoles?: readonly string[];
  readonly watchlistMatch?: boolean;
  readonly hasPreApproval?: boolean;
  readonly preApprovalExpired?: boolean;
  readonly dataVersion: number;
}

export interface GateEntry extends ResidentScopedEntity {
  readonly entryId: string;
  readonly passId?: string;
  readonly personId?: string;
  readonly visitorName: string;
  readonly visitorPhone?: string;
  readonly visitorCategory: VisitorCategory;
  readonly flatNumber: string;
  readonly unitId: string;
  readonly gateId: string;
  readonly gateName: string;
  readonly guardId: string;
  readonly guardName: string;
  readonly entryType: 'PRE_APPROVED' | 'WALK_IN' | 'EMERGENCY_BYPASS' | 'OFFLINE' | 'MANUAL';
  readonly entrySource: EntrySource;
  readonly approvalSource: ApprovalSource;
  readonly status: 'CHECKED_IN' | 'CHECKED_OUT' | 'DENIED' | 'OVERDUE';
  readonly entryAt: string;
  readonly exitAt?: string;
  readonly vehicleRegistration?: string;
  readonly vehicleType?: 'CAR' | 'BIKE' | 'OTHER';
  readonly vehiclePhotoUrl?: string;
  readonly idPhotoUrl?: string;
  readonly qrCredential?: string;
  readonly otpCredential?: string;
  readonly isOfflineCapture: boolean;
  readonly offlineEventId?: string;
  readonly dataVersion: number;
}

export interface GateExit extends ResidentScopedEntity {
  readonly exitId: string;
  readonly entryId: string;
  readonly passId?: string;
  readonly gateId: string;
  readonly gateName: string;
  readonly guardId: string;
  readonly guardName: string;
  readonly exitAt: string;
  readonly durationMinutes: number;
  readonly isOfflineCapture: boolean;
  readonly offlineEventId?: string;
  readonly dataVersion: number;
}

export interface OfflineGateEvent {
  readonly eventId: string;
  readonly societyId: string;
  readonly gateId: string;
  readonly guardId: string;
  readonly guardName: string;
  readonly eventType: 'ENTRY' | 'EXIT' | 'EMERGENCY_BYPASS' | 'WALK_IN_REGISTRATION';
  readonly payload: JsonObject;
  readonly localTimestamp: string;
  readonly deviceId: string;
  readonly syncStatus: OfflineSyncStatus;
  readonly syncAttempts: number;
  readonly lastSyncError?: string;
  readonly createdAt: string;
  readonly syncedAt?: string;
  readonly conflictResolution?: 'ACCEPTED' | 'DUPLICATE' | 'REJECTED' | 'REQUIRES_REVIEW';
  readonly serverEventId?: string;
}

export interface CurrentVisitorPresence {
  readonly passId: string;
  readonly personId: string;
  readonly visitorName: string;
  readonly visitorPhone?: string;
  readonly visitorCategory: VisitorCategory;
  readonly unitNumber: string;
  readonly unitId: string;
  readonly entryAt: string;
  readonly entryGateId: string;
  readonly entryGateName: string;
  readonly entrySource: EntrySource;
  readonly approvalSource: ApprovalSource;
  readonly expectedExitAt?: string;
  readonly actualExitAt?: string;
  readonly vehicleRegistration?: string;
  readonly vehicleType?: string;
  readonly isInside: boolean;
  readonly durationMinutes: number;
  readonly isOverdue: boolean;
  readonly isExtended: boolean;
  readonly escalationStatus?: VisitorEscalationStatus;
  readonly lastMovementAt: string;
}

export interface WatchlistEntry {
  readonly watchlistId: string;
  readonly visitorName: string;
  readonly visitorPhone?: string;
  readonly visitorId?: string;
  readonly personId?: string;
  readonly reason: string;
  readonly description?: string;
  readonly severity: EmergencySeverity;
  readonly status: 'ACTIVE' | 'INACTIVE';
  readonly effectiveFrom: string;
  readonly effectiveUntil?: string;
  readonly createdBy: string;
  readonly createdByRole: string;
  readonly createdAt: string;
  readonly revokedAt?: string;
  readonly revokedBy?: string;
  readonly revocationReason?: string;
  readonly action: WatchlistAction;
  readonly autoDenyEntry: boolean;
  readonly requiresEscort: boolean;
  readonly notifyOnAttempt: boolean;
  readonly societyId: string;
}

export interface Gate {
  readonly gateId: string;
  readonly name: string;
  readonly code: string;
  readonly type: 'MAIN' | 'SERVICE' | 'PEDESTRIAN' | 'VEHICLE' | 'EMERGENCY';
  readonly status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  readonly location?: string;
  readonly latitude?: number;
  readonly longitude?: number;
  readonly allowedVisitorCategories: readonly VisitorCategory[];
  readonly allowedEntrySources: readonly EntrySource[];
  readonly requiresGuard: boolean;
  readonly hasBarrier: boolean;
  readonly hasQrScanner: boolean;
  readonly hasOtpReader: boolean;
  readonly hasNfcReader: boolean;
  readonly hasRfidReader: boolean;
  readonly emergencyBypassEnabled: boolean;
  readonly maxConcurrentVisitors?: number;
  readonly currentOccupancy: number;
  readonly operatingHoursStart?: string;
  readonly operatingHoursEnd?: string;
  readonly is24Hours: boolean;
  readonly assignedGuards?: readonly string[];
  readonly supervisorId?: string;
  readonly societyId: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly createdBy: string;
}

export interface GateEvent {
  readonly eventId: string;
  readonly gateId: string;
  readonly eventType: 'CHECK_IN' | 'CHECK_OUT' | 'WALK_IN_REGISTRATION' | 'EMERGENCY_BYPASS' | 'MANUAL_ENTRY' | 'DENIED_ENTRY' | 'REVOKED_AT_GATE' | 'OFFLINE_EVENT';
  readonly visitorId?: string;
  readonly passId?: string;
  readonly personId?: string;
  readonly visitorName: string;
  readonly visitorPhone?: string;
  readonly visitorCategory: VisitorCategory;
  readonly unitId: string;
  readonly flatNumber: string;
  readonly guardId: string;
  readonly guardName: string;
  readonly entrySource: EntrySource;
  readonly approvalSource: ApprovalSource;
  readonly vehicleRegistration?: string;
  readonly vehicleType?: string;
  readonly timestamp: string;
  readonly isOfflineCapture: boolean;
  readonly offlineEventId?: string;
  readonly dataVersion: number;
  readonly metadata?: JsonObject;
}

export const VISITOR_STATUS_TRANSITIONS: Record<VisitorStatus, VisitorStatus[]> = {
  DRAFT: ['EXPECTED', 'CANCELLED'],
  EXPECTED: ['WAITING_APPROVAL', 'APPROVED', 'CANCELLED', 'EXPIRED'],
  WAITING_APPROVAL: ['APPROVED', 'DENIED', 'ESCALATED', 'EXPIRED', 'CANCELLED'],
  APPROVED: ['PRESENTED', 'CHECKED_IN', 'CANCELLED', 'EXPIRED', 'REVOKED'],
  PRESENTED: ['CHECKED_IN', 'DENIED', 'ESCALATED'],
  CHECKED_IN: ['CHECKED_OUT', 'COMPLETED', 'ESCALATED', 'EMERGENCY_BYPASS'],
  CHECKED_OUT: ['COMPLETED'],
  COMPLETED: [],
  REVOKED: [],
  EXPIRED: ['DRAFT', 'CANCELLED'],
  CANCELLED: ['DRAFT'],
  REJECTED: ['DRAFT', 'CANCELLED'],
  DENIED: ['DRAFT', 'ESCALATED'],
  ESCALATED: ['APPROVED', 'DENIED', 'EMERGENCY_BYPASS'],
  EMERGENCY_BYPASS: ['CHECKED_IN', 'COMPLETED'],
};

export const VISITOR_APPROVAL_STATUS_TRANSITIONS: Record<VisitorApprovalStatus, VisitorApprovalStatus[]> = {
  PENDING: ['APPROVED', 'DENIED', 'ESCALATED', 'EXPIRED', 'CANCELLED'],
  APPROVED: [],
  DENIED: [],
  ESCALATED: ['APPROVED', 'DENIED'],
  EXPIRED: [],
  CANCELLED: [],
};

export const VISITOR_ESCALATION_STATUS_TRANSITIONS: Record<VisitorEscalationStatus, VisitorEscalationStatus[]> = {
  NOT_ESCALATED: ['ESCALATED_TO_SECURITY', 'ESCALATED_TO_SUPERVISOR', 'ESCALATED_TO_COMMITTEE'],
  ESCALATED_TO_SECURITY: ['RESOLVED'],
  ESCALATED_TO_SUPERVISOR: ['RESOLVED'],
  ESCALATED_TO_COMMITTEE: ['RESOLVED'],
  RESOLVED: [],
};

export function canTransitionVisitorStatus(from: VisitorStatus, to: VisitorStatus): boolean {
  return VISITOR_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}

export function canTransitionVisitorApprovalStatus(from: VisitorApprovalStatus, to: VisitorApprovalStatus): boolean {
  return VISITOR_APPROVAL_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}

export function canTransitionVisitorEscalationStatus(from: VisitorEscalationStatus, to: VisitorEscalationStatus): boolean {
  return VISITOR_ESCALATION_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}

export function isVisitorStatusFinal(status: VisitorStatus): boolean {
  return ['COMPLETED', 'CANCELLED', 'REVOKED', 'EXPIRED', 'REJECTED'].includes(status);
}

export function isVisitorCurrentlyInside(status: VisitorStatus): boolean {
  return ['CHECKED_IN', 'PRESENTED', 'ESCALATED'].includes(status);
}

export function isVisitorPassActive(status: VisitorPassStatus): boolean {
  return ['EXPECTED', 'WAITING_APPROVAL', 'APPROVED', 'PRESENTED', 'CHECKED_IN'].includes(status);
}

export function getValidTransitions(status: VisitorStatus): VisitorStatus[] {
  return VISITOR_STATUS_TRANSITIONS[status] ?? [];
}

export function getVisitorStatusTone(status: VisitorStatus): 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'muted' {
  switch (status) {
    case 'CHECKED_IN':
    case 'COMPLETED':
      return 'success';
    case 'WAITING_APPROVAL':
    case 'PRESENTED':
    case 'EXPIRED':
      return 'warning';
    case 'REJECTED':
    case 'DENIED':
    case 'ESCALATED':
      return 'danger';
    case 'EXPECTED':
    case 'APPROVED':
      return 'info';
    case 'CANCELLED':
    case 'REVOKED':
      return 'muted';
    default:
      return 'neutral';
  }
}