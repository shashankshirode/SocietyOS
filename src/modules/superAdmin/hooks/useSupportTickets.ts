import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { superAdminRepository } from '../data/superAdmin.repository';

export function useSupportTickets() {
  return useRepositoryResult(() => superAdminRepository.getSupportTickets(), []);
}
