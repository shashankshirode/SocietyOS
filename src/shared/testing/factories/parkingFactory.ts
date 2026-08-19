import type { ParkingSlot, ParkingIncident, ParkingViolation } from '../../types/parking.types';
import type { Vehicle } from '../../types/vehicle.types';

export function createParkingSlot(overrides: Partial<ParkingSlot> = {}): ParkingSlot {
  return {
    id: 'slot-101',
    societyId: 'soc-001',
    slotNumber: 'P2-184',
    level: 'Basement 2',
    zone: 'Zone B',
    slotType: 'CAR',
    linkedUnitId: 'unit-1204',
    linkedFlat: 'A-1204',
    linkedVehicleId: 'veh-001',
    linkedVehicleNumber: 'MH-15-AB-1234',
    allocationStatus: 'ALLOCATED',
    allocationStartDate: '2025-01-01',
    stickerRfidLinkage: 'ACTIVE',
    visitorParkingAllowedNearby: false,
    ...overrides,
  };
}

export function createVehicle(overrides: Partial<Vehicle> = {}): Vehicle {
  return {
    id: 'veh-001',
    societyId: 'soc-001',
    unitId: 'unit-1204',
    vehicleNumber: 'MH-15-AB-1234',
    vehicleType: 'CAR',
    makeModel: 'Tata Nexon EV',
    color: 'White',
    fuelType: 'ELECTRIC',
    isEv: true,
    ownerName: 'Rajesh Kumar',
    linkedResidentName: 'Rajesh Kumar',
    linkedFlat: 'A-1204',
    parkingSlotId: 'slot-101',
    parkingSlotNumber: 'P2-184',
    stickerStatus: 'ISSUED',
    stickerNumber: 'ST-0038',
    rfidStatus: 'ACTIVE',
    rfidTagNumber: 'RF-892019',
    verificationStatus: 'VERIFIED',
    registrationDocumentStatus: 'VERIFIED',
    lastUpdatedAt: '2026-07-08T12:00:00Z',
    ...overrides,
  };
}

export function createParkingIncident(overrides: Partial<ParkingIncident> = {}): ParkingIncident {
  return {
    id: 'inc-001',
    societyId: 'soc-001',
    unitId: 'unit-1204',
    incidentNumber: 'PK-INC-2026-0045',
    issueType: 'PARKED_IN_MY_SLOT',
    reportedBy: 'Rajesh Kumar',
    reportedFlat: 'A-1204',
    vehicleNumber: 'MH-02-CD-5678',
    location: 'Basement 2, Slot P2-184',
    description: 'Unknown Hyundai i20 parked in my designated parking slot without approval.',
    priority: 'HIGH',
    status: 'REPORTED',
    createdAt: '2026-07-08T18:00:00Z',
    updatedAt: '2026-07-08T18:15:00Z',
    assignedTeam: 'Security Quick Response',
    timeline: [
      { id: 't1', title: 'Incident Reported', note: 'Reported by resident of A-1204', createdAt: '2026-07-08T18:00:00Z' }
    ],
    ...overrides,
  };
}

export function createParkingViolation(overrides: Partial<ParkingViolation> = {}): ParkingViolation {
  return {
    id: 'viol-001',
    violationNumber: 'PV-2026-0012',
    vehicleNumber: 'MH-15-AB-1234',
    violationType: 'WRONG_PARKING',
    dateTime: '2026-06-15T14:30:00Z',
    location: 'Visitor Zone V4',
    status: 'CLOSED',
    penaltyAmount: 500,
    isRepeatOffence: false,
    details: 'Parked in a visitor slot for more than 4 hours without an active pass.',
    ...overrides,
  };
}
