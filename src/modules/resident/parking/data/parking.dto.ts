import type {
  AddVehicleInput,
  GuardVehicleLookupResult,
  Vehicle,
} from '../../../../shared/types/vehicle.types';
import type {
  CreateParkingIncidentInput,
  CreateVisitorParkingPassInput,
  ParkingHardwareReadiness,
  ParkingHome,
  ParkingIncident,
  ParkingRules,
  ParkingSlot,
  ParkingViolation,
  StickerRfidRecord,
  VisitorParkingPass,
} from '../../../../shared/types/parking.types';

export type VehicleDto = Vehicle;
export type AddVehicleRequestDto = AddVehicleInput;
export type ParkingHomeDto = ParkingHome;
export type ParkingSlotDto = ParkingSlot;
export type VisitorParkingPassDto = VisitorParkingPass;
export type CreateVisitorParkingPassRequestDto = CreateVisitorParkingPassInput;
export type ParkingIncidentDto = ParkingIncident;
export type CreateParkingIncidentRequestDto = CreateParkingIncidentInput;
export type ParkingViolationDto = ParkingViolation;
export type StickerRfidRecordDto = StickerRfidRecord;
export type GuardVehicleLookupResultDto = GuardVehicleLookupResult;
export type ParkingHardwareReadinessDto = ParkingHardwareReadiness;
export type ParkingRulesDto = ParkingRules;

export type ParkingIncidentListParams = {
  unitId?: string;
  status?: string;
  query?: string;
};

export type GuardVehicleLookupQuery = {
  query: string;
};
