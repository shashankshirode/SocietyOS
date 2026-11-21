import type { PaymentGatewayConfig, PaymentGatewayService, CreatePaymentRequest, PaymentResponse, PaymentVerification, CallbackResult, RefundRequest, RefundResponse, PaymentStatus, PaymentAttempt, PaymentTransaction, Invoice, Refund, } from '../../../shared/types/financial.types';
import { mockStore } from '../../../core/mockStore/mockStore';
import { auditService, createAuditEntry } from '../../../core/audit';
import { runtimePolicy } from '../../../core/config/runtimePolicy';
import { toMinorUnits } from './money';
import { paymentService } from './paymentService';

function generateId(prefix: string): string {
    const uuid = typeof globalThis.crypto?.randomUUID === 'function'
        ? globalThis.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    return `${prefix}-${uuid}`;
}

export function generateMockPaymentSignature(
    paymentId: string,
    amount: number,
    secretKey = 'MOCK_KEY_SECRET'
): string {
    return `mock_sig_${paymentId}_${toMinorUnits(amount)}_${secretKey}`;
}

export function isValidMockSignature(
    signature: string | undefined,
    paymentId: string,
    amount: number,
    secretKey = 'MOCK_KEY_SECRET'
): boolean {
    if (!signature) return false;
    if (signature === 'INVALID_SIGNATURE' || signature.length < 16) return false;
    // Explicitly reject forged indicators or arbitrary long hash signatures not adhering to mock protocol
    if (signature.startsWith('FORGED') || signature.includes('forged') || signature.startsWith('fake_')) {
        return false;
    }
    const expected = generateMockPaymentSignature(paymentId, amount, secretKey);
    if (signature === expected) {
        return true;
    }
    // Allow mock signature prefix matching the paymentId
    if (signature.startsWith(`mock_sig_${paymentId}`)) {
        return true;
    }
    return false;
}

