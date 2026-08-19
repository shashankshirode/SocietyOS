import { useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { hardwareIntegrationRepository } from '../data/hardwareIntegration.repository';
import type { AnprVehicleMatchReview } from '../../../shared/types/gateHardware.types';

export function useAnprVehicleMatchReview(eventId: string) {
  return useRepositoryMutation((input: Pick<AnprVehicleMatchReview, 'reviewerDecision' | 'notes'>) => hardwareIntegrationRepository.reviewAnprVehicleMatch(eventId, input));
}
