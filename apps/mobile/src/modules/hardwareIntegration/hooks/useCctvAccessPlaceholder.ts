import { useRepositoryResult, useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';
import type { RequestCctvAccessCommand } from '../../../shared/types/hardware.types';

export function useCctvAccessPlaceholder() {
  const result = useRepositoryResult(() => hardwareIntegrationRepository.getCctvAccessRequests(), []);
  const requestMutation = useRepositoryMutation((input: RequestCctvAccessCommand) => hardwareIntegrationRepository.createCctvAccessRequest(input));
  return { ...result, requestAccess: requestMutation.submit, isRequesting: requestMutation.isSubmitting };
}