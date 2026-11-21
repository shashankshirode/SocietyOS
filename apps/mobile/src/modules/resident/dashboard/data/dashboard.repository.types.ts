import type { RepositoryResult } from '../../../../core/repositories/repository.types';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import type { ResidentDashboardData } from './dashboard.types';

export type ResidentDashboardRequestContext = ResidentRepositoryRequestContext & {
  societyId: string;
  unitId: string;
  residentProfileId: string;
  locale: string;
  timezone: string;
};

export type ResidentDashboardRepository = {
  getDashboardSections(
    context: ResidentDashboardRequestContext
  ): Promise<RepositoryResult<ResidentDashboardData>>;
};
