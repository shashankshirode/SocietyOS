import type { Bill, PaymentMethod } from '../../../../shared/types/bill.types';

export type BillDto = Partial<Bill> & Pick<Bill, 'id'>;

export type MockPaymentRequestDto = {
  billId: string;
  paymentMethod: PaymentMethod;
  amount: number;
};

export type MockPaymentConfirmation = {
  transactionId: string;
  receiptNumber: string;
  paymentDate: string;
};

