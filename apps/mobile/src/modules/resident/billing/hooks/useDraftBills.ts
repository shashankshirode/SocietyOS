import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { BillingRepository } from '../data/billing.repository';

type PlaceholderActionInput = { id: string };

export function useDraftBills() {
  const mutation = useRepositoryMutation((input: PlaceholderActionInput) =>
    BillingRepository.listDraftBills({ search: input.id }));
  return { data: [], ...mutation };
}
