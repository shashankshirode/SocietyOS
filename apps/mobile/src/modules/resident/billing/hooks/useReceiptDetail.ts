import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { BillingRepository } from '../data/billing.repository';

type ReceiptDetailInput = { id: string };

export function useReceiptDetail() {
  const mutation = useRepositoryMutation((input: ReceiptDetailInput) =>
    BillingRepository.getReceiptById(input.id));
  return { data: [], ...mutation };
}
