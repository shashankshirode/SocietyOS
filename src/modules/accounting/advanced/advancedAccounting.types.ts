import type { JsonObject } from '../../../core/api/api.types';

export type BankTransaction = {
  id: string;
  bankAccountId: string;
  date: string;
  valueDate: string;
  description: string;
  reference: string;
  debitAmount: number;
  creditAmount: number;
  balance: number;
  category?: string;
  matched: boolean;
  matchedEntryId?: string;
  matchedAt?: string;
  matchedBy?: string;
  rawData: JsonObject;
};

export type BankStatement = {
  id: string;
  bankAccountId: string;
  statementPeriodStart: string;
  statementPeriodEnd: string;
  openingBalance: number;
  closingBalance: number;
  transactions: BankTransaction[];
  uploadedAt: string;
  uploadedBy: string;
  fileHash: string;
  status: 'UPLOADED' | 'PARSED' | 'MATCHING' | 'MATCHED' | 'RECONCILED' | 'DISCREPANCY';
};

export type ReconciliationSession = {
  id: string;
  bankAccountId: string;
  statementId: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'DISCREPANCY' | 'APPROVED';
  startedAt: string;
  startedBy: string;
  completedAt?: string;
  completedBy?: string;
  matchedCount: number;
  unmatchedCount: number;
  discrepancyAmount: number;
  notes?: string;
};

export type ReconciliationMatch = {
  id: string;
  sessionId: string;
  bankTransactionId: string;
  ledgerEntryId: string;
  matchType: 'AUTO' | 'MANUAL' | 'RULE_BASED';
  confidence: number;
  matchedAt: string;
  matchedBy: string;
};

export type ReconciliationDiscrepancy = {
  id: string;
  sessionId: string;
  type: 'AMOUNT_MISMATCH' | 'MISSING_IN_BANK' | 'MISSING_IN_LEDGER' | 'DATE_MISMATCH' | 'DUPLICATE';
  bankTransactionId?: string;
  ledgerEntryId?: string;
  amount: number;
  description: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'ADJUSTED';
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: string;
};

export type GSTReturn = {
  id: string;
  societyId: string;
  returnPeriod: string;
  returnType: 'GSTR1' | 'GSTR3B' | 'GSTR9' | 'GSTR9C';
  status: 'DRAFT' | 'VALIDATED' | 'FILED' | 'ERROR' | 'AMENDED';
  totalOutwardSupplies: number;
  totalInwardSupplies: number;
  totalTaxLiability: number;
  totalITC: number;
  netTaxPayable: number;
  interestPayable: number;
  lateFeePayable: number;
  filedAt?: string;
  filedBy?: string;
  acknowledgementNumber?: string;
  errorDetails?: string;
  createdAt: string;
  updatedAt: string;
};

export type GSTInvoice = {
  id: string;
  returnId: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceType: 'B2B' | 'B2C' | 'EXPORT' | 'SEZ';
  placeOfSupply: string;
  reverseCharge: boolean;
  taxableValue: number;
  igstAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  cessAmount: number;
  hsnCode: string;
  gstin?: string;
  status: 'VALID' | 'ERROR' | 'AMENDED';
};

export type TDSReturn = {
  id: string;
  societyId: string;
  quarter: string;
  financialYear: string;
  formType: '24Q' | '26Q' | '27Q' | '27EQ';
  status: 'DRAFT' | 'VALIDATED' | 'FILED' | 'ERROR';
  totalDeducted: number;
  totalDeposited: number;
  interestPayable: number;
  lateFeePayable: number;
  filedAt?: string;
  filedBy?: string;
  acknowledgementNumber?: string;
  createdAt: string;
  updatedAt: string;
};

export type TDSDeduction = {
  id: string;
  returnId: string;
  deducteePAN: string;
  deducteeName: string;
  sectionCode: string;
  natureOfPayment: string;
  amountPaid: number;
  taxDeducted: number;
  dateOfDeduction: string;
  dateOfDeposit: string;
  challanNumber: string;
  bsrCode: string;
  status: 'VALID' | 'ERROR';
};

export type MonthEndCloseTask = {
  id: string;
  societyId: string;
  period: string;
  taskName: string;
  description: string;
  category: 'BANK_RECONCILIATION' | 'ACCRUALS' | 'PREPAYMENTS' | 'DEPRECIATION' | 'REVENUE_RECOGNITION' | 'EXPENSE_ALLOCATION' | 'INTER_COMPANY' | 'TAX_COMPLIANCE' | 'REPORTING' | 'VALIDATION';
  assignedTo: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED' | 'SKIPPED';
  dueDate: string;
  startedAt?: string;
  completedAt?: string;
  completedBy?: string;
  dependencies: string[];
  evidence?: JsonObject;
  notes?: string;
};

export type MonthEndClosePeriod = {
  id: string;
  societyId: string;
  period: string;
  status: 'OPEN' | 'CLOSING' | 'CLOSED' | 'REOPENED';
  openedAt: string;
  closedAt?: string;
  closedBy?: string;
  tasks: MonthEndCloseTask[];
  validationChecks: Array<{
    name: string;
    status: 'PASS' | 'FAIL' | 'WARNING';
    details?: string;
  }>;
  snapshot?: {
    totalAssets: number;
    totalLiabilities: number;
    equity: number;
    revenue: number;
    expenses: number;
    netIncome: number;
  };
  createdAt: string;
  updatedAt: string;
};

export type OpeningBalanceImport = {
  id: string;
  societyId: string;
  period: string;
  fileName: string;
  fileHash: string;
  totalRows: number;
  status: 'UPLOADED' | 'VALIDATING' | 'VALIDATED' | 'PREVIEWED' | 'COMMITTING' | 'COMMITTED' | 'FAILED' | 'ROLLED_BACK';
  trialBalance: {
    totalDebits: number;
    totalCredits: number;
    balanced: boolean;
  };
  accounts: Array<{
    accountCode: string;
    accountName: string;
    debitBalance: number;
    creditBalance: number;
  }>;
  errors: Array<{
    row: number;
    field: string;
    code: string;
    message: string;
  }>;
  uploadedAt: string;
  uploadedBy: string;
  validatedAt?: string;
  previewedAt?: string;
  committedAt?: string;
  rollbackImportId?: string;
};

export type MatchingRule = {
  id: string;
  name: string;
  bankAccountId: string;
  conditions: Array<{
    field: 'description' | 'reference' | 'amount' | 'date';
    operator: 'EQUALS' | 'CONTAINS' | 'STARTS_WITH' | 'ENDS_WITH' | 'REGEX' | 'AMOUNT_RANGE';
    value: string | number;
  }>;
  ledgerAccountCode: string;
  priority: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};