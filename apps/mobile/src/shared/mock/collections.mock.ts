import type { CollectionSummary } from '../types/accounting.types';

export const mockCollections: CollectionSummary = {
  totalBilled: 1843000,
  totalCollected: 1560000,
  outstanding: 283000,
  collectionEfficiency: 84.6,
  defaulterCount: 18,
  pendingManualEntries: 3,
  failedPayments: 2,
  reconciliationPending: 7,
  adjustmentsThisMonth: 5,
  advanceExcessPayments: 2,
  byPaymentMode: [
    { mode: 'UPI', amount: 985000, count: 142, percentage: 63.1 },
    { mode: 'PAYMENT_GATEWAY', amount: 312000, count: 48, percentage: 20.0 },
    { mode: 'CASH', amount: 195000, count: 31, percentage: 12.5 },
    { mode: 'CHEQUE', amount: 68000, count: 9, percentage: 4.4 },
  ],
  dayWise: [
    { date: '2026-07-01', amount: 120000, count: 18 },
    { date: '2026-07-02', amount: 185000, count: 27 },
    { date: '2026-07-03', amount: 210000, count: 31 },
    { date: '2026-07-04', amount: 155000, count: 22 },
    { date: '2026-07-05', amount: 280000, count: 39 },
    { date: '2026-07-06', amount: 95000, count: 14 },
    { date: '2026-07-07', amount: 515000, count: 71 },
  ],
  wingWise: [
    { wing: 'A Wing', collected: 590000, outstanding: 98000 },
    { wing: 'B Wing', collected: 540000, outstanding: 115000 },
    { wing: 'C Wing', collected: 430000, outstanding: 70000 },
  ],
  recentCollections: [],
};
