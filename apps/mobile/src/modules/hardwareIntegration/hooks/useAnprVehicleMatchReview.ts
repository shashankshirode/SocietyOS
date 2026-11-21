import { useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';
import type { ReviewAnprMatchCommand } from '../../../shared/types/hardware.types';

export function useAnprVehicleMatchReview(eventId: string) {
  return useRepositoryMutation((input: ReviewAnprMatchCommand) => hardwareIntegrationRepository.reviewAnprVehicleMatch(eventId, input));
}