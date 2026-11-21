import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { BillingRepository } from '../data/billing.repository';

type PlaceholderActionInput = { id: string };

export function usePublishBills() {
  const mutation = useRepositoryMutation((input: PlaceholderActionInput) =>
    BillingRepository.publishBillingCycle({ cycleId: input.id }));
  return { data: [], ...mutation };
}
