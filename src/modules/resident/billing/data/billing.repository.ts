import { createRepository } from '../../../../core/dataSource/repositoryFactory';
import { repositorySuccess } from '../../../../core/repositories/repository.types';
import type { Bill, PaymentMethod } from '../../../../shared/types/bill.types';
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
    return repositorySuccess({ id: 'cycle-preview-123', status: 'DRAFT' });
  },
  async listDraftBills(_params?: BillingListInput) {
    return repositorySuccess([]);
  },
  async publishBillingCycle(_params?: PublishBillingCycleInput) {
    return repositorySuccess({ publishedCount: 15 });
  },
  async listResidentBills(context: ResidentRepositoryRequestContext) {
    return billRepository.list(context);
  },
  async payBillInMockMode(context: ResidentRepositoryRequestContext, params: ResidentBillPaymentInput) {
    return residentRepository.mockPayment(context, params);
  },
  async getReceiptById(id: string) {
    return repositorySuccess({ id, receiptNumber: `REC-${id}` });
  },
  async getFlatLedger(context: ResidentRepositoryRequestContext) {
    return residentRepository.getLedgerEntriesPage(context, { cursor: null, pageSize: 50 });
  },
  async listDefaulters(_params?: BillingListInput) {
    return repositorySuccess([]);
  },
  async recordManualPayment(_params?: ManualPaymentInput) {
    return repositorySuccess({ ok: true });
  },
  async createBillingCorrectionRequest(_params?: BillingCorrectionInput) {
    return repositorySuccess({ ok: true });
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
