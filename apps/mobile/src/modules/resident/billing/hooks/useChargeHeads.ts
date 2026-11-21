import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { BillingRepository } from '../data/billing.repository';

type PlaceholderActionInput = { id: string };

export function useChargeHeads() {
  const mutation = useRepositoryMutation((input: PlaceholderActionInput) =>
    BillingRepository.listChargeHeads({ search: input.id }));
  return { data: [], ...mutation };
}
