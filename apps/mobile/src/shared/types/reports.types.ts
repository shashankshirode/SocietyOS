

export type FinancialReportType =
  | 'COLLECTION_REPORT'
  | 'DEFAULTER_REPORT'
  | 'OUTSTANDING_REPORT'
  | 'BILL_REGISTER'
  | 'RECEIPT_REGISTER'
  | 'LEDGER_REPORT'
  | 'PAYMENT_MODE_REPORT'
  | 'ADJUSTMENT_REPORT'
  | 'RECONCILIATION_REPORT'
  | 'WING_WISE_COLLECTION'
  | 'MONTH_WISE_COLLECTION';

export type ExportFormat = 'EXCEL' | 'PDF' | 'CSV';

export type ExportStatus =
  | 'QUEUED'
  | 'PROCESSING'
  | 'READY'
  | 'FAILED'
  | 'EXPIRED';

export interface ReportFilter {
  fromDate?: string;
  toDate?: string;
  wing?: string;
  billingCycleId?: string;
  paymentMode?: string;
  status?: string;
}

export interface FinancialReport {
  id: string;
  reportType: FinancialReportType;
  displayName: string;
  description: string;
  availableFilters: string[];
  lastGeneratedAt?: string;
  lastGeneratedBy?: string;
  supportsExcel: boolean;
  supportsPdf: boolean;
  supportscsv: boolean;
}

export interface ExportRequest {
  id: string;
  exportName: string;
  reportType: FinancialReportType;
  format: ExportFormat;
  requestedBy: string;
  requestedAt: string;
  status: ExportStatus;
  downloadUrl?: string;
  expiresAt?: string;
  errorMessage?: string;
  fileSizeKb?: number;
}
