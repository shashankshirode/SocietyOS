import { createRepository } from '../../../../core/dataSource/repositoryFactory';
import { repositoryFailure, repositorySuccess } from '../../../../core/repositories/repository.types';
import { mockStore } from '../../../../core/mockStore/mockStore';
import type { Bill, PaymentMethod } from '../../../../shared/types/bill.types';
import type { Receipt } from '../../../../shared/types/financial.types';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import { billApiSource } from './billing.apiSource';
import { billMockSource } from './billing.mockSource';
import type { ResidentBillingRepository } from './residentBilling.repository.types';

const residentRepository = createRepository<ResidentBillingRepository, ResidentBillingRepository>({
  moduleKey: 'residentBilling',
  mockRepository: billMockSource,
  apiRepository: billApiSource,
});

type BillingListInput = {
  unitId?: string;
  status?: string;
  search?: string;
};

type GenerateMonthlyBillsInput = {
  billingMonth?: string;
  dueDate?: string;
};

type PublishBillingCycleInput = {
  cycleId?: string;
};

type ResidentBillPaymentInput = {
  billId: string;
  amount: number;
  paymentMethod: PaymentMethod;
};

type ManualPaymentInput = {
  unitId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
};

type BillingCorrectionInput = {
  billId: string;
  reason: string;
};

export const billRepository = {
  ...residentRepository,

  async list(context: ResidentRepositoryRequestContext) {
    const result = await residentRepository.getBillsPage(context, {
      filter: 'all',
      cursor: null,
      pageSize: 50,
    });
    return result.ok ? repositorySuccess(result.data.bills) : result;
  },

  async detail(context: ResidentRepositoryRequestContext, billId: string) {
    return residentRepository.getBillDetail(context, billId);
  },

  async listChargeHeads(_params?: BillingListInput) {
    return repositorySuccess([]);
  },
  async generateMonthlyBills(_params?: GenerateMonthlyBillsInput) {
    return repositoryFailure({ code: 'UNSUPPORTED_OPERATION', message: 'Generating monthly bills requires backend ledger authority.' });
  },
  async listDraftBills(_params?: BillingListInput) {
    return repositorySuccess([]);
  },
  async publishBillingCycle(_params?: PublishBillingCycleInput) {
    return repositoryFailure({ code: 'UNSUPPORTED_OPERATION', message: 'Publishing billing cycle requires backend ledger confirmation.' });
  },
  async listResidentBills(context: ResidentRepositoryRequestContext) {
    return billRepository.list(context);
  },
  async payBillInMockMode(context: ResidentRepositoryRequestContext, params: ResidentBillPaymentInput) {
    return residentRepository.mockPayment(context, params);
  },
  async getReceiptById(id: string) {
    if (!id || typeof id !== 'string') {
      return repositoryFailure({ code: 'NOT_FOUND', message: 'Receipt record not found in ledger.' });
    }
    // 1. Check authoritative receipts in mockStore
    const receipts = (mockStore.getState().receipts ?? []) as Receipt[];
    const directReceipt = receipts.find(
      (r) => r.id === id || r.receiptNumber === id || r.paymentTransactionId === id
    );
    if (directReceipt) {
      return repositorySuccess({
        id: directReceipt.id,
        receiptNumber: directReceipt.receiptNumber,
        paymentTransactionId: directReceipt.paymentTransactionId,
        invoiceId: directReceipt.invoiceId,
        unitId: directReceipt.unitId,
        payerName: directReceipt.payerName,
        amount: directReceipt.amount,
        currency: directReceipt.currency,
        paymentMode: directReceipt.paymentMode,
        paymentDate: directReceipt.paymentDate,
        paymentReference: directReceipt.paymentReference,
        status: directReceipt.status,
        generatedAt: directReceipt.generatedAt,
      });
    }

    // 2. Check recorded payments on bills
    const bills = mockStore.getState().bills ?? [];
    for (const b of bills) {
      const matchPayment = (b.payments ?? []).find(
        (p) => p.receiptNumber === id || p.transactionId === id || p.id === id
      );
      if (matchPayment && matchPayment.receiptNumber) {
        return repositorySuccess({
          id: matchPayment.receiptNumber,
          receiptNumber: matchPayment.receiptNumber,
          paymentTransactionId: matchPayment.transactionId ?? '',
          invoiceId: b.id,
          unitId: b.unitId,
          payerName: 'Resident',
          amount: matchPayment.amountPaid,
          currency: 'INR',
          paymentMode: matchPayment.paymentMethod,
          paymentDate: matchPayment.paymentDate,
          paymentReference: matchPayment.transactionId ?? '',
          status: 'GENERATED',
          generatedAt: matchPayment.paymentDate,
        });
      }
      if (b.receiptNumber === id) {
        return repositorySuccess({
          id: b.receiptNumber,
          receiptNumber: b.receiptNumber,
          paymentTransactionId: b.transactionId ?? '',
          invoiceId: b.id,
          unitId: b.unitId,
          payerName: 'Resident',
          amount: b.paidAmount ?? b.amount,
          currency: 'INR',
          paymentMode: 'UPI',
          paymentDate: b.paidDate ?? new Date().toISOString(),
          paymentReference: b.transactionId ?? '',
          status: 'GENERATED',
          generatedAt: b.paidDate ?? new Date().toISOString(),
        });
      }
    }

    // Fail closed: Never manufacture synthetic REC-* without an authoritative record
    return repositoryFailure({ code: 'NOT_FOUND', message: 'Receipt record not found in ledger.' });
  },
  async getFlatLedger(context: ResidentRepositoryRequestContext) {
    return residentRepository.getLedgerEntriesPage(context, { cursor: null, pageSize: 50 });
  },
  async listDefaulters(_params?: BillingListInput) {
    return repositorySuccess([]);
  },
  async recordManualPayment(_params?: ManualPaymentInput) {
    return repositoryFailure({ code: 'UNSUPPORTED_OPERATION', message: 'Manual payment recording requires backend reconciliation.' });
  },
  async createBillingCorrectionRequest(_params?: BillingCorrectionInput) {
    return repositoryFailure({ code: 'UNSUPPORTED_OPERATION', message: 'Billing correction requires committee treasurer approval.' });
  },
};

export type ResidentBillingRepositoryContract = ResidentBillingRepository;
export const BillingRepository = billRepository;

export function mergeUniqueBills(current: readonly Bill[], incoming: readonly Bill[]): Bill[] {
  const seen = new Set<string>();
  return [...current, ...incoming].filter((bill) => {
    if (seen.has(bill.id)) return false;
    seen.add(bill.id);
    return true;
  });
}
