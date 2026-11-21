import { mockStore } from '../../../core/mockStore/mockStore';
import type { Invoice, InvoiceLine, InvoiceStatus, BillingRun, } from '../../../shared/types/financial.types';
import type { Bill, BillStatus } from '../../../shared/types/bill.types';
import type { DraftBill, BillingCycle } from '../../../shared/types/accounting.types';
import { auditService, createAuditEntry } from '../../../core/audit';
import { toMinorUnits, fromMinorUnits, addMoney } from './money';
function generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
function generateInvoiceNumber(societyId: string, billingPeriod: string, sequence: number): string {
    const socCode = societyId.replace(/[^A-Za-z0-9]/g, '').substring(0, 3).toUpperCase() || 'SOC';
    const periodCode = billingPeriod.replace(/[^A-Za-z0-9]/g, '').substring(0, 6).toUpperCase();
    return `INV-${socCode}-${periodCode}-${sequence.toString().padStart(4, '0')}`;
}
export class InvoiceService {
    private static instance: InvoiceService;
    static getInstance(): InvoiceService {
        if (!InvoiceService.instance) {
            InvoiceService.instance = new InvoiceService();
        }
        return InvoiceService.instance;
    }
    async generateInvoicesFromBillingRun(billingRunId: string, generatedBy: string): Promise<{
        invoices: Invoice[];
        count: number;
    }> {
        const runs = (mockStore.getState().billingRuns ?? []) as BillingRun[];
        const run = runs.find((r) => r.id === billingRunId);
        if (!run) {
            throw new Error('Billing run not found');
        }
        if (!['APPROVED', 'VALIDATED'].includes(run.status)) {
            throw new Error(`Cannot generate invoices for billing run in status: ${run.status}`);
        }
        const allDrafts = (mockStore.getState().draftBills ?? []) as DraftBill[];
        const drafts = allDrafts.filter((db) => db.billingCycleId === billingRunId);
        if (drafts.length === 0) {
            throw new Error('No draft bills found for this billing run');
        }
        const invoices: Invoice[] = [];
        const now = new Date().toISOString();
        let sequence = 1;
        for (const draft of drafts) {
            const invoiceId = generateId('inv');
            const invoiceNumber = generateInvoiceNumber(run.societyId, run.billingPeriodStart, sequence++);
            let subtotalMinor = 0;
            const lines: InvoiceLine[] = [];
            for (const cb of draft.chargeBreakup) {
                const lineMinor = toMinorUnits(cb.amount);
                subtotalMinor = addMoney(subtotalMinor, lineMinor);
                const line: InvoiceLine = {
                    id: generateId('line'),
                    invoiceId,
                    chargeHeadId: cb.chargeHead.toLowerCase().replace(/\s+/g, '-'),
                    chargeHeadCode: cb.chargeHead.toUpperCase().replace(/\s+/g, '_'),
                    chargeHeadName: cb.chargeHead,
                    description: cb.chargeHead,
                    quantity: 1,
                    unitOfMeasure: 'UNIT',
                    rate: cb.amount,
                    amount: cb.amount,
                    taxAmount: 0,
                    taxRate: 0,
                    discountAmount: 0,
                    discountRate: 0,
                    netAmount: cb.amount,
                    calculationBasis: 'Effective-dated rule snapshot',
                };
                lines.push(line);
                mockStore.addInvoiceLine(line);
            }
            const totalAmount = fromMinorUnits(subtotalMinor);
            const invoice: Invoice = {
                id: invoiceId,
                societyId: run.societyId,
                unitId: draft.unitId,
                unitNumber: draft.unitNumber,
                billingRunId: run.id,
                invoiceNumber,
                billingRunNumber: run.id,
                status: 'APPROVED',
                issueDate: now,
                dueDate: run.dueDate,
                billingPeriodStart: run.billingPeriodStart,
                billingPeriodEnd: run.billingPeriodEnd,
                subtotal: totalAmount,
                totalDiscounts: 0,
                totalPenalties: 0,
                totalInterest: 0,
                taxAmount: 0,
                total: totalAmount,
                balance: totalAmount,
                currency: 'INR',
                approvedAt: now,
                approvedBy: generatedBy,
            };
            invoices.push(invoice);
            mockStore.addInvoice(invoice);
        }
        return { invoices, count: invoices.length };
    }
    async publishInvoices(billingRunId: string, publishedBy: string): Promise<{
        publishedCount: number;
    }> {
        const runs = (mockStore.getState().billingRuns ?? []) as BillingRun[];
        const runIndex = runs.findIndex((r) => r.id === billingRunId);
        if (runIndex === -1) {
            throw new Error('Billing run not found');
        }
        const run = runs[runIndex];
        if (!run) {
            throw new Error(`BillingRun not found: ${billingRunId}`);
        }
        const allInvoices = (mockStore.getState().invoices ?? []) as Invoice[];
        let runInvoices = allInvoices.filter((i) => i.billingRunId === billingRunId);
        if (runInvoices.length === 0) {
            const generated = await this.generateInvoicesFromBillingRun(billingRunId, publishedBy);
            runInvoices = generated.invoices;
        }
        const now = new Date().toISOString();
        let publishedCount = 0;
        for (const inv of runInvoices) {
            if (inv.status !== 'PUBLISHED') {
                const updatedInvoice: Invoice = {
                    ...inv,
                    status: 'PUBLISHED',
                    publishedAt: now,
                };
                mockStore.updateInvoice(inv.id, updatedInvoice);
                publishedCount++;
                const currentEntries = mockStore.getState().ledgerEntries ?? [];
                const unitEntries = currentEntries.filter((e) => e.unitId === inv.unitId);
                const lastBalance = unitEntries.length > 0 ? unitEntries[0]?.amount ?? 0 : 0;
                const newBalance = addMoney(toMinorUnits(lastBalance), toMinorUnits(inv.total));
                mockStore.addLedgerEntry({
                    id: generateId('led'),
                    unitId: inv.unitId,
                    amount: fromMinorUnits(newBalance),
                    type: 'DEBIT',
                    description: `Maintenance Bill: ${inv.invoiceNumber}`,
                    date: now,
                });
                const residentBill: Bill = {
                    id: inv.id,
                    billNumber: inv.invoiceNumber,
                    flatNumber: inv.unitNumber,
                    societyName: 'Society OS',
                    title: `Maintenance Bill - ${inv.billingPeriodStart}`,
                    amount: inv.total,
                    dueDate: inv.dueDate,
                    status: 'DUE' as BillStatus,
                    billingPeriod: `${inv.billingPeriodStart} to ${inv.billingPeriodEnd}`,
                    paidAmount: 0,
                    charges: (mockStore.getState().invoiceLines ?? [])
                        .filter((l) => l.invoiceId === inv.id)
                        .map((l) => ({
                        lineItemId: l.id,
                        type: 'maintenance',
                        label: l.chargeHeadName,
                        labelMessageKey: 'resident.billing.charge',
                        amount: l.amount,
                        currencyCode: 'INR',
                        isCredit: false,
                    })),
                };
                mockStore.addBill(residentBill);
            }
        }
        const updatedRun: BillingRun = {
            ...run,
            status: 'PUBLISHED',
            publishedAt: now,
        };
        mockStore.updateBillingRun(billingRunId, updatedRun);
        const cycles = (mockStore.getState().billingCycles ?? []) as BillingCycle[];
        const cycle = cycles.find((c) => c.id === billingRunId);
        if (cycle) {
            mockStore.getState().billingCycles = cycles.map((c) => c.id === billingRunId
                ? {
                    ...c,
                    status: 'PUBLISHED',
                    publishedAt: now,
                    publishedBillsCount: publishedCount,
                }
                : c);
        }
        auditService.log(createAuditEntry({
            actorUserId: publishedBy,
            actorType: 'ADMIN',
            societyId: run.societyId,
            action: 'UPDATE',
            entityType: 'BILLING_CYCLE',
            entityId: billingRunId,
            newState: { status: 'PUBLISHED', publishedCount },
            idempotencyKey: `publish_${billingRunId}`,
            source: 'MOBILE',
            outcome: 'SUCCESS',
        }));
        return { publishedCount };
    }
    async getInvoices(filters?: {
        societyId?: string;
        unitId?: string;
        status?: InvoiceStatus;
        billingRunId?: string;
    }): Promise<Invoice[]> {
        let invoices = (mockStore.getState().invoices ?? []) as Invoice[];
        if (filters?.societyId)
            invoices = invoices.filter((i) => i.societyId === filters.societyId);
        if (filters?.unitId)
            invoices = invoices.filter((i) => i.unitId === filters.unitId);
        if (filters?.status)
            invoices = invoices.filter((i) => i.status === filters.status);
        if (filters?.billingRunId)
            invoices = invoices.filter((i) => i.billingRunId === filters.billingRunId);
        return invoices.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
    }
    async getInvoiceById(invoiceId: string): Promise<Invoice | null> {
        const invoices = (mockStore.getState().invoices ?? []) as Invoice[];
        return invoices.find((i) => i.id === invoiceId) ?? null;
    }
    async getInvoiceLines(invoiceId: string): Promise<InvoiceLine[]> {
        const lines = (mockStore.getState().invoiceLines ?? []) as InvoiceLine[];
        return lines.filter((l) => l.invoiceId === invoiceId);
    }
}
export const invoiceService = InvoiceService.getInstance();

