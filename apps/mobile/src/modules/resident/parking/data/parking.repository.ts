import { createRepository } from '../../../../core/dataSource/repositoryFactory';
import { parkingApiSource } from './parking.apiSource';
import { parkingMockSource } from './parking.mockSource';

export const parkingRepository = createRepository({
  moduleKey: 'residentParking',
  mockRepository: parkingMockSource,
  apiRepository: parkingApiSource,
});
