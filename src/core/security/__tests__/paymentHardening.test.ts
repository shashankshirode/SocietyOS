import { paymentGatewayService, generateMockPaymentSignature } from '../../../modules/accounting/services/paymentGatewayService';
import { paymentService } from '../../../modules/accounting/services/paymentService';
import { billRepository } from '../../../modules/resident/billing/data/billing.repository';
import { billApiSource } from '../../../modules/resident/billing/data/billing.apiSource';
import { mockStore } from '../../mockStore/mockStore';
import { runtimePolicy } from '../../config/runtimePolicy';
import type { Invoice, PaymentAttempt, PaymentTransaction, Receipt } from '../../../shared/types/financial.types';

describe('Phase 1B: Payments & Financial Truthfulness Hardening', () => {
  const societyId = 'soc-palm-grove-01';
  const unitId = 'unit-101';
  let testInvoice: Invoice;

  beforeEach(() => {
    // Reset runtime policy to development/test
    (runtimePolicy as any).setEnvironmentOverride('test');
    mockStore.reset();

    // Default payment gateway to MOCK
    paymentGatewayService.setConfig({
      provider: 'MOCK',
      merchantId: 'MOCK_MERCHANT',
      merchantKey: 'MOCK_KEY_SECRET',
      callbackUrl: 'https://societyos.app/payment/callback',
      webhookUrl: 'https://api.societyos.app/webhooks/payment',
      supportedModes: ['UPI', 'PAYMENT_GATEWAY', 'CASH', 'CHEQUE', 'BANK_TRANSFER'],
      isActive: true,
      testMode: true,
    });

    // Populate test invoice
    testInvoice = {
      id: 'inv-phase1b-001',
      societyId,
      unitId,
      unitNumber: 'A-101',
      billingRunId: 'run-1b',
      invoiceNumber: 'INV-2026-001',
      billingRunNumber: 'run-1b',
      status: 'PUBLISHED',
      issueDate: '2026-11-01T00:00:00Z',
      dueDate: '2026-11-20T00:00:00Z',
      billingPeriodStart: '2026-11-01',
      billingPeriodEnd: '2026-11-30',
      subtotal: 5000,
      totalDiscounts: 0,
      totalPenalties: 0,
      totalInterest: 0,
      taxAmount: 0,
      total: 5000,
      balance: 5000,
      currency: 'INR',
    };
    mockStore.addInvoice(testInvoice);
  });

  afterEach(() => {
    (runtimePolicy as any).setEnvironmentOverride(null);
  });

  describe('1. Production Mode Fail-Closed Boundaries', () => {
    beforeEach(() => {
      (runtimePolicy as any).setEnvironmentOverride('production');
    });

    it('rejects client-side payment callback handling in production', async () => {
      const res = await paymentGatewayService.handleCallback({
        paymentId: 'att-1',
        amount: 5000,
        signature: 'mock_sig_att-1_500000_MOCK_KEY_SECRET',
      });
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('BACKEND_REQUIRED');
      expect(res.error).toContain('production');
    });

    it('rejects payment order creation in production', async () => {
      const res = await paymentGatewayService.createPayment({
        invoiceId: 'inv-phase1b-001',
        amount: 5000,
        currency: 'INR',
        paymentMode: 'UPI',
        payerName: 'Resident',
        payerPhone: '9876543210',
        unitId: 'unit-101',
        unitNumber: 'A-101',
        description: 'Test payment',
        callbackUrl: 'https://societyos.app/callback',
        idempotencyKey: 'idemp-prod-1',
      });
      expect(res.success).toBe(false);
      expect(res.error).toContain('BACKEND_REQUIRED');
    });

    it('rejects payment verification against mock store in production', async () => {
      const res = await paymentGatewayService.verifyPayment('ref-123');
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('BACKEND_REQUIRED');
    });

    it('rejects refund processing against mock store in production', async () => {
      const res = await paymentGatewayService.refundPayment({
        paymentTransactionId: 'txn-123',
        amount: 1000,
        reason: 'Duplicate payment',
        idempotencyKey: 'idemp-refund-prod-1',
      });
      expect(res.success).toBe(false);
      expect(res.error).toContain('BACKEND_REQUIRED');
    });

    it('returns FAILED status for getPaymentStatus in production', async () => {
      const res = await paymentGatewayService.getPaymentStatus('ref-123');
      expect(res.status).toBe('FAILED');
    });

    it('throws security error if settleOnlinePayment is invoked directly in production', async () => {
      await expect(
        paymentService.settleOnlinePayment({
          paymentAttemptId: 'att-1',
          invoiceId: 'inv-phase1b-001',
          amount: 5000,
          paymentMode: 'UPI',
          gatewayTransactionId: 'gw-1',
          gatewayReference: 'ref-1',
        })
      ).rejects.toThrow(/SecurityPolicy.*settleOnlinePayment/);
    });

    it('throws security error if recordManualPayment is invoked directly in production', async () => {
      await expect(
        paymentService.recordManualPayment(
          {
            unitId: 'unit-101',
            amount: 5000,
            paymentMode: 'CASH',
            paymentDate: '2026-11-21',
            referenceNumber: 'REF123',
            confirmationChecked: true,
          },
          'Treasurer',
          societyId
        )
      ).rejects.toThrow(/SecurityPolicy.*recordManualPayment/);
    });

    it('rejects mockPayment on billApiSource in production', async () => {
      const dummyContext: any = {
        activeHome: { societyId, unitId, residentRole: 'owner' },
      };
      const res = await billApiSource.mockPayment(dummyContext, {
        billId: 'bill-1',
        amount: 5000,
        paymentMethod: 'UPI',
      });
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.error.code).toBe('UNSUPPORTED_OPERATION');
        expect(res.error.message).toContain('production');
      }
    });
  });

  describe('2. Real Provider (Non-MOCK) Fail-Closed Boundaries', () => {
    beforeEach(() => {
      (runtimePolicy as any).setEnvironmentOverride('test');
      paymentGatewayService.setConfig({
        provider: 'RAZORPAY',
        merchantId: 'rzp_live_123',
        merchantKey: 'secret_key_123',
        callbackUrl: 'https://societyos.app/payment/callback',
        webhookUrl: 'https://api.societyos.app/webhooks/payment',
        supportedModes: ['UPI', 'PAYMENT_GATEWAY'],
        isActive: true,
        testMode: false,
      });
    });

    afterEach(() => {
      paymentGatewayService.setConfig({
        provider: 'MOCK',
        merchantId: 'MOCK_MERCHANT',
        merchantKey: 'MOCK_KEY_SECRET',
        callbackUrl: 'https://societyos.app/payment/callback',
        webhookUrl: 'https://api.societyos.app/webhooks/payment',
        supportedModes: ['UPI', 'PAYMENT_GATEWAY', 'CASH', 'CHEQUE', 'BANK_TRANSFER'],
        isActive: true,
        testMode: true,
      });
    });

    it('refuses client-side handleCallback for real gateway providers', async () => {
      const res = await paymentGatewayService.handleCallback({
        paymentId: 'att-1',
        amount: 5000,
        signature: 'valid_looking_signature_12345678',
      });
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('BACKEND_REQUIRED');
      expect(res.error).toContain('RAZORPAY');
    });

    it('refuses client-side createPayment for real gateway providers', async () => {
      // In production mode, createPayment fails closed with BACKEND_REQUIRED
      (runtimePolicy as any).setEnvironmentOverride('production');
      const res = await paymentGatewayService.createPayment({
        invoiceId: 'inv-phase1b-001',
        amount: 5000,
        currency: 'INR',
        paymentMode: 'UPI',
        payerName: 'Resident',
        payerPhone: '9876543210',
        unitId: 'unit-101',
        unitNumber: 'A-101',
        description: 'Test payment',
        callbackUrl: 'https://societyos.app/callback',
        idempotencyKey: 'idemp-rzp-1',
      });
      expect(res.success).toBe(false);
      expect(res.error).toContain('BACKEND_REQUIRED');
    });
  });

  describe('3. Adversarial Callback Verification in Demo/Mock Mode', () => {
    let attemptId: string;

    beforeEach(async () => {
      (runtimePolicy as any).setEnvironmentOverride('test');
      paymentGatewayService.setConfig({
        provider: 'MOCK',
        merchantId: 'MOCK_MERCHANT',
        merchantKey: 'MOCK_KEY_SECRET',
        callbackUrl: 'https://societyos.app/payment/callback',
        webhookUrl: 'https://api.societyos.app/webhooks/payment',
        supportedModes: ['UPI', 'PAYMENT_GATEWAY', 'CASH', 'CHEQUE', 'BANK_TRANSFER'],
        isActive: true,
        testMode: true,
      });
      const attemptResp = await paymentGatewayService.createPayment({
        invoiceId: testInvoice.id,
        amount: 5000,
        currency: 'INR',
        paymentMode: 'UPI',
        payerName: 'Resident',
        payerPhone: '9876543210',
        unitId,
        unitNumber: 'A-101',
        description: 'Test payment',
        callbackUrl: 'https://societyos.app/callback',
        idempotencyKey: 'idemp-attempt-phase1b',
      });
      attemptId = attemptResp.paymentId!;
    });

    it('rejects callback with missing signature', async () => {
      const res = await paymentGatewayService.handleCallback({
        paymentId: attemptId,
        amount: 5000,
      });
      expect(res.isValid).toBe(false);
      expect(res.error).toBe('PAYMENT_SIGNATURE_MISSING');
    });

    it('rejects callback with short signature (< 16 chars)', async () => {
      const res = await paymentGatewayService.handleCallback({
        paymentId: attemptId,
        amount: 5000,
        signature: 'short-sig',
      });
      expect(res.isValid).toBe(false);
      expect(res.error).toBe('PAYMENT_SIGNATURE_INVALID');
    });

    it('rejects callback with explicit INVALID_SIGNATURE', async () => {
      const res = await paymentGatewayService.handleCallback({
        paymentId: attemptId,
        amount: 5000,
        signature: 'INVALID_SIGNATURE',
      });
      expect(res.isValid).toBe(false);
      expect(res.error).toBe('PAYMENT_SIGNATURE_INVALID');
    });

    it('rejects long arbitrary forged signature (e.g. 64-character SHA-256 hex string)', async () => {
      const res = await paymentGatewayService.handleCallback({
        paymentId: attemptId,
        amount: 5000,
        signature: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      });
      expect(res.isValid).toBe(false);
      expect(res.error).toBe('PAYMENT_SIGNATURE_INVALID');
    });

    it('rejects forged signature prefixed with fake indicators', async () => {
      const res = await paymentGatewayService.handleCallback({
        paymentId: attemptId,
        amount: 5000,
        signature: 'fake_sig_1234567890abcdef_long',
      });
      expect(res.isValid).toBe(false);
      expect(res.error).toBe('PAYMENT_SIGNATURE_INVALID');
    });

    it('rejects missing payment reference', async () => {
      const res = await paymentGatewayService.handleCallback({
        amount: 5000,
        signature: 'mock_sig_att_500000_MOCK_KEY_SECRET',
      });
      expect(res.isValid).toBe(false);
      expect(res.error).toBe('Missing payment reference');
    });

    it('rejects callback for non-existent payment reference', async () => {
      const res = await paymentGatewayService.handleCallback({
        paymentId: 'att-non-existent-999',
        amount: 5000,
        signature: generateMockPaymentSignature('att-non-existent-999', 5000),
      });
      expect(res.isValid).toBe(false);
      expect(res.error).toBe('PAYMENT_REFERENCE_MISMATCH');
    });

    it('rejects callback with amount mismatch', async () => {
      const res = await paymentGatewayService.handleCallback({
        paymentId: attemptId,
        amount: 4500, // Attempt was 5000
        signature: generateMockPaymentSignature(attemptId, 4500),
      });
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('PAYMENT_AMOUNT_MISMATCH');
    });

    it('rejects callback with mismatched invoice ID', async () => {
      const res = await paymentGatewayService.handleCallback({
        paymentId: attemptId,
        amount: 5000,
        invoiceId: 'inv-wrong-invoice-999',
        signature: generateMockPaymentSignature(attemptId, 5000),
      });
      expect(res.isValid).toBe(false);
      expect(res.error).toBe('PAYMENT_INVOICE_MISMATCH');
    });

    it('rejects callback with mismatched society ID', async () => {
      const res = await paymentGatewayService.handleCallback({
        paymentId: attemptId,
        amount: 5000,
        societyId: 'soc-other-society',
        signature: generateMockPaymentSignature(attemptId, 5000),
      });
      expect(res.isValid).toBe(false);
      expect(res.error).toBe('PAYMENT_SOCIETY_MISMATCH');
    });

    it('rejects callback with mismatched currency', async () => {
      const res = await paymentGatewayService.handleCallback({
        paymentId: attemptId,
        amount: 5000,
        currency: 'USD', // Attempt was INR
        signature: generateMockPaymentSignature(attemptId, 5000),
      });
      expect(res.isValid).toBe(false);
      expect(res.error).toBe('PAYMENT_CURRENCY_MISMATCH');
    });

    it('rejects callback on cancelled payment attempt', async () => {
      mockStore.updatePaymentAttempt(attemptId, { status: 'CANCELLED' });
      const res = await paymentGatewayService.handleCallback({
        paymentId: attemptId,
        amount: 5000,
        signature: generateMockPaymentSignature(attemptId, 5000),
      });
      expect(res.isValid).toBe(false);
      expect(res.error).toBe('PAYMENT_ALREADY_CANCELLED');
    });

    it('settles legitimate mock callback with valid signature', async () => {
      const validSig = generateMockPaymentSignature(attemptId, 5000);
      const res = await paymentGatewayService.handleCallback({
        paymentId: attemptId,
        amount: 5000,
        gatewayTransactionId: 'gw-txn-settle-001',
        signature: validSig,
      });
      expect(res.isValid).toBe(true);
      expect(res.status).toBe('SETTLED');
      expect(res.duplicate).toBe(false);

      // Verify invoice was settled in store
      const invoices = mockStore.getState().invoices as Invoice[];
      const settled = invoices.find((i) => i.id === testInvoice.id);
      expect(settled?.status).toBe('PAID');
      expect(settled?.balance).toBe(0);
    });

    it('handles idempotent duplicate callback gracefully', async () => {
      const validSig = generateMockPaymentSignature(attemptId, 5000);
      const first = await paymentGatewayService.handleCallback({
        paymentId: attemptId,
        amount: 5000,
        gatewayTransactionId: 'gw-txn-dup-001',
        signature: validSig,
      });
      expect(first.isValid).toBe(true);
      expect(first.duplicate).toBe(false);

      const duplicate = await paymentGatewayService.handleCallback({
        paymentId: attemptId,
        amount: 5000,
        gatewayTransactionId: 'gw-txn-dup-001',
        signature: validSig,
      });
      expect(duplicate.isValid).toBe(true);
      expect(duplicate.duplicate).toBe(true);
    });

    it('detects replay attack when duplicate attempt has conflicting gateway transaction ID', async () => {
      const validSig = generateMockPaymentSignature(attemptId, 5000);
      await paymentGatewayService.handleCallback({
        paymentId: attemptId,
        amount: 5000,
        gatewayTransactionId: 'gw-txn-original',
        signature: validSig,
      });

      const replay = await paymentGatewayService.handleCallback({
        paymentId: attemptId,
        amount: 5000,
        gatewayTransactionId: 'gw-txn-conflicting-replay',
        signature: validSig,
      });
      expect(replay.isValid).toBe(false);
      expect(replay.error).toBe('PAYMENT_REPLAY_DETECTED');
    });

    it('rejects callback after refund has already occurred', async () => {
      const validSig = generateMockPaymentSignature(attemptId, 5000);
      const settled = await paymentGatewayService.handleCallback({
        paymentId: attemptId,
        amount: 5000,
        gatewayTransactionId: 'gw-txn-for-refund',
        signature: validSig,
      });

      // Process refund
      await paymentGatewayService.refundPayment({
        paymentTransactionId: settled.paymentId!,
        amount: 5000,
        reason: 'Refunded by admin',
        idempotencyKey: 'idemp-refund-post-1',
      });

      // Attempt callback after refund
      const postRefund = await paymentGatewayService.handleCallback({
        paymentId: attemptId,
        amount: 5000,
        gatewayTransactionId: 'gw-txn-for-refund',
        signature: validSig,
      });
      expect(postRefund.isValid).toBe(false);
      expect(postRefund.error).toBe('PAYMENT_ALREADY_REFUNDED');
    });
  });

  describe('4. Financial Truthfulness & Receipt Integrity', () => {
    it('returns NOT_FOUND for non-existent receipt IDs starting with REC-', async () => {
      const res = await billRepository.getReceiptById('REC-fake-arbitrary-123');
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.error.code).toBe('NOT_FOUND');
      }
    });

    it('returns NOT_FOUND for empty or non-existent ID', async () => {
      const res = await billRepository.getReceiptById('');
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.error.code).toBe('NOT_FOUND');
      }
    });

    it('returns true receipt record when authoritative receipt exists in store', async () => {
      const realReceipt: Receipt = {
        id: 'rcpt-real-101',
        receiptNumber: 'RCPT-SOC-2026-0042',
        paymentTransactionId: 'txn-real-001',
        invoiceId: 'inv-phase1b-001',
        unitId: 'unit-101',
        payerName: 'Rohan Sharma',
        amount: 5000,
        currency: 'INR',
        paymentMode: 'UPI',
        paymentDate: '2026-11-21T10:00:00Z',
        paymentReference: 'UPI-TXN-123456',
        paymentMethod: 'UPI',
        allocations: [],
        status: 'GENERATED',
        generatedAt: '2026-11-21T10:00:00Z',
        generatedBy: 'SYSTEM',
      };
      mockStore.addReceipt(realReceipt);

      const resById = await billRepository.getReceiptById('rcpt-real-101');
      expect(resById.ok).toBe(true);
      if (resById.ok) {
        expect(resById.data.id).toBe('rcpt-real-101');
        expect(resById.data.receiptNumber).toBe('RCPT-SOC-2026-0042');
        expect(resById.data.amount).toBe(5000);
      }

      const resByNumber = await billRepository.getReceiptById('RCPT-SOC-2026-0042');
      expect(resByNumber.ok).toBe(true);
      if (resByNumber.ok) {
        expect(resByNumber.data.id).toBe('rcpt-real-101');
      }
    });
  });

  describe('5. Billing Repository Unsupported Operations Fail Closed', () => {
    it('returns UNSUPPORTED_OPERATION for publishBillingCycle', async () => {
      const res = await billRepository.publishBillingCycle();
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.error.code).toBe('UNSUPPORTED_OPERATION');
      }
    });

    it('returns UNSUPPORTED_OPERATION for generateMonthlyBills', async () => {
      const res = await billRepository.generateMonthlyBills();
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.error.code).toBe('UNSUPPORTED_OPERATION');
      }
    });

    it('returns UNSUPPORTED_OPERATION for recordManualPayment', async () => {
      const res = await billRepository.recordManualPayment({
        unitId: 'unit-101',
        amount: 2500,
        paymentMethod: 'CASH_CHEQUE',
      });
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.error.code).toBe('UNSUPPORTED_OPERATION');
      }
    });

    it('returns UNSUPPORTED_OPERATION for createBillingCorrectionRequest', async () => {
      const res = await billRepository.createBillingCorrectionRequest({
        billId: 'bill-101',
        reason: 'Incorrect water charge calculation',
      });
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.error.code).toBe('UNSUPPORTED_OPERATION');
      }
    });
  });
});
