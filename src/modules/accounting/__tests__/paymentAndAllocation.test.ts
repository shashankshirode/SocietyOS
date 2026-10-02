import { paymentGatewayService } from '../services/paymentGatewayService';
import { paymentService } from '../services/paymentService';
import { invoiceService } from '../services/invoiceService';
import { mockStore } from '../../../core/mockStore/mockStore';
import type { Invoice } from '../../../shared/types/financial.types';
describe('Phase 7: Payment Verification, Allocation & Receipt Invariants', () => {
    const societyId = 'soc-audit-001';
    const unitId = 'unit-u101';
    let invoice: Invoice;
    beforeEach(() => {
        mockStore.reset();
        invoice = {
            id: 'inv-1001',
            societyId,
            unitId,
            unitNumber: 'A-101',
            billingRunId: 'run-1',
            invoiceNumber: 'INV-SOC-202609-0001',
            billingRunNumber: 'run-1',
            status: 'PUBLISHED',
            issueDate: '2026-09-01T00:00:00Z',
            dueDate: '2026-09-20T00:00:00Z',
            billingPeriodStart: '2026-09-01',
            billingPeriodEnd: '2026-09-30',
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
            id: 'led-init',
            unitId,
            amount: 10000,
            type: 'DEBIT',
            description: 'Maintenance Invoice INV-SOC-202609-0001',
            date: '2026-09-01T00:00:00Z',
        });
    });
    test('Invariant 5 & 6: Payment attempt is separate from payment and does not mark invoice paid', async () => {
        const attempt = await paymentGatewayService.createPayment({
            amount: 10000,
            currency: 'INR',
            paymentMode: 'UPI',
            invoiceId: invoice.id,
            unitId,
            unitNumber: 'A-101',
            payerName: 'Amit Shah',
            payerPhone: '9876543210',
            description: 'Maintenance Bill Payment',
            callbackUrl: 'https://societyos.app/callback',
            idempotencyKey: 'idemp-attempt-1',
        });
        expect(attempt.success).toBe(true);
        expect(attempt.paymentId).toBeDefined();
        const invAfterAttempt = await invoiceService.getInvoiceById(invoice.id);
        expect(invAfterAttempt?.status).toBe('PUBLISHED');
        expect(invAfterAttempt?.balance).toBe(10000);
        expect(mockStore.getState().receipts).toHaveLength(0);
        expect(mockStore.getState().paymentTransactions).toHaveLength(0);
    });
    test('Invariant 7 & 8: Signature/amount verification and duplicate callback idempotency', async () => {
        const attemptResponse = await paymentGatewayService.createPayment({
            amount: 10000,
            currency: 'INR',
            paymentMode: 'UPI',
            invoiceId: invoice.id,
            unitId,
            unitNumber: 'A-101',
            payerName: 'Amit Shah',
            payerPhone: '9876543210',
            description: 'Maintenance Bill Payment',
            callbackUrl: 'https://societyos.app/callback',
            idempotencyKey: 'idemp-attempt-2',
        });
        const invalidSig = await paymentGatewayService.handleCallback({
            paymentId: attemptResponse.paymentId,
            amount: 10000,
            signature: 'INVALID_SIGNATURE',
        });
        expect(invalidSig.isValid).toBe(false);
        expect(invalidSig.error).toBe('PAYMENT_SIGNATURE_INVALID');
        const amountMismatch = await paymentGatewayService.handleCallback({
            paymentId: attemptResponse.paymentId,
            amount: 8000,
        });
        expect(amountMismatch.isValid).toBe(false);
        expect(amountMismatch.error).toContain('PAYMENT_AMOUNT_MISMATCH');
        const validCallback = await paymentGatewayService.handleCallback({
            paymentId: attemptResponse.paymentId,
            amount: 10000,
            gatewayTransactionId: 'gw-txn-12345',
        });
        expect(validCallback.isValid).toBe(true);
        expect(validCallback.status).toBe('SETTLED');
        expect(validCallback.duplicate).toBe(false);
        const receiptsAfter1st = mockStore.getState().receipts;
        expect(receiptsAfter1st).toHaveLength(1);
        expect(receiptsAfter1st[0]!.amount).toBe(10000);
        expect(receiptsAfter1st[0]!.receiptNumber).toMatch(/^RCPT-SOC-\d{4}-\d{4}$/);
        const settledInv = await invoiceService.getInvoiceById(invoice.id);
        expect(settledInv?.status).toBe('PAID');
        expect(settledInv?.balance).toBe(0);
        const duplicateCallback = await paymentGatewayService.handleCallback({
            paymentId: attemptResponse.paymentId,
            amount: 10000,
            gatewayTransactionId: 'gw-txn-12345',
        });
        expect(duplicateCallback.isValid).toBe(true);
        expect(duplicateCallback.duplicate).toBe(true);
        const receiptsAfter2nd = mockStore.getState().receipts;
        expect(receiptsAfter2nd).toHaveLength(1);
        const ledgerEntries = mockStore.getState().ledgerEntries.filter((e) => e.unitId === unitId);
        expect(ledgerEntries).toHaveLength(2);
        expect(ledgerEntries[0]!.type).toBe('CREDIT');
    });
    test('Invariant 9: Partial payment retains exact residual outstanding balance', async () => {
        const result = await paymentService.settleOnlinePayment({
            paymentAttemptId: 'att-partial',
            invoiceId: invoice.id,
            amount: 6500,
            paymentMode: 'UPI',
            gatewayTransactionId: 'gtx-part-1',
            gatewayReference: 'ref-part-1',
        });
        expect(result.receipt.amount).toBe(6500);
        const updatedInv = await invoiceService.getInvoiceById(invoice.id);
        expect(updatedInv?.status).toBe('PARTIALLY_PAID');
        expect(updatedInv?.balance).toBe(3500);
        const ledger = mockStore.getState().ledgerEntries.filter((e) => e.unitId === unitId);
        expect(ledger[0]!.amount).toBe(3500);
    });
    test('Invariant 10: Overpayment retains excess as traceable advance balance', async () => {
        const result = await paymentService.settleOnlinePayment({
            paymentAttemptId: 'att-overpay',
            invoiceId: invoice.id,
            amount: 12500,
            paymentMode: 'UPI',
            gatewayTransactionId: 'gtx-over-1',
            gatewayReference: 'ref-over-1',
        });
        expect(result.receipt.amount).toBe(12500);
        const updatedInv = await invoiceService.getInvoiceById(invoice.id);
        expect(updatedInv?.status).toBe('PAID');
        expect(updatedInv?.balance).toBe(0);
        const advances = mockStore.getState().advanceBalances;
        expect(advances[unitId]).toBe(2500);
        const allocations = mockStore.getState().paymentAllocations.filter((a) => a.paymentTransactionId === result.transaction.id);
        expect(allocations).toHaveLength(2);
        expect(allocations.find((a) => !a.isAdvance)?.allocatedAmount).toBe(10000);
        expect(allocations.find((a) => a.isAdvance)?.allocatedAmount).toBe(2500);
    });
});

