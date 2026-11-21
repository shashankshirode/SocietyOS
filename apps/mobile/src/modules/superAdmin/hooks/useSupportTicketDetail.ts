import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { superAdminRepository } from '../data/superAdmin.repository';

export function useSupportTicketDetail(ticketId: string) {
  return useRepositoryResult(() => superAdminRepository.getSupportTicketDetail(ticketId), [ticketId]);
}
