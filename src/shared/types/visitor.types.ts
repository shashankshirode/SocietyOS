import type { ResidentScopedEntity } from './residentScope.types';



export type VisitorType = 'GUEST' | 'DELIVERY' | 'CAB' | 'VENDOR';

export type VisitorCategory =
  | 'guest'
  | 'cab'
  | 'delivery'
  | 'parcel'
  | 'domesticHelp'
  | 'serviceProvider'
  | 'repairTechnician'
  | 'renovationWorker'
  | 'paintingWorker'
  | 'contractor'
  | 'vendor'
  | 'staff'
  | 'other';

export type VisitorStatus =
  | 'EXPECTED'
  | 'WAITING_APPROVAL'
  | 'APPROVED'
  | 'COMPLETED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELLED';

export type VisitorExitStatus =
  | 'notEntered'
  | 'inside'
  | 'exitMarked'
  | 'expectedExitDue'
  | 'overdue'
  | 'residentConfirmedLeft'
  | 'residentConfirmedStillInside'
  | 'extended'
  | 'escalatedToSecurity'
  | 'resolved';

export type VisitorExitAlertStatus =
  | 'notRequired'
  | 'scheduled'
  | 'sent'
  | 'acknowledged'
  | 'snoozed'
  | 'escalated'
  | 'resolved';

export type VisitorExitResidentResponse = 'left' | 'stillInside' | 'extended' | 'contactSecurity';

export type VisitorExitTimelineEvent = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  occurredAtIso: string;
  status: VisitorExitStatus | VisitorExitAlertStatus;
};

export type VisitorExitTracking = {
  expectedEntryAtIso: string;
  actualEntryAtIso?: string;
  expectedExitAtIso: string;
  actualExitAtIso?: string;
  gracePeriodMinutes: number;
  exitStatus: VisitorExitStatus;
  alertStatus: VisitorExitAlertStatus;
  alertDueAtIso?: string;
  lastAlertSentAtIso?: string;
  residentResponseAtIso?: string;
  residentResponse?: VisitorExitResidentResponse;
  extensionReason?: string;
  extendedExpectedExitAtIso?: string;
  escalationReason?: string;
  timeline: VisitorExitTimelineEvent[];
};

export type VisitorExitAlertPriority = 'normal' | 'high' | 'critical';

export type VisitorExitAlert = {
  id: string;
  visitorPassId: string;
  visitorName: string;
  visitorCategory: VisitorCategory;
  priority: VisitorExitAlertPriority;
  expectedExitAtIso: string;
  alertDueAtIso: string;
  elapsedMinutes: number;
  status: VisitorExitAlertStatus;
};

export interface Visitor extends ResidentScopedEntity {
  id: string;
  name: string;
  phone: string;
  type: VisitorType;
  status: VisitorStatus;
  expectedDate: string;
  expectedTime: string;
  actualEntryTime?: string;
  actualExitTime?: string;
  flatNumber: string;
  societyName: string;
  purpose: string;
  vehicleNumber?: string;
  otp: string;
  createdAt: string;
  createdByUserId?: string;
  createdByDisplayName?: string;
  visitorCategory?: VisitorCategory;
  exitTracking?: VisitorExitTracking;
  cancellationReason?: string;
  cancellationNotes?: string;
  cancelledAt?: string;
  cancelledBy?: string;
}

export interface CreateVisitorPayload extends JsonObject {
  name: string;
  phone: string;
  type: VisitorType;
  expectedDate: string;
  expectedTime: string;
  expectedEntryAtIso?: string;
  expectedExitAtIso?: string;
  visitorCategory?: VisitorCategory;
  vehicleNumber?: string;
  purpose: string;
}

export type ConfirmVisitorLeftInput = {
  visitorPassId: string;
};

export type ConfirmVisitorStillInsideInput = {
  visitorPassId: string;
};

export type ExtendVisitorExpectedExitInput = {
  visitorPassId: string;
  expectedExitAtIso: string;
  reason: string;
};

export type ContactSecurityForVisitorExitInput = {
  visitorPassId: string;
};

export type VisitorExitEscalationResult = {
  visitorPassId: string;
  alertStatus: VisitorExitAlertStatus;
  exitStatus: VisitorExitStatus;
};

export enum VisitorPassCancellationReason {
  PlansChanged = 'PLANS_CHANGED',
  VisitorNotComing = 'VISITOR_NOT_COMING',
  IncorrectDetails = 'INCORRECT_DETAILS',
  DuplicatePass = 'DUPLICATE_PASS',
  SecurityConcern = 'SECURITY_CONCERN',
  Other = 'OTHER',
}

export interface CancelVisitorPassRequest {
  residenceId: string;
  visitorPassId: string;
  reason: VisitorPassCancellationReason;
  notes: string | null;
  requestedAt: string;
}

export interface CancelVisitorPassResult {
  visitorPass: Visitor;
  cancelledAt: string;
  accessCredentialInvalidated: boolean;
}
