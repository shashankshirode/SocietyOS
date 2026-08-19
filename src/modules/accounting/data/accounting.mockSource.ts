import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../core/repositories/repository.types';
import type { TreasurerDashboardData, ChargeHead, BillingCycle, DraftBill, ManualPaymentRecord, Defaulter, GenerateBillsInput, ManualPaymentInput, } from '../../../shared/types/accounting.types';
import type { FlatLedger } from '../../../shared/types/ledger.types';
import { mockAccountingDashboard } from '../../../shared/mock/accountingDashboard.mock';
import { mockChargeHeads } from '../../../shared/mock/chargeHeads.mock';
import { mockBillingCycles } from '../../../shared/mock/billingCycles.mock';
import { mockDraftBills } from '../../../shared/mock/draftBills.mock';
import { mockDefaulters } from '../../../shared/mock/defaulters.mock';
import { mockFlatLedger } from '../../../shared/mock/ledgers.mock';
import { getRequiredItem } from "../../../shared/utils/requiredItem";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
let mutableBillingCycles = [...mockBillingCycles];
let mutableDraftBills = [...mockDraftBills];
export const accountingMockSource = {
    async getDashboard(): Promise<RepositoryResult<TreasurerDashboardData>> {
        await withMockDelay();
        return repositorySuccess({
            ...mockAccountingDashboard,
            recentCollections: [],
            topDefaulters: mockDefaulters.slice(0, 3)
        });
    },
    async getChargeHeads(): Promise<RepositoryResult<ChargeHead[]>> {
        await withMockDelay();
        return repositorySuccess(mockChargeHeads);
    },
    async getBillingCycles(): Promise<RepositoryResult<BillingCycle[]>> {
        await withMockDelay();
        return repositorySuccess(mutableBillingCycles);
    },
    async generateBills(input: GenerateBillsInput): Promise<RepositoryResult<{
        success: boolean;
        billingCycle: BillingCycle;
    }>> {
        await withMockDelay(1200);
        const newCycleId = `bc-${Math.floor(100 + Math.random() * 900)}`;
        const newCycle: BillingCycle = {
            id: newCycleId,
            cycleName: input.billingCycleMonth,
            month: getRequiredItem(input.billingCycleMonth.split(' '), 0, "accounting.mockSource.ts"),
            year: parseInt(getRequiredItem(input.billingCycleMonth.split(' '), 1, "accounting.mockSource.ts") || '2026'),
            billingPeriodStart: input.billingPeriodStart,
            billingPeriodEnd: input.billingPeriodEnd,
            dueDate: input.dueDate,
            status: 'CALCULATED',
            applicableTowers: input.applicableTowers,
            totalUnits: 300,
            draftBillsCount: 300,
            publishedBillsCount: 0,
            totalAmount: 1843000,
            collectedAmount: 0,
            outstandingAmount: 1843000,
            chargeHeadIds: input.chargeHeadIds,
            includePenalties: input.includePenalties,
            includePreviousDues: input.includePreviousDues,
            ...includeWhenPresent("notes", input.notes),
            createdBy: 'Society Treasurer',
            createdAt: new Date().toISOString(),
            calculatedAt: new Date().toISOString()
        };
        mutableBillingCycles = [newCycle, ...mutableBillingCycles];
        const baseDrafts: DraftBill[] = [
            {
                id: `db-${Math.floor(1000 + Math.random() * 9000)}`,
                billingCycleId: newCycleId,
                unitId: 'unit-001',
                unitNumber: 'A-1204',
                wing: 'A Wing',
                ownerName: 'Shashank Shirode',
                previousDue: 0,
                currentCharges: 8025,
                penalty: 0,
                adjustments: 0,
                totalPayable: 8025,
                status: 'DRAFT',
                hasWarning: false,
                chargeBreakup: [
                    { chargeHead: 'Monthly Maintenance', amount: 6925 },
                    { chargeHead: 'Water Usage Charge', amount: 300 },
                    { chargeHead: 'Parking Charge (Reserved)', amount: 800 },
                ]
            },
            {
                id: `db-${Math.floor(1000 + Math.random() * 9000)}`,
                billingCycleId: newCycleId,
                unitId: 'unit-008',
                unitNumber: 'C-0601',
                wing: 'C Wing',
                ownerName: 'Nalini Sharma',
                previousDue: 20000,
                currentCharges: 8000,
                penalty: 500,
                adjustments: 0,
                totalPayable: 28500,
                status: 'DRAFT',
                hasWarning: true,
                warningMessage: 'Outstanding dues exceed 3 months',
                chargeBreakup: [
                    { chargeHead: 'Monthly Maintenance', amount: 7200 },
                    { chargeHead: 'Water Usage Charge', amount: 300 },
                    { chargeHead: 'Late Payment Penalty', amount: 500 },
                ]
            },
        ];
        mutableDraftBills = [...baseDrafts, ...mutableDraftBills];
        return repositorySuccess({ success: true, billingCycle: newCycle });
    },
    async getDraftBills(cycleId: string): Promise<RepositoryResult<DraftBill[]>> {
        await withMockDelay();
        const filtered = mutableDraftBills.filter(db => db.billingCycleId === cycleId);
        return repositorySuccess(filtered.length > 0 ? filtered : mutableDraftBills);
    },
    async publishBills(cycleId: string): Promise<RepositoryResult<{
        success: boolean;
    }>> {
        await withMockDelay(1000);
        mutableBillingCycles = mutableBillingCycles.map(c => {
            if (c.id === cycleId) {
                return { ...c, status: 'PUBLISHED', publishedAt: new Date().toISOString() };
            }
            return c;
        });
        mutableDraftBills = mutableDraftBills.map(db => {
            if (db.billingCycleId === cycleId) {
                return { ...db, status: 'PUBLISHED' };
            }
            return db;
        });
        return repositorySuccess({ success: true });
    },
    async getFlatLedger(unitId: string): Promise<RepositoryResult<FlatLedger>> {
        await withMockDelay();
        return repositorySuccess(mockFlatLedger);
    },
    async recordManualPayment(input: ManualPaymentInput): Promise<RepositoryResult<ManualPaymentRecord>> {
        await withMockDelay(800);
        const newPayment: ManualPaymentRecord = {
            id: `pay-${Math.floor(1000 + Math.random() * 9000)}`,
            paymentNumber: `PAY-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            unitId: input.unitId,
            unitNumber: 'A-1204',
            wing: 'A Wing',
            residentName: 'Shashank Shirode',
            amount: input.amount,
            paymentMode: input.paymentMode,
            paymentDate: input.paymentDate,
            referenceNumber: input.referenceNumber,
            ...includeWhenPresent("bankName", input.bankName),
            ...includeWhenPresent("chequeNumber", input.chequeNumber),
            ...includeWhenPresent("notes", input.notes),
            receivedBy: 'Society Treasurer',
            status: 'RECEIPT_GENERATED',
            receiptId: `rcpt-${Math.floor(1000 + Math.random() * 9000)}`,
            receiptNumber: `RCPT-2026-${Math.floor(100 + Math.random() * 900)}`,
            createdAt: new Date().toISOString(),
            requiresApproval: false
        };
        return repositorySuccess(newPayment);
    },
    async getDefaulters(): Promise<RepositoryResult<Defaulter[]>> {
        await withMockDelay();
        return repositorySuccess(mockDefaulters);
    }
};

