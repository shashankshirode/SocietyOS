import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { automationRepository } from '../data/automation.repository';

export function useAutomationAuditLog() {
  return useRepositoryResult(() => automationRepository.listAutomationAuditLogs(), []);
}
