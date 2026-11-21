import { createRepository } from '../../../../core/dataSource/repositoryFactory';
import { residentApiSource } from './resident.apiSource';
import { residentMockSource } from './resident.mockSource';

export const residentRepository = createRepository({
  moduleKey: 'residentProfile',
  mockRepository: residentMockSource,
  apiRepository: residentApiSource,
});
