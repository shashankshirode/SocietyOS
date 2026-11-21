import type { Defaulter } from '../types/accounting.types';

export const mockDefaulters: Defaulter[] = [
  { unitId: 'unit-008', unitNumber: 'C-0601', wing: 'C Wing', residentDisplayName: 'Nalini Sharma (Owner)', outstandingAmount: 28000, ageingBucket: 'ABOVE_90_DAYS', lastPaymentDate: '2025-12-10', reminderCount: 6, noticesSent: 2, isDisputed: false, oldestDueMonth: 'March 2026' },
  { unitId: 'unit-006', unitNumber: 'B-1101', wing: 'B Wing', residentDisplayName: 'Vijay Kulkarni (Owner)', outstandingAmount: 14500, ageingBucket: '61_90_DAYS', lastPaymentDate: '2026-03-20', reminderCount: 3, noticesSent: 1, isDisputed: false, oldestDueMonth: 'April 2026' },
  { unitId: 'unit-002', unitNumber: 'A-0801', wing: 'A Wing', residentDisplayName: 'Rahul Patil (Owner)', outstandingAmount: 9200, ageingBucket: '31_60_DAYS', lastPaymentDate: '2026-04-25', reminderCount: 2, noticesSent: 0, isDisputed: false, oldestDueMonth: 'May 2026' },
  { unitId: 'unit-003', unitNumber: 'A-0302', wing: 'A Wing', residentDisplayName: 'Sunita Mehta (Owner)', outstandingAmount: 2700, ageingBucket: '0_30_DAYS', lastPaymentDate: '2026-06-01', reminderCount: 1, noticesSent: 0, isDisputed: false, oldestDueMonth: 'July 2026' },
  { unitId: 'unit-010', unitNumber: 'B-0205', wing: 'B Wing', residentDisplayName: 'Kavita Sharma (Owner)', outstandingAmount: 3500, ageingBucket: '0_30_DAYS', lastPaymentDate: '2026-06-05', reminderCount: 1, noticesSent: 0, isDisputed: true, disputeReason: 'Resident disputes penalty charges — under review', oldestDueMonth: 'July 2026' },
];
