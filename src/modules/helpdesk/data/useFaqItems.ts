import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { helpdeskRepository } from './helpdesk.repository';

export function useFaqItems() {
  return useRepositoryResult(() => helpdeskRepository.faqs(), []);
}

