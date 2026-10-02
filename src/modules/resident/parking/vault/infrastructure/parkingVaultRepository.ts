import type { Absent } from '../../../../../../shared/types/absence.types';
import type { AuditLogEntry } from '../../../../../../core/audit/audit.types';
import type {
  ParkingVaultErrorCode,
  ParkingVaultClock,
  ParkingVaultActor,
  ParkingVaultScope,
  TraceContext,
  Revision,
  IdempotencyKey,
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
import type {
  ParkingSlotStore,
  VehicleStore,
  AllocationStore,
  VisitorParkingPassStore,
  IncidentStore,
  ViolationStore,
  CredentialStore,
  StickerRfidStore,
  RulesStore,
  HomeStore,
  AuditSink,
} from '../application/ports';
import type { ParkingVaultPorts } from '../application/ports';


type StoredParkingSlot = ParkingSlotRecord;
type StoredVehicle = VehicleRecord;
type StoredAllocation = AllocationRecord;
type StoredVisitorPass = VisitorParkingPassRecord;
type StoredIncident = ParkingIncidentRecord;
type StoredViolation = ParkingViolationRecord;
type StoredCredential = ParkingCredential;
type StoredStickerRfid = StickerRfidRecord;
type StoredRules = ParkingRulesRecord;
type StoredHome = ParkingHomeRecord;

export function createParkingVaultRepository(): ParkingVaultPorts {
  const slots = new Map<string, StoredParkingSlot>();
  const vehicles = new Map<string, StoredVehicle>();
  const allocations = new Map<string, StoredAllocation>();
  const visitorPasses = new Map<string, StoredVisitorPass>();
  const incidents = new Map<string, StoredIncident>();
  const violations = new Map<string, StoredViolation>();
  const credentials = new Map<string, StoredCredential>();
  const stickerRfid = new Map<string, StoredStickerRfid>();
  const rules = new Map<string, StoredRules>();
  const homes = new Map<string, StoredHome>();
  const auditEntries: AuditLogEntry[] = [];

  const clock: ParkingVaultClock = {
    now: () => new Date(),
  };

  const slotStore: ParkingSlotStore = {
    insert: (slot: ParkingSlotRecord): boolean => {
      if (slots.has(slot.id)) return false;
      slots.set(slot.id, slot);
      return true;
    },
    update: (slot: ParkingSlotRecord, expectedRevision: number): boolean => {
      const current = slots.get(slot.id);
      if (!current || current.revision.revision !== expectedRevision) return false;
      slots.set(slot.id, slot);
      return true;
    },
    read: (slotId: string): ParkingSlotRecord | Absent => slots.get(slotId),
    listBySociety: (societyId: string): readonly ParkingSlotRecord[] =>
      Array.from(slots.values()).filter((s) => s.societyId === societyId),
    listByUnit: (societyId: string, unitId: string): readonly ParkingSlotRecord[] =>
      Array.from(slots.values()).filter((s) => s.societyId === societyId && s.linkedUnitId === unitId),
    listAvailable: (societyId: string, vehicleType: string): readonly ParkingSlotRecord[] =>
      Array.from(slots.values()).filter(
        (s) => s.societyId === societyId &&
               s.operationalState === 'ACTIVE' &&
               s.currentAllocationStatus === 'AVAILABLE' &&
               s.compatibleVehicleTypes.includes(vehicleType as any)
      ),
  };

  const vehicleStore: VehicleStore = {
    insert: (vehicle: VehicleRecord): boolean => {
      if (vehicles.has(vehicle.id)) return false;
      vehicles.set(vehicle.id, vehicle);
      return true;
    },
    update: (vehicle: VehicleRecord, expectedRevision: number): boolean => {
      const current = vehicles.get(vehicle.id);
      if (!current || current.revision.revision !== expectedRevision) return false;
      vehicles.set(vehicle.id, vehicle);
      return true;
    },
    read: (vehicleId: string): VehicleRecord | Absent => vehicles.get(vehicleId),
    readByNumber: (societyId: string, normalizedNumber: string): VehicleRecord | Absent =>
      Array.from(vehicles.values()).find((v) => v.societyId === societyId && v.normalizedVehicleNumber === normalizedNumber),
    listBySociety: (societyId: string): readonly VehicleRecord[] =>
      Array.from(vehicles.values()).filter((v) => v.societyId === societyId),
    listByUnit: (societyId: string, unitId: string): readonly VehicleRecord[] =>
      Array.from(vehicles.values()).filter((v) => v.societyId === societyId && v.owningEntityId === unitId),
    listByOwner: (societyId: string, ownerName: string): readonly VehicleRecord[] =>
      Array.from(vehicles.values()).filter((v) => v.societyId === societyId && v.ownerName === ownerName),
  };

  const allocationStore: AllocationStore = {
    insert: (allocation: AllocationRecord): boolean => {
      if (allocations.has(allocation.id)) return false;
      allocations.set(allocation.id, allocation);
      return true;
    },
    update: (allocation: AllocationRecord, expectedRevision: number): boolean => {
      const current = allocations.get(allocation.id);
      if (!current || current.revision.revision !== expectedRevision) return false;
      allocations.set(allocation.id, allocation);
      return true;
    },
    read: (allocationId: string): AllocationRecord | Absent => allocations.get(allocationId),
    listBySlot: (slotId: string): readonly AllocationRecord[] =>
      Array.from(allocations.values()).filter((a) => a.slotId === slotId),
    listByVehicle: (vehicleId: string): readonly AllocationRecord[] =>
      Array.from(allocations.values()).filter((a) => a.vehicleId === vehicleId),
    listByUnit: (societyId: string, unitId: string): readonly AllocationRecord[] =>
      Array.from(allocations.values()).filter((a) => a.scope.societyId === societyId && a.beneficiaryUnitId === unitId),
    listBySociety: (societyId: string): readonly AllocationRecord[] =>
      Array.from(allocations.values()).filter((a) => a.scope.societyId === societyId),
    findActiveBySlot: (slotId: string): AllocationRecord | Absent =>
      Array.from(allocations.values()).find((a) => a.slotId === slotId && (a.status === 'ALLOCATED' || a.status === 'TEMPORARY_ACTIVE')),
    findActiveByVehicle: (vehicleId: string): AllocationRecord | Absent =>
      Array.from(allocations.values()).find((a) => a.vehicleId === vehicleId && (a.status === 'ALLOCATED' || a.status === 'TEMPORARY_ACTIVE')),
    findActiveTemporaryByExpiry: (beforeIso: string): readonly AllocationRecord[] =>
      Array.from(allocations.values()).filter((a) => a.allocationType === 'TEMPORARY' && a.status === 'TEMPORARY_ACTIVE' && a.effectiveTo && a.effectiveTo <= beforeIso),
    findTemporaryByVehicle: (vehicleId: string): AllocationRecord | Absent =>
      Array.from(allocations.values()).find((a) => a.vehicleId === vehicleId && a.allocationType === 'TEMPORARY' && a.status === 'TEMPORARY_ACTIVE'),
  };

  const visitorPassStore: VisitorParkingPassStore = {
    insert: (pass: VisitorParkingPassRecord): boolean => {
      if (visitorPasses.has(pass.id)) return false;
      visitorPasses.set(pass.id, pass);
      return true;
    },
    update: (pass: VisitorParkingPassRecord): boolean => {
      if (!visitorPasses.has(pass.id)) return false;
      visitorPasses.set(pass.id, pass);
      return true;
    },
    read: (passId: string): VisitorParkingPassRecord | Absent => visitorPasses.get(passId),
    listByUnit: (societyId: string, unitId: string): readonly VisitorParkingPassRecord[] =>
      Array.from(visitorPasses.values()).filter((p) => p.scope.societyId === societyId && p.scope.owningEntityId === unitId),
    listActiveBySociety: (societyId: string): readonly VisitorParkingPassRecord[] =>
      Array.from(visitorPasses.values()).filter((p) => p.scope.societyId === societyId && ['APPROVED', 'ACTIVE', 'USED'].includes(p.status)),
    findByVehicle: (societyId: string, vehicleNumber: string): VisitorParkingPassRecord | Absent =>
      Array.from(visitorPasses.values()).find((p) => p.scope.societyId === societyId && p.vehicleNumber === vehicleNumber && ['APPROVED', 'ACTIVE', 'USED'].includes(p.status)),
    findActiveByExpiry: (beforeIso: string): readonly VisitorParkingPassRecord[] =>
      Array.from(visitorPasses.values()).filter((p) => p.status === 'ACTIVE' && p.validUntil && p.validUntil <= beforeIso),
    findActiveByVehicle: (societyId: string, vehicleNumber: string): VisitorParkingPassRecord | Absent =>
      Array.from(visitorPasses.values()).find((p) => p.scope.societyId === societyId && p.vehicleNumber === vehicleNumber && ['APPROVED', 'ACTIVE', 'USED'].includes(p.status)),
  };

  const incidentStore: IncidentStore = {
    insert: (incident: ParkingIncidentRecord): boolean => {
      if (incidents.has(incident.id)) return false;
      incidents.set(incident.id, incident);
      return true;
    },
    update: (incident: ParkingIncidentRecord): boolean => {
      if (!incidents.has(incident.id)) return false;
      incidents.set(incident.id, incident);
      return true;
    },
    read: (incidentId: string): ParkingIncidentRecord | Absent => incidents.get(incidentId),
    listByUnit: (societyId: string, unitId: string): readonly ParkingIncidentRecord[] =>
      Array.from(incidents.values()).filter((i) => i.scope.societyId === societyId && i.scope.owningEntityId === unitId),
    listBySociety: (societyId: string): readonly ParkingIncidentRecord[] =>
      Array.from(incidents.values()).filter((i) => i.scope.societyId === societyId),
    listByStatus: (societyId: string, status: string): readonly ParkingIncidentRecord[] =>
      Array.from(incidents.values()).filter((i) => i.scope.societyId === societyId && i.status === status),
  };

  const violationStore: ViolationStore = {
    insert: (violation: ParkingViolationRecord): boolean => {
      if (violations.has(violation.id)) return false;
      violations.set(violation.id, violation);
      return true;
    },
    update: (violation: ParkingViolationRecord): boolean => {
      if (!violations.has(violation.id)) return false;
      violations.set(violation.id, violation);
      return true;
    },
    read: (violationId: string): ParkingViolationRecord | Absent => violations.get(violationId),
    listByVehicle: (societyId: string, vehicleNumber: string): readonly ParkingViolationRecord[] =>
      Array.from(violations.values()).filter((v) => v.scope.societyId === societyId && v.vehicleNumber === vehicleNumber),
    listBySociety: (societyId: string): readonly ParkingViolationRecord[] =>
      Array.from(violations.values()).filter((v) => v.scope.societyId === societyId),
    listByStatus: (societyId: string, status: string): readonly ParkingViolationRecord[] =>
      Array.from(violations.values()).filter((v) => v.scope.societyId === societyId && v.status === status),
    findRepeatOffences: (societyId: string, vehicleNumber: string, timeWindow: string): number =>
      Array.from(violations.values()).filter((v) => v.scope.societyId === societyId && v.vehicleNumber === vehicleNumber && ['WARNING_ISSUED', 'PENALTY_PENDING', 'PENALTY_PAID', 'DISPUTED', 'WAIVED', 'CLOSED'].includes(v.status)).length,
  };

  const credentialStore: CredentialStore = {
    insert: (credential: ParkingCredential): boolean => {
      if (credentials.has(credential.id)) return false;
      credentials.set(credential.id, credential);
      return true;
    },
    update: (credential: ParkingCredential): boolean => {
      if (!credentials.has(credential.id)) return false;
      credentials.set(credential.id, credential);
      return true;
    },
    read: (credentialId: string): ParkingCredential | Absent => credentials.get(credentialId),
    readByVehicle: (vehicleId: string): readonly ParkingCredential[] =>
      Array.from(credentials.values()).filter((c) => c.vehicleId === vehicleId),
    readByAllocation: (allocationId: string): ParkingCredential | Absent =>
      Array.from(credentials.values()).find((c) => c.allocationId === allocationId),
    revoke: (credentialId: string, revokedAt: string, revokedBy: string): boolean => {
      const credential = credentials.get(credentialId);
      if (!credential) return false;
      credentials.set(credentialId, { ...credential, status: 'REVOKED', revokedAt, revokedBy });
      return true;
    },
    readByRfid: (rfidTagNumber: string): ParkingCredential | Absent =>
      Array.from(credentials.values()).find((c) => c.credentialType === 'RFID' && c.credentialValue === rfidTagNumber),
    readByAnpr: (plate: string): ParkingCredential | Absent =>
      Array.from(credentials.values()).find((c) => c.credentialType === 'ANPR' && c.credentialValue === plate),
  };

  const stickerRfidStore: StickerRfidStore = {
    insert: (record: StickerRfidRecord): boolean => {
      if (stickerRfid.has(record.id)) return false;
      stickerRfid.set(record.id, record);
      return true;
    },
    update: (record: StickerRfidRecord): boolean => {
      if (!stickerRfid.has(record.id)) return false;
      stickerRfid.set(record.id, record);
      return true;
    },
    read: (recordId: string): StickerRfidRecord | Absent => stickerRfid.get(recordId),
    listByVehicle: (vehicleId: string): readonly StickerRfidRecord[] =>
      Array.from(stickerRfid.values()).filter((r) => r.vehicleId === vehicleId),
    listBySociety: (societyId: string): readonly StickerRfidRecord[] =>
      Array.from(stickerRfid.values()).filter((r) => r.scope.societyId === societyId),
  };

  const rulesStore: RulesStore = {
    upsert: (rules: ParkingRulesRecord): boolean => {
      if (rules.has(rules.societyId)) return false;
      rules.set(rules.societyId, rules);
      return true;
    },
    read: (societyId: string): ParkingRulesRecord | Absent => rules.get(societyId),
    listBySociety: (societyId: string): readonly ParkingRulesRecord[] =>
      Array.from(rules.values()).filter((r) => r.societyId === societyId),
  };

  const homeStore: HomeStore = {
    getHome: (unitId: string): ParkingHomeRecord | Absent => homes.get(unitId),
  };

  const auditSink: AuditSink = {
    emit: (entry: AuditLogEntry): void => {
      auditEntries.push(entry);
    },
  };

  return {
    clock,
    slots: slotStore,
    vehicles: vehicleStore,
    allocations: allocationStore,
    visitorPasses: visitorPassStore,
    incidents: incidentStore,
    violations: violationStore,
    credentials: credentialStore,
    stickerRfid: stickerRfidStore,
    rules: rulesStore,
    home: homeStore,
    audit: auditSink,
  };
}

export type ParkingVaultPorts = ReturnType<typeof createParkingVaultRepository>;

export const parkingVaultRepository = createParkingVaultRepository();