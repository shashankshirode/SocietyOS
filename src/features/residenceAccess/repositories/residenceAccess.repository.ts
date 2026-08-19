import { createRepository } from '../../../core/dataSource/repositoryFactory';
import type { ResidenceAccessRepository } from './residenceAccess.repository.types';
import { mockResidenceAccessRepository } from './MockResidenceAccessRepository';
import { remoteResidenceAccessRepository } from './RemoteResidenceAccessRepository';

export const residenceAccessRepository: ResidenceAccessRepository = createRepository<
  ResidenceAccessRepository,
  ResidenceAccessRepository
>({
  moduleKey: 'residenceAccess',
  mockRepository: mockResidenceAccessRepository,
  apiRepository: remoteResidenceAccessRepository,
});
