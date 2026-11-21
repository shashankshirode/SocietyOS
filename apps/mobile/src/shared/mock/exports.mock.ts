import type { ExportRequest } from '../types/reports.types';

export const mockExports: ExportRequest[] = [
  { id: 'exp-001', exportName: 'Collection Report — June 2026', reportType: 'COLLECTION_REPORT', format: 'EXCEL', requestedBy: 'Meena Kulkarni', requestedAt: '2026-06-30T16:00:00Z', status: 'READY', downloadUrl: 'PLACEHOLDER_DOWNLOAD_URL', expiresAt: '2026-07-07T16:00:00Z', fileSizeKb: 145 },
  { id: 'exp-002', exportName: 'Defaulter Report — July 2026', reportType: 'DEFAULTER_REPORT', format: 'PDF', requestedBy: 'Meena Kulkarni', requestedAt: '2026-07-01T10:00:00Z', status: 'READY', downloadUrl: 'PLACEHOLDER_DOWNLOAD_URL', expiresAt: '2026-07-08T10:00:00Z', fileSizeKb: 82 },
  { id: 'exp-003', exportName: 'Bill Register — July 2026', reportType: 'BILL_REGISTER', format: 'EXCEL', requestedBy: 'Anil Deshmukh', requestedAt: '2026-07-05T14:00:00Z', status: 'PROCESSING' },
  { id: 'exp-004', exportName: 'Receipt Register — Q1 2026', reportType: 'RECEIPT_REGISTER', format: 'CSV', requestedBy: 'Meena Kulkarni', requestedAt: '2026-04-01T09:00:00Z', status: 'EXPIRED', fileSizeKb: 320 },
];
