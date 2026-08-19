import { repositoryFailure, repositorySuccess, withMockDelay, type RepositoryResult, } from '../../../../core/repositories/repository.types';
import { mockStore } from '../../../../core/mockStore/mockStore';
import type { Bill, BillStatus } from '../../../../shared/types/bill.types';
import type { LedgerEntry } from '../../../../core/mockStore/mockStore.types';
import { generateMockReceiptNumber, generateMockTransactionId } from '../../../../shared/utils/formatters';
import type { MockPaymentConfirmation } from './bill.dto';
import { resolveRequestContext } from '../../homeContext/utils/resolveRequestContext';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import { matchesResidentRepositoryContext } from '../../homeContext/utils/matchesResidentRepositoryContext';
import type { ResidentBillingRepository } from './residentBilling.repository.types';
import type { BillListFilter, ResidentBillListPage, ResidentBillListPageRequest, ResidentLedgerEntry, ResidentLedgerPage, ResidentLedgerPageRequest, } from './residentBilling.types';
import type { Absent } from "../../../../shared/types/absence.types";
const MAX_PAGE_SIZE = 50;
function matchesFilter(bill: Bill, filter: BillListFilter): boolean {
    if (filter === 'paid')
        return bill.status === 'PAID';
    if (filter === 'overdue')
        return bill.status === 'OVERDUE';
    if (filter === 'unpaid') {
        return bill.status === 'DUE' || bill.status === 'PARTIALLY_PAID' || bill.status === 'GENERATED';
    }
    return true;
}
function getScopedBills(context: ResidentRepositoryRequestContext): Bill[] {
    if (context.activeHome.residentRole === 'familyMember') {
        return [];
    }
    return mockStore
        .getState()
        .bills
        .filter((bill) => matchesResidentRepositoryContext(bill, context))
        .sort((left, right) => right.dueDate.localeCompare(left.dueDate));
}
export function paginateResidentBills(bills: readonly Bill[], request: ResidentBillListPageRequest): ResidentBillListPage {
    const filtered = bills.filter((bill) => matchesFilter(bill, request.filter));
    const pageSize = Math.min(Math.max(Math.trunc(request.pageSize), 1), MAX_PAGE_SIZE);
    const cursorIndex = request.cursor
        ? filtered.findIndex((bill) => bill.id === request.cursor)
        : -1;
    const startIndex = cursorIndex >= 0 ? cursorIndex + 1 : 0;
    const pageBills = filtered.slice(startIndex, startIndex + pageSize);
    const hasMore = startIndex + pageBills.length < filtered.length;
    return {
        bills: pageBills,
        nextCursor: hasMore ? pageBills.at(-1)?.id ?? null : null,
        hasMore,
    };
}
export function paginateResidentLedger(entries: readonly ResidentLedgerEntry[], request: ResidentLedgerPageRequest): ResidentLedgerPage {
    const pageSize = Math.min(Math.max(Math.trunc(request.pageSize), 1), MAX_PAGE_SIZE);
    const cursorIndex = request.cursor
        ? entries.findIndex((entry) => entry.id === request.cursor)
        : -1;
    const startIndex = cursorIndex >= 0 ? cursorIndex + 1 : 0;
    const pageEntries = entries.slice(startIndex, startIndex + pageSize);
    const hasMore = startIndex + pageEntries.length < entries.length;
    return {
        entries: pageEntries,
        nextCursor: hasMore ? pageEntries.at(-1)?.id ?? null : null,
        hasMore,
    };
}
const residentBillingMockRepository: ResidentBillingRepository = {
    async getBillSummary(context) {
        await withMockDelay();
        const requestContext = resolveRequestContext(context);
        const bills = getScopedBills(requestContext);
        const outstandingBills = bills.filter((bill) => bill.status === 'DUE' || bill.status === 'OVERDUE' || bill.status === 'PARTIALLY_PAID');
        const residenceId = requestContext.activeHome.unitId;
        const advanceBalance = mockStore.getState().advanceBalances[residenceId] ?? 0;
        
        const totalOutstanding = outstandingBills.reduce((total, bill) => total + Math.max(0, bill.amount - (bill.paidAmount ?? 0)), 0);
        const overdueBills = outstandingBills.filter(b => b.status === 'OVERDUE');
        const overdueAmount = overdueBills.reduce((total, bill) => total + Math.max(0, bill.amount - (bill.paidAmount ?? 0)), 0);
        
        return repositorySuccess({
            totalOutstanding,
            pendingBillCount: outstandingBills.length,
            latestBill: outstandingBills[0] ?? bills[0] ?? null,
            currencyCode: bills[0]?.charges[0]?.currencyCode ?? 'INR',
            advanceBalance,
            overdueAmount,
            unpaidBillCount: outstandingBills.length,
            overdueBillCount: overdueBills.length,
        });
    },
    async getBillsPage(context, request) {
        await withMockDelay();
        const bills = getScopedBills(resolveRequestContext(context));
        return repositorySuccess(paginateResidentBills(bills, request));
    },
    async getBillDetail(context, billId) {
        await withMockDelay();
        const requestContext = resolveRequestContext(context);
        const bill = mockStore.getState().bills.find((candidate) => candidate.id === billId && matchesResidentRepositoryContext(candidate, requestContext));
        return repositorySuccess(bill);
    },
    async getLedgerEntriesPage(context, request) {
        await withMockDelay();
        const requestContext = resolveRequestContext(context);
        const residenceId = requestContext.activeHome.unitId;
        
        let entries = mockStore.getState().ledgerEntries.filter(entry => entry.unitId === residenceId);
        
        if (entries.length === 0) {
            const bills = getScopedBills(requestContext);
            const bootstrapped: LedgerEntry[] = [];
            const sortedBills = [...bills].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
            
            sortedBills.forEach(bill => {
                bootstrapped.push({
                    id: `${bill.id}:issued`,
                    date: bill.dueDate,
                    type: 'DEBIT' as const,
                    unitId: residenceId,
                    description: bill.title,
                    amount: bill.amount,
                });
                
                (bill.payments ?? []).forEach(p => {
                    bootstrapped.push({
                        id: `${bill.id}:payment:${p.id}`,
                        date: p.paymentDate,
                        type: 'CREDIT' as const,
                        unitId: residenceId,
                        description: `Payment received via ${p.paymentMethod}`,
                        amount: p.amountPaid,
                    });
                });
            });
            
            bootstrapped.forEach(entry => {
                mockStore.addLedgerEntry(entry);
            });
            
            entries = bootstrapped;
        }
        
        const sortedEntries = [...entries].sort((a, b) => b.date.localeCompare(a.date));
        
        const mappedEntries: ResidentLedgerEntry[] = sortedEntries.map(entry => {
            const item: ResidentLedgerEntry = {
                id: entry.id,
                billId: entry.id.split(':')[0] || '',
                billTitle: entry.description,
                kind: entry.type === 'DEBIT' ? 'billIssued' : 'paymentReceived',
                amount: entry.type === 'DEBIT' ? -entry.amount : entry.amount,
                currencyCode: 'INR',
                occurredAt: entry.date,
            };
            if (entry.type === 'CREDIT') {
                item.paymentMethod = 'UPI';
            }
            return item;
        });
        
        return repositorySuccess(paginateResidentLedger(mappedEntries, request));
    },
    async mockPayment(context, input): Promise<RepositoryResult<MockPaymentConfirmation>> {
        await withMockDelay(800);
        const requestContext = resolveRequestContext(context);
        const residenceId = requestContext.activeHome.unitId;
        
        const isAdvance = input.billId.startsWith('advance_payment');
        const isTotalOutstanding = input.billId === 'total_outstanding';
        
        let bill = mockStore.getState().bills.find((candidate) => candidate.id === input.billId && matchesResidentRepositoryContext(candidate, requestContext));
        
        if (!bill && !isAdvance && !isTotalOutstanding) {
            return repositoryFailure({
                code: 'RESIDENT_BILL_NOT_FOUND',
                message: 'The bill is not available for the active residence.',
            });
        }
        
        const transactionId = generateMockTransactionId();
        const receiptNumber = generateMockReceiptNumber();
        const paymentDate = new Date().toISOString();
        
        const bills = mockStore.getState().bills.filter(b => matchesResidentRepositoryContext(b, requestContext));
        const unpaidBills = bills.filter(b => b.status === 'DUE' || b.status === 'OVERDUE' || b.status === 'PARTIALLY_PAID');
        const sortedBills = [...unpaidBills].sort((a, b) => {
            const aIsOverdue = a.status === 'OVERDUE';
            const bIsOverdue = b.status === 'OVERDUE';
            if (aIsOverdue && !bIsOverdue) return -1;
            if (!aIsOverdue && bIsOverdue) return 1;
            return a.dueDate.localeCompare(b.dueDate);
        });
        
        let remainingAmount = input.amount;
        const allocations: { billId: string; amountAllocated: number }[] = [];
        
        if (!isAdvance && !isTotalOutstanding && bill) {
            const billOutstanding = bill.amount - (bill.paidAmount ?? 0);
            const allocateToThisBill = Math.min(remainingAmount, billOutstanding);
            remainingAmount -= allocateToThisBill;
            allocations.push({ billId: bill.id, amountAllocated: allocateToThisBill });
        } else {
            for (const unpaidBill of sortedBills) {
                if (remainingAmount <= 0) break;
                const billOutstanding = unpaidBill.amount - (unpaidBill.paidAmount ?? 0);
                if (billOutstanding <= 0) continue;
                
                const allocateToThisBill = Math.min(remainingAmount, billOutstanding);
                remainingAmount -= allocateToThisBill;
                allocations.push({ billId: unpaidBill.id, amountAllocated: allocateToThisBill });
            }
        }
        
        for (const alloc of allocations) {
            const targetBill = mockStore.getState().bills.find(b => b.id === alloc.billId)!;
            const newPaidAmount = (targetBill.paidAmount ?? 0) + alloc.amountAllocated;
            const newOutstanding = targetBill.amount - newPaidAmount;
            const newStatus: BillStatus = newOutstanding <= 0 ? 'PAID' : 'PARTIALLY_PAID';
            
            mockStore.updateBill(alloc.billId, {
                paidAmount: newPaidAmount,
                status: newStatus,
                paidDate: paymentDate,
                transactionId,
                receiptNumber,
                payments: [
                    ...(targetBill.payments ?? []),
                    {
                        id: `${alloc.billId}:payment:${Date.now()}`,
                        amountPaid: alloc.amountAllocated,
                        paymentDate,
                        paymentMethod: input.paymentMethod,
                        transactionId,
                        receiptNumber,
                    }
                ]
            });
        }
        
        if (remainingAmount > 0) {
            const currentAdvance = mockStore.getState().advanceBalances[residenceId] ?? 0;
            mockStore.updateAdvanceBalance(residenceId, currentAdvance + remainingAmount);
            
            mockStore.addLedgerEntry({
                id: `advance:${transactionId}`,
                date: paymentDate,
                type: 'CREDIT' as const,
                unitId: residenceId,
                description: `Advance Maintenance Credit Received`,
                amount: remainingAmount,
            });
        }
        
        mockStore.addLedgerEntry({
            id: `payment:${transactionId}`,
            date: paymentDate,
            type: 'CREDIT' as const,
            unitId: residenceId,
            description: isAdvance ? `Advance Maintenance Payment` : `Maintenance Payment Received`,
            amount: input.amount,
        });
        
        return repositorySuccess({ transactionId, receiptNumber, paymentDate });
    },
};
export const billMockSource = {
    ...residentBillingMockRepository,
    async list(context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<Bill[]>> {
        const requestContext = resolveRequestContext(context);
        const result = await residentBillingMockRepository.getBillsPage(requestContext, {
            filter: 'all',
            cursor: null,
            pageSize: MAX_PAGE_SIZE,
        });
        return result.ok ? repositorySuccess(result.data.bills) : result;
    },
    async detail(context: ResidentRepositoryRequestContext | string, billId?: string): Promise<RepositoryResult<Bill | Absent>> {
        const requestContext = typeof context === 'string' ? resolveRequestContext() : context;
        const resolvedBillId = typeof context === 'string' ? context : billId ?? '';
        return residentBillingMockRepository.getBillDetail(requestContext, resolvedBillId);
    },
};
export default billMockSource;
