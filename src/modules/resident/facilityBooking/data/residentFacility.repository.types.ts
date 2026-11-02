import type { RepositoryResult } from '../../../../core/repositories/repository.types';
import type { Facility, FacilityCalendarDay, FacilityRules, FacilitySlot } from '../../../../shared/types/facility.types';
import type { CancelFacilityBookingInput, CreateFacilityBookingInput, FacilityBooking, FacilityHome } from '../../../../shared/types/facilityBooking.types';
import type { FacilityListParams } from './facility.dto';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import type { Absent } from '../../../../shared/types/absence.types';

export interface ResidentFacilityRepository {
  getFacilityHome(unitId: string): Promise<RepositoryResult<FacilityHome>>;
  list(context?: ResidentRepositoryRequestContext, params?: FacilityListParams): Promise<RepositoryResult<Facility[]>>;
  detail(context: ResidentRepositoryRequestContext | string, facilityId?: string): Promise<RepositoryResult<Facility | Absent>>;
  slots(context: ResidentRepositoryRequestContext | string, facilityId?: string, date?: string): Promise<RepositoryResult<FacilitySlot[]>>;
  calendar(context: ResidentRepositoryRequestContext | string, facilityId?: string, month?: string): Promise<RepositoryResult<FacilityCalendarDay[]>>;
  rules(context: ResidentRepositoryRequestContext | string, facilityId?: string): Promise<RepositoryResult<FacilityRules | Absent>>;
  createBooking(context: ResidentRepositoryRequestContext | CreateFacilityBookingInput, input?: CreateFacilityBookingInput): Promise<RepositoryResult<FacilityBooking>>;
  cancelBooking(context: ResidentRepositoryRequestContext | CancelFacilityBookingInput, input?: CancelFacilityBookingInput): Promise<RepositoryResult<FacilityBooking>>;
}
