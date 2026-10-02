import { toMinorUnits, fromMinorUnits, createMoney, addMoney, subtractMoney, multiplyRate, calculateAreaCharge, calculatePercentage, clampMoney, formatMoney, } from '../services/money';
import { billingRunService, calculateChargeAmount } from '../services/billingRunService';
import { invoiceService } from '../services/invoiceService';
import { paymentGatewayService } from '../services/paymentGatewayService';
import { paymentService } from '../services/paymentService';
import { adjustmentService } from '../services/adjustmentService';
import { outstandingService } from '../services/outstandingService';
import { reconciliationService } from '../services/reconciliationService';
import { mockStore } from '../../../core/mockStore/mockStore';
import type { BillingRule, Invoice } from '../../../shared/types/financial.types';
describe('Phase 7: Full Coverage of Financial Services, Utilities & Edge Branches', () => {
    beforeEach(() => {
        mockStore.reset();
    });
    describe('money.ts precision & utility tests', () => {
        test('handles string and numerical minor unit conversion with edges', () => {
            expect(toMinorUnits('₹1,250.75')).toBe(125075);
            expect(toMinorUnits('invalid')).toBe(0);
            expect(toMinorUnits(Infinity)).toBe(0);
            expect(fromMinorUnits(Infinity)).toBe(0);
            expect(fromMinorUnits(125075)).toBe(1250.75);
            const m = createMoney(45.5, 'USD');
            expect(m.minorUnits).toBe(4550);
            expect(m.currency).toBe('USD');
        });
        test('addMoney and subtractMoney operate accurately', () => {
            expect(addMoney(100, 250)).toBe(350);
            expect(subtractMoney(500, 150)).toBe(350);
        });
        test('multiplyRate with FLOOR, CEIL, and HALF_UP policies', () => {
            expect(multiplyRate(100, 1.554, 'FLOOR')).toBe(155);
            expect(multiplyRate(100, 1.554, 'CEIL')).toBe(156);
            expect(multiplyRate(100, 1.555, 'HALF_UP')).toBe(156);
            expect(multiplyRate(NaN, 1)).toBe(0);
        });
        test('calculateAreaCharge with FLOOR and CEIL rounding', () => {
            expect(calculateAreaCharge(0, 5)).toBe(0);
            expect(calculateAreaCharge(100, 0)).toBe(0);
            expect(calculateAreaCharge(100, 4.505, 'FLOOR')).toBe(45100);
            expect(calculateAreaCharge(100, 4.505, 'CEIL')).toBe(45100);
        });
        test('calculatePercentage with FLOOR and CEIL rounding', () => {
            expect(calculatePercentage(0, 10)).toBe(0);
            expect(calculatePercentage(100, 0)).toBe(0);
            expect(calculatePercentage(1005, 5, 'FLOOR')).toBe(50);
            expect(calculatePercentage(1005, 5, 'CEIL')).toBe(51);
            expect(calculatePercentage(1005, 5, 'HALF_UP')).toBe(50);
        });
        test('clampMoney bounds enforcement', () => {
            expect(clampMoney(500, 1000, 2000)).toBe(1000);
            expect(clampMoney(2500, 1000, 2000)).toBe(2000);
            expect(clampMoney(1500, 1000, 2000)).toBe(1500);
        });
        test('formatMoney formats according to currency', () => {
            expect(formatMoney(100000, 'INR')).toContain('1,000');
            expect(formatMoney(5000, 'XYZ')).toContain('50.00');
        });
    });
    describe('billingRunService edge branches', () => {
        test('calculateChargeAmount for all rule types and bounds', () => {
            const unit = {
                id: 'u-edge',
                unitNumber: 'E-101',
                areaSqFt: 0,
                builtupAreaSqFt: 0,
                carpetAreaSqFt: 0,
                previousMeterReading: 150,
                currentMeterReading: 120,
                unitType: 'PENTHOUSE',
            };
            const areaRule: BillingRule = {
                id: 'r-area',
                chargeHeadId: 'ch-1',
                chargeHeadCode: 'MAINT',
                name: 'Area Rule',
                ruleType: 'AREA_BASED',
                rate: 5,
                taxApplicable: false,
                priority: 1,
                isActive: true,
                effectiveFrom: '2026-01-01',
                version: 1,
                createdBy: 'Admin',
                createdAt: '2026-01-01T00:00:00Z',
                updatedAt: '2026-01-01T00:00:00Z',
                societyId: 's1',
            };
            const resArea = calculateChargeAmount(areaRule, unit);
            expect(resArea.error).toContain('missing or zero chargeable area');
            const meterRule: BillingRule = {
                ...areaRule,
                ruleType: 'METER_BASED',
                rate: 10,
            };
            const resMeter = calculateChargeAmount(meterRule, unit);
            expect(resMeter.error).toContain('Invalid meter reading');
            const unitTypeRule: BillingRule = {
                ...areaRule,
                ruleType: 'UNIT_TYPE_BASED',
                rate: 2000,
            };
            const resUnitType = calculateChargeAmount(unitTypeRule, unit);
            expect(resUnitType.amount).toBe(2000);
            const pctRule: BillingRule = {
                ...areaRule,
                ruleType: 'PERCENTAGE',
                rate: 15,
                fixedAmount: 5000,
            };
            const resPct = calculateChargeAmount(pctRule, unit);
            expect(resPct.amount).toBe(750);
            const manualRule: BillingRule = {
                ...areaRule,
                ruleType: 'MANUAL',
                fixedAmount: 350,
            };
            const resManual = calculateChargeAmount(manualRule, unit);
            expect(resManual.amount).toBe(350);
            const unknownRule: BillingRule = {
                ...areaRule,
                ruleType: 'UNKNOWN_TYPE' as any,
            };
            const resUnknown = calculateChargeAmount(unknownRule, unit);
            expect(resUnknown.error).toContain('Unsupported rule type');
        });
        test('getBillingRuns with filters and cancelBillingRun transitions', async () => {
            mockStore.getState().societyUnits = [
                {
                    id: 'u-cancel',
                    unitNumber: 'C-1',
                    areaSqFt: 1000,
                    isActive: true,
                },
            ];
            mockStore.getState().billingRules = [
                {
                    id: 'r-c',
                    chargeHeadId: 'c1',
                    chargeHeadCode: 'M',
                    name: 'M',
                    ruleType: 'FIXED',
                    fixedAmount: 100,
                    taxApplicable: false,
                    priority: 1,
                    isActive: true,
                    effectiveFrom: '2026-01-01',
                    version: 1,
                    createdBy: 'A',
                    createdAt: '2026-01-01T00:00:00Z',
                    updatedAt: '2026-01-01T00:00:00Z',
                    societyId: 'soc-cancel',
                },
            ];
            const run = await billingRunService.createBillingRun({
                billingCycleMonth: 'June 2026',
                billingPeriodStart: '2026-06-01',
                billingPeriodEnd: '2026-06-30',
                dueDate: '2026-07-15',
                applicableTowers: [],
                chargeHeadIds: [],
                includeParkingCharges: false,
                includePenalties: false,
                includePreviousDues: false,
            }, 'Admin', 'soc-cancel');
            const filtered = await billingRunService.getBillingRuns({
                societyId: 'soc-cancel',
                status: 'VALIDATED',
                dateFrom: '2026-01-01',
                dateTo: '2026-12-31',
            });
            expect(filtered).toHaveLength(1);
            const cancelled = await billingRunService.cancelBillingRun(run.id, 'Admin', 'Incorrect params');
            expect(cancelled.status).toBe('CANCELLED');
            mockStore.updateBillingRun(run.id, { status: 'PUBLISHED' });
            await expect(billingRunService.cancelBillingRun(run.id, 'Admin', 'reason')).rejects.toThrow(/Cannot cancel billing run in status/);
        });
    });
    describe('invoiceService edge branches', () => {
        test('getInvoices with filters and getInvoiceLines', async () => {
            const inv: Invoice = {
                id: 'inv-filter-1',
                societyId: 'soc-f',
                unitId: 'u-f',
                unitNumber: 'F-1',
                billingRunId: 'run-f',
                invoiceNumber: 'INV-F-1',
                billingRunNumber: 'run-f',
                status: 'PUBLISHED',
                issueDate: '2026-09-01T00:00:00Z',
                dueDate: '2026-09-20T00:00:00Z',
                billingPeriodStart: '2026-09-01',
                billingPeriodEnd: '2026-09-30',
                subtotal: 1000,
                totalDiscounts: 0,
                totalPenalties: 0,
                totalInterest: 0,
                taxAmount: 0,
                total: 1000,
                balance: 1000,
                currency: 'INR',
            };
            mockStore.addInvoice(inv);
            mockStore.addInvoiceLine({
                id: 'line-f-1',
                invoiceId: inv.id,
                chargeHeadId: 'ch-1',
                chargeHeadCode: 'CODE',
                chargeHeadName: 'Name',
                description: 'Desc',
                quantity: 1,
                unitOfMeasure: 'UNIT',
                rate: 1000,
                amount: 1000,
                taxAmount: 0,
                taxRate: 0,
                discountAmount: 0,
                discountRate: 0,
                netAmount: 1000,
                calculationBasis: 'Rule',
            });
            const filtered = await invoiceService.getInvoices({
                societyId: 'soc-f',
                unitId: 'u-f',
                status: 'PUBLISHED',
                billingRunId: 'run-f',
            });
            expect(filtered).toHaveLength(1);
            const lines = await invoiceService.getInvoiceLines(inv.id);
            expect(lines).toHaveLength(1);
            expect(lines[0]!.netAmount).toBe(1000);
        });
    });
    describe('paymentGatewayService edge branches', () => {
        test('setConfig, getPaymentStatus, and unknown reference verification', async () => {
            paymentGatewayService.setConfig({
                provider: 'RAZORPAY',
                merchantId: 'MID_123',
                merchantKey: 'KEY_123',
                callbackUrl: 'https://societyos.app/cb',
                webhookUrl: 'https://societyos.app/wh',
                supportedModes: ['UPI', 'PAYMENT_GATEWAY'],
                isActive: true,
                testMode: false,
            });
            const verif = await paymentGatewayService.verifyPayment('non-existent-ref');
            expect(verif.isValid).toBe(false);
            expect(verif.error).toContain('not found');
            const cbInvalidPayload = await paymentGatewayService.handleCallback(null);
            expect(cbInvalidPayload.isValid).toBe(false);
            const cbMissingRef = await paymentGatewayService.handleCallback({});
            expect(cbMissingRef.isValid).toBe(false);
            const status = await paymentGatewayService.getPaymentStatus('unknown-status-ref');
            expect(status.status).toBe('PENDING');
        });
    });
    describe('adjustmentService edge branches', () => {
        test('getAdjustments with filters and approve error on not found', async () => {
            await adjustmentService.createAdjustment({
                unitId: 'u-adj-f',
                type: 'ROUND_OFF',
                debitCredit: 'CREDIT',
                amount: 5,
                reason: 'Cent adjustment',
                approvalStatus: 'NOT_REQUIRED',
            });
            const filtered = await adjustmentService.getAdjustments({
                unitId: 'u-adj-f',
                type: 'ROUND_OFF',
            });
            expect(filtered).toHaveLength(1);
            expect(filtered[0]!.amount).toBe(5);
            await expect(adjustmentService.approveAdjustment('non-existent-adj', 'Admin')).rejects.toThrow(/Adjustment not found/);
        });
    });
    describe('reconciliationService edge branches', () => {
        test('getReconciliationRecords with filters, getRecord, manualMatch and rejectMatch', async () => {
            const rec = await reconciliationService.createRecord({
                statementDate: '2026-09-12',
                bankReference: 'REF-BANK-999',
                amount: 3200,
                transactionType: 'CREDIT',
                bankName: 'Axis Bank',
                societyId: 'soc-rec-f',
            });
            const records = await reconciliationService.getReconciliationRecords({
                societyId: 'soc-rec-f',
                status: 'UNMATCHED',
                dateFrom: '2026-09-01',
                dateTo: '2026-09-30',
                bankName: 'Axis Bank',
            });
            expect(records).toHaveLength(1);
            const single = await reconciliationService.getRecord(rec.id);
            expect(single?.bankReference).toBe('REF-BANK-999');
            const rejected = await reconciliationService.rejectMatch(rec.id, 'Wrong account', 'Auditor');
            expect(rejected.status).toBe('REJECTED');
            expect(rejected.rejectionReason).toBe('Wrong account');
            await expect(reconciliationService.manualMatch('invalid-rec-id', 'pay-1', 'Admin')).rejects.toThrow(/not found/);
            await expect(reconciliationService.manualMatch(rec.id, 'non-existent-payment', 'Admin')).rejects.toThrow(/Payment transaction not found/);
        });
    });
    describe('outstandingService edge branches', () => {
        test('getAgeingReport compiles society level buckets', async () => {
            const now = new Date();
            const overdueDate1 = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString();
            const overdueDate2 = new Date(now.getTime() - 75 * 24 * 60 * 60 * 1000).toISOString();
            mockStore.addInvoice({
                id: 'inv-age-1',
                societyId: 'soc-age-report',
                unitId: 'u-1',
                unitNumber: '1',
                billingRunId: 'r1',
                invoiceNumber: 'INV-1',
                billingRunNumber: 'r1',
                status: 'OVERDUE',
                issueDate: '2026-08-01T00:00:00Z',
                dueDate: overdueDate1,
                billingPeriodStart: '2026-08-01',
                billingPeriodEnd: '2026-08-31',
                subtotal: 1000,
                totalDiscounts: 0,
                totalPenalties: 0,
                totalInterest: 0,
                taxAmount: 0,
                total: 1000,
                balance: 1000,
                currency: 'INR',
            });
            mockStore.addInvoice({
                id: 'inv-age-2',
                societyId: 'soc-age-report',
                unitId: 'u-2',
                unitNumber: '2',
                billingRunId: 'r1',
                invoiceNumber: 'INV-2',
                billingRunNumber: 'r1',
                status: 'OVERDUE',
                issueDate: '2026-07-01T00:00:00Z',
                dueDate: overdueDate2,
                billingPeriodStart: '2026-07-01',
                billingPeriodEnd: '2026-07-31',
                subtotal: 2000,
                totalDiscounts: 0,
                totalPenalties: 0,
                totalInterest: 0,
                taxAmount: 0,
                total: 2000,
                balance: 2000,
                currency: 'INR',
            });
            const report = await outstandingService.getAgeingReport('soc-age-report');
            expect(report.totalOutstanding).toBe(3000);
            expect(report.unitBreakdown).toHaveLength(2);
            const b1 = report.buckets.find((b) => b.bucket === '0_30_DAYS');
            expect(b1?.amount).toBe(1000);
            const b2 = report.buckets.find((b) => b.bucket === '61_90_DAYS');
            expect(b2?.amount).toBe(2000);
        });
        test('creates pending adjustment and approves it', async () => {
            const adj = await adjustmentService.createAdjustment({
                unitId: 'u-pending',
                type: 'WAIVER',
                debitCredit: 'CREDIT',
                amount: 250,
                reason: 'Courtesy',
                approvalStatus: 'PENDING',
            });
            expect(adj.approvalStatus).toBe('PENDING');
            const approved = await adjustmentService.approveAdjustment(adj.id, 'Committee');
            expect(approved.approvalStatus).toBe('APPROVED');
            expect(approved.approvedBy).toBe('Committee');
        });
        test('successful manualMatch links payment and bank record', async () => {
            const rec = await reconciliationService.createRecord({
                statementDate: '2026-09-15',
                bankReference: 'REF-MANUAL-MATCH-1',
                amount: 5000,
                transactionType: 'CREDIT',
                bankName: 'SBI',
                societyId: 'soc-manual',
            });
            mockStore.addPaymentTransaction({
                id: 'txn-manual-1',
                paymentAttemptId: 'att-1',
                invoiceId: 'inv-1',
                status: 'SETTLED',
                amount: 5000,
                currency: 'INR',
                paymentMode: 'BANK_TRANSFER',
            });
            const matched = await reconciliationService.manualMatch(rec.id, 'txn-manual-1', 'Auditor');
            expect(matched.status).toBe('MATCHED');
            expect(matched.matchedPaymentId).toBe('txn-manual-1');
            expect(matched.matchedBy).toBe('Auditor');
        });
        test('refundPayment via gateway service delegates to paymentService', async () => {
            const inv: Invoice = {
                id: 'inv-gw-ref',
                societyId: 's1',
                unitId: 'u1',
                unitNumber: '1',
                billingRunId: 'r1',
                invoiceNumber: 'INV-GW-1',
                billingRunNumber: 'r1',
                status: 'PUBLISHED',
                issueDate: '2026-09-01T00:00:00Z',
                dueDate: '2026-09-20T00:00:00Z',
                billingPeriodStart: '2026-09-01',
                billingPeriodEnd: '2026-09-30',
                subtotal: 1000,
                totalDiscounts: 0,
                totalPenalties: 0,
                totalInterest: 0,
                taxAmount: 0,
                total: 1000,
                balance: 1000,
                currency: 'INR',
            };
            mockStore.addInvoice(inv);
            const settled = await paymentService.settleOnlinePayment({
                paymentAttemptId: 'att-gw-ref',
                invoiceId: inv.id,
                amount: 1000,
                paymentMode: 'UPI',
                gatewayTransactionId: 'gtx-gw-1',
                gatewayReference: 'ref-gw-1',
            });
            const res = await paymentGatewayService.refundPayment({
                paymentTransactionId: settled.transaction.id,
                amount: 500,
                reason: 'Double swipe',
                idempotencyKey: 'idemp-gw-ref',
            });
            expect(res.success).toBe(true);
            expect(res.refundId).toBeDefined();
        });
    });
});

