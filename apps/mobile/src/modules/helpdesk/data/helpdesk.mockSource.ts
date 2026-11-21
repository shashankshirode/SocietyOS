import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../core/repositories/repository.types';
import { mockFaqItems } from '../../../shared/mock/helpdesk.mock';
import type { FaqItem } from '../../../shared/types/helpdesk.types';

export const helpdeskMockSource = {
  async faqs(): Promise<RepositoryResult<FaqItem[]>> {
    await withMockDelay();
    return repositorySuccess(mockFaqItems);
  },
};

