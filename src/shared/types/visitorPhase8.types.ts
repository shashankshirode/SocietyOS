import type { ResidentScopedEntity } from './residentScope.types';
import type { JsonObject } from '../../core/api/api.types';
import type { Absent } from './absence.types';
import type { VisitorExitTracking } from './visitor.types';

export type VisitorType =
  | 'GUEST'
  | 'DELIVERY'
  | 'CAB'
  | 'VENDOR'
  | 'SERVICE_PROVIDER'
  | 'DOMESTIC_HELP'
  | 'STAFF'
  | 'COURIER'
  | 'MATERIAL_MOVEMENT'
  | 'EMERGENCY'
  | 'OTHER';

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
  email?: string;
  type: VisitorType;
  category?: VisitorCategory;
  status: VisitorStatus;
  expectedDate: string;
  expectedTime: string;
  expectedEntryAtIso?: string;
  expectedExitAtIso?: string;
  actualEntryAtIso?: string;
  actualExitAtIso?: string;
  flatNumber: string;
  societyName: string;
  purpose: string;
  vehicleNumber?: string;
  vehicleType?: VehicleType;
  vehicleColor?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  otp: string;
  qrCode?: string;
  qrCodeData?: string;
  qrCodeExpiryAtIso?: string;
  createdAt: string;
  createdByUserId?: string;
  createdByDisplayName?: string;
  visitorCategory?: VisitorCategory;
  exitTracking?: VisitorExitTracking;
  cancellationReason?: string;
  cancellationNotes?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  approvalSource?: ApprovalSource;
  approvalStatus?: VisitorPassStatus;
  validityWindowMinutes?: number;
  validityStartAtIso?: string;
  validityEndAtIso?: string;
  description?: string;
  invitedByResidentId?: string;
  invitedByResidentName?: string;
  preApprovalId?: string;
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
  gateName?: string;
  checkInAtIso?: string;
  checkInGateId?: string;
  checkInGateName?: string;
  checkOutAtIso?: string;
  checkOutGateId?: string;
  checkOutGateName?: string;
  deniedAtIso?: string;
  deniedBy?: string;
  deniedReason?: string;
  escalatedAtIso?: string;
  escalatedBy?: string;
  escalationReason?: string;
  escalationStatus?: VisitorEscalationStatus;
  revokedAtIso?: string;
  revokedBy?: string;
  revocationReason?: string;
  watchlistWarning?: boolean;
  watchlistId?: string;
  watchlistReason?: string;
  previousVisitCount?: number;
  lastVisitAtIso?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
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
  visitorId?: string;
  residentId: string;
  residentName: string;
  residentUnitId: string;
  residentUnitNumber: string;
  visitorName: string;
  visitorPhone: string;
  visitorEmail?: string;
  visitorType: VisitorType;
  visitorCategory?: VisitorCategory;
  status: VisitorInvitationStatus;
  validityStartAtIso: string;
  validityEndAtIso: string;
  validityWindowMinutes: number;
  otp?: string;
  qrCode?: string;
  qrCodeData?: string;
  qrCodeExpiryAtIso?: string;
  vehicleNumber?: string;
  vehicleType?: VehicleType;
  purpose: string;
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
  createdAt: string;
  createdBy: string;
  sentAtIso?: string;
  acceptedAtIso?: string;
  revokedAtIso?: string;
  revokedBy?: string;
  revocationReason?: string;
  usedAtIso?: string;
  statusChangedAtIso?: string;
  metadata?: Record<string, unknown>;
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
  visitorId: string;
  visitorName: string;
  visitorPhone: string;
  visitorType: VisitorType;
  flatNumber: string;
  unitId: string;
  gateId: string;
  gateName: string;
  guardId: string;
  guardName: string;
  requestType: 'WALK_IN' | 'PRE_APPROVAL_EXPIRED' | 'PASS_EXPIRED' | 'UNKNOWN_VISITOR' | 'EMERGENCY';
  status: VisitorApprovalStatus;
  requestedAtIso: string;
  respondedAtIso?: string;
  respondedBy?: string;
  respondedByRole?: string;
  decision?: 'APPROVE' | 'DENY';
  denialReason?: string;
  escalationReason?: string;
  escalationStatus?: VisitorEscalationStatus;
  escalatedAtIso?: string;
  escalatedBy?: string;
  expiresAtIso: string;
  metadata?: Record<string, unknown>;
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
  visitorId?: string;
  visitorName?: string;
  visitorPhone?: string;
  visitorType?: VisitorType;
  visitorPassId?: string;
  visitorPassCode?: string;
  unitId?: string;
  unitNumber?: string;
  flatNumber?: string;
  eventTimestamp: string;
  deviceTimestamp?: string;
  guardId: string;
  guardName: string;
  guardRole: string;
  entrySource: EntrySource;
  approvalSource?: ApprovalSource;
  vehicleId?: string;
  vehicleRegistration?: string;
  vehicleType?: VehicleType;
  vehicleColor?: string;
  eventStatus: 'SUCCESS' | 'FAILED' | 'PARTIAL' | 'PENDING';
  approvalStatus?: VisitorPassStatus;
  denialReason?: string;
  escalationTriggered?: boolean;
  escalationType?: string;
  watchlistMatch?: boolean;
  watchlistId?: string;
  watchlistReason?: string;
  emergencyBypassUsed?: boolean;
  emergencyType?: EmergencyType;
  emergencyDescription?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  idempotencyKey?: string;
  deviceId?: string;
  deviceInfo?: string;
  appVersion?: string;
  networkType?: string;
  syncStatus?: 'SYNCED' | 'PENDING_SYNC' | 'SYNC_FAILED' | 'CONFLICT';
  createdAt: string;
  createdBy: string;
  metadata?: Record<string, unknown>;
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

