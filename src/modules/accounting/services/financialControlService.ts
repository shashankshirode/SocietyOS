import { mockStore } from '../../../core/mockStore/mockStore';
import type { Invoice, InvoicePenalty } from '../../../shared/types/financial.types';
import { auditService, createAuditEntry } from '../../../core/audit';
import { toMinorUnits, fromMinorUnits, calculatePercentage, clampMoney, addMoney } from './money';
function generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
export interface LateFeeRule {
    gracePeriodDays: number;
    ratePercent: number;
    capAmount?: number;
}
export interface ClosedPeriodRecord {
    societyId: string;
    period: string;
    closedAt: string;
    closedBy: string;
}
export class FinancialControlService {
    private static instance: FinancialControlService;
    private closedPeriods: Map<string, ClosedPeriodRecord> = new Map();
    static getInstance(): FinancialControlService {
        if (!FinancialControlService.instance) {
            FinancialControlService.instance = new FinancialControlService();
        }
        return FinancialControlService.instance;
    }
    async applyLateFees(societyId: string, rule: LateFeeRule, schedulerRunId: string = generateId('sched')): Promise<{
        appliedCount: number;
        totalFee: number;
    }> {
        const invoices = (mockStore.getState().invoices ?? []) as Invoice[];
        const now = new Date();
        const overdueInvoices = invoices.filter((inv) => {
            if (inv.societyId !== societyId)
                return false;
            if (!['PUBLISHED', 'PARTIALLY_PAID', 'OVERDUE'].includes(inv.status))
                return false;
            if (inv.balance <= 0)
                return false;
            const dueDate = new Date(inv.dueDate);
            const graceEnd = new Date(dueDate.getTime() + rule.gracePeriodDays * 24 * 60 * 60 * 1000);
            return now > graceEnd;
        });
        const penalties = (mockStore.getState().invoicePenalties ?? []) as InvoicePenalty[];
        let appliedCount = 0;
        let totalFeeMinor = 0;
        for (const inv of overdueInvoices) {
            const currentMonth = now.toISOString().substring(0, 7);
            const alreadyApplied = penalties.some((p) => p.invoiceId === inv.id && p.type === 'LATE_FEE' && p.calculatedAt.startsWith(currentMonth));
            if (alreadyApplied)
                continue;
            const principalMinor = toMinorUnits(inv.balance);
            let feeMinor = calculatePercentage(principalMinor, rule.ratePercent);
            if (rule.capAmount !== undefined && rule.capAmount > 0) {
                const capMinor = toMinorUnits(rule.capAmount);
                feeMinor = clampMoney(feeMinor, 0, capMinor);
            }
            if (feeMinor <= 0)
                continue;
            const fee = fromMinorUnits(feeMinor);
            totalFeeMinor = addMoney(totalFeeMinor, feeMinor);
            appliedCount++;
            const dueDate = new Date(inv.dueDate);
            const daysOverdue = Math.max(0, Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
            const penalty: InvoicePenalty = {
                id: generateId('pen'),
                invoiceId: inv.id,
                type: 'LATE_FEE',
                amount: fee,
                rate: rule.ratePercent,
                daysOverdue,
                calculatedAt: now.toISOString(),
                calculatedBy: 'LATE_FEE_SCHEDULER',
            };
            mockStore.addInvoicePenalty(penalty);
            const newTotalMinor = addMoney(toMinorUnits(inv.total), feeMinor);
            const newBalanceMinor = addMoney(toMinorUnits(inv.balance), feeMinor);
            mockStore.updateInvoice(inv.id, {
                total: fromMinorUnits(newTotalMinor),
                balance: fromMinorUnits(newBalanceMinor),
                totalPenalties: fromMinorUnits(addMoney(toMinorUnits(inv.totalPenalties), feeMinor)),
                status: 'OVERDUE',
            });
            const currentLedger = mockStore.getState().ledgerEntries ?? [];
            const unitEntries = currentLedger.filter((e) => e.unitId === inv.unitId);
            const lastBalance = unitEntries.length > 0 ? unitEntries[0]?.amount ?? 0 : 0;
            const newLedgerBalance = addMoney(toMinorUnits(lastBalance), feeMinor);
            mockStore.addLedgerEntry({
                id: generateId('led-pen'),
                unitId: inv.unitId,
                amount: fromMinorUnits(newLedgerBalance),
                type: 'DEBIT',
                description: `Late Fee (${rule.ratePercent}%) on ${inv.invoiceNumber} - Overdue by ${daysOverdue} days`,
                date: now.toISOString(),
            });
        }
        auditService.log(createAuditEntry({
            actorUserId: 'SCHEDULER',
            actorType: 'SYSTEM',
            societyId,
            action: 'CREATE',
            entityType: 'JOURNAL_ENTRY',
            entityId: schedulerRunId,
            newState: { appliedCount, totalFee: fromMinorUnits(totalFeeMinor) },
            idempotencyKey: schedulerRunId,
            source: 'SYSTEM_JOB',
            outcome: 'SUCCESS',
        }));
        return { appliedCount, totalFee: fromMinorUnits(totalFeeMinor) };
    }
    async closeFinancialPeriod(params: {
        societyId: string;
        period: string;
        closedBy: string;
    }): Promise<ClosedPeriodRecord> {
        const key = `${params.societyId}_${params.period}`;
        if (this.closedPeriods.has(key)) {
            return this.closedPeriods.get(key)!;
        }
        const record: ClosedPeriodRecord = {
            societyId: params.societyId,
            period: params.period,
            closedAt: new Date().toISOString(),
            closedBy: params.closedBy,
        };
        this.closedPeriods.set(key, record);
        auditService.log(createAuditEntry({
            actorUserId: params.closedBy,
            actorType: 'ADMIN',
            societyId: params.societyId,
            action: 'MONTH_END_CLOSE_COMPLETE',
            entityType: 'MONTH_END_CLOSE',
            entityId: key,
            newState: { period: params.period, status: 'CLOSED' },
            idempotencyKey: `close_${key}`,
            source: 'MOBILE',
            outcome: 'SUCCESS',
        }));
        return record;
    }
    isPeriodClosed(societyId: string, period: string): boolean {
        return this.closedPeriods.has(`${societyId}_${period}`);
    }
    assertPeriodOpen(societyId: string, period: string): void {
        if (this.isPeriodClosed(societyId, period)) {
            throw new Error(`PERIOD_LOCKED: Financial period ${period} is closed for society ${societyId}`);
        }
    }
}
export const financialControlService = FinancialControlService.getInstance();

