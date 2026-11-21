import type { ResidentScopedEntity } from './residentScope.types';
import type { JsonObject } from '../../core/api/api.types';
import type { Absent } from './absence.types';

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
  | 'due'
  | 'sent'
  | 'snoozed'
  | 'acknowledged'
  | 'escalated'
  | 'resolved';

export type VisitorExitLog = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  occurredAtIso: string;
  status: VisitorExitStatus | VisitorExitAlertStatus;
};

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
  exitStatus?: VisitorExitStatus;
  alertStatus?: VisitorExitAlertStatus;
  currentStatus?: VisitorExitStatus;
  alertDueAtIso?: string;
  extendedExpectedExitAtIso?: string;
  escalationReason?: string;
  residentResponse?: string;
  residentResponseAtIso?: string;
  extensionReason?: string;
  history?: VisitorExitLog[];
  timeline?: VisitorExitTimelineEvent[];
};

export type VisitorType =
  | 'GUEST'
  | 'guest'
  | 'DELIVERY'
  | 'delivery'
  | 'CAB'
  | 'cab'
  | 'VENDOR'
  | 'vendor'
  | 'SERVICE_PROVIDER'
  | 'serviceProvider'
  | 'DOMESTIC_HELP'
  | 'domesticHelp'
  | 'STAFF'
  | 'staff'
  | 'COURIER'
  | 'courier'
  | 'MATERIAL_MOVEMENT'
  | 'materialMovement'
  | 'EMERGENCY'
  | 'emergency'
  | 'OTHER'
  | 'other';

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

export type VisitorStatus =
  | 'DRAFT'
  | 'EXPECTED'
  | 'WAITING_APPROVAL'
  | 'APPROVED'
  | 'PRESENTED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'COMPLETED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'DENIED'
  | 'ESCALATED'
  | 'REVOKED'
  | 'EMERGENCY_BYPASS';

export type VisitorPassStatus =
  | 'DRAFT'
  | 'EXPECTED'
  | 'WAITING_APPROVAL'
  | 'APPROVED'
  | 'PRESENTED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'COMPLETED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'DENIED'
  | 'ESCALATED'
  | 'REVOKED'
  | 'EMERGENCY_BYPASS';

export type EntrySource =
  | 'QR'
  | 'OTP'
  | 'MANUAL'
  | 'OFFLINE'
  | 'NFC'
  | 'RFID';

export type ApprovalSource =
  | 'RESIDENT'
  | 'PRE_APPROVED'
  | 'GUARD'
  | 'SUPERVISOR'
  | 'SYSTEM'
  | 'EMERGENCY';

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

export type VisitorInvitationStatus =
  | 'DRAFT'
  | 'SENT'
  | 'ACCEPTED'
  | 'EXPIRED'
  | 'REVOKED'
  | 'USED';

export type WatchlistStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'EXPIRED'
  | 'PENDING_REVIEW';

export type WatchlistReason =
  | 'SECURITY_CONCERN'
  | 'PREVIOUS_VIOLATION'
  | 'BLACKLISTED_BY_COMMITTEE'
  | 'SUSPICIOUS_ACTIVITY'
  | 'UNAUTHORIZED_ACCESS_ATTEMPT'
  | 'OTHER';

export type EmergencyType =
  | 'AMBULANCE'
  | 'FIRE'
  | 'POLICE'
  | 'EMERGENCY_MAINTENANCE'
  | 'OTHER';

export type GateType =
  | 'MAIN_GATE'
  | 'SECONDARY_GATE'
  | 'SERVICE_GATE'
  | 'STAFF_GATE'
  | 'EMERGENCY_GATE'
  | 'VEHICLE_GATE'
  | 'PEDESTRIAN_GATE';

export type GateStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'MAINTENANCE'
  | 'EMERGENCY_LOCKDOWN';

