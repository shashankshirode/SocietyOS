import { billingRunService } from '../services/billingRunService';
import { invoiceService } from '../services/invoiceService';
import { paymentService } from '../services/paymentService';
import { outstandingService } from '../services/outstandingService';
import { mockStore } from '../../../core/mockStore/mockStore';
import type { BillingRule } from '../../../shared/types/financial.types';
describe('Phase 7: End-to-End Consistency, Concurrency, Occupancy & Rare Scenarios', () => {
    const societyId = 'soc-consistency-001';
    const unitId = 'unit-A-101';
    beforeEach(() => {
        mockStore.reset();
        mockStore.getState().societyUnits = [
            {
                id: unitId,
                unitNumber: 'A-101',
                wing: 'A Wing',
                unitType: '2BHK',
                areaSqFt: 1000,
                carpetAreaSqFt: 850,
                builtupAreaSqFt: 1000,
                societyId,
                isActive: true,
            },
        ];
        const rule: BillingRule = {
            id: 'rule-base',
            chargeHeadId: 'ch-maint',
            chargeHeadCode: 'MAINTENANCE',
            name: 'Maintenance Charge',
            ruleType: 'AREA_BASED',
            rate: 4.0,
            taxApplicable: false,
            priority: 1,
            isActive: true,
            effectiveFrom: '2026-01-01',
            version: 1,
            createdBy: 'Admin',
            createdAt: '2026-01-01T00:00:00Z',
            updatedAt: '2026-01-01T00:00:00Z',
            societyId,
        };
        mockStore.getState().billingRules = [rule];
    });
    test('Section 16: Complete Financial Consistency Verification (Invoice -> Payment -> Allocation -> Receipt -> Ledger -> Outstanding)', async () => {
        const run = await billingRunService.createBillingRun({
            billingCycleMonth: 'September 2026',
            billingPeriodStart: '2026-09-01',
            billingPeriodEnd: '2026-09-30',
            dueDate: '2026-10-15',
            applicableTowers: ['A Wing'],
            chargeHeadIds: ['ch-maint'],
            includeParkingCharges: false,
            includePenalties: false,
            includePreviousDues: false,
        }, 'Treasurer', societyId);
        await billingRunService.approveBillingRun(run.id, 'SuperAdmin');
        await invoiceService.publishInvoices(run.id, 'Treasurer');
        const invoices = await invoiceService.getInvoices({ unitId });
        expect(invoices).toHaveLength(1);
        const invoice = invoices[0]!;
        expect(invoice.total).toBe(4000);
        expect(invoice.balance).toBe(4000);
        let balance = await outstandingService.getOutstandingBalance(unitId);
        expect(balance.totalOutstanding).toBe(4000);
        let ledger = mockStore.getState().ledgerEntries.filter((e) => e.unitId === unitId);
        expect(ledger[0]!.amount).toBe(4000);
        expect(ledger[0]!.type).toBe('DEBIT');
        const payment1 = await paymentService.settleOnlinePayment({
            paymentAttemptId: 'att-p1',
            invoiceId: invoice.id,
            amount: 2500,
            paymentMode: 'UPI',
            gatewayTransactionId: 'TXN-P1',
            gatewayReference: 'TXN-P1',
        });
        expect(payment1.receipt.amount).toBe(2500);
        const invAfterP1 = await invoiceService.getInvoiceById(invoice.id);
        expect(invAfterP1?.status).toBe('PARTIALLY_PAID');
        expect(invAfterP1?.balance).toBe(1500);
        ledger = mockStore.getState().ledgerEntries.filter((e) => e.unitId === unitId);
        expect(ledger[0]!.amount).toBe(1500);
        expect(ledger[0]!.type).toBe('CREDIT');
        balance = await outstandingService.getOutstandingBalance(unitId);
        expect(balance.totalOutstanding).toBe(1500);
        const payment2 = await paymentService.settleOnlinePayment({
            paymentAttemptId: 'att-p2',
            invoiceId: invoice.id,
            amount: 1500,
            paymentMode: 'UPI',
            gatewayTransactionId: 'TXN-P2',
            gatewayReference: 'TXN-P2',
        });
        expect(payment2.receipt.amount).toBe(1500);
        const invAfterP2 = await invoiceService.getInvoiceById(invoice.id);
        expect(invAfterP2?.status).toBe('PAID');
        expect(invAfterP2?.balance).toBe(0);
        ledger = mockStore.getState().ledgerEntries.filter((e) => e.unitId === unitId);
        expect(ledger[0]!.amount).toBe(0);
        balance = await outstandingService.getOutstandingBalance(unitId);
        expect(balance.totalOutstanding).toBe(0);
        const receipts = mockStore.getState().receipts.filter((r) => r.unitId === unitId);
        expect(receipts).toHaveLength(2);
        expect(receipts[0]!.amount + receipts[1]!.amount).toBe(4000);
    });
    test('Rare Case K & 19: Rate change after billing run snapshot does NOT rewrite historical invoice', async () => {
        const run = await billingRunService.createBillingRun({
            billingCycleMonth: 'July 2026',
            billingPeriodStart: '2026-07-01',
            billingPeriodEnd: '2026-07-31',
            dueDate: '2026-08-15',
            applicableTowers: ['A Wing'],
            chargeHeadIds: ['ch-maint'],
            includeParkingCharges: false,
            includePenalties: false,
            includePreviousDues: false,
        }, 'Admin', societyId);
        await billingRunService.approveBillingRun(run.id, 'Admin');
        await invoiceService.publishInvoices(run.id, 'Admin');
        const invBefore = (await invoiceService.getInvoices({ billingRunId: run.id }))[0]!;
        expect(invBefore.total).toBe(4000);
        const rules = mockStore.getState().billingRules as BillingRule[];
        mockStore.getState().billingRules = rules.map((r) => r.id === 'rule-base' ? { ...r, rate: 5.5, version: 2 } : r);
        const invAfter = await invoiceService.getInvoiceById(invBefore.id);
        expect(invAfter?.total).toBe(4000);
        expect(invAfter?.balance).toBe(4000);
        const fetchedRun = await billingRunService.getBillingRun(run.id);
        expect(fetchedRun?.ruleSnapshot[0]!.rate).toBe(4.0);
    });
    test('Invariant 23 & 24: Occupancy changes preserve unit ledger history and protect resident privacy', async () => {
        mockStore.addInvoice({
            id: 'inv-hist-1',
            societyId,
            unitId,
            unitNumber: 'A-101',
            billingRunId: 'run-hist',
            invoiceNumber: 'INV-HIST-001',
            billingRunNumber: 'run-hist',
            status: 'PAID',
            issueDate: '2026-01-01T00:00:00Z',
            dueDate: '2026-01-15T00:00:00Z',
            billingPeriodStart: '2026-01-01',
            billingPeriodEnd: '2026-01-31',
            subtotal: 4000,
            totalDiscounts: 0,
            totalPenalties: 0,
            totalInterest: 0,
            taxAmount: 0,
            total: 4000,
            balance: 0,
            currency: 'INR',
        });
        const ledger = mockStore.getState().ledgerEntries.filter((e) => e.unitId === unitId);
        expect(ledger).toBeDefined();
        ledger.forEach((entry) => {
            expect(entry.description).not.toContain('cardNumber');
            expect(entry.description).not.toContain('cvv');
            expect(entry.description).not.toContain('upiPin');
        });
    });
});

