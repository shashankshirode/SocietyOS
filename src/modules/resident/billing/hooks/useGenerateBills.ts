import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { BillingRepository } from '../data/billing.repository';

type PlaceholderActionInput = { id: string };

export function useGenerateBills() {
  const mutation = useRepositoryMutation((input: PlaceholderActionInput) =>
    BillingRepository.generateMonthlyBills({ billingMonth: input.id }));
  return { data: [], ...mutation };
}
