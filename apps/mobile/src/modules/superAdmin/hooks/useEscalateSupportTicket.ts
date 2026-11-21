import { useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { superAdminRepository } from '../data/superAdmin.repository';
import type { SupportTicketEscalationDto } from '../data/superAdmin.dto';

export function useEscalateSupportTicket() {
  return useRepositoryMutation((input: SupportTicketEscalationDto) => superAdminRepository.escalateSupportTicket(input));
}
