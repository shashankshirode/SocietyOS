

export type ChargeHeadType =
  | 'MAINTENANCE'
  | 'PARKING'
  | 'WATER'
  | 'PENALTY'
  | 'FUND'
  | 'FACILITY'
  | 'ADJUSTMENT'
  | 'OTHER';

export type ChargeCalculationMethod =
  | 'FIXED'
  | 'AREA_BASED'
  | 'METER_BASED'
  | 'UNIT_TYPE_BASED'
  | 'MANUAL'
  | 'PERCENTAGE';

export type BillingCycleStatus =
  | 'DRAFT'
  | 'CALCULATED'
  | 'UNDER_REVIEW'
  | 'PUBLISHED'
  | 'CLOSED'
  | 'CANCELLED';

export type BillAdminStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'OVERDUE'
  | 'DISPUTED'
  | 'CANCELLED'
  | 'REVERSED';

export type PaymentMode =
  | 'UPI'
  | 'PAYMENT_GATEWAY'
  | 'CASH'
  | 'CHEQUE'
  | 'BANK_TRANSFER'
  | 'ADJUSTMENT'
  | 'ADVANCE';

export type PaymentAdminStatus =
  | 'PENDING'
  | 'RECORDED'
  | 'RECEIPT_GENERATED'
  | 'FAILED'
  | 'REVERSED'
  | 'PENDING_APPROVAL';

export type ReceiptStatus =
  | 'GENERATED'
  | 'CANCELLED'
  | 'REVERSED'
  | 'PENDING_APPROVAL';

export type AdjustmentType =
  | 'BILL_CORRECTION'
  | 'PAYMENT_REVERSAL'
  | 'WAIVER'
  | 'PENALTY_WAIVER'
  | 'ROUND_OFF'
  | 'ADVANCE_ADJUSTMENT'
  | 'REFUND_ADJUSTMENT'
  | 'OTHER';

export type ReconciliationStatus =
  | 'UNMATCHED'
  | 'SUGGESTED_MATCH'
  | 'MATCHED'
  | 'MANUAL_REVIEW'
  | 'RECONCILED'
  | 'REJECTED';

export type AgeingBucket =
  | '0_30_DAYS'
  | '31_60_DAYS'
  | '61_90_DAYS'
  | 'ABOVE_90_DAYS';



