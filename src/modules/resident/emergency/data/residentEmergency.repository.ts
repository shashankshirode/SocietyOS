import { createRepository } from '../../../../core/dataSource/repositoryFactory';
import { residentEmergencyApiSource } from './residentEmergency.apiSource';
import { residentEmergencyMockSource } from './residentEmergency.mockSource';

export const residentEmergencyRepository = createRepository({
  moduleKey: 'residentEmergency',
  mockRepository: residentEmergencyMockSource,
  apiRepository: residentEmergencyApiSource,
});
