import { createRepository } from '../../../../core/dataSource/repositoryFactory';
import { residentHouseholdApiSource } from './residentHousehold.apiSource';
import { residentHouseholdMockSource } from './residentHousehold.mockSource';
import type { ResidentHouseholdRepository } from './residentHousehold.repository.types';

export const residentHouseholdRepository = createRepository<ResidentHouseholdRepository, ResidentHouseholdRepository>({
  moduleKey: 'residentHousehold',
  mockRepository: residentHouseholdMockSource,
  apiRepository: residentHouseholdApiSource,
});
