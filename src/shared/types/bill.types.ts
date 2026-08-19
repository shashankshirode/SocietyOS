import type { ResidentScopedEntity } from './residentScope.types';



export type BillStatus =
  | 'DRAFT'
  | 'GENERATED'
  | 'DUE'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'OVERDUE'
  | 'CANCELLED';

export type PaymentMethod =
  | 'UPI'
  | 'CARD'
  | 'NET_BANKING'
  | 'CASH_CHEQUE';

export type BillLineItemType =
  | 'maintenance'
  | 'sinkingFund'
  | 'repairFund'
  | 'water'
  | 'parking'
  | 'facility'
  | 'penalty'
  | 'lateFee'
  | 'adjustment'
  | 'tax'
  | 'other';

export interface BillLineItem {
  lineItemId: string;
  type: BillLineItemType;
  label: string;
  labelMessageKey: string;
  descriptionMessageKey?: string;
  amount: number;
  currencyCode: string;
  isCredit: boolean;
}

export type BillChargeItem = BillLineItem;

export interface PaymentRecord {
  id: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  transactionId: string;
  receiptNumber: string;
}

export interface Bill extends ResidentScopedEntity {
  id: string;
  billNumber: string;
  flatNumber: string;
  societyName: string;
  title: string;
  amount: number;
  dueDate: string;
  status: BillStatus;
  billingPeriod: string;
  paidAmount?: number;
  lateFee?: number;
  charges: BillLineItem[];
  payments?: PaymentRecord[];
  notes?: string;
  receiptNumber?: string;
  transactionId?: string;
  paidDate?: string;
  billMonth?: string;
}
