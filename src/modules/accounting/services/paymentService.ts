import { mockStore } from '../../../core/mockStore/mockStore';
import type { PaymentTransaction, PaymentAllocation, Receipt, ReceiptAllocation, Invoice, InvoiceStatus, PaymentMode, Refund, } from '../../../shared/types/financial.types';
import type { Bill, BillStatus } from '../../../shared/types/bill.types';
import type { ManualPaymentInput, ManualPaymentRecord } from '../../../shared/types/accounting.types';
import { auditService, createAuditEntry } from '../../../core/audit';
import { toMinorUnits, fromMinorUnits, addMoney, subtractMoney, } from './money';
function generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
function generateReceiptNumber(societyId: string, sequence: number): string {
    const socCode = societyId.replace(/[^A-Za-z0-9]/g, '').substring(0, 3).toUpperCase() || 'SOC';
    const year = new Date().getFullYear();
    return `RCPT-${socCode}-${year}-${sequence.toString().padStart(4, '0')}`;
}
export interface ChequeRecord {
    id: string;
    unitId: string;
    chequeNumber: string;
    bankName: string;
    amount: number;
    status: 'RECEIVED' | 'DEPOSITED' | 'CLEARED' | 'BOUNCED' | 'CANCELLED';
    receivedDate: string;
    clearedDate?: string;
    bounceDate?: string;
    bounceReason?: string;
    paymentTransactionId: string;
}
export class PaymentService {
    private static instance: PaymentService;
    static getInstance(): PaymentService {
        if (!PaymentService.instance) {
            PaymentService.instance = new PaymentService();
        }
        return PaymentService.instance;
    }
    async settleOnlinePayment(params: {
        paymentAttemptId: string;
        invoiceId: string;
        amount: number;
        paymentMode: PaymentMode;
        gatewayTransactionId: string;
        gatewayReference: string;
    }): Promise<{
        transaction: PaymentTransaction;
        receipt: Receipt;
    }> {
        const invoices = (mockStore.getState().invoices ?? []) as Invoice[];
        const invoice = invoices.find((i) => i.id === params.invoiceId);
        if (!invoice) {
            throw new Error(`INVOICE_NOT_FOUND: Invoice ${params.invoiceId} does not exist`);
        }
        const now = new Date().toISOString();
        const txnId = generateId('txn');
        const paymentTxn: PaymentTransaction = {
            id: txnId,
            paymentAttemptId: params.paymentAttemptId,
            invoiceId: params.invoiceId,
            status: 'SETTLED',
            amount: params.amount,
            currency: invoice.currency || 'INR',
            paymentMode: params.paymentMode,
            gatewayTransactionId: params.gatewayTransactionId,
            gatewayReference: params.gatewayReference,
            settledAt: now,
            settledBy: 'GATEWAY_CALLBACK',
        };
        mockStore.addPaymentTransaction(paymentTxn);
        const paymentAmountMinor = toMinorUnits(params.amount);
        const invoiceBalanceMinor = toMinorUnits(invoice.balance);
        let allocatedToInvoiceMinor = 0;
        let excessToAdvanceMinor = 0;
        if (paymentAmountMinor <= invoiceBalanceMinor) {
            allocatedToInvoiceMinor = paymentAmountMinor;
        }
        else {
            allocatedToInvoiceMinor = invoiceBalanceMinor;
            excessToAdvanceMinor = subtractMoney(paymentAmountMinor, invoiceBalanceMinor);
        }
        const allocatedAmount = fromMinorUnits(allocatedToInvoiceMinor);
        const remainingInvoiceBalanceMinor = subtractMoney(invoiceBalanceMinor, allocatedToInvoiceMinor);
        const newInvoiceStatus: InvoiceStatus = remainingInvoiceBalanceMinor === 0 ? 'PAID' : 'PARTIALLY_PAID';
        const updatedInvoice: Invoice = {
            ...invoice,
            balance: fromMinorUnits(remainingInvoiceBalanceMinor),
            status: newInvoiceStatus,
        };
        mockStore.updateInvoice(invoice.id, updatedInvoice);
        const allocationId = generateId('alloc');
        const paymentAllocation: PaymentAllocation = {
            id: allocationId,
            paymentTransactionId: txnId,
            invoiceId: invoice.id,
            allocatedAmount,
            allocatedAt: now,
            allocatedBy: 'SYSTEM',
            isAdvance: false,
        };
        mockStore.addPaymentAllocation(paymentAllocation);
        if (excessToAdvanceMinor > 0) {
            const excessAmount = fromMinorUnits(excessToAdvanceMinor);
            const currentAdvances = mockStore.getState().advanceBalances ?? {};
            const currentUnitAdvance = currentAdvances[invoice.unitId] ?? 0;
            const updatedAdvance = fromMinorUnits(addMoney(toMinorUnits(currentUnitAdvance), excessToAdvanceMinor));
            mockStore.updateAdvanceBalance(invoice.unitId, updatedAdvance);
            const advanceAlloc: PaymentAllocation = {
                id: generateId('alloc-adv'),
                paymentTransactionId: txnId,
                invoiceId: invoice.id,
                allocatedAmount: excessAmount,
                allocatedAt: now,
                allocatedBy: 'SYSTEM',
                isAdvance: true,
            };
            mockStore.addPaymentAllocation(advanceAlloc);
        }
        const receipts = (mockStore.getState().receipts ?? []) as Receipt[];
        const receiptNumber = generateReceiptNumber(invoice.societyId, receipts.length + 1);
        const receiptId = generateId('rcpt');
        const receiptAllocation: ReceiptAllocation = {
            id: generateId('r-alloc'),
            receiptId,
            invoiceId: invoice.id,
            allocatedAmount,
        };
        mockStore.addReceiptAllocation(receiptAllocation);
        const receipt: Receipt = {
            id: receiptId,
            receiptNumber,
            paymentTransactionId: txnId,
            invoiceId: invoice.id,
            unitId: invoice.unitId,
            payerName: 'Resident',
            amount: params.amount,
            currency: invoice.currency || 'INR',
            paymentMode: params.paymentMode,
            paymentDate: now,
            paymentReference: params.gatewayTransactionId,
            paymentMethod: params.paymentMode,
            allocations: [receiptAllocation],
            status: 'GENERATED',
            generatedAt: now,
            generatedBy: 'SYSTEM',
        };
        mockStore.addReceipt(receipt);
        const currentLedger = mockStore.getState().ledgerEntries ?? [];
        const unitEntries = currentLedger.filter((e) => e.unitId === invoice.unitId);
        const lastBalance = unitEntries.length > 0 ? unitEntries[0]?.amount ?? 0 : 0;
        const newLedgerBalance = subtractMoney(toMinorUnits(lastBalance), paymentAmountMinor);
        mockStore.addLedgerEntry({
            id: generateId('led'),
            unitId: invoice.unitId,
            amount: fromMinorUnits(newLedgerBalance),
            type: 'CREDIT',
            description: `Payment Received: ${receiptNumber} (${params.paymentMode})`,
            date: now,
        });
        const residentBills = (mockStore.getState().bills ?? []) as Bill[];
        const bill = residentBills.find((b) => b.id === invoice.id);
        if (bill) {
            const updatedBill: Bill = {
                ...bill,
                paidAmount: fromMinorUnits(addMoney(toMinorUnits(bill.paidAmount ?? 0), paymentAmountMinor)),
                status: newInvoiceStatus === 'PAID' ? ('PAID' as BillStatus) : ('PARTIALLY_PAID' as BillStatus),
                receiptNumber,
                transactionId: params.gatewayTransactionId,
                paidDate: now,
            };
            mockStore.updateBill(bill.id, updatedBill);
        }
        auditService.log(createAuditEntry({
            actorUserId: 'SYSTEM',
            actorType: 'SYSTEM',
            societyId: invoice.societyId,
            unitId: invoice.unitId,
            action: 'PAY',
            entityType: 'PAYMENT',
            entityId: txnId,
            newState: {
                amount: params.amount,
                receiptNumber,
                invoiceId: invoice.id,
                status: 'SETTLED',
            },
            idempotencyKey: params.gatewayTransactionId,
            source: 'API',
            outcome: 'SUCCESS',
        }));
        return { transaction: paymentTxn, receipt };
    }
    async recordManualPayment(input: ManualPaymentInput, recordedBy: string, societyId: string): Promise<ManualPaymentRecord> {
        const now = new Date().toISOString();
        const paymentId = generateId('mpay');
        const paymentNumber = `PAY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const isCheque = input.paymentMode === 'CHEQUE';
        const txnId = generateId('txn');
        const invoices = (mockStore.getState().invoices ?? []) as Invoice[];
        const unitInvoices = invoices.filter((i) => i.unitId === input.unitId && ['PUBLISHED', 'PARTIALLY_PAID', 'OVERDUE'].includes(i.status));
        const targetInvoice = unitInvoices[0];
        const paymentTxn: PaymentTransaction = {
            id: txnId,
            paymentAttemptId: paymentId,
            invoiceId: targetInvoice?.id ?? 'UNALLOCATED',
            status: isCheque ? 'PENDING' : 'SETTLED',
            amount: input.amount,
            currency: 'INR',
            paymentMode: input.paymentMode,
            gatewayReference: input.referenceNumber,
            settledBy: recordedBy,
        };
        if (!isCheque) {
            paymentTxn.settledAt = now;
        }
        mockStore.addPaymentTransaction(paymentTxn);
        if (isCheque) {
            const chequeRecord: ChequeRecord = {
                id: generateId('chq'),
                unitId: input.unitId,
                chequeNumber: input.chequeNumber ?? input.referenceNumber,
                bankName: input.bankName ?? 'Unknown Bank',
                amount: input.amount,
                status: 'RECEIVED',
                receivedDate: now,
                paymentTransactionId: txnId,
            };
            const cheques = (mockStore.getState().cheques ?? []) as ChequeRecord[];
            mockStore.getState().cheques = [chequeRecord, ...cheques];
        }
        let receiptId: string | undefined;
        let receiptNumber: string | undefined;
        if (!isCheque && targetInvoice) {
            const settled = await this.settleOnlinePayment({
                paymentAttemptId: paymentId,
                invoiceId: targetInvoice.id,
                amount: input.amount,
                paymentMode: input.paymentMode,
                gatewayTransactionId: input.referenceNumber || paymentNumber,
                gatewayReference: input.referenceNumber || paymentNumber,
            });
            receiptId = settled.receipt.id;
            receiptNumber = settled.receipt.receiptNumber;
        }
        const manualRecord: ManualPaymentRecord = {
            id: paymentId,
            paymentNumber,
            unitId: input.unitId,
            unitNumber: targetInvoice?.unitNumber ?? 'Unit',
            wing: 'Wing',
            residentName: 'Resident',
            amount: input.amount,
            paymentMode: input.paymentMode,
            paymentDate: input.paymentDate,
            referenceNumber: input.referenceNumber,
            receivedBy: recordedBy,
            status: isCheque ? 'PENDING' : 'RECEIPT_GENERATED',
            createdAt: now,
            requiresApproval: false,
            ...(receiptId !== undefined ? { receiptId } : {}),
            ...(receiptNumber !== undefined ? { receiptNumber } : {}),
            ...(input.bankName !== undefined ? { bankName: input.bankName } : {}),
            ...(input.chequeNumber !== undefined ? { chequeNumber: input.chequeNumber } : {}),
            ...(input.notes !== undefined ? { notes: input.notes } : {}),
        };
        mockStore.addManualPayment(manualRecord);
        auditService.log(createAuditEntry({
            actorUserId: recordedBy,
            actorType: 'ADMIN',
            societyId,
            unitId: input.unitId,
            action: 'CREATE',
            entityType: 'PAYMENT',
            entityId: paymentId,
            newState: { mode: input.paymentMode, amount: input.amount, reference: input.referenceNumber },
            idempotencyKey: input.referenceNumber || paymentId,
            source: 'MOBILE',
            outcome: 'SUCCESS',
        }));
        return manualRecord;
    }
    async clearCheque(chequeId: string, clearedBy: string): Promise<ChequeRecord> {
        const cheques = (mockStore.getState().cheques ?? []) as ChequeRecord[];
        const cheque = cheques.find((c) => c.id === chequeId);
        if (!cheque)
            throw new Error('Cheque not found');
        if (cheque.status !== 'RECEIVED' && cheque.status !== 'DEPOSITED') {
            throw new Error(`Cannot clear cheque in status: ${cheque.status}`);
        }
        const now = new Date().toISOString();
        const updatedCheque: ChequeRecord = {
            ...cheque,
            status: 'CLEARED',
            clearedDate: now,
        };
        mockStore.getState().cheques = cheques.map((c) => (c.id === chequeId ? updatedCheque : c));
        const txns = (mockStore.getState().paymentTransactions ?? []) as PaymentTransaction[];
        const txn = txns.find((t) => t.id === cheque.paymentTransactionId);
        if (txn) {
            mockStore.updatePaymentTransaction(txn.id, {
                status: 'SETTLED',
                settledAt: now,
                settledBy: clearedBy,
            });
            const invoices = (mockStore.getState().invoices ?? []) as Invoice[];
            const invoice = invoices.find((i) => i.id === txn.invoiceId) ?? invoices.find((i) => i.unitId === cheque.unitId);
            if (invoice) {
                await this.settleOnlinePayment({
                    paymentAttemptId: txn.paymentAttemptId,
                    invoiceId: invoice.id,
                    amount: cheque.amount,
                    paymentMode: 'CHEQUE',
                    gatewayTransactionId: cheque.chequeNumber,
                    gatewayReference: cheque.chequeNumber,
                });
            }
        }
        return updatedCheque;
    }
    async processChequeBounce(params: {
        chequeId: string;
        bounceReason: string;
        bouncedBy: string;
        bounceFee?: number;
    }): Promise<ChequeRecord> {
        const cheques = (mockStore.getState().cheques ?? []) as ChequeRecord[];
        const cheque = cheques.find((c) => c.id === params.chequeId);
        if (!cheque)
            throw new Error('Cheque not found');
        if (cheque.status === 'BOUNCED') {
            return cheque;
        }
        const now = new Date().toISOString();
        const updatedCheque: ChequeRecord = {
            ...cheque,
            status: 'BOUNCED',
            bounceDate: now,
            bounceReason: params.bounceReason,
        };
        mockStore.getState().cheques = cheques.map((c) => (c.id === params.chequeId ? updatedCheque : c));
        const txns = (mockStore.getState().paymentTransactions ?? []) as PaymentTransaction[];
        const txn = txns.find((t) => t.id === cheque.paymentTransactionId);
        if (txn) {
            mockStore.updatePaymentTransaction(txn.id, {
                status: 'REVERSED',
                reversalReason: `Cheque bounced: ${params.bounceReason}`,
                reversalAt: now,
            });
            const invoices = (mockStore.getState().invoices ?? []) as Invoice[];
            const invoice = invoices.find((i) => i.id === txn.invoiceId);
            if (invoice) {
                const restoredBalanceMinor = addMoney(toMinorUnits(invoice.balance), toMinorUnits(cheque.amount));
                mockStore.updateInvoice(invoice.id, {
                    balance: fromMinorUnits(restoredBalanceMinor),
                    status: 'OVERDUE',
                });
            }
        }
        const currentLedger = mockStore.getState().ledgerEntries ?? [];
        const unitEntries = currentLedger.filter((e) => e.unitId === cheque.unitId);
        const lastBalance = unitEntries.length > 0 ? unitEntries[0]?.amount ?? 0 : 0;
        const restoredLedgerBalance = addMoney(toMinorUnits(lastBalance), toMinorUnits(cheque.amount));
        mockStore.addLedgerEntry({
            id: generateId('led-rev'),
            unitId: cheque.unitId,
            amount: fromMinorUnits(restoredLedgerBalance),
            type: 'DEBIT',
            description: `Cheque Bounced Reversal: ${cheque.chequeNumber} (${params.bounceReason})`,
            date: now,
        });
        if (params.bounceFee && params.bounceFee > 0) {
            const withFeeBalance = addMoney(restoredLedgerBalance, toMinorUnits(params.bounceFee));
            mockStore.addLedgerEntry({
                id: generateId('led-fee'),
                unitId: cheque.unitId,
                amount: fromMinorUnits(withFeeBalance),
                type: 'DEBIT',
                description: `Cheque Bounce Processing Fee`,
                date: now,
            });
        }
        auditService.log(createAuditEntry({
            actorUserId: params.bouncedBy,
            actorType: 'ADMIN',
            societyId: '',
            unitId: cheque.unitId,
            action: 'REVERSE',
            entityType: 'PAYMENT',
            entityId: cheque.id,
            newState: { status: 'BOUNCED', reason: params.bounceReason },
            idempotencyKey: `bounce_${cheque.id}`,
            source: 'MOBILE',
            outcome: 'SUCCESS',
        }));
        return updatedCheque;
    }
    async processRefund(params: {
        paymentTransactionId: string;
        amount: number;
        reason: string;
        approvedBy: string;
    }): Promise<Refund> {
        const txns = (mockStore.getState().paymentTransactions ?? []) as PaymentTransaction[];
        const txn = txns.find((t) => t.id === params.paymentTransactionId);
        if (!txn)
            throw new Error('Payment transaction not found');
        if (txn.status !== 'SETTLED' && txn.status !== 'PARTIALLY_REFUNDED') {
            throw new Error(`Cannot refund transaction in status: ${txn.status}`);
        }
        const allRefunds = (mockStore.getState().refunds ?? []) as Refund[];
        const priorRefunds = allRefunds.filter((r) => r.originalPaymentTransactionId === params.paymentTransactionId && r.status === 'COMPLETED');
        const priorRefundTotalMinor = priorRefunds.reduce((sum, r) => addMoney(sum, toMinorUnits(r.amount)), 0);
        const availableMinor = subtractMoney(toMinorUnits(txn.amount), priorRefundTotalMinor);
        const requestedMinor = toMinorUnits(params.amount);
        if (requestedMinor <= 0) {
            throw new Error('Refund amount must be greater than zero');
        }
        if (requestedMinor > availableMinor) {
            throw new Error(`INSUFFICIENT_REFUNDABLE_AMOUNT: Requested ${params.amount}, but only ${fromMinorUnits(availableMinor)} refundable`);
        }
        const now = new Date().toISOString();
        const refundId = generateId('ref');
        const refund: Refund = {
            id: refundId,
            originalPaymentTransactionId: params.paymentTransactionId,
            invoiceId: txn.invoiceId,
            amount: params.amount,
            currency: txn.currency,
            reason: params.reason,
            approvedBy: params.approvedBy,
            approvedAt: now,
            processedAt: now,
            status: 'COMPLETED',
            refundTransactionId: generateId('rtxn'),
        };
        mockStore.addRefund(refund);
        const remainingAvailableMinor = subtractMoney(availableMinor, requestedMinor);
        mockStore.updatePaymentTransaction(txn.id, {
            status: remainingAvailableMinor === 0 ? 'REFUNDED' : 'PARTIALLY_REFUNDED',
        });
        const currentLedger = mockStore.getState().ledgerEntries ?? [];
        const invoice = ((mockStore.getState().invoices ?? []) as Invoice[]).find((i) => i.id === txn.invoiceId);
        const unitId = invoice?.unitId ?? 'UNKNOWN_UNIT';
        const unitEntries = currentLedger.filter((e) => e.unitId === unitId);
        const lastBalance = unitEntries.length > 0 ? unitEntries[0]?.amount ?? 0 : 0;
        const newLedgerBalance = addMoney(toMinorUnits(lastBalance), requestedMinor);
        mockStore.addLedgerEntry({
            id: generateId('led-rfnd'),
            unitId,
            amount: fromMinorUnits(newLedgerBalance),
            type: 'DEBIT',
            description: `Refund Issued for ${txn.gatewayReference || txn.id}: ${params.reason}`,
            date: now,
        });
        auditService.log(createAuditEntry({
            actorUserId: params.approvedBy,
            actorType: 'ADMIN',
            societyId: invoice?.societyId ?? '',
            unitId,
            action: 'REFUND',
            entityType: 'PAYMENT',
            entityId: refundId,
            newState: { amount: params.amount, reason: params.reason },
            idempotencyKey: `refund_${refundId}`,
            source: 'MOBILE',
            outcome: 'SUCCESS',
        }));
        return refund;
    }
}
export const paymentService = PaymentService.getInstance();

