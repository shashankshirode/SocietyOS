import type { Bill } from '../../shared/types/bill.types';

export function createBill(overrides: Partial<Bill> = {}): Bill {
  return {
    id: 'bill-001',
    billNumber: 'BILL-001',
    flatNumber: 'A-1204',
    societyName: 'Green Valley Heights',
    title: 'Maintenance June 2026',
    amount: 4500,
    dueDate: '2026-07-10',
    status: 'DUE',
    billingPeriod: 'June 2026',
    charges: [{
      lineItemId: 'bill-001:1',
      type: 'maintenance',
      label: 'Maintenance',
      labelMessageKey: 'resident.billing.lineItem.maintenance',
      amount: 4500,
      currencyCode: 'INR',
      isCredit: false,
    }],
    ...overrides,
  };
}
