import { billingRunService, calculateChargeAmount } from '../services/billingRunService';
import { invoiceService } from '../services/invoiceService';
import { mockStore } from '../../../core/mockStore/mockStore';
import type { BillingRule } from '../../../shared/types/financial.types';
describe('Phase 7: Billing Run Lifecycle & Financial Integrity', () => {
    const societyId = 'soc-audit-001';
    beforeEach(() => {
        mockStore.reset();
        mockStore.getState().societyUnits = [
            {
                id: 'unit-u1',
                unitNumber: 'A-101',
                wing: 'A Wing',
                unitType: '2BHK',
                carpetAreaSqFt: 1000,
                builtupAreaSqFt: 1200,
                areaSqFt: 1200,
                previousMeterReading: 100,
                currentMeterReading: 150,
                societyId,
                isActive: true,
            },
            {
                id: 'unit-u2',
                unitNumber: 'A-102',
                wing: 'A Wing',
                unitType: '3BHK',
                carpetAreaSqFt: 1500,
                builtupAreaSqFt: 1800,
                areaSqFt: 1800,
                previousMeterReading: 200,
                currentMeterReading: 280,
                societyId,
                isActive: true,
            },
        ];
        const rules: BillingRule[] = [
            {
                id: 'rule-maint',
                chargeHeadId: 'ch-maint',
                chargeHeadCode: 'MAINTENANCE',
                name: 'Area Maintenance',
                ruleType: 'AREA_BASED',
                rate: 4.5,
                taxApplicable: false,
                priority: 1,
                isActive: true,
                effectiveFrom: '2026-01-01',
                version: 1,
                createdBy: 'Admin',
                createdAt: '2026-01-01T00:00:00Z',
                updatedAt: '2026-01-01T00:00:00Z',
                societyId,
            },
            {
                id: 'rule-sinking',
                chargeHeadId: 'ch-sinking',
                chargeHeadCode: 'SINKING_FUND',
                name: 'Sinking Fund',
                ruleType: 'FIXED',
                fixedAmount: 500,
                taxApplicable: false,
                priority: 2,
                isActive: true,
                effectiveFrom: '2026-01-01',
                version: 1,
                createdBy: 'Admin',
                createdAt: '2026-01-01T00:00:00Z',
                updatedAt: '2026-01-01T00:00:00Z',
                societyId,
            },
        ];
        mockStore.getState().billingRules = rules;
    });
    test('Invariant 18: Historical charges are calculated deterministically using minor units precision', () => {
        const areaRule: BillingRule = {
            id: 'rule-1',
            chargeHeadId: 'ch-1',
            chargeHeadCode: 'MAINTENANCE',
            name: 'Maintenance',
            ruleType: 'AREA_BASED',
            rate: 3.75,
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
        const unit = {
            id: 'u-1',
            unitNumber: '101',
            areaSqFt: 1250,
        };
        const calc = calculateChargeAmount(areaRule, unit);
        expect(calc.amount).toBe(4687.5);
        expect(calc.amountMinorUnits).toBe(468750);
        expect(calc.calculationBasis).toContain('1250 sq ft × Rate: ₹3.75/sq ft');
    });
    test('Invariant 1: Same billing run cannot be created twice for identical society and period', async () => {
        const input = {
            billingCycleMonth: 'September 2026',
            billingPeriodStart: '2026-09-01',
            billingPeriodEnd: '2026-09-30',
            dueDate: '2026-10-15',
            applicableTowers: ['A Wing'],
            chargeHeadIds: ['ch-maint', 'ch-sinking'],
            includeParkingCharges: false,
            includePenalties: false,
            includePreviousDues: false,
        };
        const run1 = await billingRunService.createBillingRun(input, 'Admin User', societyId);
        expect(run1).toBeDefined();
        expect(run1.status).toBe('VALIDATED');
        expect(run1.ruleSnapshot).toHaveLength(2);
        await expect(billingRunService.createBillingRun(input, 'Admin User', societyId)).rejects.toThrow(/BILLING_RUN_ALREADY_EXISTS/);
    });
    test('Billing Run State Machine: DRAFT/CALCULATING -> VALIDATED -> APPROVED -> PUBLISHED', async () => {
        const input = {
            billingCycleMonth: 'October 2026',
            billingPeriodStart: '2026-10-01',
            billingPeriodEnd: '2026-10-31',
            dueDate: '2026-11-15',
            applicableTowers: ['A Wing'],
            chargeHeadIds: ['ch-maint', 'ch-sinking'],
            includeParkingCharges: false,
            includePenalties: false,
            includePreviousDues: false,
        };
        const run = await billingRunService.createBillingRun(input, 'Treasurer', societyId);
        expect(run.status).toBe('VALIDATED');
        expect(run.successfulCount).toBe(2);
        expect(run.totalAmount).toBe(14500);
        const approvedRun = await billingRunService.approveBillingRun(run.id, 'SuperAdmin');
        expect(approvedRun.status).toBe('APPROVED');
        expect(approvedRun.approvedBy).toBe('SuperAdmin');
        const publishResult = await invoiceService.publishInvoices(run.id, 'Treasurer');
        expect(publishResult.publishedCount).toBe(2);
        const invoices = await invoiceService.getInvoices({ billingRunId: run.id });
        expect(invoices).toHaveLength(2);
        expect(invoices[0]!.status).toBe('PUBLISHED');
        expect(invoices[0]!.invoiceNumber).toMatch(/^INV-SOC-202610-\d{4}$/);
        const ledger = mockStore.getState().ledgerEntries;
        const unit1Entries = ledger.filter((e) => e.unitId === 'unit-u1');
        expect(unit1Entries).toHaveLength(1);
        expect(unit1Entries[0]!.type).toBe('DEBIT');
        expect(unit1Entries[0]!.amount).toBe(5900);
        const secondPublish = await invoiceService.publishInvoices(run.id, 'Treasurer');
        expect(secondPublish.publishedCount).toBe(0);
    });
});

