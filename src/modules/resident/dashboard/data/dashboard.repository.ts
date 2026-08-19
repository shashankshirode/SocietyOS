import { createRepository } from '../../../../core/dataSource/repositoryFactory';
import { residentDashboardApiSource } from './dashboard.apiSource';
import { residentDashboardMockSource } from './dashboard.mockSource';
import type { ResidentDashboardRepository } from './dashboard.repository.types';

export const residentDashboardRepository = createRepository<
  ResidentDashboardRepository,
  ResidentDashboardRepository
>({
  moduleKey: 'residentDashboard',
  mockRepository: residentDashboardMockSource,
  apiRepository: residentDashboardApiSource,
});

export { getScopedDashboardData } from './dashboard.mockSource';
export default residentDashboardRepository;
