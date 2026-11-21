import { createRepository } from '../../../../core/dataSource/repositoryFactory';
import { facilityApiSource } from './facility.apiSource';
import { facilityMockSource } from './facility.mockSource';

export const facilityRepository = createRepository({
  moduleKey: 'residentFacilityBooking',
  mockRepository: facilityMockSource,
  apiRepository: facilityApiSource,
});
