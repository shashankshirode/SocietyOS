import { createRepository } from '../../../../core/dataSource/repositoryFactory';
import { emergencyApiSource } from './emergency.apiSource';
import { emergencyMockSource } from './emergency.mockSource';

export const emergencyRepository = createRepository({
  moduleKey: 'residentEmergency',
  mockRepository: emergencyMockSource,
  apiRepository: emergencyApiSource,
});
