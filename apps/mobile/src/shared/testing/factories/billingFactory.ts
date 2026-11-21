import type { Bill } from '../../types/bill.types';

export function createBill(overrides: Partial<Bill> = {}): Bill {
  return {
    id: 'bill-001',
    billNumber: 'BILL-001',
    flatNumber: 'A-1204',
    societyName: 'Green Valley Heights Phase 2 Cooperative Housing Society',
    title: 'Maintenance July 2026',
    amount: 4850,
    dueDate: '2026-07-15',
    status: 'DUE',
    billingPeriod: 'July 2026',
    charges: [
      { lineItemId: 'bill-001:1', type: 'maintenance', label: 'Maintenance Charge', labelMessageKey: 'resident.billing.lineItem.maintenance', amount: 3500, currencyCode: 'INR', isCredit: false },
      { lineItemId: 'bill-001:2', type: 'sinkingFund', label: 'Sinking Fund', labelMessageKey: 'resident.billing.lineItem.sinkingFund', amount: 500, currencyCode: 'INR', isCredit: false },
      { lineItemId: 'bill-001:3', type: 'water', label: 'Water Charge', labelMessageKey: 'resident.billing.lineItem.water', amount: 500, currencyCode: 'INR', isCredit: false },
      { lineItemId: 'bill-001:4', type: 'parking', label: 'Parking Charge', labelMessageKey: 'resident.billing.lineItem.parking', amount: 350, currencyCode: 'INR', isCredit: false },
    ],
    payments: [],
    ...overrides,
  };
}
