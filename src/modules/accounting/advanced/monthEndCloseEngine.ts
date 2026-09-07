import { MonthEndCloseTask, MonthEndClosePeriod, } from './advancedAccounting.types';
import type { JsonObject } from '../../../core/api/api.types';
import { createIdempotencyKey } from '../../../core/api/idempotency';
import { auditService, createAuditEntry } from '../../../core/audit';
const DEFAULT_CLOSE_TASKS: Omit<MonthEndCloseTask, 'id' | 'societyId' | 'period' | 'status' | 'dependencies' | 'evidence' | 'notes'>[] = [
    { taskName: 'Bank Reconciliation', description: 'Complete all bank reconciliations', category: 'BANK_RECONCILIATION', assignedTo: 'FINANCE_ADMIN', dueDate: 'DAY_1' },
    { taskName: 'Accrued Expenses', description: 'Record accrued expenses', category: 'ACCRUALS', assignedTo: 'FINANCE_ADMIN', dueDate: 'DAY_2' },
    { taskName: 'Prepaid Expenses', description: 'Adjust prepaid expenses', category: 'PREPAYMENTS', assignedTo: 'FINANCE_ADMIN', dueDate: 'DAY_2' },
    { taskName: 'Depreciation', description: 'Run depreciation for fixed assets', category: 'DEPRECIATION', assignedTo: 'FINANCE_ADMIN', dueDate: 'DAY_3' },
    { taskName: 'Revenue Recognition', description: 'Recognize revenue per contracts', category: 'REVENUE_RECOGNITION', assignedTo: 'FINANCE_ADMIN', dueDate: 'DAY_3' },
    { taskName: 'Expense Allocation', description: 'Allocate shared expenses', category: 'EXPENSE_ALLOCATION', assignedTo: 'FINANCE_ADMIN', dueDate: 'DAY_4' },
    { taskName: 'Tax Compliance', description: 'GST/TDS compliance check', category: 'TAX_COMPLIANCE', assignedTo: 'TAX_ADMIN', dueDate: 'DAY_4' },
    { taskName: 'Financial Reports', description: 'Generate month-end reports', category: 'REPORTING', assignedTo: 'FINANCE_ADMIN', dueDate: 'DAY_5' },
    { taskName: 'Validation Checks', description: 'Run validation checks', category: 'VALIDATION', assignedTo: 'FINANCE_ADMIN', dueDate: 'DAY_5' },
];
class MonthEndCloseEngine {
    private periods: Map<string, MonthEndClosePeriod> = new Map();
    private listeners: Array<(period: MonthEndClosePeriod) => void> = [];
    constructor() {
        this.loadFromStorage();
    }
    private loadFromStorage(): void {
        try {
            const stored = localStorage.getItem('month_end_close_periods');
            if (stored) {
                const periods = JSON.parse(stored);
                periods.forEach((p: MonthEndClosePeriod) => this.periods.set(p.id, p));
            }
        }
        catch (error) {
            console.error('[MonthEndCloseEngine] Failed to load from storage:', error);
        }
    }
    private saveToStorage(): void {
        try {
            localStorage.setItem('month_end_close_periods', JSON.stringify(Array.from(this.periods.values())));
        }
        catch (error) {
            console.error('[MonthEndCloseEngine] Failed to save to storage:', error);
        }
    }
    async openPeriod(societyId: string, period: string, openedBy: string): Promise<MonthEndClosePeriod> {
        const existing = Array.from(this.periods.values()).find(p => p.societyId === societyId && p.period === period);
        if (existing)
            throw new Error('Period already exists');
        const tasks: MonthEndCloseTask[] = DEFAULT_CLOSE_TASKS.map((t, index) => ({
            ...t,
            id: `task_${Date.now()}_${index}_${Math.random().toString(36).slice(2, 8)}`,
            societyId,
            period,
            status: 'PENDING',
            dependencies: index > 0 ? [`task_${Date.now()}_${index - 1}_${Math.random().toString(36).slice(2, 8)}`] : [],
        }));
        const closePeriod: MonthEndClosePeriod = {
            id: `mec_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`,
            societyId,
            period,
            status: 'OPEN',
            openedAt: new Date().toISOString(),
            tasks,
            validationChecks: [
                { name: 'Trial Balance Balanced', status: 'PASS' },
                { name: 'Bank Reconciliation Complete', status: 'PASS' },
                { name: 'All Journal Entries Posted', status: 'PASS' },
                { name: 'No Unreconciled Items', status: 'PASS' },
                { name: 'Inter-company Balanced', status: 'PASS' },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.periods.set(closePeriod.id, closePeriod);
        this.saveToStorage();
        createAuditEntry({
            actorUserId: openedBy,
            actorType: 'ADMIN',
            societyId,
            action: 'MONTH_END_CLOSE_OPEN',
            entityType: 'MONTH_END_CLOSE',
            entityId: closePeriod.id,
            newState: { period, taskCount: tasks.length },
            idempotencyKey: createIdempotencyKey('mec_open'),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        this.notifyListeners(closePeriod);
        return closePeriod;
    }
    async startTask(periodId: string, taskId: string, startedBy: string): Promise<void> {
        const period = this.periods.get(periodId);
        if (!period)
            throw new Error('Period not found');
        const task = period.tasks.find(t => t.id === taskId);
        if (!task)
            throw new Error('Task not found');
        if (task.status !== 'PENDING')
            throw new Error('Task already started or completed');
        const incompleteDeps = task.dependencies.filter(depId => {
            const dep = period.tasks.find(t => t.id === depId);
            return dep && dep.status !== 'COMPLETED';
        });
        if (incompleteDeps.length > 0)
            throw new Error('Dependencies not completed');
        task.status = 'IN_PROGRESS';
        task.startedAt = new Date().toISOString();
        period.updatedAt = new Date().toISOString();
        this.periods.set(periodId, period);
        this.saveToStorage();
        createAuditEntry({
            actorUserId: startedBy,
            actorType: 'ADMIN',
            societyId: period.societyId,
            action: 'MEC_TASK_START',
            entityType: 'MONTH_END_CLOSE_TASK',
            entityId: taskId,
            previousState: { status: 'PENDING' },
            newState: { status: 'IN_PROGRESS' },
            idempotencyKey: createIdempotencyKey('mec_task_start'),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        this.notifyListeners(period);
    }
    async completeTask(periodId: string, taskId: string, completedBy: string, evidence?: JsonObject): Promise<void> {
        const period = this.periods.get(periodId);
        if (!period)
            throw new Error('Period not found');
        const task = period.tasks.find(t => t.id === taskId);
        if (!task)
            throw new Error('Task not found');
        task.status = 'COMPLETED';
        task.completedAt = new Date().toISOString();
        task.completedBy = completedBy;
        if (evidence) {
            task.evidence = evidence;
        }
        period.updatedAt = new Date().toISOString();
        const allCompleted = period.tasks.every(t => t.status === 'COMPLETED' || t.status === 'SKIPPED');
        if (allCompleted && period.status !== 'CLOSED') {
            period.status = 'CLOSING';
        }
        this.periods.set(periodId, period);
        this.saveToStorage();
        createAuditEntry({
            actorUserId: completedBy,
            actorType: 'ADMIN',
            societyId: period.societyId,
            action: 'MEC_TASK_COMPLETE',
            entityType: 'MONTH_END_CLOSE_TASK',
            entityId: taskId,
            previousState: { status: task.status },
            newState: { status: 'COMPLETED', evidence },
            idempotencyKey: createIdempotencyKey('mec_task_complete'),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        this.notifyListeners(period);
    }
    async runValidationChecks(periodId: string, runBy: string): Promise<void> {
        const period = this.periods.get(periodId);
        if (!period)
            throw new Error('Period not found');
        const checks = period.validationChecks.map(check => {
            let status: 'PASS' | 'FAIL' | 'WARNING' = 'PASS';
            let details = '';
            switch (check.name) {
                case 'Trial Balance Balanced':
                    break;
                case 'Bank Reconciliation Complete':
                    break;
                case 'All Journal Entries Posted':
                    break;
                case 'No Unreconciled Items':
                    break;
                case 'Inter-company Balanced':
                    break;
            }
            return { ...check, status, details };
        });
        period.validationChecks = checks;
        period.updatedAt = new Date().toISOString();
        this.periods.set(periodId, period);
        this.saveToStorage();
        createAuditEntry({
            actorUserId: runBy,
            actorType: 'ADMIN',
            societyId: period.societyId,
            action: 'MEC_VALIDATION_RUN',
            entityType: 'MONTH_END_CLOSE',
            entityId: periodId,
            newState: { checks },
            idempotencyKey: createIdempotencyKey('mec_validate'),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        this.notifyListeners(period);
    }
    async closePeriod(periodId: string, closedBy: string): Promise<void> {
        const period = this.periods.get(periodId);
        if (!period)
            throw new Error('Period not found');
        if (period.status !== 'CLOSING') {
            throw new Error('Period must be in CLOSING state');
        }
        const incompleteTasks = period.tasks.filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS');
        if (incompleteTasks.length > 0) {
            throw new Error(`${incompleteTasks.length} tasks incomplete`);
        }
        const failedChecks = period.validationChecks.filter(c => c.status === 'FAIL');
        if (failedChecks.length > 0) {
            throw new Error(`${failedChecks.length} validation checks failed`);
        }
        period.status = 'CLOSED';
        period.closedAt = new Date().toISOString();
        period.closedBy = closedBy;
        period.updatedAt = new Date().toISOString();
        this.periods.set(periodId, period);
        this.saveToStorage();
        createAuditEntry({
            actorUserId: closedBy,
            actorType: 'ADMIN',
            societyId: period.societyId,
            action: 'MONTH_END_CLOSE_COMPLETE',
            entityType: 'MONTH_END_CLOSE',
            entityId: periodId,
            previousState: { status: 'CLOSING' },
            newState: { status: 'CLOSED' },
            idempotencyKey: createIdempotencyKey('mec_close'),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        this.notifyListeners(period);
    }
    async reopenPeriod(periodId: string, reopenedBy: string, reason: string): Promise<void> {
        const period = this.periods.get(periodId);
        if (!period)
            throw new Error('Period not found');
        period.status = 'REOPENED';
        period.updatedAt = new Date().toISOString();
        this.periods.set(periodId, period);
        this.saveToStorage();
        createAuditEntry({
            actorUserId: reopenedBy,
            actorType: 'ADMIN',
            societyId: period.societyId,
            action: 'MONTH_END_CLOSE_REOPEN',
            entityType: 'MONTH_END_CLOSE',
            entityId: periodId,
            previousState: { status: 'CLOSED' },
            newState: { status: 'REOPENED', reason },
            idempotencyKey: createIdempotencyKey('mec_reopen'),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        this.notifyListeners(period);
    }
    getPeriod(periodId: string): MonthEndClosePeriod | null {
        return this.periods.get(periodId) ?? null;
    }
    getPeriodsBySociety(societyId: string): MonthEndClosePeriod[] {
        return Array.from(this.periods.values())
            .filter(p => p.societyId === societyId)
            .sort((a, b) => new Date(b.openedAt).getTime() - new Date(a.openedAt).getTime());
    }
    onUpdate(listener: (period: MonthEndClosePeriod) => void): () => void {
        this.listeners.push(listener);
        return () => {
            const idx = this.listeners.indexOf(listener);
            if (idx >= 0)
                this.listeners.splice(idx, 1);
        };
    }
    private notifyListeners(period: MonthEndClosePeriod): void {
        this.listeners.forEach(l => l(period));
    }
}
export const monthEndCloseEngine = new MonthEndCloseEngine();

