import { createRepository } from '../../../../core/dataSource/repositoryFactory';
import { residentHomeContextApiSource } from './residentHomeContext.apiSource';
import { residentHomeContextMockSource } from './residentHomeContext.mockSource';
import type { ResidentHomeContextRepository } from './residentHomeContext.repository.types';

export const residentHomeContextRepository = createRepository<ResidentHomeContextRepository, ResidentHomeContextRepository>({
  moduleKey: 'residentHomeContext',
  mockRepository: residentHomeContextMockSource,
  apiRepository: residentHomeContextApiSource,
});
export default residentHomeContextRepository;