export interface VisitorPassValidationResult {
  isValid: boolean;
  pass?: VisitorPass;
  denialReason?: string;
  watchlistWarning?: boolean;
  watchlistId?: string;
  watchlistReason?: string;
  requiresApproval?: boolean;
  approvalRequestId?: string;
  status: VisitorPassStatus;
  message?: string;
}

export interface VisitorPass extends ResidentScopedEntity {
  id: string;
  visitorName: string;
  visitorPhone?: string;
  visitorType: VisitorType;
  visitingFlat: string;
  residentName: string;
  residentPhone?: string;
  expectedTime: string;
  expectedDate: string;
  validityWindow: string;
  otp: string;
  qrCode?: string;
  qrCodeData?: string;
  qrCodeExpiryAtIso?: string;
  approvalStatus: VisitorPassStatus;
  approvalSource: ApprovalSource;
  vehicleNumber?: string;
  vehicleType?: VehicleType;
  purpose?: string;
  peopleCount?: number;
  specialInstructions?: string;
  watchlistWarning?: boolean;
  watchlistId?: string;
  watchlistReason?: string
  previousVisitCount?: number;
  actualEntryTime?: string;
  actualExitTime?: string;
  validityStartAtIso?: string;
  validityEndAtIso?: string;
  validityWindowMinutes?: number;
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
  DELIVERY: 'Delivery',
  CAB: 'Cab',
  VENDOR: 'Vendor',
  SERVICE_PROVIDER: 'Service Provider',
  DOMESTIC_HELP: 'Domestic Help',
  STAFF: 'Staff',
  COURIER: 'Courier',
  MATERIAL_MOVEMENT: 'Material Movement',
  EMERGENCY: 'Emergency',
  OTHER: 'Other',
};

export const VISITOR_CATEGORY_LABELS: Record<VisitorCategory, string> = {
  guest: 'Guest',
  cab: 'Cab',
  delivery: 'Delivery',
  parcel: 'Parcel',
  domesticHelp: 'Domestic Help',
  serviceProvider: 'Service Provider',
  repairTechnician: 'Repair Technician',
  renovationWorker: 'Renovation Worker',
  paintingWorker: 'Painting Worker',
  contractor: 'Contractor',
  vendor: 'Vendor',
  staff: 'Staff',
  other: 'Other',
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
  timeoutSeconds: number;
  actionOnTimeout: UnknownVisitorPolicyAction;
  requireHostPreApproval: boolean;
  requirePhotoAtGate: boolean;
  requireGovtId: boolean;
  escalationRole: string;
  allowGuardOverride: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}