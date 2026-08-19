export type VehicleType =
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
  | 'PENDING'
  | 'VERIFIED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'BLOCKED';

export type ParkingStickerStatus =
  | 'NOT_ISSUED'
  | 'ISSUED'
  | 'LOST'
  | 'RETURNED'
  | 'EXPIRED';

export type RfidStatus =
  | 'NOT_CONFIGURED'
  | 'REQUESTED'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'LOST'
  | 'DAMAGED';

export type Vehicle = {
  id: string;
  societyId: string;
  unitId: string;
  vehicleNumber: string;
  vehicleType: VehicleType;
  makeModel: string;
  color: string;
  fuelType: FuelType;
  isEv: boolean;
  ownerName: string;
  linkedResidentName: string;
  linkedFlat: string;
  parkingSlotId?: string;
  parkingSlotNumber?: string;
  stickerStatus: ParkingStickerStatus;
  stickerNumber?: string;
  rfidStatus: RfidStatus;
  rfidTagNumber?: string;
  verificationStatus: VehicleVerificationStatus;
  registrationDocumentStatus: 'NOT_UPLOADED' | 'UPLOADED' | 'VERIFIED' | 'REJECTED';
  insuranceExpiry?: string;
  pollutionCertificateExpiry?: string;
  lastGateEntry?: string;
  lastUpdatedAt: string;
  notes?: string;
};

export type AddVehicleInput = {
  societyId: string;
  unitId: string;
  vehicleType: VehicleType;
  vehicleNumber: string;
  makeModel: string;
  color: string;
  fuelType: FuelType;
  ownerName: string;
  linkedResidentName: string;
  parkingSlotId?: string;
  insuranceExpiry?: string;
  notes?: string;
  registrationDocumentName?: string;
};

export type GuardVehicleLookupResult = {
  id: string;
  vehicleId: string;
  vehicleNumber: string;
  vehicleType: VehicleType;
  linkedFlat: string;
  residentName: string;
  parkingSlotNumber?: string;
  stickerStatus: ParkingStickerStatus;
  rfidStatus: RfidStatus;
  verificationStatus: VehicleVerificationStatus;
  watchlistWarning?: string;
  recentEntryStatus: string;
};
