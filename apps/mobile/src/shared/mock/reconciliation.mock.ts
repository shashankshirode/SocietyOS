import type { BankTransaction } from '../types/accounting.types';

export const mockReconciliation: BankTransaction[] = [
  { id: 'bt-001', transactionDate: '2026-07-07', bankReference: 'HDFC-TXN-789012', amount: 8025, probableUnitNumber: 'A-1204', probableUnitId: 'unit-001', suggestedPaymentId: 'pay-legacy-001', matchConfidence: 98, status: 'SUGGESTED_MATCH', bankName: 'HDFC Bank', narration: 'UPI/VPA/GVH-SOCIETY@hdfc/A1204-JUL' },
  { id: 'bt-002', transactionDate: '2026-07-06', bankReference: 'HDFC-TXN-789010', amount: 5250, probableUnitNumber: 'B-0404', probableUnitId: 'unit-004', matchConfidence: 72, status: 'MANUAL_REVIEW', bankName: 'HDFC Bank', narration: 'NEFT/ANIL DESHMUKH/B404MAINT' },
  { id: 'bt-003', transactionDate: '2026-07-05', bankReference: 'HDFC-TXN-789008', amount: 12300, probableUnitNumber: 'C-1501', probableUnitId: 'unit-007', matchConfidence: 95, status: 'MATCHED', matchedBy: 'Meena Kulkarni', matchedAt: '2026-07-06T09:00:00Z', bankName: 'HDFC Bank', narration: 'NEFT/RAMESH AGARWAL/C1501' },
  { id: 'bt-004', transactionDate: '2026-07-04', bankReference: 'HDFC-TXN-789005', amount: 1500, status: 'UNMATCHED', bankName: 'HDFC Bank', narration: 'IMPS/UNKNOWN-REF/GVH' },
  { id: 'bt-005', transactionDate: '2026-07-03', bankReference: 'HDFC-TXN-788998', amount: 6800, probableUnitNumber: 'B-1101', probableUnitId: 'unit-006', matchConfidence: 85, status: 'RECONCILED', matchedBy: 'Meena Kulkarni', matchedAt: '2026-07-04T10:00:00Z', bankName: 'HDFC Bank', narration: 'CHQ/VIJAY KULKARNI/456789' },
];
