import { createRepository } from '../../../../core/dataSource/repositoryFactory';
import { governanceApiSource } from './governance.apiSource';
import { governanceMockSource } from './governance.mockSource';

export const governanceRepository = createRepository({
  moduleKey: 'residentGovernance',
  mockRepository: governanceMockSource,
  apiRepository: governanceApiSource,
});
