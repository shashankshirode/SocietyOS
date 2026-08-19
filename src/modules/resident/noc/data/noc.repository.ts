import { createRepository } from '../../../../core/dataSource/repositoryFactory';
import { nocApiSource } from './noc.apiSource';
import { nocMockSource } from './noc.mockSource';

export const nocRepository = createRepository({
  moduleKey: 'residentNoc',
  mockRepository: nocMockSource,
  apiRepository: nocApiSource,
});
