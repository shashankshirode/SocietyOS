import type { ResidentScopedEntity } from './residentScope.types';

export type ChargeHeadType =
  | 'MAINTENANCE'
  | 'PARKING'
  | 'WATER'
  | 'ELECTRICITY'
  | 'COMMON_AREA_RECOVERY'
  | 'SINKING_FUND'
  | 'REPAIR_FUND'
  | 'AMENITY'
  | 'PENALTY'
  | 'INTEREST'
  | 'MOVE_IN'
  | 'MOVE_OUT'
  | 'MISCELLANEOUS'
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
  | 'PERCENTAGE'
  | 'USAGE_BASED'
  | 'FORMULA_BASED';

export type BillingRuleType =
  | 'FIXED'
  | 'AREA_BASED'
  | 'METER_BASED'
  | 'UNIT_TYPE_BASED'
  | 'PERCENTAGE'
  | 'MANUAL'
  | 'FORMULA_BASED'
  | 'USAGE_BASED';

export type BillingRunStatus =
  | 'DRAFT'
  | 'CALCULATING'
  | 'CALCULATED'
  | 'VALIDATING'
  | 'VALIDATED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'FAILED'
  | 'CANCELLED'
  | 'REQUIRES_REVIEW';

export type InvoiceStatus =
  | 'DRAFT'
  | 'VALIDATED'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'OVERDUE'
  | 'CANCELLED'
  | 'DISPUTED'
  | 'REVERSED'
  | 'SUPERSEDED';

export type PaymentAttemptStatus =
  | 'CREATED'
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'REQUIRES_RECONCILIATION';

export type PaymentTransactionStatus =
  | 'PENDING'
  | 'SETTLED'
  | 'FAILED'
  | 'REVERSED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export type PaymentMode =
  | 'UPI'
  | 'PAYMENT_GATEWAY'
  | 'CASH'
  | 'CHEQUE'
  | 'BANK_TRANSFER'
  | 'ADJUSTMENT'
  | 'ADVANCE'
  | 'OTHER';

export type ChequeStatus =
  | 'RECEIVED'
  | 'DEPOSITED'
  | 'CLEARED'
  | 'BOUNCED'
  | 'CANCELLED';

export type AdjustmentType =
  | 'BILL_CORRECTION'
  | 'PAYMENT_REVERSAL'
  | 'WAIVER'
  | 'PENALTY_WAIVER'
  | 'ROUND_OFF'
  | 'ADVANCE_ADJUSTMENT'
  | 'REFUND_ADJUSTMENT'
  | 'DISCOUNT'
  | 'OTHER';

export type ReconciliationStatus =
  | 'UNMATCHED'
  | 'SUGGESTED_MATCH'
  | 'MATCHED'
  | 'MANUAL_REVIEW'
  | 'RECONCILED'
  | 'REJECTED'
  | 'PARTIALLY_MATCHED';

export type AgeingBucket =
  | '0_30_DAYS'
  | '31_60_DAYS'
  | '61_90_DAYS'
  | '91_120_DAYS'
  | '91_180_DAYS'
  | 'ABOVE_180_DAYS';

export type FinancialExceptionType =
  | 'PARTIAL_PAYMENT'
  | 'ADVANCE_PAYMENT'
  | 'CREDIT_BALANCE'
  | 'WAIVER'
  | 'DISCOUNT'
  | 'LATE_FEE'
  | 'INTEREST'
  | 'BOUNCED_CHEQUE'
  | 'FAILED_UPI'
  | 'DUPLICATE_CALLBACK'
  | 'REFUND'
  | 'REVERSAL'
  | 'ADJUSTMENT'
  | 'UNMATCHED_BANK_TRANSACTION'
  | 'WAIVER_DISCOUNT'
  | 'INTEREST_CHARGE';

