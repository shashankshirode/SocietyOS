import { useRepositoryResult, useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';
import type { CctvAccessRequest } from '../../../shared/types/cctv.types';

export function useCctvAccessPlaceholder() {
  const result = useRepositoryResult(() => hardwareIntegrationRepository.getCctvAccessPlaceholder(), []);
  const requestMutation = useRepositoryMutation((input: Pick<CctvAccessRequest, 'cameraId' | 'reason' | 'durationMinutes'>) => hardwareIntegrationRepository.createCctvAccessRequestPlaceholder(input));
  return { ...result, requestAccess: requestMutation.submit, isRequesting: requestMutation.isSubmitting };
}
