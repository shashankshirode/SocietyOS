import type { FlatLedger } from '../types/ledger.types';

export const mockFlatLedger: FlatLedger = {
  unitId: 'unit-001',
  unitNumber: 'A-1204',
  wing: 'A Wing',
  ownerName: 'Shashank Shirode',
  openingBalance: 0,
  closingBalance: 0,
  totalDebits: 57750,
  totalCredits: 57750,
  lastUpdatedAt: new Date().toISOString(),
  entries: [
    { id: 'le-001', date: '2026-07-15', type: 'BILL', referenceNumber: 'BILL-2026-07-A1204', description: 'Maintenance Bill — July 2026', debit: 8025, credit: 0, balance: 8025, createdBy: 'Meena Kulkarni', isAuditLocked: false },
    { id: 'le-002', date: '2026-07-05', type: 'PAYMENT', referenceNumber: 'PAY-2026-0088', description: 'UPI Payment — ₹8,025 received (Ref: UPI123456789)', debit: 0, credit: 8025, balance: 0, createdBy: 'SYSTEM', isAuditLocked: false },
    { id: 'le-003', date: '2026-06-15', type: 'BILL', referenceNumber: 'BILL-2026-06-A1204', description: 'Maintenance Bill — June 2026', debit: 8025, credit: 0, balance: 8025, createdBy: 'Meena Kulkarni', isAuditLocked: true },
    { id: 'le-004', date: '2026-06-08', type: 'PAYMENT', referenceNumber: 'PAY-2026-0071', description: 'UPI Payment — ₹8,025 received (Ref: UPI987654321)', debit: 0, credit: 8025, balance: 0, createdBy: 'SYSTEM', isAuditLocked: true },
    { id: 'le-005', date: '2026-05-15', type: 'BILL', referenceNumber: 'BILL-2026-05-A1204', description: 'Maintenance Bill — May 2026', debit: 8025, credit: 0, balance: 8025, createdBy: 'Meena Kulkarni', isAuditLocked: true },
    { id: 'le-006', date: '2026-05-12', type: 'PAYMENT', referenceNumber: 'PAY-2026-0050', description: 'UPI Payment — ₹8,025 received', debit: 0, credit: 8025, balance: 0, createdBy: 'SYSTEM', isAuditLocked: true },
    { id: 'le-007', date: '2026-04-15', type: 'BILL', referenceNumber: 'BILL-2026-04-A1204', description: 'Maintenance Bill — April 2026', debit: 7700, credit: 0, balance: 7700, createdBy: 'Meena Kulkarni', isAuditLocked: true },
    { id: 'le-008', date: '2026-04-10', type: 'PAYMENT', referenceNumber: 'PAY-2026-0030', description: 'NEFT Bank Transfer — ₹7,700', debit: 0, credit: 7700, balance: 0, createdBy: 'Meena Kulkarni', isAuditLocked: true },
  ],
};
