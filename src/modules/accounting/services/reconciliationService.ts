import { mockStore } from '../../../core/mockStore/mockStore';
import type { BankReconciliationRecord, ReconciliationStatus, PaymentTransaction, } from '../../../shared/types/financial.types';
import { auditService, createAuditEntry } from '../../../core/audit';
import { toMinorUnits } from './money';
function generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
export class ReconciliationService {
    private static instance: ReconciliationService;
    static getInstance(): ReconciliationService {
        if (!ReconciliationService.instance) {
            ReconciliationService.instance = new ReconciliationService();
        }
        return ReconciliationService.instance;
    }
    async getReconciliationRecords(filters?: {
        societyId?: string;
        status?: ReconciliationStatus;
        dateFrom?: string;
        dateTo?: string;
        bankName?: string;
    }): Promise<BankReconciliationRecord[]> {
        let records = (mockStore.getState().bankReconciliationRecords ?? []) as BankReconciliationRecord[];
        if (filters?.societyId)
            records = records.filter((r) => r.societyId === filters.societyId);
        if (filters?.status)
            records = records.filter((r) => r.status === filters.status);
        if (filters?.dateFrom) {
            const fromTime = new Date(filters.dateFrom).getTime();
            records = records.filter((r) => new Date(r.statementDate).getTime() >= fromTime);
        }
        if (filters?.dateTo) {
            const toTime = new Date(filters.dateTo).getTime();
            records = records.filter((r) => new Date(r.statementDate).getTime() <= toTime);
        }
        if (filters?.bankName)
            records = records.filter((r) => r.bankName === filters.bankName);
        return records.sort((a, b) => new Date(b.statementDate).getTime() - new Date(a.statementDate).getTime());
    }
    async getRecord(recordId: string): Promise<BankReconciliationRecord | null> {
        const records = (mockStore.getState().bankReconciliationRecords ?? []) as BankReconciliationRecord[];
        return records.find((r) => r.id === recordId) ?? null;
    }
    async createRecord(input: {
        statementDate: string;
        bankReference: string;
        amount: number;
        transactionType: 'DEBIT' | 'CREDIT';
        narration?: string;
        bankName: string;
        bankAccount?: string;
        societyId: string;
    }): Promise<BankReconciliationRecord> {
        const now = new Date().toISOString();
        const existingRecords = (mockStore.getState().bankReconciliationRecords ?? []) as BankReconciliationRecord[];
        const duplicate = existingRecords.find((r) => r.bankReference === input.bankReference);
        if (duplicate) {
            return duplicate;
        }
        const txns = (mockStore.getState().paymentTransactions ?? []) as PaymentTransaction[];
        const inputMinor = toMinorUnits(input.amount);
        const matchedPayment = txns.find((t) => toMinorUnits(t.amount) === inputMinor &&
            (t.gatewayReference === input.bankReference ||
                t.gatewayTransactionId === input.bankReference ||
                (input.narration && input.narration.includes(t.gatewayReference ?? ''))));
        const isMatched = !!matchedPayment;
        const status: ReconciliationStatus = isMatched ? 'MATCHED' : 'UNMATCHED';
        const record: BankReconciliationRecord = {
            id: generateId('rec'),
            statementDate: input.statementDate,
            bankReference: input.bankReference,
            amount: input.amount,
            transactionType: input.transactionType,
            bankName: input.bankName,
            societyId: input.societyId,
            status,
            matchConfidence: isMatched ? 1.0 : 0,
            ...(input.narration !== undefined ? { narration: input.narration } : {}),
            ...(input.bankAccount !== undefined ? { bankAccount: input.bankAccount } : {}),
            ...(matchedPayment ? { matchedPaymentId: matchedPayment.id, matchedAt: now, matchedBy: 'AUTO_MATCHER' } : {}),
        };
        mockStore.addBankReconciliationRecord(record);
        auditService.log(createAuditEntry({
            actorUserId: 'SYSTEM',
            actorType: 'SYSTEM',
            societyId: input.societyId,
            action: 'IMPORT',
            entityType: 'BANK_STATEMENT',
            entityId: record.id,
            newState: { status: record.status, bankReference: record.bankReference, amount: record.amount },
            idempotencyKey: input.bankReference,
            source: 'API',
            outcome: 'SUCCESS',
        }));
        return record;
    }
    async manualMatch(recordId: string, paymentId: string, matchedBy: string): Promise<BankReconciliationRecord> {
        const records = (mockStore.getState().bankReconciliationRecords ?? []) as BankReconciliationRecord[];
        const index = records.findIndex((r) => r.id === recordId);
        if (index === -1) {
            throw new Error('Bank reconciliation record not found');
        }
        const rec = records[index];
        if (!rec) {
            throw new Error('Bank reconciliation record not found');
        }
        const txns = (mockStore.getState().paymentTransactions ?? []) as PaymentTransaction[];
        const payment = txns.find((t) => t.id === paymentId);
        if (!payment) {
            throw new Error('Payment transaction not found for manual match');
        }
        const now = new Date().toISOString();
        const updated: BankReconciliationRecord = {
            ...rec,
            status: 'MATCHED',
            matchedPaymentId: paymentId,
            matchedAt: now,
            matchedBy,
            matchConfidence: 1.0,
        };
        mockStore.updateBankReconciliationRecord(recordId, updated);
        auditService.log(createAuditEntry({
            actorUserId: matchedBy,
            actorType: 'ADMIN',
            societyId: rec.societyId ?? 'soc-001',
            action: 'VERIFY',
            entityType: 'RECONCILIATION_MATCH',
            entityId: recordId,
            newState: { status: 'MATCHED', paymentId },
            idempotencyKey: `match_${recordId}_${paymentId}`,
            source: 'MOBILE',
            outcome: 'SUCCESS',
        }));
        return updated;
    }
    async rejectMatch(recordId: string, reason: string, rejectedBy: string): Promise<BankReconciliationRecord> {
        const records = (mockStore.getState().bankReconciliationRecords ?? []) as BankReconciliationRecord[];
        const index = records.findIndex((r) => r.id === recordId);
        if (index === -1) {
            throw new Error('Bank reconciliation record not found');
        }
        const rec = records[index];
        if (!rec) {
            throw new Error('Bank reconciliation record not found');
        }
        const updated: BankReconciliationRecord = {
            ...rec,
            status: 'REJECTED',
            rejectionReason: reason,
            reviewedBy: rejectedBy,
            reviewedAt: new Date().toISOString(),
        };
        mockStore.updateBankReconciliationRecord(recordId, updated);
        return updated;
    }
}
export const reconciliationService = ReconciliationService.getInstance();

