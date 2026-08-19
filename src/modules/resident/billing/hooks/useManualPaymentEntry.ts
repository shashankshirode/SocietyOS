import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { BillingRepository } from '../data/billing.repository';

type PlaceholderActionInput = { id: string };

export function useManualPaymentEntry() {
  const mutation = useRepositoryMutation((input: PlaceholderActionInput) =>
    BillingRepository.recordManualPayment({
      unitId: input.id,
      amount: 0,
      paymentMethod: 'CASH_CHEQUE',
    }));
  return { data: [], ...mutation };
}