export type GateEventType =
  | 'CHECK_IN'
  | 'CHECK_OUT'
  | 'DENIED'
  | 'EMERGENCY_BYPASS'
  | 'ENTRY_ATTEMPT'
  | 'EXIT_ATTEMPT'
  | 'MANUAL_OVERRIDE'
  | 'WALK_IN_REGISTRATION'
  | 'APPROVAL_REQUEST_SENT'
  | 'APPROVAL_RECEIVED'
  | 'PASS_PRESENTED'
  | 'PASS_VALIDATED'
  | 'PASS_REVOKED'
  | 'PASS_EXPIRED'
  | 'DENIED_ENTRY'
  | 'ESCALATION_TRIGGERED'
  | 'EMERGENCY_BYPASS_USED';

export type VehicleType =
  | 'CAR'
  | 'BIKE'
  | 'SCOOTER'
  | 'AUTO_RICKSHAW'
  | 'TRUCK'
  | 'TEMPO'
  | 'VAN'
  | 'OTHER';

export type VehicleStatus =
  | 'ACTIVE'
  | 'PARKED'
  | 'EXITED'
  | 'VIOLATION'
  | 'TOWED';

export interface Visitor extends ResidentScopedEntity {
  id: string;
  name: string;
  phone: string;
  email?: string | Absent;
  type: VisitorType;
  category?: VisitorCategory | Absent;
  status: VisitorStatus;
  expectedDate: string;
  expectedTime: string;
  expectedEntryAtIso?: string | Absent;
  expectedExitAtIso?: string | Absent;
  actualEntryAtIso?: string | Absent;
  actualExitAtIso?: string | Absent;
  actualEntryTime?: string | Absent;
  actualExitTime?: string | Absent;
  flatNumber: string;
  societyName: string;
  purpose: string;
  vehicleNumber?: string | Absent;
  vehicleType?: VehicleType | Absent;
  vehicleColor?: string | Absent;
  vehicleMake?: string | Absent;
  vehicleModel?: string | Absent;
  otp: string;
  qrCode?: string | Absent;
  qrCodeData?: string | Absent;
  qrCodeExpiryAtIso?: string | Absent;
  createdAt: string;
  updatedAt?: string | Absent;
  expiredAtIso?: string | Absent;
  createdByUserId?: string | Absent;
  createdByDisplayName?: string | Absent;
  visitorCategory?: VisitorCategory | Absent;
  exitTracking?: VisitorExitTracking | Absent;
  cancellationReason?: string | Absent;
  cancellationNotes?: string | Absent;
  cancelledAt?: string | Absent;
  cancelledBy?: string | Absent;
  approvalSource?: ApprovalSource | Absent;
  approvalStatus?: VisitorPassStatus | Absent;
  approvedAtIso?: string | Absent;
  approvedBy?: string | Absent;
  validityWindowMinutes?: number | Absent;
  validityStartAtIso?: string | Absent;
  validityEndAtIso?: string | Absent;
  description?: string | Absent;
  invitedByResidentId?: string | Absent;
  invitedByResidentName?: string | Absent;
  preApprovalId?: string | Absent;
  passId?: string | Absent;
  personId?: string | Absent;
  entryGateId?: string | Absent;
  entryGateName?: string | Absent;
  exitGateId?: string | Absent;
  exitGateName?: string | Absent;
  dataVersion?: number | Absent;
  actualEntryAt?: string | Absent;
  actualExitAt?: string | Absent;
  deliveryBrand?: string | Absent;
  deliveryTrackingId?: string | Absent;
  cabCompany?: string | Absent;
  cabDriverName?: string | Absent;
  vendorCompany?: string | Absent;
  vendorContactPerson?: string | Absent;
  vendorServiceType?: string | Absent;
  materialDescription?: string | Absent;
  materialQuantity?: string | Absent;
  materialWeightKg?: number | Absent;
  emergencyType?: EmergencyType | Absent;
  emergencyDescription?: string | Absent;
  emergencyContactName?: string | Absent;
  emergencyContactPhone?: string | Absent;
  gateId?: string | Absent;
  gateName?: string | Absent;
  checkInAtIso?: string | Absent;
  checkInGateId?: string | Absent;
  checkInGateName?: string | Absent;
  checkOutAtIso?: string | Absent;
  checkOutGateId?: string | Absent;
  checkOutGateName?: string | Absent;
  deniedAtIso?: string | Absent;
  deniedBy?: string | Absent;
  deniedReason?: string | Absent;
  escalatedAtIso?: string | Absent;
  escalatedBy?: string | Absent;
  escalationReason?: string | Absent;
  escalationStatus?: VisitorEscalationStatus | Absent;
  revokedAtIso?: string | Absent;
  revokedBy?: string | Absent;
  revocationReason?: string | Absent;
  watchlistWarning?: boolean | Absent;
  watchlistId?: string | Absent;
  watchlistReason?: string | Absent;
  previousVisitCount?: number | Absent;
  lastVisitAtIso?: string | Absent;
  tags?: string[] | Absent;
  metadata?: Record<string, unknown> | Absent;
}

