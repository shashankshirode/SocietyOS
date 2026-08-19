import type {
  GuardVehicleLookupResult,
  ParkingStickerStatus,
  RfidStatus,
  Vehicle,
  VehicleType,
} from './vehicle.types';

export type ParkingSlotType =
  | 'CAR'
  | 'TWO_WHEELER'
  | 'EV'
  | 'VISITOR'
  | 'ACCESSIBLE'
  | 'LOADING'
  | 'RESERVED'
  | 'OTHER';

export type ParkingSlotAllocationStatus =
  | 'ALLOCATED'
  | 'VACANT'
  | 'TEMPORARY'
  | 'RESERVED'
  | 'BLOCKED'
  | 'UNDER_MAINTENANCE';

export type VisitorParkingPassStatus =
  | 'REQUESTED'
  | 'APPROVED'
  | 'ACTIVE'
  | 'USED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'REJECTED';

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
  | 'CLOSED';

export type ParkingResidentContext = {
  id: string;
  name: string;
  role: 'OWNER' | 'TENANT' | 'FAMILY_MEMBER';
  societyId: string;
  societyName: string;
  unitId: string;
  tower: string;
  flatNumber: string;
  city: string;
};

export type ParkingUnitContext = {
  id: string;
  societyId: string;
  tower: string;
  flatNumber: string;
  parkingSlots: string[];
};

export type ParkingSlot = {
  id: string;
  societyId: string;
  slotNumber: string;
  level: string;
  zone: string;
  slotType: ParkingSlotType;
  linkedUnitId?: string;
  linkedFlat?: string;
  linkedVehicleId?: string;
  linkedVehicleNumber?: string;
  allocationStatus: ParkingSlotAllocationStatus;
  allocationStartDate?: string;
  allocationEndDate?: string;
  stickerRfidLinkage: string;
  visitorParkingAllowedNearby: boolean;
  notes?: string;
};

export type VisitorParkingPass = {
  id: string;
  unitId: string;
  passNumber: string;
  visitorName: string;
  mobileMasked: string;
  vehicleNumber: string;
  vehicleType: VehicleType;
  visitPurpose: string;
  visitingFlat: string;
  approvedParkingZone: string;
  validFrom: string;
  validUntil: string;
  status: VisitorParkingPassStatus;
  instructions: string[];
};

export type CreateVisitorParkingPassInput = {
  societyId: string;
  unitId: string;
  visitorName: string;
  mobileNumber: string;
  vehicleNumber: string;
  vehicleType: VehicleType;
  visitPurpose: string;
  expectedDate: string;
  expectedTime: string;
  duration: string;
  visitingFlat: string;
  notes?: string;
};

export type ExtendVisitorParkingPassInput = {
  passId: string;
  hours: number;
};

export type ParkingSlotChangeRequestInput = {
  societyId: string;
  slotId: string;
};

export type ParkingHardwareActionInput = {
  recordId: string;
  vehicleId: string;
  action: 'REQUEST_STICKER' | 'REQUEST_RFID' | 'MARK_STICKER_LOST';
};

export type ParkingIncidentTimelineItem = {
  id: string;
  title: string;
  note: string;
  createdAt: string;
};

export type ParkingIncident = {
  id: string;
  societyId: string;
  unitId: string;
  incidentNumber: string;
  issueType: ParkingIncidentType;
  reportedBy: string;
  reportedFlat: string;
  vehicleNumber?: string;
  location: string;
  description: string;
  priority: ParkingIncidentPriority;
  status: ParkingIncidentStatus;
  createdAt: string;
  updatedAt: string;
  assignedTeam: string;
  assignedTo?: string;
  evidenceLabel?: string;
  resolutionNotes?: string;
  timeline: ParkingIncidentTimelineItem[];
};

export type CreateParkingIncidentInput = {
  societyId: string;
  unitId: string;
  issueType: ParkingIncidentType;
  vehicleNumber?: string;
  location: string;
  description: string;
  priority: ParkingIncidentPriority;
  reportedBy: string;
  reportedFlat: string;
  evidenceLabel?: string;
  isVehicleBlocked?: boolean;
  immediateSecurityHelp?: boolean;
};

export type ParkingViolation = {
  id: string;
  violationNumber: string;
  vehicleNumber: string;
  violationType: ParkingViolationType;
  dateTime: string;
  location: string;
  status: ParkingViolationStatus;
  penaltyAmount?: number;
  isRepeatOffence: boolean;
  details: string;
};

export type StickerRfidRecord = {
  id: string;
  vehicleId: string;
  vehicleNumber: string;
  parkingSlotNumber: string;
  stickerNumber?: string;
  stickerStatus: ParkingStickerStatus;
  stickerIssuedDate?: string;
  stickerValidUntil?: string;
  rfidTagNumber?: string;
  rfidStatus: RfidStatus;
};

export type ParkingHardwareReadiness = {
  societyId: string;
  rfidReadiness: 'NOT_STARTED' | 'PLANNED' | 'READY';
  anprReadiness: 'NOT_CONFIGURED' | 'PLANNED' | 'READY';
  boomBarrierReadiness: 'MANUAL' | 'PARTIAL' | 'READY';
  evChargingReadiness: 'NOT_AVAILABLE' | 'PLANNED' | 'AVAILABLE';
  smartSensorReadiness: 'NOT_CONFIGURED' | 'PILOT' | 'READY';
  notes: string;
};

export type ParkingHome = {
  resident: ParkingResidentContext;
  unit: ParkingUnitContext;
  registeredVehiclesCount: number;
  allocatedParkingSlotsCount: number;
  visitorParkingRequestsCount: number;
  openParkingIncidentsCount: number;
  pendingStickerRfidCount: number;
  recentActivity: string[];
  vehicles: Vehicle[];
  parkingSlots: ParkingSlot[];
  incidents: ParkingIncident[];
};

export type ParkingRules = {
  residentRules: string[];
  visitorRules: string[];
  evRules: string[];
  wrongParkingPolicy: string[];
  stickerRfidRules: string[];
  penaltyRules: string[];
  emergencyVehicleAccessRule: string;
  securityInstructions: string[];
};

export type GuardVehicleLookup = {
  query: string;
  results: GuardVehicleLookupResult[];
};
