import { outstandingService } from '../services/outstandingService';
import { financialControlService } from '../services/financialControlService';
import { reconciliationService } from '../services/reconciliationService';
import { paymentService } from '../services/paymentService';
import { mockStore } from '../../../core/mockStore/mockStore';
import type { Invoice } from '../../../shared/types/financial.types';
describe('Phase 7: Ledger Integrity, Ageing, Defaulters, Late Fees, Reconciliation & Period Close', () => {
    const societyId = 'soc-audit-001';
    const unitId = 'unit-u301';
    beforeEach(() => {
        mockStore.reset();
    });
    test('Invariant 17: Late fee engine applies fee on overdue principal past grace period with cap and idempotency', async () => {
        const pastDueDate = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString();
        const invoice: Invoice = {
            id: 'inv-overdue-1',
            societyId,
            unitId,
            unitNumber: 'C-301',
            billingRunId: 'run-3',
            invoiceNumber: 'INV-SOC-202608-0001',
            billingRunNumber: 'run-3',
            status: 'OVERDUE',
            issueDate: '2026-08-01T00:00:00Z',
            dueDate: pastDueDate,
            billingPeriodStart: '2026-08-01',
            billingPeriodEnd: '2026-08-31',
            subtotal: 10000,
            totalDiscounts: 0,
            totalPenalties: 0,
            totalInterest: 0,
            taxAmount: 0,
            total: 10000,
            balance: 10000,
            currency: 'INR',
        };
        mockStore.addInvoice(invoice);
        mockStore.addLedgerEntry({
            id: 'led-init-3',
            unitId,
            amount: 10000,
            type: 'DEBIT',
            description: 'Maintenance Invoice INV-SOC-202608-0001',
            date: '2026-08-01T00:00:00Z',
        });
        const run1 = await financialControlService.applyLateFees(societyId, {
            gracePeriodDays: 10,
            ratePercent: 5,
            capAmount: 750,
        });
        expect(run1.appliedCount).toBe(1);
        expect(run1.totalFee).toBe(500);
        const invAfterFee = mockStore.getState().invoices.find((i) => i.id === invoice.id);
        expect(invAfterFee?.balance).toBe(10500);
        expect(invAfterFee?.totalPenalties).toBe(500);
        const ledger = mockStore.getState().ledgerEntries.filter((e) => e.unitId === unitId);
        expect(ledger[0]!.amount).toBe(10500);
        expect(ledger[0]!.type).toBe('DEBIT');
        const run2 = await financialControlService.applyLateFees(societyId, {
            gracePeriodDays: 10,
            ratePercent: 5,
            capAmount: 750,
        });
        expect(run2.appliedCount).toBe(0);
        expect(run2.totalFee).toBe(0);
    });
    test('Outstanding Balance & Ageing Breakdown reflect true financial state', async () => {
        const overdueDate = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString();
        const invoice: Invoice = {
            id: 'inv-ageing-1',
            societyId,
            unitId,
            unitNumber: 'C-301',
            billingRunId: 'run-4',
            invoiceNumber: 'INV-SOC-202607-0001',
            billingRunNumber: 'run-4',
            status: 'OVERDUE',
            issueDate: '2026-07-01T00:00:00Z',
            dueDate: overdueDate,
            billingPeriodStart: '2026-07-01',
            billingPeriodEnd: '2026-07-31',
            subtotal: 5000,
            totalDiscounts: 0,
            totalPenalties: 0,
            totalInterest: 0,
            taxAmount: 0,
            total: 5000,
            balance: 5000,
            currency: 'INR',
        };
        mockStore.addInvoice(invoice);
        const balance = await outstandingService.getOutstandingBalance(unitId);
        expect(balance.totalOutstanding).toBe(5000);
        expect(balance.overdueAmount).toBe(5000);
        expect(balance.ageing.days31_60).toBe(5000);
        const defaulters = await outstandingService.getDefaulterReport(societyId);
        expect(defaulters.totalDefaulters).toBe(1);
        expect(defaulters.defaulters[0]!.unitId).toBe(unitId);
        expect(defaulters.defaulters[0]!.ageingBucket).toBe('31_60_DAYS');
    });
    test('Invariant 20: Bank Reconciliation deduplicates imports and matches without altering ledger history', async () => {
        mockStore.addInvoice({
            id: 'inv-bank-1',
            societyId,
            unitId,
            unitNumber: 'C-301',
            billingRunId: 'run-5',
            invoiceNumber: 'INV-SOC-202609-0099',
            billingRunNumber: 'run-5',
            status: 'PUBLISHED',
            issueDate: '2026-09-01T00:00:00Z',
            dueDate: '2026-09-20T00:00:00Z',
            billingPeriodStart: '2026-09-01',
            billingPeriodEnd: '2026-09-30',
            subtotal: 4500,
            totalDiscounts: 0,
            totalPenalties: 0,
            totalInterest: 0,
            taxAmount: 0,
            total: 4500,
            balance: 4500,
            currency: 'INR',
        });
        const settled = await paymentService.settleOnlinePayment({
            paymentAttemptId: 'att-rec-1',
            invoiceId: 'inv-bank-1',
            amount: 4500,
            paymentMode: 'BANK_TRANSFER',
            gatewayTransactionId: 'UTR-99887766',
            gatewayReference: 'UTR-99887766',
        });
        const initialLedgerCount = mockStore.getState().ledgerEntries.length;
        const bankRecord1 = await reconciliationService.createRecord({
            statementDate: '2026-09-15',
            bankReference: 'UTR-99887766',
            amount: 4500,
            transactionType: 'CREDIT',
            narration: 'NEFT credit from Resident A-101',
            bankName: 'ICICI Bank',
            societyId,
        });
        expect(bankRecord1.status).toBe('MATCHED');
        expect(bankRecord1.matchedPaymentId).toBe(settled.transaction.id);
        expect(mockStore.getState().ledgerEntries.length).toBe(initialLedgerCount);
        const duplicateBankRecord = await reconciliationService.createRecord({
            statementDate: '2026-09-15',
            bankReference: 'UTR-99887766',
            amount: 4500,
            transactionType: 'CREDIT',
            narration: 'NEFT credit from Resident A-101',
            bankName: 'ICICI Bank',
            societyId,
        });
        expect(duplicateBankRecord.id).toBe(bankRecord1.id);
        expect(mockStore.getState().bankReconciliationRecords).toHaveLength(1);
    });
    test('Invariant 21: Closed period blocks ordinary back-posting', async () => {
        const closed = await financialControlService.closeFinancialPeriod({
            societyId,
            period: '2026-08',
            closedBy: 'Auditor User',
        });
        expect(closed.period).toBe('2026-08');
        expect(financialControlService.isPeriodClosed(societyId, '2026-08')).toBe(true);
        expect(financialControlService.isPeriodClosed(societyId, '2026-09')).toBe(false);
        expect(() => {
            financialControlService.assertPeriodOpen(societyId, '2026-08');
        }).toThrow(/PERIOD_LOCKED/);
        expect(() => {
            financialControlService.assertPeriodOpen(societyId, '2026-09');
        }).not.toThrow();
    });
});