export interface CreateVisitorPayload extends Record<string, unknown> {
  name: string;
  phone: string;
  email?: string;
  type: VisitorType;
  category?: VisitorCategory;
  expectedDate: string;
  expectedTime: string;
  expectedEntryAtIso?: string;
  expectedExitAtIso?: string;
  visitorCategory?: VisitorCategory;
  vehicleNumber?: string;
  vehicleType?: VehicleType;
  vehicleColor?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  purpose: string;
  flatNumber?: string;
  validityWindowMinutes?: number;
  validityStartAtIso?: string;
  validityEndAtIso?: string;
  description?: string;
  deliveryBrand?: string;
  deliveryTrackingId?: string;
  cabCompany?: string;
  cabDriverName?: string;
  vendorCompany?: string;
  vendorContactPerson?: string;
  vendorServiceType?: string;
  materialDescription?: string;
  materialQuantity?: string;
  materialWeightKg?: number;
  emergencyType?: EmergencyType;
  emergencyDescription?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  gateId?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface VisitorInvitation extends ResidentScopedEntity {
  id: string;
  preApprovalId: string;
  visitorId?: string | Absent;
  residentId: string;
  residentName: string;
  residentUnitId: string;
  residentUnitNumber: string;
  visitorName: string;
  visitorPhone: string;
  visitorEmail?: string | Absent;
  visitorType: VisitorType;
  visitorCategory?: VisitorCategory | Absent;
  status: VisitorInvitationStatus;
  validityStartAtIso: string;
  validityEndAtIso: string;
  validityWindowMinutes: number;
  otp?: string | Absent;
  qrCode?: string | Absent;
  qrCodeData?: string | Absent;
  qrCodeExpiryAtIso?: string | Absent;
  vehicleNumber?: string | Absent;
  vehicleType?: VehicleType | Absent;
  purpose: string;
  deliveryBrand?: string | Absent;
  deliveryTrackingId?: string | Absent;
  cabCompany?: string | Absent;
  cabDriverName?: string | Absent;
  vendorCompany?: string | Absent;
  vendorContactPerson?: string | Absent;
  vendorServiceType?: string | Absent;
  materialDescription?: string | Absent;
  materialQuantity?: string | Absent;
  materialWeightKg?: number | Absent;
  emergencyType?: EmergencyType | Absent;
  emergencyDescription?: string | Absent;
  emergencyContactName?: string | Absent;
  emergencyContactPhone?: string | Absent;
  createdAt: string;
  createdBy: string;
  sentAtIso?: string | Absent;
  acceptedAtIso?: string | Absent;
  revokedAtIso?: string | Absent;
  revokedBy?: string | Absent;
  revocationReason?: string | Absent;
  usedAtIso?: string | Absent;
  statusChangedAtIso?: string | Absent;
  metadata?: Record<string, unknown> | Absent;
}

export interface CreateVisitorInvitationPayload extends Record<string, unknown> {
  visitorName: string;
  visitorPhone: string;
  visitorEmail?: string;
  visitorType: VisitorType;
  visitorCategory?: VisitorCategory;
  validityStartAtIso: string;
  validityEndAtIso: string;
  validityWindowMinutes: number;
  vehicleNumber?: string;
  vehicleType?: VehicleType;
  purpose: string;
  flatNumber?: string;
  deliveryBrand?: string;
  deliveryTrackingId?: string;
  cabCompany?: string;
  cabDriverName?: string;
  vendorCompany?: string;
  vendorContactPerson?: string;
  vendorServiceType?: string;
  materialDescription?: string;
  materialQuantity?: string;
  materialWeightKg?: number;
}

export interface VisitorApprovalRequest extends ResidentScopedEntity {
  id: string;
  requestId?: string | Absent;
  visitorId: string;
  visitorName: string;
  visitorPhone: string;
  visitorType: VisitorType;
  visitorCategory?: string | Absent;
  flatNumber: string;
  unitId: string;
  gateId: string;
  gateName: string;
  guardId: string;
  guardName: string;
  requestType: 'WALK_IN' | 'PRE_APPROVAL_EXPIRED' | 'PASS_EXPIRED' | 'UNKNOWN_VISITOR' | 'EMERGENCY';
  status: VisitorApprovalStatus;
  requestedAtIso: string;
  respondedAtIso?: string | Absent;
  respondedBy?: string | Absent;
  respondedByRole?: string | Absent;
  decision?: ('APPROVE' | 'DENY') | Absent;
  denialReason?: string | Absent;
  escalationReason?: string | Absent;
  escalationStatus?: VisitorEscalationStatus | Absent;
  escalatedAtIso?: string | Absent;
  escalatedBy?: string | Absent;
  expiresAtIso: string;
  statusChangedAtIso?: string | Absent;
  metadata?: Record<string, unknown> | Absent;
  dataVersion?: number | Absent;
}

export interface ResidentApprovalActionPayload extends Record<string, unknown> {
  approvalRequestId: string;
  action: 'APPROVE' | 'DENY';
  denialReason?: string;
}

export interface WatchlistEntry extends ResidentScopedEntity {
  id: string;
  visitorName?: string;
  visitorPhone?: string;
  visitorId?: string;
  reason: WatchlistReason;
  description?: string;
  status: WatchlistStatus;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  effectiveFromIso: string;
  effectiveUntilIso?: string;
  createdBy: string;
  createdByRole: string;
  createdAtIso: string;
  reviewedBy?: string;
  reviewedAtIso?: string;
  reviewStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewNotes?: string;
  autoDenyEntry: boolean;
  requiresEscort: boolean;
  notifyOnAttempt: boolean;
  metadata?: Record<string, unknown>;
}

export interface CreateWatchlistEntryPayload extends Record<string, unknown> {
  visitorName?: string;
  visitorPhone?: string;
  visitorId?: string;
  reason: WatchlistReason;
  description?: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  effectiveFromIso: string;
  effectiveUntilIso?: string;
  autoDenyEntry: boolean;
  requiresEscort: boolean;
  notifyOnAttempt: boolean;
}

export interface Gate extends ResidentScopedEntity {
  id: string;
  name: string;
  code: string;
  type: GateType;
  status: GateStatus;
  location?: string;
  latitude?: number;
  longitude?: number;
  allowedVisitorTypes: VisitorType[];
  allowedEntrySources: EntrySource[];
  requiresGuard: boolean;
  hasBarrier: boolean;
  hasQrScanner: boolean;
  hasOtpReader: boolean;
  hasNfcReader: boolean;
  hasRfidReader: boolean;
  emergencyBypassEnabled: boolean;
  maxConcurrentVisitors?: number;
  currentOccupancy: number;
  operatingHoursStart?: string;
  operatingHoursEnd?: string;
  is24Hours: boolean;
  assignedGuards: string[];
  supervisorId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  metadata?: Record<string, unknown>;
}

export interface CreateGatePayload extends Record<string, unknown> {
  name: string;
  code: string;
  type: GateType;
  location?: string;
  latitude?: number;
  longitude?: number;
  allowedVisitorTypes: VisitorType[];
  allowedEntrySources: EntrySource[];
  requiresGuard: boolean;
  hasBarrier: boolean;
  hasQrScanner: boolean;
  hasOtpReader: boolean;
  hasNfcReader: boolean;
  hasRfidReader: boolean;
  emergencyBypassEnabled: boolean;
  maxConcurrentVisitors?: number;
  operatingHoursStart?: string;
  operatingHoursEnd?: string;
  is24Hours: boolean;
  assignedGuards: string[];
  supervisorId?: string;
}

export interface GateEvent extends ResidentScopedEntity {
  id: string;
  eventType: GateEventType;
  gateId: string;
  gateName: string;
  gateCode: string;
  visitorId?: string | Absent;
  visitorName?: string | Absent;
  visitorPhone?: string | Absent;
  visitorType?: VisitorType | Absent;
  visitorPassId?: string | Absent;
  visitorPassCode?: string | Absent;
  unitId?: string | Absent;
  unitNumber?: string | Absent;
  flatNumber?: string | Absent;
  eventTimestamp: string;
  deviceTimestamp?: string | Absent;
  guardId: string;
  guardName: string;
  guardRole: string;
  entrySource: EntrySource;
  approvalSource?: ApprovalSource | Absent;
  vehicleId?: string | Absent;
  vehicleRegistration?: string | Absent;
  vehicleType?: VehicleType | Absent;
  vehicleColor?: string | Absent;
  eventStatus: 'SUCCESS' | 'FAILED' | 'PARTIAL' | 'PENDING';
  approvalStatus?: VisitorPassStatus | Absent;
  denialReason?: string | Absent;
  escalationTriggered?: boolean | Absent;
  escalationType?: string | Absent;
  watchlistMatch?: boolean | Absent;
  watchlistId?: string | Absent;
  watchlistReason?: string | Absent;
  emergencyBypassUsed?: boolean | Absent;
  emergencyType?: EmergencyType | Absent;
  emergencyDescription?: string | Absent;
  emergencyContactName?: string | Absent;
  emergencyContactPhone?: string | Absent;
  idempotencyKey?: string | Absent;
  deviceId?: string | Absent;
  deviceInfo?: string | Absent;
  appVersion?: string | Absent;
  networkType?: string | Absent;
  syncStatus?: 'SYNCED' | 'PENDING_SYNC' | 'SYNC_FAILED' | 'CONFLICT' | Absent;
  createdAt: string;
  createdBy: string;
  metadata?: Record<string, unknown> | Absent;
}

export interface CreateGateEventPayload extends Record<string, unknown> {
  eventType: GateEventType;
  gateId: string;
  visitorId?: string;
  visitorName?: string;
  visitorPhone?: string;
  visitorType?: VisitorType;
  visitorPassId?: string;
  visitorPassCode?: string;
  unitId?: string;
  unitNumber?: string;
  flatNumber?: string;
  eventTimestamp?: string;
  deviceTimestamp?: string;
  entrySource: EntrySource;
  approvalSource?: ApprovalSource;
  vehicleRegistration?: string;
  vehicleType?: VehicleType;
  vehicleColor?: string;
  emergencyType?: EmergencyType;
  emergencyDescription?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  idempotencyKey: string;
  deviceId?: string;
  deviceInfo?: string;
  appVersion?: string;
  networkType?: string;
}

export interface VisitorVehicle extends ResidentScopedEntity {
  id: string;
  visitorId: string;
  visitorPassId?: string;
  registrationNumber: string;
  vehicleType: VehicleType;
  color?: string;
  make?: string;
  model?: string;
  driverName?: string;
  driverPhone?: string;
  driverLicenseNumber?: string;
  status: VehicleStatus;
  entryAtIso?: string;
  entryGateId?: string;
  entryGateName?: string;
  exitAtIso?: string;
  exitGateId?: string;
  exitGateName?: string;
  parkingSlotId?: string;
  parkingSlotNumber?: string;
  isVisitorVehicle: boolean;
  isResidentVehicle: boolean;
  residentId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  metadata?: Record<string, unknown>;
}

export interface CreateVisitorVehiclePayload extends Record<string, unknown> {
  visitorId: string;
  visitorPassId?: string;
  registrationNumber: string;
  vehicleType: VehicleType;
  color?: string;
  make?: string;
  model?: string;
  driverName?: string;
  driverPhone?: string;
  driverLicenseNumber?: string;
  isVisitorVehicle: boolean;
  isResidentVehicle: boolean;
  residentId?: string;
  parkingSlotId?: string;
}

export interface CurrentVisitorPresence extends ResidentScopedEntity {
  visitorId: string;
  visitorName: string;
  visitorPhone?: string;
  visitorType: VisitorType;
  unitNumber: string;
  unitId: string;
  entryAtIso: string;
  entryGateId: string;
  entryGateName: string;
  entrySource: EntrySource;
  approvalSource: ApprovalSource;
  expectedExitAtIso?: string;
  actualExitAtIso?: string;
  vehicleRegistration?: string;
  vehicleType?: VehicleType
  isInside: boolean;
  durationMinutes: number;
  isOverdue: boolean;
  isExtended: boolean;
  escalationStatus?: VisitorEscalationStatus;
  lastMovementAtIso?: string;
}

export type VisitorPassValidationStatus =
  | VisitorPassStatus
  | 'VALID'
  | 'INVALID'
  | 'WATCHLIST_MATCH';

export interface VisitorPassValidationResult {
  isValid: boolean;
  pass?: VisitorPass;
  denialReason?: string;
  watchlistWarning?: boolean;
  watchlistId?: string;
  watchlistReason?: string;
  requiresApproval?: boolean;
  approvalRequestId?: string;
  status: VisitorPassValidationStatus;
  message?: string;
}

export interface VisitorPass extends ResidentScopedEntity {
  id: string;
  visitorName: string;
  visitorPhone?: string | Absent;
  visitorType: VisitorType;
  visitingFlat: string;
  residentName: string;
  residentPhone?: string | Absent;
  expectedTime: string;
  expectedDate: string;
  validityWindow: string;
  otp: string;
  qrCode?: string | Absent;
  qrCodeData?: string | Absent;
  qrCodeExpiryAtIso?: string | Absent;
  approvalStatus: VisitorPassStatus;
  approvalSource: ApprovalSource;
  vehicleNumber?: string | Absent;
  vehicleType?: VehicleType | Absent;
  purpose?: string | Absent;
  peopleCount?: number | Absent;
  specialInstructions?: string | Absent;
  watchlistWarning?: boolean | Absent;
  watchlistId?: string | Absent;
  watchlistReason?: string | Absent;
  previousVisitCount?: number | Absent;
  actualEntryTime?: string | Absent;
  actualExitTime?: string | Absent;
  validityStartAtIso?: string | Absent;
  validityEndAtIso?: string | Absent;
  validityWindowMinutes?: number | Absent;
}

export interface VisitorPassValidationContext {
  passCode: string;
  gateId: string;
  guardId: string;
  societyId: string;
  currentTime: string;
  entrySource: EntrySource;
  deviceId?: string;
  deviceInfo?: string;
}

export interface CurrentVisitorPresenceSummary {
  totalInside: number;
  byType: Record<VisitorType, number>;
  overdueCount: number;
  extendedCount: number;
  escalatedCount: number;
  lastUpdatedAtIso: string;
}

export interface VisitorHistoryQuery {
  societyId: string;
  unitId?: string;
  visitorId?: string;
  visitorName?: string;
  visitorPhone?: string;
  visitorType?: VisitorType;
  status?: VisitorStatus;
  dateFrom?: string;
  dateTo?: string;
  gateId?: string;
  guardId?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'createdAt' | 'checkInAtIso' | 'checkOutAtIso' | 'expectedDate';
  sortOrder?: 'asc' | 'desc';
}

export interface GateActivitySummary {
  totalEntries: number;
  totalExits: number;
  currentlyInside: number;
  deniedEntries: number;
  emergencyBypasses: number;
  averageEntryTimeMinutes: number;
  averageExitTimeMinutes: number;
  peakHour: string;
  byType: Record<VisitorType, number>;
  byGate: Record<string, number>;
  byStatus: Record<VisitorPassStatus, number>;
}

export const VISITOR_STATUS_LABELS: Record<VisitorStatus, string> = {
  DRAFT: 'Draft',
  EXPECTED: 'Expected',
  WAITING_APPROVAL: 'Waiting Approval',
  APPROVED: 'Approved',
  PRESENTED: 'Presented',
  CHECKED_IN: 'Checked In',
  CHECKED_OUT: 'Checked Out',
  COMPLETED: 'Completed',
  REJECTED: 'Rejected',
  EXPIRED: 'Expired',
  CANCELLED: 'Cancelled',
  DENIED: 'Denied',
  ESCALATED: 'Escalated',
  REVOKED: 'Revoked',
  EMERGENCY_BYPASS: 'Emergency Bypass',
};

export const VISITOR_TYPE_LABELS: Record<VisitorType, string> = {
  GUEST: 'Guest',
  guest: 'Guest',
  DELIVERY: 'Delivery',
  delivery: 'Delivery',
  CAB: 'Cab',
  cab: 'Cab',
  VENDOR: 'Vendor',
  vendor: 'Vendor',
  SERVICE_PROVIDER: 'Service Provider',
  serviceProvider: 'Service Provider',
  DOMESTIC_HELP: 'Domestic Help',
  domesticHelp: 'Domestic Help',
  STAFF: 'Staff',
  staff: 'Staff',
  COURIER: 'Courier',
  courier: 'Courier',
  MATERIAL_MOVEMENT: 'Material Movement',
  materialMovement: 'Material Movement',
  EMERGENCY: 'Emergency',
  emergency: 'Emergency',
  OTHER: 'Other',
  other: 'Other',
};

export const VISITOR_CATEGORY_LABELS: Record<VisitorCategory, string> = {
  guest: 'Guest',
  GUEST: 'Guest',
  cab: 'Cab',
  CAB: 'Cab',
  delivery: 'Delivery',
  DELIVERY: 'Delivery',
  parcel: 'Parcel',
  PARCEL: 'Parcel',
  domesticHelp: 'Domestic Help',
  DOMESTIC_HELP: 'Domestic Help',
  serviceProvider: 'Service Provider',
  SERVICE_PROVIDER: 'Service Provider',
  repairTechnician: 'Repair Technician',
  REPAIR_TECHNICIAN: 'Repair Technician',
  renovationWorker: 'Renovation Worker',
  RENOVATION_WORKER: 'Renovation Worker',
  paintingWorker: 'Painting Worker',
  PAINTING_WORKER: 'Painting Worker',
  contractor: 'Contractor',
  CONTRACTOR: 'Contractor',
  vendor: 'Vendor',
  VENDOR: 'Vendor',
  staff: 'Staff',
  STAFF: 'Staff',
  emergency: 'Emergency',
  EMERGENCY: 'Emergency',
  other: 'Other',
  OTHER: 'Other',
};

export const VISITOR_STATUS_TRANSITIONS: Record<VisitorStatus, VisitorStatus[]> = {
  DRAFT: ['EXPECTED', 'CANCELLED'],
  EXPECTED: ['WAITING_APPROVAL', 'APPROVED', 'CANCELLED', 'EXPIRED'],
  WAITING_APPROVAL: ['APPROVED', 'DENIED', 'ESCALATED', 'EXPIRED', 'CANCELLED'],
  APPROVED: ['PRESENTED', 'CHECKED_IN', 'CANCELLED', 'EXPIRED', 'REVOKED'],
  PRESENTED: ['CHECKED_IN', 'DENIED', 'ESCALATED'],
  CHECKED_IN: ['CHECKED_OUT', 'COMPLETED', 'ESCALATED', 'EMERGENCY_BYPASS'],
  CHECKED_OUT: ['COMPLETED'],
  COMPLETED: [],
  REJECTED: ['DRAFT', 'CANCELLED'],
  EXPIRED: ['DRAFT', 'CANCELLED'],
  CANCELLED: ['DRAFT'],
  DENIED: ['DRAFT', 'ESCALATED'],
  ESCALATED: ['APPROVED', 'DENIED', 'EMERGENCY_BYPASS'],
  REVOKED: ['DRAFT'],
  EMERGENCY_BYPASS: ['CHECKED_IN', 'COMPLETED'],
};

export const VISITOR_PASS_STATUS_TRANSITIONS: Record<VisitorPassStatus, VisitorPassStatus[]> = {
  DRAFT: ['EXPECTED', 'CANCELLED'],
  EXPECTED: ['WAITING_APPROVAL', 'APPROVED', 'CANCELLED', 'EXPIRED'],
  WAITING_APPROVAL: ['APPROVED', 'DENIED', 'ESCALATED', 'EXPIRED', 'CANCELLED'],
  APPROVED: ['PRESENTED', 'CHECKED_IN', 'CANCELLED', 'EXPIRED', 'REVOKED'],
  PRESENTED: ['CHECKED_IN', 'DENIED', 'ESCALATED'],
  CHECKED_IN: ['CHECKED_OUT', 'COMPLETED', 'ESCALATED', 'EMERGENCY_BYPASS'],
  CHECKED_OUT: ['COMPLETED'],
  COMPLETED: [],
  REJECTED: ['DRAFT', 'CANCELLED'],
  EXPIRED: ['DRAFT', 'CANCELLED'],
  CANCELLED: ['DRAFT'],
  DENIED: ['DRAFT', 'ESCALATED'],
  ESCALATED: ['APPROVED', 'DENIED', 'EMERGENCY_BYPASS'],
  REVOKED: ['DRAFT'],
  EMERGENCY_BYPASS: ['CHECKED_IN', 'COMPLETED'],
};

export function canTransitionVisitorStatus(from: VisitorStatus, to: VisitorStatus): boolean {
  return VISITOR_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}

export function canTransitionVisitorPassStatus(from: VisitorPassStatus, to: VisitorPassStatus): boolean {
  return VISITOR_PASS_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}

export function isVisitorStatusFinal(status: VisitorStatus): boolean {
  return ['COMPLETED', 'CANCELLED', 'REJECTED', 'EXPIRED'].includes(status);
}

export function isVisitorPassStatusFinal(status: VisitorPassStatus): boolean {
  return ['COMPLETED', 'CANCELLED', 'REVOKED', 'EXPIRED', 'REJECTED'].includes(status);
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
    case 'CHECKED_IN':
    case 'EXPECTED':
    case 'APPROVED':
      return 'info';
    case 'CANCELLED':
    case 'REJECTED':
    case 'EXPIRED':
      return 'muted';
    default:
      return 'neutral';
  }
}

