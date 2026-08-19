import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { createBill } from '../../../../test/factories/billFactory';
import { formatCurrencyAmount } from '../../../../shared/formatters/currencyFormatter';
import { formatBillingPeriod, formatDate } from '../../../../shared/formatters/dateFormatter';
import { BillLineItemBreakdown } from '../components/BillLineItemBreakdown';
import { BillPaymentSummary } from '../components/BillPaymentSummary';
import { BillTotalSection, calculateBillTotals } from '../components/BillTotalSection';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
describe('resident billing presentation', () => {
    it('formats billing periods, dates and currency for residents', () => {
        expect(formatBillingPeriod('2026-01')).toBe('Jan 2026');
        expect(formatDate('2026-01-28')).toBe('28 Jan 2026');
        expect(formatCurrencyAmount(4047)).toContain('4,047');
        expect(formatCurrencyAmount(Number.NaN)).toBe('—');
    });
    it('renders readable line items and a credit adjustment', async () => {
        const bill = createBill({
            amount: 4400,
            charges: [
                { lineItemId: '1', type: 'maintenance', label: 'Maintenance', labelMessageKey: 'resident.billing.lineItem.maintenance', amount: 4500, currencyCode: 'INR', isCredit: false },
                { lineItemId: '2', type: 'adjustment', label: 'Adjustment', labelMessageKey: 'resident.billing.lineItem.adjustment', amount: -100, currencyCode: 'INR', isCredit: true },
            ]
        });
        await renderWithProviders(<BillLineItemBreakdown items={bill.charges}/>);
        expect(screen.getByText('Maintenance charges')).toBeOnTheScreen();
        expect(screen.getByText('Adjustment')).toBeOnTheScreen();
        expect(screen.getByText(/-.*100/)).toBeOnTheScreen();
        expect(calculateBillTotals(bill.charges, bill.amount).matchesSource).toBe(true);
    });
    it('does not render receipt-only fields for an unpaid bill', async () => {
        const bill = createBill({ status: 'DUE', ...includeWhenPresent("paidAmount", undefined), payments: [] });
        await renderWithProviders(<>
        <BillTotalSection bill={bill}/>
        <BillPaymentSummary bill={bill}/>
      </>);
        expect(screen.queryByText('Payment Receipt')).toBeNull();
        expect(screen.queryByText('Transaction ID')).toBeNull();
        expect(screen.queryByText('Payment mode')).toBeNull();
        expect(screen.queryByText('Amount paid')).toBeNull();
        expect(screen.getByText('Outstanding amount')).toBeOnTheScreen();
    });
    it('renders a receipt and transaction fields only after payment', async () => {
        const bill = createBill({
            status: 'PAID',
            paidAmount: 4500,
            payments: [{
                    id: 'payment-1', amountPaid: 4500, paymentDate: '2026-06-08', paymentMethod: 'UPI',
                    transactionId: 'TXN1234567890', receiptNumber: 'REC-2026-001'
                }]
        });
        await renderWithProviders(<BillPaymentSummary bill={bill}/>);
        expect(screen.getByText('Payment Receipt')).toBeOnTheScreen();
        expect(screen.getByText('Transaction ID')).toBeOnTheScreen();
        expect(screen.getByText('UPI')).toBeOnTheScreen();
        expect(screen.getByText('8 Jun 2026')).toBeOnTheScreen();
    });
    it('shows paid and outstanding totals for a partially paid bill', async () => {
        const bill = createBill({ status: 'PARTIALLY_PAID', amount: 4500, paidAmount: 2000 });
        await renderWithProviders(<BillTotalSection bill={bill}/>);
        expect(screen.getByText('Amount paid')).toBeOnTheScreen();
        expect(screen.getByText('Outstanding amount')).toBeOnTheScreen();
        expect(screen.getByText(/₹2,000/)).toBeOnTheScreen();
        expect(screen.getByText(/₹2,500/)).toBeOnTheScreen();
    });
});

