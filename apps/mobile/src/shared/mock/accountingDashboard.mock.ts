import type { TreasurerDashboardData } from '../types/accounting.types';

export const mockAccountingDashboard: TreasurerDashboardData = {
  totalBilledThisMonth: 1843000,
  totalCollectedThisMonth: 1560000,
  outstandingDues: 520000,
  collectionEfficiency: 84.6,
  defaulterCount: 18,
  pendingManualEntries: 3,
  failedPaymentsPlaceholder: 2,
  reconciliationPending: 7,
  adjustmentsThisMonth: 5,
  advanceExcessPayments: 2,
  billingCycleStatus: {
    id: 'bc-001', cycleName: 'July 2026', month: 'July', year: 2026,
    billingPeriodStart: '2026-07-01', billingPeriodEnd: '2026-07-31',
    dueDate: '2026-07-15', status: 'PUBLISHED',
    applicableTowers: ['A Wing', 'B Wing', 'C Wing'],
    totalUnits: 300, draftBillsCount: 0, publishedBillsCount: 300,
    totalAmount: 1843000, collectedAmount: 1560000, outstandingAmount: 283000,
    chargeHeadIds: ['ch-001', 'ch-002', 'ch-003'],
    includePenalties: true, includePreviousDues: true,
    createdBy: 'Meena Kulkarni', createdAt: '2026-06-28T09:00:00Z',
    calculatedAt: '2026-06-28T14:30:00Z', publishedAt: '2026-06-28T15:00:00Z',
  },
  recentCollections: [],
  topDefaulters: [],
  lastUpdatedAt: new Date().toISOString(),
};
