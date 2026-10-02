import { paymentService } from '../services/paymentService';
import { adjustmentService } from '../services/adjustmentService';
import { invoiceService } from '../services/invoiceService';
import { mockStore } from '../../../core/mockStore/mockStore';
import type { ChequeRecord } from '../services/paymentService';
describe('Phase 7: Cheque Lifecycle, Compensating Reversals, Adjustments & Refunds', () => {
    const societyId = 'soc-audit-001';
    const unitId = 'unit-u201';
    let invoice: any;
    beforeEach(() => {
        mockStore.reset();
        invoice = {
            id: 'inv-2001',
            societyId,
            unitId,
            unitNumber: 'B-201',
            billingRunId: 'run-2',
            invoiceNumber: 'INV-SOC-202609-0002',
            billingRunNumber: 'run-2',
            status: 'PUBLISHED',
            issueDate: '2026-09-01T00:00:00Z',
            dueDate: '2026-09-20T00:00:00Z',
            billingPeriodStart: '2026-09-01',
            billingPeriodEnd: '2026-09-30',
            subtotal: 8000,
            totalDiscounts: 0,
            totalPenalties: 0,
            totalInterest: 0,
            taxAmount: 0,
            total: 8000,
            balance: 8000,
            currency: 'INR',
        };
        mockStore.addInvoice(invoice);
        mockStore.addLedgerEntry({
            id: 'led-init-2',
            unitId,
            amount: 8000,
            type: 'DEBIT',
            description: 'Maintenance Invoice INV-SOC-202609-0002',
            date: '2026-09-01T00:00:00Z',
        });
    });
    test('Cheque Lifecycle: RECEIVED -> CLEARED -> BOUNCED Compensating Reversal', async () => {
        const manualRecord = await paymentService.recordManualPayment({
            unitId,
            amount: 8000,
            paymentMode: 'CHEQUE',
            paymentDate: '2026-09-10',
            referenceNumber: 'CHQ-882200',
            chequeNumber: 'CHQ-882200',
            bankName: 'HDFC Bank',
            confirmationChecked: true,
        }, 'Treasurer User', societyId);
        expect(manualRecord.status).toBe('PENDING');
        const cheques = mockStore.getState().cheques as ChequeRecord[];
        expect(cheques).toHaveLength(1);
        expect(cheques[0]!.status).toBe('RECEIVED');
        expect(cheques[0]!.chequeNumber).toBe('CHQ-882200');
        const clearedCheque = await paymentService.clearCheque(cheques[0]!.id, 'Treasurer User');
        expect(clearedCheque.status).toBe('CLEARED');
        const paidInv = await invoiceService.getInvoiceById(invoice.id);
        expect(paidInv?.status).toBe('PAID');
        expect(paidInv?.balance).toBe(0);
        const ledgerAfterClear = mockStore.getState().ledgerEntries.filter((e) => e.unitId === unitId);
        expect(ledgerAfterClear[0]!.amount).toBe(0);
        expect(ledgerAfterClear[0]!.type).toBe('CREDIT');
        const bouncedCheque = await paymentService.processChequeBounce({
            chequeId: cheques[0]!.id,
            bounceReason: 'INSUFFICIENT_FUNDS',
            bouncedBy: 'Bank Integration',
            bounceFee: 350,
        });
        expect(bouncedCheque.status).toBe('BOUNCED');
        expect(mockStore.getState().cheques).toHaveLength(1);
        expect(mockStore.getState().receipts).toHaveLength(1);
        const restoredInv = await invoiceService.getInvoiceById(invoice.id);
        expect(restoredInv?.status).toBe('OVERDUE');
        expect(restoredInv?.balance).toBe(8000);
        const ledgerAfterBounce = mockStore.getState().ledgerEntries.filter((e) => e.unitId === unitId);
        expect(ledgerAfterBounce[0]!.type).toBe('DEBIT');
        expect(ledgerAfterBounce[0]!.amount).toBe(8350);
        const duplicateBounce = await paymentService.processChequeBounce({
            chequeId: cheques[0]!.id,
            bounceReason: 'INSUFFICIENT_FUNDS',
            bouncedBy: 'Bank Integration',
        });
        expect(duplicateBounce.status).toBe('BOUNCED');
        const ledgerAfterDup = mockStore.getState().ledgerEntries.filter((e) => e.unitId === unitId);
        expect(ledgerAfterDup).toHaveLength(ledgerAfterBounce.length);
    });
    test('Invariant 13 & 14: Refund references source payment and cannot exceed refundable amount', async () => {
        const settled = await paymentService.settleOnlinePayment({
            paymentAttemptId: 'att-rfnd-1',
            invoiceId: invoice.id,
            amount: 8000,
            paymentMode: 'UPI',
            gatewayTransactionId: 'gtx-rfnd-1',
            gatewayReference: 'ref-rfnd-1',
        });
        const txnId = settled.transaction.id;
        const refund1 = await paymentService.processRefund({
            paymentTransactionId: txnId,
            amount: 3000,
            reason: 'Resident overcharged on parking component',
            approvedBy: 'Secretary',
        });
        expect(refund1.amount).toBe(3000);
        expect(refund1.originalPaymentTransactionId).toBe(txnId);
        expect(refund1.status).toBe('COMPLETED');
        const txnAfter1 = mockStore.getState().paymentTransactions.find((t) => t.id === txnId);
        expect(txnAfter1?.status).toBe('PARTIALLY_REFUNDED');
        await expect(paymentService.processRefund({
            paymentTransactionId: txnId,
            amount: 6000,
            reason: 'Attempted excess refund',
            approvedBy: 'Secretary',
        })).rejects.toThrow(/INSUFFICIENT_REFUNDABLE_AMOUNT/);
        const refund2 = await paymentService.processRefund({
            paymentTransactionId: txnId,
            amount: 5000,
            reason: 'Remaining refund',
            approvedBy: 'Secretary',
        });
        expect(refund2.amount).toBe(5000);
        const txnAfter2 = mockStore.getState().paymentTransactions.find((t) => t.id === txnId);
        expect(txnAfter2?.status).toBe('REFUNDED');
        const ledger = mockStore.getState().ledgerEntries.filter((e) => e.unitId === unitId);
        expect(ledger[0]!.amount).toBe(8000);
    });
    test('Invariant 2: Controlled Adjustments & Waivers use compensating ledger entries, not raw invoice line mutation', async () => {
        const adj = await adjustmentService.createAdjustment({
            invoiceId: invoice.id,
            unitId,
            type: 'WAIVER',
            debitCredit: 'CREDIT',
            amount: 1000,
            reason: 'First-time delay courtesy waiver',
            approvedBy: 'Managing Committee',
            approvalStatus: 'APPROVED',
        });
        expect(adj.approvalStatus).toBe('APPROVED');
        expect(adj.amount).toBe(1000);
        const inv = await invoiceService.getInvoiceById(invoice.id);
        expect(inv?.subtotal).toBe(8000);
        const ledger = mockStore.getState().ledgerEntries.filter((e) => e.unitId === unitId);
        expect(ledger[0]!.type).toBe('CREDIT');
        expect(ledger[0]!.amount).toBe(7000);
        expect(ledger[0]!.description).toContain('Adjustment [WAIVER]');
    });
});

