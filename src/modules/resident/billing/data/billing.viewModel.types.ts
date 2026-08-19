
import type { BadgeType } from '../../../../shared/utils/statusPresentation';

export type BillDetailViewModel = {
  id: string;
  billNumber: string;
  flatNumber: string;
  societyName: string;
  title: string;
  formattedAmount: string;
  rawAmount: number;
  formattedDueDate: string;
  statusLabel: string;
  statusTone: BadgeType;
  billingPeriod: string;
  formattedPaidAmount: string;
  formattedLateFee: string;
  charges: BillChargeViewModel[];
  payments: BillPaymentViewModel[];
  notes: string;
  isPaid: boolean;
  formattedRemainingAmount: string;
  rawRemainingAmount: number;
};

export type BillChargeViewModel = {
  label: string;
  formattedAmount: string;
};

export type BillPaymentViewModel = {
  id: string;
  formattedAmount: string;
  formattedDate: string;
  paymentMethod: string;
  transactionId: string;
  receiptNumber: string;
};

export type BillListItemViewModel = {
  id: string;
  title: string;
  formattedAmount: string;
  formattedDueDate: string;
  statusLabel: string;
  statusTone: BadgeType;
  billingPeriod: string;
  isPaid: boolean;
};
