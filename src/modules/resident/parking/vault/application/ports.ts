import type { Absent } from '../../../../../shared/types/absence.types';
import type { AuditLogEntry } from '../../../../../core/audit/audit.types';
import type {
  ParkingVaultErrorCode,
  ParkingVaultClock,
} from '../domain/types/primitives';
import type {
  ParkingSlotRecord,
  VehicleRecord,
  AllocationRecord,
  VisitorParkingPassRecord,
  ParkingIncidentRecord,
  ParkingViolationRecord,
  StickerRfidRecord,
  ParkingCredential,
  ParkingRulesRecord,
  ParkingHomeRecord,
  AllocationApproval,
} from '../domain/types/parking';
import type { VaultPorts } from '../application/ports';

export type ParkingSlotStore = {
  readonly insert: (slot: ParkingSlotRecord) => boolean;
  readonly update: (slot: ParkingSlotRecord, expectedRevision: number) => boolean;
  readonly read: (slotId: string) => ParkingSlotRecord | Absent;
  readonly listBySociety: (societyId: string) => readonly ParkingSlotRecord[];
  readonly listByUnit: (societyId: string, unitId: string) => readonly ParkingSlotRecord[];
  readonly listAvailable: (societyId: string, vehicleType: string) => readonly ParkingSlotRecord[];
};

export type VehicleStore = {
  readonly insert: (vehicle: VehicleRecord) => boolean;
  readonly update: (vehicle: VehicleRecord, expectedRevision: number) => boolean;
  readonly read: (vehicleId: string) => VehicleRecord | Absent;
  readonly readByNumber: (societyId: string, normalizedNumber: string) => VehicleRecord | Absent;
  readonly listBySociety: (societyId: string) => readonly VehicleRecord[];
  readonly listByUnit: (societyId: string, unitId: string) => readonly VehicleRecord[];
  readonly listByOwner: (societyId: string, ownerName: string) => readonly VehicleRecord[];
};

export type AllocationStore = {
  readonly insert: (allocation: AllocationRecord) => boolean;
  readonly update: (allocation: AllocationRecord, expectedRevision: number) => boolean;
  readonly read: (allocationId: string) => AllocationRecord | Absent;
  readonly listBySlot: (slotId: string) => readonly AllocationRecord[];
  readonly listByVehicle: (vehicleId: string) => readonly AllocationRecord[];
  readonly listByUnit: (societyId: string, unitId: string) => readonly AllocationRecord[];
  readonly listBySociety: (societyId: string) => readonly AllocationRecord[];
  readonly findActiveBySlot: (slotId: string) => AllocationRecord | Absent;
  readonly findActiveByVehicle: (vehicleId: string) => AllocationRecord | Absent;
};

export type VisitorParkingPassStore = {
  readonly insert: (pass: VisitorParkingPassRecord) => boolean;
  readonly update: (pass: VisitorParkingPassRecord) => boolean;
  readonly read: (passId: string) => VisitorParkingPassRecord | Absent;
  readonly listByUnit: (societyId: string, unitId: string) => readonly VisitorParkingPassRecord[];
  readonly listActiveBySociety: (societyId: string) => readonly VisitorParkingPassRecord[];
  readonly findByVehicle: (societyId: string, vehicleNumber: string) => VisitorParkingPassRecord | Absent;
};

export type IncidentStore = {
  readonly insert: (incident: ParkingIncidentRecord) => boolean;
  readonly update: (incident: ParkingIncidentRecord) => boolean;
  readonly read: (incidentId: string) => ParkingIncidentRecord | Absent;
  readonly listByUnit: (societyId: string, unitId: string) => readonly ParkingIncidentRecord[];
  readonly listBySociety: (societyId: string) => readonly ParkingIncidentRecord[];
  readonly listByStatus: (societyId: string, status: string) => readonly ParkingIncidentRecord[];
};

export type ViolationStore = {
  readonly insert: (violation: ParkingViolationRecord) => boolean;
  readonly update: (violation: ParkingViolationRecord) => boolean;
  readonly read: (violationId: string) => ParkingViolationRecord | Absent;
  readonly listByVehicle: (societyId: string, vehicleNumber: string) => readonly ParkingViolationRecord[];
  readonly listBySociety: (societyId: string) => readonly ParkingViolationRecord[];
  readonly listByStatus: (societyId: string, status: string) => readonly ParkingViolationRecord[];
  readonly findRepeatOffences: (societyId: string, vehicleNumber: string, timeWindow: string) => number;
};

export type CredentialStore = {
  readonly insert: (credential: ParkingCredential) => boolean;
  readonly update: (credential: ParkingCredential) => boolean;
  readonly read: (credentialId: string) => ParkingCredential | Absent;
  readonly readByVehicle: (vehicleId: string) => readonly ParkingCredential[];
  readonly readByAllocation: (allocationId: string) => ParkingCredential | Absent;
  readonly revoke: (credentialId: string, revokedAt: string, revokedBy: string) => boolean;
};

export type StickerRfidStore = {
  readonly insert: (record: StickerRfidRecord) => boolean;
  readonly update: (record: StickerRfidRecord) => boolean;
  readonly read: (recordId: string) => StickerRfidRecord | Absent;
  readonly listByVehicle: (vehicleId: string) => readonly StickerRfidRecord[];
  readonly listBySociety: (societyId: string) => readonly StickerRfidRecord[];
};

export type RulesStore = {
  readonly upsert: (rules: ParkingRulesRecord) => boolean;
  readonly read: (societyId: string) => ParkingRulesRecord | Absent;
  readonly listBySociety: (societyId: string) => readonly ParkingRulesRecord[];
};

export type HomeStore = {
  readonly getHome: (unitId: string) => ParkingHomeRecord | Absent;
};

export type AuditSink = {
  readonly emit: (entry: AuditLogEntry) => void;
};

export type ParkingPorts = {
  readonly clock: ParkingVaultClock;
  readonly slots: ParkingSlotStore;
  readonly vehicles: VehicleStore;
  readonly allocations: AllocationStore;
  readonly visitorPasses: VisitorParkingPassStore;
  readonly incidents: IncidentStore;
  readonly violations: ViolationStore;
  readonly credentials: CredentialStore;
  readonly stickerRfid: StickerRfidStore;
  readonly rules: RulesStore;
  readonly home: HomeStore;
  readonly audit: AuditSink;
};

export type ServiceOutcome<T> =
  | { readonly ok: true; readonly value: T; readonly warnings: readonly string[] }
  | { readonly ok: false; readonly code: ParkingVaultErrorCode; readonly message: string };