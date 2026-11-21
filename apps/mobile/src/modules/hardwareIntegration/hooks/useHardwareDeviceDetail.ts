import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';

export function useHardwareDeviceDetail(deviceId: string) {
  return useRepositoryResult(() => hardwareIntegrationRepository.getHardwareDeviceDetail(deviceId), [deviceId]);
}