export function isVisitorCurrentlyInside(status: VisitorStatus): boolean {
  return ['CHECKED_IN', 'PRESENTED', 'ESCALATED'].includes(status);
}

export function isVisitorPassActive(status: VisitorPassStatus): boolean {
  return ['EXPECTED', 'WAITING_APPROVAL', 'APPROVED', 'PRESENTED', 'CHECKED_IN'].includes(status);
}

export type UnknownVisitorPolicyAction = 'WAIT' | 'DENY' | 'ESCALATE' | 'REQUEST_ALTERNATE_APPROVAL';
export interface UnknownVisitorPolicy {
  id: string;
  societyId: string;
  visitorType: VisitorType | 'ALL';
  defaultAction: UnknownVisitorPolicyAction;
  timeoutSeconds?: number | Absent;
  actionOnTimeout?: UnknownVisitorPolicyAction | Absent;
  requireHostPreApproval?: boolean | Absent;
  requirePhotoAtGate?: boolean | Absent;
  requireGovtId?: boolean | Absent;
  escalationRole?: string | Absent;
  allowGuardOverride?: boolean | Absent;
  isActive?: boolean | Absent;
  createdAt: string;
  updatedAt?: string | Absent;
  createdBy?: string | Absent;
  waitTimeoutMinutes?: number | Absent;
  escalationTargets?: ('SECURITY' | 'SUPERVISOR' | 'COMMITTEE')[] | Absent;
  alternateApproverRoles?: string[] | Absent;
  notifyOnAttempt?: boolean | Absent;
  autoDenyAfterTimeout?: boolean | Absent;
}