import { createRepository } from '../../../../core/dataSource/repositoryFactory';
import { residentLifecycleApiSource } from './residentLifecycle.apiSource';
import { residentLifecycleMockSource } from './residentLifecycle.mockSource';
import type { ResidentLifecycleRepository } from './residentLifecycle.types';

export const residentLifecycleRepository = createRepository<ResidentLifecycleRepository, ResidentLifecycleRepository>({
  moduleKey: 'residentLifecycle',
  mockRepository: residentLifecycleMockSource,
  apiRepository: residentLifecycleApiSource,
});
