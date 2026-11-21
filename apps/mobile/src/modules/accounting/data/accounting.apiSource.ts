import { repositorySuccess, type RepositoryResult } from '../../../core/repositories/repository.types';
import type {
  TreasurerDashboardData,
  ChargeHead,
  BillingCycle,
  DraftBill,
  ManualPaymentRecord,
  Defaulter,
  GenerateBillsInput,
  ManualPaymentInput,
} from '../../../shared/types/accounting.types';
import type { FlatLedger } from '../../../shared/types/ledger.types';
import { apiClient } from '../../../core/api/apiClient';
import { apiEndpoints } from '../../../core/api/apiEndpoints';
import { accountingMappers } from './accounting.mapper';
import type {
  TreasurerDashboardDTO,
  ChargeHeadDTO,
  BillingCycleDTO,
  DraftBillDTO,
  ManualPaymentDTO,
  DefaulterDTO,
} from './accounting.dto';

export const accountingApiSource = {
  async getDashboard(): Promise<RepositoryResult<TreasurerDashboardData>> {
    const dto = await apiClient.get<TreasurerDashboardDTO>(apiEndpoints.accounting.dashboard);
    
    const dashboardData: TreasurerDashboardData = {
      totalBilledThisMonth: dto.total_billed_this_month,
      totalCollectedThisMonth: dto.total_collected_this_month,
      outstandingDues: dto.outstanding_dues,
      collectionEfficiency: dto.collection_efficiency,
      defaulterCount: dto.defaulter_count,
      pendingManualEntries: dto.pending_manual_entries,
      failedPaymentsPlaceholder: dto.failed_payments,
      reconciliationPending: dto.reconciliation_pending,
      adjustmentsThisMonth: dto.adjustments_this_month,
      advanceExcessPayments: dto.advance_excess_payments,
      billingCycleStatus: null,
      recentCollections: [],
      topDefaulters: [],
      lastUpdatedAt: dto.last_updated_at,
    };
    return repositorySuccess(dashboardData);
  },

  async getChargeHeads(): Promise<RepositoryResult<ChargeHead[]>> {
    const dtos = await apiClient.get<ChargeHeadDTO[]>(apiEndpoints.accounting.chargeHeads);
    return repositorySuccess(dtos.map(accountingMappers.toChargeHead));
  },

  async getBillingCycles(): Promise<RepositoryResult<BillingCycle[]>> {
    const dtos = await apiClient.get<BillingCycleDTO[]>(apiEndpoints.accounting.billingCycles);
    return repositorySuccess(dtos.map(accountingMappers.toBillingCycle));
  },

  async generateBills(input: GenerateBillsInput): Promise<RepositoryResult<{ success: boolean; billingCycle: BillingCycle }>> {
    const inputDto = {
      billing_cycle_month: input.billingCycleMonth,
      billing_period_start: input.billingPeriodStart,
      billing_period_end: input.billingPeriodEnd,
      due_date: input.dueDate,
      applicable_towers: input.applicableTowers,
      charge_head_ids: input.chargeHeadIds,
      include_parking_charges: input.includeParkingCharges,
      include_penalties: input.includePenalties,
      include_previous_dues: input.includePreviousDues,
      notes: input.notes,
    };
    const responseDto = await apiClient.post<BillingCycleDTO>(apiEndpoints.accounting.billingCycles, inputDto);
    return repositorySuccess({ success: true, billingCycle: accountingMappers.toBillingCycle(responseDto) });
  },

  async getDraftBills(cycleId: string): Promise<RepositoryResult<DraftBill[]>> {
    const dtos = await apiClient.get<DraftBillDTO[]>(apiEndpoints.accounting.draftBills(cycleId));
    return repositorySuccess(dtos.map(accountingMappers.toDraftBill));
  },

  async publishBills(cycleId: string): Promise<RepositoryResult<{ success: boolean }>> {
    await apiClient.post(apiEndpoints.accounting.publishBills(cycleId), {});
    return repositorySuccess({ success: true });
  },

  async getFlatLedger(unitId: string): Promise<RepositoryResult<FlatLedger>> {
    const ledger = await apiClient.get<FlatLedger>(apiEndpoints.accounting.flatLedger(unitId));
    return repositorySuccess(ledger);
  },

  async recordManualPayment(input: ManualPaymentInput): Promise<RepositoryResult<ManualPaymentRecord>> {
    const inputDto = {
      unit_id: input.unitId,
      amount: input.amount,
      payment_mode: input.paymentMode,
      payment_date: input.paymentDate,
      reference_number: input.referenceNumber,
      bank_name: input.bankName,
      cheque_number: input.chequeNumber,
      notes: input.notes,
    };
    const dto = await apiClient.post<ManualPaymentDTO>(apiEndpoints.accounting.manualPaymentEntry, inputDto);
    return repositorySuccess(accountingMappers.toPayment(dto));
  },

  async getDefaulters(): Promise<RepositoryResult<Defaulter[]>> {
    const dtos = await apiClient.get<DefaulterDTO[]>(apiEndpoints.accounting.defaulters);
    return repositorySuccess(dtos.map(accountingMappers.toDefaulter));
  },
};
