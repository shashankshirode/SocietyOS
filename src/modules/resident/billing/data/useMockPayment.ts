import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import type { PaymentMethod } from '../../../../shared/types/bill.types';
import { billRepository } from './billing.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export type MockPaymentInput = {
  billId: string;
  paymentMethod: PaymentMethod;
  amount: number;
};

export function useMockPayment() {
  const { activeContext } = useActiveResidentHome();
  const context = {
    activeHome: activeContext,
    dataScopeKey: activeContext.dataScopeKey,
  };
  return useRepositoryMutation((input: MockPaymentInput) => billRepository.mockPayment(context, input));
}
export default useMockPayment;