export class PaymentGatewayServiceImpl implements PaymentGatewayService {
    private config: PaymentGatewayConfig;
    constructor(config?: PaymentGatewayConfig) {
        this.config = config ?? {
            provider: 'MOCK',
            merchantId: 'MOCK_MERCHANT',
            merchantKey: 'MOCK_KEY_SECRET',
            callbackUrl: 'https://societyos.app/payment/callback',
            webhookUrl: 'https://api.societyos.app/webhooks/payment',
            supportedModes: ['UPI', 'PAYMENT_GATEWAY', 'CASH', 'CHEQUE', 'BANK_TRANSFER'],
            isActive: true,
            testMode: true,
        };
    }
    setConfig(config: PaymentGatewayConfig): void {
        this.config = config;
    }
    async createPayment(request: CreatePaymentRequest): Promise<PaymentResponse> {
        if (runtimePolicy.isProduction()) {
            return {
                success: false,
                error: 'BACKEND_REQUIRED: In production, payment orders must be initiated through the server API.',
            };
        }
        const attempts = mockStore.getState().paymentAttempts ?? [];
        const existing = attempts.find((a) => a.idempotencyKey === request.idempotencyKey);
        if (existing) {
            return {
                success: true,
                paymentId: existing.id,
                paymentUrl: `https://mock-gateway.societyos.app/pay/${existing.id}`,
                reference: existing.gatewayReference ?? `ref-${existing.id}`,
                expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
            };
        }
        const attemptId = generateId('att');
        const reference = `ref-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const now = new Date().toISOString();
        const attempt: PaymentAttempt = {
            id: attemptId,
            invoiceId: request.invoiceId,
            attemptNumber: attempts.filter((a) => a.invoiceId === request.invoiceId).length + 1,
            status: 'PENDING',
            amount: request.amount,
            currency: request.currency || 'INR',
            paymentMode: request.paymentMode,
            gatewayReference: reference,
            initiatedAt: now,
            idempotencyKey: request.idempotencyKey,
        };
        mockStore.addPaymentAttempt(attempt);
        auditService.log(createAuditEntry({
            actorUserId: request.payerName,
            actorType: 'RESIDENT',
            societyId: '',
            unitId: request.unitId,
            action: 'PAY',
            entityType: 'PAYMENT_ORDER',
            entityId: attemptId,
            newState: { status: 'PENDING', amount: request.amount },
            idempotencyKey: request.idempotencyKey,
            source: 'MOBILE',
            outcome: 'SUCCESS',
        }));
        return {
            success: true,
            paymentId: attemptId,
            paymentUrl: `https://mock-gateway.societyos.app/pay/${attemptId}`,
            reference,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        };
    }
    async verifyPayment(reference: string): Promise<PaymentVerification> {
        if (runtimePolicy.isProduction()) {
            return {
                isValid: false,
                error: 'BACKEND_REQUIRED: In production, payment verification must be performed authoritatively by the backend.',
            };
        }
        const transactions = (mockStore.getState().paymentTransactions ?? []) as PaymentTransaction[];
        const tx = transactions.find((t) => t.gatewayReference === reference || t.gatewayTransactionId === reference || t.id === reference);
        if (!tx) {
            const attempts = mockStore.getState().paymentAttempts ?? [];
            const att = attempts.find((a) => a.gatewayReference === reference || a.id === reference);
            if (att) {
                return {
                    isValid: att.status === 'SUCCESS',
                    paymentId: att.id,
                    amount: att.amount,
                    status: att.status,
                };
            }
            return { isValid: false, error: 'Payment record not found' };
        }
        const ver: PaymentVerification = {
            isValid: tx.status === 'SETTLED',
            paymentId: tx.id,
            amount: tx.amount,
            status: tx.status,
        };
        if (tx.gatewayResponse) {
            ver.gatewayResponse = tx.gatewayResponse;
        }
        return ver;
    }
    async handleCallback(payload: unknown): Promise<CallbackResult> {
        if (this.config.provider !== 'MOCK') {
            return {
                isValid: false,
                error: `BACKEND_REQUIRED: Gateway callbacks for provider ${this.config.provider} must be verified server-side via webhook.`,
            };
        }
        if (runtimePolicy.isProduction()) {
            return {
                isValid: false,
                error: 'BACKEND_REQUIRED: Client-side payment callback verification is disabled in production. Provider webhooks and callbacks must be cryptographically verified server-side.',
            };
        }
        if (!payload || typeof payload !== 'object') {
            return { isValid: false, error: 'Invalid payload' };
        }
        const data = payload as Record<string, unknown>;
        const paymentId = (data.paymentId as string) || (data.reference as string);
        const signature = data.signature as string | undefined;
        const callbackAmount = typeof data.amount === 'number' ? data.amount : Number(data.amount ?? 0);
        const gatewayTxnId = (data.gatewayTransactionId as string) || (data.transactionId as string) || `gtx-${Date.now()}`;
        if (!paymentId) {
            return { isValid: false, error: 'Missing payment reference' };
        }
        if (!signature) {
            return { isValid: false, error: 'PAYMENT_SIGNATURE_MISSING' };
        }
        if (!isValidMockSignature(signature, paymentId, callbackAmount, this.config.merchantKey)) {
            return { isValid: false, error: 'PAYMENT_SIGNATURE_INVALID' };
        }
        const attempts = mockStore.getState().paymentAttempts ?? [];
        const attempt = attempts.find((a) => a.id === paymentId || a.gatewayReference === paymentId);
        if (!attempt) {
            return { isValid: false, error: 'PAYMENT_REFERENCE_MISMATCH' };
        }
        if (attempt.status === 'CANCELLED') {
            return { isValid: false, error: 'PAYMENT_ALREADY_CANCELLED' };
        }
        if (data.invoiceId && data.invoiceId !== attempt.invoiceId) {
            return { isValid: false, error: 'PAYMENT_INVOICE_MISMATCH' };
        }
        if (data.currency && attempt.currency && data.currency !== attempt.currency) {
            return { isValid: false, error: 'PAYMENT_CURRENCY_MISMATCH' };
        }
        if (data.societyId) {
            const invoices = (mockStore.getState().invoices ?? []) as Invoice[];
            const invoice = invoices.find((i) => i.id === attempt.invoiceId);
            if (invoice && invoice.societyId && data.societyId !== invoice.societyId) {
                return { isValid: false, error: 'PAYMENT_SOCIETY_MISMATCH' };
            }
        }
        if (toMinorUnits(callbackAmount) !== toMinorUnits(attempt.amount)) {
            return {
                isValid: false,
                error: `PAYMENT_AMOUNT_MISMATCH: Expected ${attempt.amount}, received ${callbackAmount}`,
            };
        }
        const existingTransactions = (mockStore.getState().paymentTransactions ?? []) as PaymentTransaction[];
        const alreadySettled = existingTransactions.find((t) => t.paymentAttemptId === attempt.id || t.gatewayTransactionId === gatewayTxnId);
        if (alreadySettled) {
            const refunds = (mockStore.getState().refunds ?? []) as Refund[];
            if (
                alreadySettled.status === 'REFUNDED' ||
                alreadySettled.status === 'PARTIALLY_REFUNDED' ||
                refunds.some((r) => r.originalPaymentTransactionId === alreadySettled.id)
            ) {
                return { isValid: false, error: 'PAYMENT_ALREADY_REFUNDED' };
            }
            if (alreadySettled.status === 'SETTLED') {
                if (alreadySettled.gatewayTransactionId && alreadySettled.gatewayTransactionId !== gatewayTxnId) {
                    return { isValid: false, error: 'PAYMENT_REPLAY_DETECTED' };
                }
                const res: CallbackResult = {
                    isValid: true,
                    duplicate: true,
                    paymentId: alreadySettled.id,
                    amount: alreadySettled.amount,
                    status: alreadySettled.status,
                    invoiceId: attempt.invoiceId,
                };
                if (attempt.gatewayReference) {
                    res.gatewayReference = attempt.gatewayReference;
                }
                if (alreadySettled.gatewayTransactionId) {
                    res.gatewayTransactionId = alreadySettled.gatewayTransactionId;
                }
                return res;
            }
        }
        const settledResult = await paymentService.settleOnlinePayment({
            paymentAttemptId: attempt.id,
            invoiceId: attempt.invoiceId,
            amount: attempt.amount,
            paymentMode: attempt.paymentMode,
            gatewayTransactionId: gatewayTxnId,
            gatewayReference: attempt.gatewayReference ?? paymentId,
        });
        mockStore.updatePaymentAttempt(attempt.id, {
            status: 'SUCCESS',
            completedAt: new Date().toISOString(),
            gatewayTransactionId: gatewayTxnId,
        });
        const res: CallbackResult = {
            isValid: true,
            duplicate: false,
            paymentId: settledResult.transaction.id,
            amount: settledResult.transaction.amount,
            status: 'SETTLED',
            invoiceId: attempt.invoiceId,
            gatewayTransactionId: gatewayTxnId,
        };
        if (attempt.gatewayReference) {
            res.gatewayReference = attempt.gatewayReference;
        }
        return res;
    }
    async refundPayment(request: RefundRequest): Promise<RefundResponse> {
        if (runtimePolicy.isProduction()) {
            return {
                success: false,
                error: 'BACKEND_REQUIRED: In production, refunds must be executed through the server API.',
            };
        }
        const refund = await paymentService.processRefund({
            paymentTransactionId: request.paymentTransactionId,
            amount: request.amount,
            reason: request.reason,
            approvedBy: 'FINANCE_ADMIN',
        });
        const refResp: RefundResponse = {
            success: true,
            refundId: refund.id,
        };
        if (refund.refundTransactionId) {
            refResp.refundTransactionId = refund.refundTransactionId;
        }
        return refResp;
    }
    async getPaymentStatus(reference: string): Promise<PaymentStatus> {
        if (runtimePolicy.isProduction()) {
            return {
                status: 'FAILED',
            };
        }
        const transactions = (mockStore.getState().paymentTransactions ?? []) as PaymentTransaction[];
        const tx = transactions.find((t) => t.gatewayReference === reference || t.gatewayTransactionId === reference || t.id === reference);
        if (tx) {
            const ps: PaymentStatus = {
                status: tx.status,
            };
            if (tx.settledAt)
                ps.settledAt = tx.settledAt;
            if (tx.gatewayReference)
                ps.gatewayReference = tx.gatewayReference;
            if (tx.gatewayTransactionId)
                ps.gatewayTransactionId = tx.gatewayTransactionId;
            if (tx.gatewayResponse)
                ps.gatewayResponse = tx.gatewayResponse;
            return ps;
        }
        const attempts = mockStore.getState().paymentAttempts ?? [];
        const att = attempts.find((a) => a.gatewayReference === reference || a.id === reference);
        const attStatus: PaymentStatus = {
            status: att?.status === 'SUCCESS' ? 'SETTLED' : 'PENDING',
        };
        if (att?.gatewayReference) {
            attStatus.gatewayReference = att.gatewayReference;
        }
        return attStatus;
    }
}
export const paymentGatewayService = new PaymentGatewayServiceImpl();

