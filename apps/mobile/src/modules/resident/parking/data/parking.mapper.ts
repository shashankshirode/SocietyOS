import type {
  GuardVehicleLookupResult,
  Vehicle,
} from '../../../../shared/types/vehicle.types';
import type {
  ParkingHardwareReadiness,
  ParkingHome,
  ParkingIncident,
  ParkingRules,
  ParkingSlot,
  ParkingViolation,
  StickerRfidRecord,
  VisitorParkingPass,
} from '../../../../shared/types/parking.types';
import type {
  GuardVehicleLookupResultDto,
  ParkingHardwareReadinessDto,
  ParkingHomeDto,
  ParkingIncidentDto,
  ParkingRulesDto,
  ParkingSlotDto,
  ParkingViolationDto,
  StickerRfidRecordDto,
  VehicleDto,
  VisitorParkingPassDto,
} from './parking.dto';

export const mapVehicleDtoToDomain = (dto: VehicleDto): Vehicle => ({ ...dto });
export const mapParkingHomeDtoToDomain = (dto: ParkingHomeDto): ParkingHome => ({ ...dto });
export const mapParkingSlotDtoToDomain = (dto: ParkingSlotDto): ParkingSlot => ({ ...dto });
export const mapVisitorParkingPassDtoToDomain = (dto: VisitorParkingPassDto): VisitorParkingPass => ({ ...dto });
export const mapParkingIncidentDtoToDomain = (dto: ParkingIncidentDto): ParkingIncident => ({ ...dto });
export const mapParkingViolationDtoToDomain = (dto: ParkingViolationDto): ParkingViolation => ({ ...dto });
export const mapStickerRfidRecordDtoToDomain = (dto: StickerRfidRecordDto): StickerRfidRecord => ({ ...dto });
export const mapGuardVehicleLookupDtoToDomain = (dto: GuardVehicleLookupResultDto): GuardVehicleLookupResult => ({ ...dto });
export const mapParkingHardwareReadinessDtoToDomain = (dto: ParkingHardwareReadinessDto): ParkingHardwareReadiness => ({ ...dto });
export const mapParkingRulesDtoToDomain = (dto: ParkingRulesDto): ParkingRules => ({ ...dto });