export interface ChargeHead {
  id: string;
  name: string;
  type: ChargeHeadType;
  calculationMethod: ChargeCalculationMethod;
  defaultAmount?: number;
  defaultRate?: number;
  taxApplicable: boolean;
  isActive: boolean;
  usedInBillingCycle: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BillingCycle {
  id: string;
  cycleName: string;
  month: string;
  year: number;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  dueDate: string;
  status: BillingCycleStatus;
  applicableTowers: string[];
  totalUnits: number;
  draftBillsCount: number;
  publishedBillsCount: number;
  totalAmount: number;
  collectedAmount: number;
  outstandingAmount: number;
  chargeHeadIds: string[];
  includePenalties: boolean;
  includePreviousDues: boolean;
  notes?: string;
  createdBy: string;
  createdAt: string;
  calculatedAt?: string;
  publishedAt?: string;
}

export interface DraftBill {
  id: string;
  billingCycleId: string;
  unitId: string;
  unitNumber: string;
  wing: string;
  ownerName: string;
  tenantName?: string;
  previousDue: number;
  currentCharges: number;
  penalty: number;
  adjustments: number;
  totalPayable: number;
  status: BillAdminStatus;
  hasWarning: boolean;
  warningMessage?: string;
  chargeBreakup: { chargeHead: string; amount: number }[];
}

export interface CollectionSummary {
  totalBilled: number;
  totalCollected: number;
  outstanding: number;
  collectionEfficiency: number;
  defaulterCount: number;
  pendingManualEntries: number;
  failedPayments: number;
  reconciliationPending: number;
  adjustmentsThisMonth: number;
  advanceExcessPayments: number;
  byPaymentMode: { mode: PaymentMode; amount: number; count: number; percentage: number }[];
  dayWise: { date: string; amount: number; count: number }[];
  wingWise: { wing: string; collected: number; outstanding: number }[];
  recentCollections: ManualPaymentRecord[];
}

export interface ManualPaymentRecord {
  id: string;
  paymentNumber: string;
  unitId: string;
  unitNumber: string;
  wing: string;
  residentName: string;
  amount: number;
  paymentMode: PaymentMode;
  paymentDate: string;
  referenceNumber: string;
  bankName?: string;
  chequeNumber?: string;
  notes?: string;
  receivedBy: string;
  status: PaymentAdminStatus;
  receiptId?: string;
  receiptNumber?: string;
  createdAt: string;
  requiresApproval: boolean;
}

export interface AdminReceipt {
  id: string;
  receiptNumber: string;
  paymentId: string;
  paymentNumber: string;
  unitId: string;
  unitNumber: string;
  wing: string;
  residentName: string;
  amount: number;
  paymentMode: PaymentMode;
  paymentDate: string;
  referenceNumberMasked: string;
  receivedBy: string;
  createdAt: string;
  status: ReceiptStatus;
  ledgerImpact: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancelReason?: string;
}

export interface Defaulter {
  unitId: string;
  unitNumber: string;
  wing: string;
  residentDisplayName: string;
  outstandingAmount: number;
  ageingBucket: AgeingBucket;
  lastPaymentDate?: string;
  reminderCount: number;
  noticesSent: number;
  isDisputed: boolean;
  disputeReason?: string;
  oldestDueMonth: string;
}

export interface BankTransaction {
  id: string;
  transactionDate: string;
  bankReference: string;
  amount: number;
  probableUnitNumber?: string;
  probableUnitId?: string;
  suggestedPaymentId?: string;
  matchConfidence?: number;
  status: ReconciliationStatus;
  matchedBy?: string;
  matchedAt?: string;
  rejectionReason?: string;
  bankName: string;
  narration?: string;
}

export interface AdjustmentEntry {
  id: string;
  referenceNumber: string;
  unitId: string;
  unitNumber: string;
  wing: string;
  relatedBillId?: string;
  relatedPaymentId?: string;
  adjustmentType: AdjustmentType;
  debitCredit: 'DEBIT' | 'CREDIT';
  amount: number;
  reason: string;
  approvalRequired: boolean;
  approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  createdBy: string;
  createdAt: string;
  supportingDocumentPlaceholder?: string;
}

export interface TreasurerDashboardData {
  totalBilledThisMonth: number;
  totalCollectedThisMonth: number;
  outstandingDues: number;
  collectionEfficiency: number;
  defaulterCount: number;
  pendingManualEntries: number;
  failedPaymentsPlaceholder: number;
  reconciliationPending: number;
  adjustmentsThisMonth: number;
  advanceExcessPayments: number;
  billingCycleStatus: BillingCycle | null;
  recentCollections: ManualPaymentRecord[];
  topDefaulters: Defaulter[];
  lastUpdatedAt: string;
}



export interface GenerateBillsInput {
  billingCycleMonth: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  dueDate: string;
  applicableTowers: string[];
  chargeHeadIds: string[];
  includeParkingCharges: boolean;
  includePenalties: boolean;
  includePreviousDues: boolean;
  notes?: string;
}

export interface ManualPaymentInput {
  unitId: string;
  amount: number;
  paymentMode: PaymentMode;
  paymentDate: string;
  referenceNumber: string;
  bankName?: string;
  chequeNumber?: string;
  notes?: string;
  confirmationChecked: boolean;
}

export interface AdjustmentInput {
  unitId: string;
  relatedBillId?: string;
  relatedPaymentId?: string;
  adjustmentType: AdjustmentType;
  debitCredit: 'DEBIT' | 'CREDIT';
  amount: number;
  reason: string;
  confirmationChecked: boolean;
}
