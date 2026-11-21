export type FinancePayableStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'PAID'
  | 'FAILED'
  | 'REVERSED';

export interface FinancePayableRequest {
  id: string;
  invoiceId: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  currency: string;
  dueDate: string;
  sourceOperationId: string;
  status: FinancePayableStatus;
  financeReferenceId?: string;
  createdAt: string;
  settledAt?: string;
}

export interface FinancePayableHandoffResult {
  success: boolean;
  payableRequestId: string;
  financeReferenceId?: string;
  status: FinancePayableStatus;
  errorMessage?: string;
}
