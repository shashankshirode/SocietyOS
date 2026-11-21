import { useRepositoryResult, useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';
import type { RequestBarrierOverrideCommand } from '../../../shared/types/hardware.types';

export function useBoomBarrierPlaceholder() {
  const barriers = useRepositoryResult(() => hardwareIntegrationRepository.getBoomBarriers(), []);
  const manualOverride = useRepositoryMutation((input: RequestBarrierOverrideCommand) => 
    hardwareIntegrationRepository.requestBoomBarrierManualOverride(input)
  );
  return { ...barriers, manualOverride: manualOverride.submit, isOverriding: manualOverride.isSubmitting };
}