export type DocumentType =
  | 'INVOICE'
  | 'RECEIPT'
  | 'CREDIT_NOTE'
  | 'DEBIT_NOTE'
  | 'PAYMENT_RECEIPT'
  | 'BANK_STATEMENT'
  | 'CHEQUE_IMAGE'
  | 'ADJUSTMENT_APPROVAL'
  | 'REFUND_EVIDENCE'
  | 'BANK_RECONCILIATION'
  | 'OTHER';

export interface ChargeHeadConfig extends ResidentScopedEntity {
  id: string;
  code: string;
  name: string;
  type: ChargeHeadType;
  description?: string;
  calculationType: ChargeCalculationMethod;
  calculationConfig?: Record<string, unknown>;
  taxApplicable: boolean;
  taxRate?: number;
  isActive: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
  accountingCategory: string;
  priority: number;
  defaultAmount?: number;
  defaultRate?: number;
  unitOfMeasure?: string;
  applicableUnitTypes?: string[];
  minimumAmount?: number;
  maximumAmount?: number;
  version: number;
  previousVersionId?: string;
}

export interface BillingRule extends ResidentScopedEntity {
  id: string;
  chargeHeadId: string;
  chargeHeadCode: string;
  name: string;
  description?: string;
  ruleType: BillingRuleType;
  formula?: string;
  rate?: number;
  fixedAmount?: number;
  minimumAmount?: number;
  maximumAmount?: number;
  taxApplicable: boolean;
  taxRate?: number;
  unitOfMeasure?: string;
  applicableUnitTypes?: string[];
  applicableUnitCategories?: string[];
  priority: number;
  isActive: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
  version: number;
  previousVersionId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface BillingRun extends ResidentScopedEntity {
  id: string;
  societyId: string;
  name: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  dueDate: string;
  status: BillingRunStatus;
  ruleVersion: string;
  ruleSnapshot: BillingRule[];
  startedAt: string;
  completedAt?: string;
  initiatedBy: string;
  approvedBy?: string;
  approvedAt?: string;
  publishedAt?: string;
  totalUnits: number;
  successfulCount: number;
  failedCount: number;
  skippedCount: number;
  totalAmount: number;
  totalDiscounts: number;
  totalPenalties: number;
  totalInterest: number;
  validationResults: ValidationResult[];
  errors: RunError[];
  correlationId: string;
  metadata?: Record<string, unknown>;
}

export interface ValidationResult {
  ruleId: string;
  ruleName: string;
  unitId: string;
  unitNumber: string;
  passed: boolean;
  errors: string[];
  warnings: string[];
}

export interface RunError {
  code: string;
  message: string;
  unitId?: string;
  chargeHeadId?: string;
  severity: 'ERROR' | 'WARNING' | 'INFO';
}

export interface Invoice extends ResidentScopedEntity {
  id: string;
  societyId: string;
  unitId: string;
  unitNumber: string;
  billingRunId: string;
  invoiceNumber: string;
  billingRunNumber: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  subtotal: number;
  totalDiscounts: number;
  totalPenalties: number;
  totalInterest: number;
  taxAmount: number;
  total: number;
  balance: number;
  currency: string;
  publishedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  supersededAt?: string;
  supersededBy?: string;
  metadata?: Record<string, unknown>;
}

export interface InvoiceLine extends ResidentScopedEntity {
  id: string;
  invoiceId: string;
  chargeHeadId: string;
  chargeHeadCode: string;
  chargeHeadName: string;
  description: string;
  quantity: number;
  unitOfMeasure: string;
  rate: number;
  amount: number;
  taxAmount: number;
  taxRate: number;
  discountAmount: number;
  discountRate: number;
  netAmount: number;
  calculationBasis: string;
  ruleId?: string;
  ruleVersion?: string;
  metadata?: Record<string, unknown>;
}

export interface InvoiceDiscount extends ResidentScopedEntity {
  id: string;
  invoiceId: string;
  lineId?: string;
  type: 'DISCOUNT' | 'WAIVER' | 'EXEMPTION';
  amount: number;
  rate?: number;
  reason: string;
  approvedBy?: string;
  approvedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface InvoicePenalty extends ResidentScopedEntity {
  id: string;
  invoiceId: string;
  lineId?: string;
  type: 'LATE_FEE' | 'INTEREST' | 'PENALTY';
  amount: number;
  rate: number;
  daysOverdue: number;
  calculatedAt: string;
  calculatedBy: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentAttempt extends ResidentScopedEntity {
  id: string;
  invoiceId: string;
  attemptNumber: number;
  status: PaymentAttemptStatus;
  amount: number;
  currency: string;
  paymentMode: PaymentMode;
  gatewayReference?: string;
  gatewayTransactionId?: string;
  gatewayResponse?: Record<string, unknown>;
  initiatedAt: string;
  processedAt?: string;
  completedAt?: string;
  failedAt?: string;
  failureReason?: string;
  failureCode?: string;
  idempotencyKey: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentTransaction extends ResidentScopedEntity {
  id: string;
  paymentAttemptId: string;
  invoiceId: string;
  status: PaymentTransactionStatus;
  amount: number;
  currency: string;
  paymentMode: PaymentMode;
  gatewayTransactionId?: string;
  gatewayReference?: string;
  settledAt?: string;
  settledBy?: string;
  gatewayResponse?: Record<string, unknown>;
  reversalId?: string;
  reversalReason?: string;
  reversalAt?: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentAllocation extends ResidentScopedEntity {
  id: string;
  paymentTransactionId: string;
  invoiceId: string;
  allocatedAmount: number;
  allocatedAt: string;
  allocatedBy: string;
  isAdvance: boolean;
  advanceBalanceId?: string;
  metadata?: Record<string, unknown>;
}

export interface Receipt extends ResidentScopedEntity {
  id: string;
  receiptNumber: string;
  paymentTransactionId: string;
  invoiceId: string;
  unitId: string;
  payerName: string;
  amount: number;
  currency: string;
  paymentMode: PaymentMode;
  paymentDate: string;
  paymentReference: string;
  paymentMethod: string;
  allocations: ReceiptAllocation[];
  status: 'GENERATED' | 'CANCELLED' | 'REVERSED';
  generatedAt: string;
  generatedBy: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  metadata?: Record<string, unknown>;
}

export interface ReceiptAllocation extends ResidentScopedEntity {
  id: string;
  receiptId: string;
  invoiceId: string;
  allocatedAmount: number;
  metadata?: Record<string, unknown>;
}

export interface Adjustment extends ResidentScopedEntity {
  id: string;
  invoiceId?: string;
  paymentTransactionId?: string;
  unitId: string;
  type: AdjustmentType;
  debitCredit: 'DEBIT' | 'CREDIT';
  amount: number;
  reason: string;
  reasonDetails?: string;
  approvedBy?: string;
  approvedAt?: string;
  approvalStatus: 'NOT_REQUIRED' | 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedAt: string;
  appliedBy: string;
  relatedInvoiceId?: string;
  relatedPaymentId?: string;
  metadata?: Record<string, unknown>;
}

export interface Refund extends ResidentScopedEntity {
  id: string;
  originalPaymentTransactionId: string;
  invoiceId: string;
  amount: number;
  currency: string;
  reason: string;
  reasonDetails?: string;
  approvedBy: string;
  approvedAt: string;
  processedAt?: string;
  processedBy?: string;
  refundTransactionId?: string;
  gatewayRefundId?: string;
  status: 'PENDING' | 'APPROVED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  metadata?: Record<string, unknown>;
}

export interface Reversal extends ResidentScopedEntity {
  id: string;
  originalTransactionId: string;
  originalTransactionType: 'PAYMENT' | 'ADJUSTMENT' | 'REFUND' | 'RECEIPT';
  amount: number;
  reason: string;
  reasonDetails?: string;
  approvedBy: string;
  approvedAt: string;
  reversedAt?: string;
  reversedBy?: string;
  reversalTransactionId?: string;
  status: 'PENDING' | 'APPROVED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  metadata?: Record<string, unknown>;
}

export interface LedgerEntryExtended extends ResidentScopedEntity {
  id: string;
  unitId: string;
  entryDate: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  balance: number;
  description: string;
  referenceType: 'INVOICE' | 'PAYMENT' | 'ADJUSTMENT' | 'REFUND' | 'REVERSAL' | 'RECEIPT' | 'ADVANCE' | 'OPENING_BALANCE';
  referenceId: string;
  referenceNumber: string;
  createdBy: string;
  isAuditLocked: boolean;
  isReconciled: boolean;
  reconciledAt?: string;
  reconciledBy?: string;
  metadata?: Record<string, unknown>;
}

export interface OutstandingBalance {
  unitId: string;
  unitNumber: string;
  totalOutstanding: number;
  currentDues: number;
  overdueAmount: number;
  credits: number;
  advances: number;
  ageing: AgeingBreakdown;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  nextDueDate?: string;
  nextDueAmount?: number;
}

export interface AgeingBreakdown {
  current: number;
  days1_30: number;
  days31_60: number;
  days61_90: number;
  days91_120: number;
  days91_180: number;
  above180: number;
}

export interface DefaulterUnitItem {
  unitId: string;
  unitNumber: string;
  wing: string;
  residentName: string;
  outstandingAmount: number;
  overdueAmount: number;
  ageingBucket: AgeingBucket;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  reminderCount: number;
  noticesSent: number;
  isDisputed: boolean;
  disputeReason?: string;
  oldestDueMonth: string;
  daysOverdue: number;
}

export type DefaulterRecord = DefaulterUnitItem;

export interface FinancialException {
  id: string;
  type: FinancialExceptionType;
  unitId: string;
  unitNumber: string;
  amount: number;
  description: string;
  detectedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'IGNORED';
  metadata?: Record<string, unknown>;
}

export interface BankReconciliationRecord extends ResidentScopedEntity {
  id: string;
  statementDate: string;
  bankReference: string;
  amount: number;
  transactionType: 'DEBIT' | 'CREDIT';
  narration?: string;
  probableUnitId?: string;
  probableUnitNumber?: string;
  matchConfidence?: number;
  matchedPaymentId?: string;
  matchedInvoiceId?: string;
  status: ReconciliationStatus;
  matchedBy?: string;
  matchedAt?: string;
  rejectionReason?: string;
  bankName: string;
  bankAccount?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface AgeingReport {
  societyId: string;
  asOfDate: string;
  totalOutstanding: number;
  buckets: {
    bucket: AgeingBucket;
    amount: number;
    count: number;
    percentage: number;
  }[];
  unitBreakdown: {
    unitId: string;
    unitNumber: string;
    amount: number;
    bucket: AgeingBucket;
  }[];
}

export interface CollectionReport {
  societyId: string;
  periodStart: string;
  periodEnd: string;
  totalBilled: number;
  totalCollected: number;
  collectionEfficiency: number;
  byPaymentMode: { mode: PaymentMode; amount: number; count: number; percentage: number }[];
  byChargeHead: { chargeHead: string; billed: number; collected: number; outstanding: number }[];
  byWing: { wing: string; billed: number; collected: number; outstanding: number }[];
  dayWise: { date: string; amount: number; count: number }[];
  failedPayments: number;
  bouncedCheques: number;
}

export interface DefaulterReport {
  societyId: string;
  asOfDate: string;
  totalDefaulters: number;
  totalOutstanding: number;
  defaulters: DefaulterUnitItem[];
}

export interface OutstandingReport {
  societyId: string;
  asOfDate: string;
  totalOutstanding: number;
  currentDues: number;
  overdue: number;
  credits: number;
  advances: number;
  units: OutstandingBalance[];
}

export interface PaymentGatewayConfig {
  provider: string;
  merchantId: string;
  merchantKey: string;
  callbackUrl: string;
  webhookUrl: string;
  supportedModes: PaymentMode[];
  isActive: boolean;
  testMode: boolean;
  metadata?: Record<string, unknown>;
}

export interface PaymentGatewayService {
  createPayment(request: CreatePaymentRequest): Promise<PaymentResponse>;
  verifyPayment(reference: string): Promise<PaymentVerification>;
  handleCallback(payload: unknown): Promise<CallbackResult>;
  refundPayment(request: RefundRequest): Promise<RefundResponse>;
  getPaymentStatus(reference: string): Promise<PaymentStatus>;
}

export interface CreatePaymentRequest {
  amount: number;
  currency: string;
  paymentMode: PaymentMode;
  invoiceId: string;
  unitId: string;
  unitNumber: string;
  payerName: string;
  payerPhone: string;
  payerEmail?: string;
  description: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
  idempotencyKey: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  paymentUrl?: string;
  reference?: string;
  expiresAt?: string;
  error?: string;
}

export interface PaymentVerification {
  isValid: boolean;
  paymentId?: string;
  amount?: number;
  status?: string;
  gatewayResponse?: Record<string, unknown>;
  error?: string;
}

export interface CallbackResult {
  isValid: boolean;
  paymentId?: string;
  amount?: number;
  status?: string;
  invoiceId?: string;
  gatewayReference?: string;
  gatewayTransactionId?: string;
  error?: string;
  duplicate?: boolean;
}

export interface RefundRequest {
  paymentTransactionId: string;
  amount: number;
  reason: string;
  idempotencyKey: string;
}

export interface RefundResponse {
  success: boolean;
  refundId?: string;
  refundTransactionId?: string;
  gatewayRefundId?: string;
  error?: string;
}

export interface PaymentStatus {
  status: PaymentTransactionStatus;
  settledAt?: string;
  gatewayReference?: string;
  gatewayTransactionId?: string;
  gatewayResponse?: Record<string, unknown>;
}

export const CHARGE_HEAD_TYPES: ChargeHeadType[] = [
  'MAINTENANCE', 'PARKING', 'WATER', 'ELECTRICITY', 'COMMON_AREA_RECOVERY',
  'SINKING_FUND', 'REPAIR_FUND', 'AMENITY', 'PENALTY', 'INTEREST',
  'MOVE_IN', 'MOVE_OUT', 'MISCELLANEOUS', 'FUND', 'FACILITY', 'ADJUSTMENT', 'OTHER'
];

export const CALCULATION_METHODS: ChargeCalculationMethod[] = [
  'FIXED', 'AREA_BASED', 'METER_BASED', 'UNIT_TYPE_BASED', 'MANUAL', 'PERCENTAGE', 'USAGE_BASED', 'FORMULA_BASED'
];

export const BILLING_RULE_TYPES: BillingRuleType[] = [
  'FIXED', 'AREA_BASED', 'METER_BASED', 'UNIT_TYPE_BASED', 'PERCENTAGE', 'MANUAL', 'FORMULA_BASED', 'USAGE_BASED'
];

export const BILLING_RUN_STATUSES: BillingRunStatus[] = [
  'DRAFT', 'CALCULATING', 'CALCULATED', 'VALIDATING', 'VALIDATED',
  'UNDER_REVIEW', 'APPROVED', 'PUBLISHED', 'FAILED', 'CANCELLED', 'REQUIRES_REVIEW'
];

export const INVOICE_STATUSES: InvoiceStatus[] = [
  'DRAFT', 'VALIDATED', 'APPROVED', 'PUBLISHED', 'PARTIALLY_PAID',
  'PAID', 'OVERDUE', 'CANCELLED', 'DISPUTED', 'REVERSED', 'SUPERSEDED'
];

export const PAYMENT_ATTEMPT_STATUSES: PaymentAttemptStatus[] = [
  'CREATED', 'PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'CANCELLED', 'EXPIRED', 'REQUIRES_RECONCILIATION'
];

export const PAYMENT_TRANSACTION_STATUSES: PaymentTransactionStatus[] = [
  'PENDING', 'SETTLED', 'FAILED', 'REVERSED', 'REFUNDED', 'PARTIALLY_REFUNDED'
];

export const PAYMENT_MODES: PaymentMode[] = [
  'UPI', 'PAYMENT_GATEWAY', 'CASH', 'CHEQUE', 'BANK_TRANSFER', 'ADJUSTMENT', 'ADVANCE', 'OTHER'
];

export const CHEQUE_STATUSES: ChequeStatus[] = [
  'RECEIVED', 'DEPOSITED', 'CLEARED', 'BOUNCED', 'CANCELLED'
];

export const ADJUSTMENT_TYPES: AdjustmentType[] = [
  'BILL_CORRECTION', 'PAYMENT_REVERSAL', 'WAIVER', 'PENALTY_WAIVER',
  'ROUND_OFF', 'ADVANCE_ADJUSTMENT', 'REFUND_ADJUSTMENT', 'DISCOUNT', 'OTHER'
];

export const RECONCILIATION_STATUSES: ReconciliationStatus[] = [
  'UNMATCHED', 'SUGGESTED_MATCH', 'MATCHED', 'MANUAL_REVIEW', 'RECONCILED', 'REJECTED', 'PARTIALLY_MATCHED'
];

export const AGEING_BUCKETS: AgeingBucket[] = [
  '0_30_DAYS', '31_60_DAYS', '61_90_DAYS', '91_120_DAYS', '91_180_DAYS', 'ABOVE_180_DAYS'
];

export const FINANCIAL_EXCEPTION_TYPES: FinancialExceptionType[] = [
  'PARTIAL_PAYMENT', 'ADVANCE_PAYMENT', 'CREDIT_BALANCE', 'WAIVER', 'DISCOUNT',
  'LATE_FEE', 'INTEREST', 'BOUNCED_CHEQUE', 'FAILED_UPI', 'DUPLICATE_CALLBACK',
  'REFUND', 'REVERSAL', 'ADJUSTMENT', 'UNMATCHED_BANK_TRANSACTION',
  'WAIVER_DISCOUNT', 'INTEREST_CHARGE'
];

export const DOCUMENT_TYPES: DocumentType[] = [
  'INVOICE', 'RECEIPT', 'CREDIT_NOTE', 'DEBIT_NOTE', 'PAYMENT_RECEIPT',
  'BANK_STATEMENT', 'CHEQUE_IMAGE', 'ADJUSTMENT_APPROVAL', 'REFUND_EVIDENCE',
  'BANK_RECONCILIATION', 'OTHER'
];

export function getAgeingBucket(daysOverdue: number): AgeingBucket {
  if (daysOverdue <= 30) return '0_30_DAYS';
  if (daysOverdue <= 60) return '31_60_DAYS';
  if (daysOverdue <= 90) return '61_90_DAYS';
  if (daysOverdue <= 120) return '91_120_DAYS';
  if (daysOverdue <= 180) return '91_180_DAYS';
  return 'ABOVE_180_DAYS';
}

export function calculateAgeing(outstanding: number, dueDate: string, asOfDate: string = new Date().toISOString()): AgeingBreakdown {
  const due = new Date(dueDate);
  const asOf = new Date(asOfDate);
  const daysOverdue = Math.max(0, Math.floor((asOf.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)));
  
  const breakdown: AgeingBreakdown = {
    current: 0,
    days1_30: 0,
    days31_60: 0,
    days61_90: 0,
    days91_120: 0,
    days91_180: 0,
    above180: 0,
  };
  
  if (daysOverdue === 0) breakdown.current = outstanding;
  else if (daysOverdue <= 30) breakdown.days1_30 = outstanding;
  else if (daysOverdue <= 60) breakdown.days31_60 = outstanding;
  else if (daysOverdue <= 90) breakdown.days61_90 = outstanding;
  else if (daysOverdue <= 120) breakdown.days91_120 = outstanding;
  else if (daysOverdue <= 180) breakdown.days91_180 = outstanding;
  else breakdown.above180 = outstanding;
  return breakdown;
}

export function isInvoiceStatusFinal(status: InvoiceStatus): boolean {
  return ['PAID', 'CANCELLED', 'REVERSED', 'SUPERSEDED'].includes(status);
}

export function isPaymentAttemptFinal(status: PaymentAttemptStatus): boolean {
  return ['SUCCESS', 'FAILED', 'CANCELLED', 'EXPIRED'].includes(status);
}

export function isPaymentTransactionFinal(status: PaymentTransactionStatus): boolean {
  return ['SETTLED', 'FAILED', 'REVERSED', 'REFUNDED'].includes(status);
}

export function canTransitionInvoiceStatus(from: InvoiceStatus, to: InvoiceStatus): boolean {
  const transitions: Record<InvoiceStatus, InvoiceStatus[]> = {
    DRAFT: ['VALIDATED', 'CANCELLED'],
    VALIDATED: ['APPROVED', 'CANCELLED'],
    APPROVED: ['PUBLISHED', 'CANCELLED'],
    PUBLISHED: ['PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED', 'DISPUTED'],
    PARTIALLY_PAID: ['PAID', 'OVERDUE', 'CANCELLED', 'DISPUTED'],
    PAID: ['REVERSED', 'SUPERSEDED'],
    OVERDUE: ['PARTIALLY_PAID', 'PAID', 'CANCELLED', 'DISPUTED'],
    CANCELLED: ['DRAFT'],
    DISPUTED: ['PUBLISHED', 'PARTIALLY_PAID', 'PAID', 'CANCELLED'],
    REVERSED: [],
    SUPERSEDED: [],
  };
  return transitions[from]?.includes(to) ?? false;
}

export function canTransitionPaymentAttemptStatus(from: PaymentAttemptStatus, to: PaymentAttemptStatus): boolean {
  const transitions: Record<PaymentAttemptStatus, PaymentAttemptStatus[]> = {
    CREATED: ['PENDING', 'CANCELLED'],
    PENDING: ['PROCESSING', 'CANCELLED', 'EXPIRED'],
    PROCESSING: ['SUCCESS', 'FAILED', 'CANCELLED'],
    SUCCESS: ['REQUIRES_RECONCILIATION'],
    FAILED: ['CREATED', 'REQUIRES_RECONCILIATION'],
    CANCELLED: [],
    EXPIRED: ['CREATED'],
    REQUIRES_RECONCILIATION: ['SUCCESS', 'FAILED'],
  };
  return transitions[from]?.includes(to) ?? false;
}

export function canTransitionPaymentTransactionStatus(from: PaymentTransactionStatus, to: PaymentTransactionStatus): boolean {
  const transitions: Record<PaymentTransactionStatus, PaymentTransactionStatus[]> = {
    PENDING: ['SETTLED', 'FAILED', 'REVERSED'],
    SETTLED: ['REVERSED', 'REFUNDED', 'PARTIALLY_REFUNDED'],
    FAILED: ['PENDING'],
    REVERSED: [],
    REFUNDED: ['PARTIALLY_REFUNDED'],
    PARTIALLY_REFUNDED: ['REFUNDED'],
  };
  return transitions[from]?.includes(to) ?? false;
}

export type Waiver = Adjustment;

export interface AdvanceBalance {
  unitId: string;
  amount: number;
  lastUpdatedAt?: string;
}