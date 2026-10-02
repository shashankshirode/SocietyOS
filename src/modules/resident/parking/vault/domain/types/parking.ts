import type { Absent } from '../../../../../../shared/types/absence.types';
import type { Revision, TraceContext, ParkingVaultScope } from './primitives';

export type ParkingSlotType =
  | 'COVERED'
  | 'OPEN'
  | 'TWO_WHEELER'
  | 'FOUR_WHEELER'
  | 'EV'
  | 'VISITOR'
  | 'ACCESSIBLE'
  | 'LOADING'
  | 'RESERVED'
  | 'TEMPORARY'
  | 'MECHANICAL_STACK'
  | 'OTHER';

export type ParkingSlotOperationalState =
  | 'ACTIVE'
  | 'TEMPORARILY_UNAVAILABLE'
  | 'MAINTENANCE'
  | 'SUSPENDED'
  | 'RETIRED';

export type AllocationType =
  | 'PERMANENT'
  | 'TEMPORARY'
  | 'VISITOR'
  | 'MAINTENANCE_RELOCATION'
  | 'EMERGENCY';

export type AllocationStatus =
  | 'AVAILABLE'
  | 'REQUESTED'
  | 'PENDING_APPROVAL'
  | 'ALLOCATED'
  | 'TEMPORARY_ACTIVE'
  | 'TRANSFERRED'
  | 'ENDED'
  | 'SUPERSEDED'
  | 'EXPIRED'
  | 'REVOKED';

export type ParkingSlotRecord = {
  readonly id: string;
  readonly societyId: string;
  readonly slotNumber: string;
  readonly level: string;
  readonly zone: string;
  readonly slotType: ParkingSlotType;
  readonly compatibleVehicleTypes: readonly ParkingVehicleType[];
  readonly evCapable: boolean;
  readonly accessibilityDesignated: boolean;
  readonly operationalState: ParkingSlotOperationalState;
  readonly currentAllocationId: string | Absent;
  readonly currentAllocationStatus: AllocationStatus | Absent;
  readonly linkedUnitId: string | Absent;
  readonly linkedFlat: string | Absent;
  readonly linkedVehicleId: string | Absent;
  readonly linkedVehicleNumber: string | Absent;
  readonly stickerRfidLinkage: string | Absent;
  readonly visitorParkingAllowedNearby: boolean;
  readonly notes: string | Absent;
  readonly createdAt: string;
  readonly createdBy: string;
  readonly updatedAt: string;
  readonly revision: Revision;
  readonly trace: TraceContext;
};

export type ParkingVehicleType =
  | 'TWO_WHEELER'
  | 'CAR'
  | 'EV'
  | 'COMMERCIAL'
  | 'BICYCLE'
  | 'OTHER';

export type FuelType =
  | 'PETROL'
  | 'DIESEL'
  | 'CNG'
  | 'ELECTRIC'
  | 'HYBRID'
  | 'OTHER';

export type VehicleVerificationStatus =
  | 'NOT_REQUIRED'
  | 'PENDING'
  | 'PENDING_ADMIN_REVIEW'
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'VERIFIED'
  | 'REJECTED'
  | 'RESUBMISSION_REQUIRED'
  | 'EXPIRED'
  | 'REVOKED'
  | 'BLOCKED';

export type ParkingStickerStatus =
  | 'NOT_ISSUED'
  | 'ISSUED'
  | 'LOST'
  | 'RETURNED'
  | 'EXPIRED'
  | 'REVOKED';

export type RfidStatus =
  | 'NOT_CONFIGURED'
  | 'REQUESTED'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'LOST'
  | 'DAMAGED'
  | 'REVOKED';

export type VehicleRecord = {
  readonly id: string;
  readonly societyId: string;
  readonly owningEntityType: string;
  readonly owningEntityId: string;
  readonly vehicleNumber: string;
  readonly normalizedVehicleNumber: string;
  readonly vehicleType: ParkingVehicleType;
  readonly makeModel: string;
  readonly color: string;
  readonly fuelType: FuelType;
  readonly isEv: boolean;
  readonly ownerName: string;
  readonly linkedResidentName: string;
  readonly linkedFlat: string;
  readonly verificationStatus: VehicleVerificationStatus;
  readonly verificationCaseId: string | Absent;
  readonly registrationDocumentStatus: string | Absent;
  readonly insuranceExpiry: string | Absent;
  readonly pollutionCertificateExpiry: string | Absent;
  readonly stickerStatus: ParkingStickerStatus;
  readonly stickerNumber: string | Absent;
  readonly stickerIssuedAt: string | Absent;
  readonly stickerValidUntil: string | Absent;
  readonly rfidStatus: RfidStatus;
  readonly rfidTagNumber: string | Absent;
  readonly rfidIssuedAt: string | Absent;
  readonly rfidRevokedAt: string | Absent;
  readonly activeAllocationId: string | Absent;
  readonly activeAllocationStatus: string | Absent;
  readonly isActive: boolean;
  readonly lastGateEntry: string | Absent;
  readonly notes: string | Absent;
  readonly createdAt: string;
  readonly createdBy: string;
  readonly updatedAt: string;
  readonly revision: Revision;
  readonly trace: TraceContext;
};

