

export type LedgerEntryType =
  | 'OPENING_BALANCE'
  | 'BILL'
  | 'PAYMENT'
  | 'PENALTY'
  | 'ADJUSTMENT'
  | 'REVERSAL'
  | 'ADVANCE'
  | 'REFUND';

export interface LedgerEntry {
  id: string;
  date: string;
  type: LedgerEntryType;
  referenceNumber: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  createdBy: string;
  isAuditLocked: boolean;
  relatedEntityId?: string;
  relatedEntityType?: string;
}

export interface FlatLedger {
  unitId: string;
  unitNumber: string;
  wing: string;
  ownerName: string;
  tenantName?: string;
  openingBalance: number;
  closingBalance: number;
  totalDebits: number;
  totalCredits: number;
  lastUpdatedAt: string;
  entries: LedgerEntry[];
}

export interface LedgerSummary {
  unitId: string;
  unitNumber: string;
  wing: string;
  currentBalance: number;
  lastBillDate?: string;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  outstandingAmount: number;
  advanceAmount: number;
}
