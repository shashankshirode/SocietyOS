import { createRepository } from '../../../../core/dataSource/repositoryFactory';
import { visitorsApiSource } from './visitors.apiSource';
import { visitorsMockSource } from './visitors.mockSource';

export const visitorsRepository = createRepository({
  moduleKey: 'residentVisitors',
  mockRepository: visitorsMockSource,
  apiRepository: visitorsApiSource,
});
