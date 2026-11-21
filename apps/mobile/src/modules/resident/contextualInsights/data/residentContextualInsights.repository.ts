import { createRepository } from '../../../../core/dataSource/repositoryFactory';
import { residentContextualInsightsApiSource } from './residentContextualInsights.apiSource';
import { residentContextualInsightsMockSource } from './residentContextualInsights.mockSource';
import type { ResidentContextualInsightsRepository } from './residentContextualInsights.repository.types';

export const residentContextualInsightsRepository = createRepository<
  ResidentContextualInsightsRepository,
  ResidentContextualInsightsRepository
>({
  moduleKey: 'residentContextualInsights',
  mockRepository: residentContextualInsightsMockSource,
  apiRepository: residentContextualInsightsApiSource,
});
export default residentContextualInsightsRepository;
