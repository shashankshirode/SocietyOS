import type {
  Bill,
  BillLineItem,
  BillLineItemType,
  PaymentMethod,
} from '../../../../shared/types/bill.types';

export type { BillLineItem, BillLineItemType };

export type BillListFilter = 'all' | 'unpaid' | 'paid' | 'overdue';

export type ResidentBillPageCursor = string | null;

export type ResidentBillListPageRequest = {
  filter: BillListFilter;
  cursor: ResidentBillPageCursor;
  pageSize: number;
};

export type ResidentBillListItem = Bill;
export type ResidentBillDetail = Bill;

export type ResidentBillListPage = {
  bills: ResidentBillListItem[];
  nextCursor: ResidentBillPageCursor;
  hasMore: boolean;
};

export type ResidentBillingSummary = {
  totalOutstanding: number;
  pendingBillCount: number;
  latestBill: ResidentBillListItem | null;
  currencyCode: string;
  advanceBalance?: number;
  overdueAmount?: number;
  unpaidBillCount?: number;
  overdueBillCount?: number;
};

export type ResidentLedgerPageCursor = string | null;

export type ResidentLedgerPageRequest = {
  cursor: ResidentLedgerPageCursor;
  pageSize: number;
};

export type ResidentLedgerEntryKind = 'billIssued' | 'paymentReceived';

export type ResidentLedgerEntry = {
  id: string;
  billId: string;
  billTitle: string;
  kind: ResidentLedgerEntryKind;
  amount: number;
  currencyCode: string;
  occurredAt: string;
  paymentMethod?: PaymentMethod;
};

export type ResidentLedgerPage = {
  entries: ResidentLedgerEntry[];
  nextCursor: ResidentLedgerPageCursor;
  hasMore: boolean;
};
