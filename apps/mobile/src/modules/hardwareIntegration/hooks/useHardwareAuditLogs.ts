import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';

export function useHardwareAuditLogs() {
  return useRepositoryResult(() => hardwareIntegrationRepository.getHardwareAuditLogs(), []);
}