export type AllocationRecord = {
  readonly id: string;
  readonly scope: ParkingVaultScope;
  readonly allocationType: AllocationType;
  readonly status: AllocationStatus;
  readonly slotId: string;
  readonly slotNumber: string;
  readonly vehicleId: string | Absent;
  readonly vehicleNumber: string | Absent;
  readonly beneficiaryUnitId: string;
  readonly beneficiaryFlat: string;
  readonly effectiveFrom: string;
  readonly effectiveTo: string | Absent;
  readonly approvalChain: readonly AllocationApproval[];
  readonly approvalRequired: boolean;
  readonly chargeAmount: number | Absent;
  readonly depositAmount: number | Absent;
  readonly supersededAt: string | Absent;
  readonly supersededByAllocationId: string | Absent;
  readonly transferReason: string | Absent;
  readonly createdAt: string;
  readonly createdBy: string;
  readonly updatedAt: string;
  readonly revision: Revision;
  readonly trace: TraceContext;
};

export type AllocationApproval = {
  readonly approverUserId: string;
  readonly approverRole: string;
  readonly approvedAt: string;
  readonly level: number;
};

export type VisitorParkingPassRecord = {
  readonly id: string;
  readonly scope: ParkingVaultScope;
  readonly passNumber: string;
  readonly visitorName: string;
  readonly visitorMobile: string;
  readonly vehicleNumber: string;
  readonly vehicleType: ParkingVehicleType;
  readonly visitPurpose: string;
  readonly visitingFlat: string;
  readonly approvedParkingZone: string;
  readonly validFrom: string;
  readonly validUntil: string;
  readonly status: 'REQUESTED' | 'APPROVED' | 'ACTIVE' | 'USED' | 'EXPIRED' | 'CANCELLED' | 'REJECTED';
  readonly approvedBy: string | Absent;
  readonly approvedAt: string | Absent;
  readonly statusReason: string | Absent;
  readonly gateCredentialId: string | Absent;
  readonly createdAt: string;
  readonly createdBy: string;
  readonly updatedAt: string;
  readonly revision: Revision;
  readonly trace: TraceContext;
};

export type ParkingIncidentType =
  | 'PARKED_IN_MY_SLOT'
  | 'BLOCKING_EXIT'
  | 'BLOCKING_DRIVEWAY'
  | 'VISITOR_IN_RESIDENT_SLOT'
  | 'DOUBLE_PARKED'
  | 'UNKNOWN_VEHICLE'
  | 'OTHER';

export type ParkingIncidentStatus =
  | 'REPORTED'
  | 'SECURITY_NOTIFIED'
  | 'OWNER_NOTIFIED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'REJECTED'
  | 'CLOSED'
  | 'ESCALATED';

export type ParkingIncidentPriority =
  | 'NORMAL'
  | 'HIGH'
  | 'URGENT';

export type ParkingIncidentRecord = {
  readonly id: string;
  readonly scope: ParkingVaultScope;
  readonly incidentNumber: string;
  readonly issueType: ParkingIncidentType;
  readonly reportedBy: string;
  readonly reportedFlat: string;
  readonly vehicleNumber: string | Absent;
  readonly location: string;
  readonly description: string;
  readonly priority: ParkingIncidentPriority;
  readonly status: ParkingIncidentStatus;
  readonly assignedTeam: string | Absent;
  readonly assignedTo: string | Absent;
  readonly evidenceLabel: string | Absent;
  readonly resolutionNotes: string | Absent;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly resolvedAt: string | Absent;
  readonly resolvedBy: string | Absent;
  readonly resolutionNotes: string | Absent;
  readonly revision: Revision;
  readonly trace: TraceContext;
};

