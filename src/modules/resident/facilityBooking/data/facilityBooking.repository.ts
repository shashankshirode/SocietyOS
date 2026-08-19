import { resolveDataSource } from '../../../../core/dataSource/dataSourceResolver';
import { facilityBookingRemoteRepository } from '../api/facilityBookingRemoteRepository';
import { facilityBookingMockRepository } from '../mock/facilityBookingMockRepository';
import type { FacilityBookingRepository } from './facilityBooking.repositoryContract';

const resolution = resolveDataSource('residentFacilityBooking');

export const facilityBookingRepository: FacilityBookingRepository = resolution.isApi
  ? facilityBookingRemoteRepository
  : facilityBookingMockRepository;

export default facilityBookingRepository;
