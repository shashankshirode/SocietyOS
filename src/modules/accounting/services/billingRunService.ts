import { mockStore } from '../../../core/mockStore/mockStore';
import type { BillingRun, BillingRule, ValidationResult, RunError, ChargeHeadConfig, BillingRuleType, } from '../../../shared/types/financial.types';
import type { GenerateBillsInput, BillingCycle, DraftBill } from '../../../shared/types/accounting.types';
import { auditService, createAuditEntry } from '../../../core/audit';
import { toMinorUnits, fromMinorUnits, calculateAreaCharge, calculatePercentage, clampMoney, addMoney, } from './money';
function generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
function generateCorrelationId(): string {
    return `corr-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
export interface CalculatedCharge {
    amount: number;
    amountMinorUnits: number;
    calculationBasis: string;
    quantity: number;
    rate: number;
    error?: string;
}
export interface UnitDetail {
    id: string;
    unitNumber: string;
    wing?: string;
    unitType?: string;
    areaSqFt?: number;
    carpetAreaSqFt?: number;
    builtupAreaSqFt?: number;
    previousMeterReading?: number;
    currentMeterReading?: number;
    isActive?: boolean;
}
export function calculateChargeAmount(rule: BillingRule, unit: UnitDetail, _chargeHeadConfig?: ChargeHeadConfig): CalculatedCharge {
    let amountMinor = 0;
    let calculationBasis = '';
    let quantity = 1;
    let rate = rule.rate ?? 0;
    let error: string | undefined;
    switch (rule.ruleType as BillingRuleType) {
        case 'FIXED': {
            const fixed = rule.fixedAmount ?? rule.rate ?? 0;
            amountMinor = toMinorUnits(fixed);
            rate = fixed;
            quantity = 1;
            calculationBasis = `Fixed charge: ₹${fixed.toFixed(2)}`;
            break;
        }
        case 'AREA_BASED': {
            const area = unit.areaSqFt ?? unit.builtupAreaSqFt ?? unit.carpetAreaSqFt ?? 0;
            if (area <= 0) {
                error = `Unit ${unit.unitNumber} has missing or zero chargeable area`;
            }
            rate = rule.rate ?? 0;
            quantity = area;
            amountMinor = calculateAreaCharge(area, rate);
            calculationBasis = `Area: ${area} sq ft × Rate: ₹${rate.toFixed(2)}/sq ft`;
            break;
        }
        case 'METER_BASED': {
            const prev = unit.previousMeterReading ?? 0;
            const curr = unit.currentMeterReading ?? 0;
            const usage = curr - prev;
            if (usage < 0) {
                error = `Invalid meter reading: current (${curr}) < previous (${prev})`;
            }
            rate = rule.rate ?? 0;
            quantity = Math.max(0, usage);
            amountMinor = calculateAreaCharge(quantity, rate);
            calculationBasis = `Usage: ${quantity} units × Rate: ₹${rate.toFixed(2)}/unit`;
            break;
        }
        case 'UNIT_TYPE_BASED': {
            const unitType = unit.unitType ?? 'STANDARD';
            rate = rule.rate ?? 0;
            quantity = 1;
            amountMinor = toMinorUnits(rate);
            calculationBasis = `Unit type (${unitType}) rate: ₹${rate.toFixed(2)}`;
            break;
        }
        case 'PERCENTAGE': {
            rate = rule.rate ?? 0;
            const baseMinor = toMinorUnits(rule.fixedAmount ?? 1000);
            amountMinor = calculatePercentage(baseMinor, rate);
            quantity = 1;
            calculationBasis = `${rate}% of base ₹${fromMinorUnits(baseMinor).toFixed(2)}`;
            break;
        }
        case 'MANUAL': {
            const manual = rule.fixedAmount ?? 0;
            amountMinor = toMinorUnits(manual);
            rate = manual;
            quantity = 1;
            calculationBasis = 'Manual charge entry';
            break;
        }
        default: {
            error = `Unsupported rule type: ${String(rule.ruleType)}`;
            amountMinor = 0;
            calculationBasis = 'Unsupported rule';
        }
    }
    const minMinor = rule.minimumAmount !== undefined ? toMinorUnits(rule.minimumAmount) : undefined;
    const maxMinor = rule.maximumAmount !== undefined ? toMinorUnits(rule.maximumAmount) : undefined;
    amountMinor = clampMoney(amountMinor, minMinor, maxMinor);
    return {
        amount: fromMinorUnits(amountMinor),
        amountMinorUnits: amountMinor,
        calculationBasis,
        quantity,
        rate,
        ...(error !== undefined ? { error } : {}),
    };
}
export class BillingRunService {
    private static instance: BillingRunService;
    static getInstance(): BillingRunService {
        if (!BillingRunService.instance) {
            BillingRunService.instance = new BillingRunService();
        }
        return BillingRunService.instance;
    }
    async createBillingRun(input: GenerateBillsInput, initiatedBy: string, societyId: string): Promise<BillingRun> {
        const correlationId = generateCorrelationId();
        const now = new Date().toISOString();
        const existingRuns = mockStore.getState().billingRuns as BillingRun[];
        const activeDuplicate = existingRuns.find((r) => r.societyId === societyId &&
            r.billingPeriodStart === input.billingPeriodStart &&
            r.billingPeriodEnd === input.billingPeriodEnd &&
            !['CANCELLED', 'FAILED'].includes(r.status));
        if (activeDuplicate) {
            throw new Error(`BILLING_RUN_ALREADY_EXISTS: Active run ${activeDuplicate.id} already exists for period ${input.billingPeriodStart} to ${input.billingPeriodEnd}`);
        }
        const allRules = (mockStore.getState().billingRules ?? []) as BillingRule[];
        const activeRules = allRules.filter((r) => r.societyId === societyId && r.isActive);
        const runId = generateId('run');
        const run: BillingRun = {
            id: runId,
            societyId,
            name: `Billing Run ${input.billingCycleMonth}`,
            billingPeriodStart: input.billingPeriodStart,
            billingPeriodEnd: input.billingPeriodEnd,
            dueDate: input.dueDate,
            status: 'CALCULATING',
            ruleVersion: `v-${Date.now()}`,
            ruleSnapshot: activeRules,
            startedAt: now,
            initiatedBy,
            totalUnits: 0,
            successfulCount: 0,
            failedCount: 0,
            skippedCount: 0,
            totalAmount: 0,
            totalDiscounts: 0,
            totalPenalties: 0,
            totalInterest: 0,
            validationResults: [],
            errors: [],
            correlationId,
            metadata: { input: JSON.parse(JSON.stringify(input)) as Record<string, unknown> },
        };
        mockStore.addBillingRun(run);
        auditService.log(createAuditEntry({
            actorUserId: initiatedBy,
            actorType: 'ADMIN',
            societyId,
            action: 'CREATE',
            entityType: 'BILLING_CYCLE',
            entityId: run.id,
            newState: { status: 'CALCULATING', period: `${input.billingPeriodStart} to ${input.billingPeriodEnd}` },
            idempotencyKey: correlationId,
            source: 'MOBILE',
            outcome: 'SUCCESS',
        }));
        return this.calculateAndValidate(run, input, societyId, activeRules);
    }
    private calculateAndValidate(run: BillingRun, input: GenerateBillsInput, societyId: string, rules: BillingRule[]): BillingRun {
        const rawUnits = mockStore.getState().societyUnits ?? [];
        const units: UnitDetail[] = rawUnits.filter((u) => !input.applicableTowers?.length || input.applicableTowers.includes(u.wing ?? ''));
        let totalAmountMinor = 0;
        let successfulCount = 0;
        let failedCount = 0;
        let skippedCount = 0;
        const validationResults: ValidationResult[] = [];
        const errors: RunError[] = [];
        const draftBills: DraftBill[] = [];
        if (units.length === 0) {
            errors.push({
                code: 'NO_ELIGIBLE_UNITS',
                message: 'No eligible units found matching criteria',
                severity: 'ERROR',
            });
        }
        if (rules.length === 0) {
            errors.push({
                code: 'NO_ACTIVE_RULES',
                message: 'No active billing rules found for society',
                severity: 'ERROR',
            });
        }
        for (const unit of units) {
            if (unit.isActive === false) {
                skippedCount++;
                continue;
            }
            let unitAmountMinor = 0;
            const chargeBreakup: {
                chargeHead: string;
                amount: number;
            }[] = [];
            const unitErrors: string[] = [];
            for (const rule of rules) {
                const calc = calculateChargeAmount(rule, unit);
                if (calc.error) {
                    unitErrors.push(calc.error);
                }
                unitAmountMinor = addMoney(unitAmountMinor, calc.amountMinorUnits);
                chargeBreakup.push({
                    chargeHead: rule.name || rule.chargeHeadCode,
                    amount: calc.amount,
                });
            }
            const hasUnitErrors = unitErrors.length > 0;
            if (hasUnitErrors) {
                failedCount++;
                unitErrors.forEach((msg) => {
                    errors.push({
                        code: 'UNIT_CALCULATION_ERROR',
                        message: msg,
                        unitId: unit.id,
                        severity: 'ERROR',
                    });
                });
            }
            else {
                successfulCount++;
                totalAmountMinor = addMoney(totalAmountMinor, unitAmountMinor);
            }
            validationResults.push({
                ruleId: rules[0]?.id ?? 'default',
                ruleName: rules[0]?.name ?? 'Standard Rules',
                unitId: unit.id,
                unitNumber: unit.unitNumber,
                passed: !hasUnitErrors,
                errors: unitErrors,
                warnings: [],
            });
            const draftBill: DraftBill = {
                id: `db-${run.id}-${unit.id}`,
                billingCycleId: run.id,
                unitId: unit.id,
                unitNumber: unit.unitNumber,
                wing: unit.wing ?? 'A Wing',
                ownerName: 'Resident',
                previousDue: 0,
                currentCharges: fromMinorUnits(unitAmountMinor),
                penalty: 0,
                adjustments: 0,
                totalPayable: fromMinorUnits(unitAmountMinor),
                status: 'DRAFT',
                hasWarning: hasUnitErrors,
                chargeBreakup,
                ...(hasUnitErrors && unitErrors[0] ? { warningMessage: unitErrors[0] } : {}),
            };
            draftBills.push(draftBill);
        }
        const hasBlockers = failedCount > 0 || errors.some((e) => e.severity === 'ERROR');
        const finalStatus = hasBlockers ? 'REQUIRES_REVIEW' : 'VALIDATED';
        const updatedRun: BillingRun = {
            ...run,
            status: finalStatus,
            completedAt: new Date().toISOString(),
            totalUnits: units.length,
            successfulCount,
            failedCount,
            skippedCount,
            totalAmount: fromMinorUnits(totalAmountMinor),
            validationResults,
            errors,
        };
        mockStore.updateBillingRun(run.id, updatedRun);
        const cycle: BillingCycle = {
            id: run.id,
            cycleName: input.billingCycleMonth,
            month: input.billingCycleMonth.split(' ')[0] ?? 'Current',
            year: parseInt(input.billingCycleMonth.split(' ')[1] ?? '2026', 10),
            billingPeriodStart: input.billingPeriodStart,
            billingPeriodEnd: input.billingPeriodEnd,
            dueDate: input.dueDate,
            status: finalStatus === 'VALIDATED' ? 'CALCULATED' : 'UNDER_REVIEW',
            applicableTowers: input.applicableTowers,
            totalUnits: units.length,
            draftBillsCount: draftBills.length,
            publishedBillsCount: 0,
            totalAmount: fromMinorUnits(totalAmountMinor),
            collectedAmount: 0,
            outstandingAmount: fromMinorUnits(totalAmountMinor),
            chargeHeadIds: input.chargeHeadIds,
            includePenalties: input.includePenalties,
            includePreviousDues: input.includePreviousDues,
            createdBy: run.initiatedBy,
            createdAt: run.startedAt,
        };
        if (updatedRun.completedAt) {
            cycle.calculatedAt = updatedRun.completedAt;
        }
        const existingCycles = (mockStore.getState().billingCycles ?? []) as BillingCycle[];
        mockStore.getState().billingCycles = [
            cycle,
            ...existingCycles.filter((c) => c.id !== cycle.id),
        ];
        const existingDrafts = (mockStore.getState().draftBills ?? []) as DraftBill[];
        mockStore.getState().draftBills = [
            ...draftBills,
            ...existingDrafts.filter((db) => db.billingCycleId !== run.id),
        ];
        return updatedRun;
    }
    async getBillingRun(runId: string): Promise<BillingRun | null> {
        const runs = (mockStore.getState().billingRuns ?? []) as BillingRun[];
        return runs.find((r) => r.id === runId) ?? null;
    }
    async getBillingRuns(filters?: {
        societyId?: string;
        status?: string;
        dateFrom?: string;
        dateTo?: string;
    }): Promise<BillingRun[]> {
        let runs = (mockStore.getState().billingRuns ?? []) as BillingRun[];
        if (filters?.societyId)
            runs = runs.filter((r) => r.societyId === filters.societyId);
        if (filters?.status)
            runs = runs.filter((r) => r.status === filters.status);
        if (filters?.dateFrom) {
            const fromTime = new Date(filters.dateFrom).getTime();
            runs = runs.filter((r) => new Date(r.startedAt).getTime() >= fromTime);
        }
        if (filters?.dateTo) {
            const toTime = new Date(filters.dateTo).getTime();
            runs = runs.filter((r) => new Date(r.startedAt).getTime() <= toTime);
        }
        return runs.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
    }
    async approveBillingRun(runId: string, approvedBy: string): Promise<BillingRun> {
        const run = await this.getBillingRun(runId);
        if (!run)
            throw new Error('Billing run not found');
        if (!['VALIDATED', 'REQUIRES_REVIEW', 'UNDER_REVIEW'].includes(run.status)) {
            throw new Error(`Cannot approve billing run in status: ${run.status}`);
        }
        const now = new Date().toISOString();
        const updated: BillingRun = {
            ...run,
            status: 'APPROVED',
            approvedBy,
            approvedAt: now,
        };
        mockStore.updateBillingRun(runId, updated);
        auditService.log(createAuditEntry({
            actorUserId: approvedBy,
            actorType: 'ADMIN',
            societyId: run.societyId,
            action: 'APPROVE',
            entityType: 'BILLING_CYCLE',
            entityId: runId,
            newState: { status: 'APPROVED' },
            idempotencyKey: `approve_${runId}`,
            source: 'MOBILE',
            outcome: 'SUCCESS',
        }));
        return updated;
    }
    async cancelBillingRun(runId: string, cancelledBy: string, reason: string): Promise<BillingRun> {
        const run = await this.getBillingRun(runId);
        if (!run)
            throw new Error('Billing run not found');
        if (['PUBLISHED', 'CLOSED'].includes(run.status)) {
            throw new Error(`Cannot cancel billing run in status: ${run.status}`);
        }
        const updated: BillingRun = {
            ...run,
            status: 'CANCELLED',
            metadata: { ...run.metadata, cancelledBy, cancellationReason: reason },
        };
        mockStore.updateBillingRun(runId, updated);
        return updated;
    }
}
export const billingRunService = BillingRunService.getInstance();

