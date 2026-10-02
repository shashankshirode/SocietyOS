import { mockStore } from '../../../core/mockStore/mockStore';
import type { Adjustment, AdjustmentType, } from '../../../shared/types/financial.types';
import { auditService, createAuditEntry } from '../../../core/audit';
import { toMinorUnits, fromMinorUnits, addMoney, subtractMoney } from './money';
function generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
export class AdjustmentService {
    private static instance: AdjustmentService;
    static getInstance(): AdjustmentService {
        if (!AdjustmentService.instance) {
            AdjustmentService.instance = new AdjustmentService();
        }
        return AdjustmentService.instance;
    }
    async createAdjustment(input: {
        invoiceId?: string;
        paymentTransactionId?: string;
        unitId: string;
        type: AdjustmentType;
        debitCredit: 'DEBIT' | 'CREDIT';
        amount: number;
        reason: string;
        reasonDetails?: string;
        approvedBy?: string;
        approvalStatus?: 'NOT_REQUIRED' | 'PENDING' | 'APPROVED' | 'REJECTED';
    }): Promise<Adjustment> {
        const now = new Date().toISOString();
        const isApproved = input.approvalStatus === 'APPROVED' || !input.approvalStatus || input.approvalStatus === 'NOT_REQUIRED';
        const adjustment: Adjustment = {
            id: generateId('adj'),
            unitId: input.unitId,
            type: input.type,
            debitCredit: input.debitCredit,
            amount: input.amount,
            reason: input.reason,
            approvalStatus: input.approvalStatus ?? 'NOT_REQUIRED',
            appliedAt: now,
            appliedBy: input.approvedBy ?? 'SYSTEM',
        };
        if (input.invoiceId) {
            adjustment.invoiceId = input.invoiceId;
            adjustment.relatedInvoiceId = input.invoiceId;
        }
        if (input.paymentTransactionId) {
            adjustment.paymentTransactionId = input.paymentTransactionId;
            adjustment.relatedPaymentId = input.paymentTransactionId;
        }
        if (input.reasonDetails) {
            adjustment.reasonDetails = input.reasonDetails;
        }
        if (input.approvedBy) {
            adjustment.approvedBy = input.approvedBy;
            adjustment.approvedAt = now;
        }
        mockStore.addAdjustment(adjustment);
        if (isApproved) {
            this.postAdjustmentToLedger(adjustment);
        }
        auditService.log(createAuditEntry({
            actorUserId: input.approvedBy ?? 'SYSTEM',
            actorType: 'ADMIN',
            societyId: '',
            unitId: input.unitId,
            action: 'CREATE',
            entityType: 'JOURNAL_ENTRY',
            entityId: adjustment.id,
            newState: {
                type: input.type,
                amount: input.amount,
                debitCredit: input.debitCredit,
                reason: input.reason,
            },
            idempotencyKey: `adjustment_${adjustment.id}`,
            source: 'MOBILE',
            outcome: 'SUCCESS',
        }));
        return adjustment;
    }
    async approveAdjustment(adjustmentId: string, approvedBy: string): Promise<Adjustment> {
        const adjustments = (mockStore.getState().adjustments ?? []) as Adjustment[];
        const index = adjustments.findIndex((a) => a.id === adjustmentId);
        if (index === -1) {
            throw new Error('Adjustment not found');
        }
        const adj = adjustments[index];
        if (!adj) {
            throw new Error('Adjustment not found');
        }
        const now = new Date().toISOString();
        const updated: Adjustment = {
            ...adj,
            approvalStatus: 'APPROVED',
            approvedBy,
            approvedAt: now,
        };
        mockStore.updateAdjustment(adjustmentId, updated);
        this.postAdjustmentToLedger(updated);
        auditService.log(createAuditEntry({
            actorUserId: approvedBy,
            actorType: 'ADMIN',
            societyId: '',
            unitId: updated.unitId,
            action: 'APPROVE',
            entityType: 'JOURNAL_ENTRY',
            entityId: adjustmentId,
            newState: { approvalStatus: 'APPROVED' },
            idempotencyKey: `approve_adj_${adjustmentId}`,
            source: 'MOBILE',
            outcome: 'SUCCESS',
        }));
        return updated;
    }
    private postAdjustmentToLedger(adj: Adjustment): void {
        const currentLedger = mockStore.getState().ledgerEntries ?? [];
        const unitEntries = currentLedger.filter((e) => e.unitId === adj.unitId);
        const lastBalanceMinor = unitEntries.length > 0 ? toMinorUnits(unitEntries[0]?.amount ?? 0) : 0;
        const adjMinor = toMinorUnits(adj.amount);
        const newBalanceMinor = adj.debitCredit === 'CREDIT'
            ? subtractMoney(lastBalanceMinor, adjMinor)
            : addMoney(lastBalanceMinor, adjMinor);
        mockStore.addLedgerEntry({
            id: generateId('led-adj'),
            unitId: adj.unitId,
            amount: fromMinorUnits(newBalanceMinor),
            type: adj.debitCredit,
            description: `Adjustment [${adj.type}]: ${adj.reason}`,
            date: new Date().toISOString(),
        });
    }
    async getAdjustments(filters?: {
        unitId?: string;
        invoiceId?: string;
        type?: string;
        approvalStatus?: string;
    }): Promise<Adjustment[]> {
        let list = (mockStore.getState().adjustments ?? []) as Adjustment[];
        if (filters?.unitId)
            list = list.filter((a) => a.unitId === filters.unitId);
        if (filters?.invoiceId)
            list = list.filter((a) => a.invoiceId === filters.invoiceId);
        if (filters?.type)
            list = list.filter((a) => a.type === filters.type);
        if (filters?.approvalStatus)
            list = list.filter((a) => a.approvalStatus === filters.approvalStatus);
        return list.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
    }
}
export const adjustmentService = AdjustmentService.getInstance();

