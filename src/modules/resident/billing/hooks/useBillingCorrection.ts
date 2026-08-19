import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { BillingRepository } from '../data/billing.repository';

type PlaceholderActionInput = { id: string };

export function useBillingCorrection() {
  const mutation = useRepositoryMutation((input: PlaceholderActionInput) =>
    BillingRepository.createBillingCorrectionRequest({ billId: input.id, reason: input.id }));
  return { data: [], ...mutation };
}
