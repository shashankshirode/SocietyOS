import type { RepositoryResult } from '../../../../core/repositories/repository.types';
import type { PaymentMethod } from '../../../../shared/types/bill.types';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import type { MockPaymentConfirmation } from './bill.dto';
import type { ResidentBillDetail, ResidentBillListPage, ResidentBillListPageRequest, ResidentBillingSummary, ResidentLedgerPage, ResidentLedgerPageRequest, } from './residentBilling.types';
import type { Absent } from "../../../../shared/types/absence.types";
export type ResidentMockPaymentInput = {
    billId: string;
    amount: number;
    paymentMethod: PaymentMethod;
};
export type ResidentBillingRepository = {
    getBillSummary: (context: ResidentRepositoryRequestContext) => Promise<RepositoryResult<ResidentBillingSummary>>;
    getBillsPage: (context: ResidentRepositoryRequestContext, request: ResidentBillListPageRequest) => Promise<RepositoryResult<ResidentBillListPage>>;
    getBillDetail: (context: ResidentRepositoryRequestContext, billId: string) => Promise<RepositoryResult<ResidentBillDetail | Absent>>;
    getLedgerEntriesPage: (context: ResidentRepositoryRequestContext, request: ResidentLedgerPageRequest) => Promise<RepositoryResult<ResidentLedgerPage>>;
    mockPayment: (context: ResidentRepositoryRequestContext, input: ResidentMockPaymentInput) => Promise<RepositoryResult<MockPaymentConfirmation>>;
};

