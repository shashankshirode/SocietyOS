import { createRepository } from '../../../../core/dataSource/repositoryFactory';
import { occupancyApiSource } from './occupancy.apiSource';
import { occupancyMockSource } from './occupancy.mockSource';

export const occupancyRepository = createRepository({
  moduleKey: 'residentMoveInMoveOut',
  mockRepository: occupancyMockSource,
  apiRepository: occupancyApiSource,
});
