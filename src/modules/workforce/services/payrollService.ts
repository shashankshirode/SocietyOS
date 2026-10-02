import { mockStore } from '../../../core/mockStore/mockStore';
import type {
    PayrollPeriod,
    PayrollRecord,
    PayrollEarning,
    PayrollDeduction,
    PayrollAdjustment,
    Payslip,
    PayslipEarning,
    PayslipDeduction,
    SalaryStructure,
    SalaryComponent,
    StaffAdvance,
    AdvanceRecovery,
    PayrollPeriodStatus,
    PayrollPaymentStatus,
    SalaryComponentType,
    PayrollAdjustmentType,
} from '../../../shared/types/workforcePhase11.types';
import type { StaffDailyAttendance, MonthlyAttendanceRecord } from '../../../shared/types/workforcePhase11.types';
import type { Absent } from '../../../shared/types/absence.types';
import { createIdempotencyKey } from '../../../core/api/idempotency';
import { auditService, createAuditEntry } from '../../../core/audit';
import { canTransitionPayrollStatus } from '../../../shared/types/workforcePhase11.types';

function generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const payrollService = {
    async createSalaryStructure(
        input: Omit<SalaryStructure, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'societyId'>,
        createdBy: string,
        societyId: string
    ): Promise<SalaryStructure> {
        const existing = mockStore.getState().salaryStructures?.find(s => s.staffId === input.staffId && s.isActive);
        if (existing) {
            throw new Error('Active salary structure already exists for this staff');
        }
        const now = new Date().toISOString();
        const structure: SalaryStructure = {
            id: generateId('salary'),
            ...input,
            isActive: true,
            createdBy,
            createdAt: now,
            updatedAt: now,
            societyId,
        };
        const structures = mockStore.getState().salaryStructures;
        if (structures) {
            structures.push(structure);
        } else {
            mockStore.getState().salaryStructures = [structure];
        }
        mockStore.notify();

        createAuditEntry({
            actorUserId: createdBy,
            actorType: 'PAYROLL_ADMIN',
            societyId,
            action: 'SALARY_STRUCTURE_CREATED',
            entityType: 'SALARY_STRUCTURE',
            entityId: structure.id,
            newState: { staffId: input.staffId, componentsCount: input.components.length },
            idempotencyKey: createIdempotencyKey(`salary_struct_${structure.id}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return structure;
    },

    async getSalaryStructure(staffId: string): Promise<SalaryStructure | null> {
        return mockStore.getState().salaryStructures?.find(s => s.staffId === staffId && s.isActive) || null;
    },

    async updateSalaryStructure(structureId: string, updates: Partial<SalaryStructure>, updatedBy: string): Promise<SalaryStructure | null> {
        const structures = mockStore.getState().salaryStructures;
        if (!structures) return null;
        const index = structures.findIndex(s => s.id === structureId);
        if (index === -1) return null;
        const existing = structures[index];
        if (!existing) return null;

        const updated: SalaryStructure = {
            ...existing,
            ...updates,
            updatedAt: new Date().toISOString(),
        };
        structures[index] = updated;
        mockStore.notify();

        createAuditEntry({
            actorUserId: updatedBy,
            actorType: 'PAYROLL_ADMIN',
            societyId: existing.societyId ?? '',
            action: 'SALARY_STRUCTURE_UPDATED',
            entityType: 'SALARY_STRUCTURE',
            entityId: structureId,
            newState: {
                ...(updates.name ? { name: updates.name } : {}),
                ...(updates.code ? { code: updates.code } : {}),
                ...(updates.isActive !== undefined ? { isActive: updates.isActive } : {}),
            },
            idempotencyKey: generateId('salary_update_'),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return updated;
    },

    async createPayrollPeriod(
        input: Omit<PayrollPeriod, 'id' | 'createdAt' | 'updatedAt' | 'eligibleStaffCount' | 'processedStaffCount' | 'totalGross' | 'totalDeductions' | 'totalNet' | 'createdBy' | 'societyId' | 'status' | 'approvedBy' | 'approvedAt' | 'finalizedAt' | 'finalizedBy' | 'paidAt' | 'paidBy' | 'reconciledAt' | 'reconciledBy'>,
        createdBy: string,
        societyId: string
    ): Promise<PayrollPeriod> {
        const existing = mockStore.getState().payrollPeriods?.find(
            p => p.societyId === societyId && p.periodStart === input.periodStart && p.periodEnd === input.periodEnd
        );
        if (existing) {
            throw new Error('Payroll period already exists for this date range');
        }
        const now = new Date().toISOString();
        const period: PayrollPeriod = {
            id: generateId('payroll'),
            ...input,
            status: 'DRAFT',
            eligibleStaffCount: 0,
            processedStaffCount: 0,
            totalGross: 0,
            totalDeductions: 0,
            totalNet: 0,
            createdBy,
            createdAt: now,
            updatedAt: now,
            societyId,
        };
        const periods = mockStore.getState().payrollPeriods;
        if (periods) {
            periods.push(period);
        } else {
            mockStore.getState().payrollPeriods = [period];
        }
        mockStore.notify();

        createAuditEntry({
            actorUserId: createdBy,
            actorType: 'PAYROLL_ADMIN',
            societyId,
            action: 'PAYROLL_PERIOD_CREATED',
            entityType: 'PAYROLL_PERIOD',
            entityId: period.id,
            newState: { periodStart: input.periodStart, periodEnd: input.periodEnd, payDate: input.payDate },
            idempotencyKey: createIdempotencyKey(`payroll_period_${period.id}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return period;
    },

    async getPayrollPeriods(filters: {
        societyId?: string;
        status?: PayrollPeriodStatus;
    }): Promise<PayrollPeriod[]> {
        let periods = mockStore.getState().payrollPeriods || [];
        if (filters.societyId) {
            periods = periods.filter(p => p.societyId === filters.societyId);
        }
        if (filters.status) {
            periods = periods.filter(p => p.status === filters.status);
        }
        return periods;
    },

    async calculatePayroll(periodId: string, calculatedBy: string): Promise<{
        success: boolean;
        period?: PayrollPeriod;
        error?: string;
    }> {
        const periods = mockStore.getState().payrollPeriods;
        if (!periods) return { success: false, error: 'Payroll period not found' };
        const index = periods.findIndex(p => p.id === periodId);
        if (index === -1) return { success: false, error: 'Payroll period not found' };
        const period = periods[index];
        if (!period) return { success: false, error: 'Payroll period not found' };

        if (!canTransitionPayrollStatus(period.status, 'CALCULATING')) {
            return { success: false, error: `Cannot calculate payroll in status: ${period.status}` };
        }
        period.status = 'CALCULATING';
        period.updatedAt = new Date().toISOString();

        const staffMembers = mockStore.getState().staff?.filter(
            s => s.societyId === period.societyId && s.employmentStatus === 'ACTIVE'
        ) || [];
        const salaryStructures = mockStore.getState().salaryStructures?.filter(
            s => s.societyId === period.societyId && s.isActive
        ) || [];
        const attendances = mockStore.getState().monthlyAttendance?.filter(
            a => a.societyId === period.societyId
        ) || [];
        const overtimeRecords = mockStore.getState().overtimeRecords?.filter(
            o => o.societyId === period.societyId && o.approvalStatus === 'APPROVED'
        ) || [];
        const advances = mockStore.getState().staffAdvances?.filter(
            a => a.societyId === period.societyId && a.status === 'RECOVERING'
        ) || [];

        let totalGross = 0;
        let totalDeductionsAll = 0;
        let totalNet = 0;
        let processedCount = 0;
        const errors: string[] = [];

        for (const staff of staffMembers) {
            try {
                const salaryStructure = salaryStructures.find(s => s.staffId === staff.id && s.isActive);
                if (!salaryStructure) {
                    errors.push(`No active salary structure for staff ${staff.staffCode}`);
                    continue;
                }
                const earnings: PayrollEarning[] = [];
                let grossPay = 0;

                for (const component of salaryStructure.components) {
                    if (!component.isActive) continue;
                    let amount = component.amount;
                    let calculationBasis = component.isFixed ? `Fixed amount: ${amount}` : `Calculated: ${component.calculationRule || 'N/A'}`;

                    if (component.type === 'OVERTIME') {
                        const staffOvertime = overtimeRecords.find(o => o.staffId === staff.id && o.approvalStatus === 'APPROVED');
                        if (staffOvertime) {
                            amount = staffOvertime.approvedMinutes * (component.amount / 60);
                            calculationBasis = `Overtime: ${staffOvertime.approvedMinutes} minutes @ ${component.amount}/hr`;
                        }
                    }
                    const earning: PayrollEarning = {
                        id: generateId('earn'),
                        payrollRecordId: '',
                        type: component.type,
                        componentName: component.name,
                        amount,
                        isTaxable: component.isTaxable,
                        calculationBasis,
                        ...(period.societyId ? { societyId: period.societyId } : {}),
                    };
                    earnings.push(earning);
                    grossPay += amount;
                }

                const deductions: PayrollDeduction[] = [];
                let staffDeductions = 0;
                const pfAmount = Math.min(grossPay * 0.12, 1800);
                deductions.push({
                    id: generateId('ded'),
                    payrollRecordId: '',
                    type: 'STATUTORY',
                    componentName: 'Provident Fund',
                    amount: pfAmount,
                    isTaxable: false,
                    calculationBasis: `12% of basic (capped at 1800)`,
                    ...(period.societyId ? { societyId: period.societyId } : {}),
                });
                staffDeductions += pfAmount;

                const staffAdvances = advances.filter(a => a.staffId === staff.id);
                for (const adv of staffAdvances) {
                    const recoveryAmount = Math.min(adv.balance, 5000);
                    if (recoveryAmount > 0) {
                        deductions.push({
                            id: generateId('ded'),
                            payrollRecordId: '',
                            type: 'ADVANCE_RECOVERY',
                            componentName: 'Advance Recovery',
                            amount: recoveryAmount,
                            isTaxable: false,
                            calculationBasis: 'Advance recovery installment',
                            ...(period.societyId ? { societyId: period.societyId } : {}),
                        });
                        staffDeductions += recoveryAmount;
                    }
                }

                const netPay = grossPay - staffDeductions;
                const payrollRecord: PayrollRecord = {
                    id: generateId('payrec'),
                    payrollPeriodId: period.id,
                    staffId: staff.id,
                    staffName: staff.name,
                    staffCode: staff.staffCode || '',
                    salaryStructureId: salaryStructure.id,
                    earnings,
                    deductions,
                    grossPay,
                    totalDeductions: staffDeductions,
                    netPay,
                    attendanceDays: 0,
                    presentDays: 0,
                    absentDays: 0,
                    overtimeHours: 0,
                    overtimePay: 0,
                    leaveDays: 0,
                    advanceRecovery: staffDeductions - pfAmount,
                    paymentStatus: 'PAYMENT_PENDING',
                    isFinalized: false,
                    adjustmentNotes: '',
                    metadata: {},
                    ...(period.societyId ? { societyId: period.societyId } : {}),
                };

                const records = mockStore.getState().payrollRecords;
                if (records) {
                    records.push(payrollRecord);
                } else {
                    mockStore.getState().payrollRecords = [payrollRecord];
                }
                processedCount++;
                totalGross += grossPay;
                totalDeductionsAll += staffDeductions;
                totalNet += netPay;
            } catch (error) {
                errors.push(`Error calculating payroll for ${staff.staffCode}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }

        const now = new Date().toISOString();
        const updatedPeriod: PayrollPeriod = {
            ...period,
            status: 'REVIEW',
            eligibleStaffCount: staffMembers.length,
            processedStaffCount: processedCount,
            totalGross,
            totalDeductions: totalDeductionsAll,
            totalNet,
            updatedAt: now,
            ...(errors.length > 0 ? { notes: errors.join('; ') } : {}),
        };
        periods[index] = updatedPeriod;
        mockStore.notify();

        createAuditEntry({
            actorUserId: calculatedBy || 'SYSTEM',
            actorType: 'SYSTEM',
            societyId: period.societyId ?? '',
            action: 'PAYROLL_CALCULATED',
            entityType: 'PAYROLL_PERIOD',
            entityId: periodId,
            newState: { processedCount, totalGross, totalNet, errors: errors.length },
            idempotencyKey: createIdempotencyKey(`payroll_calc_${periodId}`),
            source: 'SYSTEM_JOB',
            outcome: errors.length > 0 ? 'PARTIAL' : 'SUCCESS',
        });
        return { success: true, period: updatedPeriod };
    },

    async validatePayroll(periodId: string, validatedBy: string): Promise<{
        success: boolean;
        error?: string;
    }> {
        const periods = mockStore.getState().payrollPeriods;
        if (!periods) return { success: false, error: 'Payroll period not found' };
        const index = periods.findIndex(p => p.id === periodId);
        if (index === -1) return { success: false, error: 'Payroll period not found' };
        const period = periods[index];
        if (!period) return { success: false, error: 'Payroll period not found' };

        if (period.status !== 'REVIEW') {
            return { success: false, error: `Cannot validate payroll in status: ${period.status}` };
        }
        const records = mockStore.getState().payrollRecords?.filter(r => r.payrollPeriodId === periodId) || [];
        const exceptions: string[] = [];
        for (const record of records) {
            if (!record.salaryStructureId) {
                exceptions.push(`${record.staffCode}: Missing salary structure`);
            }
            if (record.grossPay <= 0) {
                exceptions.push(`${record.staffCode}: Invalid gross pay`);
            }
            if (record.netPay < 0) {
                exceptions.push(`${record.staffCode}: Negative net pay`);
            }
        }

        const now = new Date().toISOString();
        const updated: PayrollPeriod = {
            ...period,
            status: exceptions.length > 0 ? 'CORRECTION_REQUIRED' : 'APPROVAL_PENDING',
            updatedAt: now,
            ...(exceptions.length > 0 ? { notes: exceptions.join('; ') } : {}),
        };
        periods[index] = updated;
        mockStore.notify();

        createAuditEntry({
            actorUserId: validatedBy || 'SYSTEM',
            actorType: 'SYSTEM',
            societyId: period.societyId ?? '',
            action: 'PAYROLL_VALIDATED',
            entityType: 'PAYROLL_PERIOD',
            entityId: periodId,
            newState: { status: updated.status, exceptions: exceptions.length },
            idempotencyKey: createIdempotencyKey(`payroll_validate_${periodId}`),
            source: 'SYSTEM_JOB',
            outcome: exceptions.length > 0 ? 'PARTIAL' : 'SUCCESS',
        });
        return { success: true };
    },

    async approvePayroll(periodId: string, approvedBy: string): Promise<{
        success: boolean;
        error?: string;
    }> {
        const periods = mockStore.getState().payrollPeriods;
        if (!periods) return { success: false, error: 'Payroll period not found' };
        const index = periods.findIndex(p => p.id === periodId);
        if (index === -1) return { success: false, error: 'Payroll period not found' };
        const period = periods[index];
        if (!period) return { success: false, error: 'Payroll period not found' };

        if (!canTransitionPayrollStatus(period.status, 'APPROVED')) {
            return { success: false, error: `Cannot approve payroll in status: ${period.status}` };
        }
        const now = new Date().toISOString();
        const updated: PayrollPeriod = {
            ...period,
            status: 'APPROVED',
            approvedBy,
            approvedAt: now,
            updatedAt: now,
        };
        periods[index] = updated;
        mockStore.notify();

        createAuditEntry({
            actorUserId: approvedBy,
            actorType: 'PAYROLL_ADMIN',
            societyId: period.societyId ?? '',
            action: 'PAYROLL_APPROVED',
            entityType: 'PAYROLL_PERIOD',
            entityId: periodId,
            previousState: { status: period.status },
            newState: { status: 'APPROVED', approvedBy, approvedAt: now },
            idempotencyKey: createIdempotencyKey(`payroll_approve_${periodId}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return { success: true };
    },

    async finalizePayroll(periodId: string, finalizedBy: string): Promise<{
        success: boolean;
        error?: string;
    }> {
        const periods = mockStore.getState().payrollPeriods;
        if (!periods) return { success: false, error: 'Payroll period not found' };
        const index = periods.findIndex(p => p.id === periodId);
        if (index === -1) return { success: false, error: 'Payroll period not found' };
        const period = periods[index];
        if (!period) return { success: false, error: 'Payroll period not found' };

        if (!canTransitionPayrollStatus(period.status, 'FINALIZED')) {
            return { success: false, error: `Cannot finalize payroll in status: ${period.status}` };
        }
        const records = mockStore.getState().payrollRecords?.filter(r => r.payrollPeriodId === periodId) || [];
        for (const record of records) {
            await this.generatePayslip(record.id, finalizedBy);
        }
        const now = new Date().toISOString();
        const updated: PayrollPeriod = {
            ...period,
            status: 'FINALIZED',
            finalizedBy,
            finalizedAt: now,
            updatedAt: now,
        };
        periods[index] = updated;
        mockStore.notify();

        createAuditEntry({
            actorUserId: finalizedBy,
            actorType: 'PAYROLL_ADMIN',
            societyId: period.societyId ?? '',
            action: 'PAYROLL_FINALIZED',
            entityType: 'PAYROLL_PERIOD',
            entityId: periodId,
            previousState: { status: period.status },
            newState: { status: 'FINALIZED', finalizedBy, finalizedAt: now },
            idempotencyKey: createIdempotencyKey(`payroll_finalize_${periodId}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return { success: true };
    },

    async generatePayslip(payrollRecordId: string, generatedBy: string): Promise<Payslip> {
        const records = mockStore.getState().payrollRecords;
        if (!records) throw new Error('Payroll record not found');
        const index = records.findIndex(r => r.id === payrollRecordId);
        if (index === -1) throw new Error('Payroll record not found');
        const record = records[index];
        if (!record) throw new Error('Payroll record not found');

        const period = mockStore.getState().payrollPeriods?.find(p => p.id === record.payrollPeriodId);
        if (!period) throw new Error('Payroll period not found');

        const payslipId = generateId('payslip');
        const now = new Date().toISOString();
        const payslip: Payslip = {
            id: payslipId,
            payrollRecordId: record.id,
            staffId: record.staffId,
            staffName: record.staffName,
            staffCode: record.staffCode,
            payrollPeriodId: period.id,
            periodName: period.name,
            grossPay: record.grossPay,
            totalDeductions: record.totalDeductions,
            netPay: record.netPay,
            earnings: record.earnings.map(e => ({
                id: generateId('ps_earn'),
                payslipId,
                type: e.type,
                componentName: e.componentName,
                amount: e.amount,
                isTaxable: e.isTaxable,
            })),
            deductions: record.deductions.map(d => ({
                id: generateId('ps_ded'),
                payslipId,
                type: d.type,
                componentName: d.componentName,
                amount: d.amount,
                isTaxable: d.isTaxable,
            })),
            paymentStatus: 'PAYMENT_PENDING',
            generatedAt: now,
            generatedBy,
            ...(record.societyId ? { societyId: record.societyId } : {}),
        };

        const payslips = mockStore.getState().payslips;
        if (payslips) {
            payslips.push(payslip);
        } else {
            mockStore.getState().payslips = [payslip];
        }

        records[index] = {
            ...record,
            payslipId: payslip.id,
            payslipGeneratedAt: now,
        };
        mockStore.notify();

        createAuditEntry({
            actorUserId: generatedBy,
            actorType: 'PAYROLL_ADMIN',
            societyId: record.societyId ?? '',
            action: 'PAYSLIP_GENERATED',
            entityType: 'PAYSLIP',
            entityId: payslip.id,
            newState: { payrollRecordId: record.id, netPay: record.netPay },
            idempotencyKey: createIdempotencyKey(`payslip_${payslip.id}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return payslip;
    },

    async getPayslip(payslipId: string): Promise<Payslip | null> {
        return mockStore.getState().payslips?.find(p => p.id === payslipId) || null;
    },

    async getPayslipsByPeriod(periodId: string): Promise<Payslip[]> {
        return mockStore.getState().payslips?.filter(p => p.payrollPeriodId === periodId) || [];
    },

    async getPayslipsByStaff(staffId: string): Promise<Payslip[]> {
        return mockStore.getState().payslips?.filter(p => p.staffId === staffId) || [];
    },

    async recordPayment(periodId: string, input: {
        payrollRecordId: string;
        amount: number;
        paymentReference: string;
        paymentDate: string;
        paymentMode: string;
        processedBy: string;
    }): Promise<{
        success: boolean;
        error?: string;
    }> {
        const records = mockStore.getState().payrollRecords;
        if (!records) return { success: false, error: 'Payroll record not found' };
        const index = records.findIndex(r => r.id === input.payrollRecordId);
        if (index === -1) return { success: false, error: 'Payroll record not found' };
        const record = records[index];
        if (!record) return { success: false, error: 'Payroll record not found' };

        if (record.paymentStatus === 'PAID') {
            return { success: false, error: 'Already paid' };
        }
        const updated: PayrollRecord = {
            ...record,
            paymentStatus: 'PAID',
            paymentReference: input.paymentReference,
            paymentDate: input.paymentDate,
        };
        records[index] = updated;
        mockStore.notify();

        createAuditEntry({
            actorUserId: input.processedBy,
            actorType: 'PAYROLL_ADMIN',
            societyId: record.societyId ?? '',
            action: 'PAYROLL_PAYMENT_RECORDED',
            entityType: 'PAYROLL_RECORD',
            entityId: input.payrollRecordId,
            previousState: { paymentStatus: record.paymentStatus },
            newState: { paymentStatus: 'PAID', paymentReference: input.paymentReference },
            idempotencyKey: createIdempotencyKey(`payroll_payment_${input.payrollRecordId}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return { success: true };
    },

    async createAdjustment(
        input: Omit<PayrollAdjustment, 'id' | 'isProcessed' | 'processedAt' | 'societyId'>,
        createdBy: string
    ): Promise<PayrollAdjustment> {
        const staff = mockStore.getState().staff?.find(s => s.id === input.staffId);
        const adjustment: PayrollAdjustment = {
            id: generateId('adj'),
            ...input,
            isProcessed: false,
            ...(staff?.societyId ? { societyId: staff.societyId } : {}),
        };
        const adjustments = mockStore.getState().payrollAdjustments;
        if (adjustments) {
            adjustments.push(adjustment);
        } else {
            mockStore.getState().payrollAdjustments = [adjustment];
        }
        mockStore.notify();

        createAuditEntry({
            actorUserId: createdBy,
            actorType: 'PAYROLL_ADMIN',
            societyId: adjustment.societyId ?? '',
            action: 'PAYROLL_ADJUSTMENT_CREATED',
            entityType: 'PAYROLL_ADJUSTMENT',
            entityId: adjustment.id,
            newState: { type: input.type, amount: input.amount, reason: input.reason },
            idempotencyKey: createIdempotencyKey(`payroll_adj_${adjustment.id}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return adjustment;
    },

    async processAdjustment(adjustmentId: string, processedBy: string): Promise<PayrollAdjustment | null> {
        const adjustments = mockStore.getState().payrollAdjustments;
        if (!adjustments) return null;
        const index = adjustments.findIndex(a => a.id === adjustmentId);
        if (index === -1) return null;
        const adjustment = adjustments[index];
        if (!adjustment) return null;

        const now = new Date().toISOString();
        const updated: PayrollAdjustment = {
            ...adjustment,
            isProcessed: true,
            processedAt: now,
        };
        adjustments[index] = updated;
        mockStore.notify();

        createAuditEntry({
            actorUserId: processedBy,
            actorType: 'PAYROLL_ADMIN',
            societyId: adjustment.societyId ?? '',
            action: 'PAYROLL_ADJUSTMENT_PROCESSED',
            entityType: 'PAYROLL_ADJUSTMENT',
            entityId: adjustmentId,
            previousState: { isProcessed: false },
            newState: { isProcessed: true, processedAt: now },
            idempotencyKey: createIdempotencyKey(`payroll_adj_process_${adjustmentId}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return updated;
    },

    async createAdvance(
        input: Omit<StaffAdvance, 'id' | 'requestedAt' | 'recoverySchedule' | 'totalRecovered' | 'balance' | 'status' | 'societyId'>,
        requestedBy: string
    ): Promise<StaffAdvance> {
        const staff = mockStore.getState().staff?.find(s => s.id === input.staffId);
        const advance: StaffAdvance = {
            id: generateId('adv'),
            ...input,
            requestedAt: new Date().toISOString(),
            recoverySchedule: [],
            totalRecovered: 0,
            balance: input.amount,
            status: 'PENDING',
            ...(staff?.societyId ? { societyId: staff.societyId } : {}),
        };

        const advances = mockStore.getState().staffAdvances;
        if (advances) {
            advances.push(advance);
        } else {
            mockStore.getState().staffAdvances = [advance];
        }
        mockStore.notify();

        createAuditEntry({
            actorUserId: requestedBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId: advance.societyId ?? '',
            action: 'STAFF_ADVANCE_CREATED',
            entityType: 'STAFF_ADVANCE',
            entityId: advance.id,
            newState: { staffId: input.staffId, amount: input.amount },
            idempotencyKey: createIdempotencyKey(`staff_adv_${advance.id}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return advance;
    },

    async approveAdvance(advanceId: string, approvedBy: string): Promise<StaffAdvance | null> {
        const advances = mockStore.getState().staffAdvances;
        if (!advances) return null;
        const index = advances.findIndex(a => a.id === advanceId);
        if (index === -1) return null;
        const current = advances[index];
        if (!current) return null;

        const now = new Date().toISOString();
        const updated: StaffAdvance = {
            ...current,
            status: 'APPROVED',
            approvedAt: now,
            approvedBy,
        };
        advances[index] = updated;
        mockStore.notify();

        createAuditEntry({
            actorUserId: approvedBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId: current.societyId ?? '',
            action: 'STAFF_ADVANCE_APPROVED',
            entityType: 'STAFF_ADVANCE',
            entityId: advanceId,
            previousState: { status: current.status },
            newState: { status: 'APPROVED', approvedAt: now },
            idempotencyKey: generateId('adv_approve_'),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return updated;
    },

    async disburseAdvance(advanceId: string, disbursedBy: string): Promise<StaffAdvance | null> {
        const advances = mockStore.getState().staffAdvances;
        if (!advances) return null;
        const index = advances.findIndex(a => a.id === advanceId);
        if (index === -1) return null;
        const current = advances[index];
        if (!current) return null;

        const now = new Date().toISOString();
        const updated: StaffAdvance = {
            ...current,
            status: 'DISBURSED',
            disbursedAt: now,
            disbursedBy,
        };
        advances[index] = updated;
        mockStore.notify();

        createAuditEntry({
            actorUserId: disbursedBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId: current.societyId ?? '',
            action: 'STAFF_ADVANCE_DISBURSED',
            entityType: 'STAFF_ADVANCE',
            entityId: advanceId,
            previousState: { status: current.status },
            newState: { status: 'DISBURSED', disbursedAt: now },
            idempotencyKey: generateId('adv_disb_'),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return updated;
    },

    async recoverAdvance(advanceId: string, amount: number, payrollPeriodId: string, recoveredBy: string): Promise<AdvanceRecovery | null> {
        const advances = mockStore.getState().staffAdvances;
        if (!advances) return null;
        const index = advances.findIndex(a => a.id === advanceId);
        if (index === -1) return null;
        const advance = advances[index];
        if (!advance) return null;

        const recovery: AdvanceRecovery = {
            id: generateId('adv_rec'),
            advanceId,
            payrollPeriodId,
            amount,
            recoveredAt: new Date().toISOString(),
            recoveredBy,
            ...(advance.societyId ? { societyId: advance.societyId } : {}),
        };

        const recoveries = mockStore.getState().advanceRecoveries;
        if (recoveries) {
            recoveries.push(recovery);
        } else {
            mockStore.getState().advanceRecoveries = [recovery];
        }

        advance.totalRecovered += amount;
        advance.balance = Math.max(0, advance.balance - amount);
        if (advance.balance === 0) {
            advance.status = 'CLOSED';
        }
        advance.recoverySchedule.push(recovery);
        mockStore.notify();

        createAuditEntry({
            actorUserId: recoveredBy,
            actorType: 'PAYROLL_ADMIN',
            societyId: advance.societyId ?? '',
            action: 'ADVANCE_RECOVERED',
            entityType: 'ADVANCE_RECOVERY',
            entityId: recovery.id,
            newState: { amount, payrollPeriodId, newBalance: advance.balance },
            idempotencyKey: createIdempotencyKey(`adv_recover_${recovery.id}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return recovery;
    },

    async getPayrollDashboard(societyId: string): Promise<{
        currentPeriod: PayrollPeriod | null;
        totalGross: number;
        totalNet: number;
        totalDeductions: number;
        paidCount: number;
        pendingCount: number;
        failedCount: number;
        advanceBalance: number;
        byStatus: Record<string, number>;
    }> {
        const periods = mockStore.getState().payrollPeriods?.filter(p => p.societyId === societyId) || [];
        const records = mockStore.getState().payrollRecords?.filter(r => r.societyId === societyId) || [];
        const advances = mockStore.getState().staffAdvances?.filter(a => a.societyId === societyId) || [];
        const currentPeriod = periods.find(p => p.status !== 'RECONCILED' && p.status !== 'CANCELLED') || null;
        const byStatus: Record<string, number> = {};
        let paidCount = 0;
        let pendingCount = 0;
        let failedCount = 0;

        for (const r of records) {
            byStatus[r.paymentStatus] = (byStatus[r.paymentStatus] || 0) + 1;
            if (r.paymentStatus === 'PAID') {
                paidCount++;
            } else if (r.paymentStatus === 'PAYMENT_PENDING') {
                pendingCount++;
            } else if (r.paymentStatus === 'FAILED') {
                failedCount++;
            }
        }
        const advanceBalance = advances.filter(a => a.status === 'RECOVERING').reduce((sum, a) => sum + a.balance, 0);

        return {
            currentPeriod,
            totalGross: records.reduce((sum, r) => sum + r.grossPay, 0),
            totalNet: records.reduce((sum, r) => sum + r.netPay, 0),
            totalDeductions: records.reduce((sum, r) => sum + r.totalDeductions, 0),
            paidCount,
            pendingCount,
            failedCount,
            advanceBalance,
            byStatus,
        };
    },
};

export default payrollService;
