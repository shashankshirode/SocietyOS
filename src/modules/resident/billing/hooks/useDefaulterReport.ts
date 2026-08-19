import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { BillingRepository } from '../data/billing.repository';

type PlaceholderActionInput = { id: string };

export function useDefaulterReport() {
  const mutation = useRepositoryMutation((input: PlaceholderActionInput) =>
    BillingRepository.listDefaulters({ search: input.id }));
  return { data: [], ...mutation };
}
