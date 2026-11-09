import type { ResidentScopedEntity } from './residentScope.types';
import type { JsonObject } from '../../core/api/api.types';
import type {
  Visitor as VisitorPhase8,
  VisitorType as VisitorTypePhase8,
  VisitorStatus as VisitorStatusPhase8,
  VisitorExitStatus,
  VisitorExitAlertStatus,
  VisitorExitLog,
  VisitorExitTimelineEvent,
  VisitorExitTracking,
} from './visitorPhase8.types';

export type {
  VisitorExitStatus,
  VisitorExitAlertStatus,
  VisitorExitLog,
  VisitorExitTimelineEvent,
  VisitorExitTracking,
};

export type VisitorType = VisitorTypePhase8;

export type VisitorCategory =
  | 'guest'
  | 'GUEST'
  | 'cab'
  | 'CAB'
  | 'delivery'
  | 'DELIVERY'
  | 'parcel'
  | 'PARCEL'
  | 'domesticHelp'
  | 'DOMESTIC_HELP'
  | 'serviceProvider'
  | 'SERVICE_PROVIDER'
  | 'repairTechnician'
  | 'REPAIR_TECHNICIAN'
  | 'renovationWorker'
  | 'RENOVATION_WORKER'
  | 'paintingWorker'
  | 'PAINTING_WORKER'
  | 'contractor'
  | 'CONTRACTOR'
  | 'vendor'
  | 'VENDOR'
  | 'staff'
  | 'STAFF'
  | 'emergency'
  | 'EMERGENCY'
  | 'other'
  | 'OTHER';

export type VisitorStatus = VisitorStatusPhase8;

export const VisitorStatus = {
  DRAFT: 'DRAFT',
  EXPECTED: 'EXPECTED',
  WAITING_APPROVAL: 'WAITING_APPROVAL',
  APPROVED: 'APPROVED',
  PRESENTED: 'PRESENTED',
  CHECKED_IN: 'CHECKED_IN',
  CHECKED_OUT: 'CHECKED_OUT',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
  DENIED: 'DENIED',
  ESCALATED: 'ESCALATED',
  REVOKED: 'REVOKED',
  EMERGENCY_BYPASS: 'EMERGENCY_BYPASS',
} as const;

export type VisitorExitResidentResponse = 'left' | 'stillInside' | 'extended' | 'contactSecurity';

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

export type Visitor = VisitorPhase8;

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
  residenceId?: string;
  visitorPassId: string;
  reason: VisitorPassCancellationReason;
  notes?: string | null;
  requestedAt?: string;
}

export interface CancelVisitorPassResult {
  visitorPass: Visitor;
  cancelledAt: string;
  accessCredentialInvalidated: boolean;
}
