import { repositorySuccess, type RepositoryResult } from '../../../core/repositories/repository.types';
import type { FaqItem } from '../../../shared/types/helpdesk.types';

export const helpdeskApiSource = {
  async faqs(): Promise<RepositoryResult<FaqItem[]>> {
    return repositorySuccess([]);
  },
};