export type ParkingViolationType =
  | 'WRONG_PARKING'
  | 'BLOCKING_EXIT'
  | 'VISITOR_SLOT_MISUSE'
  | 'EXPIRED_STICKER'
  | 'RFID_MISUSE'
  | 'SPEEDING_INSIDE_SOCIETY'
  | 'UNREGISTERED_VEHICLE'
  | 'OTHER';

export type ParkingViolationStatus =
  | 'RECORDED'
  | 'WARNING_ISSUED'
  | 'PENALTY_PENDING'
  | 'PENALTY_PAID'
  | 'DISPUTED'
  | 'WAIVED'
  | 'CLOSED'
  | 'OVERTURNED';

export type ParkingViolationRecord = {
  readonly id: string;
  readonly scope: ParkingVaultScope;
  readonly violationNumber: string;
  readonly vehicleNumber: string;
  readonly violationType: ParkingViolationType;
  readonly dateTime: string;
  readonly location: string;
  readonly status: ParkingViolationStatus;
  readonly penaltyAmount: number | Absent;
  readonly isRepeatOffence: boolean;
  readonly details: string;
  readonly incidentId: string | Absent;
  readonly penaltyObligationId: string | Absent;
  readonly overturnedAt: string | Absent;
  readonly overturnedBy: string | Absent;
  readonly overturnReason: string | Absent;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly revision: Revision;
  readonly trace: TraceContext;
};

export type StickerRfidRecord = {
  readonly id: string;
  readonly scope: ParkingVaultScope;
  readonly vehicleId: string;
  readonly vehicleNumber: string;
  readonly parkingSlotNumber: string;
  readonly stickerNumber: string | Absent;
  readonly stickerStatus: 'NOT_ISSUED' | 'ISSUED' | 'LOST' | 'RETURNED' | 'EXPIRED' | 'REVOKED';
  readonly stickerIssuedDate: string | Absent;
  readonly stickerValidUntil: string | Absent;
  readonly rfidTagNumber: string | Absent;
  readonly rfidStatus: RfidStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly revision: Revision;
  readonly trace: TraceContext;
};

export type ParkingCredential = {
  readonly id: string;
  readonly scope: ParkingVaultScope;
  readonly credentialType: 'STICKER' | 'RFID' | 'ANPR';
  readonly credentialValue: string;
  readonly vehicleId: string;
  readonly allocationId: string;
  readonly status: 'ACTIVE' | 'SUSPENDED' | 'REVOKED' | 'EXPIRED';
  readonly issuedAt: string;
  readonly expiresAt: string | Absent;
  readonly revokedAt: string | Absent;
  readonly revokedBy: string | Absent;
  readonly revision: Revision;
  readonly trace: TraceContext;
};

export type ParkingRulesRecord = {
  readonly societyId: string;
  readonly version: number;
  readonly effectiveFrom: string;
  readonly effectiveTo: string | Absent;
  readonly residentRules: readonly string[];
  readonly visitorRules: readonly string[];
  readonly evRules: readonly string[];
  readonly wrongParkingPolicy: readonly string[];
  readonly stickerRfidRules: readonly string[];
  readonly penaltyRules: readonly string[];
  readonly emergencyVehicleAccessRule: string;
  readonly securityInstructions: readonly string[];
  readonly revision: Revision;
  readonly trace: TraceContext;
};

export type ParkingHomeRecord = {
  readonly resident: {
    readonly id: string;
    readonly name: string;
    readonly role: string;
    readonly societyId: string;
    readonly societyName: string;
    readonly unitId: string;
    readonly tower: string;
    readonly flatNumber: string;
    readonly city: string;
  };
  readonly unit: {
    readonly id: string;
    readonly societyId: string;
    readonly tower: string;
    readonly flatNumber: string;
    readonly parkingSlots: readonly string[];
  };
  readonly allocationPolicy: string;
  readonly registeredVehiclesCount: number;
  readonly allocatedParkingSlotsCount: number;
  readonly visitorParkingRequestsCount: number;
  readonly openParkingIncidentsCount: number;
  readonly pendingStickerRfidCount: number;
  readonly recentActivity: readonly string[];
  readonly vehicles: readonly VehicleRecord[];
  readonly parkingSlots: readonly ParkingSlotRecord[];
  readonly incidents: readonly ParkingIncidentRecord[];
};

export type ParkingSlotAllocationStatus =
  | 'ALLOCATED'
  | 'VACANT'
  | 'TEMPORARY'
  | 'RESERVED'
  | 'BLOCKED'
  | 'UNDER_MAINTENANCE';